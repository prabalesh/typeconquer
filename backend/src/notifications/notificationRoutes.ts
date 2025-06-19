import { Router } from "express";
import {
    getUserNotifications,
    markNotificationAsRead,
} from "./notificationController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

router.get("", authenticateToken, getUserNotifications);
router.post("/read", authenticateToken, markNotificationAsRead);

export default router;
