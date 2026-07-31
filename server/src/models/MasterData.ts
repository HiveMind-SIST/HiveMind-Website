import { Schema, model } from "mongoose";
import { IMasterData, MasterDataModel } from "../types/masterData";

const masterDataSchema = new Schema<IMasterData, MasterDataModel>(
    {
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["department", "section", "batch", "year", "domain", "techstack", "programming_language", "duration"],
                message: "Category must be department, section, batch, year, domain, techstack, programming_language, or duration"
            }
        },
        value: {
            type: String,
            required: [true, "Value is required"],
            trim: true
        },
        sortOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Compound index to guarantee uniqueness of value within a specific category
masterDataSchema.index({ category: 1, value: 1 }, { unique: true });
masterDataSchema.index({ category: 1, sortOrder: 1, value: 1 });

export const MasterData = model<IMasterData, MasterDataModel>("MasterData", masterDataSchema);
export default MasterData;
