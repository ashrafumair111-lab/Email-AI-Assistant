/**
 * Gmail SMTP credential checker.
 * Verifies your GMAIL_USER + GMAIL_APP_PASSWORD against Google's SMTP server.
 * No email is sent — this only performs the login handshake.
 *
 * Usage:  node verify-auth.js
 */
require("dotenv").config();
const nodemailer = require("nodemailer");

const user = (process.env.GMAIL_USER || "").trim();
const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
const mask = (s) =>
  s.length > 4 ? s.slice(0, 2) + "*".repeat(s.length - 4) + s.slice(-2) : "****";

console.log("GMAIL_USER         :", user || "(missing)");
console.log(
  "GMAIL_APP_PASSWORD :",
  pass ? `${mask(pass)} (${pass.length} chars, spaces removed)` : "(missing)"
);

if (!user || !pass) {
  console.error("\n[FAIL] GMAIL_USER and/or GMAIL_APP_PASSWORD missing in .env");
  process.exit(1);
}
if (pass.length !== 16) {
  console.warn(
    `\n[WARN] An App Password should be exactly 16 chars (got ${pass.length}).`
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user, pass },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
});

console.log("\nConnecting to smtp.gmail.com:465 ...");

transporter
  .verify()
  .then(() => {
    console.log("\n[AUTH OK] Credentials are valid. You can run: npm start");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n[AUTH FAILED]");
    console.error("   code    :", err.code);
    console.error("   response:", err.response);
    console.error("   message :", err.message);

    if ((err.response || "").includes("535")) {
      console.error("\n[!] Google rejected the username+password pair (BadCredentials).");
      console.error("    Fix at: https://myaccount.google.com/apppasswords");
      console.error("    1. Confirm 2-Step Verification is ON for this Google account.");
      console.error("    2. Create a NEW App Password (app: Mail, device: Windows).");
      console.error("    3. Paste it into .env as GMAIL_APP_PASSWORD (spaces are OK).");
      console.error("    4. Re-run: node verify-auth.js  -> then: npm start");
    }
    process.exit(1);
  });
