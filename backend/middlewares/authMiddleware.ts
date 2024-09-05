import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import User, { IUser } from "../auth/user.model";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        name: string;
    };
}

interface JWTPayload {
    id: string;
    username?: string;
    name?: string;
}

const verifyToken = async (
    token: string,
    secret: string
): Promise<JWTPayload> => {
    try {
        const decoded = jwt.verify(token, secret) as JWTPayload;
        if (decoded && decoded.id) {
            return decoded;
        }
        throw new Error("Invalid token");
    } catch {
        throw new Error("Token expired or invalid");
    }
};

const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];

    try {
        // verify access token
        if (accessToken) {
            const decoded = await verifyToken(accessToken, config.JWT_SECRET);
            const user = (await User.findById(decoded.id)) as IUser | null;

            // checks whether the user is present or not
            if (!user) {
                throw new Error("User not found");
            }

            req.user = {
                id: user._id.toString(),
                username: user.username,
                name: user.name,
            };

            user.lastLogin = new Date();
            await user.save();

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
                id: userDoc._id.toString(), // Convert ObjectId to string
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
                id: userDoc._id.toString(),
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
