-- =========== DOCTORS ===========
CREATE TABLE doctors
(
    doctor_id        VARCHAR(20) PRIMARY KEY,
    user_id          UUID UNIQUE  NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    specialization   VARCHAR(100),
    license_number   VARCHAR(50) UNIQUE,
    phc_id           VARCHAR(20),
    years_experience INT
);
