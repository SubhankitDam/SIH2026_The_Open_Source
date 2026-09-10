import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

// -----------------------------
// Dummy data — shaped to match:
//   GET /api/v1/doctors/me     -> profile
//   GET /api/v1/doctors/cases  -> case list (only this doctor's own cases)
// Swap the two useState initial values below for real fetch() calls
// once wired up; the JSX doesn't need to change.
// -----------------------------

const DUMMY_PROFILE = {
    doctor_id: "DOC-0032",
    first_name: "Rohan",
    last_name: "Verma",
    specialization: "Ayurveda",
    license_number: "AYU-88213",
    years_experience: 9,
};

const DUMMY_CASES = [
    {
        case_id: "CASE-0004",
        patient_name: "Kiran Devi",
        patient_id: "PAT-7734",
        chief_complaint: "Persistent headache, 3 days",
        severity: "moderate",
        status: "open",
        created_at: "2026-02-02",
    },
    {
        case_id: "CASE-0003",
        patient_name: "Ananya Sharma",
        patient_id: "PAT-2451",
        chief_complaint: "Recurring lower back pain, improving",
        severity: "mild",
        status: "resolved",
        created_at: "2026-01-20",
    },
    {
        case_id: "CASE-0002",
        patient_name: "Ananya Sharma",
        patient_id: "PAT-2451",
        chief_complaint: "Lower back pain, not improving after rest",
        severity: "moderate",
        status: "follow_up_required",
        created_at: "2026-01-10",
    },
];

const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatStatus = (status) => status.replace(/_/g, " ");

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [profile] = useState(DUMMY_PROFILE);
    const [cases] = useState(DUMMY_CASES);

    const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

    const openCount = cases.filter((c) => c.status === "open" || c.status === "in_progress").length;
    const followUpCount = cases.filter((c) => c.status === "follow_up_required").length;

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-topbar">
                <div>
                    <h1 className="dashboard-title">Doctor dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, Dr. {profile.last_name}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Log out
                </button>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-info">
                    <h2>Dr. {profile.first_name} {profile.last_name}</h2>
                    <span className="profile-badge">Doctor</span>
                    <div className="profile-meta">
                        <span><strong>ID:</strong> {profile.doctor_id}</span>
                        <span><strong>Specialization:</strong> {profile.specialization}</span>
                        <span><strong>License:</strong> {profile.license_number}</span>
                        <span><strong>Experience:</strong> {profile.years_experience} yrs</span>
                    </div>
                </div>
            </div>

            <div className="stat-row">
                <div className="stat-card">
                    <div className="stat-label">Total cases</div>
                    <div className="stat-value">{cases.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Open / in progress</div>
                    <div className="stat-value">{openCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Follow-up required</div>
                    <div className="stat-value">{followUpCount}</div>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h3>My patients' cases</h3>
                    <button className="new-case-btn" onClick={() => navigate("/doctor/cases/new")}>
                        + New case
                    </button>
                </div>

                {cases.length === 0 ? (
                    <div className="empty-state">
                        No cases recorded yet. Start by creating a new case for a patient.
                    </div>
                ) : (
                    <div className="case-list">
                        {cases.map((c) => (
                            <div className="case-card" key={c.case_id} onClick={() => navigate(`/doctor/cases/${c.case_id}`)}>
                                <div className="case-card-main">
                                    <div className="case-card-top">
                                        <span className="case-id">{c.case_id}</span>
                                    </div>
                                    <p className="case-complaint">{c.chief_complaint}</p>
                                    <div className="case-card-meta">
                                        <span>{c.patient_name} ({c.patient_id})</span>
                                        <span>{formatDate(c.created_at)}</span>
                                    </div>
                                </div>
                                <div className="case-card-side">
                                    <span className={`badge badge-${c.severity}`}>{c.severity}</span>
                                    <span className={`badge badge-${c.status}`}>{formatStatus(c.status)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
