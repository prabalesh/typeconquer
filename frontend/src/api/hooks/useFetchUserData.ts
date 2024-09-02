import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../features/user/userSlice";

export function useFetchUserData() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async (retryCount = 5) => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/user`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    dispatch(setUser(data));
                } else {
                    dispatch(clearUser());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (retryCount > 0) {
                    console.log(`Retrying... (${retryCount} attempts left)`);
                    setTimeout(() => fetchUserData(retryCount - 1), 2000);
                } else {
                    dispatch(clearUser());
                }
            }
        };

        fetchUserData();
    }, [dispatch]);
}
