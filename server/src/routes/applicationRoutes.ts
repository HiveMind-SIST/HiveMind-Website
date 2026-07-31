import { Router } from "express";
import {
    applyMember,
    getApplications,
    updateApplicationStatus,
    deleteApplication
} from "../controllers/applicationController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public submission route
router.post("/apply", applyMember);

// Protected administrative dashboard routes
router.get("/", protectAdmin, getApplications);
router.put("/:id/status", protectAdmin, updateApplicationStatus);
router.delete("/:id", protectAdmin, deleteApplication);

export default router;
