import { Schema, model } from "mongoose";
import { ICommunitySettings, CommunitySettingsModel, ITestimonial } from "../types/communitySettings";

const testimonialSchema = new Schema<ITestimonial>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Title/Role/Designation is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        pic: {
            type: String,
            trim: true,
            default: "",
        },
    }
);

const communitySettingsSchema = new Schema<ICommunitySettings, CommunitySettingsModel>(
    {
        communityName: {
            type: String,
            required: [true, "Community Name is required"],
            trim: true,
            default: "HiveMind",
        },
        aboutCommunity: {
            type: String,
            required: [true, "About Community description is required"],
            trim: true,
        },
        primaryEmail: {
            type: String,
            trim: true,
            default: "hivemindsist@gmail.com",
        },
        contactNumber: {
            type: String,
            trim: true,
            default: "",
        },
        tagline: {
            type: String,
            trim: true,
            default: "",
        },
        foundedYear: {
            type: String,
            trim: true,
            default: "",
        },
        location: {
            type: String,
            trim: true,
            default: "",
        },
        github: {
            type: String,
            trim: true,
            default: "",
        },
        linkedin: {
            type: String,
            trim: true,
            default: "",
        },
        instagram: {
            type: String,
            trim: true,
            default: "",
        },
        websiteUrl: {
            type: String,
            trim: true,
            default: "https://hivemindsist.dev",
        },
        logoUrl: {
            type: String,
            trim: true,
            default: "https://res.cloudinary.com/n348amus/image/upload/v1785232370/HiveMind_logo_2_fv3nox.png",
        },
        alternateName: {
            type: String,
            trim: true,
            default: "HiveMind AI Community",
        },
        streetAddress: {
            type: String,
            trim: true,
            default: "AI Supercomputing Laboratory, School of Computing, Sathyabama Institute of Science and Technology",
        },
        city: {
            type: String,
            trim: true,
            default: "Chennai",
        },
        state: {
            type: String,
            trim: true,
            default: "Tamil Nadu",
        },
        country: {
            type: String,
            trim: true,
            default: "India",
        },
        postalCode: {
            type: String,
            trim: true,
            default: "",
        },
        parentOrganization: {
            type: String,
            trim: true,
            default: "Sathyabama Institute of Science and Technology",
        },
        acceptingApplications: {
            type: Boolean,
            default: true,
        },
        communityVoices: [testimonialSchema],
    },
    {
        timestamps: true,
    }
);

export const CommunitySettings = model<ICommunitySettings, CommunitySettingsModel>(
    "CommunitySettings",
    communitySettingsSchema
);

export default CommunitySettings;

