import axiosInstance from "../axiosInstance";

export interface DomainOption {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    technologies: Array<{
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

export interface DomainResponse {
    success: boolean;
    message?: string;
    data?: DomainOption;
    isReferenced?: boolean;
    projectCount?: number;
    linkedTechCount?: number;
}

const DomainServices = {
    getDomains: async (): Promise<{ success: boolean; data?: DomainOption[]; message?: string }> => {
        const response = await axiosInstance.get<{ success: boolean; data?: DomainOption[]; message?: string }>("/v1/domains");
        return response.data;
    },

    getDomainById: async (id: string): Promise<{ success: boolean; data?: DomainOption; message?: string }> => {
        const response = await axiosInstance.get<{ success: boolean; data?: DomainOption; message?: string }>(`/v1/domains/${id}`);
        return response.data;
    },

    createDomain: async (data: {
        name: string;
        description?: string;
        technologies: string[];
        isActive: boolean;
        sortOrder: number;
    }): Promise<{ success: boolean; data?: DomainOption; message?: string }> => {
        const response = await axiosInstance.post<{ success: boolean; data?: DomainOption; message?: string }>("/v1/domains", data);
        return response.data;
    },

    updateDomain: async (id: string, data: {
        name?: string;
        description?: string;
        technologies?: string[];
        isActive?: boolean;
        sortOrder?: number;
    }): Promise<{ success: boolean; data?: DomainOption; message?: string }> => {
        const response = await axiosInstance.put<{ success: boolean; data?: DomainOption; message?: string }>(`/v1/domains/${id}`, data);
        return response.data;
    },

    deleteDomain: async (id: string, force: boolean = false): Promise<DomainResponse> => {
        const response = await axiosInstance.delete<DomainResponse>(`/v1/domains/${id}${force ? "?force=true" : ""}`);
        return response.data;
    }
};

export default DomainServices;
