// ==========================
// SECTION + DYNAMIC MODAL SETUP
// ==========================

// Utility to inject CSS
function injectCSS(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

// Hide existing form if present
const existingForm = document.querySelector("form");

// Create glass wall section
const glassSection = document.createElement("section");
glassSection.className = "glass-wall-section";
glassSection.innerHTML = `
  <div class="glass-content">
    <h2>Hello Conversion!</h2>
    <p>Click on the button below to contact us</p>
    <button class="glass-button" id="openModalBtn" anim="sheen">Click here</button>
  </div>
`;

// Insert glass section
if (existingForm) {
  existingForm.parentElement.insertBefore(glassSection, existingForm);
  existingForm.style.display = "none";
} else {
  const mainContent =
    document.querySelector("main") ||
    document.querySelector(".container") ||
    document.body;
  mainContent.appendChild(glassSection);
}

// Modal HTML structure
const modalHTML = `
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-container">
      <div class="progress-bar">
        <div class="progress-step active" data-step="1">
          <div class="step-icon">&#x1F464;</div>
          <span class="step-text">User Information</span>
        </div>
        <div class="progress-step" data-step="2">
          <div class="step-icon">&#x1F4AC;</div>
          <span class="step-text">Inquiry</span>
        </div>
        <div class="progress-step" data-step="3">
          <div class="step-icon">&#x2713;</div>
          <span class="step-text">Complete</span>
        </div>
      </div>

      <div class="modal-content">
        <div class="modal-step" data-step="1">
          <h3>Personal Information</h3>
          <form id="step1Form">
            <input type="text" name="firstName" placeholder="First Name" required>
            <input type="text" name="lastName" placeholder="Last Name" required>
            <input type="email" name="email" placeholder="Email Address" required>
            <div class="step-buttons">
              <button type="button" class="btn-next" onclick="nextStep()">Next</button>
            </div>
          </form>
        </div>

        <div class="modal-step hidden" data-step="2">
          <h3>How can we help you?</h3>
          <form id="step2Form">
            <textarea name="message" placeholder="Tell us about your project..." required></textarea>
            <label class="checkbox-label" for="newsletter-checkbox">
              <input type="checkbox" id="newsletter-checkbox" name="newsletter" required>
              <span>I agree to receive communications from Conversion.com</span>
            </label>
            <div class="step-buttons">
              <button type="button" class="btn-back" onclick="prevStep()">Back</button>
              <button type="submit" class="btn-submit">Submit</button>
            </div>
          </form>
        </div>

        <div class="modal-step hidden" data-step="3">
          <div class="thank-you">
            <h3>Thank You!</h3>
            <p>Your message has been received. We'll get back to you soon!</p>
            <button type="button" class="btn-close" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>

      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML("beforeend", modalHTML);

// Modal state
let currentStep = 1;

// ==========================
// SECTION: Modal Functions
// ==========================
function openModal() {
  const modal = document.getElementById("modalOverlay");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
  currentStep = 1;
  showStep(1);
  updateProgressBar();
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  modal.classList.remove("show");
  document.body.style.overflow = "";
  resetModal();
}

function nextStep() {
  if (validateCurrentStep()) {
    currentStep++;
    showStep(currentStep);
    updateProgressBar();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgressBar();
  }
}

function showStep(step) {
  document
    .querySelectorAll(".modal-step")
    .forEach((s) => s.classList.add("hidden"));
  const currentStepElement = document.querySelector(
    `.modal-step[data-step="${step}"]`
  );
  if (currentStepElement) currentStepElement.classList.remove("hidden");
}

function updateProgressBar() {
  document.querySelectorAll(".progress-step").forEach((step, index) => {
    const stepNum = index + 1;
    step.classList.remove("active", "completed");
    if (stepNum === currentStep) step.classList.add("active");
    else if (stepNum < currentStep) step.classList.add("completed");
  });
}

function validateCurrentStep() {
  const currentForm = document.querySelector(`#step${currentStep}Form`);
  if (!currentForm) return true;
  const inputs = currentForm.querySelectorAll(
    "input[required], textarea[required]"
  );
  for (let input of inputs) {
    if (input.type === "checkbox" && !input.checked) {
      input.focus();
      alert(`Please check: ${input.closest("label").textContent.trim()}`);
      return false;
    } else if (input.value.trim() === "") {
      input.focus();
      alert(
        `Please fill in: ${input.placeholder || input.name || "this field"}`
      );
      return false;
    }
  }
  return true;
}

function resetModal() {
  currentStep = 1;
  showStep(1);
  updateProgressBar();
  document.querySelectorAll("form").forEach((form) => form.reset());
}

// Expose functions globally
window.openModal = openModal;
window.closeModal = closeModal;
window.nextStep = nextStep;
window.prevStep = prevStep;

// ==========================
// SECTION: Event Listeners
// ==========================
document.addEventListener("submit", (e) => {
  if (e.target.id === "step2Form") {
    e.preventDefault();
    if (validateCurrentStep()) nextStep();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});

setTimeout(() => {
  const btn = document.getElementById("openModalBtn");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }
}, 100);

// =====================================
// CSS INJECTION
// =====================================

const glassWallCSS = `
/* Import Open Props easings */
@import "https://unpkg.com/open-props@1.6.17/easings.min.css";

/* Sheen animation keyframes */
@keyframes sheen {
  100% {
    transform: rotateZ(60deg) translate(1em, -9em);
  }
}

/* Sheen animation trigger */
[anim="sheen"]:not(.toggled)::after {
  animation: sheen var(--ease-elastic-in-1) 1s infinite;
}

/* Sheen pseudo-element */
[anim="sheen"]::after {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.3)
  );
  transform: rotateZ(60deg) translate(-5em, 7.5em);
}

/* Glass wall effect */
body {
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5;
  pointer-events: none;
}

.glass-wall-section {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.glass-content {
  animation: cloudFloat 8s ease-in-out infinite;
}

@keyframes cloudFloat {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-8px, -4px); }
  50%  { transform: translate(0, 0); }
  75%  { transform: translate(8px, 4px); }
  100% { transform: translate(0, 0); }
}

.glass-content h2 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
  font-weight: 700;
}

.glass-content p {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Button with pixel-perfect styling */
.glass-button {
  background: #4ade80;
  color: white;
  border: 1px solid #000;
  border-radius: 0;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.glass-button:hover:not(:disabled) {
  background: #22c55e;
}

.glass-button:focus:not(:disabled) {
  outline: 2px solid #0ea5e9;
  outline-offset: 1px;
}

.glass-button:active:not(:disabled) {
  background: #16a34a;
}

.glass-button:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: translateY(50px) scale(0.9);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-overlay.show .modal-container {
  transform: translateY(0) scale(1);
}

/* Progress Bar */
.progress-bar {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
}

.progress-step::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.progress-step:last-child::after {
  display: none;
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  border: 3px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

/* Active step - Blue with bold text and animation */
.progress-step.active .step-icon {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  animation: stepPulse 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.progress-step.active .step-text {
  color: #3b82f6;
  font-weight: 700;
}

/* Completed step - Blue background with green checkmark */
.progress-step.completed .step-icon {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  position: relative;
}

.progress-step.completed .step-icon::after {
  content: "✓";
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
  animation: checkmarkPop 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.progress-step.completed .step-text {
  color: #3b82f6;
  font-weight: 600;
}

.progress-step.completed::after {
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  animation: progressLineGrow 0.8s ease-out;
}

/* Future steps - White background */
.progress-step:not(.active):not(.completed) .step-icon {
  background: white;
  border-color: #e2e8f0;
  color: #9ca3af;
}

.progress-step:not(.active):not(.completed) .step-text {
  color: #9ca3af;
}

/* Modal Content */
.modal-content {
  padding: 2rem;
}

.modal-step {
  animation: fadeSlideIn 0.4s ease;
}

.modal-step.hidden {
  display: none;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.modal-step h3 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Form Styles */
.modal-step input,
.modal-step textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.modal-step input:focus,
.modal-step textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-step textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-label {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  font-size: 0.9rem !important;
  color: #64748b !important;
  margin-bottom: 1.5rem !important;
  cursor: pointer !important;
  line-height: 1.4 !important;
}

/* Custom checkbox styling */
.modal-container input[type="checkbox"],
#modalOverlay input[type="checkbox"] {
  appearance: none !important;
  -webkit-appearance: none !important;
  width: 18px !important;
  height: 18px !important;
  border: 2px solid #333 !important;
  border-radius: 3px !important;
  background: #fff !important;
  cursor: pointer !important;
  position: relative !important;
  margin: 0 !important;
  margin-top: 3px !important;
  flex-shrink: 0 !important;
}

.modal-container input[type="checkbox"]:checked,
#modalOverlay input[type="checkbox"]:checked {
  background: #fff !important;
  border-color: #000 !important;
}

.modal-container input[type="checkbox"]:checked::after,
#modalOverlay input[type="checkbox"]:checked::after {
  content: "✓" !important;
  color: #000 !important;
  font-size: 12px !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  line-height: 1 !important;
}

/* Buttons */
.step-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-next, .btn-submit, .btn-back, .btn-close {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-next, .btn-submit {
  background: #3b82f6;
  color: white;
}

.btn-next:hover, .btn-submit:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-back {
  background: #f1f5f9;
  color: #64748b;
}

.btn-back:hover {
  background: #e2e8f0;
}

.btn-close {
  background: #22c55e;
  color: white;
  margin: 0 auto;
  display: block;
}

.btn-close:hover {
  background: #16a34a;
}

/* Close X button */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1f2937;
}

/* Thank you page */
.thank-you {
  text-align: center;
  padding: 2rem 0;
}

.thank-you h3 {
  color: #22c55e;
  margin-bottom: 1rem;
}

.thank-you p {
  color: #64748b;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .glass-wall-section {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .glass-content h2 {
    font-size: 2rem;
  }
  
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .progress-bar {
    padding: 1rem;
  }
  
  .step-text {
    font-size: 10px;
  }
  
  .step-buttons {
    flex-direction: column;
  }
}
`;

// Inject the CSS styles
injectCSS(glassWallCSS);
