import { useCallback, useEffect, useRef, useState } from 'react';
import * as mediasoupClient from 'mediasoup-client';
import { RelayClient } from '../lib/ws/relay-client';
import { AudioManager } from '../lib/audio/audio-manager';
import type { Device, Transport, Producer, Consumer, RtpCapabilities } from 'mediasoup-client/types';

export interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  token: string;
  relayUrl?: string;
  enabled?: boolean;
}

export interface WebRTCState {
  isInitialized: boolean;
  isConnected: boolean;
  isProducing: boolean;
  isProducingVideo: boolean;
  localProducerId: string | null;
  localVideoProducerId: string | null;
  consumerCount: number;
  error: string | null;
}

export function useWebRTC({
  roomId,
  userId,
  token,
  relayUrl,
  enabled = true,
}: UseWebRTCOptions) {
  const [state, setState] = useState<WebRTCState>({
    isInitialized: false,
    isConnected: false,
    isProducing: false,
    isProducingVideo: false,
    localProducerId: null,
    localVideoProducerId: null,
    consumerCount: 0,
    error: null,
  });

  const relayClientRef = useRef<RelayClient | null>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);
  const localProducerRef = useRef<Producer | null>(null);
  const localVideoProducerRef = useRef<Producer | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const consumersRef = useRef<Map<string, Consumer>>(new Map());
  const callConsumersRef = useRef<Map<string, Consumer>>(new Map());
  const localVideoStreamRef = useRef<MediaStream | null>(null);
  const isInitializedRef = useRef(false);
  const creatingAudioRef = useRef(false);
  const creatingVideoRef = useRef(false);

  const updateState = useCallback((patch: Partial<WebRTCState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const initialize = useCallback(async () => {
    if (isInitializedRef.current) return;
    if (!roomId || !userId || !token) return;

    try {
      console.log('[TRANSPORT] Initializing...');
      isInitializedRef.current = true;

      audioManagerRef.current = new AudioManager();

      relayClientRef.current = new RelayClient({
        wsUrl: relayUrl,
        token,
        onConnect: () => updateState({ isConnected: true }),
        onDisconnect: () => updateState({ isConnected: false }),
      });

      relayClientRef.current.connect();

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        const check = setInterval(() => {
          if (relayClientRef.current?.isConnected) {
            clearInterval(check);
            clearTimeout(timeout);
            resolve();
          }
        }, 100);
      });

      console.log('[TRANSPORT] Relay connected, joining room...');
      await relayClientRef.current.joinRoom(roomId, userId);

      const rtpCapabilities: RtpCapabilities = await relayClientRef.current.getRouterCapabilities(roomId);
      console.log('[TRANSPORT] Router capabilities received');

      const device = new mediasoupClient.Device();
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      deviceRef.current = device;
      console.log('[TRANSPORT] Device loaded');

      const sendTransportOptions = await relayClientRef.current.createTransport(roomId, userId);
      const sendTransport = device.createSendTransport(sendTransportOptions);

      sendTransport.on('connect', async ({ dtlsParameters }: any, callback: () => void, errback: (err: Error) => void) => {
        try {
          console.log('[TRANSPORT] DTLS connecting...');
          await relayClientRef.current!.connectTransport(sendTransport.id, dtlsParameters);
          console.log('[TRANSPORT] DTLS connected');
          callback();
        } catch (err) {
          console.error('[TRANSPORT] DTLS connection failed:', err);
          errback(err as Error);
        }
      });

      sendTransport.on('produce', async ({ kind, rtpParameters }: any, callback: (data: { id: string }) => void, errback: (err: Error) => void) => {
        try {
          console.log(`[PRODUCER] SFU producing ${kind}...`);
          const producerId = await relayClientRef.current!.produce(
            sendTransport.id,
            kind,
            rtpParameters,
            roomId,
            userId
          );
          console.log(`[SFU] Producer registered: ${producerId} kind=${kind} user=${userId}`);
          callback({ id: producerId });
        } catch (err) {
          console.error(`[PRODUCER] SFU produce failed for ${kind}:`, err);
          errback(err as Error);
        }
      });

      sendTransport.on('connectionstatechange', (state: string) => {
        console.log(`[TRANSPORT] Send transport state: ${state}`);
        if (state === 'failed' || state === 'disconnected') {
          updateState({ error: `Send transport ${state}` });
        }
      });

      sendTransportRef.current = sendTransport;
      console.log('[TRANSPORT] Send transport created:', sendTransport.id);

      const recvTransportOptions = await relayClientRef.current.createTransport(roomId, userId);
      const recvTransport = device.createRecvTransport(recvTransportOptions);

      recvTransport.on('connect', async ({ dtlsParameters }: any, callback: () => void, errback: (err: Error) => void) => {
        try {
          await relayClientRef.current!.connectTransport(recvTransport.id, dtlsParameters);
          callback();
        } catch (err) {
          errback(err as Error);
        }
      });

      recvTransport.on('connectionstatechange', (state: string) => {
        console.log(`[TRANSPORT] Recv transport state: ${state}`);
      });

      recvTransportRef.current = recvTransport;
      console.log('[TRANSPORT] Recv transport created:', recvTransport.id);

      updateState({
        isInitialized: true,
        isConnected: true,
        error: null,
      });

      console.log('[TRANSPORT] Initialization complete');
    } catch (err: any) {
      console.error('[TRANSPORT] Initialization failed:', err);
      updateState({ error: err.message, isInitialized: false });
      isInitializedRef.current = false;
    }
  }, [roomId, userId, token, relayUrl, updateState]);

  const startAudio = useCallback(async (): Promise<MediaStream | null> => {
    if (creatingAudioRef.current) {
      console.warn('[MIC] Already creating audio producer, skipping');
      return null;
    }

    if (!sendTransportRef.current) {
      console.warn('[MIC] Cannot start audio: send transport not ready');
      return null;
    }

    if (localProducerRef.current) {
      console.log('[MIC] Audio producer already exists, resuming...');
      try {
        if (localProducerRef.current.paused) {
          localProducerRef.current.resume();
          await relayClientRef.current?.resumeProducer(localProducerRef.current.id);
          console.log('[MIC] Audio producer resumed');
        }
      } catch (err) {
        console.error('[MIC] Failed to resume audio producer:', err);
      }
      return null;
    }

    creatingAudioRef.current = true;
    try {
      console.log('[MIC] getUserMedia requested');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2,
        },
        video: false,
      });

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) throw new Error('No audio track');

      console.log('[MIC] Audio stream acquired:', stream.getAudioTracks().map(t => `${t.label}(${t.readyState})`).join(', '));
      console.log('[PRODUCER] Creating audio producer...');

      const producer = await sendTransportRef.current.produce({
        track: audioTrack,
        codecOptions: {
          opusStereo: true,
          opusDtx: true,
        },
      });

      localProducerRef.current = producer;

      producer.on('transportclose', () => {
        console.log('[PRODUCER] Audio producer transport closed');
        localProducerRef.current = null;
        updateState({ isProducing: false, localProducerId: null });
      });

      producer.on('close' as any, () => {
        console.log('[PRODUCER] Audio producer closed');
        localProducerRef.current = null;
        updateState({ isProducing: false, localProducerId: null });
      });

      updateState({
        isProducing: true,
        localProducerId: producer.id,
      });

      console.log(`[PRODUCER] Audio producer created: ${producer.id}`);
      return stream;
    } catch (err: any) {
      console.error('[MIC] Failed to start audio:', err);
      updateState({ error: `Mic access failed: ${err.message}` });
      return null;
    } finally {
      creatingAudioRef.current = false;
    }
  }, [updateState]);

  const stopAudio = useCallback(async () => {
    if (!localProducerRef.current) return;
    try {
      if (!localProducerRef.current.paused) {
        localProducerRef.current.pause();
        await relayClientRef.current?.pauseProducer(localProducerRef.current.id);
        console.log('[MIC] Audio producer paused');
      }
    } catch (err) {
      console.error('[MIC] Failed to pause audio:', err);
    }
  }, []);

  const startVideo = useCallback(async (): Promise<MediaStream | null> => {
    if (creatingVideoRef.current) {
      console.warn('[CAMERA] Already creating video producer, skipping');
      return null;
    }

    if (!sendTransportRef.current) {
      console.warn('[CAMERA] Cannot start video: send transport not ready');
      return null;
    }

    if (localVideoProducerRef.current) {
      console.log('[CAMERA] Video producer already exists, resuming...');
      try {
        if (localVideoProducerRef.current.paused) {
          localVideoProducerRef.current.resume();
          await relayClientRef.current?.resumeProducer(localVideoProducerRef.current.id);
          console.log('[CAMERA] Video producer resumed');
        }
      } catch (err) {
        console.error('[CAMERA] Failed to resume video producer:', err);
      }
      return localVideoStreamRef.current;
    }

    creatingVideoRef.current = true;
    try {
      console.log('[CAMERA] getUserMedia requested');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      });

      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) throw new Error('No video track');

      console.log('[CAMERA] Video stream acquired:', stream.getVideoTracks().map(t => `${t.label}(${t.readyState})`).join(', '));
      console.log('[PRODUCER] Creating video producer...');

      const producer = await sendTransportRef.current.produce({
        track: videoTrack,
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
      });

      localVideoProducerRef.current = producer;
      localVideoStreamRef.current = stream;

      producer.on('transportclose', () => {
        console.log('[PRODUCER] Video producer transport closed');
        localVideoProducerRef.current = null;
        localVideoStreamRef.current = null;
        updateState({ isProducingVideo: false, localVideoProducerId: null });
      });

      producer.on('close' as any, () => {
        console.log('[PRODUCER] Video producer closed');
        localVideoProducerRef.current = null;
        localVideoStreamRef.current = null;
        updateState({ isProducingVideo: false, localVideoProducerId: null });
      });

      updateState({
        isProducingVideo: true,
        localVideoProducerId: producer.id,
      });

      console.log(`[PRODUCER] Video producer created: ${producer.id}`);
      return stream;
    } catch (err: any) {
      console.error('[CAMERA] Failed to start video:', err);
      updateState({ error: `Camera access failed: ${err.message}` });
      return null;
    } finally {
      creatingVideoRef.current = false;
    }
  }, [updateState]);

  const stopVideo = useCallback(async () => {
    if (!localVideoProducerRef.current) return;
    try {
      if (!localVideoProducerRef.current.paused) {
        localVideoProducerRef.current.pause();
        await relayClientRef.current?.pauseProducer(localVideoProducerRef.current.id);
        console.log('[CAMERA] Video producer paused');
      }
    } catch (err) {
      console.error('[CAMERA] Failed to pause video:', err);
    }
  }, []);

  const consumeProducer = useCallback(
    async (producerId: string, remoteUserId: string): Promise<Consumer | null> => {
      if (!recvTransportRef.current || !deviceRef.current || !relayClientRef.current) {
        console.warn('[PRODUCER] Cannot consume: transport/device not ready');
        return null;
      }

      if (consumersRef.current.has(producerId)) {
        console.log(`[PRODUCER] Already consuming producer ${producerId}`);
        return consumersRef.current.get(producerId)!;
      }

      try {
        const consumerOptions = await relayClientRef.current.consume(
          recvTransportRef.current.id,
          producerId,
          deviceRef.current.rtpCapabilities,
          roomId,
          userId
        );

        const consumer = await recvTransportRef.current.consume({
          id: consumerOptions.id,
          producerId: consumerOptions.producerId,
          kind: consumerOptions.kind,
          rtpParameters: consumerOptions.rtpParameters,
        });

        consumersRef.current.set(producerId, consumer);

        await relayClientRef.current.resumeConsumer(consumer.id);

        if (audioManagerRef.current) {
          audioManagerRef.current.attachConsumer(consumer, remoteUserId);
        }

        updateState({ consumerCount: consumersRef.current.size });

        consumer.on('close' as any, () => {
          console.log(`[CONSUMER] Consumer closed: ${consumer.id}`);
          consumersRef.current.delete(producerId);
          if (audioManagerRef.current) {
            audioManagerRef.current.detachConsumer(consumer.id);
          }
          updateState({ consumerCount: consumersRef.current.size });
        });

        consumer.on('producerclose' as any, () => {
          console.log(`[CONSUMER] Consumer producer closed: ${consumer.id}`);
          consumersRef.current.delete(producerId);
          if (audioManagerRef.current) {
            audioManagerRef.current.detachConsumer(consumer.id);
          }
          updateState({ consumerCount: consumersRef.current.size });
        });

        console.log(`[CONSUMER] Consuming producer ${producerId} from user ${remoteUserId}`);
        return consumer;
      } catch (err: any) {
        console.error(`[CONSUMER] Failed to consume producer ${producerId}:`, err);
        return null;
      }
    },
    [roomId, userId, updateState]
  );

  const closeConsumerForProducer = useCallback(
    (producerId: string) => {
      const consumer = consumersRef.current.get(producerId);
      if (consumer) {
        consumer.close();
        consumersRef.current.delete(producerId);
        if (audioManagerRef.current) {
          audioManagerRef.current.detachConsumer(consumer.id);
        }
        updateState({ consumerCount: consumersRef.current.size });
        console.log(`[CONSUMER] Closed for producer ${producerId}`);
      }
    },
    [updateState]
  );

  const closeConsumersForUser = useCallback(
    (remoteUserId: string) => {
      for (const [producerId, consumer] of consumersRef.current.entries()) {
        if (audioManagerRef.current?.hasConsumer(consumer.id)) {
          consumer.close();
          consumersRef.current.delete(producerId);
          if (audioManagerRef.current) {
            audioManagerRef.current.detachConsumer(consumer.id);
          }
        }
      }
      updateState({ consumerCount: consumersRef.current.size + callConsumersRef.current.size });
    },
    [updateState]
  );

  const consumeForCall = useCallback(
    async (producerId: string, remoteUserId: string): Promise<Consumer | null> => {
      if (!recvTransportRef.current || !deviceRef.current || !relayClientRef.current) {
        console.warn('[CONSUMER] Cannot consume for call: transport/device not ready');
        return null;
      }

      if (callConsumersRef.current.has(producerId)) {
        console.log(`[CONSUMER] Already consuming producer ${producerId} for call`);
        return callConsumersRef.current.get(producerId)!;
      }

      try {
        const consumerOptions = await relayClientRef.current.consume(
          recvTransportRef.current.id,
          producerId,
          deviceRef.current.rtpCapabilities,
          roomId,
          userId
        );

        const consumer = await recvTransportRef.current.consume({
          id: consumerOptions.id,
          producerId: consumerOptions.producerId,
          kind: consumerOptions.kind,
          rtpParameters: consumerOptions.rtpParameters,
        });

        callConsumersRef.current.set(producerId, consumer);

        await relayClientRef.current.resumeConsumer(consumer.id);

        updateState({ consumerCount: consumersRef.current.size + callConsumersRef.current.size });

        consumer.on('close' as any, () => {
          console.log(`[CONSUMER] Call consumer closed: ${consumer.id}`);
          callConsumersRef.current.delete(producerId);
          updateState({ consumerCount: consumersRef.current.size + callConsumersRef.current.size });
        });

        consumer.on('producerclose' as any, () => {
          console.log(`[CONSUMER] Call consumer producer closed: ${consumer.id}`);
          callConsumersRef.current.delete(producerId);
          updateState({ consumerCount: consumersRef.current.size + callConsumersRef.current.size });
        });

        console.log(`[CONSUMER] Consuming producer ${producerId} from user ${remoteUserId} for call`);
        return consumer;
      } catch (err: any) {
        console.error(`[CONSUMER] Failed to consume producer ${producerId} for call:`, err);
        return null;
      }
    },
    [roomId, userId, updateState]
  );

  const closeCallConsumers = useCallback(() => {
    for (const [, consumer] of callConsumersRef.current) {
      consumer.close();
    }
    callConsumersRef.current.clear();
    updateState({ consumerCount: consumersRef.current.size + callConsumersRef.current.size });
    console.log('[CONSUMER] Call consumers closed');
  }, [updateState]);

  const closeCallProducers = useCallback(() => {
    console.log('[PRODUCER] Closing call producers...');
    if (localProducerRef.current) {
      localProducerRef.current.close();
      localProducerRef.current = null;
      updateState({ isProducing: false, localProducerId: null });
      console.log('[PRODUCER] Audio producer closed');
    }
    if (localVideoProducerRef.current) {
      localVideoProducerRef.current.close();
      localVideoProducerRef.current = null;
      localVideoStreamRef.current = null;
      updateState({ isProducingVideo: false, localVideoProducerId: null });
      console.log('[PRODUCER] Video producer closed');
    }
  }, [updateState]);

  const getLocalVideoStream = useCallback((): MediaStream | null => {
    return localVideoStreamRef.current;
  }, []);

  const consumeRemoteUser = useCallback(
    async (remoteUserId: string): Promise<MediaStream | null> => {
      if (!relayClientRef.current || !recvTransportRef.current || !deviceRef.current) {
        console.warn('[CONSUMER] Cannot consume remote user: not initialized');
        return null;
      }

      try {
        console.log(`[SFU] Discovering producers for user ${remoteUserId}...`);
        const remoteProducers = await relayClientRef.current.getProducers(roomId, userId);
        console.log(`[SFU] Found ${remoteProducers.length} total remote producers`);

        const remoteUserProducers = remoteProducers.filter(
          (p: any) => p.userId === remoteUserId
        );
        console.log(`[SFU] User ${remoteUserId} has ${remoteUserProducers.length} producers:`,
          remoteUserProducers.map((p: any) => `${p.producerId}(${p.kind})`));

        if (remoteUserProducers.length === 0) {
          console.warn(`[SFU] No producers found for user ${remoteUserId} - remote may not have started media yet`);
          return null;
        }

        const remoteStream = new MediaStream();

        for (const remoteProducer of remoteUserProducers) {
          console.log(`[SFU] Consuming producer ${remoteProducer.producerId} (${remoteProducer.kind}) from ${remoteUserId}...`);
          const consumer = await consumeForCall(remoteProducer.producerId, remoteUserId);
          if (consumer && consumer.track) {
            remoteStream.addTrack(consumer.track);
            console.log(`[SFU] Added ${consumer.kind} track from ${remoteUserId} (consumer=${consumer.id})`);
          } else {
            console.warn(`[SFU] Failed to get track for producer ${remoteProducer.producerId}`);
          }
        }

        const trackCount = remoteStream.getTracks().length;
        console.log(`[SFU] Built remote stream with ${trackCount} tracks`);

        if (trackCount > 0) {
          return remoteStream;
        }

        return null;
      } catch (err: any) {
        console.error('[SFU] Failed to consume remote user:', err);
        return null;
      }
    },
    [roomId, userId, consumeForCall]
  );

  const cleanup = useCallback(() => {
    console.log('[MEDIA] Cleaning up...');

    if (localProducerRef.current) {
      localProducerRef.current.close();
      localProducerRef.current = null;
    }

    if (localVideoProducerRef.current) {
      localVideoProducerRef.current.close();
      localVideoProducerRef.current = null;
    }

    if (localVideoStreamRef.current) {
      localVideoStreamRef.current.getTracks().forEach(t => t.stop());
      localVideoStreamRef.current = null;
    }

    for (const [, consumer] of consumersRef.current) {
      consumer.close();
    }
    consumersRef.current.clear();

    for (const [, consumer] of callConsumersRef.current) {
      consumer.close();
    }
    callConsumersRef.current.clear();

    if (sendTransportRef.current) {
      sendTransportRef.current.close();
      sendTransportRef.current = null;
    }

    if (recvTransportRef.current) {
      recvTransportRef.current.close();
      recvTransportRef.current = null;
    }

    if (audioManagerRef.current) {
      audioManagerRef.current.cleanup();
      audioManagerRef.current = null;
    }

    if (relayClientRef.current) {
      relayClientRef.current.leaveRoom().catch(() => {});
      relayClientRef.current.disconnect();
      relayClientRef.current = null;
    }

    deviceRef.current = null;
    isInitializedRef.current = false;

    updateState({
      isInitialized: false,
      isConnected: false,
      isProducing: false,
      isProducingVideo: false,
      localProducerId: null,
      localVideoProducerId: null,
      consumerCount: 0,
      error: null,
    });

    console.log('[MEDIA] Cleanup complete');
  }, [updateState]);

  useEffect(() => {
    if (enabled) {
      initialize();
    }

    return () => {
      cleanup();
    };
  }, [enabled, roomId, userId, token]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cleanup]);

  return {
    ...state,
    consumeProducer,
    closeConsumerForProducer,
    closeConsumersForUser,
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    consumeForCall,
    closeCallConsumers,
    closeCallProducers,
    getLocalVideoStream,
    consumeRemoteUser,
    cleanup,
    initialize,
    device: deviceRef.current,
    sendTransport: sendTransportRef.current,
    recvTransport: recvTransportRef.current,
    relayClientRef,
    audioManagerRef,
  };
}
