import { Router } from "express";

import { createAnalysis } from "../controller/analysisController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/", upload.single("resume"), createAnalysis);

export default router;
