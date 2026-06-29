import { useState, useRef, useCallback, useEffect } from 'react';
import type { RelayClient } from '../lib/ws/relay-client';

export type CallState = 'idle' | 'outgoing' | 'incoming' | 'active';
export type CallType = 'audio' | 'video';

interface UseCallManagerOptions {
  relayClient: RelayClient | null;
  userId: string;
  username: string;
}

export function useCallManager({ relayClient, userId, username }: UseCallManagerOptions) {
  const [callState, setCallState] = useState<CallState>('idle');
  const [callPartnerId, setCallPartnerId] = useState<string | null>(null);
  const [callPartnerName, setCallPartnerName] = useState<string | null>(null);
  const [callType, setCallType] = useState<CallType | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callStartTimeRef = useRef<number>(0);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetCall = useCallback(() => {
    setCallState('idle');
    setCallPartnerId(null);
    setCallPartnerName(null);
    setCallType(null);
    setCallDuration(0);
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const startDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
    callStartTimeRef.current = Date.now();
    durationTimerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
    }, 1000);
  }, []);

  useEffect(() => {
    if (!relayClient) return;

    const unsubscribe = relayClient.onMessage((data: any) => {
      switch (data.type) {
        case 'call-request':
          setCallState('incoming');
          setCallPartnerId(data.callerId);
          setCallPartnerName(data.callerName);
          setCallType(data.callType);
          break;
        case 'call-accepted':
          setCallState('active');
          startDurationTimer();
          break;
        case 'call-rejected':
          resetCall();
          break;
        case 'call-ended':
          resetCall();
          break;
        case 'call-cancelled':
          resetCall();
          break;
      }
    });

    return () => unsubscribe();
  }, [relayClient, resetCall, startDurationTimer]);

  const requestCall = useCallback((targetUserId: string, targetName: string, type: CallType) => {
    if (!relayClient) return;
    setCallState('outgoing');
    setCallPartnerId(targetUserId);
    setCallPartnerName(targetName);
    setCallType(type);
    relayClient.sendCallRequest(targetUserId, username, type);
  }, [relayClient, username]);

  const acceptCall = useCallback(() => {
    if (!relayClient || !callPartnerId) return;
    relayClient.sendCallAccepted(callPartnerId);
    setCallState('active');
    startDurationTimer();
  }, [relayClient, callPartnerId, startDurationTimer]);

  const rejectCall = useCallback(() => {
    if (!relayClient || !callPartnerId) return;
    relayClient.sendCallRejected(callPartnerId);
    resetCall();
  }, [relayClient, callPartnerId, resetCall]);

  const endCall = useCallback(() => {
    if (!relayClient || !callPartnerId) return;
    relayClient.sendCallEnded(callPartnerId);
    resetCall();
  }, [relayClient, callPartnerId, resetCall]);

  const cancelCall = useCallback(() => {
    if (!relayClient || !callPartnerId) return;
    relayClient.sendCallCancelled(callPartnerId);
    resetCall();
  }, [relayClient, callPartnerId, resetCall]);

  useEffect(() => {
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, []);

  return {
    callState,
    callPartnerId,
    callPartnerName,
    callType,
    callDuration,
    requestCall,
    acceptCall,
    rejectCall,
    endCall,
    cancelCall,
  };
}
