import { OpenRouter } from "@openrouter/sdk";
import { aiSystemPrompt } from "../utils/systemPrompt";
import { CostDetails$inboundSchema } from "@openrouter/sdk/models";

const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export async function processWithAi(prompt: string) {
  const stream = await openrouter.chat.send({
    chatRequest: {
      model: "openai/gpt-5.5-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
        { role: "system", content: aiSystemPrompt() },
      ],
      stream: true,
    },
  });

  console.log(stream);
}
