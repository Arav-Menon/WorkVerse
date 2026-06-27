export interface ChatCompletedEvent {
    promptId: string;
    userId: string;
    workspaceId: string;
    spaceId: string;
    organizationId: string;
    content: string | null;
    status: "completed" | "failed";
}

export interface WorkflowEvent {
    promptId: string;
    userId: string;
    workspaceId: string;
    spaceId: string
    organizationId: string;
    message: string;
    status: "mapping" | "completed" | "generating" | "failed";
    workflowDbId?: string;
    workflowId?: string;
    workflowName?: string;
    workflowUrl?: string;
    integrations?: string[];
    steps?: { id: string; service: string; action: string }[];
}
