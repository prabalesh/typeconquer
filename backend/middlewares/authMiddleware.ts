import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { config } from "../config/config";

interface UserPayload {
    id: string;
    email: string;
    name: string;
}

interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies["authToken"];
    if (!token) return res.sendStatus(401);

    jwt.verify(
        token,
        config.JWT_SECRET,
        (err: VerifyErrors | null, decoded: unknown) => {
            if (err) {
                return res.sendStatus(403);
            }

            if (decoded) {
                req.user = decoded as UserPayload;
            }

            next();
        }
    );
};

export default authenticateToken;
