import type { JobStatusPayLoad } from "../../utils/types";
import { CHAT_ONLY, HYBRID, MCP, WORKFLOW } from "../../utils/config_names.ts";
import { chatQueue } from "@repo/queue";
import * as redisProducer from "@repo/redis/redis-client";

export class ExecutionRouter {
    static async dispatch(intent: any, payload: JobStatusPayLoad): Promise<any> {
        let responseMessage: string;

        switch ((intent as any).execution_plan.type) {
            case WORKFLOW: {
                console.log("nikal gyaa queue ke liye")
                await redisProducer.pushUserWorkflowJob(payload);
                responseMessage = "Workflow queued successfully. Your automation is being prepared";
                break;
            }
            case MCP:
                responseMessage = "Action request received. Processing your request";
                break;
            case HYBRID:
                responseMessage = "Hybrid execution queued. Preparing workflow and actions.";
                break;
            case CHAT_ONLY: {
                await chatQueue.add("chat_job", {
                    promptId: payload.promptId,
                    userId: payload.userId,
                    userPrompt: payload.userPrompt,
                    organizationId: payload.organizationId,
                    workspaceId: payload.workspaceId,
                });
                responseMessage = "Thinking... generating response.";
                break;
            }
            default:
                responseMessage = "Request received. Processing...";
        }

        return responseMessage;
    }
}