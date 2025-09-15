// ==========================
// 3. LIFTMAP DOM MANIPULATION
// ==========================

// Constants
const H1_TEXT = "We are the best experimentation agency in the world";
const BUTTON_TEXT = "Contact us";

function applyLiftmapChanges() {
  observer.disconnect();

  // Update H1 text and add value props list if missing
  const h1 =
    document.querySelector("h1") || document.querySelector(".lm-hero__header");
  if (h1) {
    h1.textContent = H1_TEXT;

    if (!document.querySelector(".liftmap-value-props")) {
      const ul = document.createElement("ul");
      ul.className = "liftmap-value-props";
      ul.innerHTML = `
        <li><span>✔</span> Increase conversion rates across your website</li>
        <li><span>✔</span> Iterative site redesign</li>
        <li><span>✔</span> Improve ROAS efficiency</li>
        <li><span>✔</span> Standing or scaling an experimentation program</li>
        <li><span>✔</span> Advanced customer research</li>
      `;
      h1.insertAdjacentElement("afterend", ul);
    }
  }

  // Update buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    if (btn.textContent.trim() === "Request a demo") {
      btn.textContent = BUTTON_TEXT;
    }
  });

  const whyButton = document.querySelector(".btn.btn-video");
  const whySection = document.querySelector(".lm-why");

  if (whyButton && whySection) {
    const span = whyButton.querySelector("span");
    if (span) span.remove();

    if (!whyButton.dataset.liftmapProcessed) {
      const newBtn = whyButton.cloneNode(true);
      newBtn.dataset.liftmapProcessed = "true";
      whyButton.replaceWith(newBtn);

      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        whySection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  observer.observe(document.body, { childList: true, subtree: true });
}

const observer = new MutationObserver(applyLiftmapChanges);

applyLiftmapChanges();
observer.observe(document.body, { childList: true, subtree: true });
