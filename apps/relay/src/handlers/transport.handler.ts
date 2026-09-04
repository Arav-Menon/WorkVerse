import axios from "axios";
import { API_URL } from "../../utils/api";

const SFU_BASE = API_URL;

async function requestWithRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 2000): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            const isLast = attempt === retries;
            const isConnRefused = err?.code === 'ECONNREFUSED';
            if (isLast || !isConnRefused) throw err;
            console.warn(`[Relay] Stream not ready (attempt ${attempt}/${retries}), retrying in ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
    throw new Error("Unreachable");
}

class TransportManager {
    async getRouterCapabilities(roomId: string) {
        if (!roomId) throw new Error("roomId is required");
        return requestWithRetry(() =>
            axios.get(`${SFU_BASE}/router-capabilities/${roomId}`).then(r => r.data)
        );
    }

    async createTransport(roomId: string, userId: string) {
        if (!roomId || !userId) {
            throw new Error("roomId and userId are required to create a transport");
        }
        return requestWithRetry(() =>
            axios.post(`${SFU_BASE}/create-transport`, { roomId, userId }).then(r => r.data)
        );
    }

    async connectTransport(transportId: string, dtlsParameters: any) {
        try {
            const response = await axios.post(`${SFU_BASE}/connect-transport`, {
                transportId,
                dtlsParameters
            });
            return response.data;
        } catch (err) {
            console.error("Error connecting transport:", err);
            throw err;
        }
    }

    async produce(transportId: string, kind: string, rtpParameters: any, roomId: string, userId: string) {
        try {
            const response = await axios.post(`${SFU_BASE}/produce`, {
                transportId,
                kind,
                rtpParameters,
                roomId,
                userId
            });
            return response.data;
        } catch (err) {
            console.error("Error producing:", err);
            throw err;
        }
    }

    async consume(transportId: string, producerId: string, rtpCapabilities: any, roomId: string, userId: string) {
        try {
            const response = await axios.post(`${SFU_BASE}/consume`, {
                transportId,
                producerId,
                rtpCapabilities,
                roomId,
                userId
            });
            return response.data;
        } catch (err) {
            console.error("Error consuming:", err);
            throw err;
        }
    }

    async resumeConsumer(consumerId: string) {
        try {
            const response = await axios.post(`${SFU_BASE}/resume-consumer`, {
                consumerId
            });
            return response.data;
        } catch (err) {
            console.error("Error resuming consumer:", err);
            throw err;
        }
    }

    async getProducers(roomId: string, userId: string) {
        try {
            const response = await axios.get(`${SFU_BASE}/producers/${roomId}/${userId}`);
            return response.data;
        } catch (err) {
            console.error("Error getting producers:", err);
            throw err;
        }
    }

    async pauseProducer(producerId: string) {
        try {
            const response = await axios.post(`${SFU_BASE}/pause-producer`, {
                producerId
            });
            return response.data;
        } catch (err) {
            console.error("Error pausing producer:", err);
            throw err;
        }
    }

    async resumeProducer(producerId: string) {
        try {
            const response = await axios.post(`${SFU_BASE}/resume-producer`, {
                producerId
            });
            return response.data;
        } catch (err) {
            console.error("Error resuming producer:", err);
            throw err;
        }
    }

    async removePeer(roomId: string, userId: string) {
        try {
            const response = await axios.post(`${SFU_BASE}/remove-peer`, {
                roomId,
                userId
            });
            return response.data;
        } catch (err) {
            console.error("Error removing peer:", err);
            throw err;
        }
    }
}

export const transportManager = new TransportManager();
