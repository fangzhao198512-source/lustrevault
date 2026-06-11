/* ===== 多语言系统 v3 — 完全重写 ===== */
(function() {
  const DEFAULT_LANG = "zh";
  const STORAGE_KEY = "lustrevault_lang";

  const i18n = {
    lang: localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG,
    _data: {},

    init(langData) {
      this._data = langData || {};
      // 先更新一次所有静态元素
      this.apply();
      // 然后渲染产品
      if (typeof renderProducts === "function") {
        renderProducts();
      }
      // 更新语言选择器
      document.querySelectorAll(".lang-select").forEach(sel => {
        sel.value = this.lang;
      });
    },

    t(key, vars) {
      if (!key) return key;
      // 先从当前语言取
      let val = this._data[this.lang];
      const keys = key.split(".");
      for (const k of keys) {
        if (!val) break;
        val = val[k];
      }
      // 没有就回退到中文
      if (val === undefined || val === null) {
        val = this._data[DEFAULT_LANG];
        for (const k of keys) {
          if (!val) break;
          val = val[k];
        }
      }
      if (typeof val === "string") {
        return val.replace(/\{(\w+)\}/g, (_, k) => vars?.[k] ?? ("{" + k + "}"));
      }
      return val ?? key;
    },

    setLang(lang) {
      if (!this._data[lang]) return;
      this.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      
      // 更新所有 data-i18n 元素
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.textContent = translated;
        }
      });
      
      // 更新 data-i18n-placeholder
      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (key) el.placeholder = this.t(key);
      });
      
      // 更新 data-i18n-value
      document.querySelectorAll("[data-i18n-value]").forEach(el => {
        const key = el.getAttribute("data-i18n-value");
        if (key) el.value = this.t(key);
      });
      
      // 更新语言选择器
      document.querySelectorAll(".lang-select").forEach(sel => {
        sel.value = this.lang;
      });
      
      document.documentElement.lang = this.lang === "zh" ? "zh-CN" : this.lang;

      // 触发事件让其他组件重新渲染
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
    },

    apply() {
      this.setLang(this.lang);
    }
  };

  window.__i18n = i18n;
})();