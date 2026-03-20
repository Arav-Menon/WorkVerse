import { Worker } from "bullmq";
import { sendInviteEmail } from "@repo/email";
import { connection } from "@repo/queue";

export const worker = new Worker(
  "invite-queue",
  async (job) => {
    const { inviteLink, email, name } = job.data;
    console.log(`Processing invite for ${email}...`);

    try {
      await sendInviteEmail(email, name, inviteLink);
      console.log(`Successfully sent invite to ${email}`);
    } catch (error) {
      console.error(`Failed to send invite to ${email}:`, error);
      throw error;
    }
  },
  { connection },
);

console.log("Mail Forge Worker started...");
