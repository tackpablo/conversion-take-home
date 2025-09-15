// =====================================
// 2. FOOTER ACTION DRAWER WITH SLIDER - PokéAPI EXAMPLE
// =====================================

// Utility: inject CSS into the page
function injectCSS(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

// Utility: create DOM elements with attributes and children
function el(tag, attrs = {}, children = []) {
  const d = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") d.className = v;
    else if (k === "html") d.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      d.addEventListener(k.slice(2), v);
    else d.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    d.append(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return d;
}

// ----------------------
// Overlay & Drawer
// ----------------------
const overlay = el("div", {
  class: "conv-drawer-overlay",
  id: "convDrawerOverlay",
});
document.body.appendChild(overlay);

const drawer = el("div", { class: "conv-drawer", id: "convDrawer" });
const inner = el("div", { class: "conv-drawer-inner" });

// Drawer header
const head = el("div", { class: "conv-drawer-head" });
const title = el("div", { class: "conv-drawer-title" }, [
  el("span", { html: "Explore" }),
  el("span", { html: "•" }),
  el("span", { html: "Pokémon" }),
]);
const controls = el("div", { class: "conv-drawer-controls" });
const pageIndicator = el(
  "div",
  { class: "conv-page-indicator", id: "convPageIndicator" },
  "Loading..."
);
controls.appendChild(pageIndicator);

head.appendChild(title);
head.appendChild(controls);

// Slider + navigation arrows
const sliderWrap = el("div", { class: "conv-slider-wrap" });
const prevArrow = el(
  "button",
  { class: "conv-arrow prev", type: "button", title: "Previous" },
  "◀"
);
const nextArrow = el(
  "button",
  { class: "conv-arrow next", type: "button", title: "Next" },
  "▶"
);
const slider = el("div", { class: "conv-slider", id: "convSlider" });

sliderWrap.appendChild(prevArrow);
sliderWrap.appendChild(slider);
sliderWrap.appendChild(nextArrow);

// Footer row
const footerRow = el("div", { class: "conv-row" }, [
  el("div", { class: "conv-row-footer" }, "Data from PokéAPI"),
]);

inner.appendChild(head);
inner.appendChild(sliderWrap);
inner.appendChild(footerRow);
drawer.appendChild(inner);
document.body.appendChild(drawer);

// Drawer tab (always visible)
const tab = el(
  "button",
  {
    class: "conv-drawer-tab",
    id: "convDrawerTab",
    "aria-expanded": "false",
    title: "Open drawer",
  },
  [
    el("span", { style: "flex:1; text-align:left;" }, "Sticky Drawer"),
    el("span", { class: "conv-chev" }, "▲"),
  ]
);
document.body.appendChild(tab);

// Drawer header shown when open
const drawerHeader = el("div", { class: "conv-drawer-open-head" }, [
  el("span", { style: "flex:1; text-align:left;" }, "Sticky Drawer"),
  el("div", { class: "conv-drawer-nav" }, [
    el("button", { id: "convPrevBtn", class: "conv-nav-btn" }, "◀"),
    el(
      "span",
      { id: "convPageIndicator", class: "conv-page-indicator" },
      "1/2"
    ),
    el("button", { id: "convNextBtn", class: "conv-nav-btn" }, "▶"),
    el("button", { id: "convDrawerClose", class: "conv-close" }, "▼"),
  ]),
]);
drawer.insertBefore(drawerHeader, inner);

// ----------------------
// Helpers
// ----------------------

// Determine slides per view based on viewport width
function slidesPerView() {
  if (window.matchMedia("(max-width: 767px)").matches) return 1;
  if (window.matchMedia("(max-width: 1023px)").matches) return 2;
  return 4;
}

// Open/close drawer
function openDrawer() {
  drawer.classList.add("open");
  overlay.classList.add("show");
  tab.style.display = "none";
  drawerHeader.style.display = "flex";
  tab.setAttribute("aria-expanded", "true");
  updatePageIndicator();
}
function closeDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  tab.style.display = "flex";
  drawerHeader.style.display = "none";
  tab.setAttribute("aria-expanded", "false");
}
function toggleDrawer() {
  drawer.classList.contains("open") ? closeDrawer() : openDrawer();
}

// Close drawer when user scrolls near bottom
function checkBottomClose() {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 8;
  if (nearBottom) closeDrawer();
}
window.addEventListener("scroll", () => {
  if (window.__convDrawerScrollTimeout)
    clearTimeout(window.__convDrawerScrollTimeout);
  window.__convDrawerScrollTimeout = setTimeout(checkBottomClose, 80);
});

// Safer data handling
function sanitizeText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ----------------------
// Slide creation
// ----------------------
function createPokemonSlide(p) {
  const slide = el("article", { class: "conv-slide" });

  const card = el("div", {
    class: "conv-card",
    role: "group",
    "aria-label": `pokemon-${p.name}`,
  });
  const cardInner = el("div", { class: "conv-card-inner" });
  const front = el("div", { class: "conv-card-front" });
  const back = el("div", { class: "conv-card-back" });

  // Front content
  front.appendChild(el("h3", {}, sanitizeText(p.name)));
  front.appendChild(
    el("img", { class: "conv-img", src: p.image || "", alt: p.name })
  );

  const desc = el(
    "div",
    { class: "conv-meta" },
    p.flavor
      ? p.flavor.length > 140
        ? p.flavor.slice(0, 137) + "..."
        : p.flavor
      : `Type: ${p.types.join(", ")}`
  );
  front.appendChild(desc);

  const tooltip = el("div", { class: "conv-tooltip", title: "Abilities" }, [
    el("span", { html: "ℹ️" }),
    el(
      "div",
      { class: "conv-tt" },
      p.abilities.length ? p.abilities.join(", ") : "No data"
    ),
  ]);
  const cta = el(
    "button",
    { class: "conv-cta-btn", type: "button", title: "Flip card" },
    "Details"
  );
  const row = el("div", { class: "conv-row" }, [tooltip, cta]);
  front.appendChild(row);

  // Back content
  const backContent = el("div", {}, [
    el("div", { html: `<strong>#${p.id}</strong>` }),
    el("div", { html: `Height: ${p.height} | Weight: ${p.weight}` }),
    el("div", { html: `Base exp: ${p.base_experience}` }),
    el("button", { class: "conv-back-btn", type: "button" }, "Back"),
  ]);
  backContent
    .querySelector(".conv-back-btn")
    .addEventListener("click", () => card.classList.remove("flipped"));
  back.appendChild(backContent);

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(cardInner);
  slide.appendChild(card);

  // Flip card
  cta.addEventListener("click", () => card.classList.toggle("flipped"));

  // Tooltip positioning
  tooltip.addEventListener("mouseenter", () => {
    const tt = tooltip.querySelector(".conv-tt");
    if (!tt) return;
    const rect = tt.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    tt.style.top = "";
    tt.style.bottom = "calc(100% + 8px)";
    if (spaceAbove < rect.height + 12 && spaceBelow > spaceAbove) {
      tt.style.bottom = "";
      tt.style.top = "calc(100% + 8px)";
    }
  });

  return slide;
}

// ----------------------
// Slider helpers
// ----------------------
function updatePageIndicator() {
  const totalSlides = slider.querySelectorAll(".conv-slide").length;
  const spv = slidesPerView();
  const totalPages = Math.max(1, Math.ceil(totalSlides / spv));
  const pageWidth = slider.clientWidth || window.innerWidth - 40;
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Math.round((slider.scrollLeft || 0) / pageWidth) + 1)
  );
  pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
}

// Navigation arrows
[prevArrow, document.getElementById("convPrevBtn")].forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    slider.scrollBy({
      left: -(slider.clientWidth || window.innerWidth - 40),
      behavior: "smooth",
    });
  });
});
[nextArrow, document.getElementById("convNextBtn")].forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    slider.scrollBy({
      left: slider.clientWidth || window.innerWidth - 40,
      behavior: "smooth",
    });
  });
});

// Update page indicator on scroll/resize
slider.addEventListener("scroll", () => {
  if (window.__convSliderScrollTimeout)
    clearTimeout(window.__convSliderScrollTimeout);
  window.__convSliderScrollTimeout = setTimeout(updatePageIndicator, 80);
});
window.addEventListener("resize", () => {
  if (window.__convResizeTimeout) clearTimeout(window.__convResizeTimeout);
  window.__convResizeTimeout = setTimeout(updatePageIndicator, 120);
});

// Drag / swipe support for desktop
(function makeDraggable(container) {
  let isDown = false,
    startX,
    startScroll;
  container.addEventListener("pointerdown", (e) => {
    isDown = true;
    container.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startScroll = container.scrollLeft;
    container.classList.add("dragging");
  });
  container.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    container.scrollLeft = startScroll - (e.clientX - startX);
  });
  container.addEventListener("pointerup", (e) => {
    isDown = false;
    try {
      container.releasePointerCapture(e.pointerId);
    } catch (_) {}
    container.classList.remove("dragging");
  });
  container.addEventListener("pointercancel", () => {
    isDown = false;
    container.classList.remove("dragging");
  });
})(slider);

// ----------------------
// Load Pokémon data
// ----------------------
async function loadPokemons(limit = 7) {
  try {
    pageIndicator.textContent = "Loading…";
    const listJson = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    ).then((r) => r.json());
    const items = listJson.results || [];

    const detailPromises = items.map(async (it) => {
      const d = await fetch(it.url).then((r) => r.json());
      let flavor = "";
      try {
        const sp = await fetch(d.species.url).then((r) => r.json());
        const entry = (sp.flavor_text_entries || []).find(
          (e) => e.language?.name === "en"
        );
        if (entry?.flavor_text) flavor = entry.flavor_text.replace(/\s+/g, " ");
      } catch {}
      return {
        id: d.id,
        name: d.name,
        image:
          d.sprites?.other?.["official-artwork"]?.front_default ||
          d.sprites.front_default ||
          "",
        types: (d.types || []).map((t) => t.type.name),
        abilities: (d.abilities || []).map((a) => a.ability.name),
        height: d.height,
        weight: d.weight,
        base_experience: d.base_experience,
        flavor,
      };
    });

    const pokemons = await Promise.all(detailPromises);
    pokemons.forEach((p) => slider.appendChild(createPokemonSlide(p)));

    setTimeout(updatePageIndicator, 120); // ensure layout computes
  } catch (err) {
    console.error("Failed to load pokemons", err);
    pageIndicator.textContent = "Failed to load data";
  }
}

// Initialize
loadPokemons(7).then(() => {
  openDrawer();
  inner.setAttribute("tabindex", "-1");
  inner.focus({ preventScroll: true });
});

// Global reference for testing / later use
window.convDrawer = {
  drawerEl: drawer,
  overlayEl: overlay,
  sliderEl: slider,
  open: openDrawer,
  close: closeDrawer,
  toggle: toggleDrawer,
  updateIndicator: updatePageIndicator,
};

// ----------------------
// Event bindings
// ----------------------
tab.addEventListener("click", (e) => {
  e.preventDefault();
  toggleDrawer();
});
overlay.addEventListener("click", () => closeDrawer());
document
  .getElementById("convDrawerClose")
  .addEventListener("click", () => closeDrawer());

// =====================================
// CSS INJECTION
// =====================================

const drawerCSS = `
.conv-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  opacity: 0;
  visibility: hidden;
  transition: opacity .25s ease, visibility .25s;
  z-index: 99990;
}

.conv-drawer-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* drawer base */
.conv-drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99995;
  transform: translateY(100%);
  transition: transform .42s cubic-bezier(.22,.9,.35,1);
  display: flex;
  justify-content: center;
  pointer-events: none; /* allow overlay to capture clicks when hidden */
}

.conv-drawer.open {
  transform: translateY(0);
  pointer-events: auto;
}

.conv-drawer-open-head {
  position: fixed;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100001;
  width: 90%;
  max-width: 500px;
  background: orange;
  color: #000;
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  font-family: sans-serif;
  border-radius: 0;
}

.conv-drawer-open-head,
.conv-drawer-tab {
  background: #ffffff; /* match drawer inner */
  color: #000;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.15);
}

.conv-drawer-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conv-nav-btn {
  background: inherit; 
  border: none;
  font-size: 16px;
  padding: 4px 10px;
  cursor: pointer;
}

/* inner panel */
.conv-drawer-inner {
  width: min(1200px, 100%);
  background: #ffffff;
  border-radius: 12px 12px 6px 6px;
  box-shadow: 0 -12px 40px rgba(0,0,0,0.25);
  padding: 14px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* header + controls */
.conv-drawer-head {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:10px;
}
.conv-drawer-title {
  font-weight:700;
  font-size:16px;
  display:flex;
  gap:8px;
  align-items:center;
}
.conv-drawer-controls {
  display:flex;
  gap:8px;
  align-items:center;
}

/* tab with chevron (always visible) */
.conv-drawer-tab {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000;
  width: 90%;
  max-width: 500px;
  height: 48px;            
  background: orange;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  transition: transform .22s ease;
  user-select: none;
  font-family: sans-serif;
  padding: 0 16px;
  border-radius: 0;         
}


/* chevron rotation */
.conv-drawer-tab .conv-chev {
  transition: transform .34s cubic-bezier(.2,.9,.3,1);
}
.conv-drawer.open + .conv-drawer-tab .conv-chev,
.conv-drawer-tab.open .conv-chev {
  transform: rotate(180deg);
}

/* slider area */
.conv-slider-wrap{
  position:relative;
  display:block;
}
.conv-slider {
  display:flex;
  gap:12px;
  overflow-x:auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom:8px;
  padding-top:6px;
  margin:0;
}

/* slide card */
.conv-slide {
  scroll-snap-align: start;
  flex: 0 0 25%;
  box-sizing: border-box;
  border-radius: 10px;
  background: linear-gradient(180deg,#fff,#fbfbfb);
  padding:12px;
  min-height:180px;
  display:flex;
  flex-direction:column;
  gap:8px;
  box-shadow: 0 4px 14px rgba(15,15,15,0.06);
  border: 1px solid rgba(0,0,0,0.04);
}

/* responsive: tablet */
@media (max-width: 1023px) {
  .conv-slide { flex: 0 0 50%; }
}

/* responsive: mobile */
@media (max-width: 767px) {
  .conv-slide { flex: 0 0 100%; }
  .conv-drawer-inner { padding: 10px; margin: 0 10px 10px; }
    .conv-drawer-tab {
    width: 95%; /* nearly full width */
    padding: 0 12px; /* smaller padding */
  }

  .conv-drawer-inner {
    padding: 10px;
    margin: 0 5px 10px;
  }

  .conv-drawer-open-head {
    width: 95%;
    padding: 8px 12px;
  }
}

/* slide content */
.conv-slide h3 { margin:0; font-size:15px; text-transform:capitalize; }
.conv-slide .conv-img {
  width:100%;
  max-height:110px;
  display:block;
  object-fit:contain;
  background:transparent;
}

/* tooltip */
.conv-tooltip {
  position: relative;
  display:inline-block;
  cursor:help;
}
.conv-tooltip .conv-tt {
  position:absolute;
  left: 200%;
  transform: translateX(-50%) scale(.95);
  background: rgba(28,28,28,0.95);
  color:#fff;
  padding:8px 10px;
  border-radius:6px;
  font-size:13px;
  line-height:1.2;
  white-space:normal;
  max-width:220px;
  opacity:0;
  pointer-events:none;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), 
            opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  z-index: 100001;
}
.conv-tooltip:hover .conv-tt,
.conv-tooltip.show .conv-tt {
  opacity:1;
  transform: translateX(-50%) translateY(0) scale(1);
  pointer-events:auto;
}

/* arrows */
.conv-arrow {
  position:absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  width:36px;
  height:36px;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  z-index:100000;
  user-select:none;
}
.conv-arrow.prev { left: 8px; }
.conv-arrow.next { right: 8px; }

/* page indicator */
.conv-page-indicator { font-size:13px; opacity:.88; }

/* flip card */
.conv-card { perspective:1000px; }
.conv-card-inner { transition: transform .6s; transform-style: preserve-3d; position:relative; }
.conv-card-front, .conv-card-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  position:relative;
}
.conv-card-back {
  position:absolute;
  inset:0;
  transform: rotateY(180deg);
}
.conv-card.flipped .conv-card-inner {
  transform: rotateY(180deg);
}

/* CTA */
.conv-cta-btn {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:8px 12px;
  border-radius:8px;
  background:#111;
  color:#fff;
  font-weight:600;
  border:none;
  cursor:pointer;
}

.conv-back-btn {
  margin-top: 12px;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
}

/* small utils */
.conv-row { display:flex; gap:8px; align-items:center; justify-content:space-between; }
.conv-meta { 
  font-size: 13px; 
  opacity: 0.9; 
  line-height: 1.2;
  min-height: calc(1.2em * 3)
}
.footer { 
  font-size: 13px; 
  opacity: 0.9; 
  line-height: 1.2;
}

/* ensure keyboard focus visible */
.conv-drawer-tab:focus, .conv-arrow:focus, .conv-cta-btn:focus {
  outline: 2px solid #7fc6ff;
  outline-offset: 3px;
}
`;

// Inject styles
injectCSS(drawerCSS);
