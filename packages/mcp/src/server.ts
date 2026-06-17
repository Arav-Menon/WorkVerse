import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { db } from "@repo/db";

/**
 * This is the MCP Server — it's a standalone process that exposes "tools"
 * to any MCP Client (like VS Code, Claude Desktop, or your own app).
 *
 * Transport: stdio — meaning it communicates through standard input/output
 * (piped by whatever MCP client runs this process).
 *
 * Think of this as the "kitchen" that knows how to execute actions.
 * The MCP Client is the "waiter" that calls into this kitchen.
 */
const server = new McpServer({
    name: "workverse-mcp-server",
    version: "1.0.0",
});

// ─── Tool: create_user ─────────────────────────────────────────────────────────
// Register each tool with a name, description, and input schema.
// The MCP Client (VS Code, Claude, etc.) reads these to know what tools exist.
server.tool(
    "create_user",
    "Creates a new user in the WorkVerse database with name, email, and password.",
    {
        name: z.string().describe("The full name of the user"),
        email: z.string().email().describe("The user's email address"),
        password: z.string().min(6).describe("The user's password (min 6 chars)")
    },
    async ({ name, email, password }) => {
        try {
            const existing = await db.user.findUnique({ where: { email } });
            if (existing) {
                return {
                    content: [{ type: "text", text: `❌ A user with email "${email}" already exists.` }],
                    isError: true
                };
            }

            const user = await db.user.create({
                data: { name, email, passwordHash: password },
                select: { id: true, name: true, email: true, createdAt: true }
            });

            return {
                content: [{
                    type: "text",
                    text: `✅ User created successfully!\n- ID: ${user.id}\n- Name: ${user.name}\n- Email: ${user.email}`
                }]
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `❌ Error creating user: ${error.message}` }],
                isError: true
            };
        }
    }
);

// ─── Start the server ──────────────────────────────────────────────────────────
// StdioServerTransport reads from process.stdin and writes to process.stdout.
// When mcp.json runs `bun src/server.ts`, this pipe is set up automatically.
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // NOTE: Do NOT console.log here — stdout is reserved for MCP protocol messages.
    // Use stderr for any debugging: console.error("Server started");
    console.error("[WorkVerse MCP] Server running via stdio");
}

main().catch((err) => {
    console.error("[WorkVerse MCP] Fatal error:", err);
    process.exit(1);
});
