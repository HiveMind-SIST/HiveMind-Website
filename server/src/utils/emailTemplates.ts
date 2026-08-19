/**
 * Base email layout matching HiveMind official template design
 */
export const getBaseEmailTemplate = (contentHtml: string): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 20px 0;
            background-color: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
        }

        .email-wrapper {
            width: 90%;
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 2px solid #ffcd00;
            border-radius: 6px;
            overflow: hidden;
            box-sizing: border-box;
        }

        .banner {
            width: 100%;
            height: 180px;
            background-image: url('https://res.cloudinary.com/n348amus/image/upload/v1786353550/HiveMind_banner_ce9awr.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .accent-bar {
            background-color: #ffcd00;
            height: 6px;
            width: 100%;
        }

        .body-content {
            padding: 30px 24px;
        }

        p {
            font-size: 14px;
            color: #333333;
            line-height: 1.6;
            margin-bottom: 16px;
        }

        .btn-holder {
            text-align: center;
            margin: 28px 0;
        }

        .cat-btn {
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            padding: 13px 28px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            border-radius: 4px;
            letter-spacing: 0.5px;
        }

        .contact {
            margin-top: 24px;
            padding: 16px;
            background-color: #f8f8f8;
            border-left: 4px solid #ffcd00;
            font-size: 13px;
            color: #444444;
            line-height: 1.7;
        }

        .contact a {
            color: #333333;
            text-decoration: none;
        }

        .footer {
            font-size: 13px;
            color: #555555;
            margin-top: 28px;
            border-top: 1px solid #dddddd;
            padding-top: 18px;
            line-height: 1.5;
        }

        @media only screen and (max-width: 480px) {
            body {
                padding: 10px 0;
            }

            .email-wrapper {
                width: 95%;
                border-width: 1px;
            }

            .banner {
                height: 150px;
            }

            .body-content {
                padding: 20px 16px;
            }

            p {
                font-size: 13px;
            }

            .cat-btn {
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 20px 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">

<div class="email-wrapper" style="width: 90%; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 2px solid #ffcd00; border-radius: 6px; overflow: hidden; box-sizing: border-box;">

    <!-- HiveMind Banner -->
    <div
        class="banner"
        style="
            width: 100%;
            height: 180px;
            background-image: url('https://res.cloudinary.com/n348amus/image/upload/v1786353550/HiveMind_banner_ce9awr.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        ">
    </div>

    <!-- Yellow Accent -->
    <div class="accent-bar" style="background-color: #ffcd00; height: 6px; width: 100%;"></div>

    <div class="body-content" style="padding: 30px 24px;">
        ${contentHtml}

        <!-- Contact Details -->
        <div class="contact" style="margin-top: 24px; padding: 16px; background-color: #f8f8f8; border-left: 4px solid #ffcd00; font-size: 13px; color: #444444; line-height: 1.7;">
            <strong>For any queries, please contact:</strong><br>
            HiveMind Community Team<br>

            Email:
            <a href="mailto:hivemindsist@gmail.com" style="color: #333333; text-decoration: none;">
                hivemindsist@gmail.com
            </a>
            <br>

            Phone:
            <a href="tel:+919385598932" style="color: #333333; text-decoration: none;">
                +91 93855 98932
            </a>
            <br>

            Website:
            <a href="https://hivemindsist.dev" style="color: #333333; text-decoration: none;">
                hivemindsist.dev
            </a>
        </div>

        <div class="footer" style="font-size: 13px; color: #555555; margin-top: 28px; border-top: 1px solid #dddddd; padding-top: 18px; line-height: 1.5;">
            Regards,<br>
            <strong>HiveMind Community</strong><br>
            Sathyabama Institute of Science and Technology
        </div>

    </div>

</div>

</body>
</html>`;
};

// ===============================
// Candidate Application Welcome Email
// ===============================
export const getCandidateWelcomeEmail = (
    fullname: string,
    dept?: string,
    year?: string,
    registerNumber?: string
): string => {
    const contentHtml = `
        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">Dear <strong>${fullname}</strong>,</p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Thank you for your interest in joining <strong>HiveMind</strong>!
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            We are pleased to confirm that your application for the HiveMind Recruitment process has been successfully received.
        </p>

        <div style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 6px; padding: 16px; margin: 20px 0; font-size: 13px;">
            <strong style="color: #111111;">Application Summary:</strong><br>
            • Candidate Name: <strong>${fullname}</strong><br>
            ${registerNumber ? `• Register Number: <strong>${registerNumber}</strong><br>` : ""}
            ${dept ? `• Department: <strong>${dept}</strong><br>` : ""}
            ${year ? `• Year of Study: <strong>${year} Year</strong><br>` : ""}
        </div>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Our team is reviewing your profile and credentials. We will keep you updated via email and announcements regarding the next stages of the selection process.
        </p>

        <div class="btn-holder" style="text-align: center; margin: 28px 0;">
            <a
                href="https://hivemindsist.dev"
                class="cat-btn"
                style="background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 13px 28px; font-size: 14px; font-weight: bold; display: inline-block; border-radius: 4px; letter-spacing: 0.5px;">
                Explore HiveMind
            </a>
        </div>
    `;
    return getBaseEmailTemplate(contentHtml);
};

// ===============================
// Leads Notification Email
// ===============================
export const getLeadsNotificationEmail = (
    fullname: string,
    registerNumber: string,
    email: string,
    phoneNumber: string,
    dept: string,
    year: string,
    domains: string,
    languages: string,
    whyJoin: string,
    howDidYouHear: string,
    resume: string,
    linkedin: string,
    github: string,
    portfolio: string
): string => {
    const escapeHtml = (text: string) => {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const contentHtml = `
        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">Hello Leads,</p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            A new membership application has been submitted on the HiveMind website.
        </p>

        <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 18px; margin: 20px 0; font-size: 13px; line-height: 1.7;">
            <strong style="font-size: 14px; color: #000000;">Applicant Details:</strong><br><br>
            • <strong>Name:</strong> ${escapeHtml(fullname)}<br>
            • <strong>Register No:</strong> ${escapeHtml(registerNumber)}<br>
            • <strong>Email:</strong> <a href="mailto:${email}" style="color: #000000; text-decoration: underline;">${escapeHtml(email)}</a><br>
            • <strong>Phone:</strong> ${escapeHtml(phoneNumber)}<br>
            • <strong>Department & Year:</strong> ${escapeHtml(dept)} (${escapeHtml(year)} Year)<br>
            • <strong>Domain of Interest:</strong> ${escapeHtml(domains)}<br>
            • <strong>Languages:</strong> ${escapeHtml(languages)}<br><br>

            <strong style="color: #000000;">Why Join:</strong><br>
            <p style="background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #eeeeee; margin: 6px 0 12px 0;">${escapeHtml(whyJoin)}</p>

            <strong style="color: #000000;">Links & Portfolio:</strong><br>
            ${resume ? `• <a href="${resume}" target="_blank" style="color: #000000; font-weight: bold;">View Resume</a><br>` : ""}
            ${linkedin ? `• <a href="${linkedin}" target="_blank" style="color: #000000;">LinkedIn Profile</a><br>` : ""}
            ${github ? `• <a href="${github}" target="_blank" style="color: #000000;">GitHub Profile</a><br>` : ""}
            ${portfolio ? `• <a href="${portfolio}" target="_blank" style="color: #000000;">Portfolio Website</a><br>` : ""}
        </div>

        <div class="btn-holder" style="text-align: center; margin: 24px 0;">
            <a
                href="https://hivemindsist.dev/admin/login"
                class="cat-btn"
                style="background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 13px 28px; font-size: 14px; font-weight: bold; display: inline-block; border-radius: 4px; letter-spacing: 0.5px;">
                Review in Admin Portal
            </a>
        </div>
    `;
    return getBaseEmailTemplate(contentHtml);
};

// ===============================
// Interview Invitation Email
// ===============================
export const getInterviewInvitationEmail = (
    fullname: string,
    date: string,
    time: string
): string => {
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

    const contentHtml = `
        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">Dear <strong>${fullname}</strong>,</p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Congratulations! We are pleased to inform you that your application has been shortlisted for the <strong>Technical Interview</strong> stage with the HiveMind core team.
        </p>

        <div style="background-color: #fffdf0; border: 1px solid #ffcd00; border-left: 5px solid #ffcd00; border-radius: 6px; padding: 18px; margin: 22px 0; font-size: 13px; line-height: 1.8;">
            <strong style="font-size: 14px; color: #000000; text-transform: uppercase; letter-spacing: 0.5px;">Interview Details:</strong><br>
            • <strong>Date:</strong> ${formattedDate}<br>
            • <strong>Time:</strong> ${time}<br>
            • <strong>Venue:</strong> AI Supercomputing Lab, Sathyabama Institute of Science and Technology
        </div>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Please arrive on time and come prepared to discuss your technical interests, past projects, problem-solving skills, and enthusiasm for hands-on collaboration.
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            We look forward to meeting you!
        </p>
    `;
    return getBaseEmailTemplate(contentHtml);
};

// ===============================
// Candidate Acceptance Email
// ===============================
export const getCandidateAcceptanceEmail = (fullname: string): string => {
    const contentHtml = `
        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">Dear <strong>${fullname}</strong>,</p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            <strong>Welcome to the Hive! 🐝</strong>
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            We are delighted to inform you that you have been selected to join <strong>HiveMind</strong> as an official member!
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Your passion, technical curiosity, and attitude stood out during our recruitment process. We are excited to build cutting-edge projects, host impactful events, and conduct high-performance computing research together with you.
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Detailed instructions regarding onboarding, internal communication channels, and initial team allocation will be communicated to you shortly.
        </p>

        <div class="btn-holder" style="text-align: center; margin: 28px 0;">
            <a
                href="https://hivemindsist.dev"
                class="cat-btn"
                style="background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 13px 28px; font-size: 14px; font-weight: bold; display: inline-block; border-radius: 4px; letter-spacing: 0.5px;">
                Visit HiveMind Portal
            </a>
        </div>
    `;
    return getBaseEmailTemplate(contentHtml);
};

// ===============================
// Candidate Rejection Email
// ===============================
export const getCandidateRejectionEmail = (fullname: string, reason: string = ""): string => {
    const escapeHtml = (text: string) => {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const escapedReason = escapeHtml(reason.trim());

    const contentHtml = `
        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">Dear <strong>${fullname}</strong>,</p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            Thank you for taking the time to apply and participate in the HiveMind Recruitment process.
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            We received a very high volume of exceptional applications this season. After thorough evaluation, we regret to inform you that we are unable to offer you a position in the core team at this time.
        </p>

        ${escapedReason ? `
        <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-left: 4px solid #e53e3e; border-radius: 6px; padding: 14px; margin: 20px 0; font-size: 13px; color: #742a2a;">
            <strong>Feedback from the Team:</strong><br>
            ${escapedReason}
        </div>
        ` : ""}

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            We sincerely appreciate your interest and effort. We strongly encourage you to keep building, participating in our open community events and workshops, and applying again in future recruitment cycles.
        </p>

        <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 16px;">
            We wish you the very best in all your future endeavors.
        </p>
    `;
    return getBaseEmailTemplate(contentHtml);
};
