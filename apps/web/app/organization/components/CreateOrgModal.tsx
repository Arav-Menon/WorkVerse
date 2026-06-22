"use client";

import React, { useEffect, useRef } from "react";

type OrgColor = "purple" | "teal" | "coral" | "blue";

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  newOrgName: string;
  setNewOrgName: (val: string) => void;
  newOrgSlug: string;
  setNewOrgSlug: (val: string) => void;
  newOrgDesc: string;
  setNewOrgDesc: (val: string) => void;
  newOrgColor: OrgColor;
  setNewOrgColor: (val: OrgColor) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateOrgModal({
  isOpen,
  onClose,
  newOrgName,
  setNewOrgName,
  newOrgSlug,
  setNewOrgSlug,
  newOrgDesc,
  setNewOrgDesc,
  newOrgColor,
  setNewOrgColor,
  onSubmit,
  isSubmitting = false,
  error = null,
}: CreateOrgModalProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const slugManuallyEdited = useRef(false);

  useEffect(() => {
    if (isOpen) {
      nameInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewOrgName(value);
    if (!slugManuallyEdited.current) {
      setNewOrgSlug(slugify(value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    slugManuallyEdited.current = true;
    setNewOrgSlug(slugify(e.target.value));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-[6px] z-[1000] flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-org-title"
    >
      <div
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-[480px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-zinc-900 flex items-center justify-between">
          <span id="create-org-title" className="text-[11px] font-bold text-white uppercase tracking-wider select-none">
            Create new organization
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

        <form onSubmit={onSubmit} noValidate>
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

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                htmlFor="org-name"
              >
                Organization Name
              </label>
              <input
                ref={nameInputRef}
                id="org-name"
                type="text"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full disabled:opacity-50"
                placeholder="e.g. ClevenStudios"
                value={newOrgName}
                onChange={handleNameChange}
                required
                minLength={3}
                disabled={isSubmitting}
                aria-describedby="org-name-hint"
              />
              <span id="org-name-hint" className="text-[10px] text-zinc-600">
                Minimum 3 characters
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                htmlFor="org-slug"
              >
                Slug
              </label>
              <input
                id="org-slug"
                type="text"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full font-mono disabled:opacity-50"
                placeholder="e.g. clevenstudios"
                value={newOrgSlug}
                onChange={handleSlugChange}
                required
                minLength={3}
                disabled={isSubmitting}
                aria-describedby="org-slug-hint"
                pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
              />
              <span id="org-slug-hint" className="text-[10px] text-zinc-600">
                Lowercase letters, numbers, and hyphens only
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                htmlFor="org-desc"
              >
                Description
                <span className="text-zinc-700 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                id="org-desc"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full resize-none disabled:opacity-50"
                placeholder="e.g. Product design, strategy, and delivery for fast-moving teams."
                value={newOrgDesc}
                onChange={(e) => setNewOrgDesc(e.target.value)}
                maxLength={500}
                rows={3}
                disabled={isSubmitting}
                aria-describedby="org-desc-hint"
              />
              <span id="org-desc-hint" className="text-[10px] text-zinc-600">
                {newOrgDesc.length}/500 characters
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest"
                htmlFor="org-color"
              >
                Visual Branding Color
              </label>
              <select
                id="org-color"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2 px-3 text-xs outline-none transition-colors w-full cursor-pointer disabled:opacity-50"
                value={newOrgColor}
                onChange={(e) => setNewOrgColor(e.target.value as OrgColor)}
                disabled={isSubmitting}
              >
                <option value="purple">Purple Theme</option>
                <option value="teal">Teal Theme</option>
                <option value="coral">Coral Theme</option>
                <option value="blue">Blue Theme</option>
              </select>
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
              disabled={isSubmitting || !newOrgName.trim() || !newOrgSlug.trim()}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
