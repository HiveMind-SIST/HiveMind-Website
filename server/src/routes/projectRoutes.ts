import { Router } from "express";
import { getProjects, createProject, updateProject, deleteProject, reorderProjects } from "../controllers/projectController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to view projects
router.get("/", getProjects);

// Protected routes to manage projects
router.post("/", protectAdmin, createProject);
router.put("/reorder", protectAdmin, reorderProjects);
router.put("/:id", protectAdmin, updateProject);
router.delete("/:id", protectAdmin, deleteProject);

export default router;
