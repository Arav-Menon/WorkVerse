import type { Router, RtpCodecCapability } from "mediasoup/types";
import { workerManager } from "./worker.manager.ts";

type Room = {
    roomId: string,
    router: Router
}

export class RoomManager {
    private rooms = new Map<string, Room>();
    private mediaCodecs: RtpCodecCapability[] | any = [
        {
            kind: "audio",
            mimeType: "audio/opus",
            clockRate: 48000,
            channels: 2,
        },
        {
            kind: "video",
            mimeType: "video/VP8",
            clockRate: 90000,

        },
    ];

    constructor(private WorkerManager: typeof workerManager) { }


    async obtainRoom(roomId: string) {
        const existingRoom = this.rooms.get(roomId);

        if (existingRoom) {
            return existingRoom;
        }

        const worker = this.WorkerManager.getWorker();

        console.log(worker.pid, worker);

        const router = await worker.createRouter({
            mediaCodecs: this.mediaCodecs
        })

        const room: Room = { roomId, router };

        console.log(room)

        this.rooms.set(roomId, room);

        return room;
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    removeRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        try {
            room.router.close();
        } catch (e) {
            // Already closed
        }

        this.rooms.delete(roomId);
        console.log(`[RoomManager] Removed room ${roomId}`);
    }
}

export const roomManager = new RoomManager(workerManager)