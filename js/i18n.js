/* ===== 多语言系统 v5 ===== */
(function() {
  var langData = {};
  var currentLang = localStorage.getItem("lustrevault_lang") || "zh";
  window.__i18n = {
    init: function(data) { langData = data; this.apply(); if (typeof renderProducts === "function") renderProducts(); var s = document.querySelectorAll(".lang-select"); for (var i = 0; i < s.length; i++) s[i].value = currentLang; },
    t: function(key, vars) {
      if (!key) return key;
      var val = this._get(langData[currentLang], key);
      if (val == null) val = this._get(langData["zh"], key);
      if (typeof val === "string") return val.replace(/\{(\w+)\}/g, function(_, k) { return vars && vars[k] != null ? vars[k] : "{" + k + "}"; });
      return val != null ? val : key;
    },
    _get: function(obj, key) { if (!obj) return null; var keys = key.split("."); for (var i = 0; i < keys.length; i++) { obj = obj[keys[i]]; if (obj == null) return null; } return obj; },
    setLang: function(lang) { if (!langData[lang]) { currentLang = lang; localStorage.setItem("lustrevault_lang", lang); return; } currentLang = lang; localStorage.setItem("lustrevault_lang", lang); this.apply(); if (typeof renderProducts === "function") renderProducts(); var s = document.querySelectorAll(".lang-select"); for (var i = 0; i < s.length; i++) s[i].value = lang; document.documentElement.lang = lang === "zh" ? "zh-CN" : lang; },
    apply: function() {
      function upd(attr, prop) { var els = document.querySelectorAll("[" + attr + "]"); for (var i = 0; i < els.length; i++) { var key = els[i].getAttribute(attr); if (key) { var t = window.__i18n.t(key); if (t && t !== key) els[i][prop] = t; } } }
      upd("data-i18n", "textContent");
      upd("data-i18n-placeholder", "placeholder");
      upd("data-i18n-value", "value");
    }
  };
})();