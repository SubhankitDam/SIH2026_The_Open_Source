import { Router } from "express";

const loginRouter = Router();

loginRouter.post("/", (req, res) => {
  const { userId, phone } = req.body;

  // make sure all fields are present
  if (
    !userId ||
    typeof userId !== "number" ||
    Number.isNaN(userId) ||
    !phone ||
    typeof phone !== "string"
  ) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  return res.status(200).json({ message: "Authenticated successfully" });
});

export default loginRouter;
