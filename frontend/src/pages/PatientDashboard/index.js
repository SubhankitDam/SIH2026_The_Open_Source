import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

// -----------------------------
// Dummy data — shaped to match the real API responses this page will
// eventually call:
//   GET /api/v1/patients/me       -> profile
//   GET /api/v1/patients/me/cases -> case list
// Swap the two useState initial values below for real fetch() calls
// once those routes exist; the JSX doesn't need to change.
// -----------------------------

const DUMMY_PROFILE = {
    patient_id: "PAT-2451",
    first_name: "Ananya Kumari",
    last_name: "Sharma",
    dob: "1998-04-12",
    gender: "F",
    phone_number: "9876543210",
    blood_group: "B+",
    address: "House No. 22, Rampur Village, Uttar Pradesh",
};

const DUMMY_CASES = [
    {
        case_id: "CASE-0003",
        chief_complaint: "Recurring lower back pain, improving",
        symptom_location: "lower back",
        severity: "mild",
        status: "resolved",
        created_at: "2026-01-20",
        doctor_name: "Dr. Rohan Verma",
    },
    {
        case_id: "CASE-0002",
        chief_complaint: "Lower back pain, not improving after rest",
        symptom_location: "lower back",
        severity: "moderate",
        status: "follow_up_required",
        created_at: "2026-01-10",
        doctor_name: "Dr. Rohan Verma",
    },
    {
        case_id: "CASE-0001",
        chief_complaint: "Sudden onset lower back pain after lifting",
        symptom_location: "lower back",
        severity: "moderate",
        status: "resolved",
        created_at: "2026-01-01",
        doctor_name: "Dr. Rohan Verma",
    },
];

const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatStatus = (status) => status.replace(/_/g, " ");

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [profile] = useState(DUMMY_PROFILE);
    const [cases] = useState(DUMMY_CASES);

    const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

    const handleLogout = () => {
        // Real implementation: localStorage.removeItem("token"); localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-topbar">
                <div>
                    <h1 className="dashboard-title">My health record</h1>
                    <p className="dashboard-subtitle">Welcome back, {profile.first_name.split(" ")[0]}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Log out
                </button>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-info">
                    <h2>{profile.first_name} {profile.last_name}</h2>
                    <span className="profile-badge">Patient</span>
                    <div className="profile-meta">
                        <span><strong>ID:</strong> {profile.patient_id}</span>
                        <span><strong>Phone:</strong> {profile.phone_number}</span>
                        <span><strong>Blood group:</strong> {profile.blood_group}</span>
                        <span><strong>DOB:</strong> {formatDate(profile.dob)}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h3>Visit history</h3>
                </div>

                {cases.length === 0 ? (
                    <div className="empty-state">
                        You don't have any recorded visits yet.
                    </div>
                ) : (
                    <div className="case-list">
                        {cases.map((c) => (
                            <div className="case-card" key={c.case_id} onClick={() => navigate(`/patient/cases/${c.case_id}`)}>
                                <div className="case-card-main">
                                    <div className="case-card-top">
                                        <span className="case-id">{c.case_id}</span>
                                    </div>
                                    <p className="case-complaint">{c.chief_complaint}</p>
                                    <div className="case-card-meta">
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

export default PatientDashboard;
