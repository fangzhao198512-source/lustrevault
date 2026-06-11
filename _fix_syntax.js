const fs = require("fs");
const b = "D:/Backup/Documents/跨境/adult-shop";
let js = fs.readFileSync(b + "/js/main.js", "utf8");

// 方式1：直接找到羽毛挑逗套装那一行，在后面加逗号
// 用 split/join 方式
js = js.split("羽毛挑逗套装 }").join("羽毛挑逗套装 },");

// 验证
try {
  new Function(js);
  console.log("✅ VALID");
} catch(e) {
  console.log("❌", e.message.substring(0,80));
}

fs.writeFileSync(b + "/js/main.js", js, "utf8");
console.log("Done");
