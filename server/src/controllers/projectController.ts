import { Request, Response } from "express";
import Project from "../models/Project";
import { deleteFromCloudinary } from "../utils/cloudinary";

// GET /api/v1/projects
export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({}).populate("collaborators").sort({ sortOrder: 1, createdAt: -1 }).lean();
        return res.status(200).json({ success: true, projects });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error fetching projects." });
    }
};

// POST /api/v1/projects
export const createProject = async (req: Request, res: Response) => {
    try {
        const { title, description, thumbnail, status, duration, collaborators } = req.body;

        // 1. Check required fields
        if (!title || !description || !thumbnail || !status || !collaborators) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, description, thumbnail, status, and collaborators are required." 
            });
        }

        if (status === "Completed" && (!duration || !duration.trim())) {
            return res.status(400).json({
                success: false,
                message: "Project duration is required for completed projects."
            });
        }

        // 2. Validate status values
        if (!["Planning", "Ongoing", "Completed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid project status. Must be Planning, Ongoing, or Completed." });
        }

        // 3. Validate lengths
        if (title.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Project title must be at least 3 characters." });
        }
        if (description.trim().length < 10) {
            return res.status(400).json({ success: false, message: "Project description must be at least 10 characters." });
        }

        // 4. Validate collaborators format
        if (!Array.isArray(collaborators)) {
            return res.status(400).json({ success: false, message: "Collaborators must be an array of member IDs." });
        }

        // Find max sortOrder to place new project at the end of sorted list
        const maxProject = await Project.findOne({}).sort({ sortOrder: -1 }).select("sortOrder");
        const nextSortOrder = maxProject && maxProject.sortOrder !== undefined ? maxProject.sortOrder + 1 : 0;

        const newProject = new Project({
            title: title.trim(),
            description: description.trim(),
            thumbnail,
            status,
            duration: status === "Completed" ? (duration ? duration.trim() : "") : "",
            collaborators,
            sortOrder: nextSortOrder,
        });

        await newProject.save();

        return res.status(201).json({
            success: true,
            message: "Project created successfully.",
            project: newProject,
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error creating project." });
    }
};

// PUT /api/v1/projects/reorder
export const reorderProjects = async (req: Request, res: Response) => {
    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                success: false,
                message: "orderedIds array is required."
            });
        }

        const bulkOps = orderedIds.map((id: string, index: number) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { sortOrder: index } }
            }
        }));

        if (bulkOps.length > 0) {
            await Project.bulkWrite(bulkOps);
        }

        return res.status(200).json({
            success: true,
            message: "Projects reordered successfully."
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reorder projects."
        });
    }
};

// PUT /api/v1/projects/:id
export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnail, status, duration, collaborators } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        // Validations
        if (title !== undefined) {
            if (title.trim().length < 3) {
                return res.status(400).json({ success: false, message: "Project title must be at least 3 characters." });
            }
            project.title = title.trim();
        }

        if (description !== undefined) {
            if (description.trim().length < 10) {
                return res.status(400).json({ success: false, message: "Project description must be at least 10 characters." });
            }
            project.description = description.trim();
        }

        if (status !== undefined) {
            if (!["Planning", "Ongoing", "Completed"].includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid project status." });
            }
            project.status = status;
            if (status !== "Completed") {
                project.duration = "";
            }
        }

        if (duration !== undefined && project.status === "Completed") {
            project.duration = duration.trim();
        }

        if (collaborators !== undefined) {
            if (!Array.isArray(collaborators)) {
                return res.status(400).json({ success: false, message: "Collaborators must be an array of IDs." });
            }
            project.collaborators = collaborators;
        }

        let oldThumbnailUrl = "";
        if (thumbnail !== undefined) {
            if (thumbnail !== project.thumbnail && project.thumbnail) {
                oldThumbnailUrl = project.thumbnail;
            }
            project.thumbnail = thumbnail;
        }

        await project.save();

        if (oldThumbnailUrl) {
            deleteFromCloudinary(oldThumbnailUrl).catch(err => {});
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project,
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating project." });
    }
};

// DELETE /api/v1/projects/:id
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        const thumbnailUrl = project.thumbnail;

        await Project.findByIdAndDelete(id);

        if (thumbnailUrl) {
            deleteFromCloudinary(thumbnailUrl).catch(err => {});
        }

        return res.status(200).json({ success: true, message: "Project deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error deleting project." });
    }
};
