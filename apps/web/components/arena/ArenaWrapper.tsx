'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';

const ArenaCanvas = dynamic(() => import('./ArenaCanvas'), { ssr: false });

interface InteractionData {
  type: string;
  targetId: string;
  tier: 'room' | 'object';
  prompt: string;
}

interface ArenaWrapperProps {
  spaceId: string;
}

export function ArenaWrapper({ spaceId }: ArenaWrapperProps) {
  const handleInteraction = useCallback((data: InteractionData) => {
    // Handle different interaction types
    switch (data.tier) {
      case 'room':
        // Room-level interactions: open modal/panel
        console.log(`[Interaction] Room: ${data.type} -> ${data.targetId}`);
        // Future: open meeting room modal, AI workspace panel, etc.
        break;
      case 'object':
        // Object-level interactions: open lightweight overlay
        console.log(`[Interaction] Object: ${data.type} -> ${data.targetId}`);
        // Future: open desk view, whiteboard, project board, etc.
        break;
    }
  }, []);

  return (
    <ArenaCanvas spaceId={spaceId} onInteraction={handleInteraction} />
  );
}
