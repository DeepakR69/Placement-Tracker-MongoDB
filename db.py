"""Connection, schema validation (JSON Schema) and indexes."""
import os
from pymongo import MongoClient, ASCENDING
from pymongo.errors import CollectionInvalid

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "placement_tracker")

NUM = ["double", "int"]  # accept 8 and 8.5 for numeric fields

VALIDATORS = {
    "students": {"$jsonSchema": {
        "bsonType": "object",
        "required": ["roll_no", "name", "email", "branch", "cgpa", "backlogs", "skills", "placed"],
        "properties": {
            "roll_no": {"bsonType": "string", "pattern": "^[0-9]{8}$",
                        "description": "8-digit registration number"},
            "name": {"bsonType": "string", "minLength": 2},
            "email": {"bsonType": "string", "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"},
            "branch": {"enum": ["CSE", "ECE", "ME", "CE", "IT"]},
            "cgpa": {"bsonType": NUM, "minimum": 0, "maximum": 10},
            "backlogs": {"bsonType": "int", "minimum": 0},
            "skills": {"bsonType": "array", "items": {"bsonType": "string"}, "uniqueItems": True},
            "placed": {"bsonType": "bool"},
        }}},
    "companies": {"$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "type", "location"],
        "properties": {
            "name": {"bsonType": "string"},
            "type": {"enum": ["service", "product"]},
            "location": {"bsonType": "string"},
        }}},
    "drives": {"$jsonSchema": {
        "bsonType": "object",
        "required": ["company_id", "role", "ctc_lpa", "min_cgpa", "max_backlogs", "drive_date", "status"],
        "properties": {
            "company_id": {"bsonType": "objectId"},
            "role": {"bsonType": "string"},
            "ctc_lpa": {"bsonType": NUM, "minimum": 1, "maximum": 200},
            "min_cgpa": {"bsonType": NUM, "minimum": 0, "maximum": 10},
            "max_backlogs": {"bsonType": "int", "minimum": 0},
            "drive_date": {"bsonType": "date"},
            "status": {"enum": ["open", "closed"]},
        }}},
    "applications": {"$jsonSchema": {
        "bsonType": "object",
        "required": ["student_id", "drive_id", "applied_on", "status"],
        "properties": {
            "student_id": {"bsonType": "objectId"},
            "drive_id": {"bsonType": "objectId"},
            "applied_on": {"bsonType": "date"},
            "status": {"enum": ["applied", "shortlisted", "selected", "rejected", "withdrawn"]},
            "rounds": {"bsonType": "array", "items": {
                "bsonType": "object", "required": ["name", "result"],
                "properties": {"name": {"bsonType": "string"},
                               "result": {"enum": ["pass", "fail", "pending"]}}}},
        }}},
}


def get_db():
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    client.admin.command("ping")  # fail fast if mongod is not running
    return client[DB_NAME]


def setup_collections(db, reset=False):
    """Create collections with validators + indexes. reset=True drops everything first."""
    for name, validator in VALIDATORS.items():
        if reset:
            db.drop_collection(name)
        try:
            db.create_collection(name, validator=validator,
                                 validationLevel="strict", validationAction="error")
        except CollectionInvalid:  # already exists -> update its validator
            db.command("collMod", name, validator=validator,
                       validationLevel="strict", validationAction="error")

    db.students.create_index("roll_no", unique=True)
    db.students.create_index("email", unique=True)
    db.students.create_index([("branch", ASCENDING), ("cgpa", -1)])
    db.companies.create_index("name", unique=True)
    db.drives.create_index("company_id")
    # one application per student per drive
    db.applications.create_index([("student_id", 1), ("drive_id", 1)], unique=True)
    db.applications.create_index("status")
