import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Domain from "../models/Domain";
import Technology from "../models/Technology";
import Project from "../models/Project";
import { slugify } from "../utils/slugify";

/**
 * @desc    Get all Domains
 * @route   GET /api/v1/domains
 * @access  Public
 */
export const getDomains = async (req: AuthRequest, res: Response) => {
    try {
        const domains = await Domain.find()
            .populate("technologies", "name slug isActive")
            .sort({ sortOrder: 1, name: 1 });

        return res.status(200).json({
            success: true,
            data: domains,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve domains.",
        });
    }
};

/**
 * @desc    Get Domain by ID
 * @route   GET /api/v1/domains/:id
 * @access  Public
 */
export const getDomainById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const domain = await Domain.findById(id).populate("technologies", "name slug isActive");
        
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: "Domain not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: domain,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve domain.",
        });
    }
};

/**
 * @desc    Create Domain
 * @route   POST /api/v1/domains
 * @access  Private/Admin
 */
export const createDomain = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, technologies, isActive, sortOrder } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Domain name is required.",
            });
        }

        const normalizedName = name.trim();
        const slug = slugify(normalizedName);

        // Case-insensitive name duplicate check
        const existingName = await Domain.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });
        if (existingName) {
            return res.status(400).json({
                success: false,
                message: `Domain name "${normalizedName}" already exists.`,
            });
        }

        // Case-insensitive slug duplicate check
        const existingSlug = await Domain.findOne({ slug });
        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: `Domain slug "${slug}" already exists.`,
            });
        }

        // Validate technologies array
        const techIds = Array.isArray(technologies) ? technologies : [];

        const newDomain = await Domain.create({
            name: normalizedName,
            slug,
            description: description ? description.trim() : "",
            technologies: techIds,
            isActive: isActive !== false,
            sortOrder: Number(sortOrder) || 0,
        });

        // Sync reverse relationships in Technology documents
        if (techIds.length > 0) {
            await Technology.updateMany(
                { _id: { $in: techIds } },
                { $addToSet: { domains: newDomain._id } }
            );
        }

        return res.status(201).json({
            success: true,
            message: "Domain created successfully.",
            data: newDomain,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create domain.",
        });
    }
};

/**
 * @desc    Update Domain
 * @route   PUT /api/v1/domains/:id
 * @access  Private/Admin
 */
export const updateDomain = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, technologies, isActive, sortOrder } = req.body;

        const domain = await Domain.findById(id);
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: "Domain not found.",
            });
        }

        if (name !== undefined) {
            const normalizedName = name.trim();
            if (!normalizedName) {
                return res.status(400).json({
                    success: false,
                    message: "Domain name cannot be empty.",
                });
            }

            // Case-insensitive duplicate validations if name changed
            if (normalizedName.toLowerCase() !== domain.name.toLowerCase()) {
                const existingName = await Domain.findOne({
                    name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
                });
                if (existingName) {
                    return res.status(400).json({
                        success: false,
                        message: `Domain name "${normalizedName}" already exists.`,
                    });
                }

                const slug = slugify(normalizedName);
                const existingSlug = await Domain.findOne({ slug });
                if (existingSlug) {
                    return res.status(400).json({
                        success: false,
                        message: `Domain slug "${slug}" already exists.`,
                    });
                }
                domain.name = normalizedName;
                domain.slug = slug;
            }
        }

        if (description !== undefined) {
            domain.description = description ? description.trim() : "";
        }

        if (isActive !== undefined) {
            domain.isActive = isActive === true;
        }

        if (sortOrder !== undefined) {
            domain.sortOrder = Number(sortOrder) || 0;
        }

        // Sync technologies many-to-many relationship
        if (technologies !== undefined && Array.isArray(technologies)) {
            const newTechIds = technologies.map(tId => tId.toString());
            const oldTechIds = domain.technologies.map(tId => tId.toString());

            const toRemove = oldTechIds.filter(id => !newTechIds.includes(id));
            const toAdd = newTechIds.filter(id => !oldTechIds.includes(id));

            // Pull domain reference from unselected technologies
            if (toRemove.length > 0) {
                await Technology.updateMany(
                    { _id: { $in: toRemove } },
                    { $pull: { domains: domain._id } }
                );
            }

            // Push domain reference to newly selected technologies
            if (toAdd.length > 0) {
                await Technology.updateMany(
                    { _id: { $in: toAdd } },
                    { $addToSet: { domains: domain._id } }
                );
            }

            domain.technologies = technologies;
        }

        await domain.save();

        const updatedDomain = await Domain.findById(id).populate("technologies", "name slug isActive");

        return res.status(200).json({
            success: true,
            message: "Domain updated successfully.",
            data: updatedDomain,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update domain.",
        });
    }
};

/**
 * @desc    Delete Domain
 * @route   DELETE /api/v1/domains/:id
 * @access  Private/Admin
 */
export const deleteDomain = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { force } = req.query; // Admin can pass ?force=true to override and delete

        const domain = await Domain.findById(id);
        if (!domain) {
            return res.status(404).json({
                success: false,
                message: "Domain not found.",
            });
        }

        // 1. Check if assigned to any projects (backward-compatible checks for ID or Name string)
        const projectCount = await Project.countDocuments({
            $or: [
                { domains: id },
                { domain: domain.name }
            ]
        });

        // 2. Check if linked to any technologies
        const linkedTechCount = domain.technologies.length;

        // If referenced, prevent accidental deletion unless forced
        if (force !== "true" && (projectCount > 0 || linkedTechCount > 0)) {
            return res.status(400).json({
                success: false,
                isReferenced: true,
                message: `This domain is currently used by ${projectCount} project(s) and linked to ${linkedTechCount} technology/technologies.`,
                projectCount,
                linkedTechCount,
            });
        }

        // Remove domain reference from all associated technologies
        await Technology.updateMany(
            { domains: id },
            { $pull: { domains: id } }
        );

        // Delete from database
        await domain.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Domain deleted successfully.",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete domain.",
        });
    }
};
