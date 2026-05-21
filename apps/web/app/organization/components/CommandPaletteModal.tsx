"use client";

import React, { useRef, useEffect } from "react";

interface Command {
  name: string;
  sub: string;
  icon: string;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmdSearch: string;
  setCmdSearch: (val: string) => void;
  filteredCommands: Command[];
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  cmdSearch,
  setCmdSearch,
  filteredCommands,
}: CommandPaletteModalProps) {
  const cmdInputRef = useRef<HTMLInputElement>(null);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cmdInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/85 backdrop-blur-[6px] z-[1000] flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-[540px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-5 border-b border-zinc-900">
          <i className="ti ti-search text-zinc-500" aria-hidden="true"></i>
          <input 
            ref={cmdInputRef}
            type="text" 
            className="bg-transparent border-none outline-none text-white text-[13px] flex-1 placeholder-zinc-650" 
            placeholder="Type a command or search workspaces…"
            value={cmdSearch}
            onChange={(e) => setCmdSearch(e.target.value)}
          />
          <kbd className="font-mono text-[9px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900 select-none">ESC</kbd>
        </div>

        <div className="max-h-[280px] overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button 
                key={cmd.name}
                className="flex items-center gap-3 p-2.5 px-4 rounded-lg text-left w-full text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors group cursor-pointer"
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
              >
                <i className={`ti ${cmd.icon} text-[15px] text-zinc-400 group-hover:text-white`} aria-hidden="true"></i>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-zinc-200 group-hover:text-white text-xs truncate">{cmd.name}</div>
                  <div className="text-[10px] text-zinc-550 mt-0.5 truncate">{cmd.sub}</div>
                </div>
                <span className="ml-auto font-mono text-[9px] text-zinc-600">↵ ENTER</span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-zinc-600">
              No commands matched your query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
