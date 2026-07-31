import { Router } from "express";
import { getDashboardStats } from "../controllers/telemetryController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Protected admin dashboard telemetry statistics route
router.get("/stats", protectAdmin, getDashboardStats);

export default router;
