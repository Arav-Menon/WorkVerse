import React from "react";
import type { ModelInfo } from "./data";

interface AiLabUsageProps {
  model: ModelInfo;
}

export default function AiLabUsage({ model }: AiLabUsageProps) {
  const usagePercent = (model.tokensUsed / model.tokenLimit) * 100;
  const remaining = model.tokenLimit - model.tokensUsed;

  const limits = [
    { label: "Tokens remaining", value: remaining.toLocaleString(), icon: "ti ti-adjustments" },
    { label: "Requests today", value: "847", icon: "ti ti-zap" },
    { label: "Avg latency", value: "1.2s", icon: "ti ti-clock" },
  ];

  return (
    <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-gauge text-emerald-400"></i>
          Usage & Limits
        </h3>
        <span className="text-[10px] text-zinc-600 font-mono">Resets in 12d</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {limits.map((limit, i) => (
          <div key={i} className="bg-zinc-950/50 border border-zinc-900/60 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <i className={`${limit.icon} text-zinc-500 text-[11px]`}></i>
              <p className="text-[10px] text-zinc-500 font-medium">{limit.label}</p>
            </div>
            <p className="text-[16px] font-bold text-zinc-200 leading-none">{limit.value}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${usagePercent > 80 ? "bg-amber-500" : "bg-emerald-500"}`} />
          <span className="text-[12px] text-zinc-400">
            {usagePercent > 80 ? "Approaching token limit" : "Usage within normal range"}
          </span>
        </div>
      </div>
    </div>
  );
}
