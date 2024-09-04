import mongoose from "mongoose";
import slugify from "slugify";

const LessonSchema = new mongoose.Schema({
    slug: { type: String, unique: true },
    name: { type: String, required: true },
    words: { type: String, required: true },
    mode: { type: String, enum: ["introduction", "practice"], required: true },
});

LessonSchema.pre("save", async function (next) {
    if (this.isModified("name") || this.isNew) {
        try {
            let slug = slugify(this.name, { lower: true, strict: true });

            if (!slug) {
                slug = "default-slug";
            }

            while (await mongoose.models.Lesson.exists({ slug })) {
                slug = `${slugify(this.name, {
                    lower: true,
                    strict: true,
                })}-${Math.floor(Math.random() * 1000)}`;
            }

            this.slug = slug;
        } catch (error) {
            console.error("Error generating slug:", error);
        }
    }
    next();
});

const LessonModel = mongoose.model("Lesson", LessonSchema);

export default LessonModel;
