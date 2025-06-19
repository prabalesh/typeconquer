import { Router, Request, Response } from "express";
import getRandomParagraph, { Difficulty } from "../utils/paragraphGenerator";

const router = Router();

router.get("/generate-paragraph", async (req: Request, res: Response) => {
    const allowedDifficulties: Difficulty[] = ["easy", "medium", "hard"];

    const difficulty = (req.query.difficulty as string) || "medium";
    const includeNumbers = req.query.includeNumbers === "true";
    const includeSymbols = req.query.includeSymbols === "true";

    const validDifficulty: Difficulty = allowedDifficulties.includes(
        difficulty as Difficulty
    )
        ? (difficulty as Difficulty)
        : "medium";

    const words = await getRandomParagraph({
        wordCount: 100,
        difficulty: validDifficulty,
        includeNumbers,
        includeSymbols,
    });

    res.json({ words });
});

export default router;
