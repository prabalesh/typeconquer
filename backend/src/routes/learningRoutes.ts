import { Router } from "express";
import { getAllModules, getLesson, getModule } from "../controllers/learningController";

const router = Router();

router.get("", getAllModules);
router.get("/lessons/:lessonSlug", getLesson);
router.get("/modules/:moduleSlug", getModule);

export default router;
