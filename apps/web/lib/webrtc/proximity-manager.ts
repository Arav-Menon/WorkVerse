import type { RelayClient } from '../ws/relay-client';
import type { AudioManager } from '../audio/audio-manager';

type PeerAudioState = {
  userId: string;
  producerIds: string[];
  consumerIds: string[];
};

export class ProximityWebRTCManager {
  private relayClient: RelayClient;
  private audioManager: AudioManager;
  private roomId: string;
  private userId: string;
  private device: any;
  private recvTransport: any;

  private peerStates = new Map<string, PeerAudioState>();
  private isInitialized = false;

  constructor({
    relayClient,
    audioManager,
    roomId,
    userId,
    device,
    recvTransport,
  }: {
    relayClient: RelayClient;
    audioManager: AudioManager;
    roomId: string;
    userId: string;
    device: any;
    recvTransport: any;
  }) {
    this.relayClient = relayClient;
    this.audioManager = audioManager;
    this.roomId = roomId;
    this.userId = userId;
    this.device = device;
    this.recvTransport = recvTransport;
    this.isInitialized = true;
  }

  async onProximityEnter(remoteUserId: string) {
    if (!this.isInitialized) return;
    if (remoteUserId === this.userId) return;

    if (this.peerStates.has(remoteUserId)) {
      console.log(`[ProximityWebRTC] Already consuming from ${remoteUserId}`);
      return;
    }

    console.log(`[ProximityWebRTC] Proximity enter: ${remoteUserId}`);

    const peerState: PeerAudioState = {
      userId: remoteUserId,
      producerIds: [],
      consumerIds: [],
    };

    try {
      const producers = await this.relayClient.getProducers(this.roomId, this.userId);
      const remoteProducers = producers.filter((p: any) => p.userId === remoteUserId);

      for (const producer of remoteProducers) {
        await this.consumeProducer(remoteUserId, producer.producerId, peerState);
      }

      this.peerStates.set(remoteUserId, peerState);
    } catch (err) {
      console.error(`[ProximityWebRTC] Failed to enter proximity with ${remoteUserId}:`, err);
    }
  }

  async onProximityExit(remoteUserId: string) {
    if (!this.isInitialized) return;

    const peerState = this.peerStates.get(remoteUserId);
    if (!peerState) return;

    console.log(`[ProximityWebRTC] Proximity exit: ${remoteUserId}`);

    for (const consumerId of peerState.consumerIds) {
      this.audioManager.detachConsumer(consumerId);
    }

    this.peerStates.delete(remoteUserId);
  }

  async onPeerProducerAdded(remoteUserId: string, producerId: string) {
    if (!this.isInitialized) return;
    if (remoteUserId === this.userId) return;

    const peerState = this.peerStates.get(remoteUserId);
    if (!peerState) return;

    await this.consumeProducer(remoteUserId, producerId, peerState);
  }

  onPeerProducerRemoved(remoteUserId: string, producerId: string) {
    const peerState = this.peerStates.get(remoteUserId);
    if (!peerState) return;

    const index = peerState.producerIds.indexOf(producerId);
    if (index !== -1) {
      peerState.producerIds.splice(index, 1);
    }
  }

  private async consumeProducer(
    remoteUserId: string,
    producerId: string,
    peerState: PeerAudioState
  ) {
    if (!this.recvTransport || !this.device) {
      console.warn('[ProximityWebRTC] Transport/device not ready');
      return;
    }

    try {
      const consumerOptions = await this.relayClient.consume(
        this.recvTransport.id,
        producerId,
        this.device.rtpCapabilities,
        this.roomId,
        this.userId
      );

      const consumer = await this.recvTransport.consume({
        id: consumerOptions.id,
        producerId: consumerOptions.producerId,
        kind: consumerOptions.kind,
        rtpParameters: consumerOptions.rtpParameters,
      });

      peerState.producerIds.push(producerId);
      peerState.consumerIds.push(consumer.id);

      await this.relayClient.resumeConsumer(consumer.id);
      this.audioManager.attachConsumer(consumer, remoteUserId);

      console.log(`[ProximityWebRTC] Consuming producer ${producerId} from ${remoteUserId}`);
    } catch (err) {
      console.error(`[ProximityWebRTC] Failed to consume producer ${producerId}:`, err);
    }
  }

  cleanup() {
    for (const [userId, peerState] of this.peerStates) {
      for (const consumerId of peerState.consumerIds) {
        this.audioManager.detachConsumer(consumerId);
      }
    }
    this.peerStates.clear();
    this.isInitialized = false;
    console.log('[ProximityWebRTC] Cleanup complete');
  }
}
