// ==========================
// 3. LIFTMAP DOM MANIPULATION
// ==========================

// Utility to inject CSS
function injectCSS(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

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

// ==========================
// SECTION: CSS Injection
// ==========================
const liftmapCSS = `
.lm-hero__header {
  max-width: none !important;
  margin-bottom: 0 !important;
}

.liftmap-value-props {
  margin-top: 1rem;
  padding-left: 0;
  list-style: none;
}

.liftmap-value-props li {
  color: #fff;  
  margin: 0.5rem 0;
  font-size: 1.2rem;
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
}

.liftmap-value-props li span {
  color: #fff;    
  margin-right: 0.75rem !important;
  flex-shrink: 0;
  font-size: 1.2em;
}

@media (max-width: 950px) {
  .lm-hero .lm-hero__left .lm-hero__image {
    max-width: none !important; 
    min-width: 0 !important; 
    width: 33% !important;
    height: auto !important;
  }
}

@media (max-width: 768px) {
  .liftmap-value-props li {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .liftmap-value-props {
    margin-top: 0.75rem;
  }
  .liftmap-value-props li {
    font-size: 0.8rem;
    margin: 0.4rem 0;
  }
  .liftmap-value-props li span {
    margin-right: 0.5rem !important;
  }
  .lm-hero .lm-hero__left .lm-hero__image {
    width: 45% !important;
  }
}
`;

injectCSS(liftmapCSS);
