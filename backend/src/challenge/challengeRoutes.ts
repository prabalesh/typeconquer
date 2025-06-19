import { Router } from "express";
import authenticateToken from "../middlewares/authMiddleware";
import {
    createChallenge,
    declineChallenge,
    getChallenge,
    getPendingChallenges,
    myAllChallenges,
    submitChallenge,
} from "./challengeController";

const router = Router();

router.get("/", authenticateToken, myAllChallenges);
router.post("/pending", authenticateToken, getPendingChallenges);
router.post("/create", authenticateToken, createChallenge);
router.post("/getChallenge", authenticateToken, getChallenge);
router.post("/submit", authenticateToken, submitChallenge);
router.post("/decline", authenticateToken, declineChallenge);

export default router;
