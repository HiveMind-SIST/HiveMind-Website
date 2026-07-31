import { Schema, model } from "mongoose";
import { IDomain, DomainModel } from "../types/domain";

const domainSchema = new Schema<IDomain, DomainModel>(
    {
        name: {
            type: String,
            required: [true, "Domain name is required"],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: [true, "Domain slug is required"],
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        technologies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Technology",
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
domainSchema.index({ isActive: 1 });
domainSchema.index({ sortOrder: 1, isActive: 1 });

export const Domain = model<IDomain, DomainModel>("Domain", domainSchema);
export default Domain;
