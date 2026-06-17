import type { ExecutePlan } from "../../utils/types.ts";
import { toolRegistery } from "./tool-registery.ts";

export async function executePlan(payload: ExecutePlan) {
    for (const step of payload.intent.execution_plan.steps) {
        try {
            const serviceKey = step.service as keyof typeof toolRegistery;

            const executor = toolRegistery[serviceKey];

            if (!executor) {
                throw new Error(
                    `No executor found for ${step.service}`
                );
            }

            const executeJobPayload = {
                userId: payload.userId,
                action: step.action,
                input: step.input
            }

            const result = await executor.execute(executeJobPayload)

            console.log(result)

        } catch (err: any) {
            console.log(err)
        }
    }
}