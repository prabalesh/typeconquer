import { Router } from "express";
import authenticateToken from "../middlewares/authMiddleware";
import {
    createChallenge,
    getChallenge,
    getPendingChallenges,
    submitChallenge,
} from "./challengeController";

const router = Router();

router.post("/pending", authenticateToken, getPendingChallenges);
router.post("/create", authenticateToken, createChallenge);
router.post("/getChallenge", authenticateToken, getChallenge);
router.post("/submit", authenticateToken, submitChallenge);

export default router;
