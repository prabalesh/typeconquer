import Challenge, { IChallenge } from "../models/challengeModel";
import TypingTestResult from "../models/testResultModel";
import Friendship from "../models/friendshipModel";
import Notification from "../models/notificationModel";
import { FilterQuery, Types } from "mongoose";

export async function createChallengeService(challengerID: Types.ObjectId, challengedFriendID: Types.ObjectId, typingTestResultID: Types.ObjectId) {
    if (!challengedFriendID || !typingTestResultID) {
        throw new Error("Missing required fields");
    }

    const friendship = await Friendship.findOne({
        $or: [
            { requester: challengerID, receiver: challengedFriendID, status: "accepted" },
            { requester: challengedFriendID, receiver: challengerID, status: "accepted" },
        ],
    });

    if (!friendship) throw new Error("Not friends");

    const typingTestResult = await TypingTestResult.findOne({
        _id: typingTestResultID,
        userID: challengerID,
    });
    if (!typingTestResult) throw new Error("Invalid typing test result");

    const existingChallenge = await Challenge.findOne({
        challenger: challengerID,
        challengedFriend: challengedFriendID,
        typingTestResult: typingTestResultID,
    });
    if (existingChallenge) throw new Error("Duplicate challenge");

    const challengesOfChallenged = await Challenge.find({
        challengedFriend: challengedFriendID,
        status: "pending",
    });

    if (challengesOfChallenged.length > 15)
        throw new Error("Friend has too many pending challenges");

    const userChallenges = challengesOfChallenged.filter(
        (c) => c.challenger === challengerID
    );

    if (userChallenges.length > 5)
        throw new Error("Too many challenges already sent to this friend");

    const challenge = new Challenge({
        challenger: challengerID,
        challengedFriend: challengedFriendID,
        typingTestResult: typingTestResultID,
    });

    await challenge.save();
    return challenge;
}

export async function getPendingChallengesService(userID: Types.ObjectId) {
    return Challenge.find({ challengedFriend: userID, status: "pending" })
        .sort({ challengeDate: -1 })
        .populate("challenger", "name username")
        .populate("typingTestResult", "wpm accuracy duration");
}

export async function getChallengeService(userID: Types.ObjectId, challengeID: Types.ObjectId) {
    const challenge = await Challenge.findOne({ _id: challengeID, status: "pending" })
        .populate("challenger", "_id name username")
        .populate("typingTestResult", "wpm accuracy text duration");

    if (!challenge) throw new Error("Challenge not found");
    if (challenge.challengedFriend !== userID) {
        throw new Error("Unauthorized access");
    }

    return challenge;
}

export async function submitChallengeService(userID: Types.ObjectId, challengeID: Types.ObjectId, friendTestResultID: Types.ObjectId) {
    const challenge = await Challenge.findOne({
        _id: challengeID,
        challengedFriend: userID,
        status: "pending",
    })
        .populate("typingTestResult")
        .populate("challenger", "_id name username")
        .populate("challengedFriend", "_id name username");

    if (!challenge) throw new Error("Challenge not found");

    const friendTestResult = await TypingTestResult.findById(friendTestResultID);
    if (!friendTestResult) throw new Error("Test result not found");

    challenge.friendTestResult = friendTestResultID;
    challenge.status = "accepted";

    await challenge.determineWinner();
    return challenge;
}

export async function declineChallengeService(userID: Types.ObjectId, challengeID: Types.ObjectId, userName: string) {
    const challenge = await Challenge.findOne({
        _id: challengeID,
        challengedFriend: userID,
        status: "pending",
    });

    if (!challenge) throw new Error("Challenge not found");

    challenge.status = "declined";
    await challenge.save();

    await Notification.create({
        user: challenge.challenger,
        type: "challenge",
        message: `Your challenge request has been declined by ${userName}`,
        read: false,
    });
}

export async function myAllChallengesService(userID: Types.ObjectId, filter: string, skip: number, limit: number) {
    const query: FilterQuery<IChallenge> = {
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
    }

    const challenges = await Challenge.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .populate("challenger", "name")
        .populate("challengedFriend", "name")
        .populate("typingTestResult", "wpm accuracy")
        .populate("friendTestResult", "wpm accuracy")
        .populate("winner", "name");

    const totalChallenges = await Challenge.countDocuments(query);

    return {
        challenges,
        totalChallenges,
        totalPages: Math.ceil(totalChallenges / limit),
    };
}
