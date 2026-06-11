/* ===== 语言数据加载器 ===== */
// 异步加载所有语言文件
(async function() {
  try {
    const [zh, en, ja] = await Promise.all([
      fetch("../lang/zh.json").then(r => r.json()),
      fetch("../lang/en.json").then(r => r.json()),
      fetch("../lang/ja.json").then(r => r.json())
    ]);
    window.__i18n.init({ zh, en, ja });
  } catch (e) {
    console.warn("i18n load error (ok if local):", e);
  }
})();
