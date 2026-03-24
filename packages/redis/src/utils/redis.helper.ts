import { client } from "../config";

const DEFAULT_MAX_STREAM_LENGTH = 10000;

export type PushResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export const pushToStream = async (
  stream: string,
  data: Record<string, any>,
  maxLen: number = DEFAULT_MAX_STREAM_LENGTH,
): Promise<PushResult> => {
  try {
    const messageId = await client.xAdd(stream, "*", data, {
      TRIM: {
        strategy: "MAXLEN",
        strategyModifier: "~",
        threshold: maxLen,
      },
    });

    return { success: true, id: messageId };
  } catch (error) {
    console.error(
      `[Redis Helper] Failed to push to stream "${stream}":`,
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
