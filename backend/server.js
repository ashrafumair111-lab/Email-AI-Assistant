require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { sendEmail } = require("./mailer");
const { generateEmail } = require("./ai-email");

const app = express();
const PORT = process.env.PORT || 3000;
// Log location is configurable so Docker can mount a persistent volume
const LOG_FILE = process.env.LOG_FILE || path.join(__dirname, "email-log.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- helpers ----------
function loadLog() {
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
  } catch {
    return [];
  }
}

function appendLog(entry) {
  // Never fail an already-successful send because of a logging problem
  try {
    const log = loadLog();
    log.unshift(entry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
  } catch (e) {
    console.error("Warning: could not write email log:", e.message);
  }
}

// ---------- routes ----------
// GET /health -> status check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Email Server is running" });
});

// POST /api/ai-email -> generate draft (and optionally send)
// Body: { topic, tone, to, toName, send, extra }
app.post("/api/ai-email", async (req, res) => {
  try {
    const { topic, tone = "professional", to, toName, send = false, extra } =
      req.body || {};

    if (!topic) {
      return res
        .status(400)
        .json({ success: false, error: "topic is required" });
    }
    const recipient = to || process.env.TO_EMAIL;
    if (send && !recipient) {
      return res
        .status(400)
        .json({ success: false, error: "Recipient email (to) is required to send" });
    }

    const draft = await generateEmail({ topic, tone, toName, extra });

    if (!send) {
      return res.json({ success: true, draft, sent: false });
    }

    const info = await sendEmail(recipient, draft.subject, draft.body);
    appendLog({
      time: new Date().toISOString(),
      to: recipient,
      subject: draft.subject,
      tone,
      status: "sent",
      messageId: info.messageId,
    });
    res.json({ success: true, draft, sent: true, messageId: info.messageId, to: recipient });
  } catch (err) {
    console.error("AI email failed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /send-email -> manual send { "subject": "...", "body": "...", "to": "optional" }
app.post("/send-email", async (req, res) => {
  try {
    const { subject, body, html, to } = req.body || {};
    if (!subject || !body) {
      return res
        .status(400)
        .json({ success: false, error: "subject and body are required" });
    }
    const recipient = to || process.env.TO_EMAIL;
    const info = await sendEmail(recipient, subject, body, html);
    appendLog({
      time: new Date().toISOString(),
      to: recipient,
      subject,
      status: "sent",
      messageId: info.messageId,
    });
    res.json({ success: true, messageId: info.messageId, to: recipient });
  } catch (err) {
    console.error("Send failed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/logs -> email send history
app.get("/api/logs", (req, res) => {
  res.json(loadLog());
});

const server = app.listen(PORT, () => {
  console.log(`AI Email Server running on http://localhost:${PORT}`);
});

// Graceful shutdown — lets `docker stop` / compose scale-down finish cleanly
function shutdown(signal) {
  console.log(`${signal} received — shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));