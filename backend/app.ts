import express from "express";
import cors from "cors";

import homeRoutes from "./home/homeRoutes";
import authRoutes from "./auth/authRoutes";

const app = express();

app.use(cors());

app.use(express.json());

// routes
app.use("/api", homeRoutes);
app.use("/api/auth", authRoutes);

export default app;
