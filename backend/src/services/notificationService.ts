import { Types } from "mongoose";
import Notification from "../models/notificationModel";

export async function getUserNotificationsService(userId: Types.ObjectId) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
}

export async function markNotificationAsReadService(notificationId: Types.ObjectId, userId: Types.ObjectId) {
    const notification = await Notification.findOne({ _id: notificationId, user: userId });

    if (!notification) {
        throw new Error("Notification not found.");
    }

    notification.read = true;
    await notification.save();

    return notification;
}
