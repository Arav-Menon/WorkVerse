import { OpenRouter } from "@openrouter/sdk";
import { aiSystemPrompt } from "../utils/systemPrompt";

const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

const systemPrompt = aiSystemPrompt();

export async function planExecution(prompt: string): Promise<any> {
  const stream = await openrouter.chat.send({
    chatRequest: {
      model: "openai/gpt-oss-120b:free",
      messages: [
        { role: "user", content: prompt },
        { role: "system", content: systemPrompt },
      ],
      stream: false,
    },
  });

  const result = stream.choices[0]?.message.content;
  return result
}
