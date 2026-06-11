/* ===== 多语言系统 v2 ===== */
(function() {
  const DEFAULT_LANG = "zh";
  const STORAGE_KEY = "lustrevault_lang";

  const i18n = {
    lang: localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG,
    _data: {},

    init(langData) {
      this._data = langData || {};
      this.apply();
    },

    t(key, vars) {
      if (!key) return "";
      let val = this._data[this.lang];
      const keys = key.split(".");
      for (const k of keys) {
        if (!val) break;
        val = val[k];
      }
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
      this.apply();
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
    },

    apply() {
      document.documentElement.lang = this.lang === "zh" ? "zh-CN" : this.lang;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.textContent = translated;
        }
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = this.t(key);
      });
      document.querySelectorAll("[data-i18n-value]").forEach(el => {
        const key = el.getAttribute("data-i18n-value");
        el.value = this.t(key);
      });
      document.querySelectorAll(".lang-select").forEach(sel => {
        sel.value = this.lang;
      });
    }
  };

  window.__i18n = i18n;
})();