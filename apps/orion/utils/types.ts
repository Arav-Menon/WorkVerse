export interface JobStatusPayLoad {
    promptId: string;
    status: "queued";
    userId: string;
    spaceId: string;
    userPrompt: string;
    organizationId: string;
    workspaceId: string;
    intent: unknown;
}