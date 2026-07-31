import { Document, Model } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "superadmin";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAdminMethods {
    comparePassword(password: string): Promise<boolean>;
}

export type AdminModel = Model<IAdmin, {}, IAdminMethods>;
