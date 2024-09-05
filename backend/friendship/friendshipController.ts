import { Request, Response } from "express";
import Friendship from "./FriendshipModel";
import User from "../auth/user.model";
import Notification from "../notifications/notificationModel";

interface UserPayload {
    id: string;
    email: string;
    name: string;
}
interface UserRequest extends Request {
    user?: UserPayload;
}

export const getAllFriends = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    try {
        const userID = req.user.id;
        const friendships = await Friendship.find({
            $or: [
                {
                    requester: userID,
                    status: "accepted",
                },
                {
                    receiver: userID,
                    status: "accepted",
                },
            ],
        })
            .populate("requester", "_id name username lastLogin")
            .populate("receiver", "_id name username lastLogin");

        const friends = friendships.map((friendship) =>
            friendship.requester._id.toString() === userID
                ? friendship.receiver
                : friendship.requester
        );

        res.status(200).json({ success: true, friends });
    } catch (error) {
        console.log("error get all friends", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const sendFriendRequest = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: "Username not found" });
    }
    const userID = req.user.id;

    try {
        if (user._id.toString() === userID) {
            return res.json({
                success: false,
                message: "Can't send friend request to yourself.",
            });
        }
        const existingRequest = await Friendship.findOne({
            requester: userID,
            receiver: user._id,
            $or: [{ status: "pending" }, { status: "accepted" }],
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Friend request already exists",
            });
        }

        const friendship = new Friendship({
            requester: userID,
            receiver: user._id,
            status: "pending",
        });

        await friendship.save();

        res.status(201).json({
            success: true,
            message: "Friend request send successfully",
        });
    } catch (error) {
        console.log("error send request", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPendingRequests = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    const userID = req.user.id;

    try {
        const pendingRequests = await Friendship.find({
            receiver: userID,
            status: "pending",
        }).populate("requester", "id name username");

        res.status(200).json({ success: true, pendingRequests });
    } catch (error) {
        console.log("error get pending req", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFriend = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    const userID = req.user.id;
    const { unfriend } = req.body;

    try {
        await Friendship.deleteMany({
            $or: [
                { requester: userID, receiver: unfriend, status: "accepted" },
                { requester: unfriend, receiver: userID, status: "accepted" },
            ],
        });

        res.status(200).json({ message: "Friendship removed successfully" });
    } catch (error) {
        console.log("error unfriend: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    const userID = req.user.id;
    const { friendshipID, requesterID } = req.body;

    try {
        const friendship = await Friendship.findOne({
            _id: friendshipID,
            receiver: userID,
            requester: requesterID,
            status: "pending",
        });

        if (!friendship) {
            return res
                .status(404)
                .json({ message: "Friend request not found" });
        }

        friendship.status = "accepted";
        await friendship.save();

        res.status(200).json({
            success: true,
            message: "Friend request accepted",
            friendship,
        });
    } catch (error) {
        console.log("error accept required ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectFriendRequest = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    const userID = req.user.id;
    const { friendshipID, requesterID } = req.body;

    try {
        const friendship = await Friendship.findOne({
            _id: friendshipID,
            receiver: userID,
            requester: requesterID,
            status: "pending",
        });

        if (!friendship) {
            return res
                .status(404)
                .json({ message: "Friend request not found" });
        }

        friendship.status = "rejected";
        await friendship.save();

        await Notification.create({
            user: requesterID,
            type: "friend_request",
            message: `Your friend request to ${req.user.name} has been rejected.`,
            read: false,
        });

        res.status(200).json({
            success: true,
            message: "Friend request rejected",
            friendship,
        });
    } catch (error) {
        console.log("error reject required ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
