'use client';

import React, { useEffect, useRef } from 'react';
import { initGame } from '../../lib/phaser/game';
import { SpaceClient } from '../../lib/ws/space-client';
import { env } from '../../lib/config/env';
import type Phaser from 'phaser';
import type { ArenaScene } from '../../lib/phaser/scenes/ArenaScene';
import type { SpaceUser } from '../../lib/phaser/types/arena.types';
import type { ProximityWebRTCManager } from '../../lib/webrtc/proximity-manager';
import type { ProximityUser } from '../../lib/phaser/systems/ProximitySystem';

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
  proximityManager?: ProximityWebRTCManager | null;
  onInteraction?: (data: InteractionData) => void;
  onAvatarClicked?: (data: { userId: string; username: string; screenX: number; screenY: number }) => void;
  onOnlineCountChange?: (count: number) => void;
  onUsersChange?: (users: SpaceUser[]) => void;
  onChatMessage?: (data: { userId: string; chatMessage: string; timestamp: number; username: string; color: string }) => void;
  onChatHistory?: (history: any[]) => void;
  onProximityChange?: (users: ProximityUser[]) => void;
  spaceClientRef?: React.MutableRefObject<SpaceClient | null>;
}

export default function ArenaCanvas({
  spaceId,
  userId,
  token,
  organizationId,
  workspaceId,
  proximityManager,
  onInteraction,
  onAvatarClicked,
  onOnlineCountChange,
  onUsersChange,
  onChatMessage,
  onChatHistory,
  onProximityChange,
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
      onSpaceState: (users, chatHistory) => {
        const scene = gameRef.current?.scene.getScene('ArenaScene') as unknown as ArenaScene | undefined;
        scene?.handleSpaceState(users);
        onUsersChange?.(users.filter(u => u.userId !== userId));
        if (chatHistory && chatHistory.length > 0) {
          console.log(`[CHAT_HISTORY] Loaded ${chatHistory.length} messages from SPACE_STATE`);
          onChatHistory?.(chatHistory);
        }
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
      onChatMessage: (data) => {
        onChatMessage?.(data);
      },
      onOnlineCount: (count) => {
        onOnlineCountChange?.(count);
      },
    });

    if (spaceClientRef) {
      spaceClientRef.current = spaceClient;
    }

    if (!gameRef.current) {
      gameRef.current = initGame(containerRef.current, spaceId, userId, spaceClient, proximityManager, onAvatarClicked, onProximityChange);

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
