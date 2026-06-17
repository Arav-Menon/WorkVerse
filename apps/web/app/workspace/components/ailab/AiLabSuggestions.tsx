import React from "react";
import type { Suggestion } from "./data";

interface AiLabSuggestionsProps {
  suggestions: Suggestion[];
}

export default function AiLabSuggestions({ suggestions }: AiLabSuggestionsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap mr-2">Suggestions</span>
      {suggestions.map((item, i) => (
        <button key={i} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800/60 rounded-lg px-3 py-1.5 whitespace-nowrap hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors group/btn">
          <i className={`${item.icon} text-zinc-500 group-hover/btn:text-zinc-300 text-sm`}></i>
          <span className="text-[11px] font-medium">{item.text}</span>
        </button>
      ))}
    </div>
  );
}
