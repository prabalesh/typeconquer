import mongoose from "mongoose";

const bestTypingTestResultSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            required: true,
        },
        bestWPM: {
            type: Number,
            required: true,
            min: 0,
        },
        testResultID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TypingTestResult",
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "BestTypingTestResult",
    bestTypingTestResultSchema
);
