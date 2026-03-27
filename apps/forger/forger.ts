import { pullUserInboundPrompt } from "@repo/redis/redis-client";
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
    await processWithAi({
      userId,
      organizationId,
      workspaceId,
      systemPrompt,
      userPrompt,
    });
  } catch (err) {
    console.error("Failed");
  }

  console.log(stream);
}
