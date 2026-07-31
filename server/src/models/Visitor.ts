import { Schema, model, Document } from "mongoose";

export interface IVisitor extends Document {
    ip: string;
    userAgent?: string;
    path?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const visitorSchema = new Schema<IVisitor>(
    {
        ip: {
            type: String,
            required: true,
            trim: true,
        },
        userAgent: {
            type: String,
            trim: true,
        },
        path: {
            type: String,
            trim: true,
            default: "/",
        },
    },
    {
        timestamps: true,
    }
);

export const Visitor = model<IVisitor>("Visitor", visitorSchema);
export default Visitor;
