import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import MasterData from "../models/MasterData";

export const getMasterData = async (req: AuthRequest, res: Response) => {
    try {
        const data = await MasterData.find().sort({ category: 1, sortOrder: 1, value: 1 }).lean();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve master data."
        });
    }
};

/**
 * @desc    Add Master Data Option
 * @route   POST /api/v1/master-data
 * @access  Private/Admin
 */
export const addMasterData = async (req: AuthRequest, res: Response) => {
    try {
        const { category, value } = req.body;

        if (!category || !value) {
            return res.status(400).json({
                success: false,
                message: "Category and value are required."
            });
        }

        const normalizedValue = value.trim();
        
        // Check if already exists
        const existing = await MasterData.findOne({ category, value: normalizedValue });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: `Option "${normalizedValue}" already exists in ${category}.`
            });
        }

        // Get max sortOrder for category to append to end
        const maxItem = await MasterData.findOne({ category }).sort({ sortOrder: -1 });
        const nextSortOrder = maxItem && typeof maxItem.sortOrder === "number" ? maxItem.sortOrder + 1 : 0;

        const option = await MasterData.create({
            category,
            value: normalizedValue,
            sortOrder: nextSortOrder
        });

        return res.status(201).json({
            success: true,
            message: "Option added successfully.",
            option
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add master data option."
        });
    }
};

/**
 * @desc    Reorder Master Data Options
 * @route   PUT /api/v1/master-data/reorder
 * @access  Private/Admin
 */
export const reorderMasterData = async (req: AuthRequest, res: Response) => {
    try {
        const { category, orderedIds } = req.body;

        if (!category || !Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: "Category and orderedIds array are required."
            });
        }

        const bulkOps = orderedIds.map((id: string, index: number) => ({
            updateOne: {
                filter: { _id: id, category },
                update: { $set: { sortOrder: index } }
            }
        }));

        if (bulkOps.length > 0) {
            await MasterData.bulkWrite(bulkOps);
        }

        const data = await MasterData.find({ category }).sort({ sortOrder: 1, value: 1 });

        return res.status(200).json({
            success: true,
            message: "Master data reordered successfully.",
            data
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reorder master data."
        });
    }
};

/**
 * @desc    Delete Master Data Option
 * @route   DELETE /api/v1/master-data/:id
 * @access  Private/Admin
 */
export const deleteMasterData = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const option = await MasterData.findById(id);
        if (!option) {
            return res.status(404).json({
                success: false,
                message: "Master data option not found."
            });
        }

        await option.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Option deleted successfully."
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete master data option."
        });
    }
};
