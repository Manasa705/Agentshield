# AgentShield — Dashboard (Member 4)

Live-feed dashboard for AgentShield. Testers click a button — no wallet needed —
and see the AI security guard block or approve the transaction in real time.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's in here

- `app/page.js` — the dashboard: header, threat pulse, stat cards, the 3 demo
  buttons, live activity feed.
- `components/` — `ThreatPulse`, `StatCard`, `ActionButtons`, `ActivityFeed`,
  `FeedbackPrompt`.
- `app/api/run-trade/route.js` — **your real backend piece.** The dashboard
  buttons call this. It builds a fake transaction for the chosen scenario,
  runs it through `evaluateTransaction()`, and — if blocked — asks the
  explainer for plain-English copy. This is what lets testers try it with
  zero crypto setup.
- `lib/securityChecker.js` — **TEMP MOCK for Member 2.** Same function
  signature (`evaluateTransaction(tx)`) and return shape as the team brief.
  Swap in Member 2's real file and nothing else changes.
- `app/api/explain-risk/route.js` — **TEMP MOCK for Member 1.** Same request
  body / response shape as the brief. Swap in Member 1's real Groq/Gemini
  route and nothing else changes.

## Swapping in the real backend (Day 2)

1. Member 2 sends you their `lib/securityChecker.js` — replace the file
   directly, same exports (`evaluateTransaction`).
2. Member 1 sends you their `app/api/explain-risk/route.js` — replace the
   file directly, same `POST` contract (`{ ...tx, riskType }` in,
   `{ plainEnglish }` out).
3. Nothing in `app/page.js`, `app/api/run-trade/route.js`, or `components/`
   needs to change — they only depend on the shapes above, not the mocks.

## Feedback loop

Every result card (safe or blocked) ends with: "Did this alert make sense?
Would you want this on your real wallet?" Answers currently log to the
console in `handleFeedback` (`app/page.js`) — wire that up to whatever you're
using to collect the 50-tester feedback (a Google Sheet via a simple API
route, Supabase, or even a `POST` to Member 3's Telegram bot as a follow-up
message).

## Notes

- No wallet connection required anywhere — that's intentional per the brief,
  so testers can try it in one click.
- Colors/type are the "AgentShield" design tokens: dark slate background,
  teal-green for safe, coral-red for danger, amber for warnings. Space
  Grotesk for headers, Inter for body, JetBrains Mono for addresses/hashes.
