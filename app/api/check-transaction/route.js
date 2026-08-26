// app/api/check-transaction/route.js
//
// Accepts a raw transaction object, runs it through the security checker,
// and returns an InspectedTransaction result ready for the activity feed.

import { evaluateTransaction, simulateOnChainTransfer } from "@/lib/securityChecker";

export async function POST(request) {
  try {
    const tx = await request.json();

    if (!tx || typeof tx !== "object") {
      return Response.json({ error: "Invalid transaction object" }, { status: 400 });
    }

    const result = evaluateTransaction(tx);
    const txId = crypto.randomUUID();

    if (result.isBlocked) {
      // Get plain-English explanation from the explainer route
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
        token: tx.token ?? "USDC",
        amountUSD: tx.amountUSD ?? 0,
        spender: tx.spender ?? "unknown",
      });
    }

    const onChain = await simulateOnChainTransfer(tx);

    return Response.json({
      txId,
      isBlocked: false,
      status: "APPROVED",
      token: tx.token ?? "USDC",
      amountUSD: tx.amountUSD ?? 0,
      txHash: onChain.txHash,
    });
  } catch (err) {
    console.error("check-transaction error:", err);
    return Response.json({ error: "Transaction check failed" }, { status: 500 });
  }
}
