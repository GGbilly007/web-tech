// ═══════════════════════════════════════════════
//  products.js — Product Data & Render Logic
//  array · filter · search · sort · render
// ═══════════════════════════════════════════════

import { addToCart } from "./cart.js";
import { showToast } from "./utils.js";

// ── Product Data Array ──
export const PRODUCTS = [
  {
    id: 1,
    name: "Modern Sofa",
    category: "Living Room",
    price: 29,
    originalPrice: 59,
    image: "./assets/images/product-img-1.jpg",
    badge: "Sale",
  },
  {
    id: 2,
    name: "Floor Lamp",
    category: "Decor",
    price: 89,
    originalPrice: 95,
    image: "./assets/images/product-img-2.jpg",
    badge: null,
  },
  {
    id: 3,
    name: "High Back Boss Chair",
    category: "Office",
    price: 68,
    originalPrice: 78,
    image: "./assets/images/product-img-5.jpg",
    badge: "Sale",
  },
  {
    id: 4,
    name: "Fancy Metal Clock",
    category: "Decor",
    price: 38,
    originalPrice: 58,
    image: "./assets/images/product-img-6.jpg",
    badge: "Sale",
  },
  {
    id: 5,
    name: "Comfort Chair",
    category: "Living Room",
    price: 28,
    originalPrice: 38,
    image: "./assets/images/product-img-3.jpg",
    badge: null,
  },
  {
    id: 6,
    name: "Modern Metal Frame Stool",
    category: "Office",
    price: 18,
    originalPrice: 28,
    image: "./assets/images/product-img-7.jpg",
    badge: "New",
  },
  {
    id: 7,
    name: "Scandinavian Bed Frame",
    category: "Bedroom",
    price: 245,
    originalPrice: 320,
    image: "./assets/images/product-img-1.jpg",
    badge: "Sale",
  },
  {
    id: 8,
    name: "Minimalist Nightstand",
    category: "Bedroom",
    price: 89,
    originalPrice: 110,
    image: "./assets/images/product-img-2.jpg",
    badge: null,
  },
  {
    id: 9,
    name: "Velvet Accent Chair",
    category: "Living Room",
    price: 149,
    originalPrice: 199,
    image: "./assets/images/product-img-3.jpg",
    badge: "Popular",
  },
];

// ── Filter / Sort State ──
export const filterState = {
  query: "",
  category: "all",
  priceFilters: [], // [{ min, max }]
  sort: "featured",
};

// ── Get filtered & sorted product list ──
export function getFilteredProducts() {
  let list = [...PRODUCTS];

  // 1. Text search
  if (filterState.query.trim()) {
    const q = filterState.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // 2. Category filter
  if (filterState.category !== "all") {
    list = list.filter((p) => p.category === filterState.category);
  }

  // 3. Price range filters (multiple checkboxes → OR logic)
  if (filterState.priceFilters.length > 0) {
    list = list.filter((p) =>
      filterState.priceFilters.some((f) => {
        const aboveMin = f.min == null || p.price >= f.min;
        const belowMax = f.max == null || p.price < f.max;
        return aboveMin && belowMax;
      })
    );
  }

  // 4. Sort
  switch (filterState.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    // "featured" → default order
  }

  return list;
}

// ── Render product grid ──
export function renderProducts() {
  const list = getFilteredProducts();
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");
  const count = document.getElementById("resultCount");
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = "";
    noResults?.classList.remove("d-none");
    if (count) count.textContent = "No products found";
    return;
  }

  noResults?.classList.add("d-none");
  if (count)
    count.textContent = `Showing ${list.length} product${
      list.length !== 1 ? "s" : ""
    }`;

  grid.innerHTML = list
    .map((p) => {
      const discount = Math.round((1 - p.price / p.originalPrice) * 100);
      return `
        <div class="col-sm-6 col-md-4">
          <div class="product-card h-100">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
            <div class="img-wrap">
              <img src="${p.image}" alt="${p.name}" loading="lazy"
                onerror="this.parentElement.style.background='#e8e0d6'">
            </div>
            <div class="card-body">
              <div class="product-category">${p.category}</div>
              <div class="product-name">${p.name}</div>
              <div class="price-row">
                <span class="price-original">$${p.originalPrice.toFixed(2)}</span>
                <span class="price-sale">$${p.price.toFixed(2)}</span>
                <span class="price-discount">−${discount}%</span>
              </div>
              <button class="btn-add-cart" data-product-id="${p.id}">
                <i class="bi bi-bag-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>`;
    })
    .join("");

  // Bind "Add to Cart" buttons
  grid.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.productId;
      addToCart(id, 1);
      showToast("Added to cart ✓");
      btn.classList.add("added");
      btn.innerHTML = '<i class="bi bi-check2"></i> Added!';
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = '<i class="bi bi-bag-plus"></i> Add to Cart';
      }, 1400);
    });
  });
}

// ── Render featured product grid (index.html) ──
export const FEATURED_IDS = [1, 2, 3, 5, 6, 9];

export function renderFeatured(containerId = "featuredGrid") {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const featured = PRODUCTS.filter((p) => FEATURED_IDS.includes(p.id));

  grid.innerHTML = featured
    .map((p) => {
      return `
        <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card-home h-100">
            <div class="img-wrap">
              <img src="${p.image}" alt="${p.name}" loading="lazy"
                onerror="this.parentElement.style.background='var(--cream)'">
            </div>
            <div class="card-body">
              <div class="product-name">${p.name}</div>
              <div class="price-row mb-2">
                <span class="price-original">$${p.originalPrice.toFixed(2)}</span>
                <span class="price-sale">$${p.price.toFixed(2)}</span>
              </div>
              <button class="btn-add-cart" data-product-id="${p.id}">
                <i class="bi bi-bag-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>`;
    })
    .join("");

  // Bind buttons
  grid.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.productId;
      addToCart(id, 1);
      showToast("Added to cart ✓");
      btn.classList.add("added");
      btn.innerHTML = '<i class="bi bi-check2"></i> Added!';
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = '<i class="bi bi-bag-plus"></i> Add to Cart';
      }, 1400);
    });
  });
}
