export interface FluxMessage {
  type: "prompt_queued" | "chat_completed" | "workflow_status" | "mcp_completed" | "error";
  promptId?: string;
  content?: string;
  status?: string;
  message?: string;
  error?: string;
  workflowDbId?: string;
  workflowId?: string;
  workflowName?: string;
  workflowUrl?: string;
  integrations?: string[];
  steps?: { id: string; service: string; action: string }[];
}

export interface FluxClientOptions {
  wsUrl: string;
  token: string;
  workspaceId: string;
  spaceId: string;
  organizationId: string;
  onMessage?: (msg: FluxMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_DELAY = 1000;
const MAX_DELAY = 8000;
const PING_INTERVAL = 30000;
const PONG_TIMEOUT = 10000;

export class FluxClient {
  private ws: WebSocket | null = null;
  private options: FluxClientOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualClose = false;
  private messageBuffer: any[] = [];

  constructor(options: FluxClientOptions) {
    this.options = options;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isManualClose = false;

    const ws = new WebSocket(this.options.wsUrl);

    ws.onopen = () => {
      console.log("[FluxClient] Connected");
      this.reconnectAttempts = 0;
      this.ws = ws;
      this.options.onConnect?.();
      this.startPing();
      this.flushBuffer();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "pong") {
          this.handlePong();
          return;
        }

        this.options.onMessage?.(data as FluxMessage);
      } catch {
        console.warn("[FluxClient] Failed to parse message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("[FluxClient] Disconnected");
      this.ws = null;
      this.stopPing();
      this.options.onDisconnect?.();

      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
    };

    ws.onerror = (err) => {
      console.error("[FluxClient] WebSocket error:", err);
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

  send(payload: {
    token: string;
    workspaceId: string;
    spaceId: string;
    organizationId: string;
    userPrompt: string;
  }) {
    const msg = JSON.stringify(payload);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    } else {
      this.messageBuffer.push(msg);
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private flushBuffer() {
    while (this.messageBuffer.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const msg = this.messageBuffer.shift();
      this.ws.send(msg);
    }
  }

  private startPing() {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
        this.pongTimer = setTimeout(() => {
          console.warn("[FluxClient] Pong timeout, reconnecting...");
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
      console.error("[FluxClient] Max reconnect attempts reached");
      return;
    }

    const delay = Math.min(BASE_DELAY * Math.pow(2, this.reconnectAttempts), MAX_DELAY);
    console.log(`[FluxClient] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
}
