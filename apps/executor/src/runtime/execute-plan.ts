import type { ExecutePlan } from "../../utils/types.ts";
import { toolRegistery } from "./tool-registery.ts";
import { EventBus } from "@repo/events";

export async function executePlan(payload: ExecutePlan) {
    const results: { step: string; service: string; result: any; error?: string }[] = [];

    for (const step of payload.intent.execution_plan.steps) {
        const serviceKey = step.service as keyof typeof toolRegistery;
        const executor = toolRegistery[serviceKey];

        if (!executor) {
            results.push({
                step: step.id,
                service: step.service,
                result: null,
                error: `No executor found for ${step.service}`,
            });
            continue;
        }

        try {
            const executeJobPayload = {
                userId: payload.userId,
                action: step.action,
                input: step.input,
            };

            const result = await executor.execute(executeJobPayload);
            results.push({ step: step.id, service: step.service, result });
        } catch (err: any) {
            results.push({
                step: step.id,
                service: step.service,
                result: null,
                error: err.message ?? String(err),
            });
        }
    }

    const hasErrors = results.some((r) => r.error);
    const allFailed = results.every((r) => r.error);

    await EventBus.publish("chat_completed", {
        promptId: payload.promptId,
        userId: payload.userId,
        workspaceId: payload.workspaceId ?? "",
        spaceId: payload.spaceId ?? "",
        organizationId: payload.organizationId ?? "",
        content: JSON.stringify(results),
        status: allFailed ? "failed" : "completed",
    });

    return results;
}