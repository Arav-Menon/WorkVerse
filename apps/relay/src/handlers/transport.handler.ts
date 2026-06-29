import axios from "axios";
import { API_URL } from "../../utils/api";

const SFU_BASE = API_URL;

class TransportManager {
    async getRouterCapabilities(roomId: string) {
        try {
            if (!roomId) throw new Error("roomId is required");
            const response = await axios.get(`${SFU_BASE}/router-capabilities/${roomId}`);
            return response.data;
        } catch (err) {
            console.error("Error getting router capabilities:", err);
            throw err;
        }
    }

    async createTransport(roomId: string, userId: string) {
        try {
            if (!roomId || !userId) {
                throw new Error("roomId and userId are required to create a transport");
            }

            const response = await axios.post(`${SFU_BASE}/create-transport`, {
                roomId,
                userId
            });

            return response.data;

        } catch (err) {
            console.error("Error creating transport:", err);
            throw err;
        }
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
