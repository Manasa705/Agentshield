// lib/securityChecker.js
//
// ⚠️ TEMP MOCK — built by Member 4 so the dashboard isn't blocked.
// Member 2 owns this file for real. When their version is ready,
// replace this file 1:1 — the function signature and return shape
// below match the spec in the team brief exactly, so nothing else
// in the app needs to change.

const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const WHITELISTED_ADDRESSES = [
  "0xUniswapRouterV3",
  "0xAaveLendingPool",
];

/**
 * @param {{ amount: string, spender: string, amountUSD: number }} tx
 * @returns {{ isBlocked: boolean, risk?: string, status?: string }}
 */
export function evaluateTransaction(tx) {
  if (tx.amount === MAX_UINT256) {
    return { isBlocked: true, risk: "CRITICAL_UNLIMITED_ALLOWANCE" };
  }
  if (tx.amountUSD > 10.0) {
    return { isBlocked: true, risk: "SPEND_CAP_EXCEEDED" };
  }
  if (!WHITELISTED_ADDRESSES.includes(tx.spender)) {
    return { isBlocked: true, risk: "UNVERIFIED_SPENDER" };
  }
  return { isBlocked: false, status: "APPROVED" };
}

/**
 * Simulates an on-chain transfer on Base Sepolia.
 * Mocked here — Member 2 will wire this to viem/ethers for real.
 */
export async function simulateOnChainTransfer(tx) {
  await new Promise((r) => setTimeout(r, 300));
  const fakeHash =
    "0x" +
    Array.from({ length: 64 }, () =>
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("");
  return { txHash: fakeHash, network: "base-sepolia" };
}
