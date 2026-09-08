CREATE TYPE severity_type AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE case_status_type AS ENUM ('open', 'in_progress', 'resolved', 'follow_up_required');

-- =========== CASE RECORDS ===========
CREATE TABLE case_records
(
    case_id              VARCHAR(20) PRIMARY KEY,
    patient_id           VARCHAR(20)      NOT NULL REFERENCES patients (patient_id) ON DELETE CASCADE,
    doctor_id            VARCHAR(20)      NOT NULL REFERENCES doctors (doctor_id),
    recorded_by_user_id  UUID REFERENCES users (user_id), -- nurse or doctor who took the case, nullable if self-reported

    -- Symptom Fields
    chief_complaint      TEXT             NOT NULL,       -- main reason for visit
    symptom_location     VARCHAR(150),
    severity             severity_type,
    duration_value       INT,                             -- e.g., 3
    duration_unit        VARCHAR(20),                     -- e.g., 'days', 'weeks', 'months'
    triggers             TEXT,                            -- what worsens / brings on the system
    past_medical_history TEXT,

    -- Ayush-specific / diagnostic
    diagnosis            TEXT,
    prescribed_treatment TEXT,
    follow_up_required   BOOLEAN          NOT NULL DEFAULT FALSE,
    follow_up_date       DATE,

    status               case_status_type NOT NULL DEFAULT 'open',
    created_at           TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- =========== INDEXES ===========

CREATE INDEX idx_case_records_patient ON case_records(patient_id);
CREATE INDEX idx_case_records_doctor ON case_records(doctor_id);
CREATE INDEX idx_case_records_status ON case_records(status);
