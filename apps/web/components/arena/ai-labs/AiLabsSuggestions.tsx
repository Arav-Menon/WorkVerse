'use client';

import React from 'react';

interface Suggestion {
  icon: string;
  text: string;
}

interface AiLabsSuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
}

export function AiLabsSuggestions({ suggestions, onSelect }: AiLabsSuggestionsProps) {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Suggestions</h3>
      <div className="space-y-1.5">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSelect(suggestion.text)}
            className="w-full text-left flex items-center gap-2.5 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-white/20 rounded-lg px-3 py-2 transition-all duration-150"
          >
            <i className={`ti ${suggestion.icon} text-zinc-500`} />
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
