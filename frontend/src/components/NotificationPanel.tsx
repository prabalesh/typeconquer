import { useState, useEffect } from "react";
import { NotificationType } from "../types";
import formatRelativeTime from "../utils/relativeTime";

function NotificationPanel({
    notifications: initialNotifications,
}: {
    notifications: NotificationType[];
}) {
    const [notifications, setNotifications] =
        useState<NotificationType[]>(initialNotifications);

    useEffect(() => {
        setNotifications(initialNotifications);
    }, [initialNotifications]);

    const markNotificationAsRead = async (notificationId: string) => {
        const apiURL = `${import.meta.env.VITE_API_URL}/api/notifications/read`;
        try {
            await fetch(apiURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: notificationId }),
            });
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleNotificationClick = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    return (
        <div className="p-2 absolute right-0 top-10 mt-2 w-[25vw] max-h-[40vh] bg-[var(--highlighted-color)] shadow-lg rounded-lg z-20 overflow-y-auto">
            <h4 className="text-lg font-semibold mb-2 text-center">
                Notifications
            </h4>
            <div className="flex flex-col gap-2">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className="bg-[var(--highlighted-color)] flex gap-4 items-center py-2 hover:bg-[--button-hover] hover:text-[--button-hover-text] cursor-pointer"
                            onMouseOver={() =>
                                handleNotificationClick(notification._id)
                            }
                        >
                            <div
                                className={`w-2.5 h-2.5 ${
                                    !notification.read &&
                                    "bg-[--button-hover] hover:bg-[--highlighted-text]"
                                } rounded-full flex-shrink-0`}
                            ></div>
                            <div>
                                <p>{notification.message}</p>
                                <p className="my-1 text-xs">
                                    {formatRelativeTime(notification.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No notifications</p>
                )}
            </div>
        </div>
    );
}

export default NotificationPanel;
