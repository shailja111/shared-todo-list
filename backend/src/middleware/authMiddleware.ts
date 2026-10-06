import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const token = header.substring(7);
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid authentication token" });
  }
}