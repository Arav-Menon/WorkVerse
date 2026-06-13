export interface ChatCompletedEvent {
    promptId: string;
    userId: string;
    workspaceId: string;
    organizationId: string;
    content: string;
    status: "completed";
}