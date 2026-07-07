export class RedisManager {
    private pubClient: any;
    private subClient: any;
    private subConnected = false;
    private pubConnected = false;
    private messageHandlers: Map<string, (message: string) => void> = new Map();

    constructor(pubClient: any) {
        this.pubClient = pubClient;
        this.subClient = pubClient.duplicate();
    }

    async init() {
        this.subClient.on("error", () => {});
        this.pubClient.on("error", () => {});

        // Handle messages via the 'message' event (ioredis standard API)
        this.subClient.on("message", (channel: string, message: string) => {
            const handler = this.messageHandlers.get(channel);
            if (handler) {
                handler(message);
            }
        });

        await Promise.all([
            this.subClient.connect(),
            this.pubClient.connect()
        ]);

        this.subConnected = true;
        this.pubConnected = true;
    }

    async subscribe(channel: string, callback: (message: string) => void) {
        if (!this.subConnected) {
            try {
                await this.subClient.connect();
                this.subConnected = true;
            } catch (err: any) {
                if (err.message?.includes("already connecting")) {
                    // Already connecting, just wait
                } else {
                    throw err;
                }
            }
        }

        // Store handler for this channel
        this.messageHandlers.set(channel, callback);

        // Subscribe if not already subscribed to this channel
        // ioredis deduplicates subscriptions internally
        await this.subClient.subscribe(channel);
    }

    async unsubscribe(channel: string) {
        this.messageHandlers.delete(channel);
        await this.subClient.unsubscribe(channel);
    }

    async publish(channel: string, message: any) {
        if (!this.pubConnected) {
            try {
                await this.pubClient.connect();
                this.pubConnected = true;
            } catch (err: any) {
                if (err.message?.includes("already connecting")) {
                    // Already connecting, just wait
                } else {
                    throw err;
                }
            }
        }
        const payload = typeof message === "string" ? message : JSON.stringify(message);
        await this.pubClient.publish(channel, payload);
    }
}
