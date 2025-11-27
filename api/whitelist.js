// api/whitelist.js
import { Resend } from 'resend';

// Initialize Resend using the environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates are defined as functions to keep them clean
const generateUserConfirmationEmail = (name) => {
    // Inject the name into the HTML template provided earlier, ensuring inline CSS.
    // NOTE: This should be your full, production-ready HTML email template with inline CSS.
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received - AxtCity RP</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Poppins', sans-serif; line-height: 1.6;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050505;">
            <tr>
                <td align="center" style="padding: 0 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px 0; background-color: #111111; border-radius: 15px; border: 1px solid #222222;">
                        
                        <tr>
                            <td align="center" style="padding: 30px 0 20px 0; background-color: #050505; border-bottom: 2px solid #ff0000; border-radius: 15px 15px 0 0;">
                                <img src="https://cdn.axt.co.in/logo.jpg" alt="AxtCity Logo" width="60" style="display: block; border-radius: 12px; margin: 0 auto 10px;">
                                <div style="font-size: 30px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">AXT<span style="color: #ff0000;">City</span></div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 40px 30px;">
                                <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 10px 0; color: #ffffff;">
                                    <span style="color: #ff0000;">${name}</span>, Welcome to AxtCity Roleplay
                                </h1>
                                <p style="font-size: 14px; color: #aaaaaa; margin: 0 0 30px 0;">Application Received</p>

                                <div style="margin-bottom: 40px; border-left: 4px solid #ff0000; padding-left: 20px; text-align: left;">
                                    <p style="font-size: 20px; font-weight: 800; line-height: 1.1; color: #ffffff; margin: 0;">
                                        Play Behind
                                        <br>
                                        <span style="color: #ff0000;">Reality.</span>
                                    </p>
                                </div>

                                <div style="padding: 20px; background-color: #0d0d0d; border-radius: 8px; margin-bottom: 40px; border: 1px solid #333333; text-align: center;">
                                    <p style="font-size: 16px; font-weight: 600; color: #ff0000; margin: 0 0 10px 0;">
                                        STATUS: ON WAITING LIST
                                    </p>
                                    <p style="font-size: 14px; color: #aaaaaa; margin: 0;">
                                        We've received your application. Our City Management team will review it. You'll be notified of the status via this email.
                                    </p>
                                </div>

                                <a href="https://discord.gg/yourlink" style="background-color: #ff0000; color: #ffffff !important; border-radius: 8px; padding: 12px 25px; display: inline-block; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);">
                                    Join Our Discord for Updates
                                </a>
                                
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 30px 20px 20px 20px; border-top: 1px solid #222;">
                                <p style="font-size: 12px; color: #666666; margin: 0;">&copy; ${new Date().getFullYear()} AxtCity Roleplay. All Rights Reserved.</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Simple text-based template for admin copy
const generateAdminApplicationSummary = (data) => {
    let summary = `New AxtCity Whitelist Application Submitted!\n\n`;
    summary += `--- BASIC INFORMATION ---\n`;
    summary += `RP Name: ${data.rp_name}\n`;
    summary += `Discord: ${data.discord_username}\n`;
    summary += `Email: ${data.email}\n`;
    summary += `FiveM ID: ${data.fivem_id}\n`;
    summary += `Age: ${data.age}\n`;
    summary += `Timezone/Country: ${data.timezone}\n`;
    summary += `Date Submitted: ${data.date}\n\n`;

    summary += `--- CHARACTER DETAILS ---\n`;
    summary += `Char Name: ${data.char_name}\n`;
    summary += `Motivation: ${data.motivation}\n`;
    summary += `Background: ${data.char_background}\n`;
    summary += `Ambition: ${data.char_ambition}\n\n`;

    summary += `--- RP KNOWLEDGE CHECK ---\n`;
    summary += `RDM: ${data.rdm.substring(0, 100)}...\n`;
    summary += `VDM: ${data.vdm.substring(0, 100)}...\n`;
    // ... add all other fields

    return summary;
};


export default async function handler(req, res) {
    // 1. Check HTTP Method
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 2. Simple Data Validation
    const data = req.body;
    const requiredFields = ['rp_name', 'email', 'discord_username', 'rdm', 'agree_rules'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return res.status(400).json({ message: `Missing required field: ${field}` });
        }
    }

    // 3. Send Emails via Resend
    try {
        const userEmail = data.email;
        const rpName = data.rp_name;

        // --- A. Send Confirmation Email to User ---
        await resend.emails.send({
            from: 'AxtCity Roleplay <citynotify@mail.axtcity.online>', // Must be a verified domain/sender in Resend
            to: [userEmail],
            subject: `✅ Application Received: Welcome, ${rpName}!`,
            html: generateUserConfirmationEmail(rpName),
        });

        // --- B. Send Copy to Admin ---
        await resend.emails.send({
            from: 'AxtCity Roleplay Notifier <citynotify@mail.axtcity.online>',
            to: ['aleena.john@mail.axt.co.in'],
            subject: `🚨 NEW WHITELIST APP: ${rpName} (${data.discord_username})`,
            text: generateAdminApplicationSummary(data),
        });
        
        // 4. Success Response
        return res.status(200).json({ message: 'Application submitted and confirmation email sent!' });

    } catch (error) {
        console.error('Resend Error:', error);
        return res.status(500).json({ 
            message: 'Application submitted, but failed to send confirmation email.',
            error: error.message 
        });
    }
}
