import * as db from "../db";
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import type { AuthRequest } from "../types";

const patientsRouter = Router();
patientsRouter.use(authenticate, requireRole("patient"));

// Test that the '/api/v1/patients/me' route is working correctly
patientsRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1/patients/me' route." });
});

// Get patient details
patientsRouter.get("/me", async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    const patientResult = await db.query(
      "SELECT * FROM patients WHERE user_id = $1",
      [userId]
    );

    if (patientResult.rowCount === 0) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    return res.json(patientResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get a patient's record cases
patientsRouter.get("/me/cases", async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    // Obtain first_name and last_name only for displaying error messages
    const patientResult = await db.query(
      "SELECT patient_id, first_name, last_name FROM patients WHERE user_id = $1",
      [userId]
    );

    const patientId: number = patientResult.rows[0].patient_id;

    const caseResult = await db.query(
      "SELECT * FROM case_records WHERE patient_id = $1",
      [patientId]
    );

    if (caseResult.rowCount === 0) {
      const { first_name, last_name } = patientResult.rows[0];
      return res
        .status(404)
        .json({ error: `No cases found for ${first_name} ${last_name}.` });
    }

    return res.json(...caseResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch patient cases" });
  }
});

export default patientsRouter;
