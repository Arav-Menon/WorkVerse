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
    status: "mapping" | "completed" | "generating" | "resolving" | "failed";
    workflowDbId?: string;
    workflowId?: string;
    workflowName?: string;
    workflowUrl?: string;
    integrations?: string[];
    steps?: { id: string; service: string; action: string }[];
}

export interface DirectMessageEvent {
    conversationId: string;
    organizationId: string;
    senderId: string;
    senderName: string;
    content: string;
    messageId: string;
    createdAt: string;
}

export interface TypingEvent {
    conversationId: string;
    organizationId: string;
    userId: string;
    isTyping: boolean;
}
