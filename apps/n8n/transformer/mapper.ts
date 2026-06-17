import type { OrionWorkflow, OrionStep, N8nNode, N8nConnections, N8nWorkflow } from './types'
import { resolveValue } from './expression'
import { buildIfNode, buildNoOpNode } from './condition'
import { getMapper } from './registry'

const X_STEP = 280
const Y_BASE = 300
const Y_IF_OFFSET = -100
const Y_NOOP_OFFSET = 120

// ─── topological sort ────────────────────────────────────────────────────────

function topologicalSort(steps: OrionStep[]): OrionStep[] {
    const sorted: OrionStep[] = []
    const visited = new Set<string>()
    const visiting = new Set<string>()

    const stepMap = new Map<string, OrionStep>()
    for (const step of steps) stepMap.set(step.id, step)

    function visit(stepId: string) {
        if (visited.has(stepId)) return
        if (visiting.has(stepId)) throw new Error(`Circular dependency detected at step: ${stepId}`)

        visiting.add(stepId)
        const step = stepMap.get(stepId)
        if (step) {
            const deps = extractDeps(step)
            for (const dep of deps) visit(dep)
            sorted.push(step)
        }
        visiting.delete(stepId)
        visited.add(stepId)
    }

    for (const step of steps) visit(step.id)
    return sorted
}

// ─── dependency extraction ────────────────────────────────────────────────────

function extractDeps(step: OrionStep): string[] {
    const refs = new Set<string>(step.dependsOn || [])

    // Fallback: Infer dependencies from expressions if explicit dependsOn is not sufficient
    const RE = /\{\{(step_[a-zA-Z0-9_]+)\./g
    const scan = (v: unknown) => {
        if (typeof v === 'string') {
            let m: RegExpExecArray | null
            while ((m = RE.exec(v)) !== null) refs.add(m[1] as any)
        } else if (v && typeof v === 'object') {
            Object.values(v as object).forEach(scan)
        }
    }
    scan(step.input)
    if (step.condition) scan(step.condition)

    return [...refs].filter(id => id !== step.id)
}

// ─── main function ────────────────────────────────────────────────────────────

export function mapWorkflowToN8n(
    orionWorkflow: OrionWorkflow,
    name = 'WorkVerse Workflow'
): N8nWorkflow {
    const rawSteps = orionWorkflow.workflow.steps
    const steps = topologicalSort(rawSteps)

    const nodes: N8nNode[] = []
    const connections: N8nConnections = {}

    // Keep track of node boundries for mapping graph edges
    const stepNodes: Record<string, { entryId: string, exitId: string }> = {}

    // 1. Build Nodes
    steps.forEach((step, i) => {
        const deps = extractDeps(step)
        const isTrigger = deps.length === 0
        const resolvedInput = resolveValue(step.input) as Record<string, unknown>
        const mapper = getMapper(step.service)

        const hasCondition = !!step.condition && step.condition !== 'true'
        const xPos = i * X_STEP + 100
        const workNodePos: [number, number] = [xPos, Y_BASE + (hasCondition ? Y_NOOP_OFFSET : 0)]

        const workNode = mapper(step, resolvedInput, isTrigger)
        workNode.position = workNodePos

        if (hasCondition) {
            const ifNode = buildIfNode(step, [xPos, Y_BASE + Y_IF_OFFSET])
            const noOpNode = buildNoOpNode(step.id, [xPos + 200, Y_BASE + Y_NOOP_OFFSET])

            nodes.push(ifNode, workNode, noOpNode)

            connections[ifNode.name] = {
                main: [
                    [{ node: workNode.name, type: 'main', index: 0 }], // True path
                    [{ node: noOpNode.name, type: 'main', index: 0 }], // False path
                ],
            }
            // For downstream connections, they should connect from the workNode (success) or we could join them
            // We assume success path continues the workflow.
            stepNodes[step.id] = { entryName: ifNode.name, exitName: workNode.name } as any
        } else {
            nodes.push(workNode)
            stepNodes[step.id] = { entryName: workNode.name, exitName: workNode.name } as any
        }
    })

    // 2. Build DAG Connections
    steps.forEach(step => {
        const deps = extractDeps(step)
        const currentEntryName = stepNodes[step.id]!.entryName

        for (const depId of deps) {
            const depNodes = stepNodes[depId]
            if (depNodes) {
                const sourceExitName = depNodes.exitName
                if (!connections[sourceExitName]) {
                    connections[sourceExitName] = { main: [[]] }
                }

                connections[sourceExitName]!.main[0]!.push({
                    node: currentEntryName,
                    type: 'main',
                    index: 0,
                })
            }
        }
    })

    // 3. Deduplicate Connections (Fan-in safety)
    for (const conn of Object.values(connections)) {
        conn.main = conn.main.map(branch => {
            const seen = new Set<string>()
            return branch.filter(({ node }) => {
                if (seen.has(node)) return false
                seen.add(node)
                return true
            })
        })
    }

    return {
        name,
        nodes,
        connections,
        active: false,
        settings: { executionOrder: 'v1', saveManualExecutions: true },
    }
}