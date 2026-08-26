# AgentShield — Project Workflow Summary

## What It Is
AgentShield is a crypto security dashboard that acts as an AI agent firewall. It intercepts and evaluates simulated on-chain transactions before they execute, blocking dangerous ones and displaying plain-English explanations of why they were blocked.

Built for DoraHacks 2026 Hackathon · Base Sepolia testnet.

---

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Runtime:** Node.js
- **Network:** Base Sepolia (mocked for demo)

---

## Project Structure

```
agentshield/
├── app/
│   ├── page.js                        # Main dashboard UI + state
│   ├── layout.js                      # Root layout (fonts, body styles)
│   ├── globals.css                    # Tailwind + keyframe animations
│   └── api/
│       ├── check-transaction/
│       │   └── route.js              # PRIMARY API: evaluates a raw tx object
│       ├── run-trade/
│       │   └── route.js              # LEGACY API: scenario-name based (kept for compat)
│       └── explain-risk/
│           └── route.js              # Returns plain-English risk explanation
├── components/
│   ├── ActionButtons.js              # 3 simulation buttons (green/red/orange)
│   ├── ActivityFeed.js               # Live transaction card feed
│   ├── ThreatPulse.js                # Animated waveform bar (idle/safe/danger)
│   ├── StatCard.js                   # Stat display (inspected/intercepted/saved)
│   └── FeedbackPrompt.js             # "Did this make sense?" Yes/No per card
└── lib/
    └── securityChecker.js            # Core security logic (evaluateTransaction)
```

---

## Full Request → Response Workflow

```
User clicks a button
        │
        ▼
ActionButtons.js  →  onRun(scenarioId)
        │
        ▼
page.js: handleTransaction(scenarioId)
  │  picks payload from SCENARIOS map
  │  POST /api/check-transaction  { token, amount, amountUSD, spender }
        │
        ▼
app/api/check-transaction/route.js
  │  calls evaluateTransaction(tx)  ←── lib/securityChecker.js
  │
  ├─ if BLOCKED:
  │    POST /api/explain-risk  { ...tx, riskType }
  │    returns { txId, isBlocked: true, risk, plainEnglish, token, amountUSD, spender }
  │
  └─ if APPROVED:
       simulateOnChainTransfer(tx)  (mocked 300ms delay + fake hash)
       returns { txId, isBlocked: false, status: "APPROVED", txHash, amountUSD }
        │
        ▼
page.js receives response
  │  setTransactions([data, ...prev])   → ActivityFeed updates instantly
  │  setPulseStatus("danger"|"safe")    → ThreatPulse animates
  │  stats (inspected/intercepted/saved) recomputed from transactions array
        │
        ▼
ActivityFeed.js renders card at top of feed
```

---

## Security Rules (lib/securityChecker.js)

Evaluated in this priority order:

| Priority | Rule | Trigger | Risk Code |
|---|---|---|---|
| 1 | Unlimited allowance | `amount === MAX_UINT256` | `CRITICAL_UNLIMITED_ALLOWANCE` |
| 2 | Spend cap | `amountUSD > 10.0` | `SPEND_CAP_EXCEEDED` |
| 3 | Unknown spender | spender not in whitelist | `UNVERIFIED_SPENDER` |
| — | Safe | passes all checks | `APPROVED` |

Whitelisted spenders: `0xUniswapRouterV3`, `0xAaveLendingPool`

---

## Simulation Buttons & Payloads

| Button | Scenario ID | Payload | Expected Result |
|---|---|---|---|
| 🟢 Run Safe Trade | `safe` | $2 USDC → Uniswap | ✅ Green "Approved" card |
| 🔴 Run Attack | `drainer` | MAX_UINT256 → unknown contract | 🚨 Red "Critical threat blocked" card |
| 🟠 Run Attack: Over-Limit Spend | `overspend` | $100 USDC → Uniswap | 🟠 Orange "Spend cap exceeded" card |

---

## Activity Feed Card Colors

| Risk | Badge | Border glow |
|---|---|---|
| `CRITICAL_UNLIMITED_ALLOWANCE` | 🔴 Red | Red glow |
| `SPEND_CAP_EXCEEDED` | 🟠 Orange | Orange glow |
| `UNVERIFIED_SPENDER` | 🟡 Yellow | Yellow glow |
| Approved | 🟢 Green | Green border (no glow) |

---

## Stat Cards (auto-computed from transactions array)

| Stat | Formula |
|---|---|
| Transactions inspected | `transactions.length` |
| Attacks intercepted | `transactions.filter(t => t.isBlocked).length` |
| USDC saved | Sum of `amountUSD` for blocked txs (drainer counts as $4,250 since amountUSD is 0) |

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:3000
```

---

## Team Ownership

| Member | File(s) | Status |
|---|---|---|
| Member 1 | `app/api/explain-risk/route.js` | 🟡 Mocked — swap in Groq/Gemini call |
| Member 2 | `lib/securityChecker.js` | 🟡 Mocked — swap in viem/ethers real logic |
| Member 3 | UI components | ✅ Complete |
| Member 4 | `app/api/check-transaction/route.js`, `app/page.js` | ✅ Complete |

To swap in real implementations: replace Member 1 and Member 2 files 1:1 — the function signatures and response shapes are fixed, nothing else in the app needs to change.
