import { Document, Model } from "mongoose";

export interface IMasterData extends Document {
    category: "department" | "section" | "batch" | "year" | "domain" | "techstack" | "programming_language" | "duration";
    value: string;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MasterDataModel = Model<IMasterData>;
