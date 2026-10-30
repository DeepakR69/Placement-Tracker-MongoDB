// Equivalent mongosh queries (run: mongosh placement_tracker < queries.js)
db.students.find({ branch: "CSE", cgpa: { $gte: 9 } }, { _id: 0, name: 1, cgpa: 1 }).sort({ cgpa: -1 }).limit(3)
db.students.updateOne({ roll_no: "12300001" }, { $addToSet: { skills: "Docker" } })
db.drives.updateMany({ drive_date: { $lt: new Date() }, status: "open" }, { $set: { status: "closed" } })
db.applications.deleteMany({ status: "withdrawn" })
db.students.aggregate([
  { $group: { _id: "$branch", total: { $sum: 1 }, placed: { $sum: { $cond: ["$placed", 1, 0] } } } },
  { $project: { total: 1, placed: 1, pct: { $round: [{ $multiply: [{ $divide: ["$placed", "$total"] }, 100] }, 1] } } }
])
