import { useEffect, useState } from "react";

export default function History({ version }) {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/logs")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setLogs(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  if (error) {
    return (
      <div className="empty">
        Could not load history — is the backend running on http://localhost:3000?
      </div>
    );
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>To</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((L) => (
            <tr key={L.time + L.to}>
              <td>{new Date(L.time).toLocaleString()}</td>
              <td>{L.to}</td>
              <td>{L.subject || ""}</td>
              <td>
                <span className="badge">✓ {L.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {logs.length === 0 && (
        <div className="empty">No emails sent yet. Send your first one! 🎉</div>
      )}
    </>
  );
}
