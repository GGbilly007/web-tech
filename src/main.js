// ═══════════════════════════════════════════════
//  main.js — Entry Point
//  Initialise page, bind all events
// ═══════════════════════════════════════════════

import { updateCartUI } from "./cart.js";
import {
  filterState,
  renderProducts,
  renderFeatured,
} from "./products.js";

// ── Detect which page we're on ──
const page = (() => {
  const path = location.pathname;
  if (path.includes("products")) return "products";
  if (path.includes("about"))    return "about";
  if (path.includes("contact"))  return "contact";
  return "home";
})();

// ── Init on DOM ready ──
document.addEventListener("DOMContentLoaded", () => {
  // Always: sync cart badge + drawer
  updateCartUI();

  if (page === "products") initProductsPage();
  if (page === "home")     initHomePage();
});

// ═══════════════════════════════════════════════
//  PRODUCTS PAGE
// ═══════════════════════════════════════════════
function initProductsPage() {
  // Read ?q= from URL (coming from home search)
  const urlQuery = new URLSearchParams(location.search).get("q") || "";
  if (urlQuery) {
    filterState.query = urlQuery;
    const navSearch = document.getElementById("navSearch");
    const mobSearch = document.getElementById("mobileSearch");
    if (navSearch) navSearch.value = urlQuery;
    if (mobSearch) mobSearch.value = urlQuery;
  }

  // Initial render
  renderProducts();

  // ── Search inputs (desktop + mobile, kept in sync) ──
  ["navSearch", "mobileSearch"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", (e) => {
      filterState.query = e.target.value;
      // Sync the other input
      ["navSearch", "mobileSearch"].forEach((otherId) => {
        const other = document.getElementById(otherId);
        if (other && other !== el) other.value = e.target.value;
      });
      renderProducts();
    });
  });

  // ── Category sidebar links ──
  document.querySelectorAll("[data-cat]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll("[data-cat]")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      filterState.category = link.dataset.cat;
      renderProducts();
    });
  });

  // ── Price range checkboxes ──
  document.querySelectorAll("[data-max], [data-min]").forEach((cb) => {
    cb.addEventListener("change", () => {
      filterState.priceFilters = [];
      document
        .querySelectorAll("[data-max], [data-min]")
        .forEach((c) => {
          if (c.checked) {
            filterState.priceFilters.push({
              min: c.dataset.min != null ? +c.dataset.min : null,
              max: c.dataset.max != null ? +c.dataset.max : null,
            });
          }
        });
      renderProducts();
    });
  });

  // ── Clear all filters ──
  document.getElementById("clearFilters")?.addEventListener("click", () => {
    filterState.query    = "";
    filterState.category = "all";
    filterState.priceFilters = [];

    document
      .querySelectorAll("[data-cat]")
      .forEach((l) => l.classList.remove("active"));
    document.querySelector("[data-cat='all']")?.classList.add("active");
    document
      .querySelectorAll("[data-max],[data-min]")
      .forEach((c) => (c.checked = false));
    document.getElementById("navSearch") &&
      (document.getElementById("navSearch").value = "");
    document.getElementById("mobileSearch") &&
      (document.getElementById("mobileSearch").value = "");

    renderProducts();
  });

  // ── Sort select ──
  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    filterState.sort = e.target.value;
    renderProducts();
  });
}

// ═══════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════
function initHomePage() {
  renderFeatured("featuredGrid");

  // Hero search → redirect to products page with query
  document.getElementById("heroSearch")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      window.location.href = `products.html?q=${encodeURIComponent(
        e.target.value.trim()
      )}`;
    }
  });
}
import { renderCartDrawer, updateCartBadge } from "./cart.js";

document.addEventListener("DOMContentLoaded", () => {
  renderCartDrawer();
  updateCartBadge();
});