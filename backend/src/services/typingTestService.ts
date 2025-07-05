import TypingTestResult from "../models/testResultModel";
import BestTypingTestResult from "../models/bestTypingTestResult";
import { Types } from "mongoose";
import { CreateTypingTestResultRequestDto } from "../dtos/typingTestDtos";

export async function createTypingTestResultService(userID: Types.ObjectId, data: CreateTypingTestResultRequestDto) {
    const { accuracy, wpm, duration, errorPoints, text } = data;

    return await TypingTestResult.create({
        userID,
        accuracy,
        wpm,
        duration,
        errorPoints,
        text,
    });
}

export async function getBestWPMService(userID: Types.ObjectId) {
    const bestResult = await BestTypingTestResult.findOne({ userID });

    return {
        testResultID: bestResult ? bestResult.testResultID.toString() : "",
        bestWPM: bestResult ? bestResult.bestWPM : 0,
    };
}

export async function getTypingTestResultService(userID: Types.ObjectId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const testResults = await TypingTestResult.find({ userID })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return testResults;
}
