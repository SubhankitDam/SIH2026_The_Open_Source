import * as db from "../db";
import { Router } from "express";
import jwt from "jsonwebtoken";

const loginRouter = Router();

// Test that the '/api/v1/auth/login' route is working correctly
loginRouter.get("/", (_, res) => {
  return res.json({ message: "This is the '/api/v1/auth/login' route." });
});

loginRouter.post("/", async (req, res) => {
  const { login_id: loginId, phone } = req.body;

  // make sure all fields are present
  if (
    !loginId ||
    typeof loginId !== "string" ||
    !phone ||
    typeof phone !== "string"
  ) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  try {
    const userResult = await db.query(
      "SELECT * FROM users WHERE login_id = $1 AND phone_number = $2",
      [loginId, phone],
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const user = userResult.rows[0];
    console.log(user);

    // Generate the token
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }, // token stays valid for 7 days
    );

    console.log(token, user.role);

    return res
      .status(200)
      .json({ message: "Authenticated successfully", token, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default loginRouter;
