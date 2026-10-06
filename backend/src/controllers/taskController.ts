import { Response } from "express";
import { pool } from "../db/database";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

async function userId(uid: string) {
  const result = await pool.query("SELECT id FROM users WHERE firebase_uid=$1", [uid]);
  return result.rows[0]?.id;
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const id = await userId(req.user!.uid);
    const result = await pool.query(
      `SELECT DISTINCT t.*, u.email AS owner_email
       FROM tasks t JOIN users u ON u.id=t.owner_id
       LEFT JOIN task_shares s ON s.task_id=t.id
       WHERE t.owner_id=$1 OR s.shared_with_user_id=$1
       ORDER BY t.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Unable to fetch tasks" });
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response) {
  try {
    const id = await userId(req.user!.uid);
    const { title, description = "" } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const result = await pool.query(
      `INSERT INTO tasks (title,description,owner_id) VALUES ($1,$2,$3) RETURNING *`,
      [title.trim(), description, id]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Unable to create task" });
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  try {
    const id = await userId(req.user!.uid);
    const result = await pool.query(
      `UPDATE tasks SET title=COALESCE($1,title),
       description=COALESCE($2,description),
       completed=COALESCE($3,completed),
       updated_at=CURRENT_TIMESTAMP
       WHERE id=$4 AND owner_id=$5 RETURNING *`,
      [req.body.title, req.body.description, req.body.completed, req.params.id, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Task not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Unable to update task" });
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  try {
    const id = await userId(req.user!.uid);
    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND owner_id=$2 RETURNING id",
      [req.params.id, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Unable to delete task" });
  }
}

export async function shareTask(req: AuthenticatedRequest, res: Response) {
  try {
    const ownerId = await userId(req.user!.uid);
    const { email } = req.body;

    const task = await pool.query(
      "SELECT id FROM tasks WHERE id=$1 AND owner_id=$2",
      [req.params.id, ownerId]
    );
    if (!task.rows.length) return res.status(404).json({ message: "Task not found" });

    const target = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (!target.rows.length) return res.status(404).json({ message: "User does not exist" });

    await pool.query(
      `INSERT INTO task_shares (task_id,shared_with_user_id)
       VALUES ($1,$2) ON CONFLICT (task_id,shared_with_user_id) DO NOTHING`,
      [req.params.id, target.rows[0].id]
    );

    res.json({ message: "Task shared successfully" });
  } catch {
    res.status(500).json({ message: "Unable to share task" });
  }
}