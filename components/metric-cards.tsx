import { Coins, ScanLine, ShieldAlert } from "lucide-react"
import type { ShieldMetrics } from "@/lib/types"
import { cn } from "@/lib/utils"

const usdc = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

type Tone = "primary" | "destructive" | "success"

const toneStyles: Record<Tone, { icon: string; value: string; glow: string; bar: string }> = {
  primary: {
    icon: "bg-primary/10 text-primary ring-primary/25",
    value: "text-foreground",
    glow: "bg-primary/25",
    bar: "bg-primary",
  },
  destructive: {
    icon: "bg-destructive/10 text-destructive ring-destructive/25",
    value: "text-destructive",
    glow: "bg-destructive/25",
    bar: "bg-destructive",
  },
  success: {
    icon: "bg-success/10 text-success ring-success/25",
    value: "text-success",
    glow: "bg-success/25",
    bar: "bg-success",
  },
}

function MetricCard({
  label,
  value,
  sublabel,
  tone,
  fill,
  icon: Icon,
}: {
  label: string
  value: string
  sublabel: string
  tone: Tone
  fill: number
  icon: typeof ScanLine
}) {
  const s = toneStyles[tone]

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      {/* soft corner glow */}
      <div className={cn("pointer-events-none absolute -right-10 -top-12 size-32 rounded-full blur-3xl", s.glow)} />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg ring-1", s.icon)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>

      <p className={cn("relative mt-4 font-mono text-3xl font-semibold tabular-nums tracking-tight", s.value)}>
        {value}
      </p>
      <p className="relative mt-1.5 text-xs text-muted-foreground">{sublabel}</p>

      {/* utilization rail */}
      <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", s.bar)}
          style={{ width: `${Math.min(100, Math.max(2, fill))}%` }}
        />
      </div>
    </div>
  )
}

export function MetricCards({ metrics }: { metrics: ShieldMetrics }) {
  const blockRate = metrics.inspected > 0 ? (metrics.intercepted / metrics.inspected) * 100 : 0

  return (
    <section aria-label="Firewall metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        label="Total Transactions Inspected"
        value={metrics.inspected.toLocaleString("en-US")}
        sublabel="Simulated and scored pre-signature"
        tone="primary"
        fill={100}
        icon={ScanLine}
      />
      <MetricCard
        label="Attacks Intercepted"
        value={metrics.intercepted.toLocaleString("en-US")}
        sublabel={`${blockRate.toFixed(1)}% of all agent activity blocked`}
        tone="destructive"
        fill={blockRate}
        icon={ShieldAlert}
      />
      <MetricCard
        label="USDC Saved"
        value={usdc.format(metrics.usdcSaved)}
        sublabel="Value withheld from malicious counterparties"
        tone="success"
        fill={78}
        icon={Coins}
      />
    </section>
  )
}
