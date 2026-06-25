import { bulkInsertChatResponseQueue } from "@repo/queue"
import type { ChatCompletedEvent } from "@repo/events"

export const insertBulk = async (payload: ChatCompletedEvent) => {
    console.log("request reached here")
    await bulkInsertChatResponseQueue.add("chat_res_job", {
        promptId: payload.promptId,
        userId: payload.userId,
        organizationId: payload.organizationId,
        workspaceId: payload.workspaceId,
        content: payload.content,
        status: "completed"
    })
}

export const insertBulkUserMessage = async (payload: {
    promptId: string
    userId: string
    organizationId: string
    workspaceId: string
    content: string
}) => {
    await bulkInsertChatResponseQueue.add("chat_user_msg", {
        promptId: payload.promptId,
        userId: payload.userId,
        organizationId: payload.organizationId,
        workspaceId: payload.workspaceId,
        content: payload.content,
        role: "USER",
        status: "completed"
    })
}