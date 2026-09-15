require("dotenv").config();
const { sendEmail } = require("./mailer");

const recipient = process.env.TO_EMAIL;

async function trySend(to, subject, body) {
  try {
    const info = await sendEmail(to, subject, body);
    console.log(`OK   -> ${to}  (messageId: ${info.messageId})`);
    return true;
  } catch (e) {
    console.log(`FAIL -> ${to}  (${e.message})`);
    return false;
  }
}

async function main() {
  console.log("== Sending test email to recipient ==");
  await trySend(
    recipient,
    "Test from your Node.js server",
    "Hello!\n\nThis is a test email sent from your Node.js email server.\n\n- Email Server"
  );

  console.log("\nDone. Check your inbox.");
}

main();