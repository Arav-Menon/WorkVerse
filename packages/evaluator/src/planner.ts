import { OpenRouter } from "@openrouter/sdk";
import { aiSystemPrompt } from "../utils/systemPrompt";

const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export async function planExecution(prompt: string): Promise<any> {
  const stream = await openrouter.chat.send({
    chatRequest: {
      model: "poolside/laguna-xs.2:free",
      messages: [
        { role: "user", content: prompt },
        { role: "system", content: aiSystemPrompt() },
      ],
      stream: false,
    },
  });


  const result = stream.choices[0]?.message.content;
  console.log(result)

}
