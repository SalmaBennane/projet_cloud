import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconBell = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconAlert = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconSend = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconHistory = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="12 8 12 12 14 14" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
  </svg>
);
const IconCode = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0d0f; --surface: #141418; --surface2: #1c1c22;
    --border: #2a2a35; --border2: #363645;
    --accent: #7c6af7; --accent2: #a89df9; --accent-glow: rgba(124,106,247,0.15);
    --success: #22c55e; --warning: #f59e0b; --error: #ef4444; --info: #3b82f6;
    --text: #e8e8f0; --text2: #9090a8; --text3: #5a5a72;
    --mono: 'IBM Plex Mono', monospace; --sans: 'Syne', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }
  .app { max-width: 880px; margin: 0 auto; padding: 40px 24px 80px; }
  .header { margin-bottom: 48px; position: relative; }
  .header::before {
    content: ''; position: absolute; top: -40px; left: -100px; right: -100px; height: 300px;
    background: radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .header-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px;
    background: var(--accent-glow); border: 1px solid rgba(124,106,247,0.3);
    border-radius: 99px; font-family: var(--mono); font-size: 11px;
    color: var(--accent2); margin-bottom: 16px; letter-spacing: 0.05em;
  }
  .header-badge span { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .header h1 {
    font-size: 42px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em;
    background: linear-gradient(135deg, #e8e8f0 0%, #9090a8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .header h1 em { font-style: normal; -webkit-text-fill-color: var(--accent2); }
  .header p { color: var(--text2); margin-top: 10px; font-size: 15px; }
  .type-selector { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 32px; }
  .type-btn {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 20px 16px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; cursor: pointer; transition: all 0.2s;
    color: var(--text2); font-family: var(--sans); font-size: 14px; font-weight: 600;
  }
  .type-btn:hover { border-color: var(--border2); color: var(--text); background: var(--surface2); }
  .type-btn.active {
    border-color: var(--accent); background: var(--accent-glow); color: var(--accent2);
    box-shadow: 0 0 0 1px var(--accent);
  }
  .type-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface2); transition: all 0.2s;
  }
  .type-btn.active .type-icon { background: rgba(124,106,247,0.2); color: var(--accent); }
  .tabs {
    display: flex; gap: 2px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 24px;
  }
  .tab-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px; border-radius: 7px; border: none; background: transparent;
    color: var(--text3); font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .tab-btn:hover { color: var(--text2); background: var(--surface2); }
  .tab-btn.active { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; animation: fadeIn 0.25s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .form-grid { display: grid; gap: 20px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 7px; }
  .field label { font-size: 12px; font-weight: 600; color: var(--text2); letter-spacing: 0.05em; text-transform: uppercase; }
  .field input, .field textarea, .field select {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 11px 14px; color: var(--text); font-family: var(--sans); font-size: 14px;
    transition: all 0.2s; outline: none; width: 100%;
  }
  .field input:focus, .field textarea:focus, .field select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .field input::placeholder, .field textarea::placeholder { color: var(--text3); }
  .field textarea { resize: vertical; min-height: 90px; }
  .field select option { background: var(--surface2); }
  .field-hint { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .severity-selector { display: flex; gap: 8px; }
  .sev-btn {
    flex: 1; padding: 9px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface2); cursor: pointer; font-family: var(--sans);
    font-size: 13px; font-weight: 600; transition: all 0.2s; color: var(--text2);
  }
  .sev-btn.Info.active { border-color: var(--info); background: rgba(59,130,246,0.12); color: var(--info); }
  .sev-btn.Warning.active { border-color: var(--warning); background: rgba(245,158,11,0.12); color: var(--warning); }
  .sev-btn.Critical.active { border-color: var(--error); background: rgba(239,68,68,0.12); color: var(--error); }
  .submit-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 14px 28px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), #9f8aff);
    border: none; color: #fff; font-family: var(--sans); font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; width: 100%; margin-top: 8px;
    box-shadow: 0 4px 20px rgba(124,106,247,0.3);
  }
  .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(124,106,247,0.4); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .toast {
    position: fixed; bottom: 32px; right: 32px; padding: 14px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px;
    animation: slideUp 0.3s ease; z-index: 1000; max-width: 360px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .toast.success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #4ade80; }
  .toast.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); color: #f87171; }
  .toast-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .toast.success .toast-icon { background: rgba(34,197,94,0.2); }
  .toast.error .toast-icon { background: rgba(239,68,68,0.2); }
  .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; text-align: center; }
  .stat-number { font-size: 28px; font-weight: 800; font-family: var(--mono); }
  .stat-label { font-size: 12px; color: var(--text3); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-card.success .stat-number { color: var(--success); }
  .stat-card.error .stat-number { color: var(--error); }
  .history-table { width: 100%; border-collapse: collapse; }
  .history-table th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); }
  .history-table td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .history-table tr:last-child td { border-bottom: none; }
  .history-table tr:hover td { background: var(--surface2); }
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .badge.success { background: rgba(34,197,94,0.12); color: var(--success); border: 1px solid rgba(34,197,94,0.3); }
  .badge.error { background: rgba(239,68,68,0.12); color: var(--error); border: 1px solid rgba(239,68,68,0.3); }
  .type-tag { display: inline-block; padding: 2px 9px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .type-tag.Inscription { background: rgba(59,130,246,0.12); color: var(--info); }
  .type-tag.Notification { background: rgba(124,106,247,0.12); color: var(--accent2); }
  .type-tag.Alerte { background: rgba(245,158,11,0.12); color: var(--warning); }
  .empty-state { text-align: center; padding: 48px; color: var(--text3); }
  .empty-state p { font-size: 14px; margin-top: 16px; }
  .endpoint { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 12px; }
  .endpoint-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .method { font-family: var(--mono); font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 5px; }
  .method.GET { background: rgba(34,197,94,0.12); color: var(--success); }
  .method.POST { background: rgba(124,106,247,0.12); color: var(--accent2); }
  .url { font-family: var(--mono); font-size: 13px; color: var(--text); }
  .endpoint-desc { font-size: 13px; color: var(--text2); margin-bottom: 12px; }
  .code-block { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 14px; font-family: var(--mono); font-size: 12px; color: var(--text2); overflow-x: auto; white-space: pre; line-height: 1.7; }
  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .api-status { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; padding: 10px 16px; border-radius: 8px; font-size: 13px; background: var(--surface2); border: 1px solid var(--border); }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; }
  .status-dot.ok { background: var(--success); box-shadow: 0 0 8px var(--success); }
  .status-dot.error { background: var(--error); }
  .status-dot.checking { background: var(--warning); animation: pulse 1s infinite; }
`;

const API_DOCS = [
  {
    method: "GET",
    url: "/api/health",
    desc: "Vérifie que le serveur est en ligne et que SendGrid est configuré.",
    body: null,
  },
  {
    method: "GET",
    url: "/api/history",
    desc: "Retourne l'historique des emails envoyés pendant la session.",
    body: null,
  },
  {
    method: "POST",
    url: "/api/send/welcome",
    desc: "Envoie un email de bienvenue lors de l'inscription.",
    body: '{ "name": "Alice", "email": "alice@example.com", "serviceName": "MonApp" }',
  },
  {
    method: "POST",
    url: "/api/send/notification",
    desc: "Notification personnalisée. L'action est optionnelle.",
    body: '{ "email": "alice@example.com", "name": "Alice", "message": "Votre commande est prête !", "action": { "label": "Voir", "url": "https://..." } }',
  },
  {
    method: "POST",
    url: "/api/send/alert",
    desc: "Alerte système admin. severity: Info | Warning | Critical",
    body: '{ "adminEmail": "admin@example.com", "service": "API Gateway", "severity": "Critical", "description": "Taux erreur > 15%" }',
  },
];

function WelcomeForm({ onSubmit, loading }) {
  const [data, setData] = useState({ name: "", email: "", serviceName: "" });
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  return (
    <div className="form-grid">
      <div className="form-row">
        <div className="field">
          <label>Nom complet</label>
          <input
            placeholder="Alice Dupont"
            value={data.name}
            onChange={set("name")}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="alice@example.com"
            value={data.email}
            onChange={set("email")}
          />
        </div>
      </div>
      <div className="field">
        <label>Nom du service</label>
        <input
          placeholder="MonApplication"
          value={data.serviceName}
          onChange={set("serviceName")}
        />
        <p className="field-hint">Apparaîtra dans l'email de bienvenue</p>
      </div>
      <button
        className="submit-btn"
        onClick={() => onSubmit("welcome", data)}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : <IconSend />}
        {loading ? "Envoi en cours…" : "Envoyer l'email de bienvenue"}
      </button>
    </div>
  );
}

function NotificationForm({ onSubmit, loading }) {
  const [data, setData] = useState({
    email: "",
    name: "",
    message: "",
    actionLabel: "",
    actionUrl: "",
  });
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const handleSubmit = () => {
    const payload = {
      email: data.email,
      name: data.name,
      message: data.message,
    };
    if (data.actionLabel && data.actionUrl)
      payload.action = { label: data.actionLabel, url: data.actionUrl };
    onSubmit("notification", payload);
  };
  return (
    <div className="form-grid">
      <div className="form-row">
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="alice@example.com"
            value={data.email}
            onChange={set("email")}
          />
        </div>
        <div className="field">
          <label>Prénom</label>
          <input placeholder="Alice" value={data.name} onChange={set("name")} />
        </div>
      </div>
      <div className="field">
        <label>Message</label>
        <textarea
          placeholder="Votre commande est prête."
          value={data.message}
          onChange={set("message")}
        />
      </div>
      <div className="form-row">
        <div className="field">
          <label>Texte du bouton (optionnel)</label>
          <input
            placeholder="Voir la commande"
            value={data.actionLabel}
            onChange={set("actionLabel")}
          />
        </div>
        <div className="field">
          <label>URL du bouton (optionnel)</label>
          <input
            placeholder="https://…"
            value={data.actionUrl}
            onChange={set("actionUrl")}
          />
        </div>
      </div>
      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? <span className="spinner" /> : <IconSend />}
        {loading ? "Envoi en cours…" : "Envoyer la notification"}
      </button>
    </div>
  );
}

function AlertForm({ onSubmit, loading }) {
  const [data, setData] = useState({
    adminEmail: "",
    service: "",
    severity: "Warning",
    description: "",
  });
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  return (
    <div className="form-grid">
      <div className="form-row">
        <div className="field">
          <label>Email admin</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={data.adminEmail}
            onChange={set("adminEmail")}
          />
        </div>
        <div className="field">
          <label>Service concerné</label>
          <input
            placeholder="API Gateway…"
            value={data.service}
            onChange={set("service")}
          />
        </div>
      </div>
      <div className="field">
        <label>Niveau de gravité</label>
        <div className="severity-selector">
          {["Info", "Warning", "Critical"].map((s) => (
            <button
              key={s}
              className={`sev-btn ${s} ${data.severity === s ? "active" : ""}`}
              onClick={() => setData((d) => ({ ...d, severity: s }))}
            >
              {s === "Info" ? "ℹ️" : s === "Warning" ? "⚠️" : "🚨"} {s}
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea
          placeholder="Décrivez le problème…"
          value={data.description}
          onChange={set("description")}
        />
      </div>
      <button
        className="submit-btn"
        onClick={() => onSubmit("alert", data)}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : <IconSend />}
        {loading ? "Envoi en cours…" : "Envoyer l'alerte"}
      </button>
    </div>
  );
}

function HistoryTab({ history, stats }) {
  const fmt = (iso) =>
    new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  return (
    <>
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{stats.success}</div>
          <div className="stat-label">Succès</div>
        </div>
        <div className="stat-card error">
          <div className="stat-number">{stats.failed}</div>
          <div className="stat-label">Échecs</div>
        </div>
      </div>
      <div className="card">
        {history.length === 0 ? (
          <div className="empty-state">
            <IconHistory />
            <p>Aucun email envoyé dans cette session.</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Destinataire</th>
                <th>Heure</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className={`type-tag ${e.type}`}>{e.type}</span>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                    {e.recipient}
                  </td>
                  <td
                    style={{
                      color: "var(--text3)",
                      fontFamily: "var(--mono)",
                      fontSize: 12,
                    }}
                  >
                    {fmt(e.timestamp)}
                  </td>
                  <td>
                    <span className={`badge ${e.status}`}>
                      {e.status === "success" ? <IconCheck /> : <IconX />}
                      {e.status === "success" ? "Envoyé" : "Échec"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function ApiTab() {
  return (
    <div>
      <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 20 }}>
        Les 5 endpoints à implémenter dans ton backend Node.js/Express.
      </p>
      {API_DOCS.map((ep, i) => (
        <div className="endpoint" key={i}>
          <div className="endpoint-header">
            <span className={`method ${ep.method}`}>{ep.method}</span>
            <span className="url">{ep.url}</span>
          </div>
          <p className="endpoint-desc">{ep.desc}</p>
          {ep.body && <pre className="code-block">{ep.body}</pre>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [emailType, setEmailType] = useState("welcome");
  const [tab, setTab] = useState("send");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => (r.ok ? setApiStatus("ok") : setApiStatus("error")))
      .catch(() => setApiStatus("error"));
  }, []);

  const fetchHistory = useCallback(() => {
    fetch(`${API_BASE}/history`)
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setStats(data.stats || { total: 0, success: 0, failed: 0 });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab, fetchHistory]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (type, data) => {
    const urls = {
      welcome: "/send/welcome",
      notification: "/send/notification",
      alert: "/send/alert",
    };
    const labels = {
      welcome: "Inscription",
      notification: "Notification",
      alert: "Alerte",
    };
    const required = {
      welcome: ["name", "email", "serviceName"],
      notification: ["email", "name", "message"],
      alert: ["adminEmail", "service", "severity", "description"],
    };
    const missing = required[type].filter((f) => !data[f]);
    if (missing.length) {
      showToast(`Champs manquants : ${missing.join(", ")}`, "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${urls[type]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      const recipient = data.email || data.adminEmail;
      if (res.ok) {
        showToast(json.message || "Email envoyé !", "success");
        setHistory((h) => [
          {
            id: Date.now().toString(),
            type: labels[type],
            recipient,
            status: "success",
            timestamp: new Date().toISOString(),
          },
          ...h,
        ]);
        setStats((s) => ({ ...s, total: s.total + 1, success: s.success + 1 }));
      } else {
        showToast(json.error || "Erreur lors de l'envoi", "error");
        setHistory((h) => [
          {
            id: Date.now().toString(),
            type: labels[type],
            recipient,
            status: "error",
            timestamp: new Date().toISOString(),
          },
          ...h,
        ]);
        setStats((s) => ({ ...s, total: s.total + 1, failed: s.failed + 1 }));
      }
    } catch {
      showToast(
        "Impossible de joindre le serveur. Vérifiez que le backend tourne sur le port 3001.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const EMAIL_TYPES = [
    { id: "welcome", label: "Inscription", icon: <IconUser /> },
    { id: "notification", label: "Notification", icon: <IconBell /> },
    { id: "alert", label: "Alerte", icon: <IconAlert /> },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-badge">
            <span />
            Email Service
          </div>
          <h1>
            Dashboard <em>Email</em>
          </h1>
          <p>
            Envoyez des emails transactionnels via SendGrid depuis une interface
            unifiée.
          </p>
        </div>
        <div className="type-selector">
          {EMAIL_TYPES.map((t) => (
            <button
              key={t.id}
              className={`type-btn ${emailType === t.id ? "active" : ""}`}
              onClick={() => {
                setEmailType(t.id);
                setTab("send");
              }}
            >
              <div className="type-icon">{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>
        <div className="tabs">
          {[
            { id: "send", label: "Envoyer", icon: <IconSend /> },
            { id: "history", label: "Historique", icon: <IconHistory /> },
            { id: "api", label: "API", icon: <IconCode /> },
          ].map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        {tab === "send" && (
          <div className="card">
            <div className="api-status">
              <div className={`status-dot ${apiStatus}`} />
              <span style={{ color: "var(--text2)" }}>
                Backend :{" "}
                {apiStatus === "ok" ? (
                  <span style={{ color: "var(--success)" }}>
                    Connecté — {API_BASE}
                  </span>
                ) : apiStatus === "error" ? (
                  <span style={{ color: "var(--error)" }}>
                    Hors ligne — lancez le serveur Express
                  </span>
                ) : (
                  <span style={{ color: "var(--warning)" }}>Vérification…</span>
                )}
              </span>
            </div>
            {emailType === "welcome" && (
              <WelcomeForm onSubmit={handleSubmit} loading={loading} />
            )}
            {emailType === "notification" && (
              <NotificationForm onSubmit={handleSubmit} loading={loading} />
            )}
            {emailType === "alert" && (
              <AlertForm onSubmit={handleSubmit} loading={loading} />
            )}
          </div>
        )}
        {tab === "history" && <HistoryTab history={history} stats={stats} />}
        {tab === "api" && (
          <div className="card">
            <ApiTab />
          </div>
        )}
      </div>
      {toast && (
        <div className={`toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? <IconCheck /> : <IconX />}
          </div>
          {toast.msg}
        </div>
      )}
    </>
  );
}
