// ═══════════════════════════════════════════════
//  utils.js — Shared Utilities
// ═══════════════════════════════════════════════

// ── Toast Notification ──
let toastTimer = null;

export function showToast(msg = "Done ✓") {
  const toast = document.getElementById("toastMsg");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
