import { Types } from "mongoose";

export interface FriendshipDto {
    requesterID: Types.ObjectId;
    friendshipID: Types.ObjectId;
}

export interface RemoveFriendShipDto {
    unfriend: Types.ObjectId;
}

export interface SendFriendRequestDto {
    username: string;
}