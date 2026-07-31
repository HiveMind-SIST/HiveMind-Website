import { Schema, model } from "mongoose";
import { IProject, ProjectModel } from "../types/project";

const projectSchema = new Schema<IProject, ProjectModel>(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            minlength: [3, "Project title must be at least 3 characters"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Project description is required"],
            minlength: [10, "Project description must be at least 10 characters"],
            trim: true,
        },
        thumbnail: {
            type: String,
            required: [true, "Project thumbnail is required"],
            trim: true,
        },
        status: {
            type: String,
            required: [true, "Project status is required"],
            enum: {
                values: ["Planning", "Ongoing", "Completed"],
                message: "Status must be either Planning, Ongoing, or Completed",
            },
        },
        duration: {
            type: String,
            default: "",
            trim: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        collaborators: [
            {
                type: Schema.Types.ObjectId,
                ref: "Team",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for fast sorting and retrieval
projectSchema.index({ sortOrder: 1, createdAt: -1 });

// Pre-validate hook to generate slug dynamically
projectSchema.pre("validate", function (next) {
    if (this.title && (!this.slug || this.isModified("title"))) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});

export default model<IProject, ProjectModel>("Project", projectSchema);
