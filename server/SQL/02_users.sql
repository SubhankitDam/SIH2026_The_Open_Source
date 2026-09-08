CREATE DATABASE user_db;

-- Enable extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ======== ENUM TYPES ========
CREATE TYPE user_role AS ENUM ('patient', 'nurse', 'doctor', 'admin');
CREATE TYPE gender_type AS ENUM ('M', 'F', 'Other');
CREATE TYPE shift_type AS ENUM ('morning', 'evening', 'night');

-- =========== USERS ===========
CREATE TABLE users
(
    user_id       UUID PRIMARY KEY            DEFAULT gen_random_uuid(),
    login_id      VARCHAR(9) UNIQUE  NOT NULL,
    phone_number  VARCHAR(15) UNIQUE NOT NULL,
    pin_hash      VARCHAR(255)       NOT NULL,
    role          user_role          NOT NULL,
    is_active     BOOLEAN            NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users (phone_number);
CREATE INDEX idx_users_login_id ON users (login_id);
