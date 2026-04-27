import { server } from "@repo/mcp/mcp";
import { z } from "zod"


export const slack_tool = async () => {
  server.tool(
    "add-two-number",
    "Add two numbers togther",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => {
      return {
        content: [{ type: "text", text: String(a + b) }]
      }
    },
  );
};
