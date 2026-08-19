import { Request, Response } from "express";
import Team from "../models/Team";
import { deleteFromCloudinary } from "../utils/cloudinary";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .%-]*)\/?$/i;

// GET /api/v1/team
export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const members = await Team.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
        // Sort so Faculty Mentors always appear first, retaining sortOrder within groups
        members.sort((a, b) => {
            const isFacultyA = a.role === "Faculty Mentor" ? 0 : 1;
            const isFacultyB = b.role === "Faculty Mentor" ? 0 : 1;
            if (isFacultyA !== isFacultyB) return isFacultyA - isFacultyB;
            return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        });
        return res.status(200).json({ success: true, members });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error fetching team members." });
    }
};

// PUT /api/v1/team/reorder
export const reorderTeamMembers = async (req: Request, res: Response) => {
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
            await Team.bulkWrite(bulkOps);
        }

        return res.status(200).json({
            success: true,
            message: "Team members reordered successfully."
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reorder team members."
        });
    }
};

// POST /api/v1/team
export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const { fullname, registerNumber, email, pic, department, section, year, Linkedin, github, batch, role } = req.body;
        const memberRole = role === "Faculty Mentor" ? "Faculty Mentor" : "Member";

        // 1. Check required fields
        if (memberRole === "Faculty Mentor") {
            if (!fullname || !email) {
                return res.status(400).json({ success: false, message: "Full name and email address are required for Faculty Mentors." });
            }
        } else {
            if (!fullname || !email || !department || !batch || !registerNumber || !section || !year) {
                return res.status(400).json({ success: false, message: "Full name, register number, email, department, section, year, and batch are required for student team members." });
            }
        }

        // 2. Validate length
        if (fullname.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
        }

        // 3. Validate email structure
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address." });
        }

        // 4. Validate year enum if provided
        const validYears = ["1st", "2nd", "3rd", "4th", "Faculty", "N/A"];
        if (year && !validYears.includes(year)) {
            return res.status(400).json({ success: false, message: "Invalid year selection." });
        }

        // 5. Validate URLs if provided
        if (Linkedin && Linkedin.trim() !== "" && !urlRegex.test(Linkedin)) {
            return res.status(400).json({ success: false, message: "Please provide a valid LinkedIn URL." });
        }
        if (github && github.trim() !== "" && !urlRegex.test(github)) {
            return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
        }

        // 5b. Enforce at least one social link ONLY for student members
        if (memberRole === "Member") {
            if ((!Linkedin || Linkedin.trim() === "") && (!github || github.trim() === "")) {
                return res.status(400).json({ success: false, message: "At least one social profile (LinkedIn or GitHub) must be provided for student team members." });
            }
        }

        // 6. Check unique email in DB
        const existingMember = await Team.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ success: false, message: "A team member with this email already exists." });
        }

        // 7. Get highest sortOrder so new member is placed at the bottom by default
        const lastMember = await Team.findOne({}).sort({ sortOrder: -1 }).select("sortOrder").lean();
        const nextSortOrder = (lastMember?.sortOrder !== undefined && lastMember?.sortOrder !== null) ? lastMember.sortOrder + 1 : 0;

        const newMember = new Team({
            fullname,
            registerNumber: memberRole === "Faculty Mentor" ? "N/A" : (registerNumber || "N/A"),
            email,
            pic: pic || "",
            department: memberRole === "Faculty Mentor" ? "Faculty" : (department || "Faculty"),
            section: memberRole === "Faculty Mentor" ? "N/A" : (section || "N/A"),
            year: memberRole === "Faculty Mentor" ? "Faculty" : (year || "N/A"),
            Linkedin: Linkedin || "",
            github: github || "",
            batch: memberRole === "Faculty Mentor" ? "Faculty" : (batch || "Faculty"),
            role: memberRole,
            sortOrder: nextSortOrder,
        });

        await newMember.save();

        return res.status(201).json({
            success: true,
            message: "Team member created successfully.",
            member: newMember
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error creating team member." });
    }
};

// PUT /api/v1/team/:id
export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullname, registerNumber, email, pic, department, section, year, Linkedin, github, batch, role } = req.body;

        const member = await Team.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Team member not found." });
        }

        if (role !== undefined) {
            member.role = role === "Faculty Mentor" ? "Faculty Mentor" : "Member";
        }

        const isFaculty = member.role === "Faculty Mentor";

        // Validate body if fields are changing
        if (fullname !== undefined) {
            if (!fullname || fullname.trim().length < 3) {
                return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
            }
            member.fullname = fullname;
        }

        if (registerNumber !== undefined) {
            member.registerNumber = isFaculty ? "N/A" : (registerNumber || "N/A");
        }

        if (email !== undefined) {
            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Please provide a valid email address." });
            }
            // Check uniqueness if email is changing
            if (email.toLowerCase() !== member.email.toLowerCase()) {
                const existingMember = await Team.findOne({ email });
                if (existingMember) {
                    return res.status(400).json({ success: false, message: "A team member with this email already exists." });
                }
            }
            member.email = email;
        }

        let oldPicUrl = "";
        if (pic !== undefined) {
            if (pic !== member.pic && member.pic) {
                oldPicUrl = member.pic;
            }
            member.pic = pic || "";
        }
        if (department !== undefined) {
            member.department = isFaculty ? "Faculty" : (department || "Faculty");
        }
        if (section !== undefined) {
            member.section = isFaculty ? "N/A" : (section || "N/A");
        }
        if (year !== undefined) {
            const validYears = ["1st", "2nd", "3rd", "4th", "Faculty", "N/A"];
            if (year && !validYears.includes(year)) {
                return res.status(400).json({ success: false, message: "Invalid year selection." });
            }
            member.year = isFaculty ? "Faculty" : (year || "N/A");
        }
        if (Linkedin !== undefined) {
            if (Linkedin && Linkedin.trim() !== "" && !urlRegex.test(Linkedin)) {
                return res.status(400).json({ success: false, message: "Please provide a valid LinkedIn URL." });
            }
            member.Linkedin = Linkedin || "";
        }
        if (github !== undefined) {
            if (github && github.trim() !== "" && !urlRegex.test(github)) {
                return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
            }
            member.github = github || "";
        }
        if (batch !== undefined) {
            member.batch = isFaculty ? "Faculty" : (batch || "Faculty");
        }

        // Validate that at least one social profile is left after update ONLY for student members
        if (!isFaculty) {
            const finalLinkedin = Linkedin !== undefined ? Linkedin : member.Linkedin;
            const finalGithub = github !== undefined ? github : member.github;
            if ((!finalLinkedin || finalLinkedin.trim() === "") && (!finalGithub || finalGithub.trim() === "")) {
                return res.status(400).json({ success: false, message: "At least one social profile (LinkedIn or GitHub) must be provided for student members." });
            }
        }

        await member.save();

        if (oldPicUrl) {
            deleteFromCloudinary(oldPicUrl).catch(err => { }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Team member updated successfully.",
            member
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating team member." });
    }
};

// DELETE /api/v1/team/:id
export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const member = await Team.findById(id);
        if (!member) {
            return res.status(404).json({ success: false, message: "Team member not found." });
        }

        const picUrl = member.pic;

        await Team.findByIdAndDelete(id);

        if (picUrl) {
            deleteFromCloudinary(picUrl).catch(err => { }
            );
        }

        return res.status(200).json({ success: true, message: "Team member deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error deleting team member." });
    }
};
