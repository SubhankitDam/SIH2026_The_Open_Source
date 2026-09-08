-- ========== ENUM TYPES ==========

CREATE TYPE user_role AS ENUM ('patient', 'nurse', 'doctor', 'admin');
CREATE TYPE gender_type AS ENUM ('M', 'F', 'Other');
CREATE TYPE shift_type AS ENUM ('morning', 'evening', 'night');
CREATE TYPE severity_type AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE case_status_type AS ENUM ('open', 'in_progress', 'resolved', 'follow_up_required');
CREATE TYPE attachment_type AS ENUM ('prescription_photo', 'lab_report', 'symptom_photo', 'other');
