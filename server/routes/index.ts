import { Router } from "express";
import authRouter from "./auth";
import patientsRouter from "./patients";
import doctorsRouter from "./doctors";
import nursesRouter from "./nurses";

const rootRouter = Router();

// Test that the '/api/v1' route is working correctly
rootRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1' route." });
});

rootRouter.use("/auth", authRouter);
rootRouter.use("/patients", patientsRouter);
rootRouter.use("/doctors", doctorsRouter);
rootRouter.use("/nurses", nursesRouter);

export default rootRouter;
