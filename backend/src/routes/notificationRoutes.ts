import { Router } from "express";
import {
    getUserNotifications,
    markNotificationAsRead,
} from "../controllers/notificationController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

router.get("", authenticateToken, getUserNotifications);
router.post("/read", authenticateToken, markNotificationAsRead);

export default router;
