import nodemailer from "nodemailer";

// Retrieve Email Transporter settings from environment
const getTransporter = async () => {
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

    // Use Gmail service if EMAIL_USER and EMAIL_PASS are set
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER || emailUser;
    const pass = process.env.SMTP_PASS || emailPass;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }

    if (emailUser && emailPass) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });
    }

    throw new Error("Email credentials (EMAIL_USER / EMAIL_PASS) are not configured in environment variables.");
};

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    try {
        const transporter = await getTransporter();
        const from = process.env.EMAIL_FROM || `"HiveMind Community" <${process.env.EMAIL_USER || "hivemindsist@gmail.com"}>`;

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        return { success: true, messageId: info.messageId, previewUrl };
    } catch (error: any) {
        return { success: false, error: error?.message || error };
    }
};


