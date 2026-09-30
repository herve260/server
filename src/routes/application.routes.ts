import { Router } from "express";
import { createApplication, listMyApplications } from "../controllers/application.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { cvUpload } from "../middleware/upload.middleware.js";

const router = Router();
router.use(requireAuth);
router.post("/", cvUpload.single("cv"), createApplication);
router.get("/me", listMyApplications);
export default router;
