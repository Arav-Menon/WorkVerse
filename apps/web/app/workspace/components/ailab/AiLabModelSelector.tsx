import React from "react";
import type { ModelInfo } from "./data";

interface AiLabModelSelectorProps {
  model: ModelInfo;
  onSwitch: () => void;
}

export default function AiLabModelSelector({ model, onSwitch }: AiLabModelSelectorProps) {
  const usagePercent = (model.tokensUsed / model.tokenLimit) * 100;

  return (
    <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-cpu text-blue-400"></i>
          Active Model
        </h3>
        <button
          onClick={onSwitch}
          className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Switch
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
          <i className="ti ti-brain text-blue-400 text-lg"></i>
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-[14px] font-bold text-zinc-100">{model.name}</p>
          <p className="text-[12px] text-zinc-500">{model.provider}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[14px] font-bold text-zinc-100">{model.costThisMonth}</p>
          <p className="text-[11px] text-zinc-500">this month</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-zinc-500">Token usage</span>
          <span className="text-[11px] text-zinc-400 font-mono">{model.tokensUsed.toLocaleString()} / {model.tokenLimit.toLocaleString()}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
