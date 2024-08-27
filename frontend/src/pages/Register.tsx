import React, { useEffect } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { setUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

const Register: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    useEffect(() => {
        if (user && user.email) {
            navigate("/");
        }
    }, [navigate, user]);

    const handleLoginSuccess = async (response: CredentialResponse) => {
        const { credential } = response;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tokenID: credential,
                    }),
                    credentials: "include",
                }
            );
            if (!res.ok) {
                throw new Error("Failed to login!");
            }
            const data = await res.json();
            if (data.success && data.token) {
                const decodedUserData = await jwtDecode<{
                    id: string;
                    email: string;
                    name: string;
                }>(data["token"]);
                dispatch(
                    setUser({
                        id: decodedUserData["id"],
                        email: decodedUserData["email"],
                        name: decodedUserData["name"],
                    })
                );

                toast.success("Logged in successfully");
                navigate("/");
            } else {
                toast.error(
                    "Failed to login:" + (data.message || "Unknown error")
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] px-4 sm:px-6 lg:px-8">
            <div className="bordered p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg text-center w-full max-w-md">
                <h1 className="heading text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                    Get Started
                </h1>
                <p className="text-base sm:text-lg mb-4 sm:mb-6 text-[var(--text-color)]">
                    Sign up or log in using your Google account
                </p>
                <div className="p-2 rounded-lg inline-block">
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                        theme="outline"
                        shape="pill"
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;
