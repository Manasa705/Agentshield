export type Verdict = "blocked" | "approved"

export type InspectedTransaction = {
  id: string
  verdict: Verdict
  /** on-chain tx hash, or the simulated hash of the rejected payload */
  hash: string
  /** counterparty / contract the agent tried to touch */
  target: string
  /** human label for the target, e.g. "Uniswap V3 Router" or "Unverified contract" */
  targetLabel: string
  /** e.g. "approve", "transfer", "swapExactTokensForTokens" */
  method: string
  /** USDC amount at risk / moved */
  amount: number
  /** 0-100 risk score from the agent policy engine */
  riskScore: number
  /** short threat classification, blocked transactions only */
  threat?: string
  /** why the firewall reached its verdict */
  explanation: string
  timestamp: number
}

export type ShieldMetrics = {
  inspected: number
  intercepted: number
  usdcSaved: number
}
