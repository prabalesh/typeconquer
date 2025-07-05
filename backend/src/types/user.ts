import { Types } from "mongoose";

export interface UserPayload {
    id: Types.ObjectId;
    username: string;
    name: string;
}