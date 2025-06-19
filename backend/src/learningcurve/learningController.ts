import { Request, Response } from "express";
import ModuleModel from "./moduleModel";
import LessonModel from "./lessonModel";

export const getAllModules = async (req: Request, res: Response) => {
    try {
        const modules = await ModuleModel.find().populate(
            "lessons _id name slug"
        );

        res.status(200).json({
            success: true,
            modules,
        });
    } catch (error) {
        console.error("Error fetching or creating modules:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
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

        const newLesson = new LessonModel({
            name,
            words,
            mode,
        });

        const savedLesson = await newLesson.save();

        res.status(201).json({
            success: true,
            lesson: savedLesson,
        });
    } catch (error) {
        console.error("Error inserting lesson:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getLesson = async (req: Request, res: Response) => {
    try {
        const { lessonSlug } = req.params;

        const lesson = await LessonModel.findOne({ slug: lessonSlug });

        res.status(200).json({
            success: true,
            lesson,
        });
    } catch (error) {
        console.error("Error fetching or creating modules:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getModule = async (req: Request, res: Response) => {
    try {
        const { moduleSlug } = req.params;

        const module = await ModuleModel.findOne({ slug: moduleSlug }).populate(
            {
                path: "lessons",
                select: "slug",
            }
        );

        res.status(200).json({
            success: true,
            module,
        });
    } catch (error) {
        console.error("Error fetching or creating modules:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
