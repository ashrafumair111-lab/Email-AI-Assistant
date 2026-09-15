// Full end-to-end check: start server, AI-generate + send an email, verify logs.
// Run from a separate terminal while server.js is running:  node test-e2e.js
require("dotenv").config();
const BASE = `http://localhost:${process.env.PORT || 3000}`;

async function post(url, data) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { status: r.status, body: await r.json() };
}

(async () => {
  try {
    console.log("1) Calling Groq to generate + SEND email...");
    const { status, body } = await post(`${BASE}/api/ai-email`, {
      topic: "Confirm our meeting tomorrow at 3 PM at the office, keep it short and professional",
      tone: "professional",
      send: true, // real send to TO_EMAIL
    });
    console.log("   status:", status);
    console.log("   success:", body.success);
    console.log("   subject:", body.draft?.subject);
    console.log("   sent to:", body.to);
    console.log("   messageId:", body.messageId);

    if (!body.success) {
      console.log("   ERROR:", body.error);
      process.exit(1);
    }
    if (!body.sent) {
      console.log("   NOT SENT:", body.error);
      process.exit(1);
    }

    console.log("\n2) Checking /api/logs...");
    const r = await fetch(`${BASE}/api/logs`);
    const logs = await r.json();
    console.log("   log entries:", logs.length);
    if (logs.length) {
      const last = logs[0];
      console.log("   latest:", last.time, "->", last.to, "|", last.subject, "|", last.status);
    }
    console.log("\n✅ E2E TEST PASSED");
  } catch (e) {
    console.log("❌ E2E FAILED:", e.message);
    process.exit(1);
  }
})();