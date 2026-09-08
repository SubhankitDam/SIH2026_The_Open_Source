import { Router } from "express";
import loginRouter from "./login";

const rootRouter = Router();

rootRouter.get("/", (_, res) => {
  return res.json({ message: "Home Page" });
});

rootRouter.use("/login", loginRouter);

export default rootRouter;
