import { Router } from "express";
import { listTraining, getTraining, registerTraining, listMyTraining } from "../controllers/training.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", listTraining);
router.get("/registrations/me", requireAuth, listMyTraining);
router.get("/:id", getTraining);
router.post("/:id/register", requireAuth, registerTraining);
export default router;
