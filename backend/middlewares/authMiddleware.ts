import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import User from "../auth/UserModel";

interface UserPayload {
    id: string;
    email: string;
    name: string;
}

interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}
interface User {
    id: string;
    name: string;
    email: string;
}

const verifyToken = async (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === "object" && "id" in decoded) {
            return decoded;
        }
        throw new Error("Invalid token");
    } catch {
        throw new Error("Token expired or invalid");
    }
};

const generateToken = (user: User, secret: string, expiresIn: string) => {
    return jwt.sign(user, secret, { expiresIn });
};

const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];

    try {
        if (accessToken) {
            const decoded = await verifyToken(accessToken, config.JWT_SECRET);
            const user = await User.findById(decoded["id"]);
            if (!user) {
                throw new Error("User not found");
            }
            req.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            };
            user.lastLogin = new Date();
            await user.save();
            return next();
        }

        // Handle case where access token is missing but refresh token is present
        if (refreshToken) {
            const decodedRefreshToken = await verifyToken(
                refreshToken,
                config.JWT_REFRESH_SECRET
            );
            const userDoc = await User.findById(decodedRefreshToken.id);
            if (!userDoc) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token",
                });
            }
            const user = {
                id: userDoc._id.toString(),
                email: userDoc.email,
                name: userDoc.name,
            };

            const newAccessToken = generateToken(
                user,
                config.JWT_SECRET,
                "15min"
            );
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
                name: user.name,
                email: user.email,
            };
            return next();
        }

        return res.status(401).json({
            success: false,
            message: "Login to continue",
        });
    } catch (error) {
        console.log(error);
        return res.status(403);
        // .json({success: false, message: error.message});
    }
};

export default authenticateToken;
