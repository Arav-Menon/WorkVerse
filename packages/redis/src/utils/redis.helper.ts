import { client } from "../config";
import {
  USER_COMMS_JOB_STREAM,
  USER_INBOUND_PROMPT_STREAM,
  USER_WORKFLOW_JOB_STREAM,
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
  } catch (error: any) {
    console.error(
      `[Redis Helper] Failed to push to stream "${USER_INBOUND_PROMPT_STREAM}":`,
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

export const pushToWorkflow = async (
  data: Record<string, any>,
  maxLen: number = DEFAULT_MAX_STREAM_LENGTH,
): Promise<PushResult> => {
  try {
    const messageId = await client.xAdd(USER_WORKFLOW_JOB_STREAM, "*", data, {
      TRIM: {
        strategy: "MAXLEN",
        strategyModifier: "~",
        threshold: maxLen,
      },
    });

    return { success: true, id: messageId };
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

export type StreamResult = {
  id: string;
  message: Record<string, string>;
};

export const pullSubmissionPrompt = async (
  group = "submission-worker-group",
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

export const pullWorkflowJSON = async (
  group = "workflow-worker-group",
  consumer = WORKER_ID,
): Promise<PullResult> => {
  try {
    const response = await client.xReadGroup(
      group,
      consumer,
      [{ key: USER_WORKFLOW_JOB_STREAM, id: ">" }],
      { COUNT: 1, BLOCK: 5000 },
    );

    return { success: true, response: response };
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

    const messageId = await client.xAdd(USER_COMMS_JOB_STREAM, "*", normalizedData, {
      TRIM: { strategy: "MAXLEN", strategyModifier: "~", threshold: maxLen },
    });

    return { success: true, id: messageId };
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
    const response = await client.xReadGroup(
      group,
      consumer,
      [{ key: USER_COMMS_JOB_STREAM, id: ">" }],
      { COUNT: 1, BLOCK: 5000 },
    );
    return { success: true, response: response };
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