import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { AuthRequest } from "../middleware/authMiddleware";

// Core Email & Password Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePassword = (password: string) => {
    return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Core input checks
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // 2. Validate email structure
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        // 3. Core validation check on password strength
        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet required criteria: must include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
            });
        }

        // 4. Find Admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // 5. Verify Password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // 6. Sign JWT Token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ success: false, message: "Server error: JWT Secret is not configured." });
        }

        const token = jwt.sign({ id: admin._id }, jwtSecret, {
            expiresIn: "1d",
        });

        // 7. Store JWT in an HttpOnly cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction, // Set to true only in production (HTTPS required)
            sameSite: isProduction ? "none" : "lax", // Must be none in production cross-site contexts
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            success: true,
            message: "LoggedIn successfully.",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error during login." });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
        return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error during logout process." });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.admin) {
            return res.status(401).json({ success: false, message: "Not authenticated." });
        }
        return res.status(200).json({
            success: true,
            admin: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
                role: req.admin.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error fetching admin session details." });
    }
};
