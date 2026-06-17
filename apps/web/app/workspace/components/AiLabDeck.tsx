"use client";

import React, { useState } from "react";
import {
  AiLabHeader,
  AiLabPromptBox,
  AiLabSuggestions,
  AiLabModelSelector,
  AiLabUsage,
  AiLabAgents,
  AiLabWorkflows,
  AiLabCapabilities,
  AiLabExecutionFeed,
  aiAgents,
  workflows,
  currentModel,
  capabilities,
  executionLogs,
  suggestions,
} from "./ailab";

export default function AiLabDeck({ orgName = "Engineering Team" }: { orgName?: string }) {
  const [promptText, setPromptText] = useState("");
  const [model, setModel] = useState(currentModel);

  const handleModelSwitch = () => {
    setModel(prev =>
      prev.name === "GPT-4o"
        ? { name: "Claude 3.5", provider: "Anthropic", tokenLimit: 40000, tokensUsed: 8200, costThisMonth: "$6.80" }
        : { name: "GPT-4o", provider: "OpenAI", tokenLimit: 50000, tokensUsed: 18420, costThisMonth: "$12.40" }
    );
  };

  return (
    <div className="w-full py-8 lg:py-12 flex flex-col gap-10">

      <AiLabHeader orgName={orgName} />

      <div className="relative group">
        <AiLabPromptBox
          promptText={promptText}
          onPromptChange={setPromptText}
          model={model}
          onModelSwitch={handleModelSwitch}
        />
        <div className="mt-3">
          <AiLabSuggestions suggestions={suggestions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AiLabModelSelector model={model} onSwitch={handleModelSwitch} />
        <AiLabUsage model={model} />
      </div>

      <AiLabAgents agents={aiAgents} />

      <AiLabWorkflows workflows={workflows} />

      <AiLabCapabilities capabilities={capabilities} />

      <AiLabExecutionFeed logs={executionLogs} />

    </div>
  );
}
