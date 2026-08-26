// app/api/explain-risk/route.js
//
// AgentShield — "Plain-English Explainer" API route
// Member 1: AI Agent & Explainer Lead
//
// Takes a raw blocked-transaction object and asks Groq (Llama 3) to turn it
// into a short, friendly, non-technical warning for the end user.
//
// Env var required (add to .env.local):
//   GROQ_API_KEY=gsk_...
//
// Test with:
//   curl -X POST http://localhost:3000/api/explain-risk \
//     -H "Content-Type: application/json" \
//     -d '{"token":"USDC","amount":"115792089237316195423570985008687907853269984665640564039457584007913129639935","spender":"0xHackerContractAddress","riskType":"UNLIMITED_ALLOWANCE"}'

import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // fast + free tier friendly

const SYSTEM_PROMPT = `You are AgentShield, a friendly but serious crypto security guard.
You are given details about a blockchain transaction that a security system has FLAGGED and BLOCKED.

Your job: explain in exactly 2 sentences, in plain English, why this was dangerous
and what was done about it. Rules:
- No jargon (avoid words like "allowance", "calldata", "spender contract" unless briefly explained).
- Assume the reader is a complete beginner who has never used crypto before.
- Be reassuring: make clear the system already blocked it and their funds are safe.
- Start the explanation with a relevant emoji (🚨 for critical, ⚠️ for medium risk).
- Respond ONLY with raw JSON, no markdown, no code fences, no extra text.

Output format (exactly these keys, nothing else):
{
  "plainEnglish": "<your 2-sentence explanation here>"
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, amount, spender, riskType, amountUSD } = body || {};

    // Basic validation — fail loudly and clearly rather than silently guessing
    if (!token || !spender || !riskType) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Expecting: token, amount, spender, riskType.",
        },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: GROQ_API_KEY is not set." },
        { status: 500 }
      );
    }

    const userMessage = `Blocked transaction details:
- Token: ${token}
- Amount: ${amount ?? "unknown"}
- Spender / contract address: ${spender}
- Risk type: ${riskType}
${amountUSD ? `- Amount in USD: $${amountUSD}` : ""}

Explain this to a non-technical user in exactly 2 sentences, following the JSON output format.`;

    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.4,
        max_tokens: 200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text().catch(() => "");
      console.error("Groq API error:", groqResponse.status, errText);
      return NextResponse.json(
        {
          error: "AI explainer service failed.",
          plainEnglish: fallbackExplanation(riskType),
        },
        { status: 502 }
      );
    }

    const data = await groqResponse.json();
    const rawText = data?.choices?.[0]?.message?.content?.trim() ?? "";

    let parsed;
    try {
      // Strip accidental markdown code fences just in case the model adds them
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Groq response as JSON:", rawText);
      return NextResponse.json({
        plainEnglish: fallbackExplanation(riskType),
        warning: "AI response was not valid JSON; used fallback explanation.",
      });
    }

    if (!parsed.plainEnglish) {
      return NextResponse.json({
        plainEnglish: fallbackExplanation(riskType),
        warning: "AI response missing plainEnglish field; used fallback.",
      });
    }

    return NextResponse.json({ plainEnglish: parsed.plainEnglish });
  } catch (err) {
    console.error("explain-risk route error:", err);
    return NextResponse.json(
      {
        error: "Unexpected server error.",
        plainEnglish: fallbackExplanation(),
      },
      { status: 500 }
    );
  }
}

// Simple hardcoded fallback so the demo never breaks on stage, even if the
// AI call fails or the API key runs out of quota mid-hackathon.
function fallbackExplanation(riskType) {
  switch (riskType) {
    case "CRITICAL_UNLIMITED_ALLOWANCE":
    case "UNLIMITED_ALLOWANCE":
      return "🚨 Warning: Your AI agent tried to give permanent, unlimited access to all your tokens to an unknown contract. We blocked this to prevent your wallet from being drained.";
    case "SPEND_CAP_EXCEEDED":
      return "⚠️ Warning: This transaction tried to spend more than your allowed limit. We blocked it to keep your funds safe.";
    case "UNVERIFIED_SPENDER":
      return "⚠️ Warning: This transaction was sent to an address we don't recognize as safe. We blocked it until you can verify it yourself.";
    default:
      return "🚨 Warning: A risky transaction was blocked by AgentShield before it could affect your wallet.";
  }
}
