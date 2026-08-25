"use client";

import { useState } from "react";

export default function FeedbackPrompt({ txId, onSubmit }) {
  const [answer, setAnswer] = useState(null);

  const choose = (value) => {
    setAnswer(value);
    onSubmit?.(txId, value);
  };

  if (answer) {
    return (
      <div className="mt-3 text-xs text-[#7C8798] font-mono">
        Thanks — feedback logged ({answer === "yes" ? "made sense" : "confusing"}).
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3 border-t border-[#232B3A] pt-3">
      <span className="text-xs text-[#7C8798]">
        Did this alert make sense? Would you want this on your real wallet?
      </span>
      <div className="ml-auto flex gap-2 shrink-0">
        <button
          onClick={() => choose("yes")}
          className="text-xs px-2.5 py-1 rounded-md border border-[#232B3A] hover:border-[#22D3A5] hover:text-[#22D3A5] transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => choose("no")}
          className="text-xs px-2.5 py-1 rounded-md border border-[#232B3A] hover:border-[#FF4757] hover:text-[#FF4757] transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
}
