'use client';

import React from 'react';

interface Chip {
  icon: string;
  text: string;
}

interface AiLabsChipsProps {
  chips: Chip[];
  onSelect: (text: string) => void;
}

export function AiLabsChips({ chips, onSelect }: AiLabsChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3" role="group" aria-label="Suggested follow-ups">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => onSelect(chip.text)}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[11px] cursor-pointer transition-all duration-150"
          style={{
            background: '#141414',
            border: '0.5px solid rgba(255,255,255,0.1)',
            color: '#E0E0E0',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1A1A1A';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#141414';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <i className={`ti ${chip.icon} text-[12px]`} />
          {chip.text}
        </button>
      ))}
    </div>
  );
}
