import { Document, Model, Types } from "mongoose";

export interface IDomain extends Document {
    name: string;
    slug: string;
    description?: string;
    technologies: Types.ObjectId[];
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type DomainModel = Model<IDomain>;
