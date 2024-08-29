import { Request, Response } from "express";
import TypingTestResult from "./TestResultModel";
import BestTypingTestResult from "./bestTypingTestResult";

interface UserPayload {
    id: string;
    email: string;
    name: string;
}
interface UserRequest extends Request {
    user?: UserPayload;
}

export const createTypingTestResult = async (
    req: UserRequest,
    res: Response
) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { accuracy, wpm, duration, errorPoints, text } = req.body;

    try {
        const testResult = await TypingTestResult.create({
            userID: req.user.id,
            accuracy,
            wpm: wpm,
            duration,
            errorPoints,
            text,
        });

        return res.status(201).json({ success: true, result: testResult });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to upload test result" });
    }
};

export const getBestWPM = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(401);
    }
    try {
        const bestResult = await BestTypingTestResult.findOne({
            userID: req.user.id,
        });

        res.status(200).json({
            success: true,
            bestWPM: bestResult ? bestResult.bestWPM : 0,
        });
    } catch (error) {
        console.error("Error fetching best WPM:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
