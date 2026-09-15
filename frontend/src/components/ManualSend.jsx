import { useState } from "react";
import { postJson } from "../api.js";

export default function ManualSend({ onSent }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  async function send() {
    setSending(true);
    try {
      const { body: res } = await postJson("/send-email", { subject, body, to });
      if (!res.success) throw new Error(res.error || "Send failed");
      setMsg({ ok: true, text: `✅ Email sent! (ID: ${res.messageId})` });
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
        <label>Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="field">
        <label>Body</label>
        <textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="field">
        <label>To (optional)</label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="recipient@example.com"
        />
      </div>
      <button className="btn btn-send" onClick={send} disabled={sending}>
        🚀 Send Email
      </button>
      {msg && <div className={"msg " + (msg.ok ? "ok" : "err")}>{msg.text}</div>}
    </>
  );
}
