import { fastify } from "./server";
import { workerManager } from "./managers/worker.manager";

const start = async () => {
    try {
        await workerManager.init();
        console.log(`[Stream] MediaSoup workers initialized (${workerManager.getAllWorker().length} workers)`);

        fastify.listen(
            { port: Number(process.env.PORT ?? 3010), host: "0.0.0.0" },
            (err: any, address: string) => {
                if (err) {
                    fastify.log.error(err);
                    process.exit(1);
                }
                fastify.log.info(`[Stream] Server listening on ${address}`);
            },
        );
    } catch (err) {
        console.error("[Stream] Failed to initialize workers:", err);
        process.exit(1);
    }
};

start();
