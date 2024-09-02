const apiURL = `${import.meta.env.VITE_API_URL}/api/notifications`;

export const fetchNotifications = async (signal: AbortSignal) => {
    try {
        const response = await fetch(apiURL, {
            method: "GET",
            credentials: "include",
            signal,
        });
        const data = await response.json();
        if (data.success) {
            return data.notifications;
        } else {
            throw new Error(data.message || "Error fetching notifications");
        }
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
    }
};
