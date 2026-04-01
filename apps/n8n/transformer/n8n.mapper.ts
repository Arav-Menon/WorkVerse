const NODE_TYPE_MAP: Record<string, string> = {
  webhook: "n8n-nodes-base.webhook",
  httpRequest: "n8n-nodes-base.httpRequest",
  set: "n8n-nodes-base.set",
  if: "n8n-nodes-base.if",
  respondToWebhook: "n8n-nodes-base.respondToWebhook",
};

export function mapWorkFlowData(data: any) {
  return {
    name: data.name || "Workflow",
    nodes: (data.nodes || []).map((node: any, index: number) => ({
      id: node.id || String(index + 1),
      name: node.name || `Node ${index + 1}`,
      type: NODE_TYPE_MAP[node.type] || node.type,
      typeVersion: 1,
      position: node.position || [index * 200, 300],
      parameters: node.parameters || {},
    })),
    connections: data.connections || {},
    settings: data.settings || {},
  };
}
