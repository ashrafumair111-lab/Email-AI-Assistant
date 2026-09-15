import { useState } from "react";
import { postJson } from "../api.js";

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "concise", label: "Short & Concise" },
];

export default function ComposeAI({ onSent }) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [toName, setToName] = useState("");
  const [to, setTo] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState(null);
  const [msg, setMsg] = useState(null); // { ok: boolean, text: string }

  async function generate() {
    setGenerating(true);
    setMsg(null);
    setDraft(null);
    try {
      const { body } = await postJson("/api/ai-email", { topic, tone, toName });
      if (!body.success) throw new Error(body.error || "Generation failed");
      setDraft(body.draft);
      setMsg({ ok: true, text: "✅ Draft ready! Review below, then hit Send." });
    } catch (e) {
      setMsg({ ok: false, text: "❌ " + e.message });
    } finally {
      setGenerating(false);
    }
  }

  async function send() {
    setSending(true);
    try {
      const { body } = await postJson("/api/ai-email", {
        topic,
        tone,
        toName,
        to,
        send: true,
      });
      if (!body.success) throw new Error(body.error || "Send failed");
      setMsg({ ok: true, text: `✅ Email sent to ${body.to} (ID: ${body.messageId})` });
      setDraft(null);
      onSent?.();
    } catch (e) {
      setMsg({ ok: false, text: "❌ " + e.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="field">
        <label>What should the email be about? (1–2 sentences)</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Remind client about pending payment of invoice #102, 2 weeks overdue, polite but firm..."
        />
      </div>
      <div className="grid2">
        <div className="field">
          <label>Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Recipient name (optional)</label>
          <input
            value={toName}
            onChange={(e) => setToName(e.target.value)}
            placeholder="e.g. Mr. Ahmed"
          />
        </div>
      </div>
      <div className="field">
        <label>Recipient email</label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="client@example.com (leave empty to use default)"
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={generate} disabled={generating}>
          {generating ? (
            <>
              <span className="spinner" />
              Thinking…
            </>
          ) : (
            "✨ Generate Preview"
          )}
        </button>
        {draft && (
          <button className="btn btn-send" onClick={send} disabled={sending}>
            🚀 Send Email
          </button>
        )}
      </div>
      {msg && <div className={"msg " + (msg.ok ? "ok" : "err")}>{msg.text}</div>}
      {draft && (
        <div>
          <div className="draft-title">📧 {draft.subject}</div>
          <div className="draft">{draft.body}</div>
        </div>
      )}
    </>
  );
}
