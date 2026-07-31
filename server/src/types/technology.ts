import { Document, Model, Types } from "mongoose";

export interface ITechnology extends Document {
    name: string;
    slug: string;
    description?: string;
    domains: Types.ObjectId[];
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TechnologyModel = Model<ITechnology>;
