import { Router } from "express";
import { databaseHealth, health } from "../controllers/health.controller.js";

const router = Router();

router.get("/", health);
router.get("/db", databaseHealth);

export default router;
