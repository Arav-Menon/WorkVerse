import type { Consumer } from 'mediasoup-client/types';

type AudioStream = {
  consumerId: string;
  userId: string;
  audioElement: HTMLAudioElement;
  stream: MediaStream;
};

export class AudioManager {
  private streams = new Map<string, AudioStream>();
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'audio-manager-container';
    this.container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;pointer-events:none;';
    document.body.appendChild(this.container);
  }

  attachConsumer(consumer: Consumer, userId: string): HTMLAudioElement {
    this.detachConsumer(consumer.id);

    const track = consumer.track;
    if (!track) {
      console.warn(`[AudioManager] No track for consumer ${consumer.id}`);
      return document.createElement('audio');
    }

    const stream = new MediaStream([track]);
    const audioElement = document.createElement('audio');
    audioElement.id = `audio-${consumer.id}`;
    audioElement.srcObject = stream;
    audioElement.autoplay = true;
    (audioElement as any).playsInline = true;
    audioElement.volume = 1.0;
    this.container.appendChild(audioElement);

    const audioStream: AudioStream = {
      consumerId: consumer.id,
      userId,
      audioElement,
      stream,
    };
    this.streams.set(consumer.id, audioStream);

    console.log(`[AudioManager] Attached audio for consumer=${consumer.id} user=${userId}`);
    return audioElement;
  }

  detachConsumer(consumerId: string) {
    const existing = this.streams.get(consumerId);
    if (existing) {
      existing.audioElement.srcObject = null;
      existing.audioElement.remove();
      existing.stream.getTracks().forEach((t) => t.stop());
      this.streams.delete(consumerId);
      console.log(`[AudioManager] Detached audio consumer=${consumerId}`);
    }
  }

  detachAllForUser(userId: string) {
    for (const [id, stream] of this.streams.entries()) {
      if (stream.userId === userId) {
        this.detachConsumer(id);
      }
    }
  }

  setVolume(consumerId: string, volume: number) {
    const stream = this.streams.get(consumerId);
    if (stream) {
      stream.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  setMuted(consumerId: string, muted: boolean) {
    const stream = this.streams.get(consumerId);
    if (stream) {
      stream.audioElement.muted = muted;
    }
  }

  hasConsumer(consumerId: string): boolean {
    return this.streams.has(consumerId);
  }

  getConsumerCount(): number {
    return this.streams.size;
  }

  cleanup() {
    for (const [id] of this.streams) {
      this.detachConsumer(id);
    }
    this.container.remove();
    console.log('[AudioManager] Cleanup complete');
  }
}
