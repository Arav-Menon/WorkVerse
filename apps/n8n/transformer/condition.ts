import type { OrionStep, N8nNode } from './types'


const OPS: Record<string, string> = {
    '>=': 'gte', '<=': 'lte', '>': 'gt', '<': 'lt',
    '===': 'equals', '!==': 'notEquals', '==': 'equals', '!=': 'notEquals',
}

function parseRHS(s: string): string | number | boolean {
    if (s === 'true') return true
    if (s === 'false') return false
    const n = Number(s)
    return isNaN(n) ? s : n
}

function refToN8n(ref: string): string {
    const parts = ref.trim().split('.')
    const stepId = parts[0]
    const fields = parts.slice(2)
    const base = `$node["${stepId}"].json`
    return fields.length === 0 ? base : base + fields.map(f => `["${f}"]`).join('')
}

interface ParsedCondition {
    leftN8n: string
    operation: string
    rhs: string | number | boolean | null
}

function parseConditionStr(condition: string): ParsedCondition {
    for (const [sym, op] of Object.entries(OPS)) {
        const idx = condition.indexOf(sym)
        if (idx === -1) continue
        const left = condition.slice(0, idx).trim()
        const right = condition.slice(idx + sym.length).trim()
        return { leftN8n: refToN8n(left), operation: op, rhs: parseRHS(right) }
    }
    // Bare reference — truthy existence check
    return { leftN8n: refToN8n(condition.trim()), operation: 'exists', rhs: null }
}

export function buildIfNode(step: OrionStep, position: [number, number]): N8nNode {
    const parsed = parseConditionStr(step.condition!)
    return {
        id: `if_${step.id}`,
        name: `If: ${step.id}`,
        type: 'n8n-nodes-base.if',
        typeVersion: 2,
        position,
        parameters: {
            conditions: {
                options: { caseSensitive: false, leftValue: '', typeValidation: 'loose' },
                combinator: 'and',
                conditions: [
                    {
                        leftValue: `={{ ${parsed.leftN8n} }}`,
                        rightValue: parsed.rhs,
                        operator: {
                            type: typeof parsed.rhs === 'number' ? 'number' : 'string',
                            operation: parsed.operation,
                        },
                    },
                ],
            },
        },
    }
}

export function buildNoOpNode(stepId: string, position: [number, number]): N8nNode {
    return {
        id: `noop_${stepId}`,
        name: `Skip: ${stepId}`,
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position,
        parameters: {},
    }
}