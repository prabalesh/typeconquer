import { Types } from "mongoose";

export interface CreateChallengeDto {
    challengedFriendID: Types.ObjectId;
    typingTestResultID: Types.ObjectId;
}

export interface GetChallengeDto {
    challengeID: Types.ObjectId;
}

export interface SubmitChallengeDto {
    challengeID: Types.ObjectId;
    friendTestResultID: Types.ObjectId;
}

export interface DeclineChallengeDto {
    challengeID: Types.ObjectId;
}