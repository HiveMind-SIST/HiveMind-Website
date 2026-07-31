import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IAdmin, IAdminMethods, AdminModel } from "../types/admin";

// Create Admin schema
const adminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            default: "admin",
            enum: ["admin", "superadmin"],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare password method
adminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const Admin = model<IAdmin, AdminModel>("Admin", adminSchema);
export default Admin;
