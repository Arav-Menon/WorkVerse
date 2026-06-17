import { client } from "../connection/config";
import {
  USER_COMMS_JOB_STREAM,
  USER_INBOUND_PROMPT_STREAM,
  USER_WORKFLOW_JOB_STREAM,
  USER_MCP_JOB_STREAM,
} from "./stream";
import os from "os";

const DEFAULT_MAX_STREAM_LENGTH = 10000;
const WORKER_ID = "worker:" + os.hostname();

export type PushResult = {
  success: boolean;
  id?: string;
  error?: string;
  statusCode?: number;
};

export type PullResult = {
  success: boolean;
  response?: any;
  error?: string;
  statusCode?: number;
};

export type StreamResult = {
  id: string;
  message: Record<string, string>;
};

const parseStreamResponse = (response: any) => {
  if (!response) return response;
  return response.map(([name, messages]: any) => ({
    name,
    messages: messages.map(([id, keyValues]: any) => {
      const message: Record<string, string> = {};
      for (let i = 0; i < keyValues.length; i += 2) {
        message[keyValues[i]] = keyValues[i + 1];
      }
      return { id, message };
    }),
  }));
};

export const pushToWorkflow = async (
  data: Record<string, any>,
  maxLen: number = DEFAULT_MAX_STREAM_LENGTH,
): Promise<PushResult> => {
  try {
    const flatData = Object.entries(data).reduce((acc, [k, v]) => acc.concat(k, typeof v === "string" ? v : JSON.stringify(v)), [] as string[]);
    const messageId = await client.xadd(
      USER_WORKFLOW_JOB_STREAM,
      "MAXLEN",
      "~",
      maxLen,
      "*",
      ...flatData
    );

    return { success: true, id: messageId! };
  } catch (error: any) {
    console.error(
      `[Redis Helper] Failed to push to stream "${USER_WORKFLOW_JOB_STREAM}":`,
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: error.statusCode,
    };
  }
};

export const pullWorkflowJSON = async (
  group = "workflow-worker-group",
  consumer = WORKER_ID,
): Promise<PullResult> => {
  try {
    const response = await client.xreadgroup(
      "GROUP",
      group,
      consumer,
      "COUNT",
      1,
      "BLOCK",
      5000,
      "STREAMS",
      USER_WORKFLOW_JOB_STREAM,
      ">"
    );

    return { success: true, response: parseStreamResponse(response) };
  } catch (err: any) {
    console.error(
      `[Redis Helper] Failed to pull from stream "${USER_WORKFLOW_JOB_STREAM}":`,
      err,
    );
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
      statusCode: err.statusCode,
    };
  }
};


export const pullSubmissionPrompt = async (
  group = "submission-worker-group",
  consumer = WORKER_ID,
): Promise<PullResult> => {
  try {
    const response = await client.xreadgroup(
      "GROUP",
      group,
      consumer,
      "COUNT",
      1,
      "BLOCK",
      5000,
      "STREAMS",
      USER_INBOUND_PROMPT_STREAM,
      ">"
    );

    return { success: true, response: parseStreamResponse(response) };
  } catch (error: any) {
    console.error(
      `[Redis Helper] Failed to pull from stream "${USER_INBOUND_PROMPT_STREAM}":`,
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: error.statusCode,
    };
  }
};



export const pushCommsStream = async (
  data: Record<string, any>,
  maxLen: number = DEFAULT_MAX_STREAM_LENGTH,
): Promise<PushResult> => {
  try {
    const normalizedData: Record<string, string> = Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[key] = typeof value === "string" ? value : JSON.stringify(value);
        return acc;
      },
      {} as Record<string, string>,
    );

    const flatData = Object.entries(normalizedData).reduce((acc, [k, v]) => acc.concat(k, v), [] as string[]);
    const messageId = await client.xadd(
      USER_COMMS_JOB_STREAM,
      "MAXLEN",
      "~",
      maxLen,
      "*",
      ...flatData
    );

    return { success: true, id: messageId! };
  } catch (err: any) {
    console.error(
      `[Redis Helper] Failed to push to stream "${USER_COMMS_JOB_STREAM}":`,
      err,
    );

    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
      statusCode: err.statusCode,
    };
  }
};

export const pullCommsStream = async (
  group = "comms-worker-group",
  consumer = WORKER_ID,
): Promise<PullResult> => {
  try {
    const response = await client.xreadgroup(
      "GROUP",
      group,
      consumer,
      "COUNT",
      1,
      "BLOCK",
      5000,
      "STREAMS",
      USER_COMMS_JOB_STREAM,
      ">"
    );
    return { success: true, response: parseStreamResponse(response) };
  } catch (err: any) {
    console.error(
      `[Redis Helper] Failed to pull from stream "${USER_COMMS_JOB_STREAM}":`,
      err,
    );
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
      statusCode: err.statusCode,
    };
  }
};

export const pushToMcp = async (
  data: Record<string, any>,
  maxLen: number = DEFAULT_MAX_STREAM_LENGTH,
): Promise<PushResult> => {
  try {
    const flatData = Object.entries(data).reduce((acc, [k, v]) => acc.concat(k, typeof v === "string" ? v : JSON.stringify(v)), [] as string[]);
    const messageId = await client.xadd(
      USER_MCP_JOB_STREAM,
      "MAXLEN",
      "~",
      maxLen,
      "*",
      ...flatData
    );

    return { success: true, id: messageId! };
  } catch (error: any) {
    console.error(
      `[Redis Helper] Failed to push to stream "${USER_MCP_JOB_STREAM}":`,
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: error.statusCode,
    };
  }
};

export const pullMcpJSON = async (
  group = "mcp-worker-group",
  consumer = WORKER_ID,
): Promise<PullResult> => {
  try {
    const response = await client.xreadgroup(
      "GROUP",
      group,
      consumer,
      "COUNT",
      1,
      "BLOCK",
      5000,
      "STREAMS",
      USER_MCP_JOB_STREAM,
      ">"
    );

    return { success: true, response: parseStreamResponse(response) };
  } catch (err: any) {
    if (err.message && err.message.includes("NOGROUP")) {
      try {
        await client.xgroup("CREATE", USER_MCP_JOB_STREAM, group, "0", "MKSTREAM");
        return await pullMcpJSON(group, consumer);
      } catch (createErr: any) {
        if (!createErr.message.includes("BUSYGROUP")) {
          console.error(`[Redis Helper] Failed to create consumer group for "${USER_MCP_JOB_STREAM}":`, createErr);
        }
      }
    }

    console.error(
      `[Redis Helper] Failed to pull from stream "${USER_MCP_JOB_STREAM}":`,
      err,
    );
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unknown error occurred",
      statusCode: err.statusCode,
    };
  }
};