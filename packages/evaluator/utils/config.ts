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
  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray(data.nodes) ||
    typeof data.connections !== "object"
  ) {
    throw new Error("Invalid workflow structure");
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
