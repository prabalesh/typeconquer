import { Request, Response } from "express";
import Challenge, { IChallenge } from "./ChallengeModel";
import TypingTestResult from "../typingtests/TestResultModel";
import Friendship from "../friendship/FriendshipModel";

interface UserPayload {
    id: string;
    email: string;
    name: string;
}
interface UserRequest extends Request {
    user?: UserPayload;
}

export const createChallenge = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json("User is not set");
    }
    try {
        const challengerID = req.user.id;
        const { challengedFriendID, typingTestResultID } = req.body;

        if (!challengedFriendID || !typingTestResultID) {
            return res
                .status(400)
                .json({ error: "Can't send challenge request." });
        }

        const friendship = await Friendship.findOne({
            $or: [
                {
                    requester: challengerID,
                    receiver: challengedFriendID,
                    status: "accepted",
                },
                {
                    requester: challengedFriendID,
                    receiver: challengerID,
                    status: "accepted",
                },
            ],
        });

        if (!friendship) {
            return res
                .status(403)
                .json({ error: "You can only challenge friends." });
        }

        const typingTestResult = await TypingTestResult.findOne({
            _id: typingTestResultID,
            userID: challengerID,
        });

        if (!typingTestResult) {
            return res.status(404).json({
                success: false,
                message:
                    "Typing test result not found or does not belong to the challenger",
            });
        }

        // Create the challenge
        const challenge = new Challenge({
            challenger: challengerID,
            challengedFriend: challengedFriendID,
            typingTestResult: typingTestResultID,
        });

        await challenge.save();

        return res.status(201).json({
            success: true,
            message: "Challenge created successfully",
            challenge,
        });
    } catch (error) {
        console.error("Error creating challenge:", error);
        return res
            .status(500)
            .json({ error: "Server error while creating the challenge" });
    }
};

export const getPendingChallenges = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }

    try {
        const userID = req.user.id;

        const pendingChallenges = await Challenge.find({
            challengedFriend: userID,
            status: "pending",
        })
            .sort({ challengeDate: -1 })
            .populate("challenger", "name username")
            .populate("typingTestResult", "wpm accuracy duration");

        return res.status(200).json({ success: true, pendingChallenges });
    } catch (error) {
        console.error("Error fetching pending challenges:", error);
        return res
            .status(500)
            .json({ error: "Server error while fetching pending challenges" });
    }
};

export const getChallenge = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }

    try {
        const { challengeID } = req.body;
        const userID = req.user.id;

        if (!challengeID) {
            return res.status(400).json({ error: "Challenge ID is required" });
        }

        const challenge = await Challenge.findOne({
            _id: challengeID,
            status: "pending",
        })
            .populate("challenger", "_id name username")
            .populate("typingTestResult", "wpm accuracy text duration");

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        if (challenge.challengedFriend.toString() !== userID) {
            return res.status(403).json({
                error: "You are not authorized to access this challenge",
            });
        }

        return res.status(200).json({ success: true, challenge });
    } catch (error) {
        console.error("Error fetching challenge:", error);
        return res
            .status(500)
            .json({ error: "Server error while fetching the challenge" });
    }
};

export const submitChallenge = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { challengeID, friendTestResultID } = req.body;
        const userID = req.user.id;

        if (!challengeID || !friendTestResultID) {
            return res.status(400).json({
                error: "Challenge ID and friend test result ID are required",
            });
        }

        const challenge = await Challenge.findOne({
            _id: challengeID,
            challengedFriend: userID,
            status: "pending",
        })
            .populate("typingTestResult")
            .populate("challenger", "_id name username")
            .populate("challengedFriend", "_id name username");

        if (!challenge) {
            return res.status(404).json({
                error: "Challenge not found or you are not authorized",
            });
        }

        const challengeWithMethod = challenge as unknown as IChallenge;

        const friendTestResult = await TypingTestResult.findById(
            friendTestResultID
        );

        if (!friendTestResult) {
            return res
                .status(404)
                .json({ error: "Friend's test result not found" });
        }

        challengeWithMethod.friendTestResult = friendTestResultID;
        challengeWithMethod.status = "accepted";

        await challengeWithMethod.determineWinner();

        return res
            .status(200)
            .json({ success: true, challenge: challengeWithMethod });
    } catch (error) {
        console.error("Error submitting challenge:", error);
        return res
            .status(500)
            .json({ error: "Server error while submitting the challenge" });
    }
};
