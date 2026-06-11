/* ===== 多语言系统 v5 + 产品渲染 ===== */
(function() {
  var DEFAULT_LANG = "zh";
  var STORAGE_KEY = "lustrevault_lang";
  var langData = {};
  var currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  var currentFilter = null;

  // 产品核心数据（价格、图标等）
  var productBase = [
    { id: 1, price: 268, originalPrice: 328, icon: "🔮", badgeType: "sale", rating: 4.8, reviews: 326 },
    { id: 2, price: 189, originalPrice: 239, icon: "🌊", badgeType: "new", rating: 4.7, reviews: 218 },
    { id: 3, price: 356, originalPrice: 456, icon: "💞", badgeType: "sale", rating: 4.9, reviews: 521 },
    { id: 4, price: 128, originalPrice: 0, icon: "⛓️", badgeType: "new", rating: 4.5, reviews: 134 },
    { id: 5, price: 49, originalPrice: 69, icon: "💧", badgeType: "sale", rating: 4.6, reviews: 892 },
    { id: 6, price: 298, originalPrice: 378, icon: "🔮", badgeType: "sale", rating: 4.8, reviews: 409 },
    { id: 7, price: 239, originalPrice: 299, icon: "🌊", badgeType: "sale", rating: 4.6, reviews: 187 },
    { id: 8, price: 89, originalPrice: 119, icon: "🪶", badgeType: "new", rating: 4.4, reviews: 134 }
  ];

  var i18n = {
    init: function(data) {
      langData = data || {};
      this._data = langData;
      this.lang = currentLang;
      this._applyAll();
      this._renderProducts();
      this._updateSelectors();
    },

    t: function(key, vars) {
      if (!key) return key;
      var val = this._get(langData[currentLang], key);
      if (val === undefined || val === null) {
        val = this._get(langData[DEFAULT_LANG], key);
      }
      if (typeof val === "string") {
        return val.replace(/\{(\w+)\}/g, function(_, k) {
          return vars && vars[k] !== undefined ? vars[k] : "{" + k + "}";
        });
      }
      return val !== undefined && val !== null ? val : key;
    },

    _get: function(obj, key) {
      if (!obj) return undefined;
      var keys = key.split(".");
      for (var i = 0; i < keys.length; i++) {
        obj = obj[keys[i]];
        if (obj === undefined || obj === null) return undefined;
      }
      return obj;
    },

    setLang: function(lang) {
      if (!langData[lang]) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        return;
      }
      this.lang = lang;
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      this._applyAll();
      this._renderProducts();
      this._updateSelectors();
      document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
      try { document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } })); } catch(e) {}
    },

    _applyAll: function() {
      // data-i18n 元素
      var els = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n");
        var t = this.t(key);
        if (t && t !== key) els[i].textContent = t;
      }
      // placeholder
      els = document.querySelectorAll("[data-i18n-placeholder]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n-placeholder");
        if (key) els[i].placeholder = this.t(key);
      }
      // value
      els = document.querySelectorAll("[data-i18n-value]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n-value");
        if (key) els[i].value = this.t(key);
      }
    },

    _updateSelectors: function() {
      var sels = document.querySelectorAll(".lang-select");
      for (var i = 0; i < sels.length; i++) sels[i].value = this.lang;
    },

    _getTransData: function() {
      return langData[currentLang]?.products?.data || langData[DEFAULT_LANG]?.products?.data || [];
    },

    _renderProducts: function() {
      var grid = document.getElementById("productGrid");
      var subtitle = document.getElementById("productSubtitle");
      if (!grid) return;

      var transData = this._getTransData();
      var self = this;

      // 合并基础数据和翻译
      var merged = productBase.map(function(base, idx) {
        var trans = transData[idx] || {};
        return {
          id: base.id,
          name: trans.name || "",
          category: trans.category || "",
          price: base.price,
          originalPrice: base.originalPrice,
          icon: base.icon,
          badgeType: base.badgeType,
          rating: base.rating,
          reviews: base.reviews,
          desc: trans.desc || "",
          specs: trans.specs || [],
          badge: trans.badge || ""
        };
      });

      var filtered = merged;
      if (currentFilter) {
        filtered = merged.filter(function(p) { return p.category === currentFilter; });
        var catName = self.t("categories." + currentFilter + ".name");
        if (subtitle) subtitle.textContent = catName;
      } else {
        if (subtitle) subtitle.textContent = self.t("products.subtitle");
      }

      grid.innerHTML = filtered.map(function(p) {
        var badgeHtml = p.badge ? '<span class="product-badge ' + p.badgeType + '">' + p.badge + "</span>" : "";
        var origHtml = p.originalPrice ? '<span class="price-original">' + self.t("products.originalPrice") + " ¥" + p.originalPrice + "</span>" : "";
        var stars = Array(Math.floor(p.rating) + 1).join("★");
        if (p.rating % 1 >= 0.5) stars += "½";

        return '<div class="product-card" onclick="viewProduct(' + p.id + ')">'
          + badgeHtml
          + '<div class="product-image">' + p.icon + "</div>"
          + '<div class="product-info">'
          + '<div class="product-category">' + p.category + "</div>"
          + '<div class="product-name">' + p.name + "</div>"
          + '<div class="product-rating">' + stars + " " + p.rating + " (" + p.reviews + " " + self.t("products.rating") + ")</div>"
          + '<div class="product-price"><span class="price-current">¥' + p.price + "</span>" + origHtml + "</div>"
          + "</div>"
          + '<button class="add-to-cart" onclick="event.stopPropagation(); addToCart(' + p.id + ",'" + p.name.replace(/'/g,"\\'") + "'," + p.price + ",'" + p.icon + "')\">" + self.t("products.addToCart") + "</button>"
          + "</div>";
      }).join("");
    }
  };

  // 暴露到全局
  window.__i18n = i18n;

  // 保留原函数兼容
  window.renderProducts = function(filter) {
    if (filter !== undefined) currentFilter = filter;
    i18n._renderProducts();
  };
  window.filterProducts = function(category) {
    currentFilter = category;
    if (window.__i18n._data && Object.keys(window.__i18n._data).length > 0) {
      i18n._renderProducts();
    }
    var el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  window.viewProduct = function(id) {
    var base = productBase.find(function(p) { return p.id === id; });
    if (!base) return;
    var transData = i18n._getTransData();
    var trans = transData.find(function(t) { return t.id === id; }) || {};
    var product = {
      id: base.id, price: base.price, originalPrice: base.originalPrice,
      icon: base.icon, badgeType: base.badgeType, rating: base.rating, reviews: base.reviews,
      name: trans.name || "", category: trans.category || "",
      desc: trans.desc || "", specs: trans.specs || [], badge: trans.badge || ""
    };
    sessionStorage.setItem("view_product", JSON.stringify(product));
    window.location.href = "pages/product.html";
  };
})();