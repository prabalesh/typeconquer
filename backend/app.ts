import express from "express";
import cors from "cors";

import getRandomParagraph from "./utils/paragraphGenerator";
import { Difficulty } from "./utils/paragraphGenerator";

const app = express();

app.use(cors());

app.use(express.json());

// routes
app.get("/", (req, res) => {
    const allowedDifficulties: Difficulty[] = ["easy", "medium", "hard"];

    const difficulty = (req.query.difficulty as string) || "medium";
    const includeNumbers = req.query.includeNumbers === "true";
    const includeSymbols = req.query.includeSymbols === "true";

    const validDifficulty: Difficulty = allowedDifficulties.includes(
        difficulty as Difficulty
    )
        ? (difficulty as Difficulty)
        : "medium";

    const words = getRandomParagraph({
        wordCount: 100,
        difficulty: validDifficulty,
        includeNumbers,
        includeSymbols,
    });

    res.json({ words });
});

export default app;
