import { Queue } from "bullmq";
import { connection } from "./connection";

export const bulkInsertChatResponseQueue = new Queue("bulk_insert_chat-response-queue", { connection });

export const bulkInsertWorkflowResponseQueue = new Queue("bulk_insert_workflow-queue", { connection });