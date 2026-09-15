const { chatCompletion } = require("./groq");

const SYSTEM_PROMPT = `You are a professional email-writing assistant inside a web app.
Your job: turn a short topic description into a polished, ready-to-send email.

Rules:
- Reply with a VALID JSON object ONLY. No markdown, no code fences, no extra text.
- The JSON must have exactly two fields: "subject" and "body".
- subject: short and clear (max ~10 words, no trailing period).
- body: complete email with greeting, clear message, and polite sign-off, in plain text.
- Use \\n for line breaks in the body. Do NOT write HTML.
- Match the requested tone (professional, friendly, persuasive, concise).

Example reply:
{"subject":"Payment Reminder for Invoice #102","body":"Dear Client,\\n\\nI hope this email finds you well. This is a friendly reminder..."}`;

function buildUserPrompt({ topic, tone, toName, extra }) {
  const parts = [`Tone: ${tone}`, `Topic / context: ${topic}`];
  if (toName) parts.push(`Recipient name: ${toName}`);
  if (extra) parts.push(`Additional details: ${extra}`);
  return parts.join("\n") + "\n\nWrite the email now.";
}

/**
 * Generate an email draft with Groq.
 * @returns {Promise<{subject: string, body: string}>}
 */
async function generateEmail(opts) {
  const raw = await chatCompletion({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(opts),
    json: true,
    temperature: 0.7,
  });

  let draft;
  try {
    draft = JSON.parse(raw);
  } catch {
    throw new Error("AI returned invalid JSON: " + raw.slice(0, 300));
  }
  if (!draft.subject || !draft.body) {
    throw new Error("AI response missing subject/body fields");
  }
  return { subject: draft.subject.trim(), body: draft.body.trim() };
}

module.exports = { generateEmail };