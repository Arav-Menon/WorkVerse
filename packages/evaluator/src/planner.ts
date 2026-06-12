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

  let result = stream.choices[0]?.message.content;
  if (result) {
    try {
      // Safely extract JSON block if the AI wrapped it
      const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (jsonMatch) {
        result = jsonMatch[1];
      } else {
        result = result.replace(/^```/, "").replace(/```$/, "").trim();
      }
      return JSON.parse(result);
    } catch (e) {
      console.error("Failed to parse JSON from AI response:", result);
      return null;
    }
  }
  return null;
}
