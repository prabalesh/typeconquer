import express from "express";
import cors from "cors";

import homeRoutes from "./home/homeRoutes";
import authRoutes from "./auth/authRoutes";
import friendsRoutes from "./friendship/friendshipRoutes";

import typingTestsRoutes from "./typingtests/typingTestsRoutes";
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

export default app;
