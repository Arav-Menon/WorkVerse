import fastify from "fastify";
import { client } from "@repo/redis/redis-client"
import { WebSocketServer } from "./ws/ws.server";

export const bootstrap = async () => {
    try {
        const app = fastify({
            logger: true
        })

        await client.connect();

        const wsServer = new WebSocketServer(app.server)
        wsServer.initialize();

        app.log.info("Ws server started")
        return app;

    } catch (err: any) {
        console.error(err)
        process.exit(1)
    }
}