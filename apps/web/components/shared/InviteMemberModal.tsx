"use client";

import React, { useState, useEffect, useRef } from "react";
import type { FetchOrganization } from "@/lib/api/org.api";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  organizations: FetchOrganization[];
  preselectedOrgId?: string;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  success,
  organizations = [],
  preselectedOrgId,
}: InviteMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [manualOrgId, setManualOrgId] = useState("");
  const effectiveOrgId =
    preselectedOrgId ||
    (organizations.length === 1 ? organizations[0]?.id : "") ||
    manualOrgId;

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setManualOrgId("");
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const canSubmit = effectiveOrgId && name.trim() && email.trim() && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-[6px] z-[1000] flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-member-title"
    >
      <div
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-[480px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-zinc-900 flex items-center justify-between">
          <span id="invite-member-title" className="text-[11px] font-bold text-white uppercase tracking-wider select-none">
            Invite member
          </span>
          <button
            className="text-zinc-500 hover:text-white transition-colors text-base cursor-pointer"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 flex flex-col gap-4">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
              >
                <i className="ti ti-alert-circle mt-0.5 shrink-0" aria-hidden="true"></i>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
              >
                <i className="ti ti-check mt-0.5 shrink-0" aria-hidden="true"></i>
                <span>Invite sent successfully! The member will receive an email with the invite link.</span>
              </div>
            )}

            {organizations.length > 1 && !preselectedOrgId && (
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                  htmlFor="invite-org"
                >
                  Organization
                </label>
                <select
                  id="invite-org"
                  className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2 px-3 text-xs outline-none transition-colors w-full cursor-pointer disabled:opacity-50"
                  value={manualOrgId}
                  onChange={(e) => setManualOrgId(e.target.value)}
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>Select an organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}

            {effectiveOrgId && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-950 border border-zinc-900 text-xs">
                <i className="ti ti-building text-zinc-500"></i>
                <span className="text-zinc-300 font-medium">
                  {organizations.find((o) => o.id === effectiveOrgId)?.name || "Organization"}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                htmlFor="invite-name"
              >
                Name
              </label>
              <input
                ref={nameInputRef}
                id="invite-name"
                type="text"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full disabled:opacity-50"
                placeholder="e.g. Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                htmlFor="invite-email"
              >
                Email
              </label>
              <input
                id="invite-email"
                type="email"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full disabled:opacity-50"
                placeholder="e.g. sarah@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <footer className="p-4 px-5 border-t border-zinc-900 flex items-center justify-end gap-2.5 bg-zinc-950/40">
            <button
              type="button"
              className="p-2 px-4 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white border border-zinc-900 transition-colors cursor-pointer disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 px-4 text-xs font-bold rounded-lg text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.08)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Invite"
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
