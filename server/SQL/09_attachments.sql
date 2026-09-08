-- =========== ENUM ===========
CREATE TYPE attachment_type AS ENUM ('prescription_photo', 'lab_report', 'symptom_photo', 'other');

-- =========== ATTACHMENTS ===========
CREATE TABLE attachments
(
    attachment_id       VARCHAR(20) PRIMARY KEY,         -- e.g., 'ATT-000078'
    case_id             VARCHAR(20)     NOT NULL REFERENCES case_records (case_id) ON DELETE CASCADE,
    uploaded_by_user_id UUID REFERENCES users (user_id), -- e.g., who uploaded it (patient, nurse, or doctor)
    file_url            TEXT            NOT NULL,        -- storage URL
    file_type           attachment_type NOT NULL DEFAULT 'other',
    original_filename   VARCHAR(255),
    uploaded_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_case ON attachments(case_id);
