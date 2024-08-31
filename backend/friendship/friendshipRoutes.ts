import express from "express";
import {
    getAllFriends,
    sendFriendRequest,
    getPendingRequests,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
} from "./friendshipController";
import authenticateToken from "../middlewares/authMiddleware";

const router = express.Router();

router.post("", authenticateToken, getAllFriends);
router.post("/request", authenticateToken, sendFriendRequest);
router.post("/pending-requests", authenticateToken, getPendingRequests);
router.post("/accept", authenticateToken, acceptFriendRequest);
router.post("/reject", authenticateToken, rejectFriendRequest);
router.delete("/remove", authenticateToken, removeFriend);

export default router;
