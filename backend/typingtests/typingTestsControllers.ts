import { Request, Response } from "express";
import TypingTestResult from "./TestResultModel";
import BestTypingTestResult from "./bestTypingTestResult";
import TestResultModel from "./TestResultModel";

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
        return res
            .status(401)
            .json({ success: false, message: "Login required!" });
    }
    try {
        const bestResult = await BestTypingTestResult.findOne({
            userID: req.user.id,
        });

        res.status(200).json({
            success: true,
            testResultID: bestResult ? bestResult.testResultID.toString() : "",
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

export const getTypingTestResult = async (req: UserRequest, res: Response) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, message: "Login required!" });
    }

    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "page and limit must be positive integers",
            });
        }

        const skip = (page - 1) * limit;

        const testResults = await TestResultModel.find({ userID: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched.",
            testResults,
        });
    } catch (error) {
        console.log("Error fetching test results: ", error);
        res.json(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
