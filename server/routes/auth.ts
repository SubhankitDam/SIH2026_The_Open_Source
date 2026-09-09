import { Router } from "express";
import loginRouter from "./login";
import registerRouter from "./register";

const authRouter = Router();

// Test that the '/api/v1/auth' route is working correctly
authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);

export default authRouter;
