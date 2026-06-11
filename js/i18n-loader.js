(async function() {
  try {
    const [zh, en, ja] = await Promise.all([
      fetch("../lang/zh.json").then(r => r.text()),
      fetch("../lang/en.json").then(r => r.text()),
      fetch("../lang/ja.json").then(r => r.text())
    ]);
    // 去除可能的 BOM 字符并解析 JSON
    const cleanJson = (s) => JSON.parse(s.replace(/^\uFEFF/, "").trim());
    window.__i18n.init({
      zh: cleanJson(zh),
      en: cleanJson(en),
      ja: cleanJson(ja)
    });
  } catch (e) {
    console.warn("i18n load warning:", e.message);
  }
})();