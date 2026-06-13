import {
  type UserCommsJobBody,
  type UserWorkflowJobBody,
} from "@repo/schemas";
import {
  pushToWorkflow,
  pullSubmissionPrompt,
  pullWorkflowJSON,
  type PushResult,
  type PullResult,
  pushCommsStream,
  pullCommsStream,
} from "../utils/redis.helper";

export const pullUserInboundPrompt = async (): Promise<PullResult> => {
  return await pullSubmissionPrompt();
};

//push workflow queue.
export const pushUserWorkflowJob = async (
  data: UserWorkflowJobBody,
): Promise<PushResult> => {
  return await pushToWorkflow(data);
};

//pull worflow queue.
export const pullUserWorkflowJob = async (): Promise<PullResult> => {
  return await pullWorkflowJSON();
};
export const pushToUserCommsStream = async (data: UserCommsJobBody): Promise<PushResult> => {
  return await pushCommsStream(data)
}

export const pullUserCommsStream = async (): Promise<PullResult> => {
  return await pullCommsStream()
}