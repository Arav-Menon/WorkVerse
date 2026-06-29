export class RedisManager {
  private subClient: any;
  private pubClient: any;
  private callbacks: Map<string, (message: string) => void> = new Map();

  constructor(pubClient: any) {
    this.pubClient = pubClient;
    this.subClient = pubClient.duplicate();
  }

  async init() {
    this.subClient.on("error", (err: any) => {
      console.error("Redis Sub Client Error", err);
    });

    this.subClient.on("message", (channel: string, message: string) => {
      const callback = this.callbacks.get(channel);
      if (callback) {
        callback(message);
      }
    });

    await this.subClient.connect();
    console.log("Redis Sub Client connected");
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    if (this.callbacks.has(channel)) return;

    this.callbacks.set(channel, callback);
    await this.subClient.subscribe(channel);
  }

  async publish(channel: string, message: string) {
    await this.pubClient.publish(channel, message);
  }
}
