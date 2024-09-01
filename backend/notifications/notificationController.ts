import { Request, Response } from "express";
import Notification from "./notificationModel";

interface UserPayload {
    id: string;
    email: string;
    name: string;
}
interface UserRequest extends Request {
    user?: UserPayload;
}

export const getUserNotifications = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ user: userId }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

export const markNotificationAsRead = async (
    req: UserRequest,
    res: Response
) => {
    if (!req.user) {
        return res.status(401);
    }

    const userID = req.user.id;

    try {
        const { id } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ message: "Notification ID is required." });
        }

        const notification = await Notification.findOne({
            _id: id,
            user: userID,
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        notification.read = true;
        notification.save();

        return res
            .status(200)
            .json({ message: "Notification marked as read.", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
