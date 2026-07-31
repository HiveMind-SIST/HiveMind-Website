import { Router } from "express";
import { getCommunitySettings, updateCommunitySettings } from "../controllers/communitySettingsController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to fetch settings
router.get("/", getCommunitySettings);

// Protected route to update settings
router.put("/", protectAdmin, updateCommunitySettings);

export default router;
