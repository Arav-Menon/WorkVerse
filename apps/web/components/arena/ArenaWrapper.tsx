'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCurrentUser } from '../../hooks/use-current-user';
import { ArenaHUD } from './ArenaHUD';
import { BottomNavBar } from './BottomNavBar';
import type { SpaceUser } from '../../lib/phaser/types/arena.types';
import type { SpaceClient } from '../../lib/ws/space-client';

const ArenaCanvas = dynamic(() => import('./ArenaCanvas'), { ssr: false });

interface InteractionData {
  type: string;
  targetId: string;
  tier: 'room' | 'object';
  prompt: string;
}

interface ArenaWrapperProps {
  spaceId: string;
  orgId?: string;
  workspaceId?: string;
  orgName?: string;
  workspaceName?: string;
}

export function ArenaWrapper({
  spaceId,
  orgId,
  workspaceId,
  orgName,
  workspaceName,
}: ArenaWrapperProps) {
  const { user } = useCurrentUser();
  const [token, setToken] = useState<string>('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [remoteUsers, setRemoteUsers] = useState<SpaceUser[]>([]);
  const spaceClientRef = useRef<SpaceClient | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  const handleInteraction = useCallback((data: InteractionData) => {
    switch (data.tier) {
      case 'room':
        console.log(`[Interaction] Room: ${data.type} -> ${data.targetId}`);
        break;
      case 'object':
        console.log(`[Interaction] Object: ${data.type} -> ${data.targetId}`);
        break;
    }
  }, []);

  const handleOnlineCountChange = useCallback((count: number) => {
    setOnlineCount(count);
  }, []);

  const handleLeave = useCallback(() => {
    console.log(`[ArenaWrapper] Leave requested`);
    spaceClientRef.current?.leave();
  }, []);

  if (!user || !token) return null;

  return (
    <>
      <ArenaCanvas
        spaceId={spaceId}
        userId={user.id}
        token={token}
        organizationId={orgId || ''}
        workspaceId={workspaceId || spaceId}
        onInteraction={handleInteraction}
        onOnlineCountChange={handleOnlineCountChange}
        onUsersChange={setRemoteUsers}
        spaceClientRef={spaceClientRef}
      />
      <ArenaHUD
        spaceId={spaceId}
        orgId={orgId}
        workspaceId={workspaceId}
        orgName={orgName}
        workspaceName={workspaceName}
        onlineCount={onlineCount}
        onlineUsers={remoteUsers}
        onLeave={handleLeave}
      />
      <BottomNavBar />
    </>
  );
}
