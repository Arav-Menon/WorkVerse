import type { Worker } from "mediasoup/types"
import os from "os"
import * as mediasoup from "mediasoup"
import * as console from "node:console";
import * as process from "node:process";

class WorkerManager {
    private workers: Worker<any>[];
    private cpus = os.cpus();
    private currentIndex = 0;

    constructor() {
        this.workers = [];
    }

    async init() {
        const cpuCount = this.cpus;
        for (let i = 0; i < cpuCount.length; i++) {
            const worker = await mediasoup.createWorker({
                rtcMinPort: 40000,
                rtcMaxPort: 49999,
                logLevel: "debug",
                logTags: ["info", "ice", "dtls", "rtp", "rtcp"]
            })

            console.log(worker)

            worker.on("died", () => {
                console.error(`Worker ${worker.pid} died`);
                setTimeout(() => process.exit(1), 2000);
            })
            this.workers.push(worker);
        }
    }

    getWorker(): Worker {
        const worker = this.workers[this.currentIndex % this.workers.length];
        if (!worker) {
            throw new Error("No Mediasoup workers are currently available.");
        }
        this.currentIndex++;
        return worker;
    }

    getAllWorker() {
        return this.workers;
    }
}

export const workerManager = new WorkerManager();