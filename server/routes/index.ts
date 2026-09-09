import { Router } from "express";
import authRouter from "./auth";

const rootRouter = Router();

// Test that the '/api/v1' route is working correctly
rootRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1' route." });
});

rootRouter.use("/auth", authRouter);

export default rootRouter;
