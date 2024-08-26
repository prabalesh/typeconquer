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
        return res.json({ success: true, token: token });
    } catch (error) {
        console.log("error occured (google oauth login): ", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
