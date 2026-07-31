import nodemailer from "nodemailer";

// Retrieve SMTP settings from environment
const getTransporter = async () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: { user, pass }
        });
    }

    throw new Error("SMTP credentials are not configured in environment variables.");
};

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    try {
        const transporter = await getTransporter();
        const from = process.env.EMAIL_FROM || '"HiveMind Team" <noreply@hivemindsist.dev>';

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


