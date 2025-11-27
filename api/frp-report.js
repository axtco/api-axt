/**
 * frp-report.js
 * AxtCity Roleplay | Client-Side Form Validation & API Submission
 * * NOTE: This script sends a POST request to a backend endpoint (/api/submit-frp).
 * That backend endpoint (a Vercel Function or similar) MUST be set up 
 * to handle the Resend email logic (Case ID generation, sending confirmation, 
 * and sending admin copy) as required by the user.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('frpReportForm');
    const errorDiv = document.getElementById('formError');
    const narrativeField = document.getElementById('detailedNarrative');
    const submitBtn = form.querySelector('.submit-btn');
    const MIN_NARRATIVE_LENGTH = 200;
    const API_ENDPOINT = '/api/submit-frp'; // This must point to your Resend handler

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. Reset error state
        errorDiv.style.display = 'none';
        let isValid = true;
        
        // Clear previous visual errors
        form.querySelectorAll('[required]').forEach(input => {
            input.style.borderColor = '#333';
        });

        // 2. Client-side Validation Check
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--error-color)';
            }
        });
        
        // 3. Narrative Length Check
        if (narrativeField.value.length < MIN_NARRATIVE_LENGTH) {
            isValid = false;
            narrativeField.style.borderColor = 'var(--error-color)';
            errorDiv.textContent = `The detailed narrative must be at least ${MIN_NARRATIVE_LENGTH} characters long (Current: ${narrativeField.value.length}).`;
        }
        
        // 4. Handle Submission
        if (!isValid) {
            errorDiv.style.display = 'block';
            // Scroll to the first highlighted field
            const firstError = document.querySelector('[style*="border-color: var(--error-color)"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // --- VALIDATION SUCCESS: Initiate API Submission ---

        // Collect all form data into a JSON object
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            // Special handling for multiple checkboxes
            if (key === 'violationType') {
                data[key] = formData.getAll('violationType');
            } else {
                data[key] = value;
            }
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // SUCCESS visual feedback
                form.innerHTML = `
                    <div style="text-align: center; padding: 50px 0;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 20px;"></i>
                        <h2 style="font-family: 'Poppins', sans-serif;">Report Submitted Successfully!</h2>
                        <p style="color: var(--text-muted); margin-top: 15px;">Your report has been received and assigned Case ID: <strong>${result.caseId}</strong>.</p>
                        <p style="color: var(--text-muted); margin-top: 5px;">A confirmation copy has been sent to ${data.reporterEmail}.</p>
                        <p style="margin-top: 20px;">Staff will contact you via Discord if further details are needed.</p>
                    </div>
                `;
            } else {
                // API FAILED (e.g., error from the serverless function)
                errorDiv.textContent = `Submission failed: ${result.message || 'Server error occurred.'}`;
                errorDiv.style.display = 'block';
            }

        } catch (error) {
            // NETWORK FAILED
            console.error('Fetch Error:', error);
            errorDiv.textContent = 'Network error: Could not reach the server. Check your connection.';
            errorDiv.style.display = 'block';

        } finally {
            // Reset button state on failure
            if (!response || !response.ok) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
});
