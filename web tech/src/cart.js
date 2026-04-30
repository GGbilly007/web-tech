// ═══════════════════════════════════════════════
//  cart.js — Cart System (LocalStorage)
//  load · save · add · update qty · remove
// ═══════════════════════════════════════════════

import { PRODUCTS } from "./products.js";

const CART_KEY = "furnish_cart";

// ── Load cart from localStorage ──
export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// ── Save cart to localStorage ──
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── Add product to cart ──
// ถ้ามี id อยู่แล้ว → เพิ่ม qty | ถ้าไม่มี → สร้าง entry ใหม่
export function addToCart(productId, qty = 1) {
  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += qty; // product already exists → increment
  } else {
    cart.push({ id: productId, qty }); // new product → create entry
  }

  saveCart(cart);
  updateCartUI();
}

// ── Update qty of existing item ──
export function updateCartQty(productId, delta) {
  const cart = loadCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}

// ── Remove item from cart ──
export function removeFromCart(productId) {
  const cart = loadCart().filter((i) => i.id !== productId);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}

// ── Update badge + drawer together ──
export function updateCartUI() {
  updateCartBadge();
  renderCartDrawer();
}

// ── Update cart badge count ──
export function updateCartBadge() {
  const cart = loadCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  badge.textContent = total;
  badge.classList.remove("bump");
  void badge.offsetWidth; // force reflow for animation restart
  badge.classList.add("bump");
}

// ── Render cart drawer contents ──
export function renderCartDrawer() {
  const cart = loadCart();
  const el = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
  if (!el || !footer) return;

  if (cart.length === 0) {
    el.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-bag-x"></i>
        <p class="mb-0">Your cart is empty.</p>
        <a href="products.html" class="mt-3 d-inline-block empty-cart-link" data-bs-dismiss="offcanvas">
          Continue Shopping
        </a>
      </div>`;
    footer.innerHTML = "";
    return;
  }

  let html = "";
  let grandTotal = 0;

  cart.forEach((item) => {
    const p = PRODUCTS.find((p) => p.id === item.id);
    if (!p) return;
    const lineTotal = p.price * item.qty;
    grandTotal += lineTotal;

    html += `
      <div class="cart-item">
        <img src="${p.image}" class="cart-item-img" alt="${p.name}"
          onerror="this.style.background='#e8e0d6'">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price.toFixed(2)} each</div>
          <div class="qty-control">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
          </div>
        </div>
        <div class="cart-item-side">
          <span class="cart-item-line-total">$${lineTotal.toFixed(2)}</span>
          <button class="cart-item-remove" data-remove="${p.id}" title="Remove">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>`;
  });

  el.innerHTML = html;
  footer.innerHTML = `
    <div class="cart-total-bar">
      <div class="cart-total-row">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-value">$${grandTotal.toFixed(2)}</span>
      </div>
      <button class="btn-checkout">Proceed to Checkout →</button>
    </div>`;

  // Bind qty and remove buttons (event delegation)
  el.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateCartQty(id, delta);
    });
  });

  el.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(+btn.dataset.remove));
  });
}
