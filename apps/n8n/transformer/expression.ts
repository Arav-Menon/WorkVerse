// {{step_1.output}}          → ={{ $node["step_1"].json }}
// {{step_1.output.summary}}  → ={{ $node["step_1"].json["summary"] }}
// "Prefix {{step_1.output.x}} suffix" → ={{ "Prefix " + $node["step_1"].json["x"] + " suffix" }}

const TEMPLATE_RE = /\{\{([^}]+)\}\}/g

function refToN8n(ref: string): string {
    // ref = "step_1.output" or "step_1.output.some.field"
    const parts = ref.trim().split('.')
    const stepId = parts[0]          // "step_1"
    // parts[1] is always "output" — skip
    const fields = parts.slice(2)    // ["summary"] or []

    const base = `$node["${stepId}"].json`
    if (fields.length === 0) return base
    return base + fields.map(f => `["${f}"]`).join('')
}

export function resolveValue(value: unknown): unknown {
    if (typeof value !== 'string') {
        if (Array.isArray(value)) return value.map(resolveValue)
        if (value && typeof value === 'object')
            return Object.fromEntries(
                Object.entries(value as object).map(([k, v]) => [k, resolveValue(v)])
            )
        return value
    }

    const matches = [...value.matchAll(TEMPLATE_RE)]
    if (matches.length === 0) return value

    // Pure single template — wrap as n8n expression
    if (matches.length === 1 && value.trim() === matches[0]![0]) {
        return `={{ ${refToN8n(matches[0]![1]!)} }}`
    }

    // Mixed string — build concatenation expression
    const expr = value.replace(TEMPLATE_RE, (_, ref) => `" + ${refToN8n(ref)} + "`)
    return `={{ "${expr}" }}`
}