export interface JobStatusPayLoad {
    promptId: string;
    status: "queued";
    userId: string;
    userPrompt: string;
    organizationId: string;
    workspaceId: string;
    intent: unknown;
}