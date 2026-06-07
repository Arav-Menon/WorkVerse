import axios from "axios";
import { API_URL } from "../../utils/api";

class TransportManager {
    async getRouterCapabilities(roomId: string) {
        try {
            if (!roomId) throw new Error("roomId is required");
            const response = await axios.get(`${API_URL}/router-capabilities/${roomId}`);
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

            const response = await axios.post(`${API_URL}/create-transport`, {
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
            const response = await axios.post(`${API_URL}/connect-transport`, {
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
            const response = await axios.post(`${API_URL}/produce`, {
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
            const response = await axios.post(`${API_URL}/consume`, {
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
}

export const transportManager = new TransportManager();
