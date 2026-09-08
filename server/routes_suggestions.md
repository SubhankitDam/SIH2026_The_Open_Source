# Clinical API Endpoints Documentation

| API Method                                   | Used by                  | Input                                                                 | Response                         |
|:---------------------------------------------|:-------------------------|:----------------------------------------------------------------------|:---------------------------------|
| `POST /api/v1/auth/register`                 | Patient (self-serve)     | `phone`, `full_name`, `dob`, `gender`, `address`, `emergency_contact` | `login_id`, `patient_id`         |
| `POST /api/v1/auth/login`                    | All roles                | `login_id`, `phone`                                                   | `token (auto)`, `role`           |
| `POST /api/v1/staff/patients`                | Nurse / Admin            | `phone`, `full_name`, `dob`, `gender`, `address`                      | `login_id`, `patient_id`         |
| `GET /api/v1/patients/me`                    | Patient                  | `token (auto)`                                                        | `patient profile`                |
| `GET /api/v1/patients/me/cases`              | Patient                  | `token (auto)`                                                        | `list of their case_records`     |
| `GET /api/v1/doctors/me/patients`            | Doctor                   | `token (auto)`                                                        | `list of assigned/seen patients` |
| `POST /api/v1/doctors/cases`                 | Doctor                   | `full case_record fields`                                             | `created case_id`                |
| `GET / PATCH /api/v1/doctors/cases/:case_id` | Doctor                   | `token (auto)` *(+ update fields for PATCH)*                          | `case_record`                    |
| `POST /api/v1/cases/:case_id/prescriptions`  | Doctor                   | `medicine_name`, `dosage`, `frequency`, etc.                          | `prescription_id`                |
| `POST /api/v1/cases/:case_id/attachments`    | Patient / Nurse / Doctor | `file`, `file_type`                                                   | `attachment_id`, `file_url`      |
| `GET / POST /api/v1/nurses/me/cases`         | Nurse                    | `token (auto)` *(+ case fields if recording on behalf of doctor)*     | `case_record(s)`                 |
| `GET /api/v1/admin/users`                    | Admin                    | `token (auto)`                                                        | `all users across roles`         |
