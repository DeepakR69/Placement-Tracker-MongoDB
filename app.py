"""FastAPI application for Placement Tracker.
Provides RESTful APIs and serves the React frontend.
"""
import os
from datetime import datetime, date
from typing import List, Optional, Literal, Any, Dict
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError, WriteError

from db import get_db, setup_collections
from seed import seed
import crud
import aggregations as agg

app = FastAPI(
    title="Placement Tracker API",
    description="Placement Management System powered by FastAPI, React, and MongoDB",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_doc(doc: Any) -> Any:
    """Recursively converts MongoDB BSON objects (ObjectId, datetime) to JSON serializable formats."""
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if k == "_id":
                res["id"] = str(v)
            elif isinstance(v, ObjectId):
                res[k] = str(v)
            elif isinstance(v, (datetime, date)):
                res[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                res[k] = serialize_doc(v)
            else:
                res[k] = v
        return res
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, (datetime, date)):
        return doc.isoformat()
    return doc


# ---------- Pydantic Schemas ----------
class StudentCreate(BaseModel):
    roll_no: str = Field(..., pattern=r"^[0-9]{8}$", description="8-digit registration number")
    name: str = Field(..., min_length=2)
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    branch: Literal["CSE", "ECE", "ME", "CE", "IT"]
    cgpa: float = Field(..., ge=0, le=10)
    backlogs: int = Field(default=0, ge=0)
    skills: List[str] = Field(default_factory=list)


class StudentUpdateCGPA(BaseModel):
    cgpa: float = Field(..., ge=0, le=10)


class StudentAddSkill(BaseModel):
    skill: str = Field(..., min_length=1)


class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=2)
    type: Literal["service", "product"]
    location: str = Field(..., min_length=2)


class DriveCreate(BaseModel):
    company_name: str
    role: str = Field(..., min_length=2)
    ctc_lpa: float = Field(..., ge=1, le=200)
    min_cgpa: float = Field(..., ge=0, le=10)
    max_backlogs: int = Field(..., ge=0)
    drive_date: datetime


class DriveStatusUpdate(BaseModel):
    status: Literal["open", "closed"]


class ApplicationApply(BaseModel):
    roll_no: str
    drive_id: str


class ApplicationStatusUpdate(BaseModel):
    status: Literal["applied", "shortlisted", "selected", "rejected", "withdrawn"]


class ApplicationRoundAdd(BaseModel):
    name: str
    result: Literal["pass", "fail", "pending"]


# ---------- Analytics & Overview ----------
@app.get("/api/overview")
def get_overview():
    db = get_db()
    total_students = db.students.count_documents({})
    placed_students = db.students.count_documents({"placed": True})
    unplaced_students = total_students - placed_students
    placement_rate = round((placed_students / total_students * 100), 1) if total_students else 0.0

    total_companies = db.companies.count_documents({})
    product_companies = db.companies.count_documents({"type": "product"})
    service_companies = db.companies.count_documents({"type": "service"})

    total_drives = db.drives.count_documents({})
    open_drives = db.drives.count_documents({"status": "open"})

    total_applications = db.applications.count_documents({})
    selected_apps = db.applications.count_documents({"status": "selected"})
    shortlisted_apps = db.applications.count_documents({"status": "shortlisted"})
    rejected_apps = db.applications.count_documents({"status": "rejected"})
    withdrawn_apps = db.applications.count_documents({"status": "withdrawn"})

    # Average package for selected students
    pkg_agg = list(db.applications.aggregate([
        {"$match": {"status": "selected"}},
        {"$lookup": {"from": "drives", "localField": "drive_id", "foreignField": "_id", "as": "drive"}},
        {"$unwind": "$drive"},
        {"$group": {
            "_id": None,
            "avg_ctc": {"$avg": "$drive.ctc_lpa"},
            "max_ctc": {"$max": "$drive.ctc_lpa"},
            "min_ctc": {"$min": "$drive.ctc_lpa"},
        }}
    ]))

    avg_ctc = round(pkg_agg[0]["avg_ctc"], 2) if pkg_agg else 0.0
    max_ctc = round(pkg_agg[0]["max_ctc"], 2) if pkg_agg else 0.0

    return {
        "students": {
            "total": total_students,
            "placed": placed_students,
            "unplaced": unplaced_students,
            "placement_rate": placement_rate,
        },
        "companies": {
            "total": total_companies,
            "product": product_companies,
            "service": service_companies,
        },
        "drives": {
            "total": total_drives,
            "open": open_drives,
            "closed": total_drives - open_drives,
        },
        "applications": {
            "total": total_applications,
            "selected": selected_apps,
            "shortlisted": shortlisted_apps,
            "rejected": rejected_apps,
            "withdrawn": withdrawn_apps,
        },
        "compensation": {
            "avg_ctc_lpa": avg_ctc,
            "max_ctc_lpa": max_ctc,
        }
    }


@app.get("/api/aggregations/company-funnel")
def get_company_funnel():
    db = get_db()
    return serialize_doc(agg.company_funnel(db))


@app.get("/api/aggregations/branch-placement")
def get_branch_placement():
    db = get_db()
    return serialize_doc(agg.branch_placement_rate(db))


@app.get("/api/aggregations/package-by-type")
def get_package_by_type():
    db = get_db()
    return serialize_doc(agg.package_by_company_type(db))


@app.get("/api/aggregations/top-skills")
def get_top_skills(n: int = Query(default=10, ge=1, le=50)):
    db = get_db()
    return serialize_doc(agg.top_skills_of_placed(db, n=n))


@app.get("/api/aggregations/cgpa-bands")
def get_cgpa_bands():
    db = get_db()
    return serialize_doc(agg.cgpa_bands(db))


@app.get("/api/aggregations/eligible-per-drive")
def get_eligible_per_drive():
    db = get_db()
    return serialize_doc(agg.eligible_count_per_drive(db))


# ---------- Students API ----------
@app.get("/api/students")
def list_students(
    search: Optional[str] = None,
    branch: Optional[str] = None,
    placed: Optional[bool] = None,
    min_cgpa: Optional[float] = None,
    sort_by: str = "roll_no",
    sort_order: str = "asc",
    skip: int = 0,
    limit: int = 100,
):
    db = get_db()
    query: Dict[str, Any] = {}

    if search:
        s = search.strip()
        query["$or"] = [
            {"roll_no": {"$regex": s, "$options": "i"}},
            {"name": {"$regex": s, "$options": "i"}},
            {"email": {"$regex": s, "$options": "i"}},
            {"skills": {"$regex": s, "$options": "i"}},
        ]
    if branch:
        query["branch"] = branch
    if placed is not None:
        query["placed"] = placed
    if min_cgpa is not None:
        query["cgpa"] = {"$gte": min_cgpa}

    direction = 1 if sort_order.lower() == "asc" else -1
    sort_field = sort_by if sort_by in ["roll_no", "name", "cgpa", "backlogs", "branch"] else "roll_no"

    total = db.students.count_documents(query)
    cursor = db.students.find(query).sort(sort_field, direction).skip(skip).limit(limit)
    students = list(cursor)

    return {
        "total": total,
        "students": serialize_doc(students),
    }


@app.get("/api/students/{roll_no}")
def get_student_details(roll_no: str):
    db = get_db()
    student = db.students.find_one({"roll_no": roll_no})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Fetch all applications for this student with drive details
    pipeline = [
        {"$match": {"student_id": student["_id"]}},
        {"$lookup": {"from": "drives", "localField": "drive_id", "foreignField": "_id", "as": "drive"}},
        {"$unwind": "$drive"},
        {"$lookup": {"from": "companies", "localField": "drive.company_id", "foreignField": "_id", "as": "company"}},
        {"$unwind": "$company"},
        {"$sort": {"applied_on": -1}},
    ]
    apps = list(db.applications.aggregate(pipeline))

    res = serialize_doc(student)
    res["applications"] = serialize_doc(apps)
    return res


@app.post("/api/students", status_code=status.HTTP_201_CREATED)
def create_student(payload: StudentCreate):
    db = get_db()
    try:
        inserted_id = crud.add_student(
            db,
            roll_no=payload.roll_no,
            name=payload.name,
            email=payload.email,
            branch=payload.branch,
            cgpa=payload.cgpa,
            backlogs=payload.backlogs,
            skills=payload.skills,
        )
        return {"id": str(inserted_id), "message": "Student created successfully"}
    except DuplicateKeyError as e:
        field = "roll_no" if "roll_no" in str(e) else "email"
        raise HTTPException(status_code=400, detail=f"A student with this {field} already exists")
    except WriteError as e:
        raise HTTPException(status_code=400, detail=f"Database schema validation failed: {e.details.get('errmsg', str(e))}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.patch("/api/students/{roll_no}/cgpa")
def update_student_cgpa(roll_no: str, payload: StudentUpdateCGPA):
    db = get_db()
    student = db.students.find_one({"roll_no": roll_no})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    count = crud.update_cgpa(db, roll_no, payload.cgpa)
    return {"modified": count, "message": f"CGPA updated to {payload.cgpa}"}


@app.post("/api/students/{roll_no}/skills")
def add_student_skill(roll_no: str, payload: StudentAddSkill):
    db = get_db()
    student = db.students.find_one({"roll_no": roll_no})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    cleaned_skill = payload.skill.strip()
    if not cleaned_skill:
        raise HTTPException(status_code=400, detail="Skill name cannot be empty")

    count = crud.add_skill(db, roll_no, cleaned_skill)
    return {"modified": count, "message": f"Skill '{cleaned_skill}' added successfully"}


@app.delete("/api/students/{roll_no}")
def delete_student_record(roll_no: str):
    db = get_db()
    student = db.students.find_one({"roll_no": roll_no})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    deleted_count = crud.delete_student(db, roll_no)
    return {"deleted": deleted_count, "message": "Student and associated applications deleted"}


# ---------- Companies API ----------
@app.get("/api/companies")
def list_companies():
    db = get_db()
    companies = list(db.companies.find().sort("name", 1))
    return serialize_doc(companies)


@app.post("/api/companies", status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate):
    db = get_db()
    try:
        inserted_id = db.companies.insert_one(payload.model_dump()).inserted_id
        return {"id": str(inserted_id), "message": "Company registered successfully"}
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Company with this name already exists")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Drives API ----------
@app.get("/api/drives")
def list_drives(status_filter: Optional[str] = None):
    db = get_db()
    match_stage = {}
    if status_filter:
        match_stage["status"] = status_filter

    pipeline = [
        *( [{"$match": match_stage}] if match_stage else [] ),
        {"$lookup": {"from": "companies", "localField": "company_id", "foreignField": "_id", "as": "company"}},
        {"$unwind": "$company"},
        {"$lookup": {
            "from": "applications",
            "localField": "_id",
            "foreignField": "drive_id",
            "as": "applications"
        }},
        {"$addFields": {
            "applicant_count": {"$size": "$applications"},
            "selected_count": {
                "$size": {
                    "$filter": {
                        "input": "$applications",
                        "as": "app",
                        "cond": {"$eq": ["$$app.status", "selected"]}
                    }
                }
            }
        }},
        {"$project": {"applications": 0}},
        {"$sort": {"drive_date": -1}},
    ]
    drives = list(db.drives.aggregate(pipeline))
    return serialize_doc(drives)


@app.post("/api/drives", status_code=status.HTTP_201_CREATED)
def create_drive(payload: DriveCreate):
    db = get_db()
    try:
        inserted_id = crud.add_drive(
            db,
            company_name=payload.company_name,
            role=payload.role,
            ctc_lpa=payload.ctc_lpa,
            min_cgpa=payload.min_cgpa,
            max_backlogs=payload.max_backlogs,
            drive_date=payload.drive_date,
        )
        return {"id": str(inserted_id), "message": "Placement drive created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except WriteError as e:
        raise HTTPException(status_code=400, detail=f"Validation failed: {e.details.get('errmsg', str(e))}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.patch("/api/drives/{drive_id}/status")
def update_drive_status(drive_id: str, payload: DriveStatusUpdate):
    db = get_db()
    try:
        oid = ObjectId(drive_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid drive ID format")

    res = db.drives.update_one({"_id": oid}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Drive not found")
    return {"message": f"Drive status updated to {payload.status}"}


# ---------- Applications API ----------
@app.get("/api/applications")
def list_applications(
    status: Optional[str] = None,
    drive_id: Optional[str] = None,
    roll_no: Optional[str] = None,
    limit: int = 150,
):
    db = get_db()
    match_query: Dict[str, Any] = {}
    if status:
        match_query["status"] = status
    if drive_id:
        try:
            match_query["drive_id"] = ObjectId(drive_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid drive ID")

    pipeline: List[Dict[str, Any]] = [
        *( [{"$match": match_query}] if match_query else [] ),
        {"$lookup": {"from": "students", "localField": "student_id", "foreignField": "_id", "as": "student"}},
        {"$unwind": "$student"},
        {"$lookup": {"from": "drives", "localField": "drive_id", "foreignField": "_id", "as": "drive"}},
        {"$unwind": "$drive"},
        {"$lookup": {"from": "companies", "localField": "drive.company_id", "foreignField": "_id", "as": "company"}},
        {"$unwind": "$company"},
    ]

    if roll_no:
        pipeline.append({"$match": {"student.roll_no": roll_no}})

    pipeline.extend([
        {"$sort": {"applied_on": -1}},
        {"$limit": limit},
    ])

    apps = list(db.applications.aggregate(pipeline))
    return serialize_doc(apps)


@app.post("/api/applications", status_code=status.HTTP_201_CREATED)
def apply_to_drive_endpoint(payload: ApplicationApply):
    db = get_db()
    msg = crud.apply_to_drive(db, payload.roll_no, payload.drive_id)
    if msg == "Application submitted":
        return {"success": True, "message": msg}
    else:
        # Return structured failure with status 400 for eligibility / duplicate issues
        raise HTTPException(status_code=400, detail=msg)


@app.patch("/api/applications/{app_id}/status")
def update_application_status_endpoint(app_id: str, payload: ApplicationStatusUpdate):
    db = get_db()
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid application ID")

    app_doc = db.applications.find_one({"_id": oid})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application not found")

    crud.set_application_status(db, app_doc["student_id"], app_doc["drive_id"], payload.status)
    return {"message": f"Application status updated to {payload.status}"}


@app.post("/api/applications/{app_id}/rounds")
def add_round_result_endpoint(app_id: str, payload: ApplicationRoundAdd):
    db = get_db()
    try:
        oid = ObjectId(app_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid application ID")

    app_doc = db.applications.find_one({"_id": oid})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application not found")

    crud.add_round_result(db, app_doc["student_id"], app_doc["drive_id"], payload.name, payload.result)
    return {"message": f"Round '{payload.name}' result '{payload.result}' recorded"}


# ---------- System & Schema Validation Actions ----------
@app.post("/api/system/reset-seed")
def reset_and_seed_data():
    db = get_db()
    setup_collections(db, reset=True)
    seed(db)
    counts = {c: db[c].count_documents({}) for c in ("students", "companies", "drives", "applications")}
    return {
        "success": True,
        "message": "Database reset and re-seeded with reproducible synthetic dataset.",
        "counts": counts,
    }


@app.get("/api/system/validation-demo")
def run_validation_demo():
    """Executes the invalid document insertion test and returns the MongoDB validator response."""
    db = get_db()
    result = crud.try_invalid_insert(db)
    return {
        "attempted_document": {
            "roll_no": "abc",
            "name": "X",
            "email": "bad",
            "branch": "ARTS",
            "cgpa": 11,
            "backlogs": -1,
            "skills": [],
            "placed": False,
        },
        "schema_validation_result": result,
    }


@app.post("/api/system/purge-withdrawn")
def purge_withdrawn_applications():
    db = get_db()
    count = crud.purge_withdrawn(db)
    return {"deleted_count": count, "message": f"Purged {count} withdrawn applications."}


@app.post("/api/system/close-past-drives")
def close_past_drives_endpoint():
    db = get_db()
    count = crud.close_past_drives(db, datetime.now())
    return {"closed_count": count, "message": f"Closed {count} past drives."}


# ---------- Static Frontend Serving ----------
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    @app.get("/{full_path:path}")
    def catch_all(full_path: str):
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)

