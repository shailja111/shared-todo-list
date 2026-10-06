import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  getTasks, createTask, updateTask, deleteTask, shareTask
} from "../controllers/taskController";

const router = Router();
router.get("/", authenticate, getTasks);
router.post("/", authenticate, createTask);
router.put("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);
router.post("/:id/share", authenticate, shareTask);
export default router;