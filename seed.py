"""Fills the database with a reproducible synthetic dataset."""
import random
from datetime import datetime, timedelta
from crud import apply_to_drive

FIRST = ["Aarav", "Riya", "Kabir", "Sneha", "Rohan", "Ananya", "Vikram", "Pooja", "Aditya", "Neha",
         "Karan", "Isha", "Manish", "Divya", "Arjun", "Simran", "Harsh", "Meera", "Yash", "Tanvi"]
LAST = ["Sharma", "Verma", "Patel", "Singh", "Gupta", "Mishra", "Yadav", "Joshi", "Chouhan", "Rao"]
SKILLS = ["Python", "Java", "C++", "SQL", "MongoDB", "React", "Node.js", "DSA", "Machine Learning", "Docker"]
BRANCHES = ["CSE", "CSE", "CSE", "IT", "ECE", "ME", "CE"]

COMPANIES = [
    ("TCS", "service", "Mumbai"), ("Infosys", "service", "Bengaluru"), ("Wipro", "service", "Bengaluru"),
    ("Cognizant", "service", "Chennai"), ("Amazon", "product", "Hyderabad"),
    ("Adobe", "product", "Noida"), ("Zoho", "product", "Chennai"), ("Atlassian", "product", "Bengaluru"),
]
# company, role, CTC (LPA), min CGPA, max backlogs
DRIVES = [
    ("TCS", "Assistant System Engineer", 3.6, 6.0, 1), ("Infosys", "Systems Engineer", 3.6, 6.0, 0),
    ("Wipro", "Project Engineer", 3.5, 6.0, 1), ("Cognizant", "Programmer Analyst", 4.0, 6.5, 0),
    ("Amazon", "SDE-1", 28.0, 8.0, 0), ("Adobe", "Software Engineer", 22.0, 8.0, 0),
    ("Zoho", "Member Technical Staff", 8.0, 7.0, 0), ("Atlassian", "Associate SDE", 30.0, 8.5, 0),
]


def seed(db, n_students=80, rng_seed=42):
    rnd = random.Random(rng_seed)
    db.companies.insert_many([{"name": n, "type": t, "location": l} for n, t, l in COMPANIES])

    base = datetime(2026, 11, 1)
    for i, (c, role, ctc, cg, bl) in enumerate(DRIVES):
        comp = db.companies.find_one({"name": c})
        db.drives.insert_one({"company_id": comp["_id"], "role": role, "ctc_lpa": ctc,
                              "min_cgpa": cg, "max_backlogs": bl,
                              "drive_date": base + timedelta(days=7 * i), "status": "open"})

    students = []
    for i in range(n_students):
        name = f"{rnd.choice(FIRST)} {rnd.choice(LAST)}"
        students.append({
            "roll_no": f"{12300000 + i}", "name": name,
            "email": f"{name.split()[0].lower()}{i}@lpu-demo.in",
            "branch": rnd.choice(BRANCHES),
            "cgpa": round(min(10, max(5.0, rnd.gauss(7.4, 1.0))), 2),
            "backlogs": rnd.choices([0, 1, 2], weights=[80, 15, 5])[0],
            "skills": rnd.sample(SKILLS, rnd.randint(2, 5)), "placed": False})
    db.students.insert_many(students)

    # applications: each student applies to a few drives (eligibility enforced by apply_to_drive)
    drives = list(db.drives.find())
    for s in db.students.find():
        for d in rnd.sample(drives, rnd.randint(2, 4)):
            apply_to_drive(db, s["roll_no"], d["_id"])

    # simulate hiring outcomes (a student can accept only one offer)
    for a in db.applications.find():
        r = rnd.random()
        status = "rejected" if r < 0.45 else "shortlisted" if r < 0.75 else "selected"
        stu = db.students.find_one({"_id": a["student_id"]})
        if status == "selected" and stu["placed"]:
            status = "rejected"
        rounds = [{"name": "Aptitude", "result": "pass" if status != "rejected" else "fail"}]
        if status in ("shortlisted", "selected"):
            rounds.append({"name": "Technical", "result": "pass" if status == "selected" else "pending"})
        db.applications.update_one({"_id": a["_id"]}, {"$set": {"status": status, "rounds": rounds}})
        if status == "selected":
            db.students.update_one({"_id": stu["_id"]}, {"$set": {"placed": True}})
