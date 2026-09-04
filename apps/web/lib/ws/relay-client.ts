import { services } from '../config/env';

export interface RelayClientOptions {
  wsUrl?: string;
  token: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (data: any) => void;
  onNewProducer?: (data: { producerId: string; userId: string; kind: string }) => void;
}

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timer: ReturnType<typeof setTimeout>;
};

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_DELAY = 1000;
const MAX_DELAY = 8000;
const REQUEST_TIMEOUT = 10000;
const PING_INTERVAL = 25000;
const PONG_TIMEOUT = 10000;

export class RelayClient {
  private ws: WebSocket | null = null;
  private options: RelayClientOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualClose = false;
  private pendingRequests = new Map<string, PendingRequest>();
  private messageCounter = 0;
  private messageListeners = new Set<(data: any) => void>();
  private newProducerListeners = new Set<(data: { producerId: string; userId: string; kind: string }) => void>();

  constructor(options: RelayClientOptions) {
    this.options = {
      ...options,
      wsUrl: options.wsUrl || services.relay,
    };
    if (options.onMessage) {
      this.messageListeners.add(options.onMessage);
    }
    if (options.onNewProducer) {
      this.newProducerListeners.add(options.onNewProducer);
    }
  }

  onMessage(listener: (data: any) => void): () => void {
    this.messageListeners.add(listener);
    return () => { this.messageListeners.delete(listener); };
  }

  onNewProducer(listener: (data: { producerId: string; userId: string; kind: string }) => void): () => void {
    this.newProducerListeners.add(listener);
    return () => { this.newProducerListeners.delete(listener); };
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isManualClose = false;

    const params = new URLSearchParams({
      token: this.options.token,
    });

    const ws = new WebSocket(`${this.options.wsUrl}?${params.toString()}`);

    ws.onopen = () => {
      console.log('[WebRTC] Relay WebSocket connected');
      this.reconnectAttempts = 0;
      this.ws = ws;
      this.options.onConnect?.();
      this.startPing();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'PONG') {
          this.handlePong();
          return;
        }

        if (data.type === 'error') {
          console.error('[WebRTC] Relay error:', data.error);
          return;
        }

        if (data.type === 'new-producer') {
          console.log(`[CONSUMER] New producer announced: ${data.producerId} user=${data.userId} kind=${data.kind}`);
          for (const listener of this.newProducerListeners) {
            try { listener({ producerId: data.producerId, userId: data.userId, kind: data.kind }); } catch {}
          }
          return;
        }

        const requestId = data.requestId;
        if (requestId && this.pendingRequests.has(requestId)) {
          const pending = this.pendingRequests.get(requestId)!;
          clearTimeout(pending.timer);
          this.pendingRequests.delete(requestId);

          if (data.error) {
            pending.reject(new Error(data.error));
          } else {
            pending.resolve(data);
          }
          return;
        }

        for (const listener of this.messageListeners) {
          try { listener(data); } catch {}
        }

        console.log('[WebRTC] Relay message:', data.type);
      } catch {
        console.log(`[WebRTC] Relay raw: ${event.data}`);
      }
    };

    ws.onclose = () => {
      console.log('[WebRTC] Relay WebSocket disconnected');
      this.ws = null;
      this.stopPing();
      this.rejectAllPending('Connection closed');
      this.options.onDisconnect?.();

      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
    };

    ws.onerror = (err) => {
      console.error('[WebRTC] Relay WebSocket error:', err);
    };
  }

  disconnect() {
    this.isManualClose = true;
    this.stopPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.rejectAllPending('Client disconnected');
    this.ws?.close(1000);
    this.ws = null;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  async joinRoom(roomId: string, userId: string): Promise<void> {
    await this.sendRequest({ type: 'join-room', roomId, userId });
    console.log(`[WebRTC] Room joined: ${roomId}`);
  }

  async leaveRoom(): Promise<void> {
    try {
      await this.sendRequest({ type: 'leave-room' });
      console.log('[WebRTC] Room left');
    } catch {
      // Best effort
    }
  }

  async getRouterCapabilities(roomId: string): Promise<any> {
    const response = await this.sendRequest({
      type: 'get-router-capabilities',
      roomId,
    });
    console.log('[WebRTC] Router capabilities received');
    return response.data;
  }

  async createTransport(roomId: string, userId: string): Promise<any> {
    const response = await this.sendRequest({
      type: 'create-transport',
      roomId,
      userId,
    });
    console.log('[WebRTC] Transport created:', response.data.id);
    return response.data;
  }

  async connectTransport(transportId: string, dtlsParameters: any): Promise<void> {
    await this.sendRequest({
      type: 'connect-transport',
      transportId,
      dtlsParameters,
    });
    console.log('[WebRTC] Transport connected:', transportId);
  }

  async produce(
    transportId: string,
    kind: string,
    rtpParameters: any,
    roomId: string,
    userId: string
  ): Promise<string> {
    const response = await this.sendRequest({
      type: 'produce',
      transportId,
      kind,
      rtpParameters,
      roomId,
      userId,
    });
    console.log('[WebRTC] Producer created:', response.data.producerId);
    return response.data.producerId;
  }

  async consume(
    transportId: string,
    producerId: string,
    rtpCapabilities: any,
    roomId: string,
    userId: string
  ): Promise<any> {
    const response = await this.sendRequest({
      type: 'consume',
      transportId,
      producerId,
      rtpCapabilities,
      roomId,
      userId,
    });
    console.log('[WebRTC] Consumer created:', response.data.id);
    return response.data;
  }

  async resumeConsumer(consumerId: string): Promise<void> {
    await this.sendRequest({
      type: 'resume-consumer',
      consumerId,
    });
    console.log('[WebRTC] Consumer resumed:', consumerId);
  }

  async pauseProducer(producerId: string): Promise<void> {
    await this.sendRequest({
      type: 'pause-producer',
      producerId,
    });
    console.log('[WebRTC] Producer paused:', producerId);
  }

  async resumeProducer(producerId: string): Promise<void> {
    await this.sendRequest({
      type: 'resume-producer',
      producerId,
    });
    console.log('[WebRTC] Producer resumed:', producerId);
  }

  async getProducers(roomId: string, userId: string): Promise<any[]> {
    const response = await this.sendRequest({
      type: 'get-producers',
      roomId,
      userId,
    });
    return response.data.producers || [];
  }

  private sendRequest(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const requestId = `req-${++this.messageCounter}-${Date.now()}`;
      const messageWithId = { ...message, requestId };

      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Request timeout: ${message.type}`));
      }, REQUEST_TIMEOUT);

      this.pendingRequests.set(requestId, { resolve, reject, timer });
      this.ws.send(JSON.stringify(messageWithId));
    });
  }

  private rejectAllPending(reason: string) {
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timer);
      pending.reject(new Error(reason));
    }
    this.pendingRequests.clear();
  }

  private startPing() {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING' }));
        this.pongTimer = setTimeout(() => {
          console.warn('[WebRTC] Relay pong timeout, reconnecting...');
          this.ws?.close();
        }, PONG_TIMEOUT);
      }
    }, PING_INTERVAL);
  }

  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  private handlePong() {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WebRTC] Max reconnect attempts reached');
      return;
    }

    const delay = Math.min(BASE_DELAY * Math.pow(2, this.reconnectAttempts), MAX_DELAY);
    console.log(`[WebRTC] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  sendCallRequest(targetUserId: string, callerName: string, callType: string) {
    this.ws?.send(JSON.stringify({ type: 'call-request', targetUserId, callerName, callType }));
  }

  sendCallAccepted(targetUserId: string) {
    this.ws?.send(JSON.stringify({ type: 'call-accepted', targetUserId }));
  }

  sendCallRejected(targetUserId: string) {
    this.ws?.send(JSON.stringify({ type: 'call-rejected', targetUserId }));
  }

  sendCallEnded(targetUserId: string) {
    this.ws?.send(JSON.stringify({ type: 'call-ended', targetUserId }));
  }

  sendCallCancelled(targetUserId: string) {
    this.ws?.send(JSON.stringify({ type: 'call-cancelled', targetUserId }));
  }
}
