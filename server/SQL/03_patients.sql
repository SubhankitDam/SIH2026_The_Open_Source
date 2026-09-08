-- =========== PATIENTS ===========
CREATE TABLE patients
(
    patient_id        VARCHAR(20) PRIMARY KEY,
    user_id           UUID UNIQUE  NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    full_name         VARCHAR(100) NOT NULL,
    dob               DATE,
    gender            gender_type,
    address           TEXT,
    emergency_contact VARCHAR(15),
    blood_group       VARCHAR(5),
    assigned_phc_id   VARCHAR(20)
);
