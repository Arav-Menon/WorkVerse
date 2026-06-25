'use client';

import React, { useEffect, useRef } from 'react';
import { initGame } from '../../lib/phaser/game';
import { SpaceClient } from '../../lib/ws/space-client';
import { env } from '../../lib/config/env';
import type Phaser from 'phaser';
import type { ArenaScene } from '../../lib/phaser/scenes/ArenaScene';
import type { SpaceUser } from '../../lib/phaser/types/arena.types';

interface InteractionData {
  type: string;
  targetId: string;
  tier: 'room' | 'object';
  prompt: string;
}

interface ArenaCanvasProps {
  spaceId: string;
  userId: string;
  token: string;
  organizationId: string;
  workspaceId: string;
  onInteraction?: (data: InteractionData) => void;
  onOnlineCountChange?: (count: number) => void;
  onUsersChange?: (users: SpaceUser[]) => void;
  spaceClientRef?: React.MutableRefObject<SpaceClient | null>;
}

export default function ArenaCanvas({
  spaceId,
  userId,
  token,
  organizationId,
  workspaceId,
  onInteraction,
  onOnlineCountChange,
  onUsersChange,
  spaceClientRef,
}: ArenaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const spaceClient = new SpaceClient({
      wsUrl: env.SPACE_WS_URL,
      token,
      userId,
      organizationId,
      workspaceId,
      spaceId,
      onSpaceState: (users) => {
        const scene = gameRef.current?.scene.getScene('ArenaScene') as unknown as ArenaScene | undefined;
        scene?.handleSpaceState(users);
        onUsersChange?.(users.filter(u => u.userId !== userId));
      },
      onUserJoined: (user) => {
        const scene = gameRef.current?.scene.getScene('ArenaScene') as unknown as ArenaScene | undefined;
        scene?.handleUserJoined(user);
      },
      onUserLeft: (uid) => {
        const scene = gameRef.current?.scene.getScene('ArenaScene') as unknown as ArenaScene | undefined;
        scene?.handleUserLeft(uid);
      },
      onPlayerMoved: (uid, pos) => {
        const scene = gameRef.current?.scene.getScene('ArenaScene') as unknown as ArenaScene | undefined;
        scene?.handlePlayerMoved(uid, pos);
      },
      onOnlineCount: (count) => {
        onOnlineCountChange?.(count);
      },
    });

    // Expose spaceClient to parent via ref
    if (spaceClientRef) {
      spaceClientRef.current = spaceClient;
    }

    if (!gameRef.current) {
      gameRef.current = initGame(containerRef.current, spaceId, userId, spaceClient);

      const scene = gameRef.current.scene.keys.ArenaScene as Phaser.Scene | undefined;
      if (scene) {
        scene.events.on('interaction-triggered', (data: InteractionData) => {
          onInteraction?.(data);
        });
      }
    }

    spaceClient.connect();

    return () => {
      spaceClient.disconnect();
      if (spaceClientRef) {
        spaceClientRef.current = null;
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [spaceId, userId, token, organizationId, workspaceId]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
