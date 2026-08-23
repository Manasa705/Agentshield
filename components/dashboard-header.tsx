"use client"

import { useState } from "react"
import { Check, Copy, ShieldCheck, Wallet } from "lucide-react"

type Props = {
  walletAddress: string
  network?: string
}

function truncate(address: string) {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function DashboardHeader({ walletAddress, network = "Base Sepolia" }: Props) {
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard unavailable — nothing to recover from
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo + wordmark */}
        <div className="flex items-center gap-3">
          <span className="relative flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            <span className="pointer-events-none absolute inset-0 rounded-lg shadow-[0_0_20px_-4px_var(--primary)]" />
          </span>
          <div className="leading-none">
            <p className="text-[15px] font-semibold tracking-tight">
              Agent<span className="text-primary">Shield</span>
            </p>
            <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">AI Crypto Agent Security Guard</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Live status badge */}
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 py-1.5 pl-2.5 pr-3">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-success shadow-[0_0_10px_var(--success)]" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-success sm:text-xs">
              Firewall Active
              <span className="hidden text-success/70 sm:inline"> · {network}</span>
            </span>
          </div>

          {/* Connected wallet */}
          <button
            type="button"
            onClick={copyAddress}
            className="group flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
            aria-label={`Connected wallet ${walletAddress}. Copy address`}
          >
            <Wallet className="size-3.5 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
            <span className="font-mono text-xs text-foreground/90">{truncate(walletAddress)}</span>
            {copied ? (
              <Check className="size-3.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5 text-muted-foreground/70" aria-hidden="true" />
            )}
            <span className="sr-only" role="status">
              {copied ? "Wallet address copied" : ""}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
