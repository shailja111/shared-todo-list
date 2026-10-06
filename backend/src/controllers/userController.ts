import { Response } from "express";
import { pool } from "../db/database";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export async function syncUser(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = req.user!.uid;
    const email = req.user!.email || "";
    const name = req.user!.name || email.split("@")[0];

    const result = await pool.query(
      `INSERT INTO users (firebase_uid,email,name)
       VALUES ($1,$2,$3)
       ON CONFLICT (firebase_uid)
       DO UPDATE SET email=EXCLUDED.email,name=EXCLUDED.name
       RETURNING *`,
      [uid, email, name]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to sync user" });
  }
}