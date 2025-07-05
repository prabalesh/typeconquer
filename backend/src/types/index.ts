import { Request } from "express";
import { UserPayload } from "./user";

export interface UserRequest<
    Params = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = Record<string, string>
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
    user?: UserPayload;
}
