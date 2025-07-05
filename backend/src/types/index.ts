import { Request } from "express";
import { UserPayload } from "./user";

export interface UserRequest extends Request {
    user?: UserPayload;
}
