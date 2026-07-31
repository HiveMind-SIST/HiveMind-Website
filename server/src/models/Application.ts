import mongoose, { Schema, Document } from "mongoose";
import { Application as IApplication } from "../types/application";

export interface ApplicationDocument extends Omit<IApplication, "_id" | "createdAt" | "updatedAt">, Document {
    createdAt?: Date;
    updatedAt?: Date;
}

const ApplicationSchema = new Schema<ApplicationDocument>(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required."],
            trim: true,
            minlength: [3, "Full name must be at least 3 characters."]
        },
        registerNumber: {
            type: String,
            required: [true, "Register number is required."],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email address is required."],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."]
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required."],
            trim: true
        },
        dept: {
            type: String,
            required: [true, "Department is required."],
            trim: true
        },
        year: {
            type: String,
            required: [true, "Academic year is required."],
            enum: {
                values: ["1st", "2nd", "3rd", "4th"],
                message: "Year must be 1st, 2nd, 3rd, or 4th."
            }
        },
        linkedin: {
            type: String,
            required: [true, "LinkedIn profile link is required."],
            trim: true,
            match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .%-]*)\/?$/i, "Please provide a valid LinkedIn URL."]
        },
        github: {
            type: String,
            trim: true,
            default: ""
        },
        resume: {
            type: String,
            required: [true, "Resume is required."],
            trim: true
        },
        portfolio: {
            type: String,
            trim: true,
            default: ""
        },
        domainOfInterest: {
            type: String,
            required: [true, "Domain of interest is required."],
            trim: true
        },
        programmingLanguages: {
            type: [String],
            required: [true, "Programming languages are required."],
            default: []
        },
        whyJoin: {
            type: String,
            required: [true, "Explanation of why you want to join is required."],
            trim: true,
            minlength: [10, "Response must be at least 10 characters."]
        },
        hoursPerWeek: {
            type: Number,
            required: [true, "Available hours per week is required."],
            min: [1, "Hours per week must be at least 1."]
        },
        howDidYouHear: {
            type: String,
            required: [true, "Referral source details are required."],
            trim: true
        },
        status: {
            type: String,
            enum: ["Pending", "Interviewed", "Approved", "Rejected"],
            default: "Pending"
        },
        interviewDate: {
            type: String,
            default: ""
        },
        interviewTime: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ApplicationDocument>("Application", ApplicationSchema);
