const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // يسمح لموقعك على Netlify يكلم السيرفر

app.get("/", (req, res) => {
  res.send("السيرفر شغال 🎉");
});

// API للاختبار
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
