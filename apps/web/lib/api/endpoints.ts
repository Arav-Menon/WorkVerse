export const API_ENDPOINTS = {
    USER: {
        REGISTER : "/api/v1/auth/register",
        LOGIN : "/api/v1/auth/login"
    },
    ORGANIZATION: {
        REGISTER : "/api/v1/register-organization",
        GET_ALL : "/api/v1/organizations",
        GET_BY_ID : (orgId : string) => `/api/v1/organizations/${orgId}`,
        MEMBERSHIP : (orgId : string) => `/api/v1/organizations/${orgId}/membership`,
        INVITE : (orgId : string) => `/api/v1/generate-invite-link/${orgId}`,
        INVITE_VALIDATE : (token : string) => `/api/v1/invite/${token}`,
        INVITE_ACCEPT : "/api/v1/accept-invite",
    },
    WORKSPACE: {
        CREATE: (orgId : string) => `/api/v1/register-workspace/${orgId}`,
        GET_ALL: (orgId : string) => `/api/v1/organizations/${orgId}/workspaces`,
        GET_BY_ID: (orgId : string, workspaceId : string) => `/api/v1/organizations/${orgId}/workspaces/${workspaceId}`,
        GET: (workspaceId : string) => `/api/v1/workspaces/${workspaceId}`,
    },
    PROFILE: {
        ME: "/api/v1/profile/me",
    },
    INTEGRATION: {
        STATUS: (orgId : string) => `/api/v1/organizations/${orgId}/integrations`,
        DISCONNECT: (orgId : string, provider : string) => `/api/v1/organizations/${orgId}/integrations/${provider}`,
        CONNECT: (provider : string) => `/api/v1/oauth/${provider}/connect`,
    },
    AI_CHAT: {
        HISTORY: (workspaceId : string) => `/api/v1/ai-chats`,
        DELETE_HISTORY: (workspaceId : string) => `/api/v1/ai-chats`,
    },
    N8N: {
        CONNECT: (orgId: string) => `/api/v1/organizations/${orgId}/n8n/connect`,
        STATUS: (orgId: string) => `/api/v1/organizations/${orgId}/n8n/status`,
        TEST: (orgId: string) => `/api/v1/organizations/${orgId}/n8n/test`,
        DISCONNECT: (orgId: string) => `/api/v1/organizations/${orgId}/n8n/disconnect`,
    },
    WORKFLOW: {
        LIST_ORG: (orgId: string) => `/api/v1/organizations/${orgId}/workflows`,
        GET: (orgId: string, workflowId: string) => `/api/v1/organizations/${orgId}/workflows/${workflowId}`,
        DELETE: (orgId: string, workflowId: string) => `/api/v1/organizations/${orgId}/workflows/${workflowId}`,
        LIST_WORKSPACE: (workspaceId: string) => `/api/v1/organizations/workspaces/${workspaceId}/workflows`,
        HISTORY: (workspaceId: string) => `/api/v1/organizations/workspaces/${workspaceId}/workflows/history`,
    },
    DM: {
        CREATE_CONVERSATION: (orgId: string) => `/api/v1/organizations/${orgId}/dm/conversations`,
        LIST_CONVERSATIONS: (orgId: string) => `/api/v1/organizations/${orgId}/dm/conversations`,
        GET_MESSAGES: (orgId: string, conversationId: string) => `/api/v1/organizations/${orgId}/dm/conversations/${conversationId}/messages`,
        SEND_MESSAGE: (orgId: string, conversationId: string) => `/api/v1/organizations/${orgId}/dm/conversations/${conversationId}/messages`,
        MARK_READ: (orgId: string, conversationId: string) => `/api/v1/organizations/${orgId}/dm/conversations/${conversationId}/read`,
        SEND_TYPING: (orgId: string, conversationId: string) => `/api/v1/organizations/${orgId}/dm/conversations/${conversationId}/typing`,
    }
}
