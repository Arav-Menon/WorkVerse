import { Queue } from "bullmq";
import { connection } from "./connection";

export const inviteQueue = new Queue("invite-queue", {
  connection,
});
