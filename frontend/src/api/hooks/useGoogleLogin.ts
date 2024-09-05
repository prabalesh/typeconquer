import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../features/user/userSlice";
import { googleLogin } from "../googleAuth";

import { CredentialResponse } from "@react-oauth/google";

export function useGoogleLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLoginSuccess = async (response: CredentialResponse) => {
        const { credential } = response;

        if (!credential && typeof credential !== "string") {
            toast.error("Login failed!");
            return;
        }

        try {
            const data = await googleLogin(credential);

            if (data.success && data["accessToken"]) {
                const decodedUserData = jwtDecode<{
                    id: string;
                    username: string;
                    name: string;
                }>(data["accessToken"]);

                dispatch(
                    setUser({
                        id: decodedUserData["id"],
                        username: decodedUserData["username"],
                        name: decodedUserData["name"],
                    })
                );

                toast.success("Logged in successfully");
                navigate("/");
            } else {
                toast.error(
                    "Failed to login: " + (data.message || "Unknown error")
                );
            }
        } catch (err: unknown) {
            console.log(err);
            toast.error("Login failed!");
        }
    };

    const handleLoginError = () => {
        toast.error("Login failed!");
    };

    return { handleLoginSuccess, handleLoginError };
}
