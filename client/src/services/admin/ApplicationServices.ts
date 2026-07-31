import axiosInstance from "../axiosInstance";

export interface Application {
    _id: string;
    fullname: string;
    registerNumber: string;
    email: string;
    phoneNumber: string;
    dept: string;
    year: "1st" | "2nd" | "3rd" | "4th";
    linkedin: string;
    github?: string;
    resume: string; // Cloudinary URL
    portfolio?: string;
    domainOfInterest: string;
    programmingLanguages: string[];
    whyJoin: string;
    hoursPerWeek: number;
    howDidYouHear: string;
    status: "Pending" | "Interviewed" | "Approved" | "Rejected";
    interviewDate?: string;
    interviewTime?: string;
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApplicationResponse {
    success: boolean;
    message?: string;
    applicant?: Application;
    applications?: Application[];
}

const ApplicationServices = {
    applyMember: async (data: Omit<Application, "_id" | "status" | "createdAt" | "updatedAt">): Promise<ApplicationResponse> => {
        const response = await axiosInstance.post<ApplicationResponse>("/v1/applications/apply", data);
        return response.data;
    },

    getApplications: async (): Promise<ApplicationResponse> => {
        const response = await axiosInstance.get<ApplicationResponse>("/v1/applications");
        return response.data;
    },

    updateApplicationStatus: async (
        id: string, 
        status: Application["status"], 
        interviewDate?: string, 
        interviewTime?: string,
        rejectionReason?: string
    ): Promise<ApplicationResponse> => {
        const response = await axiosInstance.put<ApplicationResponse>(`/v1/applications/${id}/status`, { 
            status, 
            interviewDate, 
            interviewTime,
            rejectionReason
        });
        return response.data;
    },

    deleteApplication: async (id: string): Promise<ApplicationResponse> => {
        const response = await axiosInstance.delete<ApplicationResponse>(`/v1/applications/${id}`);
        return response.data;
    }
};

export default ApplicationServices;
