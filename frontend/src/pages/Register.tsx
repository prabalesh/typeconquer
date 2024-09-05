import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { useGoogleLogin } from "../api/hooks/useGoogleLogin";

const Register: React.FC = () => {
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    useEffect(() => {
        if (user && user.id) {
            navigate("/");
        }
    }, [navigate, user]);

    const { handleLoginSuccess, handleLoginError } = useGoogleLogin();

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
