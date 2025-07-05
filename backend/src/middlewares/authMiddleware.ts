import {Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import User, { IUser } from "../models/userModel";
import { UserRequest } from "../types";
import { UserPayload } from "../types/user";

const verifyToken = async (
    token: string,
    secret: string
): Promise<UserPayload> => {
    try {
        const decoded = jwt.verify(token, secret) as UserPayload;
        if (decoded && decoded.id) {
            return decoded;
        }
        throw new Error("Invalid token");
    } catch {
        throw new Error("Token expired or invalid");
    }
};

const authenticateToken = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];

    try {
        // verify access token
        if (accessToken) {
            const decoded = await verifyToken(accessToken, config.JWT_SECRET);


            req.user = {
                id: decoded.id,
                username: decoded.username,
                name: decoded.name,
            };

            return next();
        }

        // if access is invalid or not present verify refresh token
        if (refreshToken) {
            const decodedRefreshToken = await verifyToken(
                refreshToken,
                config.JWT_REFRESH_SECRET
            );
            const userDoc = (await User.findById(
                decodedRefreshToken.id
            )) as IUser | null;

            if (!userDoc) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token",
                });
            }

            const user = {
                id: userDoc._id,
                username: userDoc.username,
                name: userDoc.name,
            };

            // generates new access token if old is expired
            const newAccessToken = jwt.sign(user, config.JWT_SECRET, {
                expiresIn: "15min",
            });

            userDoc.lastLogin = new Date();
            await userDoc.save();

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: "none",
                expires: new Date(Date.now() + 15 * 60 * 1000),
            });

            req.user = {
                id: userDoc._id,
                username: user.username,
                name: user.name,
            };

            return next();
        }

        return res.status(401).json({
            success: false,
            message: "Login to continue",
        });
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Invalid tokens" });
    }
};

export default authenticateToken;
