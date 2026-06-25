import type { ServerEvent, SpaceUser } from '../phaser/types/arena.types';

export interface SpaceClientOptions {
  wsUrl: string;
  token: string;
  userId: string;
  organizationId: string;
  workspaceId: string;
  spaceId: string;
  onSpaceState?: (users: SpaceUser[], chatHistory: any[]) => void;
  onUserJoined?: (user: SpaceUser) => void;
  onUserLeft?: (userId: string) => void;
  onPlayerMoved?: (userId: string, position: { x: number; y: number }) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onOnlineCount?: (count: number) => void;
}

const MAX_RECONNECT_ATTEMPTS = 15;
const BASE_DELAY = 1000;
const MAX_DELAY = 10000;
const PING_INTERVAL = 25000;
const PONG_TIMEOUT = 10000;
const MOVE_THROTTLE_MS = 50;

export class SpaceClient {
  private ws: WebSocket | null = null;
  private options: SpaceClientOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualClose = false;
  private lastMoveTime = 0;
  private onlineCount = 0;

  constructor(options: SpaceClientOptions) {
    this.options = options;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isManualClose = false;

    const params = new URLSearchParams({
      token: this.options.token,
      orgId: this.options.organizationId,
      workspaceId: this.options.workspaceId,
    });

    const ws = new WebSocket(`${this.options.wsUrl}?${params.toString()}`);

    ws.onopen = () => {
      console.log("[SpaceClient] Connected");
      this.reconnectAttempts = 0;
      this.ws = ws;
      this.options.onConnect?.();
      this.startPing();
      this.joinSpace();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerEvent;

        if (data.type === "PONG") {
          this.handlePong();
          return;
        }

        if (data.type === "SPACE_STATE") {
          console.log(`[SpaceClient] Space synced: ${data.users.length} users`);
          this.onlineCount = data.users.length;
          this.options.onSpaceState?.(data.users, data.chatHistory);
          this.options.onOnlineCount?.(this.onlineCount);
          return;
        }

        if (data.type === "USER_JOINED") {
          console.log(`[PRESENCE_UPDATE] USER_JOINED userId=${data.user.userId} username=${data.user.username} onlineCount=${data.onlineCount}`);
          this.onlineCount = data.onlineCount;
          this.options.onUserJoined?.(data.user);
          this.options.onOnlineCount?.(this.onlineCount);
          return;
        }

        if (data.type === "USER_LEFT") {
          console.log(`[PRESENCE_UPDATE] USER_LEFT userId=${data.userId} onlineCount=${data.onlineCount}`);
          this.onlineCount = data.onlineCount;
          this.options.onUserLeft?.(data.userId);
          this.options.onOnlineCount?.(this.onlineCount);
          return;
        }

        if (data.type === "SPACE_PRESENCE_UPDATED") {
          console.log(`[PRESENCE_UPDATE] SPACE_PRESENCE_UPDATED onlineCount=${data.onlineCount}`);
          this.onlineCount = data.onlineCount;
          this.options.onOnlineCount?.(this.onlineCount);
          return;
        }

        if (data.type === "PLAYER_MOVED") {
          this.options.onPlayerMoved?.(data.userId, data.position);
          return;
        }

        if (data.type === "INFO") {
          console.log(`[SpaceClient] ${data.message}`);
          if (data.activeUsers !== undefined) {
            this.onlineCount = data.activeUsers;
            this.options.onOnlineCount?.(this.onlineCount);
          }
          return;
        }

        if (data.type === "ERROR") {
          console.error(`[SpaceClient] Server error: ${data.message}`);
          return;
        }

      } catch {
        // Non-JSON message (legacy string messages)
        console.log(`[SpaceClient] ${event.data}`);
      }
    };

    ws.onclose = () => {
      console.log("[SpaceClient] Disconnected");
      this.ws = null;
      this.stopPing();
      this.options.onDisconnect?.();

      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
    };

    ws.onerror = (err) => {
      console.error("[SpaceClient] WebSocket error:", err);
    };
  }

  disconnect() {
    this.isManualClose = true;
    this.stopPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  leave() {
    console.log(`[CLIENT] Sending SPACE_LEAVE`);
    this.send({ type: "SPACE_LEAVE" });
    this.isManualClose = true;
    this.stopPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    // Close after a brief delay to ensure the SPACE_LEAVE message is sent
    setTimeout(() => {
      this.ws?.close(1000);
      this.ws = null;
    }, 100);
  }

  private joinSpace() {
    this.send({
      type: "SPACE_JOIN",
      userId: this.options.userId,
      organizationId: this.options.organizationId,
      workspaceId: this.options.workspaceId,
      spaceId: this.options.spaceId,
    });
  }

  move(x: number, y: number) {
    const now = Date.now();
    if (now - this.lastMoveTime < MOVE_THROTTLE_MS) return;
    this.lastMoveTime = now;

    this.send({
      type: "PLAYER_MOVE",
      payload: { x, y },
    });
  }

  send(event: any) {
    const msg = JSON.stringify(event);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getOnlineCount(): number {
    return this.onlineCount;
  }

  private startPing() {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "PING" }));
        this.pongTimer = setTimeout(() => {
          console.warn("[SpaceClient] Pong timeout, reconnecting...");
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
      console.error("[SpaceClient] Max reconnect attempts reached");
      return;
    }

    const delay = Math.min(BASE_DELAY * Math.pow(2, this.reconnectAttempts), MAX_DELAY);
    console.log(`[SpaceClient] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
}
