import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import teamRoutes from "./routes/teamRoutes";
import projectRoutes from "./routes/projectRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import communitySettingsRoutes from "./routes/communitySettingsRoutes";
import masterDataRoutes from "./routes/masterDataRoutes";
import telemetryRoutes from "./routes/telemetryRoutes";
import domainRoutes from "./routes/domainRoutes";
import technologyRoutes from "./routes/technologyRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Enable trust proxy for reverse proxy / Cloudflare Tunnel setups (ensures secure cookies & client IP detection work)
app.set("trust proxy", 1);

// Connect to Database
connectDB();

// Dynamic Allowed Origins from environment + dev fallbacks
const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

const allowedOrigins = Array.from(new Set([
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hivemindsist.dev",
    "https://www.hivemindsist.dev",
    "https://hivemindsist.tech",
    "https://www.hivemindsist.tech",
    "https://hivemindsist.org",
    "https://www.hivemindsist.org",
    process.env.CLIENT_URL || "",
    ...envOrigins,
])).filter(Boolean);

// Middlewares
app.use(compression());
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like server-to-server or mobile requests)
            if (!origin) return callback(null, true);

            // Check if origin matches allowed domains or subdomains
            const isAllowed = allowedOrigins.some((allowed) => {
                const cleanAllowed = allowed.replace(/^https?:\/\//, "");
                const cleanOrigin = origin.replace(/^https?:\/\//, "");
                return cleanOrigin === cleanAllowed || cleanOrigin.endsWith("." + cleanAllowed);
            });

            if (isAllowed) {
                return callback(null, true);
            }

            return callback(new Error("CORS origin not allowed: " + origin));
        },
        credentials: true, // Allow HttpOnly cookies cross-origin
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/admin", authRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/community-settings", communitySettingsRoutes);
app.use("/api/v1/master-data", masterDataRoutes);
app.use("/api/v1/telemetry", telemetryRoutes);
app.use("/api/v1/domains", domainRoutes);
app.use("/api/v1/technologies", technologyRoutes);

// Health Check Route (Used for Docker HEALTHCHECK and Cloudflare Tunnel verification)
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "HiveMind API Server",
        timestamp: new Date().toISOString()
    });
});

// Start Server
const server = app.listen(PORT, () => {
    if (NODE_ENV === "development") {
        console.clear();
    }

    console.log(`
🚀 HiveMind API
Status       : Running
Environment  : ${NODE_ENV}
Port         : ${PORT}
API Base     : http://127.0.0.1:${PORT}/api/v1
Health Check : http://127.0.0.1:${PORT}/health
Started At   : ${new Date().toLocaleString()}
`);
});

// Graceful Shutdown Handlers
const handleShutdown = async (signal: string) => {
    console.log(`[${signal}] Received shutdown signal. Closing HTTP server and database connections gracefully...`);
    
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            await mongoose.connection.close(false);
            console.log("MongoDB connection closed cleanly.");
            process.exit(0);
        } catch (err) {
            console.error("Error closing MongoDB connection:", err);
            process.exit(1);
        }
    });

    // Force exit if shutdown takes longer than 10 seconds
    setTimeout(() => {
        console.error("Forceful shutdown: connections took too long to close.");
        process.exit(1);
    }, 10000);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
