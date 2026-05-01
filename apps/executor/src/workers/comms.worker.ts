import { createCategoryWorker } from "../core/workerFactory";
import { startWorkerWithQueue } from "../core/queueIntegration";
import { commsTools } from "../tools/comms";

// Mock job queue for now (workerFactory needs it, but startWorkerWithQueue creates its own connection)
const mockJobQueue: AsyncIterableIterator<any> = {
  next: async () => ({ value: null, done: false }),
  [Symbol.asyncIterator]: function() { return this; }
};

async function main() {
  const context = await createCategoryWorker("comms", commsTools, mockJobQueue);
  
  console.log("Comms Worker Initialized. Starting queue processing...");
  
  await startWorkerWithQueue(context);
}

main().catch(console.error);