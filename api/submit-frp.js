// /api/submit-frp.js

import { Resend } from 'resend';

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the sender email based on user request
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
    let html = `
        <div style="font-family: sans-serif; line-height: 1.6;">
            <h3 style="color: #ff0000;">Case ID: ${caseId}</h3>
            <p><strong>Reporter IC Name:</strong> ${data.reporterICName}</p>
            <p><strong>Reporter Discord ID:</strong> ${data.reporterDiscordID}</p>
            <p><strong>Incident Time:</strong> ${new Date(data.incidentTime).toLocaleString()}</p>
            <hr style="border: 1px solid #eee;">
            <h4 style="color: #333;">Incident Details:</h4>
            <p><strong>Accused Names:</strong> ${data.accusedICName.replace(/\n/g, '<br>')}</p>
            <p><strong>Location:</strong> ${data.incidentLocation}</p>
            <p><strong>Faction Involved:</strong> ${data.factionInvolved}</p>
            <p><strong>Violation Type(s):</strong> ${Array.isArray(data.violationType) ? data.violationType.join(', ') : data.violationType}</p>
            <hr style="border: 1px solid #eee;">
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
        // Only allow POST requests
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const formData = req.body;
        const caseId = generateCaseId();
        const submissionHTML = formatSubmissionHTML(formData, caseId);
        
        // Assuming the user's email is stored in a hidden field or passed through
        // If not, we cannot send a confirmation email. For this example, we assume
        // the reporter provides an email address (let's use the Discord ID placeholder 
        // as a temporary stand-in, but this needs a real email field in the form).
        const reporterEmailPlaceholder = "REPORTER_EMAIL_PLACEHOLDER@axtcity.online"; 

        // 1. Send Admin Notification (Submission Copy)
        await resend.emails.send({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL, // Admin email
            subject: `🚨 NEW FRP REPORT SUBMITTED - Case ${caseId}`,
            html: `
                <p>A new FRP report has been filed and requires immediate staff review.</p>
                ${submissionHTML}
                <p><strong>Action Required:</strong> Log into the Admin Panel to assign this case.</p>
            `,
        });

        // 2. Send Confirmation Mail to User (Using placeholder)
        await resend.emails.send({
            from: SENDER_EMAIL,
            to: reporterEmailPlaceholder, // Replace with actual user email field from form
            subject: `✅ Your AxtCity FRP Report #${caseId} Has Been Received`,
            html: `
                <h1 style="color: #ff0000;">Thank You for Reporting!</h1>
                <p>This confirms that your Fail RP report has been successfully submitted and assigned the Case ID: <strong>${caseId}</strong>.</p>
                <p>Our staff team will review the provided evidence and narrative. Please allow 24-48 hours for an initial review.</p>
                
                <h3 style="color: #333;">Your Submission Copy:</h3>
                ${submissionHTML}

                <p style="margin-top: 30px; color: #777; font-size: 0.9em;">Do not reply to this automated email. All communication will be handled via the official AxtCity Discord.</p>
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
            message: 'An error occurred during submission.',
            error: error.message
        });
    }
}
