import { Router } from "express";
import { listInternships, getInternship } from "../controllers/internship.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { cvUpload } from "../middleware/upload.middleware.js";
import { createApplication } from "../controllers/application.controller.js";

const router = Router();
router.get("/", listInternships);
router.get("/:id", getInternship);
router.post("/:id/apply", requireAuth, cvUpload.single("cv"), createApplication);
export default router;
