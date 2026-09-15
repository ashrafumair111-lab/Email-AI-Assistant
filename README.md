<div align="center">

# ✉️ Email AI Assistant

### AI-powered email composer — write, preview & send professional emails powered by **Groq (Llama 3.3 70B)** and **Gmail SMTP**.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&style=for-the-badge)](https://expressjs.com)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-F55036?style=for-the-badge)](https://groq.com)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-6.x-30B980?logo=gmail&logoColor=white&style=for-the-badge)](https://nodemailer.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Star the repo ⭐ — it helps a lot!**

</div>

---

## 📌 Table of Contents

- [🚀 About](#-about)
- [✨ Features](#-features)
- [🧠 How It Works](#-how-it-works)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🔑 Prerequisites](#-prerequisites)
- [⚙️ Quick Start](#️-quick-start)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [🖥️ Web Interface](#️-web-interface)
- [🧪 Testing](#-testing)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 About

Do you ever stare at a blank screen trying to write the *perfect* email?

**Email AI Assistant** solves that. You describe what the email should say in one or two sentences — *"remind my client about a payment that's 2 weeks overdue, polite but firm"* — pick a tone, and **Groq's Llama 3.3 70B** instantly writes a polished, ready-to-send draft. Review the preview, hit send, and **Gmail SMTP delivers it** within seconds.

The result is a complete, production-ready full-stack web app, built with **zero external AI SDKs** — just modern Node.js and the native `fetch` API.

---

## ✨ Features

| | |
|---|---|
| 🤖 **AI-Powered Writing** | Describe the email in plain words → Groq writes it |
| 🎚️ **Four Tones** | Professional · Friendly · Persuasive · Concise |
| 👁️ **Review Before Send** | Always preview the AI draft, then send |
| 📩 **Gmail SMTP Delivery** | Reliable delivery via Nodemailer (SSL :465) |
| ✉️ **Manual Send** | Compose and send emails directly too |
| 📜 **Send History** | Every email logged automatically with status |
| 🖥️ **Modern Web UI** | Clean, dark-themed, fully responsive dashboard |
| 🔌 **REST API** | JSON endpoints for automation & integrations |
| 🚦 **Health Check** | `/health` endpoint for uptime monitoring |
| 🔐 **Secure by Default** | Secrets in `.env`, git-ignored |

---

## 🧠 How It Works

```
┌──────────────┐  1. Describe topic    ┌──────────────────────────────────┐
│    Browser   │ ────────────────────▶ │        Node.js Express Server     │
│  (Web UI)    │ ◀──────────────────── │                                  │
└──────────────┘                       │  POST /api/ai-email               │
                                       │         │                        │
                                       │         ▼                        │
                                       │  ┌──────────────┐   Groq AI      │
                                       │  │  groq.js     │ ─────────────▶ │
                                       │  │ Llama 3.3 70B│    api.groq.com│
                                       │  └──────────────┘   ◀──────────── │
                                       │         │  subject + body (JSON)  │
                                       │         ▼                        │
                                       │  ┌──────────────┐   Gmail SMTP    │
                                       │  │  mailer.js   │ ─────────────▶ │
                                       │  │  nodemailer  │    smtp.gmail   │
                                       │  └──────────────┘   .com:465      │
                                       │         │                        │
                                       │         ▶  📩 delivered to inbox  │
                                       └──────────────────────────────────┘
```

1. You type what the email should say + pick a tone
2. `ai-email.js` builds a smart prompt → `groq.js` calls the Groq API
3. **Llama 3.3 70B** returns `{ "subject", "body" }` as strict JSON
4. You review the draft → hit send
5. `mailer.js` delivers it through Gmail's SMTP with your App Password
6. Every send is appended to `email-log.json` and shown in the UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | **Node.js ≥ 18** (uses native `fetch`) |
| Web framework | **Express 4** |
| AI | **Groq Cloud API** — Llama 3.3 70B (no SDK) |
| Email | **Nodemailer 6** → Gmail SMTP (`smtp.gmail.com:465`, SSL) |
| Config | **dotenv** |
| Frontend | Vanilla HTML/CSS/JS (no build step) |
| Data | `email-log.json` (lightweight file storage) |
---

## 📂 Project Structure

```
email-ai-assistant/
├── docker-compose.yml        # docker compose up --build → runs everything
├── package.json              # root helper scripts (dev / tests)
│
├── backend/                  # Node.js + Express API
│   ├── Dockerfile            # Multi-stage build, non-root user, healthcheck
│   ├── .dockerignore
│   ├── server.js             # REST API: /api/ai-email · /send-email · /api/logs
│   ├── groq.js               # Groq client (native fetch — no SDK)
│   ├── ai-email.js           # Prompt engineering → subject & body JSON
│   ├── mailer.js             # Gmail SMTP transport (Nodemailer, SSL :465)
│   ├── verify-auth.js        # Gmail credential checker (no email sent)
│   ├── test-send.js          # Quick plain-email sender test
│   ├── test-e2e.js           # Full end-to-end test (AI → send → logs)
│   ├── public/               # Legacy static UI fallback (served by Express)
│   ├── .env.example          # Credentials template (commit this)
│   ├── .env                  # Your real secrets — NEVER commit
│   └── email-log.json        # Send history (Docker: /data volume instead)
│
└── frontend/                 # React 18 + Vite UI (separate app)
    ├── Dockerfile            # vite build → nginx (proxies /api → backend)
    ├── nginx.conf            # SPA routing + /api & /send-email proxy
    ├── .dockerignore
    ├── index.html
    ├── vite.config.js        # Dev proxy /api + /send-email → :3000
    ├── package.json
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Tabs + layout
        ├── api.js            # fetch helper
        ├── index.css         # Dark theme (ported from original UI)
        └── components/
            ├── ComposeAI.jsx # AI compose → preview → send
            ├── ManualSend.jsx
            └── History.jsx   # Send log table
```

---

## 🔑 Prerequisites

- ✅ **Node.js ≥ 18** (native `fetch`) — check with `node --version`
- ✅ A **Gmail account** with **2-Step Verification ON**
- ✅ A **Google App Password** (16 characters) — [google.com/apppasswords](https://myaccount.google.com/apppasswords)
- ✅ A **free Groq API key** — [console.groq.com](https://console.groq.com) → *API Keys*

> ⚠️ Gmail will **not** accept your normal account password — the App Password is required.**

---

## ⚙️ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/ashrafumair111-lab/Email-AI-Assistant.git
cd Email-AI-Assistant

# 2. Configure credentials
cp backend/.env.example backend/.env    # then fill in your real values

# 3. Run EVERYTHING with one command 🐳
docker compose up --build
```

Open your browser → **http://localhost:8080** 🎉 (API also reachable on :3000)

> ℹ️ First run pulls Node/nginx base images and builds both images. The AI +
> Gmail stack works out of the box — send history persists in the
> `email-logs` Docker volume even across rebuilds and restarts.

### Run without Docker (dev mode)

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run check-auth                      # verify Gmail credentials

npm run backend                         # Terminal 1 → API  http://localhost:3000
npm run frontend                        # Terminal 2 → UI   http://localhost:5173
```

> ℹ️ In dev mode the Vite dev server proxies `/api` and `/send-email` to the
> backend, so no CORS setup is needed. The legacy static UI still works at
> http://localhost:3000 (`backend/public/index.html`).

---

## 🐳 Docker

| Service | Container | Port | What it runs |
|---|---|---|---|
| `frontend` | `email-frontend` | **8080** | nginx serving the React build; proxies `/api` + `/send-email` → backend |
| `backend` | `email-backend` | 3000 | Node 20 (Alpine) Express API, runs as **non-root** user |

- **Persistent history** — `email-logs` named volume mounted at `/data` (`LOG_FILE=/data/email-log.json`)
- **Healthchecks** — both images define them; compose waits for the backend to be healthy before starting the frontend
- **Graceful shutdown** — backend handles `SIGTERM`, so `docker compose down` stops it cleanly
- **One command** — `docker compose up --build` builds + starts everything; `docker compose down` stops it

> ⚠️ What Docker does **not** give you here: no TLS/HTTPS termination (put a
> reverse proxy like Caddy/traefik or a cloud load balancer in front for that),
> no rate limiting/auth on the API, and secrets live in plaintext `.env`
> (fine for personal use — use Docker secrets or a vault for real production).

---

## 🔐 Environment Variables

All configuration lives in `.env` (copy `.env.example`):

| Variable | Description | Example |
|---|---|---|
| `GMAIL_USER` | Your Gmail address (the sender) | `ashrafumair111@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-char Google App Password | `abcd efgh ijkl mnop` |
| `TO_EMAIL` | Default recipient when none provided | `asia@example.com` |
| `PORT` | Server port | `3000` |
| `GROQ_API_KEY` | Groq key (starts with `gsk_`) | `gsk_...` |
| `GROQ_MODEL` | Groq model override (optional) | `llama-3.3-70b-versatile` |

---

## 📡 API Reference

### `GET /health`
Health check for uptime monitoring.
```bash
curl http://localhost:3000/health
```
```json
{ "status": "ok", "message": "AI Email Server is running" }
```

### `POST /api/ai-email`
Generate an AI draft — and optionally send it.

**Body:**
| Field | Type | Required | Description |
|---|---|---|---|
| `topic` | string | ✅ | What the email should be about |
| `tone` | string | — | `professional` · `friendly` · `persuasive` · `concise` |
| `to` | string | for send | Recipient email (defaults to `TO_EMAIL`) |
| `toName` | string | — | Recipient name for the greeting |
| `extra` | string | — | Additional instructions |
| `send` | boolean | — | `true` to send, `false`/omit for draft only |

**Example — draft only:**
```bash
curl -X POST http://localhost:3000/api/ai-email \
  -H "Content-Type: application/json" \
  -d '{"topic":"Remind client about pending payment, 2 weeks overdue, polite","tone":"professional"}'
```
```json
{
  "success": true,
  "draft": {
    "subject": "Reminder: Payment Overdue for Invoice #102",
    "body": "Dear Client,\n\nI hope this email finds you well..."
  },
  "sent": false
}
```

**Example — generate & send:**
```bash
curl -X POST http://localhost:3000/api/ai-email \
  -H "Content-Type: application/json" \
  -d '{"topic":"Confirm meeting tomorrow 3 PM","send":true}'
```

### `POST /send-email`
Manually send an email (no AI).
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{"subject":"Hello","body":"Hello world","to":"friend@gmail.com"}'
```

### `GET /api/logs`
Fetch full send history.
```bash
curl http://localhost:3000/api/logs
```
```json
[
  {
    "time": "2026-09-03T17:19:03.646Z",
    "to": "asia@example.com",
    "subject": "Meeting Confirmation for Tomorrow",
    "status": "sent",
    "messageId": "<7c3d...@gmail.com>"
  }
]
```

---

## 🖥️ Web Interface

The dashboard at **http://localhost:8080** (Docker) or **http://localhost:5173** (dev) has three tabs:

1. **✍️ Compose with AI** — describe the email, choose a tone, get a preview, then send
2. **✉️ Manual Send** — write a plain email and send it directly
3. **📜 History** — a live table of every email you've sent

> 📸 *Pro tip: run the app and add your own screenshots here for a portfolio-ready README.*

---

## 🧪 Testing

```bash
npm run test-send    # sends one plain email to TO_EMAIL — verifies Gmail works
npm run test-e2e     # starts the server, calls Groq, sends + verifies the log
```

Expected E2E output:
```
1) Calling Groq to generate + SEND email...
   status: 200
   success: true
   subject: Meeting Confirmation for Tomorrow
   ✅ E2E TEST PASSED
```

## 🔧 Troubleshooting

### `535-5.7.8 Username and Password not accepted` (BadCredentials)

Google rejected the Gmail login. This means the **App Password** in `.env` is
no longer valid for `GMAIL_USER` — Google revokes App Passwords when you
change your account password, remove 2-Step Verification, delete the app
password from security settings, or the password was simply mistyped.

Fix:
1. Open **https://myaccount.google.com/apppasswords**
2. Confirm **2-Step Verification is ON** for the Google account.
3. Create a **new** App Password (app: *Mail*, device: *Windows*).
4. Paste it into `.env` → `GMAIL_APP_PASSWORD` (spaces are fine — they are stripped automatically).
5. Verify credentials without sending anything:
   ```bash
   npm run check-auth
   ```
6. Once you see `[AUTH OK]`, start the server: `npm start`

> ⚠️ Your normal Google account password will **never** work for SMTP —
> an App Password is required, and it is only visible at creation time.


---

## 🗺️ Roadmap

- [x] Core: AI draft + preview + send
- [x] Send history & logging
- [x] Modern web UI
- [x] REST API
- [ ] **Scheduled emails** (cron / `node-cron`)
- [ ] **WhatsApp integration** (send AI drafts as WhatsApp messages)
- [ ] Email templates library
- [ ] Auth (login) for multi-user
- [ ] Deploy guide (Render / Railway / VPS)

---

## 🤝 Contributing

Contributions are welcome!

1. 🍴 Fork the repo
2. 🌿 Create a branch: `git checkout -b feature/amazing-idea`
3. 💻 Make your changes
4. ✅ Test: `npm run test-e2e`
5. 🚀 Open a Pull Request

---

## 📄 License

Released under the [MIT License](./LICENSE). Use it freely — commercial use welcome.

<p align="center">Built with 💙 by <a href="https://github.com/ashrafumair111-lab"><b>ashrafumair111-lab</b></a> · Node.js · Express · Groq AI · Nodemailer</p>