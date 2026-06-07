'use client';

import React, { useEffect, useRef, useState } from 'react';
import { initGame } from '../../lib/phaser/game';
import type Phaser from 'phaser';

interface ArenaCanvasProps {
  spaceId: string;
}

export default function ArenaCanvas({ spaceId }: ArenaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize game
    if (!gameRef.current) {
      gameRef.current = initGame(containerRef.current, spaceId);
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [spaceId]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden" 
      style={{ zIndex: 0 }}
    />
  );
}
