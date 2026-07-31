import { Router } from "express";
import { getTechnologies, getTechnologyById, createTechnology, updateTechnology, deleteTechnology } from "../controllers/technologyController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getTechnologies);
router.get("/:id", getTechnologyById);

router.post("/", protectAdmin, createTechnology);
router.put("/:id", protectAdmin, updateTechnology);
router.delete("/:id", protectAdmin, deleteTechnology);

export default router;
