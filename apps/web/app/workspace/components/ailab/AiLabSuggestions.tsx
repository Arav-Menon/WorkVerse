"use client";

import React from "react";
import type { Suggestion } from "./data";

interface AiLabSuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}

export default function AiLabSuggestions({ suggestions, onSelect }: AiLabSuggestionsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 whitespace-nowrap mr-2">Suggestions</span>
      {suggestions.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item.text)}
          className="flex items-center gap-2 bg-zinc-950 border border-zinc-800/60 rounded-lg px-3.5 py-2 whitespace-nowrap hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors group/btn cursor-pointer"
        >
          <i className={`${item.icon} text-zinc-500 group-hover/btn:text-zinc-300 text-sm`}></i>
          <span className="text-[12px] font-medium">{item.text}</span>
        </button>
      ))}
    </div>
  );
}
