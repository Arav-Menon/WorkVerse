import axios from "axios";
import { extractJson, validateWorkflowJson } from "../utils/config";

export interface ProcessAiParams {
  systemPrompt: string;
  userPrompt: string;
}

export const processWithAi = async ({
  systemPrompt,
  userPrompt,
}: ProcessAiParams): Promise<any | undefined> => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "inclusionai/ling-2.6-flash:free",
        messages: [
          {
            role: "system",
            content:
              systemPrompt +
              "\n\nDo NOT wrap JSON in markdown. Return raw JSON only.",
          },
          { role: "user", content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY} `,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:4000",
          "X-Title": "DevForces Evaluator",
        },
      },
    );

    const result = response.data.choices[0].message.content;

    console.log(result)

    let parsed;
    try {
      const cleaned = extractJson(result);
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed:", result);
      return undefined;
    }

    try {
      validateWorkflowJson(parsed);
    } catch (err) {
      console.error("Validation failed:", err);
      return undefined;
    }

    return parsed;
  } catch (err) {
    console.error("LLM request failed:", err);
    return undefined;
  }
};
