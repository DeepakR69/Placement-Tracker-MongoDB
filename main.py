"""Placement Tracker - entry point.
   python main.py demo   -> runs everything non-interactively (use for screenshots)
   python main.py        -> interactive menu
"""
import sys, json
from datetime import datetime
from db import get_db, setup_collections
from seed import seed
import crud, aggregations as agg


def show(title, data):
    print(f"\n=== {title} ===")
    print(json.dumps(data, indent=2, default=str) if not isinstance(data, str) else data)


def reset(db):
    setup_collections(db, reset=True)
    seed(db)
    print({c: db[c].count_documents({}) for c in ("students", "companies", "drives", "applications")})


def demo(db):
    reset(db)
    show("VALIDATION: invalid insert", crud.try_invalid_insert(db))

    show("CREATE student", str(crud.add_student(db, "12399999", "Deepak Demo", "deepak.demo@lpu-demo.in",
                                                 "CSE", 8.4, 0, ["Python", "MongoDB", "DSA"])))
    d = db.drives.find_one({"role": "SDE-1"})
    show("CREATE application (eligible)", crud.apply_to_drive(db, "12399999", d["_id"]))
    show("CREATE application (duplicate)", crud.apply_to_drive(db, "12399999", d["_id"]))

    show("READ  CSE students, CGPA>=9, top 3",
         crud.find_students(db, {"branch": "CSE", "cgpa": {"$gte": 9}},
                            {"_id": 0, "name": 1, "cgpa": 1, "skills": 1}, [("cgpa", -1)], 3))
    show("UPDATE cgpa", crud.update_cgpa(db, "12399999", 8.6))
    show("UPDATE add skill ($addToSet)", crud.add_skill(db, "12399999", "Docker"))
    s = db.students.find_one({"roll_no": "12399999"})
    show("UPDATE push round result", crud.add_round_result(db, s["_id"], d["_id"], "Online Assessment", "pass"))
    show("UPDATE status -> selected (also marks placed)", crud.set_application_status(db, s["_id"], d["_id"], "selected"))
    show("DELETE student (+ cascade applications)", crud.delete_student(db, "12399999"))

    show("AGG 1: company funnel", agg.company_funnel(db))
    show("AGG 2: branch placement rate", agg.branch_placement_rate(db))
    show("AGG 3: package by company type", agg.package_by_company_type(db))
    show("AGG 4: top skills among placed", agg.top_skills_of_placed(db))
    show("AGG 5: CGPA bands ($bucket)", agg.cgpa_bands(db))
    show("AGG 6: eligible students per drive", agg.eligible_count_per_drive(db))


MENU = """
1 Reset + seed data      6 Branch placement rate
2 Add student            7 Package by company type
3 Apply to a drive       8 Top skills of placed
4 Search students        9 CGPA bands
5 Company funnel        10 Eligible per drive
11 Validation demo       0 Exit
"""

def interactive(db):
    while True:
        print(MENU)
        c = input("Choice: ").strip()
        try:
            if c == "1": reset(db)
            elif c == "2":
                show("Result", str(crud.add_student(db, input("Roll (8 digits): "), input("Name: "), input("Email: "),
                      input("Branch (CSE/ECE/ME/CE/IT): "), float(input("CGPA: ")), int(input("Backlogs: ")),
                      [x.strip() for x in input("Skills (comma separated): ").split(",") if x.strip()])))
            elif c == "3":
                for i, dr in enumerate(db.drives.find()):
                    comp = db.companies.find_one({"_id": dr["company_id"]})
                    print(i, comp["name"], dr["role"], dr["ctc_lpa"], "LPA", "min CGPA", dr["min_cgpa"])
                ds = list(db.drives.find())
                show("Result", crud.apply_to_drive(db, input("Roll no: "), ds[int(input("Drive #: "))]["_id"]))
            elif c == "4":
                show("Students", crud.find_students(db, {"cgpa": {"$gte": float(input("Min CGPA: "))}},
                     {"_id": 0, "roll_no": 1, "name": 1, "branch": 1, "cgpa": 1}, [("cgpa", -1)], 15))
            elif c == "5": show("Company funnel", agg.company_funnel(db))
            elif c == "6": show("Branch placement", agg.branch_placement_rate(db))
            elif c == "7": show("Package by type", agg.package_by_company_type(db))
            elif c == "8": show("Top skills", agg.top_skills_of_placed(db))
            elif c == "9": show("CGPA bands", agg.cgpa_bands(db))
            elif c == "10": show("Eligible per drive", agg.eligible_count_per_drive(db))
            elif c == "11": show("Validation", crud.try_invalid_insert(db))
            elif c == "0": break
        except Exception as e:  # keep the menu alive on bad input / validation errors
            print("Error:", e)


if __name__ == "__main__":
    database = get_db()
    demo(database) if len(sys.argv) > 1 and sys.argv[1] == "demo" else interactive(database)
