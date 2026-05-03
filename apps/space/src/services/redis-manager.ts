export class RedisManager {
    private pubClient: any;
    private subClient: any

    constructor(pubClient: any) {
        this.pubClient = pubClient;
        this.subClient = pubClient.duplicate();
    }

    async init() {
        await this.subClient.on("error", (err: any) =>
            console.log("Redis Sub Client Error", err),
        )
        await this.subClient.connect();
        console.log("Redis sub client is connected")
    }
}