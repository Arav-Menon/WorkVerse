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