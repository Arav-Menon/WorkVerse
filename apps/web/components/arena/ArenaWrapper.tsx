'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '../../hooks/use-current-user';
import { useOrganization } from '../../hooks/use-organization';
import { useWorkspace } from '../../hooks/use-workspaces';
import { useWebRTC } from '../../hooks/use-webrtc';
import { useCallManager, type CallState } from '../../hooks/use-call-manager';
import { useDm } from '../../hooks/use-dm';
import { toast } from 'sonner';
import { env } from '../../lib/config/env';
import { ArenaHUD } from './ArenaHUD';
import { ArenaDock } from './ArenaDock';
import { ChatPanel, type ChatMessage } from './ChatPanel';
import { ParticipantsPanel } from './ParticipantsPanel';
import { AiLabsPanel } from './AiLabsPanel';
import { AvatarContextMenu } from './AvatarContextMenu';
import { DirectMessagePanel } from './DirectMessagePanel';
import { IncomingCallModal } from './IncomingCallModal';
import { VideoCallOverlay } from './VideoCallOverlay';
import { LocalVideoPreview } from './LocalVideoPreview';
import { ProximityPopup } from './ProximityPopup';
import type { SpaceUser } from '../../lib/phaser/types/arena.types';
import type { SpaceClient } from '../../lib/ws/space-client';
import type { ProximityWebRTCManager } from '../../lib/webrtc/proximity-manager';
import type { ProximityUser } from '../../lib/phaser/systems/ProximitySystem';

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
  const proximityManagerRef = useRef<ProximityWebRTCManager | null>(null);

  const [activePanel, setActivePanel] = useState<PanelId>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [contextMenu, setContextMenu] = useState<{
    userId: string;
    username: string;
    userColor?: string;
    x: number;
    y: number;
  } | null>(null);

  const [dmTarget, setDmTarget] = useState<{
    userId: string;
    username: string;
  } | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const prevCallStateRef = useRef<CallState>('idle');
  const mediaSetupCompleteRef = useRef(false);

  const [nearbyUsers, setNearbyUsers] = useState<ProximityUser[]>([]);
  const ignoredUsersRef = useRef<Set<string>>(new Set());

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const openDmRef = useRef<(userId: string, username: string) => void>(() => {});

  const { data: org } = useOrganization(orgId ?? '');
  const { data: workspace } = useWorkspace(orgId ?? '', workspaceId ?? '');

  const orgName = orgNameProp ?? org?.name;
  const workspaceName = workspaceNameProp ?? workspace?.name;

  const dm = useDm({
    organizationId: orgId || '',
    currentUserId: user?.id || '',
    enabled: !!user && !!orgId,
    onNewMessage: (msg) => {
      console.log('[DM_RECEIVED] New DM from', msg.senderName, ':', msg.content);
      toast.custom((t) => (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold shrink-0">
            {msg.senderName?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{msg.senderName}</p>
            <p className="text-xs text-gray-400 truncate">{msg.content}</p>
          </div>
          <button
            onClick={() => {
              console.log('[OPEN_CHAT] Opening DM panel for', msg.senderName);
              toast.dismiss(t);
              openDmRef.current(msg.senderId, msg.senderName);
            }}
            className="px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 rounded-lg transition-colors shrink-0"
          >
            Open Chat
          </button>
        </div>
      ), { duration: 8000 });
    },
  });

  const webRTC = useWebRTC({
    roomId: spaceId,
    userId: user?.id || '',
    token,
    relayUrl: env.RELAY_URL,
    enabled: !!user && !!token,
  });

  const callManager = useCallManager({
    relayClient: webRTC.relayClientRef?.current || null,
    userId: user?.id || '',
    username: user?.name || '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (webRTC.isInitialized && webRTC.recvTransport && webRTC.device) {
      const { ProximityWebRTCManager } = require('../../lib/webrtc/proximity-manager');

      if (!proximityManagerRef.current && webRTC.relayClientRef?.current && webRTC.audioManagerRef?.current) {
        proximityManagerRef.current = new ProximityWebRTCManager({
          relayClient: webRTC.relayClientRef.current,
          audioManager: webRTC.audioManagerRef.current,
          roomId: spaceId,
          userId: user?.id || '',
          device: webRTC.device,
          recvTransport: webRTC.recvTransport,
        });
      }
    }
  }, [webRTC.isInitialized, webRTC.recvTransport, webRTC.device, spaceId, user?.id]);

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

  const handleToggleMic = useCallback(async () => {
    if (callManager.callState === 'active' && !mediaSetupCompleteRef.current) {
      console.warn('[MIC] Media setup not complete, please wait');
      return;
    }

    if (isMuted) {
      console.log('[MIC] Unmuting mic...');
      const stream = await webRTC.startAudio();
      if (stream !== null || webRTC.isProducing) {
        setIsMuted(false);
        console.log('[MIC] Mic unmuted');
      } else {
        console.warn('[MIC] Failed to unmute');
      }
    } else {
      console.log('[MIC] Muting mic...');
      await webRTC.stopAudio();
      setIsMuted(true);
      console.log('[MIC] Mic muted');
    }
  }, [isMuted, callManager.callState, webRTC.startAudio, webRTC.stopAudio, webRTC.isProducing]);

  const handleToggleCamera = useCallback(async () => {
    if (callManager.callState === 'active' && !mediaSetupCompleteRef.current) {
      console.warn('[CAMERA] Media setup not complete, please wait');
      return;
    }

    if (isCameraOn) {
      console.log('[CAMERA] Disabling camera...');
      await webRTC.stopVideo();
      setLocalStream(null);
      setIsCameraOn(false);
      setIsVideoOff(true);
      console.log('[CAMERA] Camera disabled');
    } else {
      console.log('[CAMERA] Enabling camera...');
      const stream = await webRTC.startVideo();
      if (stream) {
        setLocalStream(stream);
        setIsCameraOn(true);
        setIsVideoOff(false);
        console.log('[CAMERA] Camera enabled, stream set');
      } else {
        console.warn('[CAMERA] Failed to enable camera, staying off');
        setIsCameraOn(false);
        setIsVideoOff(true);
      }
    }
  }, [isCameraOn, callManager.callState, webRTC.startVideo, webRTC.stopVideo]);

  const handleStartCall = useCallback((targetUserId: string, targetName: string, type: 'video' | 'audio') => {
    callManager.requestCall(targetUserId, targetName, type);
  }, [callManager]);

  const handleStartDm = useCallback(async (targetUserId: string, targetUsername: string) => {
    console.log(`[DM_PANEL] handleStartDm called for ${targetUsername} (${targetUserId})`);
    setContextMenu(null);
    setDmTarget({ userId: targetUserId, username: targetUsername });
    await dm.startConversation(targetUserId);
  }, [dm]);

  openDmRef.current = handleStartDm;

  const handleAvatarClicked = useCallback((data: { userId: string; username: string; screenX: number; screenY: number }) => {
    console.log(`[DM_PANEL] handleAvatarClicked called for ${data.username}, callState=${callManager.callState}`);
    if (callManager.callState !== 'idle') return;
    handleStartDm(data.userId, data.username);
  }, [callManager.callState, handleStartDm]);

  const handleCloseDm = useCallback(() => {
    dm.closeConversation();
    setDmTarget(null);
  }, [dm]);

  const handleAcceptCall = useCallback(() => {
    callManager.acceptCall();
  }, [callManager]);

  const handleEndCall = useCallback(() => {
    console.log('[SIGNALING] Ending call...');
    callManager.endCall();
    webRTC.closeCallProducers();
    webRTC.closeCallConsumers();
    mediaSetupCompleteRef.current = false;
    setIsCameraOn(false);
    setIsVideoOff(true);
    setIsMuted(true);
    setLocalStream(null);
    setRemoteStream(null);
    console.log('[MEDIA] Call ended, all media cleaned up');
  }, [callManager, webRTC.closeCallProducers, webRTC.closeCallConsumers]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (callManager.callState === 'active') {
        handleEndCall();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [callManager.callState, handleEndCall]);

  const handleRejectCall = useCallback(() => {
    callManager.rejectCall();
  }, [callManager]);

  const handleProximityChange = useCallback((users: ProximityUser[]) => {
    const filtered = users.filter(u => !ignoredUsersRef.current.has(u.userId));
    setNearbyUsers(filtered);
  }, []);

  const handleProximityConnect = useCallback((userId: string, username: string) => {
    console.log(`[INVITATION] Connecting to ${username} (${userId})`);
    callManager.requestCall(userId, username, 'video');
  }, [callManager]);

  const handleProximityIgnore = useCallback((userId: string) => {
    console.log(`[INVITATION] Ignoring user ${userId}`);
    ignoredUsersRef.current.add(userId);
    setNearbyUsers(prev => prev.filter(u => u.userId !== userId));
  }, []);

  const handleLeave = useCallback(() => {
    console.log(`[ArenaWrapper] Leave requested`);
    if (callManager.callState === 'active') {
      handleEndCall();
    }
    webRTC.cleanup();
    proximityManagerRef.current?.cleanup();
    proximityManagerRef.current = null;
    spaceClientRef.current?.leave();
    setTimeout(() => {
      if (orgId) {
        router.push(`/organization/${orgId}/workspaces`);
      } else {
        router.push('/home');
      }
    }, 200);
  }, [orgId, router, webRTC.cleanup, callManager.callState, handleEndCall]);

  useEffect(() => {
    if (!webRTC.relayClientRef?.current) return;
    const unsub = webRTC.relayClientRef.current.onNewProducer(async (data) => {
      if (callManager.callState === 'active' && callManager.callPartnerId === data.userId) {
        console.log(`[CONSUMER] Call partner ${data.userId} started ${data.kind}, consuming...`);
        const remote = await webRTC.consumeRemoteUser(data.userId);
        if (remote) {
          setRemoteStream(remote);
          console.log(`[CONSUMER] Updated remote stream after new producer`);
        }
      }
    });
    return unsub;
  }, [webRTC.relayClientRef?.current, callManager.callState, callManager.callPartnerId, webRTC.consumeRemoteUser]);

  useEffect(() => {
    if (callManager.callState !== 'active') return;
    if (!callManager.callPartnerId) return;

    console.log(`[SIGNALING] Call became active with partner=${callManager.callPartnerId} type=${callManager.callType}`);
    mediaSetupCompleteRef.current = false;

    let pollAbort = false;

    const startMediaAndConsume = async () => {
      console.log('[MEDIA] Starting media for active call...');

      if (callManager.callType === 'video') {
        console.log('[CAMERA] Requesting camera access...');
        const videoStream = await webRTC.startVideo();
        if (videoStream) {
          setLocalStream(videoStream);
          console.log('[CAMERA] Local video stream set, tracks:', videoStream.getVideoTracks().length);
        } else {
          console.warn('[CAMERA] Failed to get video stream');
        }
        setIsCameraOn(true);
        setIsVideoOff(false);
      }

      console.log('[MIC] Requesting mic access...');
      await webRTC.startAudio();
      setIsMuted(false);
      console.log('[MIC] Mic enabled');

      mediaSetupCompleteRef.current = true;
      console.log('[MEDIA] Media setup complete, toggles now active');

      const pollForRemote = async (retries = 10): Promise<void> => {
        if (pollAbort || retries <= 0) {
          console.log('[CONSUMER] Stopped polling for remote producers');
          return;
        }
        console.log(`[CONSUMER] Polling for remote producers (attempt ${11 - retries}/10)...`);
        const remote = await webRTC.consumeRemoteUser(callManager.callPartnerId!);
        if (remote) {
          setRemoteStream(remote);
          console.log('[CONSUMER] Remote stream set, tracks:', remote.getTracks().length);
          return;
        }
        const delay = retries > 7 ? 2000 : retries > 4 ? 3000 : 4000;
        console.log(`[CONSUMER] No remote producers yet, waiting ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return pollForRemote(retries - 1);
      };

      await pollForRemote();
    };

    startMediaAndConsume();

    return () => {
      pollAbort = true;
    };
  }, [callManager.callState, callManager.callPartnerId, callManager.callType, webRTC.startVideo, webRTC.startAudio, webRTC.consumeRemoteUser]);

  useEffect(() => {
    if (callManager.callState === 'idle' && prevCallStateRef.current === 'active') {
      console.log('[MEDIA] Call ended, cleaning up media...');
      webRTC.closeCallProducers();
      webRTC.closeCallConsumers();
      mediaSetupCompleteRef.current = false;
      setIsCameraOn(false);
      setIsVideoOff(true);
      setIsMuted(true);
      setLocalStream(null);
      setRemoteStream(null);
      console.log('[MEDIA] Call cleanup complete');
    }
    prevCallStateRef.current = callManager.callState;
  }, [callManager.callState, webRTC.closeCallProducers, webRTC.closeCallConsumers]);

  if (!user || !token) return null;

  return (
    <>
      <ArenaCanvas
        spaceId={spaceId}
        userId={user.id}
        token={token}
        organizationId={orgId || ''}
        workspaceId={workspaceId || spaceId}
        proximityManager={proximityManagerRef.current}
        onInteraction={handleInteraction}
        onAvatarClicked={handleAvatarClicked}
        onOnlineCountChange={handleOnlineCountChange}
        onUsersChange={setRemoteUsers}
        onChatMessage={handleChatMessage}
        onChatHistory={handleChatHistory}
        onProximityChange={handleProximityChange}
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
        onToggleMic={handleToggleMic}
        onToggleVideo={handleToggleCamera}
        onToggleShare={() => setIsSharing(p => !p)}
        onToggleHand={() => setIsHandRaised(p => !p)}
        onOpenChat={() => togglePanel('chat')}
        onOpenParticipants={() => togglePanel('participants')}
        onOpenAiLabs={() => togglePanel('ai-labs')}
        onLeave={handleLeave}
        unreadDmCount={dm.totalUnreadCount}
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
          onSendMessage={handleStartDm}
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

      {contextMenu && (
        <AvatarContextMenu
          userId={contextMenu.userId}
          username={contextMenu.username}
          userColor={contextMenu.userColor}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onStartCall={handleStartCall}
          onSendMessage={handleStartDm}
        />
      )}

      {dmTarget && dm.activeConversationId && (
        <DirectMessagePanel
          isOpen={true}
          onClose={handleCloseDm}
          otherUser={{
            id: dmTarget.userId,
            name: dmTarget.username,
            email: '',
          }}
          messages={dm.messages}
          typingUsers={dm.typingUsers}
          currentUserId={user.id}
          onSendMessage={dm.sendMessage}
          onLoadMore={() => dm.activeConversationId && dm.loadMessages(dm.activeConversationId)}
          hasMore={dm.messages.length >= 50}
          onStartTyping={dm.startTyping}
          isOnline={remoteUsers.some(u => u.userId === dmTarget.userId)}
          userColor={remoteUsers.find(u => u.userId === dmTarget.userId)?.color || '#6366f1'}
        />
      )}

      {isCameraOn && localStream && callManager.callState !== 'active' && (
        <LocalVideoPreview
          localStream={localStream}
          isMicOn={!isMuted}
          isCameraOn={isCameraOn}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          username={user?.name}
        />
      )}

      {callManager.callState === 'incoming' && (
        <IncomingCallModal
          callerName={callManager.callPartnerName || 'Unknown'}
          callerColor={remoteUsers.find(u => u.userId === callManager.callPartnerId)?.color}
          callType={callManager.callType || 'video'}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {callManager.callState === 'idle' && nearbyUsers.length > 0 && (
        <ProximityPopup
          users={nearbyUsers}
          onConnect={handleProximityConnect}
          onIgnore={handleProximityIgnore}
        />
      )}

      {callManager.callState === 'active' && (
        <VideoCallOverlay
          callPartnerName={callManager.callPartnerName || 'Unknown'}
          callPartnerColor={remoteUsers.find(u => u.userId === callManager.callPartnerId)?.color}
          callType={callManager.callType || 'video'}
          callDuration={callManager.callDuration}
          localStream={localStream}
          remoteStream={remoteStream}
          isMicOn={!isMuted}
          isCameraOn={isCameraOn}
          onToggleMic={handleToggleMic}
          onToggleCamera={handleToggleCamera}
          onEndCall={handleEndCall}
        />
      )}
    </>
  );
}
