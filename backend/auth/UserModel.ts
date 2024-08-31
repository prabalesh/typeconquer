import mongoose from "mongoose";

const generateUsername = (name: string) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${name.replace(/\s+/g, "").toLowerCase()}${randomNum}`;
};

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
        username: {
            type: String,
            unique: true,
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

export default mongoose.model("User", userSchema);
