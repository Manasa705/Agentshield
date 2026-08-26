// app/api/run-trade/route.js
//
// This is the piece Member 4 (you) actually owns long-term: it's the
// bridge between the dashboard buttons and the real backend, so testers
// never need a wallet. It builds a fake transaction payload for the
// scenario picked, runs it through the security check, and — if
// blocked — asks the explainer for plain-English copy.
//
// Nothing here changes when Member 1 / Member 2 swap in their real
// logic, since it only imports the two functions below.

import { evaluateTransaction, simulateOnChainTransfer } from "@/lib/securityChecker";

const SCENARIOS = {
  safe: {
    token: "USDC",
    amount: "2",
    amountUSD: 2,
    spender: "0xUniswapRouterV3",
  },
  drainer: {
    token: "USDC",
    amount:
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    amountUSD: 0,
    spender: "0xHackerContractAddress",
    riskType: "UNLIMITED_ALLOWANCE",
  },
  overspend: {
    token: "USDC",
    amount: "100",
    amountUSD: 100,
    spender: "0xUniswapRouterV3",
  },
};

export async function POST(request) {
  try {
    const { scenario } = await request.json();
    const tx = SCENARIOS[scenario];

    if (!tx) {
      return Response.json({ error: "Unknown scenario" }, { status: 400 });
    }

    const result = evaluateTransaction(tx);
    const txId = crypto.randomUUID();

    if (result.isBlocked) {
      // Ask the explainer for plain-English copy.
      // In prod this hits the real Groq/Gemini route; for now it's
      // served by the local mock at the same path.
      const explainRes = await fetch(
        new URL("/api/explain-risk", request.url),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...tx, riskType: result.risk }),
        }
      );
      const { plainEnglish } = await explainRes.json();

      return Response.json({
        txId,
        isBlocked: true,
        risk: result.risk,
        plainEnglish,
        token: tx.token,
        amountUSD: tx.amountUSD,
        spender: tx.spender,
      });
    }

    const onChain = await simulateOnChainTransfer(tx);
    return Response.json({
      txId,
      isBlocked: false,
      status: "APPROVED",
      token: tx.token,
      amountUSD: tx.amountUSD,
      txHash: onChain.txHash,
    });
  } catch (err) {
    return Response.json({ error: "Trade execution failed" }, { status: 500 });
  }
}
