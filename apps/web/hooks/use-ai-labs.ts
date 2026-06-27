'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FluxClient, type FluxMessage } from '../lib/ws/flux-client';
import { apiClient } from '../lib/api/client';
import { API_ENDPOINTS } from '../lib/api/endpoints';
import { env } from '../lib/config/env';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'chat' | 'workflow' | 'error';
  deploymentData?: WorkflowDeploymentData;
}

export interface WorkflowDeploymentData {
  workflowDbId?: string;
  workflowId: string;
  workflowName: string;
  workflowUrl: string;
  integrations: string[];
  steps: { id: string; service: string; action: string }[];
  status: 'completed' | 'failed';
  message: string;
  timestamp: Date;
}

export interface WorkflowStatus {
  promptId: string;
  status: 'mapping' | 'generating' | 'completed' | 'failed';
  message: string;
}

interface UseAiLabsOptions {
  workspaceId: string;
  spaceId: string;
  organizationId: string;
  enabled?: boolean;
}

export function useAiLabs({
  workspaceId,
  spaceId,
  organizationId,
  enabled = true,
}: UseAiLabsOptions) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const clientRef = useRef<FluxClient | null>(null);
  const pendingPromptRef = useRef<string | null>(null);

  const handleFluxMessage = useCallback((msg: FluxMessage) => {
    switch (msg.type) {
      case 'prompt_queued':
        pendingPromptRef.current = msg.promptId ?? null;
        break;

      case 'chat_completed':
        setIsTyping(false);
        if (msg.status === 'failed') {
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'assistant',
              content: msg.content ?? 'Request failed. Please try again.',
              timestamp: new Date(),
              type: 'error',
            },
          ]);
        } else if (msg.content) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              role: 'assistant',
              content: msg.content ?? '',
              timestamp: new Date(),
              type: 'chat',
            },
          ]);
        }
        pendingPromptRef.current = null;
        break;

      case 'workflow_status':
        if (msg.promptId && msg.status) {
          setActiveWorkflow({
            promptId: msg.promptId,
            status: msg.status as WorkflowStatus['status'],
            message: msg.message ?? '',
          });

          if (msg.status === 'completed' || msg.status === 'failed') {
            const deploymentData: WorkflowDeploymentData | undefined =
              msg.workflowId && msg.workflowName
                ? {
                    workflowDbId: msg.workflowDbId,
                    workflowId: msg.workflowId,
                    workflowName: msg.workflowName,
                    workflowUrl: msg.workflowUrl ?? '',
                    integrations: msg.integrations ?? [],
                    steps: msg.steps ?? [],
                    status: msg.status as 'completed' | 'failed',
                    message: msg.message ?? '',
                    timestamp: new Date(),
                  }
                : undefined;

            setMessages((prev) => [
              ...prev,
              {
                id: `wf-${Date.now()}`,
                role: 'assistant',
                content: msg.status === 'completed'
                  ? `Workflow ${msg.message || 'created successfully'}`
                  : `Workflow failed: ${msg.message || 'Unknown error'}`,
                timestamp: new Date(),
                type: 'workflow',
                deploymentData,
              },
            ]);

            setIsTyping(false);
            pendingPromptRef.current = null;
            setTimeout(() => setActiveWorkflow(null), 3000);
          }
        }
        break;

      case 'mcp_completed':
        setIsTyping(false);
        if (msg.status === 'failed') {
          setMessages((prev) => [
            ...prev,
            {
              id: `mcp-err-${Date.now()}`,
              role: 'assistant',
              content: msg.content ?? 'Tool execution failed.',
              timestamp: new Date(),
              type: 'error',
            },
          ]);
        } else if (msg.content) {
          try {
            const results = JSON.parse(msg.content);
            const summary = results
              .map((r: any) => `${r.service}: ${r.error ?? 'success'}`)
              .join('\n');
            setMessages((prev) => [
              ...prev,
              {
                id: `mcp-${Date.now()}`,
                role: 'assistant',
                content: summary || 'Tool execution completed.',
                timestamp: new Date(),
                type: 'chat',
              },
            ]);
          } catch {
            setMessages((prev) => [
              ...prev,
              {
                id: `mcp-${Date.now()}`,
                role: 'assistant',
                content: msg.content ?? '',
                timestamp: new Date(),
                type: 'chat',
              },
            ]);
          }
        }
        pendingPromptRef.current = null;
        break;

      case 'error':
        setIsTyping(false);
        setError(msg.error ?? 'An error occurred');
        pendingPromptRef.current = null;
        break;
    }
  }, []);

  const connect = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || !enabled) return;

    if (clientRef.current) {
      clientRef.current.disconnect();
    }

    const client = new FluxClient({
      wsUrl: env.WS_URL,
      token,
      workspaceId,
      spaceId,
      organizationId,
      onMessage: handleFluxMessage,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
    });

    clientRef.current = client;
    client.connect();
  }, [workspaceId, spaceId, organizationId, enabled, handleFluxMessage]);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
    clientRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token || !clientRef.current?.isConnected) {
        setError('Not connected. Please try again.');
        return;
      }

      const userMsg: AiMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
        type: 'chat',
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setError(null);

      clientRef.current.send({
        token,
        workspaceId,
        spaceId,
        organizationId,
        userPrompt: text.trim(),
      });
    },
    [workspaceId, spaceId, organizationId, isTyping],
  );

  const loadHistory = useCallback(async () => {
    if (historyLoaded || !workspaceId) return;

    try {
      const response = await apiClient.get(API_ENDPOINTS.AI_CHAT.HISTORY(workspaceId), {
        params: { workspaceId, limit: 20 },
      });
      const data = response.data;

      if (data.messages?.length > 0) {
        const historyMessages: AiMessage[] = [];

        for (const msg of data.messages) {
          const content = typeof msg.content === 'string'
            ? msg.content
            : JSON.stringify(msg.content);

          historyMessages.push({
            id: msg.id,
            role: msg.role === 'ASSISTANT' ? 'assistant' : 'user',
            content,
            timestamp: new Date(msg.createdAt),
            type: 'chat',
          });
        }

        setMessages(historyMessages);
      }

      setHistoryLoaded(true);
    } catch (err) {
      console.warn('[useAiLabs] Failed to load chat history:', err);
    }
  }, [workspaceId, historyLoaded]);

  const clearHistory = useCallback(async () => {
    if (!workspaceId) return;

    try {
      await apiClient.delete(API_ENDPOINTS.AI_CHAT.DELETE_HISTORY(workspaceId), {
        params: { workspaceId },
      });
      setMessages([]);
      setHistoryLoaded(false);
    } catch (err) {
      console.warn('[useAiLabs] Failed to clear chat history:', err);
      setError('Failed to clear chat history');
    }
  }, [workspaceId]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (enabled && workspaceId) {
      loadHistory();
    }
  }, [enabled, workspaceId, loadHistory]);

  return {
    messages,
    isConnected,
    isTyping,
    activeWorkflow,
    error,
    sendMessage,
    clearHistory,
    clearError: () => setError(null),
  };
}
