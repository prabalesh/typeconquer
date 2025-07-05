import ModuleModel from "../models/moduleModel";
import LessonModel from "../models/lessonModel";

export const getAllModulesService = async () => {
    return await ModuleModel.find().populate("lessons", "_id name slug");
};

export const getModuleService = async (moduleSlug: string) => {
    return await ModuleModel.findOne({ slug: moduleSlug }).populate({
        path: "lessons",
        select: "slug",
    });
};

export const getLessonService = async (lessonSlug: string) => {
    return await LessonModel.findOne({ slug: lessonSlug });
};

export const addLessonService = async (name: string, words: string[], mode: string) => {
    const newLesson = new LessonModel({ name, words, mode });
    return await newLesson.save();
};
