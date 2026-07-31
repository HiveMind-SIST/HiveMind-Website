import { Schema, model } from "mongoose";
import { ITeam, TeamModel } from "../types/team";

const teamSchema = new Schema<ITeam, TeamModel>(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            minlength: [3, "Full name must be at least 3 characters"],
            trim: true,
        },
        registerNumber: {
            type: String,
            default: "N/A",
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        },
        pic: {
            type: String,
            trim: true,
            default: "",
        },
        department: {
            type: String,
            default: "Faculty",
            trim: true,
        },
        section: {
            type: String,
            default: "N/A",
            trim: true,
        },
        year: {
            type: String,
            default: "N/A",
            enum: {
                values: ["1st", "2nd", "3rd", "4th", "Faculty", "N/A"],
                message: "Year must be 1st, 2nd, 3rd, 4th, Faculty, or N/A",
            },
        },
        Linkedin: {
            type: String,
            trim: true,
            default: "",
        },
        github: {
            type: String,
            trim: true,
            default: "",
        },
        batch: {
            type: String,
            default: "Faculty",
            trim: true,
        },
        role: {
            type: String,
            enum: ["Faculty Mentor", "Member"],
            default: "Member",
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

teamSchema.index({ sortOrder: 1 });
teamSchema.index({ createdAt: 1 });
teamSchema.index({ registerNumber: 1 });

export const Team = model<ITeam, TeamModel>("Team", teamSchema);
export default Team;
