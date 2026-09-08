-- =========== NURSES ===========
CREATE TABLE nurses
(
    nurse_id  VARCHAR(20) PRIMARY KEY,
    user_id   UUID UNIQUE  NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phc_id    VARCHAR(20),
    shift     shift_type
);
