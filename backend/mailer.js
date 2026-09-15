require("dotenv").config();
const nodemailer = require("nodemailer");

// Create the Gmail SMTP transporter (uses your Google App Password)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // 465 = SSL
  auth: {
    user: process.env.GMAIL_USER,
    // App passwords are 16 characters; strip any spaces just in case
    pass: (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, ""),
  },
});

/**
 * Send an email.
 * @param {string} to - recipient email address
 * @param {string} subject - email subject
 * @param {string} body - plain-text body
 * @param {string} [html] - optional HTML body
 * @returns {Promise<object>} nodemailer send result
 */
async function sendEmail(to, subject, body, html) {
  const info = await transporter.sendMail({
    from: `"Email Server" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text: body,
    ...(html ? { html } : {}),
  });
  return info;
}

module.exports = { sendEmail };