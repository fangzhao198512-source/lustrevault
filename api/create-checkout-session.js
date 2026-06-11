const Stripe = require("stripe");

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 从环境变量读取 Stripe Secret Key（Vercel 中设置）
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return res.status(500).json({ error: "Stripe key not configured" });
    }

    const stripe = Stripe(stripeKey);

    const { items, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 构建 Stripe Checkout Session 的商品行
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "cny",
        product_data: {
          name: item.name,
          description: `${item.name} × ${item.qty}`,
        },
        unit_amount: Math.round(item.price * 100), //  Stripe 以分为单位
      },
      quantity: item.qty,
    }));

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.SITE_URL || req.headers.origin}/pages/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || req.headers.origin}/pages/checkout.html`,
      shipping_address_collection: {
        allowed_countries: ["CN", "US", "JP", "KR", "GB", "AU", "CA"],
      },
      customer_email: customer?.email || undefined,
      metadata: {
        site: "lustrevault",
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message || "Payment failed" });
  }
};
