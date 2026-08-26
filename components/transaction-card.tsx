import { ArrowUpRight, CircleCheck, OctagonAlert } from "lucide-react"
import type { InspectedTransaction } from "@/lib/types"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/components/time-ago"

const usdc = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

const BASESCAN = "https://sepolia.basescan.org/tx/"

function shortHash(hash: string) {
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`
}

export function TransactionCard({ tx }: { tx: InspectedTransaction }) {
  const blocked = tx.verdict === "blocked"

  return (
    <article
      className={cn(
        "animate-rise relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5",
        blocked
          ? "animate-threat-pulse border-destructive/60 bg-destructive/[0.04]"
          : "border-border hover:border-success/30",
      )}
    >
      {/* verdict spine */}
      <div className={cn("absolute inset-y-0 left-0 w-px", blocked ? "bg-destructive" : "bg-success/60")} />

      <div className="flex flex-wrap items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
            blocked
              ? "bg-destructive/12 text-destructive ring-destructive/30"
              : "bg-success/12 text-success ring-success/30",
          )}
        >
          {blocked ? (
            <OctagonAlert className="size-4" aria-hidden="true" />
          ) : (
            <CircleCheck className="size-4" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          {/* verdict badge row */}
          <div className="flex flex-wrap items-center gap-2">
            {blocked ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-destructive ring-1 ring-destructive/40">
                <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
                Critical Threat Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-success/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-success ring-1 ring-success/30">
                Approved
              </span>
            )}

            {tx.threat && (
              <span className="rounded-md bg-elevated px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {tx.threat}
              </span>
            )}

            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              <TimeAgo timestamp={tx.timestamp} />
            </span>
          </div>

          {/* method + target */}
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <code
              className={cn(
                "rounded bg-elevated px-1.5 py-0.5 font-mono text-sm",
                blocked ? "text-destructive" : "text-primary",
              )}
            >
              {tx.method}()
            </code>
            <span className="text-sm text-muted-foreground">→</span>
            <span className="text-sm font-medium text-foreground">{tx.targetLabel}</span>
            <span className="font-mono text-xs text-muted-foreground">{shortHash(tx.target)}</span>
          </div>

          {/* explanation */}
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{tx.explanation}</p>

          {/* footer strip */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {blocked ? "At risk" : "Amount"}
              </p>
              <p
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  blocked ? "text-destructive" : "text-foreground",
                )}
              >
                {usdc.format(tx.amount)} <span className="text-[11px] font-normal text-muted-foreground">USDC</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Risk score</p>
              <p
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  tx.riskScore >= 70 ? "text-destructive" : tx.riskScore >= 35 ? "text-primary" : "text-success",
                )}
              >
                {tx.riskScore}
                <span className="text-[11px] font-normal text-muted-foreground">/100</span>
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {blocked ? "Rejected payload" : "Transaction hash"}
              </p>
              <p className="truncate font-mono text-sm text-foreground/80">{shortHash(tx.hash)}</p>
            </div>

            <a
              href={`${BASESCAN}${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                blocked
                  ? "bg-destructive/12 text-destructive ring-1 ring-destructive/30 hover:bg-destructive/20"
                  : "text-muted-foreground hover:bg-elevated hover:text-primary",
              )}
            >
              View on BaseScan
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
