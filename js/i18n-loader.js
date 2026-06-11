/* ===== 语言数据加载器 v3 ===== */
(async function initI18n() {
  try {
    // 加时间戳避免缓存
    const ts = Date.now();
    const [zhRaw, enRaw, jaRaw] = await Promise.all([
      fetch("../lang/zh.json?_t=" + ts).then(r => { if (!r.ok) throw new Error("zh " + r.status); return r.text(); }),
      fetch("../lang/en.json?_t=" + ts).then(r => { if (!r.ok) throw new Error("en " + r.status); return r.text(); }),
      fetch("../lang/ja.json?_t=" + ts).then(r => { if (!r.ok) throw new Error("ja " + r.status); return r.text(); })
    ]);

    const parse = (text) => {
      // 去 BOM 和前后空白
      const clean = text.replace(/^\uFEFF/, "").trim();
      return JSON.parse(clean);
    };

    const translations = {
      zh: parse(zhRaw),
      en: parse(enRaw),
      ja: parse(jaRaw)
    };

    console.log("i18n loaded: en nav.home =", translations.en.nav.home);
    console.log("i18n loaded: en products =", translations.en.products.data.length);

    window.__i18n.init(translations);
  } catch (e) {
    console.error("i18n FAILED:", e.message);
    // 用空数据初始化，至少让页面显示
    window.__i18n.init({});
  }
})();