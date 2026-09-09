import * as db from "../db";
import { Router } from "express";
import { randomInt } from "node:crypto";

const registerRouter = Router();

// Test that the '/api/v1/auth/register' route is working correctly
registerRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1/auth/register' route." });
});

const ROLE_PREFIX: Record<string, string> = {
  patient: "101",
  doctor: "102",
  nurse: "103",
  admin: "104",
};

function generateLoginId(role: string): string {
  const prefix = ROLE_PREFIX[role];
  if (!prefix) {
    throw new Error("Invalid role");
  }
  const suffix = randomInt(100000, 999999).toString(); // 6 digit, 100000 - 999999
  return `${prefix}${suffix}`;
}

function generatePatientId(): string {
  const suffix = randomInt(1000, 9999).toString();
  return `PAT-${suffix}`; // e.g., PAT-2451
}

async function generateUniqueLoginId(role: string): Promise<string> {
  let loginId: string;
  let exists = true;

  while (exists) {
    loginId = generateLoginId(role);
    const result = await db.query("SELECT 1 FROM users WHERE login_id = $1", [
      loginId,
    ]);
    exists = (result.rowCount ?? 0) > 0;
  }

  return loginId!;
}

async function generateUniquePatientId(): Promise<string> {
  let patientId: string;
  let exists = true;

  while (exists) {
    patientId = generatePatientId();
    const result = await db.query(
      "SELECT 1 FROM patients WHERE patient_id = $1",
      [patientId],
    );
    exists = (result.rowCount ?? 0) > 0;
  }

  return patientId!;
}

registerRouter.post("/", async (req, res) => {
  const {
    full_name: fullName,
    phone,
    dob,
    gender,
    address,
    emergency_contact: emergencyContact,
  } = req.body;

  if (
    !fullName ||
    !phone ||
    !dob ||
    !gender ||
    !address ||
    !emergencyContact ||
    typeof fullName !== "string" ||
    typeof phone !== "string" ||
    typeof dob !== "string" ||
    typeof gender !== "string" ||
    typeof address !== "string" ||
    typeof emergencyContact !== "string"
  ) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  try {
    const loginId = await generateUniqueLoginId("patient");
    const patientId = await generateUniquePatientId();

    const userResult = await db.query(
      "INSERT INTO users (login_id, phone_number, role) VALUES ($1, $2, 'patient') RETURNING user_id",
      [loginId, phone],
    );

    const userId = userResult.rows[0].user_id;

    // Insert into patients table
    await db.query(
      "INSERT INTO patients (patient_id, user_id, full_name, dob, gender, address, emergency_contact) VALUES ($1, $2, $3, $4, $5, $6, $7) ",
      [patientId, userId, fullName, dob, gender, address, emergencyContact],
    );

    return res.json({ loginId, patientId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

export default registerRouter;
