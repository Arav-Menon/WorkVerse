"use client";

import React, { useState } from "react";
import AiLabHeader from "./ailab/AiLabHeader";
import AiLabPromptBox from "./ailab/AiLabPromptBox";
import AiLabSuggestions from "./ailab/AiLabSuggestions";
import { currentModel, suggestions as defaultSuggestions } from "./ailab/data";
import type { ModelInfo } from "./ailab/data";

export default function AiLabDeck({ orgName = "Engineering Team" }: { orgName?: string }) {
  const [promptText, setPromptText] = useState("");
  const [model, setModel] = useState<ModelInfo>(currentModel);

  const handleModelSwitch = () => {
    setModel(prev =>
      prev.name === "GPT-4o"
        ? { name: "Claude 3.5", provider: "Anthropic" }
        : { name: "GPT-4o", provider: "OpenAI" }
    );
  };

  const handleSuggestionSelect = (text: string) => {
    setPromptText(text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-16 md:py-24 flex flex-col items-center gap-8">
      <AiLabHeader orgName={orgName} />

      <div className="w-full">
        <AiLabPromptBox
          promptText={promptText}
          onPromptChange={setPromptText}
          model={model}
          onModelSwitch={handleModelSwitch}
        />
      </div>

      <div className="w-full">
        <AiLabSuggestions
          suggestions={defaultSuggestions}
          onSelect={handleSuggestionSelect}
        />
      </div>
    </div>
  );
}
