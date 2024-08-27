import express from "express";
import cors from "cors";

import homeRoutes from "./home/homeRoutes";
import authRoutes from "./auth/authRoutes";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost",
            "http://localhost:5173",
            "http://192.168.18.85:5173",
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api", homeRoutes);
app.use("/api/auth", authRoutes);

export default app;
