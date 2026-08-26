"use client";

const BUTTONS = [
  {
    id: "safe",
    label: "Run Safe Trade",
    sub: "$2 USDC → Uniswap",
    icon: "🟢",
    className:
      "bg-[#0F2620] border-[#1E4A3B] text-[#22D3A5] hover:bg-[#123329] hover:border-[#22D3A5]",
  },
  {
    id: "drainer",
    label: "Run Attack",
    sub: "Unlimited Permit2 drainer",
    icon: "🔴",
    className:
      "bg-[#2A1319] border-[#4A1E28] text-[#FF4757] hover:bg-[#331519] hover:border-[#FF4757]",
  },
  {
    id: "overspend",
    label: "Run Attack: Over-Limit Spend",
    sub: "$100 USDC transfer",
    icon: "🟠",
    className:
      "bg-[#2A1E0F] border-[#4A3418] text-[#FFA53D] hover:bg-[#332310] hover:border-[#FFA53D]",
  },
];

export default function ActionButtons({ onRun, loadingId }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {BUTTONS.map((btn) => (
        <button
          key={btn.id}
          onClick={() => onRun(btn.id)}
          disabled={!!loadingId}
          className={`rounded-xl border px-5 py-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${btn.className}`}
        >
          <div className="flex items-center gap-2 font-display font-semibold text-sm">
            <span>{btn.icon}</span>
            <span>{loadingId === btn.id ? "Running…" : btn.label}</span>
          </div>
          <div className="mt-1 text-xs text-[#7C8798] font-mono">{btn.sub}</div>
        </button>
      ))}
    </div>
  );
}
