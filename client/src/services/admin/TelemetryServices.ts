import axiosInstance from "../axiosInstance";

export interface IDashboardActivity {
    id: string;
    type: "member" | "project" | "application";
    title: string;
    description: string;
    timestamp: string;
}

export interface IDepartmentCount {
    department: string;
    count: number;
}

export interface IDashboardStats {
    totalMembers: number;
    totalProjects: number;
    pendingApplications: number;
    recentActivities: IDashboardActivity[];
    departmentDistribution: IDepartmentCount[];
}

export interface TelemetryStatsResponse {
    success: boolean;
    message?: string;
    stats?: IDashboardStats;
}

const TelemetryServices = {
    getDashboardStats: async (): Promise<TelemetryStatsResponse> => {
        const response = await axiosInstance.get<TelemetryStatsResponse>("/v1/telemetry/stats");
        return response.data;
    }
};

export default TelemetryServices;

