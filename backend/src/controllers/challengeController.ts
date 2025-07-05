import { Response } from "express";
import {
    createChallengeService,
    getPendingChallengesService,
    getChallengeService,
    submitChallengeService,
    declineChallengeService,
    myAllChallengesService,
} from "../services/challengeService";
import { UserRequest } from "../types/index";

export async function createChallenge(req: UserRequest, res: Response) {
    if(req.user === undefined || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const challenge = await createChallengeService(
            req.user.id,
            req.body.challengedFriendID,
            req.body.typingTestResultID
        );
        res.status(201).json({ success: true, message: "Challenge created", challenge });
    } catch (error: unknown) {
        console.error("Error creating challenge:", error);
        res.status(500).json({ success: false, message: "internal server error" });
    }
}

export async function getPendingChallenges(req: UserRequest, res: Response) {
    if(req.user === undefined || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const pendingChallenges = await getPendingChallengesService(req.user.id);
        res.status(200).json({ success: true, pendingChallenges });
    } catch {
        res.status(500).json({ error: "Failed to fetch challenges" });
    }
}

export async function getChallenge(req: UserRequest, res: Response) {
    if(req.user === undefined || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const challenge = await getChallengeService(req.user.id, req.body.challengeID);
        res.status(200).json({ success: true, challenge });
    } catch (err) {
        console.error("Error fetching challenge:", err);
        res.status(400).json({ error: "internal server error" });
    }
}

export async function submitChallenge(req: UserRequest, res: Response) {
    if(req.user === undefined || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const challenge = await submitChallengeService(
            req.user.id,
            req.body.challengeID,
            req.body.friendTestResultID
        );
        res.status(200).json({ success: true, challenge });
    } catch (error) {
        console.error("Error submitting challenge:", error);
        res.status(400).json({ error: "internal server error" });
    }
}

export async function declineChallenge(req: UserRequest, res: Response) {
    if(req.user === undefined || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        await declineChallengeService(req.user.id, req.body.challengeID, req.user.username);
        res.status(200).json({ success: true, message: "Challenge declined" });
    } catch (error) {
        console.error("Error declining challenge:", error);
        res.status(400).json({ success: false, message: "internal server error" });
    }
}

export async function myAllChallenges(req: UserRequest, res: Response) {
    if(req.user === undefined || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const { filter = "all", page = "1", limit = "10" } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const result = await myAllChallengesService(req.user.id, filter.toString(), skip, Number(limit));
        res.status(200).json({ success: true, ...result });
    } catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
