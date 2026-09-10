import * as db from "../db";
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { AuthRequest } from "../types";

const doctorsRouter = Router();
doctorsRouter.use(authenticate, requireRole("doctor"));

// Test the '/api/v1/doctors' route
doctorsRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1/doctors' route." });
});

// Get doctor details
doctorsRouter.get("/me", async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    // Get doctor details
    const result = await db.query("SELECT * FROM doctors WHERE user_id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
});

doctorsRouter.get("/cases", async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    // Get doctor details
    const result = await db.query("SELECT * FROM doctors WHERE user_id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    const doctorId: number = result.rows[0].doctor_id;

    // Get all cases for the doctor
    const caseResult = await db.query(
      "SELECT * FROM case_records WHERE doctor_id = $1",
      [doctorId]
    );

    if (caseResult.rowCount === 0) {
      const { first_name, last_name } = result.rows[0];
      return res
        .status(404)
        .json({ error: `No cases found for Dr. ${first_name} ${last_name}.` });
    }

    return res.json(caseResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

doctorsRouter.get("/cases/:caseId", async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    // Get doctor details
    const result = await db.query("SELECT * FROM doctors WHERE user_id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    const doctorId: number = result.rows[0].doctor_id;

    const { caseId } = req.params;

    // Get case details
    const caseResult = await db.query(
      "SELECT * FROM case_records WHERE doctor_id = $1 AND case_id = $2",
      [doctorId, caseId]
    );

    if (caseResult.rowCount === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    return res.json(caseResult.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch case details" });
  }
});

export default doctorsRouter;
