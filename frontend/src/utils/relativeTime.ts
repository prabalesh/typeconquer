function formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
        (now.getTime() - dateObj.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
        return `${Math.floor(diffInSeconds)} secs ago`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} mins ago`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    } else if (diffInSeconds < 2592000) {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else if (diffInSeconds < 31536000) {
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    } else {
        return `${Math.floor(diffInSeconds / 31536000)} yrs ago`;
    }
}

export default formatRelativeTime;
