import { Radar } from "lucide-react"
import type { InspectedTransaction } from "@/lib/types"
import { TransactionCard } from "@/components/transaction-card"

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* radar sweep */}
      <div className="relative flex size-20 items-center justify-center">
        <span className="animate-radar absolute size-20 rounded-full border border-primary/40" />
        <span
          className="animate-radar absolute size-20 rounded-full border border-primary/40"
          style={{ animationDelay: "1.2s" }}
        />
        <span className="relative flex size-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
          <Radar className="size-5 text-primary" aria-hidden="true" />
        </span>
      </div>

      <p className="mt-6 text-sm font-medium text-foreground">Monitoring agent activity</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        No transactions in this session yet. Every call your agent signs is simulated and scored here before it reaches
        the mempool.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5">
        <span className="size-1.5 animate-pulse rounded-full bg-success" />
        <span className="font-mono text-[11px] text-muted-foreground">listening · base-sepolia · rpc connected</span>
      </div>
    </div>
  )
}

export function ActivityFeed({ transactions }: { transactions: InspectedTransaction[] }) {
  return (
    <section aria-label="Live activity feed" className="rounded-xl border border-border bg-card/50">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">Live Activity Feed</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-elevated px-2 py-0.5">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">streaming</span>
        </span>
        <p className="ml-auto font-mono text-[11px] text-muted-foreground">
          {transactions.length} event{transactions.length === 1 ? "" : "s"}
        </p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-3 p-3 sm:p-4">
          {transactions.map((tx) => (
            <li key={tx.id}>
              <TransactionCard tx={tx} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
