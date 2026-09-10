import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

// -----------------------------
// Dummy data — shaped to match:
//   GET /api/v1/nurses/me       -> profile
//   GET /api/v1/nurses/me/cases -> ALL clinic cases (not just ones this
//                                   nurse recorded — see the earlier
//                                   decision that nurses see the whole
//                                   clinic's case list, single-clinic scope)
// Swap the two useState initial values below for real fetch() calls
// once wired up; the JSX doesn't need to change.
// -----------------------------

const DUMMY_PROFILE = {
    nurse_id: "NUR-0089",
    first_name: "Priya",
    last_name: "Singh",
    shift: "morning",
};

const DUMMY_CASES = [
    {
        case_id: "CASE-0004",
        patient_name: "Kiran Devi",
        patient_id: "PAT-7734",
        doctor_name: "Dr. Rohan Verma",
        chief_complaint: "Persistent headache, 3 days",
        severity: "moderate",
        status: "open",
        created_at: "2026-02-02",
    },
    {
        case_id: "CASE-0003",
        patient_name: "Ananya Sharma",
        patient_id: "PAT-2451",
        doctor_name: "Dr. Rohan Verma",
        chief_complaint: "Recurring lower back pain, improving",
        severity: "mild",
        status: "resolved",
        created_at: "2026-01-20",
    },
    {
        case_id: "CASE-0005",
        patient_name: "Mohan Lal",
        patient_id: "PAT-1190",
        doctor_name: "Dr. Sunita Rao",
        chief_complaint: "Mild fever with body ache",
        severity: "mild",
        status: "in_progress",
        created_at: "2026-02-05",
    },
];

const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatStatus = (status) => status.replace(/_/g, " ");
const formatShift = (shift) => shift.charAt(0).toUpperCase() + shift.slice(1);

const NurseDashboard = () => {
    const navigate = useNavigate();
    const [profile] = useState(DUMMY_PROFILE);
    const [cases] = useState(DUMMY_CASES);

    const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-topbar">
                <div>
                    <h1 className="dashboard-title">Nurse dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {profile.first_name}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Log out
                </button>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-info">
                    <h2>{profile.first_name} {profile.last_name}</h2>
                    <span className="profile-badge">Nurse</span>
                    <div className="profile-meta">
                        <span><strong>ID:</strong> {profile.nurse_id}</span>
                        <span><strong>Shift:</strong> {formatShift(profile.shift)}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h3>Clinic cases</h3>
                    <button className="new-case-btn" onClick={() => navigate("/nurse/cases/new")}>
                        + Record new case
                    </button>
                </div>

                {cases.length === 0 ? (
                    <div className="empty-state">
                        No cases recorded at the clinic yet.
                    </div>
                ) : (
                    <div className="case-list">
                        {cases.map((c) => (
                            <div className="case-card" key={c.case_id} onClick={() => navigate(`/nurse/cases/${c.case_id}`)}>
                                <div className="case-card-main">
                                    <div className="case-card-top">
                                        <span className="case-id">{c.case_id}</span>
                                    </div>
                                    <p className="case-complaint">{c.chief_complaint}</p>
                                    <div className="case-card-meta">
                                        <span>{c.patient_name} ({c.patient_id})</span>
                                        <span>{c.doctor_name}</span>
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

export default NurseDashboard;
