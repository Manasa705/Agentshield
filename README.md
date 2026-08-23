\# AgentShield 🛡️



\*\*An AI agent security guard that intercepts dangerous crypto transactions before they're signed.\*\*



Built for DoraHacks 2.0 — Web3 Consumer track (Wallets, Identity, On-chain Social).



\## The Problem



AI agents are increasingly trusted to manage crypto wallets — making trades, approvals, and transfers automatically. This creates a serious risk: agents can be tricked (or misbehave) into signing away unlimited access to a wallet, leading to "wallet drainer" attacks that can wipe out a user's funds in seconds.



\## The Solution



AgentShield sits between an AI agent and a crypto wallet, inspecting every proposed transaction \*before\* it's signed. If a transaction looks dangerous, it's blocked, explained in plain English, and the user is alerted instantly on Telegram — with the option to override or keep it blocked.



\## How It Works



1\. An AI agent proposes a transaction (swap, approval, transfer)

2\. \*\*Security middleware\*\* (this repo's `lib/securityChecker.js`) checks it against deterministic rules

3\. If risky, an \*\*AI explainer\*\* translates the technical risk into a 2-sentence plain-English warning

4\. A \*\*Telegram bot\*\* sends the alert with action buttons (Keep Blocked / Override \& Approve)

5\. A \*\*live dashboard\*\* shows the transaction being blocked or approved in real time



\## Project Structure



```

Agentshield/

├── lib/

│   └── securityChecker.js    # Deterministic risk rules (Member 2)

├── app/

│   └── api/

│       └── explain-risk/     # AI plain-English explainer (Member 1)

├── lib/

│   └── telegramAlert.js      # Telegram bot alerts (Member 3)

├── components/                # Dashboard UI (Member 4)

└── test-checker.js           # Local test script for the security rules

```



\## Security Rules (`lib/securityChecker.js`)



The middleware flags a transaction as blocked if any of the following are true:



| Rule | Risk Flag | What It Catches |

|---|---|---|

| `amount === MaxUint256` | `CRITICAL\\\_UNLIMITED\\\_ALLOWANCE` | Classic wallet-drainer pattern — unlimited approval |

| `amountUSD > $10` | `SPEND\\\_CAP\\\_EXCEEDED` | Transactions above a configurable safety threshold |

| Spender not whitelisted | `UNVERIFIED\\\_SPENDER` | Transfers/approvals to unknown or unverified contracts |



If none of these trigger, the transaction is `APPROVED`.



\## Testing



This project runs on \*\*Base Sepolia\*\* — a free Ethereum testnet — so no real funds or wallets are ever at risk during development or demo.



To test the security rules locally:



```bash

node test-checker.js

```



This runs 4 scenarios (1 safe, 3 attacks) and confirms the rules correctly approve/block each one.



\## Tech Stack



\- \*\*Security logic:\*\* JavaScript + ethers.js

\- \*\*Network:\*\* Base Sepolia Testnet

\- \*\*AI explainer:\*\* Groq / Gemini API

\- \*\*Alerts:\*\* Telegram Bot API

\- \*\*Dashboard:\*\* Next.js + Tailwind CSS

\- \*\*Deployment:\*\* Vercel



\## Team



\- \*\*Member 1\*\* — AI Agent \& Explainer Lead

\- \*\*Member 2\*\* — Security Middleware \& Web3 Lead

\- \*\*Member 3\*\* — Telegram Bot \& Notification Lead

\- \*\*Member 4\*\* — Frontend Dashboard \& Pitch Lead



Built at DoraHacks 2.0 🚀

