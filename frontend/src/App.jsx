import { useState } from "react";
import ComposeAI from "./components/ComposeAI.jsx";
import ManualSend from "./components/ManualSend.jsx";
import History from "./components/History.jsx";

const TABS = [
  { id: "compose", label: "✍️ Compose with AI" },
  { id: "manual", label: "✉️ Manual Send" },
  { id: "history", label: "📜 History" },
];

export default function App() {
  const [tab, setTab] = useState("compose");
  // Bumped whenever an email is sent so the History tab re-fetches.
  const [logsVersion, setLogsVersion] = useState(0);
  const notifySent = () => setLogsVersion((v) => v + 1);

  return (
    <div className="wrap">
      <header>
        <div className="logo">✉️</div>
        <div>
          <h1>AI Email Assistant</h1>
          <p className="sub">Groq AI + Gmail SMTP · React · Node.js · Express</p>
        </div>
      </header>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"tab" + (tab === t.id ? " active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* All cards stay mounted so form state survives tab switches */}
      <div className={tab === "compose" ? "card" : "card hidden"}>
        <ComposeAI onSent={notifySent} />
      </div>
      <div className={tab === "manual" ? "card" : "card hidden"}>
        <ManualSend onSent={notifySent} />
      </div>
      <div className={tab === "history" ? "card" : "card hidden"}>
        <History version={logsVersion} />
      </div>

      <footer>
        Gmail SMTP · Groq (llama-3.3-70b-versatile) · API http://localhost:3000 · UI
        http://localhost:5173
      </footer>
    </div>
  );
}
