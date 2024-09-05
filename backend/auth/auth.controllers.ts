import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import oauthClient from "../config/oauth.config";
import { config } from "../config/config";
import User from "./user.model";
import { UserRequest } from "../types";
import generateUsername from "../utils/generateUsername";

export const authenticateUser = async (req: UserRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401);
        }

        res.json({
            id: req.user.id,
            username: req.user.username,
            name: req.user.name,
        });
    } catch (err) {
        console.error("Error occurred (user authenticate): ", err);
        return res.status(403);
    }
};

export const googleAuthLogin = async (req: Request, res: Response) => {
    const { tokenID } = req.body;
    try {
        if (!tokenID) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token" });
        }

        const ticket = await oauthClient.verifyIdToken({
            idToken: tokenID,
            audience: config.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token" });
        }

        const { email, name, sub: googleID } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            let username = "";
            if (!username) {
                username = generateUsername(name || "ranndomuser");
                let userExists = await User.exists({
                    username,
                });

                while (userExists) {
                    username = generateUsername(name || "ranndomuser");
                    userExists = await User.exists({
                        username,
                    });
                }
            }
            user = await User.create({ name, email, username, googleID });
        } else {
            user.lastLogin = new Date();
            await user.save();
        }

        const accessToken = jwt.sign(
            { id: user._id, name, username: user.username },
            config.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            { id: user._id, name, username: user.username },
            config.JWT_REFRESH_SECRET,
            {
                expiresIn: "30d",
            }
        );

        // storing refresh tokens
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "none",
            expires: new Date(Date.now() + 15 * 60000), // 25 mins
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "none",
            expires: new Date(Date.now() + 30 * 24 * 3600000), // 30 days
        });

        return res.json({ success: true, accessToken, refreshToken });
    } catch (error) {
        console.log("error occurred (google oauth login): ", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const logout = (req: Request, res: Response) => {
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

    return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
};
