(async function() {
  try {
    var ts = Date.now();
    var [zh, en, ja] = await Promise.all([
      fetch("../lang/zh.json?_t=" + ts).then(r => { if (!r.ok) throw Error("zh"); return r.text(); }),
      fetch("../lang/en.json?_t=" + ts).then(r => { if (!r.ok) throw Error("en"); return r.text(); }),
      fetch("../lang/ja.json?_t=" + ts).then(r => { if (!r.ok) throw Error("ja"); return r.text(); })
    ]);
    function clean(t) { return JSON.parse(t.replace(/^\uFEFF/, "").trim()); }
    window.__i18n.init({ zh: clean(zh), en: clean(en), ja: clean(ja) });
  } catch (e) { console.error("i18n:", e.message); }
})();