'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { dmApi, type DmConversation, type DmMessage } from '../lib/api/dm.api';
import { services } from '../lib/config/env';

interface UseDmNewMessage {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageId: string;
}

interface UseDmOptions {
  organizationId: string;
  currentUserId: string;
  enabled?: boolean;
  onNewMessage?: (message: UseDmNewMessage) => void;
}

export function useDm({ organizationId, currentUserId, enabled = true, onNewMessage }: UseDmOptions) {
  const [conversations, setConversations] = useState<DmConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10;
  const activeConversationIdRef = useRef<string | null>(null);
  activeConversationIdRef.current = activeConversationId;

  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Connect to Synapse WebSocket for a specific conversation
  const connectToConversation = useCallback((conversationId: string) => {
    // Disconnect existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    const roomId = `dm:${conversationId}`;
    const wsUrl = `${services.synapse}?roomId=${roomId}&token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`[useDm] Connected to DM room: ${conversationId}`);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'dm_message') {
          const isFromOtherUser = data.senderId !== currentUserId;
          const isActiveConversation = data.conversationId === activeConversationIdRef.current;

          // Add new message to the list (only if it's the active conversation)
          if (isActiveConversation) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.messageId)) return prev;
              return [...prev, {
                id: data.messageId,
                conversationId: data.conversationId,
                senderId: data.senderId,
                content: data.content,
                createdAt: data.createdAt,
                sender: { id: data.senderId, name: data.senderName, email: '' },
              }];
            });
          }

          // Update conversation list
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === data.conversationId) {
                return {
                  ...conv,
                  lastMessage: {
                    id: data.messageId,
                    content: data.content,
                    senderId: data.senderId,
                    createdAt: data.createdAt,
                  },
                  updatedAt: data.createdAt,
                  // Increment unread count if message is from another user
                  // and we're not viewing this conversation
                  unreadCount: isFromOtherUser && !isActiveConversation
                    ? conv.unreadCount + 1
                    : conv.unreadCount,
                };
              }
              return conv;
            })
          );

          // Notify consumer of new DM from another user (for toasts, etc.)
          if (isFromOtherUser && !isActiveConversation) {
            console.log('[DM_HOOK] New DM from', data.senderName, ':', data.content);
            onNewMessageRef.current?.({
              conversationId: data.conversationId,
              senderId: data.senderId,
              senderName: data.senderName,
              content: data.content,
              messageId: data.messageId,
            });
          }
        } else if (data.type === 'dm_typing') {
          setTypingUsers((prev) => {
            const next = new Set(prev);
            if (data.userId !== currentUserId) {
              if (data.isTyping) {
                next.add(data.userId);
              } else {
                next.delete(data.userId);
              }
            }
            return next;
          });
        }
      } catch (err) {
        console.error('[useDm] Failed to parse message:', err);
      }
    };

    ws.onclose = () => {
      console.log(`[useDm] Disconnected from DM room: ${conversationId}`);
      wsRef.current = null;

      // Attempt to reconnect
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 15000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current++;
          connectToConversation(conversationId);
        }, delay);
      }
    };

    ws.onerror = (err) => {
      console.error('[useDm] WebSocket error:', err);
    };

    wsRef.current = ws;
  }, [currentUserId]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!enabled || !organizationId) return;

    try {
      setIsLoading(true);
      const data = await dmApi.getConversations(organizationId);
      setConversations(data);
    } catch (err) {
      console.error('[useDm] Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, enabled]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string, cursor?: string) => {
    if (!organizationId) return;

    try {
      const data = await dmApi.getMessages(organizationId, conversationId, cursor);

      if (cursor) {
        // Prepend older messages
        setMessages((prev) => [...data, ...prev]);
      } else {
        setMessages(data);
      }

      return data;
    } catch (err) {
      console.error('[useDm] Failed to load messages:', err);
      setError('Failed to load messages');
      return [];
    }
  }, [organizationId]);

  // Open a conversation
  const openConversation = useCallback(async (conversationId: string) => {
    console.log(`[DM_HOOK] openConversation: setting activeConversationId=${conversationId}`);
    setActiveConversationId(conversationId);
    setTypingUsers(new Set());
    setMessages([]);

    // Load messages
    await loadMessages(conversationId);

    // Connect to WebSocket
    connectToConversation(conversationId);

    // Mark as read
    try {
      await dmApi.markAsRead(organizationId, conversationId);

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error('[useDm] Failed to mark as read:', err);
    }
  }, [organizationId, loadMessages, connectToConversation]);

  // Close the active conversation
  const closeConversation = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setActiveConversationId(null);
    setMessages([]);
    setTypingUsers(new Set());
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversationId || !content.trim()) return;

    try {
      const message = await dmApi.sendMessage(organizationId, activeConversationId, content.trim());

      // Optimistically add the message
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              lastMessage: {
                id: message.id,
                content: message.content,
                senderId: message.senderId,
                createdAt: message.createdAt,
              },
              updatedAt: message.createdAt,
            };
          }
          return conv;
        })
      );

      // Clear typing indicator
      await dmApi.sendTyping(organizationId, activeConversationId);

      return message;
    } catch (err) {
      console.error('[useDm] Failed to send message:', err);
      setError('Failed to send message');
      return null;
    }
  }, [organizationId, activeConversationId]);

  // Send typing indicator
  const startTyping = useCallback(() => {
    if (!activeConversationId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    dmApi.sendTyping(organizationId, activeConversationId).catch(console.error);

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      // Typing indicator auto-expires on server via Redis TTL
    }, 3000);
  }, [organizationId, activeConversationId]);

  // Create a new conversation
  const startConversation = useCallback(async (otherUserId: string) => {
    console.log(`[DM_HOOK] startConversation called for ${otherUserId}`);
    try {
      const conversation = await dmApi.createOrGetConversation(organizationId, otherUserId);

      // Add to conversations list if it's new
      setConversations((prev) => {
        if (prev.some((c) => c.id === conversation.id)) return prev;
        return [conversation, ...prev];
      });

      // Open the conversation
      await openConversation(conversation.id);

      return conversation;
    } catch (err) {
      console.error('[useDm] Failed to start conversation:', err);
      setError('Failed to start conversation');
      return null;
    }
  }, [organizationId, openConversation]);

  // Load conversations on mount
  useEffect(() => {
    if (enabled && organizationId) {
      loadConversations();
    }
  }, [enabled, organizationId, loadConversations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    conversations,
    activeConversationId,
    messages,
    typingUsers,
    isLoading,
    error,
    totalUnreadCount,
    openConversation,
    closeConversation,
    sendMessage,
    startTyping,
    startConversation,
    loadMessages,
    clearError: () => setError(null),
  };
}
