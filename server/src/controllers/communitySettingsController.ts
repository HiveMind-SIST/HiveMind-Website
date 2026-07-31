import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import CommunitySettings from "../models/CommunitySettings";

export const getCommunitySettings = async (req: AuthRequest, res: Response) => {
    try {
        const settings = await CommunitySettings.findOne().lean();
        return res.status(200).json({
            success: true,
            settings: settings || null
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch community settings."
        });
    }
};

/**
 * @desc    Update Community Settings
 * @route   PUT /api/v1/community-settings
 * @access  Private/Admin
 */
export const updateCommunitySettings = async (req: AuthRequest, res: Response) => {
    try {
        const {
            communityName,
            aboutCommunity,
            communityVoices,
            primaryEmail,
            contactNumber,
            tagline,
            foundedYear,
            location,
            github,
            linkedin,
            instagram,
            websiteUrl,
            logoUrl,
            alternateName,
            streetAddress,
            city,
            state,
            country,
            postalCode,
            parentOrganization,
            acceptingApplications
        } = req.body;

        let settings = await CommunitySettings.findOne();
        if (!settings) {
            settings = new CommunitySettings({
                communityName: communityName || "HiveMind",
                aboutCommunity: aboutCommunity || "HiveMind Community",
            });
        }

        if (communityName !== undefined) settings.communityName = communityName;
        if (aboutCommunity !== undefined) settings.aboutCommunity = aboutCommunity;
        if (primaryEmail !== undefined) settings.primaryEmail = primaryEmail;
        if (contactNumber !== undefined) settings.contactNumber = contactNumber;
        if (tagline !== undefined) settings.tagline = tagline;
        if (foundedYear !== undefined) settings.foundedYear = foundedYear;
        if (location !== undefined) settings.location = location;
        if (github !== undefined) settings.github = github;
        if (linkedin !== undefined) settings.linkedin = linkedin;
        if (instagram !== undefined) settings.instagram = instagram;
        if (websiteUrl !== undefined) settings.websiteUrl = websiteUrl;
        if (logoUrl !== undefined) settings.logoUrl = logoUrl;
        if (alternateName !== undefined) settings.alternateName = alternateName;
        if (streetAddress !== undefined) settings.streetAddress = streetAddress;
        if (city !== undefined) settings.city = city;
        if (state !== undefined) settings.state = state;
        if (country !== undefined) settings.country = country;
        if (postalCode !== undefined) settings.postalCode = postalCode;
        if (parentOrganization !== undefined) settings.parentOrganization = parentOrganization;
        if (acceptingApplications !== undefined) settings.acceptingApplications = acceptingApplications;

        if (Array.isArray(communityVoices)) {
            // Clean up voice objects: remove invalid/empty _id strings to avoid Mongoose CastErrors
            const sanitizedVoices = communityVoices.map((voice: any) => {
                const voiceObj = { ...voice };
                if (voiceObj._id !== undefined) {
                    if (typeof voiceObj._id !== "string" || voiceObj._id.trim().length !== 24) {
                        delete voiceObj._id;
                    }
                }
                return voiceObj;
            });
            settings.communityVoices = sanitizedVoices as any;
        }

        await settings.save();

        return res.status(200).json({
            success: true,
            message: "Community settings updated successfully.",
            settings
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update community settings."
        });
    }
};
