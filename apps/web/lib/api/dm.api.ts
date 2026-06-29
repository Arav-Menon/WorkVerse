import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export interface DmUser {
  id: string;
  name: string;
  email: string;
}

export interface DmConversation {
  id: string;
  otherUser: DmUser;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DmMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: DmUser;
}

export const dmApi = {
  createOrGetConversation: async (orgId: string, otherUserId: string): Promise<DmConversation> => {
    const response = await apiClient.post(API_ENDPOINTS.DM.CREATE_CONVERSATION(orgId), {
      otherUserId,
    });
    return response.data.data;
  },

  getConversations: async (orgId: string): Promise<DmConversation[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DM.LIST_CONVERSATIONS(orgId));
    return response.data.data;
  },

  getMessages: async (orgId: string, conversationId: string, cursor?: string): Promise<DmMessage[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DM.GET_MESSAGES(orgId, conversationId), {
      params: { cursor, limit: 50 },
    });
    return response.data.data;
  },

  sendMessage: async (orgId: string, conversationId: string, content: string): Promise<DmMessage> => {
    const response = await apiClient.post(API_ENDPOINTS.DM.SEND_MESSAGE(orgId, conversationId), {
      content,
    });
    return response.data.data;
  },

  markAsRead: async (orgId: string, conversationId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.DM.MARK_READ(orgId, conversationId));
  },

  sendTyping: async (orgId: string, conversationId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.DM.SEND_TYPING(orgId, conversationId));
  },
};
