export async function googleLogin(tokenID: string) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokenID }),
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to login!");
    }

    return response.json();
}
