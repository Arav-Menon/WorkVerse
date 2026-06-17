import type { JobStatusPayLoad } from "../../utils/types";
import { CHAT_ONLY, HYBRID, MCP, WORKFLOW } from "../../utils/config_names.ts";
import { chatQueue } from "@repo/queue";
import * as redisProducer from "@repo/redis/redis-client";

export class ExecutionRouter {
    static async dispatch(intent: any, payload: JobStatusPayLoad): Promise<any> {
        let responseMessage: string;

        switch ((intent as any).execution_plan.type) {
            case WORKFLOW: {
                await redisProducer.pushUserWorkflowJob(payload);
                responseMessage = "Workflow queued successfully. Your automation is being prepared";
                break;
            }
            case MCP:
                const mcpQueue = await redisProducer.pushUserMcpJob(payload)
                console.log(mcpQueue);
                responseMessage = "Action request received. Processing your request";
                break;
            case HYBRID:
                return  {
                "status": "not_supported",
                "executionType": "HYBRID",
                "message":
                "This request requires multi-step AI automation with conditional execution, which is not yet supported in your current WorkVerse version.",
                    "supportedToday": [
                "CHAT_ONLY",
                "MCP",
                "WORKFLOW"
            ]
                }
            case CHAT_ONLY: {
                await chatQueue.add("chat_job", {
                    promptId: payload.promptId,
                    userId: payload.userId,
                    spaceId: payload.spaceId,
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