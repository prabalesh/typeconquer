import { Request, Response } from "express";
import { config } from "../config/config";
import { loginWithGoogle } from "../services/authService";
import { UserRequest } from "../types";

export const authenticateUser = (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    res.json({
        id: req.user.id,
        username: req.user.username,
        name: req.user.name,
    });
};

export const googleAuthLogin = async (req: Request, res: Response) => {
    try {
        const { tokenID } = req.body;
        if (!tokenID) {
            return res.status(401).json({ message: "Token missing" });
        }

        const { accessToken, refreshToken } = await loginWithGoogle(tokenID);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "none",
            expires: new Date(Date.now() + 15 * 60000),
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "none",
            expires: new Date(Date.now() + 30 * 24 * 3600000),
        });

        return res.json({ success: true, accessToken, refreshToken });
    } catch (error) {
        console.error("Google OAuth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "none",
        expires: new Date(0),
    });

    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "none",
        expires: new Date(0),
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
};
