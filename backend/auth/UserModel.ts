import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
        googleID: {
            type: String,
            required: [true, "googeID is required"],
            unique: true,
        },
        lastLogin: {
            type: Date,
            default: new Date(),
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
