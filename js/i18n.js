/* ===== 多语言系统 v4 ===== */
(function() {
  const DEFAULT_LANG = "zh";
  const STORAGE_KEY = "lustrevault_lang";

  // 直接在当前作用域保存数据，不依赖全局变量
  var langData = {};
  var currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  window.__i18n = {
    _data: langData,
    lang: currentLang,

    init: function(data) {
      langData = data || {};
      this._data = langData;
      this.lang = currentLang;
      
      // 立即应用翻译
      this._applyAll();
      
      // 渲染产品
      if (typeof renderProducts === "function") renderProducts();
      
      // 更新选择器
      var sels = document.querySelectorAll(".lang-select");
      for (var i = 0; i < sels.length; i++) sels[i].value = this.lang;
      
      console.log("i18n inited:", this.lang);
    },

    t: function(key, vars) {
      if (!key) return key;
      // 先在当前语言找
      var val = this._getNested(langData[currentLang], key.split("."));
      // 没有就回退中文
      if (val === undefined || val === null) {
        val = this._getNested(langData[DEFAULT_LANG], key.split("."));
      }
      if (typeof val === "string") {
        return val.replace(/\{(\w+)\}/g, function(_, k) {
          return vars && vars[k] !== undefined ? vars[k] : "{" + k + "}";
        });
      }
      return val !== undefined && val !== null ? val : key;
    },

    _getNested: function(obj, keys) {
      if (!obj) return undefined;
      for (var i = 0; i < keys.length; i++) {
        obj = obj[keys[i]];
        if (obj === undefined || obj === null) return undefined;
      }
      return obj;
    },

    setLang: function(lang) {
      // 如果数据还没加载好，先存起来等 init 时再切换
      if (!langData[lang]) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        console.log("lang queued:", lang, "(data not ready)");
        return;
      }
      
      this.lang = lang;
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      
      this._applyAll();
      
      document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
      
      // 触发事件
      try {
        var evt = new CustomEvent("langchange", { detail: { lang: lang } });
        document.dispatchEvent(evt);
      } catch(e) {}
    },

    _applyAll: function() {
      var self = this;
      // 更新 data-i18n
      var els = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n");
        var t = self.t(key);
        if (t && t !== key) els[i].textContent = t;
      }
      // 更新 placeholder
      els = document.querySelectorAll("[data-i18n-placeholder]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n-placeholder");
        if (key) els[i].placeholder = self.t(key);
      }
      // 更新 value
      els = document.querySelectorAll("[data-i18n-value]");
      for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute("data-i18n-value");
        if (key) els[i].value = self.t(key);
      }
      // 更新选择器
      var sels = document.querySelectorAll(".lang-select");
      for (var i = 0; i < sels.length; i++) sels[i].value = this.lang;
    }
  };
})();