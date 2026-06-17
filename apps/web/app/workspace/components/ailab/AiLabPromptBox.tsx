import React from "react";
import type { ModelInfo } from "./data";

interface AiLabPromptBoxProps {
  promptText: string;
  onPromptChange: (text: string) => void;
  model: ModelInfo;
  onModelSwitch: () => void;
}

export default function AiLabPromptBox({ promptText, onPromptChange, model, onModelSwitch }: AiLabPromptBoxProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-b from-zinc-800 to-transparent rounded-[22px] blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
      <div className="relative bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden focus-within:border-zinc-600 transition-colors flex flex-col">

        <div className="p-6 md:p-8 flex items-start gap-4">
          <i className="ti ti-sparkles text-zinc-500 text-xl mt-1.5"></i>
          <textarea
            placeholder="What should WorkVerse do next?"
            value={promptText}
            onChange={e => onPromptChange(e.target.value)}
            className="w-full bg-transparent border-none outline-none resize-none h-16 md:h-20 text-xl md:text-2xl text-zinc-100 placeholder:text-zinc-700 placeholder:font-medium leading-relaxed font-sans"
            autoFocus
          ></textarea>
        </div>

        {/* Action Modifiers & Submit */}
        <div className="bg-zinc-950/60 border-t border-zinc-900/80 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {["@mention", "#room", "/workflow", "/doc"].map(tag => (
              <button key={tag} className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                {tag}
              </button>
            ))}
            <button className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
              <i className="ti ti-paperclip text-[13px]"></i>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onModelSwitch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/50 text-[11px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <i className="ti ti-cpu text-[12px]"></i>
              {model.name}
            </button>
            <button className="bg-white text-black text-[13px] font-bold px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Execute <kbd className="hidden sm:inline-block font-mono text-[10px] opacity-60 ml-1">↵</kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
