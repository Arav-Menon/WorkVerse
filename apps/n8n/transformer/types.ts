export interface OrionStep {
    id: string
    engine: 'mcp' | 'internal' | 'workflow'
    service: string
    action: string
    input: Record<string, unknown>
    condition?: string
    dependsOn?: string[]
}

export interface OrionWorkflow {
    workflow: { steps: OrionStep[] }
}

export interface N8nNode {
    id: string
    name: string
    type: string
    typeVersion: number
    position: [number, number]
    parameters: Record<string, unknown>
    credentials?: Record<string, { id: string; name: string }>
}

export type N8nConnections = Record<
    string,
    { main: Array<Array<{ node: string; type: 'main'; index: 0 }>> }
>

export interface N8nWorkflow {
    name: string
    nodes: N8nNode[]
    connections: N8nConnections
    active: boolean
    settings: Record<string, unknown>
}

export type NodeMapperFn = (step: OrionStep, resolvedInput: Record<string, unknown>, isTrigger?: boolean) => N8nNode