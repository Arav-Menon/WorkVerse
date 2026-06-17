import React from "react";
import type { FilterPill } from "./data";

interface ConnectionsFilterPillsProps {
  pills: FilterPill[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ConnectionsFilterPills({ pills, activeFilter, onFilterChange }: ConnectionsFilterPillsProps) {
  return (
    <div className="flex items-center gap-1.5 mb-8 flex-wrap">
      {pills.map(pill => (
        <button
          key={pill.name}
          className={`flex items-center gap-1.5 p-1.5 px-3 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${
            activeFilter === pill.name
              ? "bg-zinc-900 border-zinc-800 text-white"
              : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
          }`}
          onClick={() => onFilterChange(pill.name)}
        >
          <span className={`w-1 h-1 rounded-full shrink-0 ${pill.dot}`} />
          {pill.name}
        </button>
      ))}
    </div>
  );
}
