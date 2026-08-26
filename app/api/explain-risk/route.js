// app/api/explain-risk/route.js
//
// ⚠️ TEMP MOCK — built by Member 4 so the dashboard isn't blocked.
// Member 1 owns this file for real (Groq/Gemini call). When their
// version is ready, replace this file 1:1 — same request body,
// same response shape — nothing else in the app needs to change.

const EXPLANATIONS = {
  CRITICAL_UNLIMITED_ALLOWANCE: (tx) =>
    `🚨 Warning: Your AI agent tried to give permanent, unlimited access to all your ${tx.token} to an unknown smart contract. We blocked this to prevent your wallet from being drained.`,
  SPEND_CAP_EXCEEDED: (tx) =>
    `🚨 Warning: Your AI agent tried to send $${tx.amountUSD ?? "100"} ${tx.token ?? "USDC"}, which exceeds your $10 safety limit. We blocked this to keep your spending in check.`,
  UNVERIFIED_SPENDER: (tx) =>
    `🚨 Warning: Your AI agent tried to send funds to a contract we don't recognize as safe. We blocked this until you can verify it yourself.`,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { riskType } = body;

    const generate = EXPLANATIONS[riskType];
    const plainEnglish = generate
      ? generate(body)
      : `🚨 Warning: This transaction looked risky, so we blocked it to keep your wallet safe.`;

    return Response.json({ plainEnglish });
  } catch (err) {
    return Response.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
