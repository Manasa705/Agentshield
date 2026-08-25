"use client";

import { useState } from "react";
import ThreatPulse from "@/components/ThreatPulse";
import StatCard from "@/components/StatCard";
import ActionButtons from "@/components/ActionButtons";
import ActivityFeed from "@/components/ActivityFeed";

// Transaction payloads keyed by scenario id
const SCENARIOS = {
  safe: {
    token: "USDC",
    amount: "2",
    amountUSD: 2,
    spender: "0xUniswapRouterV3",
  },
  drainer: {
    token: "USDC",
    amount:
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    amountUSD: 0,
    spender: "0xHackerContractAddress",
  },
  overspend: {
    token: "USDC",
    amount: "100000000", // 100 USDC in micro-units
    amountUSD: 100.0,
    spender: "0xUniswapRouterV3", // whitelisted — triggers SPEND_CAP_EXCEEDED, not UNVERIFIED_SPENDER
  },
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [pulseStatus, setPulseStatus] = useState("idle");

  const inspected = transactions.length;
  const intercepted = transactions.filter((t) => t.isBlocked).length;
  const saved = transactions
    .filter((t) => t.isBlocked)
    .reduce((sum, t) => sum + (t.amountUSD > 0 ? t.amountUSD : 4250), 0);

  /**
   * Sends a transaction to /api/check-transaction and prepends the
   * result to the activity feed.
   *
   * @param {string} scenarioId - "safe" | "drainer" | "overspend"
   */
  const handleTransaction = async (scenarioId) => {
    setLoadingId(scenarioId);
    try {
      const tx = SCENARIOS[scenarioId];

      const res = await fetch("/api/check-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });

      const data = await res.json();

      setPulseStatus(data.isBlocked ? "danger" : "safe");
      setTransactions((prev) => [data, ...prev]);

      setTimeout(() => setPulseStatus("idle"), 1600);
    } catch (e) {
      console.error("Transaction failed:", e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleFeedback = (txId, value) => {
    console.log("feedback", txId, value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-[#232B3A] bg-[#0B0E14]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#22D3A5] to-[#0F2620] flex items-center justify-center text-sm">
            🛡️
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            AgentShield
          </span>
          <span className="ml-2 text-[10px] font-mono uppercase tracking-wider bg-[#22D3A5]/10 text-[#22D3A5] px-2 py-1 rounded-full border border-[#1E4A3B]">
            🟢 Firewall Active — Base Sepolia
          </span>
          <span className="ml-auto text-xs font-mono text-[#7C8798]">
            0x8f2a…c19e
          </span>
        </div>
      </header>

      <ThreatPulse status={pulseStatus} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        <section className="flex flex-wrap gap-3">
          <StatCard label="Transactions inspected" value={inspected} />
          <StatCard
            label="Attacks intercepted"
            value={intercepted}
            accent="#FF4757"
          />
          <StatCard
            label="USDC saved"
            value={`${saved.toFixed(2)}`}
            accent="#22D3A5"
          />
        </section>

        <section>
          <h2 className="font-display font-semibold text-sm text-[#7C8798] uppercase tracking-wider mb-3">
            Live simulation
          </h2>
          <ActionButtons onRun={handleTransaction} loadingId={loadingId} />
        </section>

        <section className="flex-1">
          <h2 className="font-display font-semibold text-sm text-[#7C8798] uppercase tracking-wider mb-3">
            Live activity feed
          </h2>
          <ActivityFeed transactions={transactions} onFeedback={handleFeedback} />
        </section>
      </main>

      <footer className="border-t border-[#232B3A] py-4">
        <div className="max-w-6xl mx-auto px-6 text-xs text-[#7C8798] font-mono">
          AgentShield · DoraHacks 2026 · AI agent security guard
        </div>
      </footer>
    </div>
  );
}
