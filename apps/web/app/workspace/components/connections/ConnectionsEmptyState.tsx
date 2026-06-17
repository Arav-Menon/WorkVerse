import React from "react";

interface ConnectionsEmptyStateProps {
  onClearFilters: () => void;
}

export default function ConnectionsEmptyState({ onClearFilters }: ConnectionsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
        <i className="ti ti-search text-zinc-600 text-2xl"></i>
      </div>
      <p className="text-[14px] font-semibold text-zinc-300 mb-1">No integrations found</p>
      <p className="text-[12px] text-zinc-500 mb-4">Try adjusting your search or filter criteria</p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-[12px] font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}
