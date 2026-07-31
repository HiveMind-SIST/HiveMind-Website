import { Document, Model } from "mongoose";

export interface ITestimonial {
    name: string;
    title: string;
    description: string;
    pic?: string;
}

export interface ICommunitySettings extends Document {
    communityName: string;
    aboutCommunity: string;
    primaryEmail: string;
    contactNumber: string;
    tagline: string;
    foundedYear: string;
    location: string;
    github: string;
    linkedin: string;
    instagram: string;
    websiteUrl?: string;
    logoUrl?: string;
    alternateName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    parentOrganization?: string;
    acceptingApplications: boolean;
    communityVoices: ITestimonial[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type CommunitySettingsModel = Model<ICommunitySettings>;
