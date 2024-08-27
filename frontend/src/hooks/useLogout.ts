import { useDispatch } from "react-redux";
import { clearUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; // Use environment variable for API URL

    const logout = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                dispatch(clearUser());
                toast.success("Logged out successfully");
                navigate("/auth/login"); // Navigate after state update and toast
            } else {
                // const errorText = await response.text();
                toast.error(`Logout failed! `);
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Error during logout!");
        }
    };

    return logout;
};
