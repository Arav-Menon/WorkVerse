'use client';

import React, { useEffect, useRef } from 'react';
import { initGame } from '../../lib/phaser/game';
import type Phaser from 'phaser';

interface InteractionData {
  type: string;
  targetId: string;
  tier: 'room' | 'object';
  prompt: string;
}

interface ArenaCanvasProps {
  spaceId: string;
  onInteraction?: (data: InteractionData) => void;
}

export default function ArenaCanvas({ spaceId, onInteraction }: ArenaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize game
    if (!gameRef.current) {
      gameRef.current = initGame(containerRef.current, spaceId);

      // Listen for interaction events from Phaser
      const scene = gameRef.current.scene.keys.ArenaScene as Phaser.Scene | undefined;
      if (scene) {
        scene.events.on('interaction-triggered', (data: InteractionData) => {
          onInteraction?.(data);
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [spaceId, onInteraction]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
