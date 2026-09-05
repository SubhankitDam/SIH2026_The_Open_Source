import { Router } from "express";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  return res.json({ message: "Home Page" });
});

export default rootRouter;
