/**
 * frp-report.js
 * AxtCity Roleplay | Client-Side FRP Report Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('frpReportForm');
    const errorDiv = document.getElementById('formError');
    const narrativeField = document.getElementById('detailedNarrative');
    const submitBtn = form.querySelector('.submit-btn');
    const MIN_NARRATIVE_LENGTH = 200;
    const API_ENDPOINT = '/api/frp-report'; // Dedicated API Endpoint

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. Reset error state and validation
        errorDiv.style.display = 'none';
        let isValid = true;
        let errorMessage = "Please check all highlighted fields and ensure mandatory information is provided.";
        
        // Clear previous visual errors
        form.querySelectorAll('[required]').forEach(input => {
            input.style.borderColor = '#333';
        });

        // 2. Client-side Validation Checks
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
            errorMessage = `The detailed narrative must be at least ${MIN_NARRATIVE_LENGTH} characters long.`;
        }
        
        // 4. Violation Type Check: Must select at least one
        const violationCheckboxes = form.querySelectorAll('input[name="violationType"]:checked');
        if (violationCheckboxes.length === 0) {
            isValid = false;
            errorMessage = "You must select at least one Type of Violation.";
        }

        // 5. Handle Submission based on validation
        if (!isValid) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
            const firstError = form.querySelector('[style*="border-color: var(--error-color)"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // --- VALIDATION SUCCESS: Initiate API Submission ---

        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            if (key === 'violationType') {
                data[key] = formData.getAll('violationType');
            } else {
                data[key] = value;
            }
        }

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // SUCCESS visual feedback
                form.innerHTML = `
                    <div style="text-align: center; padding: 50px 0;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 20px;"></i>
                        <h2 style="font-family: 'Poppins', sans-serif;">Report Submitted Successfully!</h2>
                        <p style="color: var(--text-muted); margin-top: 15px;">Your FRP Report has been assigned Case ID: <strong>${result.caseId}</strong>.</p>
                        <p style="color: var(--text-muted); margin-top: 5px;">A confirmation has been sent to ${data.reporterEmail}. Our FRP Team will touch with you ASAP.</p>
                    </div>
                `;
            } else {
                // API FAILED 
                errorDiv.textContent = `Submission failed: ${result.message || 'Server error occurred.'}`;
                errorDiv.style.display = 'block';
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            errorDiv.textContent = 'Network error: Could not reach the server.';
            errorDiv.style.display = 'block';

        } finally {
            if (!response || !response.ok) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
});
