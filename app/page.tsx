"use client"

import { useState } from "react"
import { Radio, Trash2 } from "lucide-react"
import { ActivityFeed } from "@/components/activity-feed"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricCards } from "@/components/metric-cards"
import type { InspectedTransaction, ShieldMetrics } from "@/lib/types"

const WALLET = "0x7A3f9C2b41Ee85D6cA0b8F1d2E4c7B93aD5e61F0"

const BASE_METRICS: ShieldMetrics = {
  inspected: 142,
  intercepted: 12,
  usdcSaved: 4250,
}

/** Sample events used by the demo emitter until the live socket is wired up. */
const SAMPLES: Omit<InspectedTransaction, "id" | "timestamp">[] = [
  {
    verdict: "blocked",
    hash: "0x9f2c4a7e13b8d05c6ea91f47328bd05e7c1a94f63d820be5471ca38d9e0f27b6",
    target: "0xc0ffee2540ba9e1f3d5a7b8c94e2d1f60a3b7c88",
    targetLabel: "Unverified contract",
    method: "approve",
    amount: 2400,
    riskScore: 97,
    threat: "Infinite approval",
    explanation:
      "The agent attempted an unlimited USDC allowance to a contract deployed 4 minutes ago with no verified source and zero prior interactions. Drainer bytecode signature matched a known pattern. Signature withheld.",
  },
  {
    verdict: "approved",
    hash: "0x3ad81b6f92c04e7d5182ba39fc6e04d7b91852ae37f0c6d419ba82e5f7c31d40",
    target: "0x2626664c2603336e57b271c5c0b26f421741e481",
    targetLabel: "Uniswap V3 Router",
    method: "exactInputSingle",
    amount: 320.5,
    riskScore: 8,
    explanation:
      "Verified router, allowlisted by policy. Slippage within the 0.5% tolerance and the recipient matches the agent's own wallet. Settled on Base Sepolia.",
  },
  {
    verdict: "blocked",
    hash: "0x7be4029f8ca31d65407e9b2fa81c3d067e5941ba2c8f70d3596ea14b8d20f5c7",
    target: "0xdead4b1f8e02a95c7d3610fb84e29d7a5c0b3f91",
    targetLabel: "Spoofed USDC proxy",
    method: "transferFrom",
    amount: 1850,
    riskScore: 91,
    threat: "Address poisoning",
    explanation:
      "Destination address matches a legitimate treasury address in its first and last four characters but differs in the middle — a classic poisoning attempt seeded into the agent's transaction history. Blocked.",
  },
  {
    verdict: "approved",
    hash: "0x51c93e07ab24df6180395c7e2b4fa60d83e17c95b0da42f6371ec80b9a5d34e2",
    target: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
    targetLabel: "USDC (Base Sepolia)",
    method: "transfer",
    amount: 75,
    riskScore: 12,
    explanation:
      "Canonical USDC contract, amount below the agent's per-transaction ceiling, recipient seen in 6 prior settled transfers.",
  },
]

export default function Page() {
  const [transactions, setTransactions] = useState<InspectedTransaction[]>([])
  const [cursor, setCursor] = useState(0)

  const metrics: ShieldMetrics = {
    inspected: BASE_METRICS.inspected + transactions.length,
    intercepted: BASE_METRICS.intercepted + transactions.filter((t) => t.verdict === "blocked").length,
    usdcSaved:
      BASE_METRICS.usdcSaved +
      transactions.filter((t) => t.verdict === "blocked").reduce((sum, t) => sum + t.amount, 0),
  }

  function emit() {
    const sample = SAMPLES[cursor % SAMPLES.length]
    setCursor((c) => c + 1)
    setTransactions((prev) => [
      { ...sample, id: `${Date.now()}-${cursor}`, timestamp: Date.now() },
      ...prev,
    ])
  }

  return (
    <div className="min-h-dvh">
      <div className="pointer-events-none fixed inset-0 grid-field" aria-hidden="true" />

      <div className="relative">
        <DashboardHeader walletAddress={WALLET} />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {/* Page intro */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">Threat Console</h1>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
                Every transaction your autonomous agent proposes is simulated, scored, and cleared — or killed — before a
                signature is ever produced.
              </p>
            </div>

            {/* Demo emitter: replace with the live websocket subscription */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={emit}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[0_0_24px_-6px_var(--primary)] transition-opacity hover:opacity-90"
              >
                <Radio className="size-3.5" aria-hidden="true" />
                Simulate event
              </button>
              {transactions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTransactions([])}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <MetricCards metrics={metrics} />
          </div>

          <div className="mt-6">
            <ActivityFeed transactions={transactions} />
          </div>
        </main>
      </div>
    </div>
  )
}
