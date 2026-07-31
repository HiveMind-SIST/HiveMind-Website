import { Router } from "express";
import { login, logout, getMe } from "../controllers/authController";
import { protectAdmin } from "../middleware/authMiddleware";

import { deleteFromCloudinary } from "../utils/cloudinary";

const router = Router();

// Endpoint mapping to /api/v1/admin/...
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectAdmin, getMe);

// Secure Cloudinary delete endpoint
router.post("/cloudinary/delete", protectAdmin, async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, message: "Image URL is required." });
        }
        const success = await deleteFromCloudinary(url);
        if (success) {
            return res.status(200).json({ success: true, message: "Image deleted successfully from Cloudinary." });
        } else {
            return res.status(400).json({ success: false, message: "Failed to delete image from Cloudinary or invalid URL." });
        }
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error." });
    }
});

export default router;
