// Groq AI module - uses Node.js built-in fetch (no SDK needed for Node 18+)

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Send a chat completion request to Groq.
 * @param {object} opts
 * @param {string} [opts.system] - system prompt
 * @param {string} opts.user - user prompt
 * @param {boolean} [opts.json] - request JSON output mode
 * @param {number} [opts.temperature]
 * @param {number} [opts.maxTokens]
 * @returns {Promise<string>} assistant content
 */
async function chatCompletion({
  system,
  user,
  json = false,
  temperature = 0.7,
  maxTokens = 1024,
}) {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to your .env file (get a free key at console.groq.com)"
    );
  }

  const body = {
    model: (process.env.GROQ_MODEL || DEFAULT_MODEL).trim(),
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content: user },
    ],
    temperature,
    max_tokens: maxTokens,
  };
  if (json) body.response_format = { type: "json_object" };

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

module.exports = { chatCompletion };