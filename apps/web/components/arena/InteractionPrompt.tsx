'use client';

import React from 'react';

interface InteractionPromptProps {
  visible: boolean;
  prompt: string;
  x: number;
  y: number;
}

export function InteractionPrompt({ visible, prompt, x, y }: InteractionPromptProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${x}px`,
        top: `${y - 50}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transition: 'opacity 120ms ease-out',
      }}
    >
      <div className="flex items-center gap-2 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg px-3 py-2 shadow-xl shadow-black/40">
        {/* Keycap */}
        <kbd className="flex items-center justify-center bg-zinc-800 border border-zinc-600 rounded px-2 py-0.5 text-[9px] font-bold text-zinc-400 font-mono min-w-[40px]">
          SPACE
        </kbd>
        {/* Prompt text */}
        <span className="text-[11px] font-medium text-zinc-300">{prompt}</span>
      </div>
    </div>
  );
}
