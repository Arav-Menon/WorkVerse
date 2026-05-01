import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Gateway Server Instance (Orion Bridge)
export const server = new McpServer({
  name: "workverse-gateway-bridge",
  version: "1.0.0",
});

// SSE Transport for Cortex to talk to Orion
export const transport = new SSEClientTransport(
  new URL("http://localhost:3002/api/v1/orion/mcp/sse")
);

export const client = new Client({
  name: "workverse-cortex-client",
  version: "1.0.0",
});