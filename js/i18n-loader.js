/* ===== 语言数据加载器 v2 ===== */
(async function initI18n() {
  try {
    // 清理 BOM 后解析 JSON
    const clean = (text) => {
      // 移除 BOM 和不可见字符
      return text.replace(/^\uFEFF/, "").trim();
    };

    const [zhRaw, enRaw, jaRaw] = await Promise.all([
      fetch("../lang/zh.json").then(r => r.text()),
      fetch("../lang/en.json").then(r => r.text()),
      fetch("../lang/ja.json").then(r => r.text())
    ]);

    const translations = {
      zh: JSON.parse(clean(zhRaw)),
      en: JSON.parse(clean(enRaw)),
      ja: JSON.parse(clean(jaRaw))
    };

    // 验证产品数据存在
    if (!translations.zh.products?.data?.length) {
      console.warn("zh product data missing");
    }
    if (!translations.en.products?.data?.length) {
      console.warn("en product data missing");
    }

    window.__i18n.init(translations);
    console.log("i18n loaded:", window.__i18n.lang);
  } catch (e) {
    console.error("i18n init error:", e.message);
    // 出错时用中文默认
    window.__i18n.init({});
  }
})();