import mongoose from "mongoose";
import BestTypingTestResult from "./bestTypingTestResult";

const typingTestResultSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        accuracy: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        wpm: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: Number,
            required: true,
            min: 1,
        },
        testDate: {
            type: Date,
            default: new Date(),
        },
        errorPoints: {
            type: [Number],
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

typingTestResultSchema.post("save", async function (this) {
    try {
        const bestResult = await BestTypingTestResult.findOne({
            userID: this.userID,
        });

        if (bestResult) {
            if (bestResult.bestWPM < this.wpm) {
                bestResult.bestWPM = this.wpm;
                bestResult.testResultID = this._id;
                await bestResult.save();
            }
        } else {
            await BestTypingTestResult.create({
                userID: this.userID,
                bestWPM: this.wpm,
                testResultID: this._id,
            });
        }
    } catch (error) {
        console.error("Error updating best typing test result:", error);
    }
});

export default mongoose.model("TypingTestResult", typingTestResultSchema);
