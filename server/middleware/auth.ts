import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types";
import jwt from "jsonwebtoken";

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
