export interface ChatCompletedEvent {
    promptId: string;
    userId: string;
    workspaceId: string;
    organizationId: string;
    content: string | null;
    status: "completed" | "failed";
}

export interface  WorkflowEvent {
    promptId: string;
    userId: string;
    workspaceId: string;
    organizationId: string;
    message: string;
    status:  "mapping" |"completed" | "generating" | "failed";
}
