import type { FastifyInstance } from "fastify";
import os from "node:os";

import { WorkerManager } from "../managers/worker.manager";
import { RoomManager } from "../managers/room.manager";

type HealthRouteDeps = {
    workerManager: WorkerManager;
    roomManager: RoomManager;
};

export async function healthRoutes(
    app: FastifyInstance,
    deps: HealthRouteDeps
) {
    const {
        workerManager,
        roomManager,
    } = deps;

    app.get(
        "/health",
        async (_, reply) => {
            try {
                const workers =
                    workerManager.getAllWorkers();

                const rooms =
                    roomManager.getAllRooms();

                return reply.status(200).send({
                    status: "ok",

                    service: "stream",

                    timestamp:
                        new Date().toISOString(),

                    uptime:
                        Math.floor(
                            process.uptime()
                        ),

                    workers: {
                        total:
                        workers.length,

                        pids:
                            workers.map(
                                (worker) =>
                                    worker.pid
                            ),
                    },

                    rooms: {
                        active:
                        rooms.size,
                    },

                    system: {
                        cpuCores:
                        os.cpus().length,

                        memory: {
                            totalMB:
                                Math.round(
                                    os.totalmem() /
                                    1024 /
                                    1024
                                ),

                            freeMB:
                                Math.round(
                                    os.freemem() /
                                    1024 /
                                    1024
                                ),
                        },

                        loadAverage:
                            os.loadavg(),
                    },
                });
            } catch (error) {
                app.log.error(error);

                return reply
                    .status(500)
                    .send({
                        status: "error",
                        message:
                            "Health check failed",
                    });
            }
        }
    );
}