| API                        | Method | Used By | Input                 | Response     |
|----------------------------|--------|---------|-----------------------|--------------|
| `/api/login`               | POST   | All     | User ID, Phone Number | Token + Role |
| `/api/users/profile`       | GET    | User    | Token                 | Profile      |
| `/api/users/health-record` | GET    | User    | Token                 | Health data  |
| `/api/doctor/users`        | GET    | Doctor  | Token                 | User list    |
| `/api/doctor/prescription` | POST   | Doctor  | Prescription data     | Success      |
| `/api/nurse/vitals`        | POST   | Nurse   | Vital data            | Success      |
| `/api/admin/users`         | GET    | Admin   | Token                 | All users    |
| `/api/ai/chat`             | POST   | All     | Message               | AI response  |
