import { pullUserWorkflowJob } from "@repo/redis/redis-client";
import { createWorkflow } from "./workflow-job";
import { mapWorkflowToN8n } from "../transformer/mapper";
import { client } from "@repo/redis";
import { EventBus, type WorkflowEvent } from "@repo/events"
import { db } from "@repo/db/db";
import { injectCredentials } from "./credential-injection";

const REDIS_WORKFLOW_TTL_SECONDS = 3600;

while (true) {

  try {
    const workflowJob = (await pullUserWorkflowJob()) as any;

    if (!workflowJob?.success || !workflowJob?.response || workflowJob.response.length === 0) {
      continue;
    }
    const stream = workflowJob.response[0];
    const record = stream?.messages?.[0];

    if (!record) continue;

    const { promptId, userId, organizationId, workspaceId, spaceId, intent: parsedRaw } = record.message;

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

    const allSteps = orionWorkflow.workflow.steps;
    const uniqueIntegrations = [...new Set(allSteps.map((s: any) => s.service).filter(Boolean))];
    const stepList = allSteps.map((s: any) => ({
      id: s.id,
      service: s.service || 'unknown',
      action: s.action || 'execute',
    }));

    let workflowRecord = await db.workflow.findUnique({ where: { promptId } });
    if (!workflowRecord) {
      workflowRecord = await db.workflow.create({
        data: {
          organizationId,
          workspaceId,
          createdById: userId,
          name: parsed.name || "Generated Workflow",
          prompt: JSON.stringify(parsed),
          promptId,
          workflowPlan: parsed.execution_plan,
          status: "DRAFT",
          deploymentStatus: "MAPPING",
          executionType: "N8N",
          description: parsed.description,
        },
      });
      console.log(`[Workflow Forger] Created workflow record: ${workflowRecord.id}`);
    }

    const workflowPayload: WorkflowEvent = {
      promptId,
      userId,
      organizationId,
      spaceId,
      workspaceId,
      status: "mapping",
      message: "Converting workflow into executable steps...",
      workflowId: workflowRecord.id,
    };
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload), "EX", REDIS_WORKFLOW_TTL_SECONDS);

    await EventBus.publish("workflow_event", workflowPayload)

    const workflow_json = mapWorkflowToN8n(orionWorkflow as any, parsed.name || "Generated Workflow");

    // ─── Credential Resolution ──────────────────────────────────────────────
    workflowPayload.status = "resolving";
    workflowPayload.message = "Resolving organization credentials...";
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload), "EX", REDIS_WORKFLOW_TTL_SECONDS);
    await EventBus.publish("workflow_event", workflowPayload);

    let resolvedIntegrations: string[] = [];
    try {
      const injectionResult = await injectCredentials(workflow_json, organizationId);
      resolvedIntegrations = injectionResult.resolvedServices;

      if (injectionResult.missingServices.length > 0) {
        console.warn(
          `[Workflow Forger] Missing integrations for org ${organizationId}:`,
          injectionResult.missingServices
        );
      }

      console.log(
        `[Workflow Forger] Resolved credentials for:`,
        resolvedIntegrations
      );
    } catch (error: any) {
      console.error(`[Workflow Forger] Credential injection failed: ${error.message}`);
      // Continue with deployment - workflow will be created but may lack credentials
    }
    // ────────────────────────────────────────────────────────────────────────

    await db.workflow.update({
      where: { id: workflowRecord.id },
      data: { status: "GENERATED", deploymentStatus: "GENERATING", mappedWorkflow: workflow_json as any },
    });

    workflowPayload.status = "generating";
    workflowPayload.message = "Pushing workflow to n8n engine...";
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload), "EX", REDIS_WORKFLOW_TTL_SECONDS);
    await EventBus.publish("workflow_event", workflowPayload);

    delete (workflow_json as any).active;
    delete (workflow_json as any).versionId;
    delete (workflow_json as any).id;

    const n8nResult = await createWorkflow(workflow_json, organizationId);

    await db.workflow.update({
      where: { id: workflowRecord.id },
      data: {
        status: "ACTIVE",
        deploymentStatus: "DEPLOYED",
        n8nWorkflowId: n8nResult.id,
        n8nWorkflowUrl: `${n8nResult.baseUrl}/workflow/${n8nResult.id}`,
        integrations: uniqueIntegrations,
        steps: stepList,
      },
    });

    workflowPayload.status = "completed";
    workflowPayload.message = "Workflow deployed successfully";
    workflowPayload.workflowId = n8nResult.id;
    workflowPayload.workflowName = n8nResult.name;
    workflowPayload.workflowUrl = `${n8nResult.baseUrl}/workflow/${n8nResult.id}`;
    workflowPayload.integrations = uniqueIntegrations;
    workflowPayload.steps = stepList;
    await client.set(`workflow${promptId}:access`, JSON.stringify(workflowPayload), "EX", REDIS_WORKFLOW_TTL_SECONDS);

    await EventBus.publish("workflow_event", workflowPayload);

  } catch (error: any) {
    console.error("[Workflow Forger] Error in worker loop:", error);

    try {
      const record = (error as any)?.record;
      const promptId = record?.message?.promptId;
      const userId = record?.message?.userId;
      const workspaceId = record?.message?.workspaceId;
      const spaceId = record?.message?.spaceId;
      const organizationId = record?.message?.organizationId;

      if (promptId) {
        const existingWorkflow = await db.workflow.findUnique({ where: { promptId } });
        if (existingWorkflow) {
          await db.workflow.update({
            where: { id: existingWorkflow.id },
            data: { status: "FAILED", deploymentStatus: "FAILED" },
          });
        }

        await EventBus.publish("workflow_event", {
          promptId,
          userId: userId ?? "",
          workspaceId: workspaceId ?? "",
          spaceId: spaceId ?? "",
          organizationId: organizationId ?? "",
          status: "failed",
          message: error?.message ?? "Workflow execution failed",
          workflowId: existingWorkflow?.id,
        });
      }
    } catch (pubError) {
      console.error("[Workflow Forger] Failed to publish failure event:", pubError);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
