export function extractJson(text: string): string {
  try {
    JSON.parse(text);
    return text;
  } catch {}

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in LLM response");

  return match[0];
}

export function validateWorkflowJson(data: any) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid workflow structure: Data is not an object");
  }

  // Handle AI using 'node' instead of 'nodes'
  if (!data.nodes && data.node) {
    data.nodes = data.node;
  }

  // Default connections to empty object if missing
  if (!data.connections) {
    data.connections = {};
  }

  if (!Array.isArray(data.nodes)) {
    console.error("[Evaluator] Validation failed: 'nodes' is not an array", data);
    throw new Error("Invalid workflow structure: 'nodes' must be an array");
  }

  if (typeof data.connections !== "object" || Array.isArray(data.connections)) {
    console.error("[Evaluator] Validation failed: 'connections' is not an object", data);
    throw new Error("Invalid workflow structure: 'connections' must be an object");
  }

  const nodeNames = new Set(data.nodes.map((n: any) => n.name));

  for (const source in data.connections) {
    if (!nodeNames.has(source)) {
      throw new Error(`Invalid connection source: ${source}`);
    }

    const conns = data.connections[source]?.main || [];
    for (const group of conns) {
      for (const conn of group) {
        if (!nodeNames.has(conn.node)) {
          throw new Error(`Invalid connection target: ${conn.node}`);
        }
      }
    }
  }
}
