import { Request, Response } from "express";
import jwt from "jsonwebtoken";

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

export const authenticateUser = (req: UserRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401);
        }

        res.json({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
        });
    } catch (err) {
        console.error("Error occurred (user authenticate): ", err);
        return res.status(403);
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
        }

        const token = jwt.sign(
            { id: user._id, name, email },
            config.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "lax" : "none",
            expires: new Date(Date.now() + 24 * 3600000),
        });

        return res.json({ success: true, token: token });
    } catch (error) {
        console.log("error occured (google oauth login): ", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "lax" : "none",
        expires: new Date(0),
    });

    return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
};
