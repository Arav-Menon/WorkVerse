import { type UserInboundPrompt } from "@repo/schemas";
import { pushToStream, type PushResult } from "../utils/redis.helper";
import { pullSubmissionPrompt, type PullResult } from "../utils/redis.helper";

export const pushUserInboundPrompt = async (
  data: UserInboundPrompt,
): Promise<PushResult> => {
  return await pushToStream(data);
};

export const pullUserInboundPrompt = async (): Promise<PullResult> => {
  return await pullSubmissionPrompt();
};
