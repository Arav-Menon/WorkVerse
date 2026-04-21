import { pullUserWorkflowJob } from "@repo/redis/redis-client";
import { mapWorkFlowData } from "../transformer";
import { createWorkflow } from "./workflow-job";

console.log("[Workflow Forger] Started worker...");

while (true) {
  try {
    const workflowJob = (await pullUserWorkflowJob()) as any;

    console.log(workflowJob)

    if (!workflowJob?.success || !workflowJob?.response || workflowJob.response.length === 0) {
      continue;
    }

    console.log("[Workflow Forger] Received job from stream");

    const stream = workflowJob.response[0];
    const record = stream?.messages?.[0];

    if (!record) continue;

    console.log("[Workflow Forger] Processing record from stream logic...");

    const { userId, organizationId, workspaceId, parsed: parsedRaw } = record.message;

    if (!parsedRaw) {
      console.error("[Workflow Forger] No parsed data found in message");
      continue;
    }

    const parsed = typeof parsedRaw === "string" ? JSON.parse(parsedRaw) : parsedRaw;

    console.dir(parsed, { depth: null });

    const data = {
      name: parsed.name,
      nodes: parsed.nodes || parsed.node,
      connections: parsed.connections,
      settings: parsed.settings,
    };

    const workflow_json = mapWorkFlowData(data);

    delete (workflow_json as any).active;
    delete (workflow_json as any).versionId;
    delete (workflow_json as any).id;

    console.log(`[Workflow Forger] Creating workflow: "${workflow_json.name}"`);
    console.log("[Workflow Forger] Payload keys:", Object.keys(workflow_json));

    const result = await createWorkflow(workflow_json);
    console.log("[Workflow Forger] Workflow created successfully ID:", result.id);

  } catch (error) {
    console.error("[Workflow Forger] Error in worker loop:", error);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
