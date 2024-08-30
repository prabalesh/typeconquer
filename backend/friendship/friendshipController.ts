import { Request, Response } from "express";
import Friendship from "./FriendshipModel";

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
        }).populate("requester receiver");

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
    const { receiverId } = req.body;
    const userID = req.user.id;

    try {
        const existingRequest = await Friendship.findOne({
            requester: userID,
            receiver: receiverId,
            $or: [{ status: "pending" }, { status: "accepted" }],
        });

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Friend request already exists" });
        }

        const friendship = new Friendship({
            requester: userID,
            receiver: receiverId,
            status: "pending",
        });

        await friendship.save();
        res.status(201).json({ success: true, friendship });
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
        }).populate("requester");

        res.status(200).json(pendingRequests);
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
