export type TrackedProducer = {
    producerId: string;
    roomId: string;
    userId: string;
    kind: "audio" | "video";
};

type ProducerEvent = {
    type: 'producer-added' | 'producer-removed';
    producer: TrackedProducer;
};

class ProducerManager {
    private producers = new Map<string, TrackedProducer>();
    private listeners: ((event: ProducerEvent) => void)[] = [];

    onEvent(listener: (event: ProducerEvent) => void) {
        this.listeners.push(listener);
    }

    private emit(event: ProducerEvent) {
        for (const listener of this.listeners) {
            try { listener(event); } catch {}
        }
    }

    trackProducer(producerId: string, roomId: string, userId: string, kind: "audio" | "video") {
        const producer: TrackedProducer = { producerId, roomId, userId, kind };
        this.producers.set(producerId, producer);
        console.log(`[ProducerManager] Tracked producer ${producerId} user=${userId} room=${roomId} kind=${kind}`);
        this.emit({ type: 'producer-added', producer });
    }

    removeProducer(producerId: string) {
        const producer = this.producers.get(producerId);
        if (producer) {
            this.producers.delete(producerId);
            console.log(`[ProducerManager] Removed producer ${producerId} user=${producer.userId}`);
            this.emit({ type: 'producer-removed', producer });
        }
    }

    getProducersForRoom(roomId: string): TrackedProducer[] {
        const result: TrackedProducer[] = [];
        for (const producer of this.producers.values()) {
            if (producer.roomId === roomId) {
                result.push(producer);
            }
        }
        return result;
    }

    getProducersForRoomExcluding(roomId: string, excludeUserId: string): TrackedProducer[] {
        const result: TrackedProducer[] = [];
        for (const producer of this.producers.values()) {
            if (producer.roomId === roomId && producer.userId !== excludeUserId) {
                result.push(producer);
            }
        }
        return result;
    }

    removeProducersForUser(roomId: string, userId: string) {
        const toRemove: string[] = [];
        for (const [id, producer] of this.producers.entries()) {
            if (producer.roomId === roomId && producer.userId === userId) {
                toRemove.push(id);
            }
        }
        for (const id of toRemove) {
            this.producers.delete(id);
        }
        if (toRemove.length > 0) {
            console.log(`[ProducerManager] Removed ${toRemove.length} producers for user=${userId} room=${roomId}`);
        }
        return toRemove;
    }

    getProducer(producerId: string): TrackedProducer | undefined {
        return this.producers.get(producerId);
    }
}

export const producerManager = new ProducerManager();
