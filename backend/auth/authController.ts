import { Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import oauthClient from "../config/oauth.config";
import { config } from "../config/config";
import User from "./UserModel";

interface GoogleAuthRequest extends Request {
    body: {
        tokenID: string;
    };
}

interface UserPayload {
    id: string;
    email: string;
    name: string;
}

interface UserRequest extends Request {
    user?: UserPayload;
}

interface JwtPayload {
    id: string;
    name: string;
    email: string;
}

export const authenticateUser = (req: UserRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401);
            // .json({ success: false, message: "Unauthorized" });
        }

        res.json({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
        });
    } catch (err) {
        console.error("Error occurred (user authenticate): ", err);
        return res.status(403);
        // .json({ success: false, message: "Forbidden" });
    }
};

export const googleAuthLogin = async (
    req: GoogleAuthRequest,
    res: Response
) => {
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
            user = await User.create({ name, email, googleID });
        } else {
            user.lastLogin = new Date();
            await user.save();
        }

        const accessToken = jwt.sign(
            { id: user._id, name, email },
            config.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            { id: user._id, name, email },
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
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
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

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    try {
        if (!refreshToken) {
            return res
                .status(401)
                .json({ success: false, message: "Refresh token missing" });
        }

        const decoded = await new Promise<JwtPayload | null>(
            (resolve, reject) => {
                jwt.verify(
                    refreshToken,
                    config.JWT_REFRESH_SECRET,
                    (err: VerifyErrors | null, decoded: unknown) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(decoded as JwtPayload | null);
                        }
                    }
                );
            }
        );

        if (!decoded) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
            { id: decoded.id, name: decoded.name, email: decoded.email },
            config.JWT_SECRET,
            {
                expiresIn: "15m", // Short-lived access token
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "none",
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        });

        return res.json({ success: true, accessToken });
    } catch (error) {
        console.log("error occurred (refresh token): ", error);
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
