"use client"

import { useEffect, useState } from "react"

function format(timestamp: number) {
  const seconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.round(minutes / 60)}h ago`
}

/**
 * Renders a relative timestamp that stays accurate as the feed sits open.
 * Renders nothing on the server pass so the markup can't mismatch on hydration.
 */
export function TimeAgo({ timestamp }: { timestamp: number }) {
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    setLabel(format(timestamp))
    const id = window.setInterval(() => setLabel(format(timestamp)), 1000)
    return () => window.clearInterval(id)
  }, [timestamp])

  return (
    <time dateTime={new Date(timestamp).toISOString()} suppressHydrationWarning>
      {label ?? "just now"}
    </time>
  )
}
