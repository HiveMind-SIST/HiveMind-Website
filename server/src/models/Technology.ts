import { Schema, model } from "mongoose";
import { ITechnology, TechnologyModel } from "../types/technology";

const technologySchema = new Schema<ITechnology, TechnologyModel>(
    {
        name: {
            type: String,
            required: [true, "Technology name is required"],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: [true, "Technology slug is required"],
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        domains: [
            {
                type: Schema.Types.ObjectId,
                ref: "Domain",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
technologySchema.index({ isActive: 1 });
technologySchema.index({ sortOrder: 1, isActive: 1 });

export const Technology = model<ITechnology, TechnologyModel>("Technology", technologySchema);
export default Technology;
