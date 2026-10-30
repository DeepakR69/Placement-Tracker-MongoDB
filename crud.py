"""CRUD operations + the business rule for applying to a drive."""
from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError, WriteError


# ---------- CREATE ----------
def add_student(db, roll_no, name, email, branch, cgpa, backlogs=0, skills=None):
    doc = {"roll_no": roll_no, "name": name, "email": email, "branch": branch,
           "cgpa": cgpa, "backlogs": backlogs, "skills": skills or [], "placed": False}
    return db.students.insert_one(doc).inserted_id          # insert_one


def add_drive(db, company_name, role, ctc_lpa, min_cgpa, max_backlogs, drive_date):
    company = db.companies.find_one({"name": company_name})
    if not company:
        raise ValueError(f"Unknown company: {company_name}")
    return db.drives.insert_one({
        "company_id": company["_id"], "role": role, "ctc_lpa": ctc_lpa,
        "min_cgpa": min_cgpa, "max_backlogs": max_backlogs,
        "drive_date": drive_date, "status": "open"}).inserted_id


def apply_to_drive(db, roll_no, drive_id):
    """Eligibility check (CGPA, backlogs, drive open) then insert application."""
    student = db.students.find_one({"roll_no": roll_no})
    drive = db.drives.find_one({"_id": ObjectId(drive_id)})
    if not student or not drive:
        return "Student or drive not found"
    if drive["status"] != "open":
        return "Drive is closed"
    if student["cgpa"] < drive["min_cgpa"]:
        return f"Not eligible: CGPA {student['cgpa']} < {drive['min_cgpa']}"
    if student["backlogs"] > drive["max_backlogs"]:
        return "Not eligible: too many backlogs"
    try:
        db.applications.insert_one({
            "student_id": student["_id"], "drive_id": drive["_id"],
            "applied_on": datetime.now(), "status": "applied", "rounds": []})
    except DuplicateKeyError:
        return "Already applied to this drive"
    return "Application submitted"


# ---------- READ ----------
def find_students(db, query=None, projection=None, sort=None, limit=0):
    cur = db.students.find(query or {}, projection or {"_id": 0})   # find
    if sort:
        cur = cur.sort(sort)
    return list(cur.limit(limit))


# ---------- UPDATE ----------
def update_cgpa(db, roll_no, new_cgpa):
    return db.students.update_one({"roll_no": roll_no}, {"$set": {"cgpa": new_cgpa}}).modified_count


def add_skill(db, roll_no, skill):
    # $addToSet avoids duplicate skills in the array
    return db.students.update_one({"roll_no": roll_no}, {"$addToSet": {"skills": skill}}).modified_count


def add_round_result(db, student_id, drive_id, round_name, result):
    return db.applications.update_one(
        {"student_id": student_id, "drive_id": drive_id},
        {"$push": {"rounds": {"name": round_name, "result": result}}}).modified_count


def set_application_status(db, student_id, drive_id, status):
    res = db.applications.update_one({"student_id": student_id, "drive_id": drive_id},
                                     {"$set": {"status": status}})
    if status == "selected" and res.modified_count:
        db.students.update_one({"_id": student_id}, {"$set": {"placed": True}})
    return res.modified_count


def close_past_drives(db, before):
    return db.drives.update_many({"drive_date": {"$lt": before}, "status": "open"},
                                 {"$set": {"status": "closed"}}).modified_count  # update_many


# ---------- DELETE ----------
def delete_student(db, roll_no):
    s = db.students.find_one({"roll_no": roll_no})
    if not s:
        return 0
    db.applications.delete_many({"student_id": s["_id"]})            # delete_many (cascade)
    return db.students.delete_one({"_id": s["_id"]}).deleted_count   # delete_one


def purge_withdrawn(db):
    return db.applications.delete_many({"status": "withdrawn"}).deleted_count


def try_invalid_insert(db):
    """Demonstrates validation: this must be rejected by MongoDB."""
    try:
        db.students.insert_one({"roll_no": "abc", "name": "X", "email": "bad",
                                "branch": "ARTS", "cgpa": 11, "backlogs": -1,
                                "skills": [], "placed": False})
        return "ERROR: invalid document was accepted"
    except WriteError as e:
        return f"Rejected by validator (code {e.code}): Document failed validation"
