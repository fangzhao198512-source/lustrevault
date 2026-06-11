// PayPal 创建订单 API — Vercel Serverless
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 获取 PayPal 客户端 ID 和密钥
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "PayPal not configured" });
    }

    // 获取 access token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 计算总金额
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // 创建 PayPal 订单
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: (total / 7.2).toFixed(2), // 粗略换算人民币转美元
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: (total / 7.2).toFixed(2),
              }
            }
          },
          items: items.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: (item.price / 7.2).toFixed(2),
            },
            quantity: item.qty.toString(),
            category: "PHYSICAL_GOODS",
          })),
        }],
        application_context: {
          brand_name: "LustreVault",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.SITE_URL || req.headers.origin}/pages/paypal-success.html`,
          cancel_url: `${process.env.SITE_URL || req.headers.origin}/pages/checkout.html`,
        },
      }),
    });

    const order = await orderRes.json();

    // 返回 approval URL 让前端跳转
    const approvalLink = order.links?.find(l => l.rel === "approve")?.href;

    if (approvalLink) {
      // 存一下订单ID到环境（演示用，生产应该用数据库）
      res.json({ url: approvalLink, orderId: order.id });
    } else {
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  } catch (err) {
    console.error("PayPal error:", err);
    res.status(500).json({ error: err.message || "PayPal failed" });
  }
};
