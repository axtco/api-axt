// /api/frp-report.js

import { Resend } from 'resend';

// Initialize Resend (API key must be set in Vercel environment variables)
const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = 'cases@mail.axtcity@online';
const ADMIN_EMAIL = 'no-reply@axtnq.xyz';

/**
 * Generates a unique, random case ID: AXT-R12A34
 * @returns {string} The generated Case ID.
 */
function generateCaseId() {
    // Generate 6 random alphanumeric characters
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AXT-${randomPart}`;
}

/**
 * Utility function to format the submission data into an HTML list for emails.
 * @param {object} data - The submitted form data.
 * @param {string} caseId - The generated case ID.
 * @returns {string} HTML content.
 */
function formatSubmissionHTML(data, caseId) {
    // Ensure violationType is an array for safety
    const violations = Array.isArray(data.violationType) ? data.violationType.join(', ') : data.violationType;
    
    let html = `
        <div style="font-family: sans-serif; line-height: 1.6; padding: 20px; border: 1px solid #ff000020; border-radius: 8px; background: #fafafa;">
            <h3 style="color: #ff0000; border-bottom: 2px solid #eee; padding-bottom: 10px;">FRP Report Details (Case ID: ${caseId})</h3>
            <p><strong>Reporter IC Name:</strong> ${data.reporterICName}</p>
            <p><strong>Reporter Discord ID:</strong> ${data.reporterDiscordID}</p>
            <p><strong>Reporter Email:</strong> ${data.reporterEmail}</p>
            <p><strong>Incident Time:</strong> ${new Date(data.incidentTime).toLocaleString()}</p>
            <hr style="border: 1px solid #eee;">
            <h4 style="color: #333;">Incident & Violation:</h4>
            <p><strong>Accused Names:</strong> ${data.accusedICName.replace(/\n/g, '<br>')}</p>
            <p><strong>Violations:</strong> ${violations}</p>
            <h4 style="color: #333;">Detailed Narrative:</h4>
            <p>${data.detailedNarrative.replace(/\n/g, '<br>')}</p>
            <p><strong>Evidence Link:</strong> <a href="${data.evidenceLink}">${data.evidenceLink}</a></p>
        </div>
    `;
    return html;
}


// Main handler for the Vercel Serverless Function
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const formData = req.body;
        const caseId = generateCaseId();
        const submissionHTML = formatSubmissionHTML(formData, caseId);
        
        const userEmail = formData.reporterEmail;
        if (!userEmail) {
             return res.status(400).json({ success: false, message: 'Missing reporter email address.' });
        }

        // 1. Send Admin Notification (Submission Copy)
        await resend.emails.send({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL, // Admin email
            subject: `🚨 NEW FRP REPORT SUBMITTED - Case ${caseId}`,
            html: `
                <p>A new FRP report has been filed and requires staff review:</p>
                ${submissionHTML}
                <p style="margin-top: 20px;"><strong>Action Required:</strong> Log into the Admin Panel to assign this case.</p>
            `,
        });

        // 2. Send Confirmation Mail to User
        await resend.emails.send({
            from: SENDER_EMAIL,
            to: userEmail,
            subject: `✅ Your AxtCity FRP Report #${caseId} Has Been Received`,
            html: `
                <h1 style="color: #ff0000;">Report Received!</h1>
                <p>This confirms that your Fail RP report has been successfully submitted and assigned the Case ID: <strong>${caseId}</strong>.</p>
                <p>Our FRP Team will review the provided information and evidence. We will reach out to you via Discord (or email) ASAP regarding the investigation.</p>
                
                <h3 style="color: #333; margin-top: 20px;">Your Submission Copy:</h3>
                ${submissionHTML}

                <p style="margin-top: 30px; color: #777; font-size: 0.9em;">Do not reply to this automated email. All official communication will be handled by staff.</p>
            `,
        });

        // Success response
        return res.status(200).json({ 
            success: true, 
            message: 'Report submitted and confirmation emails sent.',
            caseId: caseId
        });

    } catch (error) {
        console.error('Resend Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred during submission. Check server logs.',
            error: error.message
        });
    }
}
