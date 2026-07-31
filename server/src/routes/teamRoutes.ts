import { Router } from "express";
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, reorderTeamMembers } from "../controllers/teamController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to view team members
router.get("/", getTeamMembers);

// Protected routes to manage team members
router.post("/", protectAdmin, createTeamMember);
router.put("/reorder", protectAdmin, reorderTeamMembers);
router.put("/:id", protectAdmin, updateTeamMember);
router.delete("/:id", protectAdmin, deleteTeamMember);

export default router;
