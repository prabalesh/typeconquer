import mongoose, { Document, Types } from "mongoose";

export interface IChallenge extends Document {
    challenger: Types.ObjectId;
    challengedFriend: Types.ObjectId;
    typingTestResult: Types.ObjectId;
    friendTestResult?: Types.ObjectId;
    status: "pending" | "accepted" | "declined" | "completed";
    challengeDate: Date;
    completedDate?: Date;
    winner?: Types.ObjectId;
    determineWinner: () => Promise<void>;
}

const challengeSchema = new mongoose.Schema(
    {
        challenger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        challengedFriend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        typingTestResult: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TypingTestResult",
            required: true,
        },
        friendTestResult: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TypingTestResult",
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined", "completed"],
            default: "pending",
        },
        challengeDate: {
            type: Date,
            default: new Date(),
        },
        completedDate: {
            type: Date,
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

challengeSchema.methods.determineWinner = async function () {
    const challengerTestResult = await mongoose
        .model("TypingTestResult")
        .findById(this.typingTestResult);
    const friendTestResult = await mongoose
        .model("TypingTestResult")
        .findById(this.friendTestResult);

    if (!challengerTestResult || !friendTestResult) {
        throw new Error(
            "Both typing test results must be available to determine a winner."
        );
    }

    if (friendTestResult.wpm > challengerTestResult.wpm) {
        this.winner = this.challengedFriend;
    } else if (friendTestResult.wpm < challengerTestResult.wpm) {
        this.winner = this.challenger;
    } else {
        if (friendTestResult.accuracy > challengerTestResult.accuracy) {
            this.winner = this.challengedFriend;
        } else {
            this.winner = this.challenger;
        }
    }

    this.status = "completed";
    this.completedDate = new Date();

    await this.save();
};

export default mongoose.model("Challenge", challengeSchema);
