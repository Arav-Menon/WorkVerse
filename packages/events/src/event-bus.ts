import { publisherRedis, subscriberRedis } from "@repo/redis";
import type { ChatCompletedEvent } from "./event.types";
import { EventEmitter } from "events";

export interface EventMap {
    "chat_completed": ChatCompletedEvent;
}

class EventBusService {
    private emitter = new EventEmitter();
    private subscribedChannels = new Set<string>();

    constructor() {
        // 1. One global Redis listener for the entire application.
        // This prevents MaxListenersExceededWarning memory leaks.
        subscriberRedis.on("message", (channel, message) => {
            try {
                const parsed = JSON.parse(message);
                // Fan-out the message locally to anyone waiting on this channel
                this.emitter.emit(channel, parsed);
            } catch (err) {
                console.error(`[EventBus] Failed to parse message on channel ${channel}`, err);
            }
        });
    }

    async publish<K extends keyof EventMap>(
        channel: K,
        payload: EventMap[K]
    ) {
        await publisherRedis.publish(channel, JSON.stringify(payload));
    }

    /**
     * Subscribe to a specific event channel continuously.
     * @param channel The Redis channel to listen to.
     * @param handler A function that runs whenever an event is received.
     * @returns A cleanup function to remove the listener.
     */
    async subscribe<K extends keyof EventMap>(
        channel: K,
        handler: (payload: EventMap[K]) => void
    ): Promise<() => void> {
        if (!this.subscribedChannels.has(channel as string)) {
            await subscriberRedis.subscribe(channel as string);
            this.subscribedChannels.add(channel as string);
        }

        this.emitter.on(channel, handler);

        return () => {
            this.emitter.off(channel, handler);
        };
    }

    /**
     * Wait for an event that matches a specific condition.
     * @param channel The Redis channel to listen to.
     * @param filterFn A function that returns true when the incoming event belongs to this request (e.g., matching promptId).
     * @param timeoutMs How long to wait before rejecting the promise.
     */
    async waitForEvent<K extends keyof EventMap>(
        channel: K,
        filterFn: (payload: EventMap[K]) => boolean,
        timeoutMs = 30000
    ): Promise<EventMap[K]> {
        // 2. Ensure Redis is subscribed to this channel (only subscribe once)
        if (!this.subscribedChannels.has(channel as string)) {
            await subscriberRedis.subscribe(channel);
            this.subscribedChannels.add(channel as string);
        }

        return new Promise((resolve, reject) => {
            let timeout: ReturnType<typeof setTimeout>;

            const handler = (payload: EventMap[K]) => {
                // 3. Correlation Check: Only resolve if it's the exact event we are waiting for
                if (filterFn(payload)) {
                    cleanup();
                    resolve(payload);
                }
            };

            const cleanup = () => {
                clearTimeout(timeout);
                this.emitter.off(channel, handler);
            };

            timeout = setTimeout(() => {
                cleanup();
                reject(new Error(`Event timeout on channel: ${channel}`));
            }, timeoutMs);

            // Listen internally rather than attaching directly to the Redis client
            this.emitter.on(channel, handler);
        });
    }
}

// Export a singleton instance
export const EventBus = new EventBusService();
