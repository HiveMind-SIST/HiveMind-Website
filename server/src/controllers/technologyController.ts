import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Domain from "../models/Domain";
import Technology from "../models/Technology";
import Project from "../models/Project";
import { slugify } from "../utils/slugify";

/**
 * @desc    Get all Technologies
 * @route   GET /api/v1/technologies
 * @access  Public
 */
export const getTechnologies = async (req: AuthRequest, res: Response) => {
    try {
        const { domains } = req.query;
        const query: any = {};

        // Filter technologies by domain list if provided
        if (domains) {
            const domainIds = (domains as string)
                .split(",")
                .map(id => id.trim())
                .filter(Boolean);
            
            if (domainIds.length > 0) {
                query.domains = { $in: domainIds };
            }
        }

        const technologies = await Technology.find(query)
            .populate("domains", "name slug isActive")
            .sort({ sortOrder: 1, name: 1 });

        return res.status(200).json({
            success: true,
            data: technologies,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve technologies.",
        });
    }
};

/**
 * @desc    Get Technology by ID
 * @route   GET /api/v1/technologies/:id
 * @access  Public
 */
export const getTechnologyById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const technology = await Technology.findById(id).populate("domains", "name slug isActive");
        
        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: technology,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve technology.",
        });
    }
};

/**
 * @desc    Create Technology
 * @route   POST /api/v1/technologies
 * @access  Private/Admin
 */
export const createTechnology = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, domains, isActive, sortOrder } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Technology name is required.",
            });
        }

        const normalizedName = name.trim();
        const slug = slugify(normalizedName);

        // Case-insensitive name duplicate check
        const existingName = await Technology.findOne({
            name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });
        if (existingName) {
            return res.status(400).json({
                success: false,
                message: `Technology name "${normalizedName}" already exists.`,
            });
        }

        // Case-insensitive slug duplicate check
        const existingSlug = await Technology.findOne({ slug });
        if (existingSlug) {
            return res.status(400).json({
                success: false,
                message: `Technology slug "${slug}" already exists.`,
            });
        }

        // Validate domains array
        const domainIds = Array.isArray(domains) ? domains : [];

        const newTech = await Technology.create({
            name: normalizedName,
            slug,
            description: description ? description.trim() : "",
            domains: domainIds,
            isActive: isActive !== false,
            sortOrder: Number(sortOrder) || 0,
        });

        // Sync reverse relationships in Domain documents
        if (domainIds.length > 0) {
            await Domain.updateMany(
                { _id: { $in: domainIds } },
                { $addToSet: { technologies: newTech._id } }
            );
        }

        return res.status(201).json({
            success: true,
            message: "Technology created successfully.",
            data: newTech,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create technology.",
        });
    }
};

/**
 * @desc    Update Technology
 * @route   PUT /api/v1/technologies/:id
 * @access  Private/Admin
 */
export const updateTechnology = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, domains, isActive, sortOrder } = req.body;

        const technology = await Technology.findById(id);
        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found.",
            });
        }

        if (name !== undefined) {
            const normalizedName = name.trim();
            if (!normalizedName) {
                return res.status(400).json({
                    success: false,
                    message: "Technology name cannot be empty.",
                });
            }

            // Case-insensitive duplicate validations if name changed
            if (normalizedName.toLowerCase() !== technology.name.toLowerCase()) {
                const existingName = await Technology.findOne({
                    name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
                });
                if (existingName) {
                    return res.status(400).json({
                        success: false,
                        message: `Technology name "${normalizedName}" already exists.`,
                    });
                }

                const slug = slugify(normalizedName);
                const existingSlug = await Technology.findOne({ slug });
                if (existingSlug) {
                    return res.status(400).json({
                        success: false,
                        message: `Technology slug "${slug}" already exists.`,
                    });
                }
                technology.name = normalizedName;
                technology.slug = slug;
            }
        }

        if (description !== undefined) {
            technology.description = description ? description.trim() : "";
        }

        if (isActive !== undefined) {
            technology.isActive = isActive === true;
        }

        if (sortOrder !== undefined) {
            technology.sortOrder = Number(sortOrder) || 0;
        }

        // Sync domains many-to-many relationship
        if (domains !== undefined && Array.isArray(domains)) {
            const newDomainIds = domains.map(dId => dId.toString());
            const oldDomainIds = technology.domains.map(dId => dId.toString());

            const toRemove = oldDomainIds.filter(id => !newDomainIds.includes(id));
            const toAdd = newDomainIds.filter(id => !oldDomainIds.includes(id));

            // Pull technology reference from unselected domains
            if (toRemove.length > 0) {
                await Domain.updateMany(
                    { _id: { $in: toRemove } },
                    { $pull: { technologies: technology._id } }
                );
            }

            // Push technology reference to newly selected domains
            if (toAdd.length > 0) {
                await Domain.updateMany(
                    { _id: { $in: toAdd } },
                    { $addToSet: { technologies: technology._id } }
                );
            }

            technology.domains = domains;
        }

        await technology.save();

        const updatedTech = await Technology.findById(id).populate("domains", "name slug isActive");

        return res.status(200).json({
            success: true,
            message: "Technology updated successfully.",
            data: updatedTech,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update technology.",
        });
    }
};

/**
 * @desc    Delete Technology
 * @route   DELETE /api/v1/technologies/:id
 * @access  Private/Admin
 */
export const deleteTechnology = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { force } = req.query;

        const technology = await Technology.findById(id);
        if (!technology) {
            return res.status(404).json({
                success: false,
                message: "Technology not found.",
            });
        }

        // 1. Check if assigned to any projects (backward-compatible checks for ID or Name string)
        const projectCount = await Project.countDocuments({
            $or: [
                { technologies: id },
                { techStack: technology.name }
            ]
        });

        // 2. Check if linked to any domains
        const linkedDomainCount = technology.domains.length;

        // If referenced, prevent accidental deletion unless forced
        if (force !== "true" && (projectCount > 0 || linkedDomainCount > 0)) {
            return res.status(400).json({
                success: false,
                isReferenced: true,
                message: `This technology is currently used by ${projectCount} project(s) and linked to ${linkedDomainCount} domain(s).`,
                projectCount,
                linkedDomainCount,
            });
        }

        // Remove technology reference from all associated domains
        await Domain.updateMany(
            { technologies: id },
            { $pull: { technologies: id } }
        );

        // Delete from database
        await technology.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Technology deleted successfully.",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete technology.",
        });
    }
};
