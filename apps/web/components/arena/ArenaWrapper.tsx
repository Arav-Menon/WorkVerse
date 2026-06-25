'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '../../hooks/use-current-user';
import { useOrganization } from '../../hooks/use-organization';
import { useWorkspace } from '../../hooks/use-workspaces';
import { ArenaHUD } from './ArenaHUD';
import { ArenaDock } from './ArenaDock';
import { ChatPanel, type ChatMessage } from './ChatPanel';
import { ParticipantsPanel } from './ParticipantsPanel';
import { AiLabsPanel } from './AiLabsPanel';
import type { SpaceUser } from '../../lib/phaser/types/arena.types';
import type { SpaceClient } from '../../lib/ws/space-client';

const ArenaCanvas = dynamic(() => import('./ArenaCanvas'), { ssr: false });

type PanelId = 'chat' | 'participants' | 'ai-labs' | null;

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
  orgName: orgNameProp,
  workspaceName: workspaceNameProp,
}: ArenaWrapperProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [token, setToken] = useState<string>('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [remoteUsers, setRemoteUsers] = useState<SpaceUser[]>([]);
  const spaceClientRef = useRef<SpaceClient | null>(null);

  const [activePanel, setActivePanel] = useState<PanelId>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const { data: org } = useOrganization(orgId ?? '');
  const { data: workspace } = useWorkspace(orgId ?? '', workspaceId ?? '');

  const orgName = orgNameProp ?? org?.name;
  const workspaceName = workspaceNameProp ?? workspace?.name;

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  const togglePanel = useCallback((panel: PanelId) => {
    setActivePanel(prev => prev === panel ? null : panel);
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

  const handleChatMessage = useCallback((data: { userId: string; chatMessage: string; timestamp: number; username: string; color: string }) => {
    setChatMessages(prev => {
      const msgId = `${data.userId}-${data.timestamp}`;
      const exists = prev.some(m => m.id === msgId);
      if (exists) return prev;
      const msg: ChatMessage = {
        id: msgId,
        userId: data.userId,
        username: data.username,
        color: data.color,
        text: data.chatMessage,
        timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: data.userId === user?.id,
      };
      return [...prev, msg];
    });
  }, [user?.id]);

  const handleChatHistory = useCallback((history: any[]) => {
    const messages: ChatMessage[] = history.map((entry: any) => ({
      id: `${entry.userId}-${entry.timestamp}`,
      userId: entry.userId,
      username: entry.username || 'Anonymous',
      color: entry.color || '#6366f1',
      text: entry.chatMessage,
      timestamp: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: entry.userId === user?.id,
    }));
    console.log(`[CHAT_HISTORY] Loaded ${messages.length} messages`);
    setChatMessages(messages);
  }, [user?.id]);

  const sendChatMessage = useCallback((text: string) => {
    spaceClientRef.current?.sendChat(text);
  }, []);

  const handleLeave = useCallback(() => {
    console.log(`[ArenaWrapper] Leave requested`);
    spaceClientRef.current?.leave();
    setTimeout(() => {
      if (orgId) {
        router.push(`/organization/${orgId}/workspaces`);
      } else {
        router.push('/home');
      }
    }, 200);
  }, [orgId, router]);

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
        onChatMessage={handleChatMessage}
        onChatHistory={handleChatHistory}
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
      />

      <ArenaDock
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isSharing={isSharing}
        isHandRaised={isHandRaised}
        onToggleMic={() => setIsMuted(p => !p)}
        onToggleVideo={() => setIsVideoOff(p => !p)}
        onToggleShare={() => setIsSharing(p => !p)}
        onToggleHand={() => setIsHandRaised(p => !p)}
        onOpenChat={() => togglePanel('chat')}
        onOpenParticipants={() => togglePanel('participants')}
        onOpenAiLabs={() => togglePanel('ai-labs')}
        onLeave={handleLeave}
      />

      {activePanel === 'chat' && (
        <ChatPanel
          isOpen={true}
          onClose={() => setActivePanel(null)}
          messages={chatMessages}
          onSendMessage={sendChatMessage}
          currentUserId={user.id}
        />
      )}
      {activePanel === 'participants' && (
        <ParticipantsPanel
          isOpen={true}
          onClose={() => setActivePanel(null)}
          users={remoteUsers}
          onlineCount={onlineCount}
        />
      )}
      {activePanel === 'ai-labs' && orgId && workspaceId && (
        <AiLabsPanel
          isOpen={true}
          onClose={() => setActivePanel(null)}
          workspaceId={workspaceId}
          spaceId={spaceId}
          organizationId={orgId}
          teamName={workspaceName}
        />
      )}
    </>
  );
}
