import jwt from "jsonwebtoken";
import oauthClient from "../config/oauth.config";
import { config } from "../config/config";
import User from "../models/userModel";
import generateUsername from "../utils/generateUsername";

export const loginWithGoogle = async (tokenID: string) => {
    const ticket = await oauthClient.verifyIdToken({
        idToken: tokenID,
        audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token");

    const { email, name, sub: googleID } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        let username = generateUsername(name || "randomuser");
        while (await User.exists({ username })) {
            username = generateUsername(name || "randomuser");
        }

        user = await User.create({ name, email, username, googleID });
    } else {
        user.lastLogin = new Date();
        await user.save();
    }

    const accessToken = jwt.sign(
        { id: user._id, name, username: user.username },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, name, username: user.username },
        config.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );

    return { user, accessToken, refreshToken };
};
