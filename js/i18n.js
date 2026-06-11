/* ===== 多语言系统 v2 — 内联加载，无需额外请求 ===== */
(function() {
  const DEFAULT_LANG = "zh";
  const STORAGE_KEY = "lustrevault_lang";

  // 语言文件已在 HTML 中通过 script 标签预加载
  window.__i18n = window.__i18n || {};

  const i18n = {
    lang: localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG,
    _data: {},

    init(langData) {
      this._data = langData;
      this.apply();
    },

    t(key, vars) {
      let val = this._data[this.lang];
      const keys = key.split(".");
      for (const k of keys) {
        val = val?.[k];
      }
      if (val === undefined) {
        val = this._data[DEFAULT_LANG];
        for (const k of keys) {
          val = val?.[k];
        }
      }
      if (typeof val === "string") {
        return val.replace(/\{(\w+)\}/g, (_, k) => vars?.[k] ?? `{${k}}`);
      }
      return val ?? key;
    },

    setLang(lang) {
      if (!this._data[lang]) return;
      this.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      this.apply();
      // 触发表单、产品等动态内容的重新渲染
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
    },

    apply() {
      document.documentElement.lang = this.lang === "zh" ? "zh-CN" : this.lang;
      // 更新所有 data-i18n 元素
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const translated = this.t(key);
        if (translated !== undefined && translated !== key) {
          el.textContent = translated;
        }
      });
      // 更新 data-i18n-placeholder
      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = this.t(key);
      });
      // 更新 data-i18n-value
      document.querySelectorAll("[data-i18n-value]").forEach(el => {
        const key = el.getAttribute("data-i18n-value");
        el.value = this.t(key);
      });
      // 更新语言切换器选中状态
      document.querySelectorAll(".lang-switcher select, .lang-select").forEach(sel => {
        sel.value = this.lang;
      });
    }
  };

  window.__i18n = i18n;
})();
