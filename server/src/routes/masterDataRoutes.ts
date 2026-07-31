import { Router } from "express";
import { getMasterData, addMasterData, deleteMasterData, reorderMasterData } from "../controllers/masterDataController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to retrieve master data configuration
router.get("/", getMasterData);

// Protected routes to manage master data options
router.post("/", protectAdmin, addMasterData);
router.put("/reorder", protectAdmin, reorderMasterData);
router.delete("/:id", protectAdmin, deleteMasterData);

export default router;
