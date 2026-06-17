import { openrouter } from "../utils/router.init";
import { chatSystemPrompt } from "../utils/systemPrompt";

const systemPrompt = chatSystemPrompt();

export async function chat(prompt: string): Promise<string | null> {
  const response = await openrouter.chat.send({
    chatRequest: {
      model: "openai/gpt-oss-120b:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      stream: false,
    },
  });

  return response.choices[0]?.message.content ?? null;
}