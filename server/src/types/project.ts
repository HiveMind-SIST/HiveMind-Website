import { Document, Model, Types } from "mongoose";

export interface IProject extends Document {
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    status: "Planning" | "Ongoing" | "Completed";
    duration: string;
    sortOrder: number;
    collaborators: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type ProjectModel = Model<IProject>;
