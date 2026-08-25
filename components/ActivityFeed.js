"use client";

import FeedbackPrompt from "./FeedbackPrompt";

function shortHash(hash) {
  if (!hash) return "";
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

// Visual config per risk type
const RISK_STYLES = {
  CRITICAL_UNLIMITED_ALLOWANCE: {
    border: "border-[#4A1E28]",
    bg: "bg-[#1A1015]",
    badgeBg: "bg-[#FF4757]/15",
    badgeText: "text-[#FF4757]",
    label: "Critical threat blocked",
    glowColor: "rgba(255,71,87,0.45)",
  },
  SPEND_CAP_EXCEEDED: {
    border: "border-[#4A3418]",
    bg: "bg-[#1A1508]",
    badgeBg: "bg-[#FFA53D]/15",
    badgeText: "text-[#FFA53D]",
    label: "Spend cap exceeded",
    glowColor: "rgba(255,165,61,0.45)",
  },
  UNVERIFIED_SPENDER: {
    border: "border-[#4A4018]",
    bg: "bg-[#1A1A08]",
    badgeBg: "bg-[#FFD700]/15",
    badgeText: "text-[#FFD700]",
    label: "Unverified spender blocked",
    glowColor: "rgba(255,215,0,0.35)",
  },
};

const DEFAULT_RISK_STYLE = {
  border: "border-[#4A1E28]",
  bg: "bg-[#1A1015]",
  badgeBg: "bg-[#FF4757]/15",
  badgeText: "text-[#FF4757]",
  label: "Threat blocked",
  glowColor: "rgba(255,71,87,0.45)",
};

function TransactionCard({ tx, onFeedback }) {
  if (tx.isBlocked) {
    const style = RISK_STYLES[tx.risk] ?? DEFAULT_RISK_STYLE;

    return (
      <div
        className={`rounded-xl border ${style.border} ${style.bg} p-4`}
        style={{
          animation: "fade-in 0.35s ease-out",
          boxShadow: `0 0 0 1px ${style.glowColor ?? "rgba(255,71,87,0.4)"}, 0 0 18px ${style.glowColor ?? "rgba(255,71,87,0.15)"}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${style.badgeBg} ${style.badgeText} px-2 py-0.5 rounded`}
          >
            {style.label}
          </span>
          <span className="ml-auto text-[10px] font-mono text-[#7C8798]">
            {tx.risk}
          </span>
        </div>
        <p className="mt-2.5 text-sm text-[#E6EDF3] leading-relaxed">
          {tx.plainEnglish}
        </p>
        <div className="mt-2.5 flex items-center gap-3 text-xs font-mono text-[#7C8798]">
          <span>{tx.token}</span>
          {tx.amountUSD > 0 && (
            <>
              <span>·</span>
              <span>${tx.amountUSD.toFixed(2)}</span>
            </>
          )}
          <span>·</span>
          <span>spender {shortHash(tx.spender)}</span>
          <a
            href="https://sepolia.basescan.org"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[#7C8798] hover:text-[#E6EDF3] underline underline-offset-2"
          >
            View on BaseScan
          </a>
        </div>
        <FeedbackPrompt txId={tx.txId} onSubmit={onFeedback} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-[#1E4A3B] bg-[#0F1712] p-4"
      style={{ animation: "fade-in 0.35s ease-out" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[#22D3A5]">✓</span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#22D3A5]/15 text-[#22D3A5] px-2 py-0.5 rounded">
          Approved
        </span>
        <span className="ml-auto text-xs text-[#7C8798] font-mono">
          ${tx.amountUSD.toFixed(2)} {tx.token}
        </span>
      </div>
      <div className="mt-2.5 text-xs font-mono text-[#7C8798]">
        tx {shortHash(tx.txHash)}
      </div>
      <FeedbackPrompt txId={tx.txId} onSubmit={onFeedback} />
    </div>
  );
}

export default function ActivityFeed({ transactions, onFeedback }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#232B3A] p-8 text-center text-sm text-[#7C8798]">
        No activity yet — run a simulation above to see the firewall in action.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx) => (
        <TransactionCard key={tx.txId} tx={tx} onFeedback={onFeedback} />
      ))}
    </div>
  );
}
