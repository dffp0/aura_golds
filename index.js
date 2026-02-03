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
        code: code
      })
    });

    const tokenData = await tokenRes.json();

    // نخزّن التوكن مؤقتًا (للتجربة فقط)
    global.SALLA_TOKEN = tokenData.access_token;

    res.send("تم ربط المتجر بنجاح ✅ تقدر تقفل الصفحة الآن");
  } catch (err) {
    console.error(err);
    res.status(500).send("صار خطأ أثناء ربط سلة");
  }
});
