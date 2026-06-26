"use client";

import React, { useEffect, useRef } from "react";

interface DisconnectConfirmModalProps {
  isOpen: boolean;
  providerName: string;
  providerIcon: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function DisconnectConfirmModal({
  isOpen,
  providerName,
  providerIcon,
  onConfirm,
  onCancel,
  isPending,
}: DisconnectConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-[6px] z-[1000] flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={!isPending ? onCancel : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disconnect-modal-title"
    >
      <div
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-[480px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-zinc-900 flex items-center justify-between">
          <span id="disconnect-modal-title" className="text-[11px] font-bold text-white uppercase tracking-wider select-none">
            Disconnect Integration
          </span>
          <button
            className="text-zinc-500 hover:text-white transition-colors text-base cursor-pointer"
            onClick={!isPending ? onCancel : undefined}
            aria-label="Close modal"
            type="button"
            disabled={isPending}
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </header>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <i className={`ti ${providerIcon} text-zinc-200 text-xl`} aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-zinc-100">
                Disconnect {providerName}?
              </h3>
            </div>
          </div>
          <p className="text-[13px] text-zinc-400 leading-relaxed">
            This organization will lose access to {providerName} repositories, workflows, automations, and MCP actions using this integration.
          </p>
        </div>

        <footer className="p-4 px-5 border-t border-zinc-900 flex items-center justify-end gap-2.5 bg-zinc-950/40">
          <button
            type="button"
            className="p-2 px-4 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white border border-zinc-900 transition-colors cursor-pointer disabled:opacity-50"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="p-2 px-4 text-xs font-bold rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Disconnecting...
              </>
            ) : (
              "Disconnect"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
