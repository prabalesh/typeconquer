import { Response } from "express";
import {
    getAllFriendsService,
    sendFriendRequestService,
    getPendingRequestsService,
    removeFriendService,
    acceptFriendRequestService,
    rejectFriendRequestService,
} from "../services/friendshipService";
import { UserRequest } from "../types";

export const getAllFriends = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);

    try {
        const friends = await getAllFriendsService(req.user.id);
        res.status(200).json({ success: true, friends });
    } catch (error) {
        console.log("Error fetching friends", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const sendFriendRequest = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);
    const { username } = req.body;

    try {
        await sendFriendRequestService(req.user.id, username);
        res.status(201).json({ success: true, message: "Friend request sent successfully" });
    } catch (error) {
        console.log("Error sending friend request", error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getPendingRequests = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);

    try {
        const pendingRequests = await getPendingRequestsService(req.user.id);
        res.status(200).json({ success: true, pendingRequests });
    } catch (error) {
        console.log("Error fetching pending requests", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFriend = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);
    const { unfriend } = req.body;

    try {
        await removeFriendService(req.user.id, unfriend);
        res.status(200).json({ message: "Friendship removed successfully" });
    } catch (error) {
        console.log("Error removing friend", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);
    const { friendshipID, requesterID } = req.body;

    try {
        const friendship = await acceptFriendRequestService(req.user.id, friendshipID, requesterID);
        res.status(200).json({ success: true, message: "Friend request accepted", friendship });
    } catch (error) {
        console.log("Error accepting friend request", error);
        res.status(404).json({ message: "Internal server error" });
    }
};

export const rejectFriendRequest = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401);
    const { friendshipID, requesterID } = req.body;

    try {
        const friendship = await rejectFriendRequestService(
            req.user.id,
            friendshipID,
            requesterID,
            req.user.name
        );
        res.status(200).json({ success: true, message: "Friend request rejected", friendship });
    } catch (error) {
        console.log("Error rejecting friend request", error);
        res.status(404).json({ message: "Internal server error" });
    }
};
