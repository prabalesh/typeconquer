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

const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
            lowercase: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        googleID: {
            type: String,
            required: [true, "googleID is required"],
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
