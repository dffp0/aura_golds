const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("السيرفر شغال 🎉");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 🛒 جلب منتجات سلة (تجربة)
app.get("/api/salla/products", async (req, res) => {
  try {
    const response = await fetch("https://api.salla.dev/admin/v2/products", {
      headers: {
        Authorization: `Bearer ${process.env.SALLA_ACCESS_TOKEN}`,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
