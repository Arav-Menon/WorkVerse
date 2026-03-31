import {
  pullUserInboundPrompt,
  pushUserWorkflowJob,
} from "@repo/redis/redis-client";
import { processWithAi } from "@repo/evaluator";

while (true) {
  const userInboundPrompt = await pullUserInboundPrompt();
  if (!userInboundPrompt || !userInboundPrompt.response) continue;

  console.dir(userInboundPrompt, { depth: null });

  const stream = userInboundPrompt.response[0]?.messages[0]?.message;
  if (!stream) continue;

  console.log(stream);

  const { userId, organizationId, workspaceId, systemPrompt, userPrompt } =
    stream;

  try {
    const parsed = await processWithAi({
      systemPrompt,
      userPrompt,
    });

    if (parsed?.type === "workflow") {
      await pushUserWorkflowJob({
        userId,
        parsed: JSON.stringify(parsed),
        organizationId,
        workspaceId,
      });
    } else {
      console.log(JSON.stringify(parsed));
    }
  } catch (err) {
    console.error("Failed, to push to queue");
  }

  console.log(stream);
}
