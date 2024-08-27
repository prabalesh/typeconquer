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

const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    // Extract tokens from cookies
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, config.JWT_SECRET);

            if (typeof decoded === "object" && "id" in decoded) {
                const user = await User.findById(decoded["id"]);
                if (!user) {
                    return res.status(403).json({
                        success: false,
                        message: "Invalid refresh token",
                    });
                }

                req.user = {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
                user.lastLogin = new Date();

                await user.save();
            } else {
                return res
                    .status(403)
                    .json({ success: false, message: "Invalid access token" });
            }
            req.user = decoded as UserPayload;
            return next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError && refreshToken) {
                try {
                    const decodedRefreshToken = jwt.verify(
                        refreshToken,
                        config.JWT_SECRET
                    );
                    if (
                        typeof decodedRefreshToken === "object" &&
                        "id" in decodedRefreshToken
                    ) {
                        const user = await User.findById(
                            decodedRefreshToken.id
                        );
                        if (!user) {
                            return res.status(403).json({
                                success: false,
                                message: "Invalid refresh token",
                            });
                        }

                        const newAccessToken = jwt.sign(
                            {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                            },
                            config.JWT_SECRET,
                            { expiresIn: "15min" }
                        );
                        user.lastLogin = new Date();
                        await user.save();

                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            secure: config.NODE_ENV === "production",
                            sameSite: "none",
                            expires: new Date(Date.now() + 15 * 60 * 1000),
                        });

                        req.user = {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                        };
                        return next();
                    } else {
                        throw new Error("Token expired!");
                    }
                } catch {
                    return res.status(403).json({
                        success: false,
                        message: "Token expired!",
                    });
                }
            }
            return res
                .status(403)
                .json({ success: false, message: "Invalid access token" });
        }
    }
    return res
        .status(401)
        .json({ success: false, message: "Login in to continue" });
};

export default authenticateToken;
