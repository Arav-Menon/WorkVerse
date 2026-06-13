import { Queue } from "bullmq";
import { connection } from "./connection";

export const chatQueue = new Queue("chat_response-queue", {
    connection
})