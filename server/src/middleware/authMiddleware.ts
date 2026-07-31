import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { IAdmin } from "../types/admin";

interface JwtPayload {
    id: string;
}

export interface AuthRequest extends Request {
    admin?: IAdmin;
}

export const protectAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication required. Please log in." });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ success: false, message: "Server configuration error: JWT Secret is missing." });
        }

        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // Retrieve admin user and attach to request
        const adminDoc = await Admin.findById(decoded.id).select("-password");
        if (!adminDoc) {
            return res.status(401).json({ success: false, message: "User session not found." });
        }

        req.admin = adminDoc;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Session expired or invalid. Please log in again." });
    }
};
