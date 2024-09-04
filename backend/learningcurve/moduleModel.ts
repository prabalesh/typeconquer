import mongoose from "mongoose";
import slugify from "slugify";

const ModuleSchema = new mongoose.Schema({
    slug: { type: String },
    name: { type: String, required: true },
    lessons: {
        type: [mongoose.Types.ObjectId],
        ref: "Lesson",
    },
});

ModuleSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const ModuleModel = mongoose.model("Module", ModuleSchema);

export default ModuleModel;
