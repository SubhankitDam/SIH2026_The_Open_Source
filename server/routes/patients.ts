import * as db from "../db";
import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import type { AuthRequest } from "../types";

const patientsRouter = Router();

// Test that the '/api/v1/patients/me' route is working correctly
patientsRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1/patients/me' route." });
});

patientsRouter.get(
  "/me",
  authenticate,
  requireRole("patient"),
  async (req: AuthRequest, res) => {
    try {
      const { userId } = req;

      const result = await db.query(
        "SELECT * FROM patients WHERE user_id = $1",
        [userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Patient profile not found" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

export default patientsRouter;
