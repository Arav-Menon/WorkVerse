import { pullUserWorkflowJob } from "@repo/redis/redis-client";
import { createWorkflow } from "./workflow-job";
import { mapWorkflowToN8n } from "../transformer/mapper";
import { client } from "@repo/redis";
import { EventBus, type WorkflowEvent } from "@repo/events"

while (true) {

  try {
    const workflowJob = (await pullUserWorkflowJob()) as any;

    if (!workflowJob?.success || !workflowJob?.response || workflowJob.response.length === 0) {
      continue;
    }
    const stream = workflowJob.response[0];
    const record = stream?.messages?.[0];

    if (!record) continue;

    const { promptId, userId, organizationId, workspaceId, intent: parsedRaw } = record.message;

    if (!parsedRaw) {
      console.error("[Workflow Forger] No parsed data found in message");
      continue;
    }

    const parsed = typeof parsedRaw === "string" ? JSON.parse(parsedRaw) : parsedRaw;

    const orionWorkflow = {
      workflow: {
        steps: [
          ...(parsed?.execution_plan?.trigger ? [{
            id: parsed.execution_plan.trigger.id,
            engine: 'internal',
            service: parsed.execution_plan.trigger.service || 'webhook',
            action: parsed.execution_plan.trigger.event || 'trigger',
            input: {}
          }] : []),
          ...(parsed?.execution_plan?.steps || [])
        ]
      }
    };

    const workflowPayload: WorkflowEvent = {
      promptId,
      userId,
      organizationId,
      workspaceId,
      status: "mapping",
      message: "Converting workflow into executable steps...",
    };
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload));

    await EventBus.publish("workflow_event", workflowPayload)

    const workflow_json = mapWorkflowToN8n(orionWorkflow as any, parsed.name || "Generated Workflow");

    workflowPayload.status = "generating";
    workflowPayload.message = "Pushing workflow to n8n engine...";
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload));
    await EventBus.publish("workflow_event", workflowPayload);

    delete (workflow_json as any).active;
    delete (workflow_json as any).versionId;
    delete (workflow_json as any).id;

    await createWorkflow(workflow_json);

    workflowPayload.status = "completed";
    workflowPayload.message = "Workflow successfully created and ready to use!";
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload));

    // TODO :- Add the workflow exectution to the db throw queue not directly.
    // given an example
    // and also setup the bullMQ too before the inserting to the db; 
    // await db.workflowJob.update({ where : { promptId } }); 
    await EventBus.publish("workflow_event", workflowPayload);

  } catch (error) {
    console.error("[Workflow Forger] Error in worker loop:", error);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
