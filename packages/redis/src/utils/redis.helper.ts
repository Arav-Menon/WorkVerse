import { client } from "../config";

const DEFAULT_MAX_STREAM_LENGTH = 10000;
const WORKER_ID = "worker:id ";
const USER_INBOUND_PROMPT_STREAM = "userInboundPrompt:stream";

export type PushResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export type PullResult = {
  success: boolean;
  response?: any;
  error?: string;
};

export const pushToStream = async (
  data: Record<string, any>,
  maxLen: number = DEFAULT_MAX_STREAM_LENGTH,
): Promise<PushResult> => {
  try {
    const messageId = await client.xAdd(USER_INBOUND_PROMPT_STREAM, "*", data, {
      TRIM: {
        strategy: "MAXLEN",
        strategyModifier: "~",
        threshold: maxLen,
      },
    });

    return { success: true, id: messageId };
  } catch (error) {
    console.error(
      `[Redis Helper] Failed to push to stream "${USER_INBOUND_PROMPT_STREAM}":`,
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export type StreamResult = {
  id: string;
  message: Record<string, string>;
};
export const pullSubmissionPrompt = async (
  group = "worker-group",
  consumer = WORKER_ID,
): Promise<PullResult> => {
  try {
    const response = await client.xReadGroup(
      group,
      consumer,
      [{ key: USER_INBOUND_PROMPT_STREAM, id: ">" }],
      { COUNT: 1, BLOCK: 5000 },
    );

    return { success: true, response: response };
  } catch (err) {
    console.error(
      `[Redis Helper] Failed to pull from stream "${USER_INBOUND_PROMPT_STREAM}":`,
      err,
    );
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
};
