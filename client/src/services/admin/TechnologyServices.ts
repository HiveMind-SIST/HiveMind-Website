import axiosInstance from "../axiosInstance";

export interface TechnologyOption {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    domains: Array<{
        _id: string;
        name: string;
        slug: string;
        isActive: boolean;
    }>;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface TechnologyResponse {
    success: boolean;
    message?: string;
    data?: TechnologyOption;
    isReferenced?: boolean;
    projectCount?: number;
    linkedDomainCount?: number;
}

const TechnologyServices = {
    getTechnologies: async (domains?: string[]): Promise<{ success: boolean; data?: TechnologyOption[]; message?: string }> => {
        let url = "/v1/technologies";
        if (domains && domains.length > 0) {
            url += `?domains=${domains.join(",")}`;
        }
        const response = await axiosInstance.get<{ success: boolean; data?: TechnologyOption[]; message?: string }>(url);
        return response.data;
    },

    getTechnologyById: async (id: string): Promise<{ success: boolean; data?: TechnologyOption; message?: string }> => {
        const response = await axiosInstance.get<{ success: boolean; data?: TechnologyOption; message?: string }>(`/v1/technologies/${id}`);
        return response.data;
    },

    createTechnology: async (data: {
        name: string;
        description?: string;
        domains: string[];
        isActive: boolean;
        sortOrder: number;
    }): Promise<{ success: boolean; data?: TechnologyOption; message?: string }> => {
        const response = await axiosInstance.post<{ success: boolean; data?: TechnologyOption; message?: string }>("/v1/technologies", data);
        return response.data;
    },

    updateTechnology: async (id: string, data: {
        name?: string;
        description?: string;
        domains?: string[];
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<{ success: boolean; data?: TechnologyOption; message?: string }> => {
        const response = await axiosInstance.put<{ success: boolean; data?: TechnologyOption; message?: string }>(`/v1/technologies/${id}`, data);
        return response.data;
    },

    deleteTechnology: async (id: string, force: boolean = false): Promise<TechnologyResponse> => {
        const response = await axiosInstance.delete<TechnologyResponse>(`/v1/technologies/${id}${force ? "?force=true" : ""}`);
        return response.data;
    }
};

export default TechnologyServices;
