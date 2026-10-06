import { Router } from "express";
import { syncUser } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
router.post("/sync", authenticate, syncUser);
export default router;