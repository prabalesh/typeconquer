import { Response } from "express";
import { UserRequest } from "../types";
import {
    getUserNotificationsService,
    markNotificationAsReadService,
} from "../services/notificationService";
import { MarkNotificationReadDto } from "../dtos/notificationDtos";

export const getUserNotifications = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);

    try {
        const notifications = await getUserNotificationsService(req.user.id);
        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

export const markNotificationAsRead = async (req: UserRequest<object, unknown, MarkNotificationReadDto>, res: Response) => {
    if (!req.user) return res.status(401);

    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Notification ID is required." });
        }

        const notification = await markNotificationAsReadService(id, req.user.id);
        return res.status(200).json({
            message: "Notification marked as read.",
            notification,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
