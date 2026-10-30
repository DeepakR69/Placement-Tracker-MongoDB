import React, { useState, useEffect, useMemo } from 'react';

// --- SVG Icons (Professional, No Emojis) ---
const Icons = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"></rect>
      <rect x="14" y="3" width="7" height="5"></rect>
      <rect x="14" y="12" width="7" height="9"></rect>
      <rect x="3" y="16" width="7" height="5"></rect>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Briefcase: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
  Clipboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  ),
  Database: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

// --- Toast Notifications ---
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div style={{ flex: 1 }}>{t.message}</div>
          <button
            onClick={() => onDismiss(t.id)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <Icons.Close />
          </button>
        </div>
      ))}
    </div>
  );
}

// --- Main Application Component ---
function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadOverview = async () => {
    try {
      const res = await fetch("/api/overview");
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (err) {
      console.error("Failed to load overview data", err);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-icon">PT</div>
          <div>
            <div className="brand-title">Placement Tracker</div>
            <div className="brand-subtitle">Campus Recruitment Management System</div>
          </div>
        </div>
        <div className="header-actions">
          <span className="badge badge-success" style={{ gap: "6px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--success)" }}></span>
            MongoDB Connected
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              loadOverview();
              addToast("Dashboard refreshed", "info");
            }}
          >
            <Icons.Refresh />
            Refresh
          </button>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Icons.Dashboard /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <Icons.Users /> Students Directory
        </button>
        <button
          className={`tab-btn ${activeTab === "drives" ? "active" : ""}`}
          onClick={() => setActiveTab("drives")}
        >
          <Icons.Briefcase /> Placement Drives
        </button>
        <button
          className={`tab-btn ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          <Icons.Clipboard /> Applications Pipeline
        </button>
        <button
          className={`tab-btn ${activeTab === "system" ? "active" : ""}`}
          onClick={() => setActiveTab("system")}
        >
          <Icons.Database /> Database & Schema
        </button>
      </nav>

      {/* Content Area */}
      <main className="app-container">
        {activeTab === "overview" && <OverviewTab overview={overview} refreshOverview={loadOverview} />}
        {activeTab === "students" && <StudentsTab addToast={addToast} refreshOverview={loadOverview} />}
        {activeTab === "drives" && <DrivesTab addToast={addToast} refreshOverview={loadOverview} />}
        {activeTab === "applications" && <ApplicationsTab addToast={addToast} refreshOverview={loadOverview} />}
        {activeTab === "system" && <SystemTab addToast={addToast} refreshOverview={loadOverview} />}
      </main>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

// ==========================================
// 1. OVERVIEW TAB
// ==========================================
function OverviewTab({ overview, refreshOverview }) {
  const [funnel, setFunnel] = useState([]);
  const [branches, setBranches] = useState([]);
  const [packages, setPackages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [cgpaBands, setCgpaBands] = useState([]);
  const [eligibleCounts, setEligibleCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [fRes, bRes, pRes, sRes, cRes, eRes] = await Promise.all([
          fetch("/api/aggregations/company-funnel"),
          fetch("/api/aggregations/branch-placement"),
          fetch("/api/aggregations/package-by-type"),
          fetch("/api/aggregations/top-skills?n=8"),
          fetch("/api/aggregations/cgpa-bands"),
          fetch("/api/aggregations/eligible-per-drive"),
        ]);
        if (fRes.ok) setFunnel(await fRes.json());
        if (bRes.ok) setBranches(await bRes.json());
        if (pRes.ok) setPackages(await pRes.json());
        if (sRes.ok) setSkills(await sRes.json());
        if (cRes.ok) setCgpaBands(await cRes.json());
        if (eRes.ok) setEligibleCounts(await eRes.json());
      } catch (e) {
        console.error("Error fetching analytics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (!overview) {
    return <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Loading metrics...</div>;
  }

  const { students, compensation, drives, applications } = overview;

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title">Placement Rate</div>
          <div className="card-value">{students.placement_rate}%</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${students.placement_rate}%` }}></div>
          </div>
          <div className="card-subtext">
            {students.placed} placed of {students.total} total students ({students.unplaced} searching)
          </div>
        </div>

        <div className="card">
          <div className="card-title">Average Package (CTC)</div>
          <div className="card-value">{compensation.avg_ctc_lpa} <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)" }}>LPA</span></div>
          <div className="card-subtext" style={{ marginTop: 14 }}>
            Highest Offer: <span style={{ color: "var(--success)", fontWeight: 600 }}>{compensation.max_ctc_lpa} LPA</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Campus Drives</div>
          <div className="card-value">{drives.open} <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)" }}>Open</span></div>
          <div className="card-subtext" style={{ marginTop: 14 }}>
            {drives.total} total drives registered across companies
          </div>
        </div>

        <div className="card">
          <div className="card-title">Applications Tracked</div>
          <div className="card-value">{applications.total}</div>
          <div className="card-subtext" style={{ marginTop: 14 }}>
            <span style={{ color: "var(--success)" }}>{applications.selected} Selected</span> |{" "}
            <span style={{ color: "var(--warning)" }}>{applications.shortlisted} Shortlisted</span> |{" "}
            <span style={{ color: "var(--danger)" }}>{applications.rejected} Rejected</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Aggregation 1: Company Funnel */}
        <div className="card">
          <div className="card-title">
            <span>Company Selection Funnel</span>
            <span className="badge badge-info">Pipeline</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {funnel.map((item) => {
              const appWidth = 100;
              const shortWidth = item.applications ? Math.max(12, (item.shortlisted / item.applications) * 100) : 0;
              const selWidth = item.applications ? Math.max(8, (item.selected / item.applications) * 100) : 0;
              return (
                <div key={item._id} className="funnel-row">
                  <div className="funnel-label-row">
                    <span style={{ fontWeight: 600 }}>{item._id}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {item.selected} selected / {item.applications} applied ({item.selection_rate_pct}%)
                    </span>
                  </div>
                  <div className="funnel-bar-bg">
                    <div
                      className="funnel-bar-fill"
                      style={{ width: `${selWidth}%`, backgroundColor: "var(--success)" }}
                      title={`Selected: ${item.selected}`}
                    >
                      {item.selected > 0 && item.selected}
                    </div>
                    <div
                      className="funnel-bar-fill"
                      style={{ width: `${Math.max(0, shortWidth - selWidth)}%`, backgroundColor: "var(--warning)" }}
                      title={`Shortlisted: ${item.shortlisted}`}
                    ></div>
                    <div
                      className="funnel-bar-fill"
                      style={{ width: `${Math.max(0, appWidth - shortWidth)}%`, backgroundColor: "var(--border-subtle)" }}
                      title={`Applied: ${item.applications}`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aggregation 2: Branch Placement Rate */}
        <div className="card">
          <div className="card-title">
            <span>Branch Placement Distribution</span>
            <span className="badge badge-info">Academics</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {branches.map((b) => (
              <div key={b._id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{b._id}</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {b.placed}/{b.total} placed ({b.placement_pct}%) - Avg CGPA: {b.avg_cgpa}
                  </span>
                </div>
                <div className="progress-track" style={{ margin: "4px 0" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${b.placement_pct}%`,
                      background: b.placement_pct > 50 ? "var(--success)" : "linear-gradient(90deg, #4f46e5, #06b6d4)"
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Aggregation 3: Package by Type */}
        <div className="card">
          <div className="card-title">
            <span>Package by Company Type</span>
            <span className="badge badge-info">Compensation</span>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                style={{
                  padding: 12,
                  backgroundColor: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ textTransform: "capitalize", fontWeight: 700, fontSize: 14 }}>{pkg._id} Companies</span>
                  <span className="badge badge-info">{pkg.offers} offers</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ color: "var(--text-dim)" }}>Avg CTC</div>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{pkg.avg_ctc} LPA</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-dim)" }}>Max CTC</div>
                    <div style={{ fontWeight: 600, color: "var(--success)" }}>{pkg.max_ctc} LPA</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-dim)" }}>Min CTC</div>
                    <div style={{ fontWeight: 600, color: "var(--text-muted)" }}>{pkg.min_ctc} LPA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregation 4: Top Skills of Placed */}
        <div className="card">
          <div className="card-title">
            <span>Top Skills of Placed Students</span>
            <span className="badge badge-success">High Demand</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {skills.map((s, idx) => (
              <div
                key={s._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: idx !== skills.length - 1 ? "1px solid var(--border-subtle)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-dim)", width: 14 }}>#{idx + 1}</span>
                  <span style={{ fontWeight: 500 }}>{s._id}</span>
                </div>
                <span className="badge badge-info">{s.placed_students} candidates</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aggregation 5: CGPA Bands */}
        <div className="card">
          <div className="card-title">
            <span>CGPA Bands ($bucket)</span>
            <span className="badge badge-info">Distribution</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {cgpaBands.map((band) => {
              const label = typeof band._id === "number" ? `${band._id} - ${band._id + 1}` : "Other";
              const pct = band.students ? Math.round((band.placed / band.students) * 100) : 0;
              return (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span>CGPA {label}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {band.placed}/{band.students} placed ({pct}%)
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aggregation 6: Eligible Count Per Drive */}
      <div className="card">
        <div className="card-title">
          <span>Drive Eligibility Analysis ($lookup Sub-pipeline)</span>
          <span className="badge badge-muted">Criteria Qualification</span>
        </div>
        <div className="table-wrapper" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Min CGPA Required</th>
                <th>Qualified Students</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {eligibleCounts.map((d, i) => {
                const totalStu = overview.students.total || 80;
                const coverage = Math.round((d.eligible_students / totalStu) * 100);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{d.company}</td>
                    <td>{d.role}</td>
                    <td><span className="badge badge-info">{d.min_cgpa}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.eligible_students}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="progress-track" style={{ width: 120, height: 6, margin: 0 }}>
                          <div className="progress-fill" style={{ width: `${coverage}%` }}></div>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{coverage}% of batch</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. STUDENTS TAB
// ==========================================
function StudentsTab({ addToast, refreshOverview }) {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [placed, setPlaced] = useState("");
  const [minCgpa, setMinCgpa] = useState("");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCgpa, setEditingCgpa] = useState(null); // student obj
  const [addingSkill, setAddingSkill] = useState(null); // student obj
  const [viewHistory, setViewHistory] = useState(null); // student with applications

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (branch) params.set("branch", branch);
      if (placed !== "") params.set("placed", placed);
      if (minCgpa) params.set("min_cgpa", minCgpa);
      params.set("limit", "150");

      const res = await fetch(`/api/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
        setTotal(data.total);
      }
    } catch (err) {
      addToast("Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [branch, placed, minCgpa]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const handleDelete = async (rollNo) => {
    if (!confirm(`Are you sure you want to delete student ${rollNo}? All associated applications will also be removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/students/${rollNo}`, { method: "DELETE" });
      if (res.ok) {
        addToast(`Student ${rollNo} deleted successfully`, "success");
        loadStudents();
        refreshOverview();
      } else {
        const err = await res.json();
        addToast(err.detail || "Delete failed", "error");
      }
    } catch (e) {
      addToast("Error deleting student", "error");
    }
  };

  const handleOpenHistory = async (rollNo) => {
    try {
      const res = await fetch(`/api/students/${rollNo}`);
      if (res.ok) {
        const data = await res.json();
        setViewHistory(data);
      } else {
        addToast("Failed to load student history", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Students Directory ({total})</div>
          <div className="section-desc">Manage enrolled candidates, qualifications, and placement status</div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Icons.Plus /> Add Student
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8, flex: "1 1 300px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by roll no, name, email, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            <Icons.Search /> Search
          </button>
        </form>

        <select className="form-select" style={{ width: 140 }} value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
          <option value="IT">IT</option>
        </select>

        <select className="form-select" style={{ width: 150 }} value={placed} onChange={(e) => setPlaced(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="true">Placed</option>
          <option value="false">Unplaced</option>
        </select>

        <select className="form-select" style={{ width: 140 }} value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)}>
          <option value="">Min CGPA</option>
          <option value="6.0">6.0+</option>
          <option value="7.0">7.0+</option>
          <option value="8.0">8.0+</option>
          <option value="9.0">9.0+</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Backlogs</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                  Loading students records...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                  No students found matching current filter criteria.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.roll_no}>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#818cf8" }}>{s.roll_no}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{s.email}</div>
                  </td>
                  <td><span className="badge badge-info">{s.branch}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 600, color: s.cgpa >= 8.5 ? "var(--success)" : "var(--text-main)" }}>
                        {s.cgpa}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "2px 5px", fontSize: 10 }}
                        title="Update CGPA"
                        onClick={() => setEditingCgpa(s)}
                      >
                        <Icons.Edit />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${s.backlogs === 0 ? "badge-success" : "badge-warning"}`}>
                      {s.backlogs}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: 280, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                      {(s.skills || []).map((sk) => (
                        <span key={sk} className="skill-tag">{sk}</span>
                      ))}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "2px 6px", fontSize: 10, height: 20 }}
                        title="Add Skill"
                        onClick={() => setAddingSkill(s)}
                      >
                        <Icons.Plus />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${s.placed ? "badge-success" : "badge-muted"}`}>
                      {s.placed ? "Placed" : "Unplaced"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenHistory(s.roll_no)}
                      >
                        History
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(s.roll_no)}
                        title="Delete Student"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {isAddOpen && (
        <AddStudentModal
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            loadStudents();
            refreshOverview();
            addToast("Student enrolled successfully", "success");
          }}
          addToast={addToast}
        />
      )}

      {/* Edit CGPA Modal */}
      {editingCgpa && (
        <EditCgpaModal
          student={editingCgpa}
          onClose={() => setEditingCgpa(null)}
          onSuccess={() => {
            setEditingCgpa(null);
            loadStudents();
            refreshOverview();
            addToast("CGPA updated successfully", "success");
          }}
          addToast={addToast}
        />
      )}

      {/* Add Skill Modal */}
      {addingSkill && (
        <AddSkillModal
          student={addingSkill}
          onClose={() => setAddingSkill(null)}
          onSuccess={() => {
            setAddingSkill(null);
            loadStudents();
            addToast("Skill added via $addToSet", "success");
          }}
          addToast={addToast}
        />
      )}

      {/* View Student History Modal */}
      {viewHistory && (
        <StudentHistoryModal
          student={viewHistory}
          onClose={() => setViewHistory(null)}
        />
      )}
    </div>
  );
}

function AddStudentModal({ onClose, onSuccess, addToast }) {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [cgpa, setCgpa] = useState("");
  const [backlogs, setBacklogs] = useState(0);
  const [skillsStr, setSkillsStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{8}$/.test(rollNo)) {
      addToast("Roll number must be exactly 8 digits", "error");
      return;
    }
    const skills = skillsStr.split(",").map((s) => s.strip ? s.strip() : s.trim()).filter(Boolean);

    setSubmitting(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roll_no: rollNo,
          name,
          email,
          branch,
          cgpa: parseFloat(cgpa),
          backlogs: parseInt(backlogs, 10),
          skills,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        addToast(err.detail || "Validation error occurred", "error");
      }
    } catch (e) {
      addToast("Failed to connect to API", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 15 }}>Enroll New Student</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Roll Number (8 Digits)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 12300099"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. rajesh99@lpu-demo.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Branch</label>
                <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">CGPA (0 - 10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  placeholder="8.5"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Backlogs</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={backlogs}
                  onChange={(e) => setBacklogs(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Technical Skills (Comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Python, React, MongoDB, DSA"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCgpaModal({ student, onClose, onSuccess, addToast }) {
  const [cgpa, setCgpa] = useState(student.cgpa);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/${student.roll_no}/cgpa`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cgpa: parseFloat(cgpa) }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        addToast(err.detail || "Update failed", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 14 }}>Update CGPA: {student.name}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">New CGPA (0.00 - 10.00)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-input"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddSkillModal({ student, onClose, onSuccess, addToast }) {
  const [skill, setSkill] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skill.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/${student.roll_no}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: skill.trim() }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to add skill", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 14 }}>Add Skill to {student.name}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Skill Name ($addToSet - avoids duplicates)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Docker, Kubernetes, Next.js"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>Add Skill</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentHistoryModal({ student, onClose }) {
  const apps = student.applications || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 750 }}>
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{student.name} ({student.roll_no})</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {student.branch} | CGPA: {student.cgpa} | Backlogs: {student.backlogs} | Status:{" "}
              <span className={`badge ${student.placed ? "badge-success" : "badge-muted"}`}>
                {student.placed ? "Placed" : "Unplaced"}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 16 }}>
            <div className="card-title">Skills Profile</div>
            <div>
              {(student.skills || []).map((sk) => (
                <span key={sk} className="skill-tag">{sk}</span>
              ))}
            </div>
          </div>

          <div className="card-title">Applications & Recruitment Rounds History ({apps.length})</div>
          {apps.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
              No applications submitted yet.
            </div>
          ) : (
            <div className="table-wrapper" style={{ marginTop: 8 }}>
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Rounds Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id || a._id}>
                      <td style={{ fontWeight: 600 }}>{a.company?.name || "Company"}</td>
                      <td>{a.drive?.role || "Role"}</td>
                      <td>{a.drive?.ctc_lpa} LPA</td>
                      <td>
                        <span
                          className={`badge ${
                            a.status === "selected"
                              ? "badge-success"
                              : a.status === "shortlisted"
                              ? "badge-warning"
                              : a.status === "rejected"
                              ? "badge-danger"
                              : "badge-info"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {(a.rounds || []).length === 0 ? (
                          <span style={{ color: "var(--text-dim)", fontSize: 12 }}>Pending rounds</span>
                        ) : (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {a.rounds.map((r, i) => (
                              <span
                                key={i}
                                className={`badge ${r.result === "pass" ? "badge-success" : r.result === "fail" ? "badge-danger" : "badge-warning"}`}
                              >
                                {r.name}: {r.result}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. DRIVES TAB
// ==========================================
function DrivesTab({ addToast, refreshOverview }) {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [applyingDrive, setApplyingDrive] = useState(null); // drive obj for quick application

  const loadDrives = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/drives?status_filter=${statusFilter}` : "/api/drives";
      const res = await fetch(url);
      if (res.ok) {
        setDrives(await res.json());
      }
    } catch (e) {
      addToast("Failed to load drives", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, [statusFilter]);

  const toggleStatus = async (driveId, currentStatus) => {
    const nextStatus = currentStatus === "open" ? "closed" : "open";
    try {
      const res = await fetch(`/api/drives/${driveId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        addToast(`Drive status changed to ${nextStatus}`, "success");
        loadDrives();
        refreshOverview();
      }
    } catch (e) {
      addToast("Failed to update status", "error");
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Campus Placement Drives ({drives.length})</div>
          <div className="section-desc">Manage visiting companies, eligibility criteria, and job opportunities</div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Icons.Plus /> Register New Drive
        </button>
      </div>

      <div className="search-bar">
        <select
          className="form-select"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Drives (Open & Closed)</option>
          <option value="open">Open Only</option>
          <option value="closed">Closed Only</option>
        </select>
      </div>

      <div className="grid-2">
        {loading ? (
          <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center", gridColumn: "1 / -1" }}>
            Loading recruitment drives...
          </div>
        ) : drives.length === 0 ? (
          <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center", gridColumn: "1 / -1" }}>
            No placement drives found.
          </div>
        ) : (
          drives.map((d) => (
            <div key={d.id || d._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>{d.company?.name || "Company"}</span>
                    <span className="badge badge-info">{d.company?.type || "Corporate"}</span>
                    <span className="badge badge-muted">{d.company?.location || "India"}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>{d.role}</div>
                </div>
                <span className={`badge ${d.status === "open" ? "badge-success" : "badge-muted"}`}>
                  {d.status}
                </span>
              </div>

              <div style={{ margin: "16px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ background: "var(--bg-surface)", padding: 10, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Package (CTC)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)" }}>{d.ctc_lpa} LPA</div>
                </div>
                <div style={{ background: "var(--bg-surface)", padding: 10, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Min CGPA</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)" }}>{d.min_cgpa}</div>
                </div>
                <div style={{ background: "var(--bg-surface)", padding: 10, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>Max Backlogs</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)" }}>{d.max_backlogs}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                <div>
                  Applicants: <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{d.applicant_count || 0}</span> | Selected: <span style={{ fontWeight: 600, color: "var(--success)" }}>{d.selected_count || 0}</span>
                </div>
                <div>
                  Drive Date: {d.drive_date ? new Date(d.drive_date).toLocaleDateString() : "TBD"}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => toggleStatus(d.id || d._id, d.status)}
                >
                  {d.status === "open" ? "Close Drive" : "Re-open Drive"}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={d.status !== "open"}
                  onClick={() => setApplyingDrive(d)}
                >
                  Apply Student
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply to Drive Modal */}
      {applyingDrive && (
        <ApplyStudentModal
          drive={applyingDrive}
          onClose={() => setApplyingDrive(null)}
          onSuccess={() => {
            setApplyingDrive(null);
            loadDrives();
            refreshOverview();
          }}
          addToast={addToast}
        />
      )}

      {/* Register New Drive Modal */}
      {isCreateOpen && (
        <CreateDriveModal
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setIsCreateOpen(false);
            loadDrives();
            refreshOverview();
            addToast("Placement drive created successfully", "success");
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
}

function ApplyStudentModal({ drive, onClose, onSuccess, addToast }) {
  const [rollNo, setRollNo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!rollNo.trim()) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll_no: rollNo.trim(), drive_id: drive.id || drive._id }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ success: true, message: data.message });
        addToast(data.message, "success");
        setTimeout(onSuccess, 1200);
      } else {
        setFeedback({ success: false, message: data.detail || "Application failed eligibility check" });
      }
    } catch (err) {
      setFeedback({ success: false, message: "Network connection error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Apply Student to Drive</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {drive.company?.name} - {drive.role} ({drive.ctc_lpa} LPA)
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleApply}>
          <div className="modal-body">
            <div style={{ background: "var(--bg-surface)", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 16, fontSize: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Drive Eligibility Rules:</div>
              <div>Min CGPA: <span style={{ fontWeight: 600 }}>{drive.min_cgpa}</span></div>
              <div>Max Allowed Backlogs: <span style={{ fontWeight: 600 }}>{drive.max_backlogs}</span></div>
            </div>

            <div className="form-group">
              <label className="form-label">Student Roll Number (8 digits)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 12300000"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
                autoFocus
              />
            </div>

            {feedback && (
              <div
                style={{
                  padding: 10,
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  backgroundColor: feedback.success ? "var(--success-light)" : "var(--danger-light)",
                  color: feedback.success ? "var(--success)" : "var(--danger)",
                  border: `1px solid ${feedback.success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                }}
              >
                {feedback.message}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Checking Eligibility..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateDriveModal({ onClose, onSuccess, addToast }) {
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [ctcLpa, setCtcLpa] = useState("");
  const [minCgpa, setMinCgpa] = useState("6.5");
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [driveDate, setDriveDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((data) => {
        setCompanies(data);
        if (data.length > 0) setCompanyName(data[0].name);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          role,
          ctc_lpa: parseFloat(ctcLpa),
          min_cgpa: parseFloat(minCgpa),
          max_backlogs: parseInt(maxBacklogs, 10),
          drive_date: new Date(driveDate).toISOString(),
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        addToast(err.detail || "Error creating drive", "error");
      }
    } catch (e) {
      addToast("Network connection error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 15 }}>Register Placement Drive</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Hiring Company</label>
              <select className="form-select" value={companyName} onChange={(e) => setCompanyName(e.target.value)}>
                {companies.map((c) => (
                  <option key={c.id || c._id} value={c.name}>
                    {c.name} ({c.type} - {c.location})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Job Role / Designation</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Software Development Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">CTC (LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="200"
                  className="form-input"
                  placeholder="12.0"
                  value={ctcLpa}
                  onChange={(e) => setCtcLpa(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Min CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="form-input"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Backlogs</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={maxBacklogs}
                  onChange={(e) => setMaxBacklogs(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Drive Date</label>
              <input
                type="date"
                className="form-input"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>Register Drive</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. APPLICATIONS TAB
// ==========================================
function ApplicationsTab({ addToast, refreshOverview }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [addingRoundApp, setAddingRoundApp] = useState(null); // app obj for adding round

  const loadApplications = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/applications?status=${statusFilter}` : "/api/applications";
      const res = await fetch(url);
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (e) {
      addToast("Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        addToast(`Application status updated to ${newStatus}`, "success");
        loadApplications();
        refreshOverview();
      } else {
        const err = await res.json();
        addToast(err.detail || "Update failed", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Applications & Evaluation Pipeline ({applications.length})</div>
          <div className="section-desc">Track applicant stages, interview rounds, and final selections</div>
        </div>
      </div>

      <div className="search-bar">
        <select
          className="form-select"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Target Drive</th>
              <th>Package</th>
              <th>Applied Date</th>
              <th>Interview Rounds</th>
              <th>Status</th>
              <th>Stage Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                  Loading pipeline...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                  No applications found for current filter.
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const s = app.student || {};
                const d = app.drive || {};
                const c = app.company || {};
                const appId = app.id || app._id;
                return (
                  <tr key={appId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.name || "Student"}</div>
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: "#818cf8" }}>
                        {s.roll_no} | {s.branch} (CGPA: {s.cgpa})
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name || "Company"}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{d.role}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{d.ctc_lpa} LPA</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {app.applied_on ? new Date(app.applied_on).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                        {(app.rounds || []).map((r, i) => (
                          <span
                            key={i}
                            className={`badge ${
                              r.result === "pass" ? "badge-success" : r.result === "fail" ? "badge-danger" : "badge-warning"
                            }`}
                          >
                            {r.name}: {r.result}
                          </span>
                        ))}
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "2px 6px", fontSize: 10 }}
                          title="Record interview round result"
                          onClick={() => setAddingRoundApp(app)}
                        >
                          <Icons.Plus /> Round
                        </button>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === "selected"
                            ? "badge-success"
                            : app.status === "shortlisted"
                            ? "badge-warning"
                            : app.status === "rejected"
                            ? "badge-danger"
                            : app.status === "withdrawn"
                            ? "badge-muted"
                            : "badge-info"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: "4px 8px", fontSize: 12, width: 130 }}
                        value={app.status}
                        onChange={(e) => updateStatus(appId, e.target.value)}
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Interview Round Modal */}
      {addingRoundApp && (
        <AddRoundModal
          application={addingRoundApp}
          onClose={() => setAddingRoundApp(null)}
          onSuccess={() => {
            setAddingRoundApp(null);
            loadApplications();
            addToast("Interview round outcome saved", "success");
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
}

function AddRoundModal({ application, onClose, onSuccess, addToast }) {
  const [roundName, setRoundName] = useState("Technical");
  const [customRound, setCustomRound] = useState("");
  const [result, setResult] = useState("pass");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalName = roundName === "Other" ? customRound.trim() : roundName;
    if (!finalName) {
      addToast("Please provide round name", "error");
      return;
    }

    setSubmitting(true);
    try {
      const appId = application.id || application._id;
      const res = await fetch(`/api/applications/${appId}/rounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName, result }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        addToast(err.detail || "Error adding round", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            Record Round: {application.student?.name}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Round Name</label>
              <select className="form-select" value={roundName} onChange={(e) => setRoundName(e.target.value)}>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Coding Assessment">Coding Assessment</option>
                <option value="Technical Round 1">Technical Round 1</option>
                <option value="Technical Round 2">Technical Round 2</option>
                <option value="Managerial">Managerial</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Other">Custom Round Name...</option>
              </select>
            </div>

            {roundName === "Other" && (
              <div className="form-group">
                <label className="form-label">Custom Round Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. System Design Interview"
                  value={customRound}
                  onChange={(e) => setCustomRound(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Result</label>
              <select className="form-select" value={result} onChange={(e) => setResult(e.target.value)}>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>Save Result</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 5. DATABASE & SCHEMA TAB
// ==========================================
function SystemTab({ addToast, refreshOverview }) {
  const [validationResult, setValidationResult] = useState(null);
  const [testingValidation, setTestingValidation] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleTestValidation = async () => {
    setTestingValidation(true);
    try {
      const res = await fetch("/api/system/validation-demo");
      if (res.ok) {
        const data = await res.json();
        setValidationResult(data);
        addToast("Validation check completed", "info");
      }
    } catch (e) {
      addToast("Failed to run validation test", "error");
    } finally {
      setTestingValidation(false);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("This will reset all MongoDB collections (students, companies, drives, applications) and recreate synthetic dataset. Proceed?")) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/system/reset-seed", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        addToast(data.message, "success");
        refreshOverview();
      } else {
        addToast("Reset failed", "error");
      }
    } catch (e) {
      addToast("Network error during reset", "error");
    } finally {
      setResetting(false);
    }
  };

  const handlePurgeWithdrawn = async () => {
    try {
      const res = await fetch("/api/system/purge-withdrawn", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        addToast(data.message, "success");
        refreshOverview();
      }
    } catch (e) {
      addToast("Failed to purge", "error");
    }
  };

  const handleClosePastDrives = async () => {
    try {
      const res = await fetch("/api/system/close-past-drives", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        addToast(data.message, "success");
        refreshOverview();
      }
    } catch (e) {
      addToast("Failed to close past drives", "error");
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Database & JSON Schema Validation</div>
          <div className="section-desc">Manage MongoDB validators, indexes, batch operations, and reproducible seeds</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Strict Schema Validation Demo */}
        <div className="card">
          <div className="card-title">
            <span>Strict Schema Validation Demo</span>
            <span className="badge badge-success">Security</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
            MongoDB enforces strict validation at the engine level using JSON Schema. This demo attempts to insert a document with illegal values:
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-muted)", margin: "8px 0 16px 20px" }}>
            <li>Invalid roll number: <code>"abc"</code> (requires 8 digits regex)</li>
            <li>Disallowed branch: <code>"ARTS"</code> (enum strictly limited to CSE, ECE, ME, CE, IT)</li>
            <li>Out-of-bounds CGPA: <code>11</code> (maximum 10)</li>
            <li>Negative backlogs: <code>-1</code> (minimum 0)</li>
          </ul>

          <button
            className="btn btn-secondary"
            onClick={handleTestValidation}
            disabled={testingValidation}
          >
            <Icons.Shield />
            {testingValidation ? "Testing Validator..." : "Trigger Validation Test"}
          </button>

          {validationResult && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>
                MongoDB Response:
              </div>
              <pre
                style={{
                  backgroundColor: "var(--bg-surface)",
                  padding: 12,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: 12,
                  color: "var(--danger)",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap"
                }}
              >
                {validationResult.schema_validation_result}
              </pre>
            </div>
          )}
        </div>

        {/* Database Administration Controls */}
        <div className="card">
          <div className="card-title">
            <span>Database Maintenance & Actions</span>
            <span className="badge badge-info">Admin</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            <div style={{ padding: 12, backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Reset and Reseed Synthetic Dataset</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 10px 0" }}>
                Drops all collections, re-creates strict validators and unique indexes, and populates 80+ synthetic student records and recruitment drives.
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleResetSeed}
                disabled={resetting}
              >
                <Icons.Refresh />
                {resetting ? "Resetting DB..." : "Reset & Reseed Data"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 12, backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Purge Withdrawn</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 8px 0" }}>
                  Permanently remove canceled applications.
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handlePurgeWithdrawn}>
                  Purge Withdrawn
                </button>
              </div>

              <div style={{ padding: 12, backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Close Past Drives</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 8px 0" }}>
                  Batch update status of past dates to closed.
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleClosePastDrives}>
                  Close Past Drives
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Render root
export default App;
