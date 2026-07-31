import axiosInstance from "../axiosInstance";

export interface TeamMember {
    _id: string;
    fullname: string;
    registerNumber: string;
    email: string;
    pic?: string;
    department: string;
    section: string;
    year: "1st" | "2nd" | "3rd" | "4th" | "Faculty" | "N/A";
    Linkedin?: string;
    github?: string;
    batch: string;
    role?: "Faculty Mentor" | "Member";
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeamResponse {
    success: boolean;
    message?: string;
    member?: TeamMember;
    members?: TeamMember[];
}

const TeamManagementServices = {
    getTeamMembers: async (): Promise<TeamResponse> => {
        const response = await axiosInstance.get<TeamResponse>("/v1/team");
        return response.data;
    },

    reorderTeamMembers: async (orderedIds: string[]): Promise<TeamResponse> => {
        const response = await axiosInstance.put<TeamResponse>("/v1/team/reorder", { orderedIds });
        return response.data;
    },

    createTeamMember: async (data: Omit<TeamMember, "_id" | "createdAt" | "updatedAt">): Promise<TeamResponse> => {
        const response = await axiosInstance.post<TeamResponse>("/v1/team", data);
        return response.data;
    },

    updateTeamMember: async (id: string, data: Partial<Omit<TeamMember, "_id" | "createdAt" | "updatedAt">>): Promise<TeamResponse> => {
        const response = await axiosInstance.put<TeamResponse>(`/v1/team/${id}`, data);
        return response.data;
    },

    deleteTeamMember: async (id: string): Promise<TeamResponse> => {
        const response = await axiosInstance.delete<TeamResponse>(`/v1/team/${id}`);
        return response.data;
    },
};

export default TeamManagementServices;
