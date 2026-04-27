import { pullUserCommsStream } from "@repo/redis/redis-client";

export const createCommsWorker = async (toolMap: Record<string, Function>) => {
    return async function start() {
        while (true) {
            const response = await pullUserCommsStream();
            console.log(response);
            console.log(toolMap)

        }
    };
};