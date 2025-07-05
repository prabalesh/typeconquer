import Friendship from "../models/friendshipModel";
import User from "../models/userModel";
import Notification from "../models/notificationModel";
import { Types } from "mongoose";

export const getAllFriendsService = async (userID: Types.ObjectId) => {
    const friendships = await Friendship.find({
        $or: [
            { requester: userID, status: "accepted" },
            { receiver: userID, status: "accepted" },
        ],
    })
        .populate("requester", "_id name username lastLogin")
        .populate("receiver", "_id name username lastLogin");

    return friendships.map(friendship =>
        friendship.requester._id === userID
            ? friendship.receiver
            : friendship.requester
    );
};

export const sendFriendRequestService = async (userID: Types.ObjectId, username: string) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Username not found");
    if (user._id === userID) throw new Error("Cannot send request to self");

    const existingRequest = await Friendship.findOne({
        requester: userID,
        receiver: user._id,
        $or: [{ status: "pending" }, { status: "accepted" }],
    });

    if (existingRequest) throw new Error("Friend request already exists");

    const friendship = new Friendship({
        requester: userID,
        receiver: user._id,
        status: "pending",
    });

    await friendship.save();
};

export const getPendingRequestsService = async (userID: Types.ObjectId) => {
    return Friendship.find({
        receiver: userID,
        status: "pending",
    }).populate("requester", "_id name username");
};

export const removeFriendService = async (userID: Types.ObjectId, unfriendID: Types.ObjectId) => {
    await Friendship.deleteMany({
        $or: [
            { requester: userID, receiver: unfriendID, status: "accepted" },
            { requester: unfriendID, receiver: userID, status: "accepted" },
        ],
    });
};

export const acceptFriendRequestService = async (userID: Types.ObjectId, friendshipID: Types.ObjectId, requesterID: Types.ObjectId) => {
    const friendship = await Friendship.findOne({
        _id: friendshipID,
        receiver: userID,
        requester: requesterID,
        status: "pending",
    });

    if (!friendship) throw new Error("Friend request not found");

    friendship.status = "accepted";
    await friendship.save();

    return friendship;
};

export const rejectFriendRequestService = async (
    userID: Types.ObjectId,
    friendshipID: Types.ObjectId,
    requesterID: Types.ObjectId,
    username: string
) => {
    const friendship = await Friendship.findOne({
        _id: friendshipID,
        receiver: userID,
        requester: requesterID,
        status: "pending",
    });

    if (!friendship) throw new Error("Friend request not found");

    friendship.status = "rejected";
    await friendship.save();

    await Notification.create({
        user: requesterID,
        type: "friend_request",
        message: `Your friend request to ${username} has been rejected.`,
        read: false,
    });

    return friendship;
};
