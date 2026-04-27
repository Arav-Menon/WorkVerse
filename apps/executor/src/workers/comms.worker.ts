import { createCommsWorker } from "../core";
import { commsTool } from "../tools/comms";

const worker = await createCommsWorker(commsTool)

console.log("Worker started")
console.log(JSON.stringify(worker))

worker()