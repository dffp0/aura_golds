const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// فحص أن السيرفر شغال
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// OAuth Callback من سلة
app.get("/api/salla/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).send("ما وصل code من سلة");
    }

    const tokenRes = await fetch("https://accounts.salla.sa/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.SALLA_CLIENT_ID,
        client_secret: process.env.SALLA_CLIENT_SECRET,
        redirect_uri: "https://aura-backend-vdqi.onrender.com/api/salla/callback",
        code: code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error(tokenData);
      return res.status(400).json({ error: "فشل جلب Access Token", tokenData });
    }

    // تخزين مؤقت للتجربة
    global.SALLA_TOKEN = tokenData.access_token;

    res.send("تم ربط المتجر بنجاح ✅ تقدر تقفل الصفحة الآن");
  } catch (err) {
    console.error(err);
    res.status(500).send("صار خطأ أثناء ربط سلة");
  }
});

// جلب منتجات سلة
app.get("/api/salla/products", async (req, res) => {
  try {
    if (!global.SALLA_TOKEN) {
      return res.status(401).json({ error: "ما فيه Access Token — ثبّت التطبيق أولًا" });
    }

    const response = await fetch("https://api.salla.dev/admin/v2/products", {
      headers: {
        Authorization: `Bearer ${global.SALLA_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "فشل الاتصال بسلة" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
