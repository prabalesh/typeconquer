import { Router } from "express";
import {
    createTypingTestResult,
    getBestWPM,
    getTypingTestResult,
} from "./typingTestsControllers";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

router.post("/results", authenticateToken, getTypingTestResult);
router.post("/result", authenticateToken, createTypingTestResult);
router.get("/bestresult", authenticateToken, getBestWPM);

export default router;
