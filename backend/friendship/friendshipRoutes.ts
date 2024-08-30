import express from "express";
import {
    getAllFriends,
    sendFriendRequest,
    getPendingRequests,
    removeFriend,
} from "./friendshipController";
import authenticateToken from "../middlewares/authMiddleware";

const router = express.Router();

router.post("", authenticateToken, getAllFriends);
router.post("/request", authenticateToken, sendFriendRequest);
router.post("/pending-requests", authenticateToken, getPendingRequests);
router.delete("/remove", authenticateToken, removeFriend);

export default router;
