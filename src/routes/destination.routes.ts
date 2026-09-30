import { Router } from "express";
import { getDestinationBySlug, listDestinations } from "../controllers/destination.controller.js";

const router = Router();

router.get("/", listDestinations);
router.get("/:slug", getDestinationBySlug);

export default router;
