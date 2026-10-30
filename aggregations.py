"""Aggregation pipelines. Each returns a list of result docs."""

_JOIN_DRIVE_COMPANY = [
    {"$lookup": {"from": "drives", "localField": "drive_id", "foreignField": "_id", "as": "drive"}},
    {"$unwind": "$drive"},
    {"$lookup": {"from": "companies", "localField": "drive.company_id", "foreignField": "_id", "as": "company"}},
    {"$unwind": "$company"},
]


def company_funnel(db):
    """Applications / shortlisted / selected per company, with selection rate."""
    return list(db.applications.aggregate(_JOIN_DRIVE_COMPANY + [
        {"$group": {"_id": "$company.name",
                    "applications": {"$sum": 1},
                    "shortlisted": {"$sum": {"$cond": [{"$in": ["$status", ["shortlisted", "selected"]]}, 1, 0]}},
                    "selected": {"$sum": {"$cond": [{"$eq": ["$status", "selected"]}, 1, 0]}}}},
        {"$addFields": {"selection_rate_pct": {"$round": [
            {"$multiply": [{"$divide": ["$selected", "$applications"]}, 100]}, 1]}}},
        {"$sort": {"applications": -1}},
    ]))


def branch_placement_rate(db):
    return list(db.students.aggregate([
        {"$group": {"_id": "$branch", "total": {"$sum": 1},
                    "placed": {"$sum": {"$cond": ["$placed", 1, 0]}},
                    "avg_cgpa": {"$avg": "$cgpa"}}},
        {"$project": {"total": 1, "placed": 1, "avg_cgpa": {"$round": ["$avg_cgpa", 2]},
                      "placement_pct": {"$round": [{"$multiply": [{"$divide": ["$placed", "$total"]}, 100]}, 1]}}},
        {"$sort": {"placement_pct": -1}},
    ]))


def package_by_company_type(db):
    """Service vs product: average/max/min CTC among selected candidates."""
    return list(db.applications.aggregate([{"$match": {"status": "selected"}}] + _JOIN_DRIVE_COMPANY + [
        {"$group": {"_id": "$company.type", "offers": {"$sum": 1},
                    "avg_ctc": {"$avg": "$drive.ctc_lpa"},
                    "max_ctc": {"$max": "$drive.ctc_lpa"},
                    "min_ctc": {"$min": "$drive.ctc_lpa"}}},
        {"$project": {"offers": 1, "max_ctc": 1, "min_ctc": 1, "avg_ctc": {"$round": ["$avg_ctc", 2]}}},
    ]))


def top_skills_of_placed(db, n=5):
    return list(db.students.aggregate([
        {"$match": {"placed": True}},
        {"$unwind": "$skills"},
        {"$group": {"_id": "$skills", "placed_students": {"$sum": 1}}},
        {"$sort": {"placed_students": -1, "_id": 1}},
        {"$limit": n},
    ]))


def cgpa_bands(db):
    return list(db.students.aggregate([
        {"$bucket": {"groupBy": "$cgpa", "boundaries": [0, 6, 7, 8, 9, 10.01], "default": "other",
                     "output": {"students": {"$sum": 1},
                                "placed": {"$sum": {"$cond": ["$placed", 1, 0]}}}}},
    ]))


def eligible_count_per_drive(db):
    """$lookup with a sub-pipeline: how many students meet each drive's criteria."""
    return list(db.drives.aggregate([
        {"$lookup": {"from": "students",
                     "let": {"mc": "$min_cgpa", "mb": "$max_backlogs"},
                     "pipeline": [{"$match": {"$expr": {"$and": [
                         {"$gte": ["$cgpa", "$$mc"]}, {"$lte": ["$backlogs", "$$mb"]}]}}},
                         {"$count": "n"}],
                     "as": "elig"}},
        {"$lookup": {"from": "companies", "localField": "company_id", "foreignField": "_id", "as": "c"}},
        {"$unwind": "$c"},
        {"$project": {"_id": 0, "company": "$c.name", "role": 1, "min_cgpa": 1,
                      "eligible_students": {"$ifNull": [{"$arrayElemAt": ["$elig.n", 0]}, 0]}}},
        {"$sort": {"eligible_students": -1}},
    ]))
