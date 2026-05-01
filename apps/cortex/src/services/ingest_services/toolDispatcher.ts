import { OpenRouter } from "@openrouter/sdk";
import { transport, client } from "@repo/mcp";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Ensure connection is established
let connected = false;
async function ensureConnected() {
  if (!connected) {
    await client.connect(transport);
    connected = true;
  }
}

export async function dispatchToTool(userPrompt: string) {
    try {
        await ensureConnected();

        console.log("Fetching tools from MCP server.....");
        const toolsResult = await client.listTools();

        const tools = toolsResult.tools.map(tool => ({
            type: "function" as const,
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema
            }
        }));

        console.log("Calling LLM....");

        //@ts-ignore
        const response = await openrouter.chat.completions.create({
            model: "google/gemini-2.0-flash-001", // Using a reliable model for tool calling
            messages: [{ role: "user", content: userPrompt }],
            tools: tools,
            tool_choice: "auto",
        });

        const message = response.choices[0]?.message;

        if (message?.tool_calls && message.tool_calls.length > 0) {
            const toolCall = message.tool_calls[0];
            const name = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            console.log(`Executing tool: ${name} with args:`, args);

            const result = await client.callTool({
                name: name,
                arguments: args,
            });

            console.log("Tool execution result:", result);

            // Convert MCP tool result to string
            //@ts-ignore
            const content = result.content
                .filter((c: any) => c.type === "text")
                .map((c: any) => c.text)
                .join("\n");

            return {
                success: true,
                content: content,
            };
        }

        // If no tool was called, return the LLM's text response
        return {
            success: true,
            content: message?.content || "No response from AI",
        };

    } catch (error: any) {
        console.error("Dispatch error:", error);
        return {
            success: false,
            error: error.message || "Failed to dispatch to tool",
        };
    }
}