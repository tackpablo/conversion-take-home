// =====================================
// FOOTER ACTION DRAWER WITH SLIDER - PokéAPI EXAMPLE
// =====================================

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
