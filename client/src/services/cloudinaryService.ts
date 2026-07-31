import axios from "axios";
import axiosInstance from "./axiosInstance";

export interface CloudinaryUploadResponse {
    secure_url: string;
    public_id?: string;
    [key: string]: any;
}

export interface CloudinaryDeleteResponse {
    success: boolean;
    message?: string;
}

/**
 * Return the exact Cloudinary URL.
 */
export const getSafeResumeUrl = (url: string): string => {
    if (!url) return "#";
    return url;
};

const CloudinaryServices = {
    /**
     * Upload a file directly to Cloudinary using standard auto upload endpoint.
     */
    uploadToCloudinary: async (
        file: File | string,
        folder: string,
        onUploadProgress?: (percent: number) => void
    ): Promise<CloudinaryUploadResponse> => {
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            throw new Error("Cloudinary configuration missing in environment variables.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", folder);

        const response = await axios.post<CloudinaryUploadResponse>(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onUploadProgress) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onUploadProgress(percent);
                    }
                },
            }
        );

        return response.data;
    },

    /**
     * Request backend to delete an asset from Cloudinary by its URL.
     */
    deleteFromCloudinary: async (url: string): Promise<CloudinaryDeleteResponse> => {
        if (!url || !url.includes("res.cloudinary.com")) {
            return { success: false, message: "Invalid Cloudinary URL" };
        }
        const response = await axiosInstance.post<CloudinaryDeleteResponse>(
            "/v1/admin/cloudinary/delete",
            { url }
        );
        return response.data;
    },
};

export default CloudinaryServices;
