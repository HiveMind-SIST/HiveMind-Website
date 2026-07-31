import { Request, Response } from "express";
import Application from "../models/Application";
import { deleteFromCloudinary } from "../utils/cloudinary";
import CommunitySettings from "../models/CommunitySettings";
import { sendEmail } from "../utils/mailer";
import { getCandidateWelcomeEmail, getLeadsNotificationEmail, getInterviewInvitationEmail, getCandidateAcceptanceEmail, getCandidateRejectionEmail } from "../utils/emailTemplates";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .%-]*)\/?$/i;

// POST /api/v1/applications/apply
export const applyMember = async (req: Request, res: Response) => {
    try {
        // Check if settings allow applications
        const settings = await CommunitySettings.findOne();
        if (settings && settings.acceptingApplications === false) {
            return res.status(400).json({
                success: false,
                message: "HiveMind is not accepting recruitment applications at the moment."
            });
        }

        const {
            fullname,
            registerNumber,
            email,
            phoneNumber,
            dept,
            year,
            linkedin,
            github,
            resume,
            portfolio,
            domainOfInterest,
            programmingLanguages,
            whyJoin,
            hoursPerWeek,
            howDidYouHear
        } = req.body;

        // 1. Validate required fields
        if (
            !fullname ||
            !registerNumber ||
            !email ||
            !phoneNumber ||
            !dept ||
            !year ||
            !linkedin ||
            !resume ||
            !domainOfInterest ||
            !programmingLanguages ||
            !whyJoin ||
            !hoursPerWeek ||
            !howDidYouHear
        ) {
            return res.status(400).json({ success: false, message: "Please fill in all the required fields." });
        }

        // 2. Validate input constraints
        if (fullname.trim().length < 3) {
            return res.status(400).json({ success: false, message: "Full name must be at least 3 characters." });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address." });
        }
        if (!urlRegex.test(linkedin)) {
            return res.status(400).json({ success: false, message: "Please provide a valid LinkedIn URL." });
        }
        if (github && github.trim() !== "" && !urlRegex.test(github)) {
            return res.status(400).json({ success: false, message: "Please provide a valid GitHub URL." });
        }
        if (portfolio && portfolio.trim() !== "" && !urlRegex.test(portfolio)) {
            return res.status(400).json({ success: false, message: "Please provide a valid Portfolio URL." });
        }
        if (whyJoin.trim().length < 10) {
            return res.status(400).json({ success: false, message: "Response for 'Why do you want to join' must be at least 10 characters." });
        }

        const hours = Number(hoursPerWeek);
        if (isNaN(hours) || hours < 1) {
            return res.status(400).json({ success: false, message: "Hours you can contribute must be at least 1 hour." });
        }

        const validYears = ["1st", "2nd", "3rd", "4th"];
        if (!validYears.includes(year)) {
            return res.status(400).json({ success: false, message: "Academic year must be 1st, 2nd, 3rd, or 4th." });
        }

        // 3. Convert programming languages to array if string
        let languages: string[] = [];
        if (Array.isArray(programmingLanguages)) {
            languages = programmingLanguages.map(l => l.trim()).filter(Boolean);
        } else if (typeof programmingLanguages === "string") {
            languages = programmingLanguages.split(",").map(l => l.trim()).filter(Boolean);
        }

        if (languages.length === 0) {
            return res.status(400).json({ success: false, message: "Please specify at least one programming language." });
        }

        // 4. Verify duplicate application
        const existingApplicant = await Application.findOne({ email });
        if (existingApplicant) {
            return res.status(400).json({ success: false, message: "An application with this email address has already been submitted." });
        }

        // 5. Create new applicant
        const newApplicant = new Application({
            fullname: fullname.trim(),
            registerNumber: registerNumber.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber: phoneNumber.trim(),
            dept: dept.trim(),
            year,
            linkedin: linkedin.trim(),
            github: github ? github.trim() : "",
            resume: resume.trim(),
            portfolio: portfolio ? portfolio.trim() : "",
            domainOfInterest: domainOfInterest.trim(),
            programmingLanguages: languages,
            whyJoin: whyJoin.trim(),
            hoursPerWeek: hours,
            howDidYouHear: howDidYouHear.trim(),
            status: "Pending"
        });

        await newApplicant.save();

        // Send email notifications in the background (non-blocking)
        (async () => {
            try {
                const candidateWelcomeHtml = getCandidateWelcomeEmail(
                    newApplicant.fullname,
                    newApplicant.dept,
                    newApplicant.year,
                    newApplicant.registerNumber
                );

                // Send to candidate
                await sendEmail({
                    to: newApplicant.email,
                    subject: "Application Received | HiveMind",
                    html: candidateWelcomeHtml
                });

                // Send to team leads
                const leadsEnv = process.env.TEAM_LEADS_EMAILS || "lead1@hivemind.org,lead2@hivemind.org";
                const leadsEmails = leadsEnv
                    .split(",")
                    .map(e => e.trim())
                    .filter(Boolean);

                if (leadsEmails.length > 0) {
                    const leadsNotificationHtml = getLeadsNotificationEmail(
                        newApplicant.fullname,
                        newApplicant.registerNumber,
                        newApplicant.email,
                        newApplicant.phoneNumber,
                        newApplicant.dept,
                        newApplicant.year,
                        newApplicant.domainOfInterest,
                        newApplicant.programmingLanguages.join(", "),
                        newApplicant.whyJoin,
                        newApplicant.howDidYouHear,
                        newApplicant.resume,
                        newApplicant.linkedin,
                        newApplicant.github || "",
                        newApplicant.portfolio || ""
                    );

                    await sendEmail({
                        to: leadsEmails.join(","),
                        subject: `New Membership Application | ${newApplicant.fullname}`,
                        html: leadsNotificationHtml
                    });
                }
            } catch (mailErr) {
            }
        })();

        return res.status(201).json({
            success: true,
            message: "Your application was submitted successfully! The team will review it and reach out shortly.",
            applicant: newApplicant
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error submitting application." });
    }
};

// GET /api/v1/applications
export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await Application.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, applications });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error fetching applications." });
    }
};

// PUT /api/v1/applications/:id/status
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, interviewDate, interviewTime, rejectionReason } = req.body;

        const validStatuses = ["Pending", "Interviewed", "Approved", "Rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be Pending, Interviewed, Approved, or Rejected." });
        }

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Applicant record not found." });
        }

        application.status = status;
        
        // Save interview schedule if status is Interviewed or if they are provided
        if (interviewDate !== undefined) {
            application.interviewDate = interviewDate;
        }
        if (interviewTime !== undefined) {
            application.interviewTime = interviewTime;
        }
        if (rejectionReason !== undefined) {
            application.rejectionReason = rejectionReason;
        }

        await application.save();

        // Trigger emails in background depending on the new status
        (async () => {
            try {
                let subject = "";
                let html = "";

                if (status === "Interviewed") {
                    const dateVal = interviewDate || application.interviewDate || "";
                    const timeVal = interviewTime || application.interviewTime || "";
                    subject = "Technical Interview Invitation | HiveMind";
                    html = getInterviewInvitationEmail(application.fullname, dateVal, timeVal);
                } else if (status === "Approved") {
                    subject = "Welcome to HiveMind";
                    html = getCandidateAcceptanceEmail(application.fullname);
                } else if (status === "Rejected") {
                    const reasonVal = rejectionReason || application.rejectionReason || "";
                    subject = "Update on Your HiveMind Application";
                    html = getCandidateRejectionEmail(application.fullname, reasonVal);
                }

                if (html && subject) {
                    await sendEmail({
                        to: application.email,
                        subject,
                        html
                    });
                }
            } catch (mailErr) {
            }
        })();

        return res.status(200).json({
            success: true,
            message: `Applicant status updated to ${status} successfully.`,
            application
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error updating status." });
    }
};

// DELETE /api/v1/applications/:id
export const deleteApplication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Applicant record not found." });
        }

        const resumeUrl = application.resume;

        await Application.findByIdAndDelete(id);

        if (resumeUrl) {
            deleteFromCloudinary(resumeUrl).catch(err =>
                {}
            );
        }

        return res.status(200).json({ success: true, message: "Applicant record deleted successfully." });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal server error deleting applicant." });
    }
};
