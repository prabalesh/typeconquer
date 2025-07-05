import express from "express";
import cors from "cors";

import homeRoutes from "./routes/homeRoutes";
import authRoutes from "./routes/authRoutes";
import friendsRoutes from "./routes/friendshipRoutes";
import challeneRoutes from "./routes/challengeRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import learningRoutes from "./routes/learningRoutes";

import typingTestsRoutes from "./routes/typingTestsRoutes";
import cookieParser from "cookie-parser";
import { config } from "./config/config";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost",
            "http://localhost:5173",
            config.FRONTEND_URL,
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/typingtests", typingTestsRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/challenges", challeneRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/learning", learningRoutes);

export default app;
