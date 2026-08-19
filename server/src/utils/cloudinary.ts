import crypto from "crypto";

export const getPublicIdFromUrl = (url: string): string | null => {
    try {
        if (!url || !url.includes("res.cloudinary.com")) return null;
        
        let uploadSegment = "/upload/";
        if (url.includes("/image/upload/")) {
            uploadSegment = "/image/upload/";
        } else if (url.includes("/raw/upload/")) {
            uploadSegment = "/raw/upload/";
        }

        const parts = url.split(uploadSegment);
        if (parts.length < 2) return null;
        
        let publicIdWithPath = parts[1];
        
        // Strip transformation flags if present (e.g. fl_inline/, fl_attachment/)
        if (publicIdWithPath.startsWith("fl_inline/")) {
            publicIdWithPath = publicIdWithPath.replace("fl_inline/", "");
        } else if (publicIdWithPath.startsWith("fl_attachment/")) {
            publicIdWithPath = publicIdWithPath.replace("fl_attachment/", "");
        }

        const match = publicIdWithPath.match(/^v\d+\/(.+)$/);
        if (match) {
            publicIdWithPath = match[1];
        }
        
        const dotIndex = publicIdWithPath.lastIndexOf(".");
        if (dotIndex !== -1 && !url.includes("/raw/upload/")) {
            publicIdWithPath = publicIdWithPath.substring(0, dotIndex);
        }
        return decodeURIComponent(publicIdWithPath);
    } catch (e) {
        return null;
    }
};

export const deleteFromCloudinary = async (url: string): Promise<boolean> => {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return false;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const resourceType = url.includes("/raw/upload/") ? "raw" : "image";

    if (!cloudName || !apiKey || !apiSecret) {
        console.warn("[Cloudinary] Credentials not configured in environment variables.");
        return false;
    }

    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                public_id: publicId,
                timestamp: timestamp.toString(),
                api_key: apiKey,
                signature: signature,
            }),
        });

        const data: any = await response.json();

        if (data && data.result === "ok") {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        return false;
    }
};
