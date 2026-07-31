import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async (): Promise<void> => {
    try {
        const connString = process.env.MONGODB_URI;
        if (!connString) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        
        // Configure custom DNS servers to handle cases where the system/ISP DNS fails to resolve MongoDB Atlas SRV records
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        
                await mongoose.connect(connString);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
};
