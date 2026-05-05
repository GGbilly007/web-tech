// cart.js
import { PRODUCTS } from "./products.js";

const CART_KEY = "furnish_cart";

// ── check login ──
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// ── Load cart ──
export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// ── Save cart ──
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── Add to cart (🔥 มี redirect login)
export function addToCart(productId, qty = 1) {
  // ❌ ยังไม่ login
  if (!isLoggedIn()) {
    alert("Please login first");

    // จำสินค้าที่กด
    localStorage.setItem("pendingProduct", productId);

    // redirect
    window.location.href = "/login.html";
    return;
  }

  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);
  updateCartUI();
}

// ── Update qty ──
export function updateCartQty(productId, delta) {
  const cart = loadCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}

// ── Remove ──
export function removeFromCart(productId) {
  const cart = loadCart().filter((i) => i.id !== productId);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}

// ── UI ──
export function updateCartUI() {
  updateCartBadge();
  renderCartDrawer();
}

// ── Badge ──
export function updateCartBadge() {
  const cart = loadCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);

  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  badge.textContent = total;
}

// ── Drawer ──
export function renderCartDrawer() {
  const cart = loadCart();
  const el = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
  if (!el || !footer) return;

  if (cart.length === 0) {
    el.innerHTML = `<p>Your cart is empty</p>`;
    footer.innerHTML = "";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const p = PRODUCTS.find((p) => p.id == item.id);
    if (!p) return;

    const lineTotal = p.price * item.qty;
    total += lineTotal;

    html += `
      <div class="cart-item" style="display:flex;gap:10px;align-items:center;margin-bottom:10px;">
        
        <img src="${p.image}" 
          style="width:60px;height:60px;object-fit:cover;">

        <div style="flex:1">
          <p style="margin:0">${p.name}</p>
          <p style="margin:0">$${p.price}</p>

          <!-- ✅ ปุ่ม + - -->
          <div style="display:flex;gap:5px;margin-top:5px;">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
          </div>
        </div>

        <div>
          <p>$${lineTotal.toFixed(2)}</p>
          <button class="remove-btn" data-id="${p.id}" title="Remove item">
  <i class="bi bi-trash3"></i>
</button>
        </div>

      </div>
    `;
  });

  el.innerHTML = html;

  footer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;

  // ✅ bind + -
  el.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateCartQty(id, delta);
    });
  });

  // ✅ bind remove
  el.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      removeFromCart(id);
    });
  });
}