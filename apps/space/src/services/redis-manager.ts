export class RedisManager {
    private pubClient: any;
    private subClient: any

    constructor(pubClient: any) {
        this.pubClient = pubClient;
        this.subClient = pubClient.duplicate();
    }

    async init() {
        this.subClient.on("error", (err: any) =>
            console.log("Redis Sub Client Error", err),
        );
        this.pubClient.on("error", (err: any) =>
            console.log("Redis Pub Client Error", err),
        );

        await Promise.all([
            this.subClient.connect(),
            this.pubClient.connect()
        ]);

        console.log("Redis Pub and Sub clients are connected");
    }
    async subscribe(channel: string, callback: (message: string) => void) {
        if (!this.subClient.isOpen) {
            await this.subClient.connect();
        }
        await this.subClient.subscribe(channel, callback);
    }

    async publish(channel: string, message: any) {
        if (!this.pubClient.isOpen) {
            await this.pubClient.connect();
        }
        const payload = typeof message === "string" ? message : JSON.stringify(message);
        await this.pubClient.publish(channel, payload);
    }
}