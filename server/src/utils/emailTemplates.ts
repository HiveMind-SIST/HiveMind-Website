const getCandidateEmailLayout = (
    title: string,
    fullname: string,
    paragraphs: string[],
    customCardHtml: string = "",
    specialBannerHtml: string = ""
) => {
    const formattedParagraphs = paragraphs
        .map(p => `<p style="margin: 0 0 16px 0;">${p}</p>`)
        .join("");

    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F7F7F8; padding: 40px 15px; margin: 0;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
        
        <!-- Header with Logo & Gold Line -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://res.cloudinary.com/n348amus/image/upload/v1785232370/HiveMind_logo_2_fv3nox.png" alt="HiveMind Logo" style="width: 48px; height: auto; margin-bottom: 8px;">
            <h2 style="margin: 0; color: #1A1A1A; font-size: 16px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                HIVEMIND
            </h2>
            <div style="height: 2px; width: 60px; background-color: #FFC107; margin: 16px auto 0 auto; border-radius: 2px;"></div>
        </div>

        <!-- Main Email Heading -->
        ${title ? `
        <h1 style="text-align: center; margin: 0 0 24px 0; font-size: 20px; font-weight: 800; color: #1A1A1A; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: -0.3px;">
            ${title}
        </h1>
        ` : ""}

        <!-- Special Celebration Banner if Applicable -->
        ${specialBannerHtml}

        <!-- Personalized Greeting & Body -->
        <div style="color: #374151; font-size: 14px; line-height: 1.65; font-family: 'Segoe UI', Arial, sans-serif;">
            <p style="font-size: 15px; color: #111827; font-weight: 700; margin-top: 0; margin-bottom: 18px;">Dear ${fullname},</p>
            
            ${formattedParagraphs}

            <!-- Dynamic Content Card -->
            ${customCardHtml}

            <!-- Regards & Sign-off -->
            <p style="margin-top: 28px; margin-bottom: 0; color: #374151;">
                Regards,<br />
                <strong style="color: #D4A106; font-weight: 700;">HiveMind Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 36px; text-align: center; color: #9CA3AF; font-size: 11px; border-top: 1px solid #E5E7EB; padding-top: 20px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5;">
            <div style="margin-bottom: 4px;">This is an automated notification from the HiveMind recruitment system.</div>
            <div style="margin-bottom: 6px;">Please do not reply to this email.</div>
            <div style="color: #6B7280; font-weight: 600;">&copy; 2026 HiveMind</div>
        </div>
    </div>
</div>
    `;
};

export const getCandidateWelcomeEmail = (fullname: string, _dept?: string, _year?: string, _registerNumber?: string) => {
    const paragraphs = [
        "Thank you for your interest in joining HiveMind.",
        "We are pleased to confirm that your application has been successfully received.",
        "Our team will carefully review the information you have submitted to better understand your interests, experiences, and potential contribution to the HiveMind community.",
        "We appreciate the time and effort you invested in your application and thank you for considering HiveMind as a place to learn, collaborate, and innovate.",
        "We will keep you informed of any updates regarding your application as the review process progresses."
    ];

    return getCandidateEmailLayout(
        "Application Received",
        fullname,
        paragraphs,
        ""
    );
};

export const getLeadsNotificationEmail = (
    fullname: string,
    registerNumber: string,
    email: string,
    phoneNumber: string,
    dept: string,
    year: string,
    domains: string,
    languages: string,
    _whyJoin: string,
    _howDidYouHear: string,
    _resume: string,
    _linkedin: string,
    _github: string,
    _portfolio: string
) => {
    const escapeHtml = (text: string) => {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const escapedName = escapeHtml(fullname);
    const escapedReg = escapeHtml(registerNumber);
    const escapedEmail = escapeHtml(email);
    const escapedPhone = escapeHtml(phoneNumber);
    const escapedDept = escapeHtml(dept);
    const escapedYear = escapeHtml(year);
    const escapedDomains = escapeHtml(domains);
    const escapedLanguages = escapeHtml(languages);

    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #F7F7F8; padding: 40px 15px; margin: 0;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 36px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
        
        <!-- Header -->
        <div style="border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; margin-bottom: 24px; text-align: left;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td align="left" style="vertical-align: middle;">
                        <h2 style="margin: 0; color: #D4A106; font-size: 16px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                            New Membership Application
                        </h2>
                        <span style="color: #6B7280; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; display: block; margin-top: 4px;">
                            HiveMind Supercomputing Lab
                        </span>
                    </td>
                    <td align="right" width="45" style="vertical-align: middle;">
                        <img src="https://res.cloudinary.com/n348amus/image/upload/v1785232370/HiveMind_logo_2_fv3nox.png" alt="HiveMind Logo" style="width: 38px; height: auto;">
                    </td>
                </tr>
            </table>
        </div>

        <!-- Body content -->
        <div style="color: #374151; font-size: 13.5px; line-height: 1.6; text-align: left;">
            <p style="font-size: 14.5px; color: #111827; font-weight: 700; margin-top: 0; margin-bottom: 14px;">
                A new membership application has been submitted and is ready for review.
            </p>
            <p style="margin-bottom: 24px; color: #4B5563;">
                Please review the candidate's details below before proceeding with the next stage of the selection process.
            </p>

            <!-- Candidate Details Card -->
            <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin-top: 0; margin-bottom: 14px; color: #D4A106; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    Candidate Details
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
                    <tr style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px 0; color: #6B7280; width: 130px; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Full Name</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: 700;">${escapedName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px 0; color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Register Number</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: 600; font-family: monospace;">${escapedReg}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px 0; color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Email</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: 600;"><a href="mailto:${email}" style="color: #D4A106; text-decoration: none; font-weight: 700;">${escapedEmail}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px 0; color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Phone Number</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: 600;">${escapedPhone}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px 0; color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Department & Year</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: 600;">${escapedDept} — ${escapedYear} Year</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E5E7EB;">
                        <td style="padding: 8px 0; color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Domains</td>
                        <td style="padding: 8px 0; color: #D4A106; font-weight: 700;">${escapedDomains}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Languages</td>
                        <td style="padding: 8px 0; color: #111827; font-family: monospace; font-size: 11px;">${escapedLanguages}</td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #E5E7EB; padding-top: 18px; margin-top: 10px; text-align: center; color: #9CA3AF; font-size: 11px;">
            <div style="margin-bottom: 4px;">Please access the HiveMind Admin Panel to review and manage this application.</div>
            <div style="color: #6B7280; font-weight: 600;">&copy; 2026 HiveMind</div>
        </div>
    </div>
</div>
    `;
};

export const getInterviewInvitationEmail = (fullname: string, date: string, time: string) => {
    let formattedDate = date;
    try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString("en-US", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    } catch (e) { }

    const paragraphs = [
        "We are pleased to inform you that your application has been shortlisted for the next stage of the HiveMind selection process.",
        "We would like to invite you to attend a Technical Interview with the HiveMind team. The interview will provide us with an opportunity to learn more about your technical knowledge, projects, problem-solving approach, interests, and willingness to learn.",
        "Please find the scheduled interview details below."
    ];

    const cardHtml = `
    <!-- Technical Interview Schedule Card -->
    <div style="background-color: #FFFDF5; border: 1px solid #FDE68A; border-left: 4px solid #FFC107; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 14px 0; color: #D4A106; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
            Technical Interview
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; font-family: 'Segoe UI', Arial, sans-serif;">
            <tr style="border-bottom: 1px solid #FEF3C7;">
                <td style="padding: 8px 0; color: #78350F; width: 35%; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Date</td>
                <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right;">${formattedDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #FEF3C7;">
                <td style="padding: 8px 0; color: #78350F; width: 35%; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Time</td>
                <td style="padding: 8px 0; color: #1A1A1A; font-weight: 700; text-align: right;">${time}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #78350F; width: 35%; font-weight: 700; text-transform: uppercase; font-size: 9.5px;">Venue</td>
                <td style="padding: 8px 0; color: #D4A106; font-weight: 800; text-align: right;">AI Supercomputing Lab</td>
            </tr>
        </table>
    </div>
    <p style="margin-bottom: 16px; color: #374151;">
        Please arrive on time and be prepared to discuss your technical interests, projects, experiences, and learning journey.
    </p>
    <p style="margin-bottom: 0; color: #374151;">
        We look forward to meeting you.
    </p>
    `;

    return getCandidateEmailLayout(
        "Technical Interview Invitation",
        fullname,
        paragraphs,
        cardHtml
    );
};

export const getCandidateAcceptanceEmail = (fullname: string) => {
    const paragraphs = [
        "Congratulations!",
        "We are delighted to inform you that you have successfully completed the HiveMind selection process and have been selected to join the community.",
        "Your application and interaction throughout the selection process demonstrated your potential, curiosity, and willingness to learn and contribute. We are excited to welcome you to HiveMind and look forward to seeing you collaborate, explore new ideas, and contribute to meaningful projects.",
        "Details regarding the onboarding process and other important information will be shared with you shortly.",
        "We look forward to having you as part of HiveMind."
    ];

    const specialBannerHtml = `
    <!-- Acceptance Banner -->
    <div style="text-align: center; margin: 0 0 24px 0; border: 1px dashed #D4A106; padding: 14px; border-radius: 12px; background-color: #FFFDF5;">
        <h3 style="margin: 0; color: #D4A106; font-size: 13px; font-weight: 800; letter-spacing: 3.5px; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;">
            WELCOME TO THE HIVE
        </h3>
    </div>
    `;

    return getCandidateEmailLayout(
        "",
        fullname,
        paragraphs,
        "",
        specialBannerHtml
    );
};

export const getCandidateRejectionEmail = (fullname: string, reason: string = "") => {
    const escapeHtml = (text: string) => {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const paragraphs = [
        "Thank you for your interest in joining HiveMind and for the time and effort you invested throughout the selection process.",
        "After careful consideration, we regret to inform you that we will not be able to move forward with your application at this time."
    ];

    const escapedReason = escapeHtml(reason.trim());
    const reasonCardHtml = escapedReason ? `
    <!-- Rejection Reason Card -->
    <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-left: 4px solid #EF4444; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0; color: #991B1B; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
            Feedback / Reason
        </h4>
        <p style="margin: 0; color: #7F1D1D; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${escapedReason}</p>
    </div>
    ` : "";

    const closingParagraphs = `
    <p style="margin: 16px 0;">
        We sincerely appreciate your interest in being part of HiveMind and encourage you to continue learning, building, and developing your skills. We welcome you to apply again during future recruitment opportunities.
    </p>
    <p style="margin: 0;">
        We wish you the very best in your future endeavors.
    </p>
    `;

    return getCandidateEmailLayout(
        "Update on Your HiveMind Application",
        fullname,
        paragraphs,
        reasonCardHtml + closingParagraphs
    );
};
