import { pullUserInboundPrompt } from "@repo/redis/redis-client";

while (true) {
  const userInboundPrompt = await pullUserInboundPrompt();
  if (!userInboundPrompt) continue;

  console.dir(userInboundPrompt, { depth: null });

  const stream = userInboundPrompt.response[0].message[0];

  console.log(stream);
}
