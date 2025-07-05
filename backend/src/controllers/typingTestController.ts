import { Response } from "express";
import { UserRequest } from "../types";
import {
    createTypingTestResultService,
    getBestWPMService,
    getTypingTestResultService,
} from "../services/typingTestService";
import { CreateTypingTestResultRequestDto } from "../dtos/typingTestDtos";

export const createTypingTestResult = async (req: UserRequest<object, unknown, CreateTypingTestResultRequestDto>, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const result = await createTypingTestResultService(req.user.id, req.body);
        return res.status(201).json({ success: true, result });
    } catch (error) {
        console.error("Failed to create typing result:", error);
        return res.status(500).json({ success: false, message: "Failed to upload test result" });
    }
};

export const getBestWPM = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Login required!" });

    try {
        const result = await getBestWPMService(req.user.id);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error("Error fetching best WPM:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTypingTestResult = async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Login required!" });

    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be positive integers",
            });
        }

        const testResults = await getTypingTestResultService(req.user.id, page, limit);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched.",
            testResults,
        });
    } catch (error) {
        console.error("Error fetching test results:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
