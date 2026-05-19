"use client";

import React from "react";

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  newOrgName: string;
  setNewOrgName: (val: string) => void;
  newOrgDesc: string;
  setNewOrgDesc: (val: string) => void;
  newOrgColor: "purple" | "teal" | "coral" | "blue";
  setNewOrgColor: (val: "purple" | "teal" | "coral" | "blue") => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateOrgModal({
  isOpen,
  onClose,
  newOrgName,
  setNewOrgName,
  newOrgDesc,
  setNewOrgDesc,
  newOrgColor,
  setNewOrgColor,
  onSubmit,
}: CreateOrgModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/85 backdrop-blur-[6px] z-[1000] flex items-center justify-center p-4 transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-[480px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-zinc-900 flex items-center justify-between">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider select-none">Create new organization</span>
          <button 
            className="text-zinc-500 hover:text-white transition-colors text-base cursor-pointer" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </header>

        <form onSubmit={onSubmit}>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest" htmlFor="org-name">Organization Name</label>
              <input 
                id="org-name"
                type="text" 
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full" 
                placeholder="e.g. ClevenStudios"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest" htmlFor="org-desc">Description</label>
              <input 
                id="org-desc"
                type="text" 
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2.5 px-3.5 text-xs outline-none transition-colors w-full" 
                placeholder="e.g. Product design & development"
                value={newOrgDesc}
                onChange={(e) => setNewOrgDesc(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest" htmlFor="org-color">Visual Branding Color</label>
              <select 
                id="org-color"
                className="bg-zinc-950 border border-zinc-900 focus:border-zinc-700 text-white rounded-lg p-2 px-3 text-xs outline-none transition-colors w-full cursor-pointer"
                value={newOrgColor}
                onChange={(e) => setNewOrgColor(e.target.value as CreateOrgModalProps["newOrgColor"])}
              >
                <option value="purple">Purple Theme (Cleven)</option>
                <option value="teal">Teal Theme (Nexa)</option>
                <option value="coral">Coral Theme (Forge)</option>
                <option value="blue">Blue Theme (Axiom)</option>
              </select>
            </div>
          </div>

          <footer className="p-4 px-5 border-t border-zinc-900 flex items-center justify-end gap-2.5 bg-zinc-950/40">
            <button 
              type="button" 
              className="p-2 px-4 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white border border-zinc-900 transition-colors cursor-pointer" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="p-2 px-4 text-xs font-bold rounded-lg text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.08)]"
            >
              Launch Workspace
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
