"use client";

import React, { useRef, useEffect } from "react";
import type { ModelInfo } from "./data";

interface AiLabPromptBoxProps {
  promptText: string;
  onPromptChange: (text: string) => void;
  model: ModelInfo;
  onModelSwitch: () => void;
}

const contextTags = [
  { icon: "ti-world", label: "This workspace" },
  { icon: "ti-users", label: "Entire team" },
  { icon: "ti-clock", label: "Schedule" },
];

export default function AiLabPromptBox({ promptText, onPromptChange, model, onModelSwitch }: AiLabPromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 160) + "px";
    }
  }, [promptText]);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-b from-zinc-700/30 to-transparent rounded-2xl blur opacity-15 group-focus-within:opacity-40 transition duration-500"></div>
      <div className="relative bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden focus-within:border-zinc-600/80 transition-all duration-300 flex flex-col">

        {/* Context tags */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 flex-wrap">
          {contextTags.map((tag, i) => (
            <button
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/60 border border-zinc-800/60 text-[11px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
            >
              <i className={`ti ${tag.icon} text-[11px]`}></i>
              {tag.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="px-4 pb-2 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center shrink-0 mt-0.5">
            <i className="ti ti-sparkles text-zinc-400 text-sm"></i>
          </div>
          <textarea
            ref={textareaRef}
            placeholder="What should WorkVerse do next?"
            value={promptText}
            onChange={e => onPromptChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none resize-none min-h-[44px] max-h-[160px] text-[15px] text-zinc-100 placeholder:text-zinc-600 placeholder:font-medium leading-relaxed font-sans py-2"
            rows={1}
            autoFocus
          ></textarea>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-900/80 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors">
              <i className="ti ti-paperclip text-xs"></i>
            </button>
            <button className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors">
              <i className="ti ti-braces text-xs"></i>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onModelSwitch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/50 text-[11px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <i className="ti ti-cpu text-[11px]"></i>
              {model.name}
            </button>
            <button
              className="bg-white text-black text-[12px] font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              disabled={!promptText.trim()}
            >
              Execute
              <kbd className="hidden sm:inline-block font-mono text-[9px] opacity-50 ml-0.5">⌘↵</kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
