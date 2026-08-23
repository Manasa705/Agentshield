// lib/securityChecker.js
//
// AgentShield — Security Guardrail Middleware
// Owner: Member 2 (Security Middleware & Web3 Lead)
//
// This module inspects a proposed transaction BEFORE it's signed and decides
// whether to block it, based on deterministic (non-AI) rules. The AI
// explainer (Member 1) turns the result into plain English; the Telegram bot
// (Member 3) alerts the user; the dashboard (Member 4) displays it.

const { ethers } = require("ethers");

// The max uint256 value — the classic "infinite approval" attack pattern.
const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

// Hardcode a few known-safe contract addresses for the demo.
// Add real addresses (e.g. Uniswap router on Base Sepolia) as you test.
const WHITELISTED_ADDRESSES = [
  "0x0000000000000000000000000000000000dEaD", // placeholder — replace with real safe addresses
];

const SPEND_CAP_USD = 10.0;

/**
 * Evaluate a transaction against the security rules.
 *
 * @param {Object} tx
 * @param {string} tx.amount     - raw token amount, as a string (can be MaxUint256)
 * @param {string} tx.spender    - address the approval/transfer is going to
 * @param {number} tx.amountUSD  - USD value of the transaction
 * @returns {{isBlocked: boolean, risk: string, status: string}}
 */
function evaluateTransaction(tx) {
  if (!tx || typeof tx !== "object") {
    return {
      isBlocked: true,
      risk: "INVALID_INPUT",
      status: "BLOCKED",
    };
  }

  const { amount, spender, amountUSD } = tx;

  // Rule 1: Unlimited allowance (classic wallet-drainer pattern)
  if (amount === MAX_UINT256) {
    return {
      isBlocked: true,
      risk: "CRITICAL_UNLIMITED_ALLOWANCE",
      status: "BLOCKED",
    };
  }

  // Rule 2: Spend cap exceeded
  if (typeof amountUSD === "number" && amountUSD > SPEND_CAP_USD) {
    return {
      isBlocked: true,
      risk: "SPEND_CAP_EXCEEDED",
      status: "BLOCKED",
    };
  }

  // Rule 3: Unverified / non-whitelisted spender
  const normalizedSpender = (spender || "").toLowerCase();
  const isWhitelisted = WHITELISTED_ADDRESSES.some(
    (addr) => addr.toLowerCase() === normalizedSpender
  );
  if (!isWhitelisted) {
    return {
      isBlocked: true,
      risk: "UNVERIFIED_SPENDER",
      status: "BLOCKED",
    };
  }

  // Passed all checks
  return {
    isBlocked: false,
    risk: "NONE",
    status: "APPROVED",
  };
}

/**
 * Simulate (or actually send, if you go that far) a transfer on Base Sepolia.
 * For the hackathon demo, this just constructs a provider/wallet and can be
 * used to send a tiny testnet tx so the dashboard has a real BaseScan link.
 *
 * Requires NEXT_PUBLIC_RPC_URL and (for real sends) a funded PRIVATE_KEY
 * in your .env.local — never commit real private keys.
 */
async function simulateBaseSepoliaTransfer({ to, amountEth = "0.0001" }) {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // For a pure simulation (no real tx), just estimate gas / return a mock hash.
  // Uncomment the block below if you want to actually send a testnet tx.
  //
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // const txResponse = await wallet.sendTransaction({
  //   to,
  //   value: ethers.parseEther(amountEth),
  // });
  // const receipt = await txResponse.wait();
  // return { txHash: receipt.hash, status: "confirmed" };

  const network = await provider.getNetwork();
  return {
    txHash: "0xSIMULATED_" + Date.now().toString(16),
    network: network.name || "base-sepolia",
    status: "simulated",
  };
}

module.exports = {
  evaluateTransaction,
  simulateBaseSepoliaTransfer,
  MAX_UINT256,
  WHITELISTED_ADDRESSES,
  SPEND_CAP_USD,
};