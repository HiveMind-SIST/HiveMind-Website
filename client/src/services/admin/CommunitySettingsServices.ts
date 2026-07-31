import axiosInstance from "../axiosInstance";

export interface ITestimonial {
    _id?: string;
    name: string;
    title: string;
    description: string;
    pic?: string;
}

export interface ICommunitySettings {
    _id?: string;
    communityName: string;
    aboutCommunity: string;
    primaryEmail: string;
    contactNumber: string;
    tagline: string;
    foundedYear: string;
    location: string;
    github: string;
    linkedin: string;
    instagram?: string;
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
    createdAt?: string;
    updatedAt?: string;
}

export interface CommunitySettingsResponse {
    success: boolean;
    message?: string;
    settings?: ICommunitySettings;
}

const CommunitySettingsServices = {
    getSettings: async (): Promise<CommunitySettingsResponse> => {
        const response = await axiosInstance.get<CommunitySettingsResponse>("/v1/community-settings");
        return response.data;
    },

    updateSettings: async (data: Partial<ICommunitySettings>): Promise<CommunitySettingsResponse> => {
        const response = await axiosInstance.put<CommunitySettingsResponse>("/v1/community-settings", data);
        return response.data;
    }
};

export default CommunitySettingsServices;
