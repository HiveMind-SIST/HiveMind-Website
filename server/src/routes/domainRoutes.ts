import { Router } from "express";
import { getDomains, getDomainById, createDomain, updateDomain, deleteDomain } from "../controllers/domainController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getDomains);
router.get("/:id", getDomainById);

router.post("/", protectAdmin, createDomain);
router.put("/:id", protectAdmin, updateDomain);
router.delete("/:id", protectAdmin, deleteDomain);

export default router;
