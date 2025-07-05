import { Request, Response } from "express";
import {
    getAllModulesService,
    getModuleService,
    getLessonService,
    addLessonService,
} from "../services/learningService";

export const getAllModules = async (req: Request, res: Response) => {
    try {
        const modules = await getAllModulesService();
        res.status(200).json({ success: true, modules });
    } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getModule = async (req: Request, res: Response) => {
    try {
        const { moduleSlug } = req.params;
        const module = await getModuleService(moduleSlug);
        res.status(200).json({ success: true, module });
    } catch (error) {
        console.error("Error fetching module:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getLesson = async (req: Request, res: Response) => {
    try {
        const { lessonSlug } = req.params;
        const lesson = await getLessonService(lessonSlug);
        res.status(200).json({ success: true, lesson });
    } catch (error) {
        console.error("Error fetching lesson:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addLesson = async (req: Request, res: Response) => {
    try {
        const { name, words, mode } = req.body;

        if (!name || !words || !mode) {
            return res.status(400).json({
                success: false,
                message: "Name, words, and mode are required.",
            });
        }

        const lesson = await addLessonService(name, words, mode);
        res.status(201).json({ success: true, lesson });
    } catch (error) {
        console.error("Error adding lesson:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
