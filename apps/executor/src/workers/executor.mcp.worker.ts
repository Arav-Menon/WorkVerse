import { pullUserMcpJob } from "@repo/redis/redis-client"
import { executePlan } from "../runtime/execute-plan";

console.log("worker is started")

while (1) {
    try {
        const mcpJob = await pullUserMcpJob() as any;

        if (!mcpJob?.success || !mcpJob?.response) continue;

        const stream = mcpJob.response[0];
        const record = stream?.messages?.[0];

        console.log(record)

        if (!record) continue;

        const { promptId, userId, organizationId, workspaceId, spaceId, intent: parsedRaw } = record.message;

        if (!parsedRaw) {
            console.error("[Workflow Forger] No intent/parsed data found in message");
            continue;
        }

        const executePlanPayload = {
            promptId,
            userId,
            intent: JSON.parse(parsedRaw)
        }

        const gone = await executePlan(executePlanPayload)

        console.log(gone)

    } catch (error: any) {
        console.log(error);
        throw error
    }

}