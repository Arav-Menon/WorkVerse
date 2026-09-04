"use client";

import React, { useState } from "react";
import AiLabHeader from "./ailab/AiLabHeader";
import AiLabPromptBox from "./ailab/AiLabPromptBox";
import AiLabSuggestions from "./ailab/AiLabSuggestions";
import { AiLabsChat } from "@/components/arena/ai-labs/AiLabsChat";
import { useAiLabs } from "@/hooks/use-ai-labs";
import { currentModel, suggestions as defaultSuggestions } from "./ailab/data";
import type { ModelInfo } from "./ailab/data";

interface AiLabDeckProps {
  orgName?: string;
  workspaceId: string;
  spaceId: string;
  organizationId: string;
}

export default function AiLabDeck({
  orgName = "Engineering Team",
  workspaceId,
  spaceId,
  organizationId,
}: AiLabDeckProps) {
  const [promptText, setPromptText] = useState("");
  const [model, setModel] = useState<ModelInfo>(currentModel);

  const {
    messages,
    isConnected,
    isTyping,
    error,
    sendMessage,
    clearHistory,
    clearError,
  } = useAiLabs({
    workspaceId,
    spaceId,
    organizationId,
    enabled: true,
  });

  const handleModelSwitch = () => {
    setModel((prev) =>
      prev.name === "GPT-4o"
        ? { name: "Claude 3.5", provider: "Anthropic" }
        : { name: "GPT-4o", provider: "OpenAI" }
    );
  };

  const handleSuggestionSelect = (text: string) => {
    setPromptText(text);
  };

  const handleSubmit = () => {
    if (!promptText.trim() || isTyping || !isConnected) return;
    sendMessage(promptText);
    setPromptText("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-16 md:py-24 flex flex-col items-center gap-8">
      <AiLabHeader orgName={orgName} />

      {!isConnected && (
        <div className="w-full px-4 py-2 text-[12px] text-center rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          Connecting to AI Labs…
        </div>
      )}

      {error && (
        <div className="w-full px-4 py-2 text-[12px] text-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-2">
            Dismiss
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="w-full">
          <AiLabsChat messages={messages} isTyping={isTyping} orgId={organizationId} />
        </div>
      )}

      <div className="w-full">
        <AiLabPromptBox
          promptText={promptText}
          onPromptChange={setPromptText}
          onSubmit={handleSubmit}
          model={model}
          onModelSwitch={handleModelSwitch}
          disabled={isTyping || !isConnected}
        />
      </div>

      {messages.length === 0 && (
        <div className="w-full">
          <AiLabSuggestions
            suggestions={defaultSuggestions}
            onSelect={handleSuggestionSelect}
          />
        </div>
      )}
    </div>
  );
}
