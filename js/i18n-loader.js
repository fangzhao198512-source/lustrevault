/* ===== 语言数据加载器 v4 ===== */
(async function() {
  try {
    var ts = Date.now();
    var [zhRaw, enRaw, jaRaw] = await Promise.all([
      fetch("../lang/zh.json?_t=" + ts).then(function(r) { if (!r.ok) throw new Error("zh " + r.status); return r.text(); }),
      fetch("../lang/en.json?_t=" + ts).then(function(r) { if (!r.ok) throw new Error("en " + r.status); return r.text(); }),
      fetch("../lang/ja.json?_t=" + ts).then(function(r) { if (!r.ok) throw new Error("ja " + r.status); return r.text(); })
    ]);

    function cleanParse(text) {
      return JSON.parse(text.replace(/^\uFEFF/, "").trim());
    }

    var data = {
      zh: cleanParse(zhRaw),
      en: cleanParse(enRaw),
      ja: cleanParse(jaRaw)
    };

    console.log("Translations loaded:", Object.keys(data).join(", "));

    // 如果有队列中的语言切换，应用它
    if (window.__i18n && window.__i18n.lang) {
      var queuedLang = window.__i18n.lang;
      window.__i18n.init(data);
      // 如果队列语言不是默认，再切一次
      if (queuedLang !== "zh") {
        window.__i18n.setLang(queuedLang);
      }
    } else {
      window.__i18n.init(data);
    }
  } catch (e) {
    console.error("i18n loader error:", e.message);
    window.__i18n.init({});
  }
})();