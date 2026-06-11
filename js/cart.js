/* ===== 购物车系统 ===== */
let cart = JSON.parse(localStorage.getItem("lustrevault_cart")) || [];

function saveCart() {
  localStorage.setItem("lustrevault_cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = count;

  const itemsEl = document.getElementById("cartItems");
  const footerEl = document.getElementById("cartFooter");
  if (!itemsEl) return;

  const i18n = window.__i18n;
  const t = (key) => i18n?.t(key) ?? key;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <p>${t("cart.empty")}</p>
      <p style="font-size:0.85rem;margin-top:5px;">${t("cart.emptyHint")}</p>
    </div>`;
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (footerEl) footerEl.style.display = "block";

  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-image">${item.icon || "📦"}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">¥${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">${t("cart.remove")}</button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalEl = document.getElementById("cartTotalPrice");
  if (totalEl) totalEl.textContent = `¥${total.toFixed(2)}`;

  // 更新 data-i18n for cart title
  const cartTitle = document.querySelector(".cart-header h3");
  if (cartTitle) {
    cartTitle.setAttribute("data-i18n", "cart.title");
    cartTitle.textContent = t("cart.title");
  }
}

function changeQty(idx, delta) {
  if (idx < 0 || idx >= cart.length) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
}

function removeFromCart(idx) {
  if (idx < 0 || idx >= cart.length) return;
  cart.splice(idx, 1);
  saveCart();
}

function addToCart(id, name, price, icon) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: Number(price), qty: 1, icon: icon || "📦" });
  }
  saveCart();
  const i18n = window.__i18n;
  const msg = i18n ? i18n.t("cart.added", { name }) : `✅ 已加入购物车：${name}`;
  showToast(msg);
}

function toggleCart() {
  const overlay = document.getElementById("cartOverlay");
  const sidebar = document.getElementById("cartSidebar");
  if (!overlay || !sidebar) return;
  const isActive = overlay.classList.contains("active");
  overlay.classList.toggle("active", !isActive);
  sidebar.classList.toggle("active", !isActive);
  document.body.style.overflow = isActive ? "" : "hidden";
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// 监听语言切换，更新购物车
document.addEventListener("langchange", updateCartUI);

// 初始化
updateCartUI();
