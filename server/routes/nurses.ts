import * as db from "../db";
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { AuthRequest } from "../types";

const nursesRouter = Router();
nursesRouter.use(authenticate, requireRole("nurse"));

// Test the '/api/v1/nurses' route
nursesRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1/nurses' route." });
});

nursesRouter.get("/me", async (req: AuthRequest, res) => {
  try {
    const { userId } = req;

    // Get nurse details
    const result = await db.query("SELECT * FROM nurses WHERE user_id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nurse details" });
  }
});

nursesRouter.get("/me/cases", async (req: AuthRequest, res) => {
  try {
    // Fetch all the case details in a clinic
    const caseResult = await db.query(
      "SELECT * FROM case_records ORDER BY created_at DESC"
    );

    return res.json(caseResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nurse cases" });
  }
});

export default nursesRouter;
