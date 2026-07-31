import axiosInstance from "../axiosInstance";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    admin?: AdminUser;
}

const authService = {
    /**
     * Authenticates admin and establishes the HttpOnly cookie session.
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>("/v1/admin/login", {
            email,
            password,
        });
        return response.data;
    },

    /**
     * Clears the session cookie on the backend.
     */
    logout: async (): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>("/v1/admin/logout");
        return response.data;
    },

    /**
     * Checks if current user is logged in by validating their HttpOnly session cookie.
     */
    getAdminStatus: async (): Promise<AuthResponse> => {
        const response = await axiosInstance.get<AuthResponse>("/v1/admin/me");
        return response.data;
    },
};

export default authService;
