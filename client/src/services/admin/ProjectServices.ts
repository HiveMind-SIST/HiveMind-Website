import axiosInstance from "../axiosInstance";
import { type TeamMember } from "./TeammanagemntServices";

export interface Project {
    _id: string;
    title: string;
    slug?: string;
    description: string;
    thumbnail: string;
    status: "Planning" | "Ongoing" | "Completed";
    duration: string;
    sortOrder?: number;
    collaborators: TeamMember[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectResponse {
    success: boolean;
    message?: string;
    projects?: Project[];
    project?: Project;
}

const ProjectServices = {
    getProjects: async (): Promise<ProjectResponse> => {
        const res = await axiosInstance.get("/v1/projects");
        return res.data;
    },

    createProject: async (data: any): Promise<ProjectResponse> => {
        const res = await axiosInstance.post("/v1/projects", data);
        return res.data;
    },

    updateProject: async (id: string, data: any): Promise<ProjectResponse> => {
        const res = await axiosInstance.put(`/v1/projects/${id}`, data);
        return res.data;
    },

    reorderProjects: async (orderedIds: string[]): Promise<ProjectResponse> => {
        const res = await axiosInstance.put("/v1/projects/reorder", { orderedIds });
        return res.data;
    },

    deleteProject: async (id: string): Promise<ProjectResponse> => {
        const res = await axiosInstance.delete(`/v1/projects/${id}`);
        return res.data;
    },
};

export default ProjectServices;
