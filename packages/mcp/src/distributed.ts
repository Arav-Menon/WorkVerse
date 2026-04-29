import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

export interface WorkerConfig {
  category: string;
  workerId: string;
  transport?: "stdio" | "http" | "sse";
}


export function createCategoryServer(config: WorkerConfig) {
  const server = new McpServer({
    name: `workverse-${config.category}-worker`,
    version: "1.0.0",
  });

  return server;
}

export async function startMCPServer(server: McpServer) {
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  console.log(`MCP Server started for transport`);
  
  return { server, transport };
}

export interface ToolRegistry {
  categoryName: string;
  workerId: string;
  tools: Map<string, ToolDefinition>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: Function;
}

export function createToolRegistry(category: string, workerId: string): ToolRegistry {
  return {
    categoryName: category,
    workerId: workerId,
    tools: new Map(),
  };
}
