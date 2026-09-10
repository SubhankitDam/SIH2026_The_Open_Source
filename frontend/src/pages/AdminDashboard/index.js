import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

// -----------------------------
// Dummy data — shaped around the
// admin API discussed for this project:
//   GET /api/v1/admin/users -> all users across roles
//
// Replace the two local state values with real API data later.
// The dashboard layout can stay the same.
// -----------------------------

const DUMMY_PROFILE = {
    admin_id: "ADM-0012",
    first_name: "Kavya",
    last_name: "Mehta",
};

const DUMMY_USERS = [
    {
        user_id: "USR-1001",
        login_id: "101482731",
        first_name: "Ananya",
        last_name: "Kumari Sharma",
        role: "patient",
        phone_number: "9876543210",
        status: "active",
        joined_at: "2026-01-04",
    },
    {
        user_id: "USR-1002",
        login_id: "101614902",
        first_name: "Rohan",
        last_name: "Verma",
        role: "doctor",
        phone_number: "9812345670",
        status: "active",
        joined_at: "2025-12-18",
    },
    {
        user_id: "USR-1003",
        login_id: "103714206",
        first_name: "Priya",
        last_name: "Singh",
        role: "nurse",
        phone_number: "9123456780",
        status: "active",
        joined_at: "2026-01-10",
    },
    {
        user_id: "USR-1004",
        login_id: "101318574",
        first_name: "Kiran",
        last_name: "Devi",
        role: "patient",
        phone_number: "9001122334",
        status: "active",
        joined_at: "2026-01-16",
    },
    {
        user_id: "USR-1005",
        login_id: "102462810",
        first_name: "Sunita",
        last_name: "Rao",
        role: "doctor",
        phone_number: "9988776655",
        status: "active",
        joined_at: "2025-11-22",
    },
    {
        user_id: "USR-1006",
        login_id: "103583941",
        first_name: "Arjun",
        last_name: "Patel",
        role: "nurse",
        phone_number: "9765432109",
        status: "active",
        joined_at: "2026-01-25",
    },
    {
        user_id: "USR-1007",
        login_id: "101205617",
        first_name: "Rohan",
        last_name: "Das",
        role: "patient",
        phone_number: "9090901234",
        status: "inactive",
        joined_at: "2025-10-08",
    },
    {
        user_id: "USR-1008",
        login_id: "102734518",
        first_name: "Meera",
        last_name: "Iyer",
        role: "doctor",
        phone_number: "9345678120",
        status: "active",
        joined_at: "2025-12-02",
    },
    {
        user_id: "USR-1009",
        login_id: "103891245",
        first_name: "Neha",
        last_name: "Joshi",
        role: "nurse",
        phone_number: "9876501234",
        status: "inactive",
        joined_at: "2025-09-14",
    },
    {
        user_id: "USR-1010",
        login_id: "104562731",
        first_name: "Kavya",
        last_name: "Mehta",
        role: "admin",
        phone_number: "9898989898",
        status: "active",
        joined_at: "2025-08-01",
    },
];

const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatRole = (role) => role.charAt(0).toUpperCase() + role.slice(1);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [profile] = useState(DUMMY_PROFILE);
    const [users] = useState(DUMMY_USERS);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();

    const counts = useMemo(() => ({
        total: users.length,
        patients: users.filter((user) => user.role === "patient").length,
        doctors: users.filter((user) => user.role === "doctor").length,
        nurses: users.filter((user) => user.role === "nurse").length,
        active: users.filter((user) => user.status === "active").length,
    }), [users]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            const matchesSearch = !query || [
                user.first_name,
                user.last_name,
                user.login_id,
                user.phone_number,
                user.user_id,
            ].some((value) => value.toLowerCase().includes(query));

            return matchesRole && matchesSearch;
        });
    }, [roleFilter, search, users]);

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-topbar">
                <div>
                    <h1 className="dashboard-title">Admin dashboard</h1>
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
                    <span className="profile-badge">Administrator</span>
                    <div className="profile-meta">
                        <span><strong>ID:</strong> {profile.admin_id}</span>
                        <span><strong>Access:</strong> Administrative</span>
                    </div>
                </div>
            </div>

            <div className="stat-row">
                <div className="stat-card">
                    <div className="stat-label">Total users</div>
                    <div className="stat-value">{counts.total}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Patients</div>
                    <div className="stat-value">{counts.patients}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Doctors</div>
                    <div className="stat-value">{counts.doctors}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Nurses</div>
                    <div className="stat-value">{counts.nurses}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active accounts</div>
                    <div className="stat-value">{counts.active}</div>
                </div>
            </div>

            <div className="dashboard-section admin-users-section">
                <div className="dashboard-section-header">
                    <div>
                        <h3>User management</h3>
                        <p className="section-note">All registered users across patients, doctors, nurses and administrators.</p>
                    </div>
                    <button className="new-case-btn" onClick={() => document.getElementById("admin-user-table")?.scrollIntoView({ behavior: "smooth" })}>
                        View all users
                    </button>
                </div>

                <div className="admin-toolbar">
                    <div className="admin-search-wrap">
                        <label htmlFor="user-search" className="admin-label">Search users</label>
                        <input
                            id="user-search"
                            className="admin-search"
                            type="search"
                            placeholder="Name, login ID, phone or user ID"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div className="admin-filter-wrap">
                        <label htmlFor="role-filter" className="admin-label">Role</label>
                        <select
                            id="role-filter"
                            className="admin-select"
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                        >
                            <option value="all">All roles</option>
                            <option value="patient">Patients</option>
                            <option value="doctor">Doctors</option>
                            <option value="nurse">Nurses</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                <div className="admin-user-table-wrap" id="admin-user-table">
                    <table className="admin-user-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Login ID</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.user_id}>
                                    <td>
                                        <div className="admin-user-name">{user.first_name} {user.last_name}</div>
                                        <div className="admin-user-id">{user.user_id}</div>
                                    </td>
                                    <td>{user.login_id}</td>
                                    <td>
                                        <span className={`admin-role-pill admin-role-${user.role}`}>
                                            {formatRole(user.role)}
                                        </span>
                                    </td>
                                    <td>{user.phone_number}</td>
                                    <td>
                                        <span className={`admin-status-pill admin-status-${user.status}`}>
                                            {formatRole(user.status)}
                                        </span>
                                    </td>
                                    <td>{formatDate(user.joined_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="empty-state">
                            No users match the current search and filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
