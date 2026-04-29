# Distributed MCP Architecture for WorkVerse

## 🎯 Quick Answer: Where to Initialize MCP

**Initialize MCP Server in EXECUTOR WORKERS, not in Orion or Cortex.**

```
Cortex                   (LLM - decides WHICH tool)
  ↓
Orion                    (Tool Registry - knows WHERE each tool lives)
  ↓
Queue (Redis per category)
  ↓
Executor Worker          (MCP Server + Tool Execution) ← INIT HERE
  ├── comms-worker-1     (Slack, Email, Teams) + MCP Server
  ├── comms-worker-2     (Load balance)
  ├── infra-worker-1     (AWS, GCP, K8s) + MCP Server
  └── data-worker-1      (Database, APIs) + MCP Server
```

---

## 📊 System Flow: How LLM Decides Which Tool

### Step-by-Step:

1. **Cortex receives prompt**: "Send a Slack message to #general"

2. **Cortex calls LLM with tool list**:
   - Cortex calls `GET /api/v1/orion/tools`
   - Orion returns list of 50+ tools with schemas
   - LLM analyzes: "I need `slack-send-message` tool"

3. **Cortex requests tool execution**:
   - POST to `POST /api/v1/orion/tools/slack-send-message/execute`
   - Payload: `{ input: { channel: "#general", message: "Hello" } }`

4. **Orion routes to correct worker**:
   - Looks up tool in registry: `slack-send-message` → category: `comms`
   - Pushes job to `comms-queue` in Redis

5. **Executor Worker (comms-worker-1) pulls job**:
   - Worker has MCP Server running with all comms tools registered
   - Executes: `server.call("slack-send-message", params)`
   - Returns result

6. **Orion retrieves result** and sends back to Cortex

---

## 🏗️ Architecture Setup

### File Structure:

```
executor/
├── src/
│   ├── workers/
│   │   ├── comms.worker.ts          ← MCP Server for comms
│   │   ├── infra.worker.ts          ← MCP Server for infra
│   │   ├── data.worker.ts           ← MCP Server for data
│   │   └── analytics.worker.ts      ← MCP Server for analytics
│   ├── tools/
│   │   ├── comms/
│   │   │   ├── slack.tools.ts
│   │   │   ├── email.tools.ts
│   │   │   └── teams.tools.ts
│   │   ├── infra/
│   │   │   ├── aws.tools.ts
│   │   │   ├── gcp.tools.ts
│   │   │   └── k8s.tools.ts
│   │   └── data/
│   │       ├── postgres.tools.ts
│   │       ├── mongodb.tools.ts
│   │       └── redis.tools.ts
│   └── core/
│       └── workerFactory.ts         ← Creates workers with MCP
│
orion/
└── src/
    ├── services/
    │   └── tool-manager.ts          ← Tool registry
    └── routes/
        └── tool.routes.ts           ← Expose tools to Cortex
```

---

## ⚙️ Configuration

### Environment Variables:

```bash
# Orion (gateway)
PORT=3002
REDIS_URL=redis://localhost:6379

# Worker Configuration
WORKER_CATEGORY=comms          # Which tools to load
WORKER_ID=comms-worker-1       # Unique ID
MCP_TRANSPORT=stdio            # or http/sse for distributed

# Queue names (one per category)
QUEUE_COMMS=comms-queue
QUEUE_INFRA=infra-queue
QUEUE_DATA=data-queue
QUEUE_ANALYTICS=analytics-queue
```

---

## 🚀 Handling 50+ Tools

### Strategy: Divide by Category

Don't create one worker with 50 tools. Instead:

| Category | Tool Count | Worker Instances | Tools |
|----------|-----------|------------------|-------|
| **Communications** | 8 | 2 | Slack, Email, Teams, Discord, Telegram, SMS, etc. |
| **Infrastructure** | 12 | 3 | AWS, GCP, Azure, Docker, K8s, Terraform, etc. |
| **Data/Database** | 15 | 3 | PostgreSQL, MongoDB, Redis, Elasticsearch, etc. |
| **Analytics** | 7 | 2 | Mixpanel, Segment, Amplitude, GA, etc. |
| **Files/Storage** | 5 | 1 | S3, GCS, FTP, Box, Dropbox |
| **Automation** | 3 | 1 | Zapier, IFTTT, Cron, etc. |
| **TOTAL** | **50** | **12** | All tools distributed |

### Benefits:
- ✅ Each MCP Server manages ~5-6 tools (not 50)
- ✅ Easy to scale: add more instances per category
- ✅ Failure isolation: one worker down doesn't affect others
- ✅ Independent tool registration
- ✅ Can run on different machines

---

## 📝 MCP Server Initialization

### In Each Worker:

```typescript
// executor/src/workers/comms.worker.ts

import { createCategoryWorker, startWorker } from "../core/workerFactory";

const commsTools = {
  "slack-send-message": async (params) => { /* ... */ },
  "slack-get-messages": async (params) => { /* ... */ },
  "email-send": async (params) => { /* ... */ },
  "teams-send": async (params) => { /* ... */ },
  // More tools...
};

async function main() {
  // Creates MCP Server internally
  const worker = await createCategoryWorker("comms", commsTools, jobQueue);
  
  // MCP Server now has all comms tools registered
  // Worker starts consuming jobs from comms-queue
  await startWorker(worker);
}
```

### NOT in Orion:

```typescript
// ❌ Don't do this in Orion
const server = new McpServer(...);
server.tool("slack-send-message", ...);

// Orion is just a ROUTER that knows:
// - Tool exists
// - Which category it's in
// - Which queue to use
```

---

## 🔄 MCP Transport Options

### Option 1: **Stdio** (Recommended for single machine)
- Each worker process has stdio transport
- Default in @modelcontextprotocol/sdk
- Good for: Development, single machine

### Option 2: **HTTP** (Recommended for distributed)
- Each worker runs on different port
- Orion calls workers via HTTP
- Good for: Multi-machine, cloud deployment

```typescript
// Example with HTTP transport
const server = new McpServer({...});
const httpTransport = new HttpServerTransport(server, {
  port: 3003
});
await httpTransport.start();
```

### Option 3: **WebSocket** (For streaming)
- Real-time bidirectional communication
- Good for: Streaming responses, notifications

---

## 🔗 Cortex Integration

### In Cortex (your LLM app):

```typescript
// 1. Get all available tools
const tools = await fetch("http://orion:3002/api/v1/orion/tools");

// 2. Show to LLM for decision
const toolList = tools.map(t => ({
  name: t.name,
  description: t.description,
  schema: t.inputSchema
}));

// 3. LLM picks a tool
// const llmDecision = await llm.choose(toolList);
// Output: "slack-send-message"

// 4. Execute the tool
const result = await fetch(
  "http://orion:3002/api/v1/orion/tools/slack-send-message/execute",
  {
    method: "POST",
    body: JSON.stringify({
      input: {
        channel: "#general",
        message: "Hello from LLM!"
      }
    })
  }
);
```

---

## ✅ Implementation Checklist

### Phase 1: Setup Tool Registry
- [ ] Create `orion/src/services/tool-manager.ts`
- [ ] Add tool endpoints to Orion
- [ ] Create `/tools` and `/tools/:id/execute` routes

### Phase 2: Create Worker Factory
- [ ] Create `executor/src/core/workerFactory.ts`
- [ ] Implement `createCategoryWorker()`
- [ ] Implement `startWorker()`

### Phase 3: Reorganize Tools
- [ ] Create `executor/src/tools/comms/`
- [ ] Create `executor/src/tools/infra/`
- [ ] Create `executor/src/tools/data/`
- [ ] Move existing tools to categories

### Phase 4: Create Workers
- [ ] Update `executor/src/workers/comms.worker.ts`
- [ ] Create `executor/src/workers/infra.worker.ts`
- [ ] Create `executor/src/workers/data.worker.ts`
- [ ] Each worker creates its own MCP Server

### Phase 5: Update Cortex
- [ ] Call Orion for tool list
- [ ] Use LLM to decide tool
- [ ] Call Orion's execute endpoint

### Phase 6: Setup Queues
- [ ] Create queue per category in Redis
- [ ] Implement job push in Orion
- [ ] Implement job pull in workers

---

## 🎓 Key Principles

1. **MCP Server lives in Workers** - Not in gateway
2. **Orion is a Router** - Tracks tools, doesn't run them
3. **Cortex is a Client** - Uses tools via Orion
4. **Divide by Category** - Don't create mega-workers
5. **LLM Decides** - Which tool to use from available list
6. **Queue per Category** - Enables parallel processing

---

## 💡 Example: Adding a New Tool

When you have a new tool (e.g., Discord message):

1. **Create tool file**: `executor/src/tools/comms/discord.tools.ts`
2. **Register in worker**: Add to `commsTools` object
3. **Register in Orion**: POST `/api/v1/orion/admin/register-tool`
4. **Deploy worker**: Restart comms-worker
5. **Available to Cortex**: Next LLM call sees it

No need to:
- ❌ Update Cortex
- ❌ Update Orion code
- ❌ Restart other workers

---

## 📞 Support

If you have questions about:
- **Tool organization**: See `executor/src/tools/` structure
- **Worker setup**: See `executor/src/workers/` examples
- **Queue integration**: See `packages/queue/`
- **MCP SDK**: See `packages/mcp/`
