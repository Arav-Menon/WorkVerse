import {
  type UserCommsJobBody,
  type UserInboundPrompt,
  type UserWorkflowJobBody,
} from "@repo/schemas";
import {
  pushToStream,
  pushToWorkflow,
  pullSubmissionPrompt,
  pullWorkflowJSON,
  type PushResult,
  type PullResult,
  pushCommsStream,
  pullCommsStream,
} from "../utils/redis.helper";

export const pushUserInboundPrompt = async (
  data: UserInboundPrompt,
): Promise<PushResult> => {
  return await pushToStream(data);
};

export const pullUserInboundPrompt = async (): Promise<PullResult> => {
  return await pullSubmissionPrompt();
};

export const pushUserWorkflowJob = async (
  data: UserWorkflowJobBody,
): Promise<PushResult> => {
  return await pushToWorkflow(data);
};

export const pullUserWorkflowJob = async (): Promise<PullResult> => {
  return await pullWorkflowJSON();
};
export const pushToUserCommsStream = async (data: UserCommsJobBody): Promise<PushResult> => {
  return await pushCommsStream(data)
}

export const pullUserCommsStream = async (): Promise<PullResult> => {
  return await pullCommsStream()
}