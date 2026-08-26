"use client";

export default function ThreatPulse({ status }) {
  // status: "idle" | "safe" | "danger"
  const color =
    status === "danger" ? "#FF4757" : status === "safe" ? "#22D3A5" : "#3A4356";
  const label =
    status === "danger"
      ? "Threat detected"
      : status === "safe"
      ? "Nominal — transaction cleared"
      : "Monitoring agent activity";

  const bars = 48;

  return (
    <div className="w-full border-y border-[#232B3A] bg-[#0D111A] px-6 py-3">
      <div className="mx-auto max-w-6xl flex items-center gap-4">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{
            background: color,
            boxShadow: status !== "idle" ? `0 0 8px ${color}` : "none",
          }}
        />
        <div className="flex items-end gap-[3px] h-8 flex-1 overflow-hidden">
          {Array.from({ length: bars }).map((_, i) => (
            <span
              key={i}
              className="w-full min-w-[2px] rounded-sm origin-bottom"
              style={{
                height: `${8 + ((i * 37) % 20)}%`,
                background: color,
                opacity: status === "idle" ? 0.35 : 0.85,
                animationName:
                  status === "idle" || status === "safe" ? "pulse-line" : "spike",
                animationDuration:
                  status === "idle" ? "2.4s" : status === "danger" ? "0.9s" : "1.2s",
                animationTimingFunction:
                  status === "danger" ? "ease-out" : "ease-in-out",
                animationIterationCount: status === "danger" ? 1 : "infinite",
                animationDelay: `${(i % 6) * 0.06}s`,
              }}
            />
          ))}
        </div>
        <span className="text-xs font-mono text-[#7C8798] shrink-0 tabular-nums">
          {label}
        </span>
      </div>
    </div>
  );
}
