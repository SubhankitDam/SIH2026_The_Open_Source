-- =========== PRESCRIPTIONS ===========
CREATE TABLE prescriptions
(
    prescription_id VARCHAR(20) PRIMARY KEY,
    case_id         VARCHAR(20)  NOT NULL REFERENCES case_records (case_id) ON DELETE CASCADE,
    medicine_name   VARCHAR(150) NOT NULL,
    dosage          VARCHAR(100), -- e.g., '2 tablets'
    frequency       VARCHAR(100), -- e.g., 'twice daily'
    duration_value  INT,          -- e.g., 7
    duration_unit   VARCHAR(20),  -- e.g., 'days'
    instructions    TEXT,         -- e.g., 'take after meals'
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_case ON prescriptions(case_id);
