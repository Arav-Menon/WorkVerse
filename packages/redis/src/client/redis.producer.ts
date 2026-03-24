import { type UserInboundPrompt } from "@repo/schemas";
import { pushToStream, type PushResult } from "../utils/redis.helper";

export const USER_INBOUND_PROMPT_STREAM = "userInboundPrompt:stream";

export const pushUserInboundPrompt = async (
  data: UserInboundPrompt,
): Promise<PushResult> => {
  return await pushToStream(USER_INBOUND_PROMPT_STREAM, data);
};
