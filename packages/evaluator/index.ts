import axios from "axios";

export const processWithAi = async ({
  userId,
  organizationId,
  workspaceId,
  systemPrompt,
  userPrompt,
}: any) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "arcee-ai/trinity-large-preview:free",
        message: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:4000",
          "X-Title": "DevForces Evaluator",
        },
      },
    );
    return response;
  } catch (err) {}
};
