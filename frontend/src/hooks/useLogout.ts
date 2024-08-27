import { useDispatch } from "react-redux";
import { clearUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (response.ok) {
                dispatch(clearUser());
                toast.success("Logged out succesfully");
            } else {
                toast.error("Logout failed");
            }
            navigate("/auth/login");
        } catch (error) {
            console.log(error);
            toast.error("Error during logout!");
        }
    };

    return logout;
};
