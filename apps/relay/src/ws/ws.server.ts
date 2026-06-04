import { Server } from "http";
import { WebSocketServer as WSS } from "ws";
import { wsGateway } from "./ws.gateway.ts";

export class WebSocketServer {
    private wss: WSS;
    private wsGateWay: typeof wsGateway = wsGateway;
    constructor(private server: Server) {
        this.wss = new WSS({ server });
    }

    initialize() {
        this.wss.on("connection", (socket) => {
            console.log("client connected");

            socket.on("message", async (message) => {
                const wsGateway = this.wsGateWay;
                await wsGateway.handle(socket, message.toString());
            })

            socket.on("close", () => {
                socket.send("Disconnected");
            })
        });

    }
}