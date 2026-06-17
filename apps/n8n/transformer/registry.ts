import type { NodeMapperFn, OrionStep } from './types'
import type { N8nNode } from './types'

// ─── individual mappers ───────────────────────────────────────────────────────

const slackMapper: NodeMapperFn = (step, input) => ({
    id: step.id,
    name: `Slack: ${step.action} - ${step.id}`,
    type: 'n8n-nodes-base.slack',
    typeVersion: 2.2,
    position: [0, 0],
    parameters: {
        resource: 'message',
        operation: 'post',
        channel: input['channel'] ?? '',
        text: input['message'] ?? input['text'] ?? '',
    },
    credentials: { slackApi: { id: 'SLACK_CRED', name: 'Slack account' } },
})

const notionMapper: NodeMapperFn = (step, input) => ({
    id: step.id,
    name: `Notion: ${step.action} - ${step.id}`,
    type: 'n8n-nodes-base.notion',
    typeVersion: 2.2,
    position: [0, 0],
    parameters: {
        resource: 'page',
        operation: 'create',
        databaseId: { __rl: true, value: process.env.NOTION_DB_ID ?? '', mode: 'id' },
        title: input['title'] ?? '',
        propertiesUi: { propertyValues: [] },
        content: input['content'] ?? '',
    },
    credentials: { notionApi: { id: 'NOTION_CRED', name: 'Notion account' } },
})

const searchMapper: NodeMapperFn = (step, input) => ({
    id: step.id,
    name: `Search: ${step.action} - ${step.id}`,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [0, 0],
    parameters: {
        method: 'POST',
        url: `${process.env.MCP_BASE_URL}/search/${step.action}`,
        sendBody: true,
        contentType: 'json',
        body: { mode: 'json', jsonBody: JSON.stringify(input) },
    },
})

const internalAiMapper: NodeMapperFn = (step, input) => ({
    id: step.id,
    name: `AI: ${step.action} - ${step.id}`,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [0, 0],
    parameters: {
        method: 'POST',
        url: `${process.env.INTERNAL_AI_URL}/v1/${step.action}`,
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        contentType: 'json',
        body: { mode: 'json', jsonBody: JSON.stringify(input) },
        options: { timeout: 30000 },
    },
    credentials: { httpBearerAuth: { id: 'AI_BEARER_CRED', name: 'Internal AI' } },
})

const githubMapper: NodeMapperFn = (step, input, isTrigger) => ({
    id: step.id,
    name: `GitHub ${isTrigger ? 'Trigger' : 'Action'}: ${step.action} - ${step.id}`,
    type: isTrigger ? 'n8n-nodes-base.githubTrigger' : 'n8n-nodes-base.github',
    typeVersion: 1,
    position: [0, 0],
    parameters: isTrigger ? {
        owner: input['owner'] ?? '',
        repository: input['repository'] ?? '',
        events: [step.action.replace('issues.', 'issue_').replace('pull_request.', 'pull_request_') || '*']
    } : {
        resource: step.action.split('.')[0] || 'issue',
        operation: step.action.split('.')[1] || 'create',
        ...input
    },
    credentials: { githubApi: { id: 'GITHUB_CRED', name: 'GitHub account' } },
})

const gmailMapper: NodeMapperFn = (step, input, isTrigger) => ({
    id: step.id,
    name: `Gmail: ${step.action} - ${step.id}`,
    type: isTrigger ? 'n8n-nodes-base.gmailTrigger' : 'n8n-nodes-base.gmail',
    typeVersion: 2.1,
    position: [0, 0],
    parameters: isTrigger ? {
        pollTimes: { item: [{ mode: 'everyMinute' }] }
    } : {
        resource: 'message',
        operation: 'send',
        sendTo: input['to'] ?? input['sendTo'] ?? '',
        subject: input['subject'] ?? '',
        message: input['message'] ?? input['body'] ?? '',
    },
    credentials: { gmailOAuth2: { id: 'GMAIL_CRED', name: 'Gmail account' } },
})

const linearMapper: NodeMapperFn = (step, input, isTrigger) => ({
    id: step.id,
    name: `Linear: ${step.action} - ${step.id}`,
    type: isTrigger ? 'n8n-nodes-base.linearTrigger' : 'n8n-nodes-base.linear',
    typeVersion: 1,
    position: [0, 0],
    parameters: isTrigger ? {
        event: [step.action]
    } : {
        resource: 'issue',
        operation: 'create',
        title: input['title'] ?? '',
        description: input['description'] ?? '',
        teamId: input['teamId'] ?? ''
    },
    credentials: { linearApi: { id: 'LINEAR_CRED', name: 'Linear account' } },
})

const calendarMapper: NodeMapperFn = (step, input, isTrigger) => ({
    id: step.id,
    name: `Calendar: ${step.action} - ${step.id}`,
    type: isTrigger ? 'n8n-nodes-base.googleCalendarTrigger' : 'n8n-nodes-base.googleCalendar',
    typeVersion: 1,
    position: [0, 0],
    parameters: isTrigger ? {
        calendar: input['calendar'] ?? 'primary',
        event: 'eventCreated'
    } : {
        resource: 'event',
        operation: 'create',
        calendar: input['calendar'] ?? 'primary',
        start: input['start'] ?? '',
        end: input['end'] ?? '',
        summary: input['summary'] ?? input['title'] ?? '',
    },
    credentials: { googleCalendarOAuth2Api: { id: 'GCAL_CRED', name: 'Google Calendar account' } },
})

const webhookMapper: NodeMapperFn = (step, input, isTrigger) => ({
    id: step.id,
    name: `Webhook: ${step.action} - ${step.id}`,
    type: 'n8n-nodes-base.webhook',
    typeVersion: 1,
    position: [0, 0],
    parameters: {
        httpMethod: 'POST',
        path: step.id,
        options: {}
    }
})

const httpFallbackMapper: NodeMapperFn = (step, input, isTrigger) => ({
    id: step.id,
    name: `HTTP: ${step.service}/${step.action} - ${step.id}`,
    type: isTrigger ? 'n8n-nodes-base.webhook' : 'n8n-nodes-base.httpRequest',
    typeVersion: isTrigger ? 1 : 4.2,
    position: [0, 0],
    parameters: isTrigger ? {
        httpMethod: 'POST',
        path: `${step.service}-${step.action}`,
        options: {}
    } : {
        method: 'POST',
        url: `${process.env.MCP_BASE_URL}/${step.service}/${step.action}`,
        sendBody: true,
        contentType: 'json',
        body: { mode: 'json', jsonBody: JSON.stringify(input) },
    },
})

// ─── registry ─────────────────────────────────────────────────────────────────

const NODE_REGISTRY: Record<string, NodeMapperFn> = {
    slack: slackMapper,
    notion: notionMapper,
    search: searchMapper,
    internal_ai: internalAiMapper,
    github: githubMapper,
    gmail: gmailMapper,
    linear: linearMapper,
    calendar: calendarMapper,
    webhook: webhookMapper
}

export function getMapper(service: string): NodeMapperFn {
    const mapper = NODE_REGISTRY[service]
    if (!mapper) {
        console.warn(`[getMapper] No mapper found for service "${service}". Using fallback.`)
        return httpFallbackMapper
    }
    return mapper
}