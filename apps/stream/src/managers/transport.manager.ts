import { roomManager } from "./router.manager"
import type {DtlsParameters, WebRtcTransport} from "mediasoup/types";

type PeerTransport = {
    peerId: string,
    roomId: string,
    transport: WebRtcTransport
}

class RtcTransportManager {
    private transports = new Map<string, PeerTransport>()

    async createTransport(roomId: string, peerId: string) {
        const room = await roomManager.obtainRoom(roomId);
        const router = room.router;
        const transport = await router.createWebRtcTransport({
            listenIps: [
                {
                    ip: process.env.MEDIASOUP_LISTEN_IP || "127.0.0.1",
                    announcedIp: "YOUR_PUBLIC_IP"
                }
            ],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        });
        this.transports.set(peerId, {
            peerId,
            roomId,
            transport
        });
        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
        };
    }

    async connectTransport(transportId : string , dtlsParameters: DtlsParameters) {
        const transport = this.findTransport(transportId);
        if(!transport) throw new Error("Transport not found")

        const transportConnected = await transport.connect({dtlsParameters});
        console.log(transportConnected);
    }
    findTransport(transportId: string) {
        for (const [, value]
            of this.transports) {
            if (
                value.transport.id === transportId) {
                return value.transport;
            }
        }
        return null;
    }

    closeTransport(transportId :string) {
        const transport = this.findTransport(transportId);
        if(!transport)return;
        transport.close()
    }

}

export const TransportManager = new RtcTransportManager();