/**
 * Example: Communications Worker
 * Handles all comms-related tools (Slack, Email, Teams, etc.)
 */

import { createCategoryWorker, startWorker } from "../core/workerFactory";
import { slack_tool } from "../tools/comms";

// Register all communication tools here
const commsTools = {
  "slack-send-message": async (params: { channel: string; message: string }) => {
    // Implementation
    return { type: "text", text: "Message sent" };
  },
  "slack-get-messages": async (params: { channel: string }) => {
    // Implementation
    return { type: "text", text: "Messages retrieved" };
  },
  "email-send": async (params: { to: string; subject: string; body: string }) => {
    // Implementation
    return { type: "text", text: "Email sent" };
  },
  // Add more comms tools...
};

async function main() {
  try {
    // Create worker context with all comms tools
    const workerContext = await createCategoryWorker(
      "comms",
      commsTools,
      // Queue iterator would go here
      (async function* () {})()
    );

    console.log(`✅ Worker initialized:`, {
      category: workerContext.category,
      workerId: workerContext.workerId,
      toolCount: workerContext.toolRegistry.tools.size,
    });

    // Start the worker
    await startWorker(workerContext);
  } catch (error) {
    console.error("❌ Worker startup failed:", error);
    process.exit(1);
  }
}

main();
