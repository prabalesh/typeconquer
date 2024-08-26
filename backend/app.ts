import express from "express";
import cors from "cors";

import homeRoutes from "./home/homeRoutes";

const app = express();

app.use(cors());

app.use(express.json());

// routes
app.use("/api", homeRoutes);

export default app;
