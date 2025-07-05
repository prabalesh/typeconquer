import mongoose, { Schema, Document } from "mongoose";
import generateUsername from "../utils/generateUsername";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    username: string;
    password?: string;
    googleID?: string;
    lastLogin: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: String,
        googleID: {
            type: String,
            required: true,
            unique: true,
        },
        lastLogin: {
            type: Date,
            default: new Date(),
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.username) {
        let username = generateUsername(this.name);
        let userExists = await mongoose.models.User.exists({ username });

        while (userExists) {
            username = generateUsername(this.name);
            userExists = await mongoose.models.User.exists({ username });
        }

        this.username = username;
    }

    next();
});

export default mongoose.model<IUser>("User", userSchema);