import { Request, Response } from "express";
import Challenge, { IChallenge } from "./ChallengeModel";
import TypingTestResult from "../typingtests/TestResultModel";
import Friendship from "../friendship/FriendshipModel";
import Notification from "../notifications/notificationModel";

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
            return res.status(400).json({
                success: false,
                message: "Can't send challenge request.",
            });
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
            return res.status(403).json({
                success: false,
                message: "You can only challenge friends.",
            });
        }

        const typingTestResult = await TypingTestResult.findOne({
            _id: typingTestResultID,
            userID: challengerID,
        });

        const challengesOfChallenged = await Challenge.find({
            challengedFriend: challengedFriendID,
            status: "pending",
        });

        const challengesOfSameTest = await Challenge.findOne({
            challenger: challengerID,
            challengedFriend: challengedFriendID,
            typingTestResult: typingTestResultID,
        });

        if (challengesOfSameTest) {
            return res.status(400).json({
                success: false,
                message:
                    "You've already challenged your friend to this typing test.",
            });
        }

        if (challengesOfChallenged.length > 15) {
            return res.status(400).json({
                success: false,
                message: "Your friend has lot of pending challenges.",
            });
        }

        const userChallenges = challengesOfChallenged.filter(
            (challenge) => challenge.challenger.toString() === challengerID
        );

        if (userChallenges.length > 5) {
            return res.status(400).json({
                success: false,
                message:
                    "Your friend has more than 5 of your pending challenges.",
            });
        }

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

export const declineChallenge = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }

    const userID = req.user.id;

    try {
        const { challengeID } = req.body;

        if (!challengeID) {
            return res
                .status(400)
                .json({ success: false, message: "Challenge ID is required." });
        }

        const challenge = await Challenge.findOne({
            _id: challengeID,
            challengedFriend: userID,
            status: "pending",
        });
        if (!challenge) {
            return res
                .status(400)
                .json({ success: false, message: "Challenge not found." });
        }
        challenge.status = "declined";
        await challenge.save();

        await Notification.create({
            user: challenge.challenger,
            type: "challenge",
            message: `Your challenge request has been declined by ${req.user.name}`,
            read: false,
        });

        return res.status(200).json({
            success: true,
            message: "Challenged declined successfully",
        });
    } catch (error) {
        console.log("error reject challenge: ", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
    }
};

interface QueryParams {
    filter?: "all" | "my" | "their" | "pending" | "won" | "lost";
    page?: string;
    limit?: string;
}

interface ChallengeQuery {
    $or: [{ challengedFriend: string }, { challenger: string }];
    challenger?: string | { $ne: string };
    status?: "pending" | "accepted" | "declined" | "completed";
    winner?: string | { $ne: string };
}

export const myAllChallenges = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
    }

    const userID = req.user.id;
    const { filter = "all", page = "1", limit = "10" }: QueryParams = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    try {
        const query: ChallengeQuery = {
            $or: [{ challengedFriend: userID }, { challenger: userID }],
        };

        switch (filter) {
            case "my":
                query.challenger = userID;
                break;
            case "their":
                query.challenger = { $ne: userID };
                break;
            case "pending":
                query.status = "pending";
                query.challenger = userID;
                break;
            case "won":
                query.winner = userID;
                break;
            case "lost":
                query.status = "completed";
                query.winner = { $ne: userID };
                break;
            case "all":
            default:
                break;
        }

        const challenges = await Challenge.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ updatedAt: -1 })
            .populate("challenger", "name")
            .populate("challengedFriend", "name")
            .populate("typingTestResult", "wpm accuracy")
            .populate("friendTestResult", "wpm accuracy")
            .populate("winner", "name");

        const totalChallenges = await Challenge.countDocuments(query);

        return res.status(200).json({
            success: true,
            challenges,
            totalChallenges,
            totalPages: Math.ceil(totalChallenges / Number(limit)),
        });
    } catch (error) {
        console.log("Error during my challenges:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
