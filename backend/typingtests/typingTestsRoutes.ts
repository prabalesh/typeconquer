import { Router } from "express";
import { createTypingTestResult, getBestWPM } from "./typingTestsControllers";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

router.post("/result", authenticateToken, createTypingTestResult);
router.get("/bestresult", authenticateToken, getBestWPM);

export default router;
