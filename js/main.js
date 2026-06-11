/* ===== 产品数据 ===== */
// 产品核心数据（价格、图标等不依赖语言的属性）
const productBase = [
  { id: 1, price: 268, originalPrice: 328, icon: "🔮", badgeType: "sale", rating: 4.8, reviews: 326 },
  { id: 2, price: 189, originalPrice: 239, icon: "🌊", badgeType: "new", rating: 4.7, reviews: 218 },
  { id: 3, price: 356, originalPrice: 456, icon: "💞", badgeType: "sale", rating: 4.9, reviews: 521 },
  { id: 4, price: 128, originalPrice: 0, icon: "⛓️", badgeType: "new", rating: 4.5, reviews: 134 },
  { id: 5, price: 49, originalPrice: 69, icon: "💧", badgeType: "sale", rating: 4.6, reviews: 892 },
  { id: 6, price: 298, originalPrice: 378, icon: "🔮", badgeType: "sale", rating: 4.8, reviews: 409 },
  { id: 7, price: 239, originalPrice: 299, icon: "🌊", badgeType: "sale", rating: 4.6, reviews: 187 },
  { id: 8, price: 89, originalPrice: 119, icon: "🪶", badgeType: "new", rating: 4.4, reviews: 95 }
];

/* ===== 渲染产品 ===== */
function renderProducts(filter) {
  const grid = document.getElementById("productGrid");
  const subtitle = document.getElementById("productSubtitle");
  if (!grid) return;

  const i18n = window.__i18n;
  const lang = i18n?.lang || "zh";
  const t = (key, vars) => i18n?.t(key, vars) ?? key;

  // 获取当前语言的翻译产品数据
  const transData = i18n?._data?.[lang]?.products?.data || i18n?._data?.zh?.products?.data || [];

  let merged = productBase.map((base, idx) => {
    const trans = transData[idx] || {};
    return {
      ...base,
      name: trans.name || base.name,
      category: trans.category || transData.find(t => t.id === base.id)?.category || "",
      desc: trans.desc || "",
      specs: trans.specs || [],
      badge: trans.badge || ""
    };
  });

  let filtered = merged;
  if (filter) {
    filtered = merged.filter(p => p.category === filter);
    const catKey = `categories.${filter}.name`;
    const catName = t(catKey);
    if (subtitle) subtitle.textContent = catName;
    subtitle?.setAttribute("data-i18n", catKey);
  } else {
    if (subtitle) {
      subtitle.textContent = t("products.subtitle");
      subtitle.setAttribute("data-i18n", "products.subtitle");
    }
  }

  grid.innerHTML = filtered.map(p => {
    const badgeHtml = p.badge ? `<span class="product-badge ${p.badgeType}">${p.badge}</span>` : "";
    const originalHtml = p.originalPrice ? `<span class="price-original">${t("products.originalPrice")} ¥${p.originalPrice}</span>` : "";
    const stars = "★".repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? "½" : "");

    return `
      <div class="product-card" onclick="viewProduct(${p.id})">
        ${badgeHtml}
        <div class="product-image">${p.icon}</div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">${stars} ${p.rating} (${p.reviews} ${t("products.rating")})</div>
          <div class="product-price">
            <span class="price-current">¥${p.price}</span>
            ${originalHtml}
          </div>
        </div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.icon}')">${t("products.addToCart")}</button>
      </div>
    `;
  }).join("");

  // 重新应用 data-i18n
  i18n?.apply();
}

function filterProducts(category) {
  renderProducts(category);
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

function viewProduct(id) {
  const base = productBase.find(pr => pr.id === id);
  if (!base) return;

  const i18n = window.__i18n;
  const lang = i18n?.lang || "zh";
  const transData = i18n?._data?.[lang]?.products?.data || i18n?._data?.zh?.products?.data || [];
  const trans = transData.find(t => t.id === id) || {};

  const product = {
    ...base,
    name: trans.name || "",
    category: trans.category || "",
    desc: trans.desc || "",
    specs: trans.specs || [],
    badge: trans.badge || ""
  };

  sessionStorage.setItem("view_product", JSON.stringify(product));
  window.location.href = "pages/product.html";
}

// 监听语言切换，重新渲染产品
document.addEventListener("langchange", function() {
  renderProducts();
});

// 初始化
renderProducts();
