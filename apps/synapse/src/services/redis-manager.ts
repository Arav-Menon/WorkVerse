export class RedisManager {
  private subClient: any;
  private pubClient: any;
  private subscriptions: Set<string> = new Set();

  constructor(pubClient: any) {
    this.pubClient = pubClient;
    this.subClient = pubClient.duplicate();
  }

  async init() {
    await this.subClient.on("error", (err: any) =>
      console.error("Redis Sub Client Error", err),
    );
    await this.subClient.connect();
    console.log("Redis Sub Client connected");
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    if (this.subscriptions.has(channel)) return;

    this.subscriptions.add(channel);
    await this.subClient.subscribe(channel, (message: string) => {
      callback(message);
    });
  }

  async publish(channel: string, message: string) {
    await this.pubClient.publish(channel, message);
  }
}
