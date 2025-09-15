// ==========================
// SECTION + DYNAMIC MODAL SETUP
// ==========================

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
