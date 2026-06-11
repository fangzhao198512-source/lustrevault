/* ===== 语言数据加载器 v5 ===== */
(async function() {
  try {
    var ts = Date.now();
    function fetchLang(name) {
      return fetch("../lang/" + name + ".json?_t=" + ts).then(function(r) {
        if (!r.ok) throw new Error(name + " " + r.status);
        return r.text();
      });
    }

    var results = await Promise.all([fetchLang("zh"), fetchLang("en"), fetchLang("ja")]);

    function clean(text) {
      return JSON.parse(text.replace(/^\uFEFF/, "").trim());
    }

    var data = {
      zh: clean(results[0]),
      en: clean(results[1]),
      ja: clean(results[2])
    };

    console.log("Translations loaded:", data.zh.nav.home, "|", data.en.nav.home, "|", data.ja.nav.home);

    window.__i18n.init(data);
  } catch (e) {
    console.error("i18n error:", e.message);
  }
})();