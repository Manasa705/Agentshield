# AgentShield

**AI Crypto Agent Security Guard** — a firewall that simulates, scores, and blocks risky transactions before an AI agent ever signs them.

## What it does

AgentShield inspects every transaction an autonomous agent proposes. If it looks malicious (e.g. an unlimited token approval to an unverified contract), it's blocked automatically — and the user gets an instant plain-English explanation via a live dashboard and a Telegram alert with Reject/Allow buttons.

## Team

- **Member 1** — AI Explainer (turns blocked transactions into plain-English warnings)
- **Member 2** — Security Rules (`securityChecker.js` — the core detection logic)
- **Member 3** — Telegram Bot (`lib/telegramAlert.js` — sends real-time alerts with action buttons)
- **Member 4** — Dashboard & Pitch (Next.js live threat console + demo buttons)

## How it works

1. A test transaction is triggered (via the dashboard's demo buttons — no crypto wallet required)
2. `lib/securityChecker.js` scores it for risk
3. If blocked, the AI Explainer generates a plain-English reason
4. `lib/telegramAlert.js` sends a Telegram alert with Reject / Allow Anyway buttons
5. The dashboard's Live Activity Feed shows the result in real time

## Tech stack

Next.js, Tailwind CSS, Telegram Bot API, deployed on Vercel.