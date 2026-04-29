/**
 * ARCHITECTURE GUIDE: Distributed MCP Setup
 * 
 * ============================================
 * System Architecture:
 * ============================================
 * 
 * 1. CORTEX (LLM Router)
 *    - Receives user prompt
 *    - Calls Orion with tool request
 *    - LLM decides WHICH tool to use
 *    - Waits for result
 * 
 * 2. ORION (API Gateway & Tool Router)
 *    - HTTP API receives tool requests
 *    - Tool Registry: Knows all ~50 tools and which worker has them
 *    - Routes request to appropriate Queue
 *    - Returns tool result back to Cortex
 * 
 * 3. REDIS QUEUE (Per Category)
 *    - comms-queue (Slack, Email, Teams, etc.)
 *    - infra-queue (AWS, GCP, K8s, etc.)
 *    - data-queue (DB, Analytics, etc.)
 *    - ... (more queues per category)
 * 
 * 4. EXECUTOR WORKERS (Multiple instances per category)
 *    - Each worker:
 *      * Has its own MCP Server instance
 *      * Registers tools for its category
 *      * Pulls jobs from queue
 *      * Executes MCP tools
 *      * Pushes results back to Redis
 * 
 * ============================================
 * WHERE TO INIT MCP:
 * ============================================
 * 
 * ❌ NOT in Cortex
 *    - Cortex only sends prompts/requests
 * 
 * ❌ NOT in Orion
 *    - Orion is a router/gateway only
 *    - It tracks which tools exist (registry)
 *    - But doesn't run the actual MCP servers
 * 
 * ✅ YES in Executor Workers
 *    - Each worker has its own MCP Server instance
 *    - Each worker's MCP server manages subset of tools
 *    - Worker category determines which tools to register
 * 
 * ============================================
 * FLOW: How LLM decides which tool to use:
 * ============================================
 * 
 * Step 1: Cortex asks LLM "what tool do you need?"
 *         LLM: "I need to send a Slack message"
 * 
 * Step 2: Cortex calls Orion's /tools endpoint
 *         Orion returns: { tools: [...] with schemas }
 * 
 * Step 3: Cortex sends to Orion: "Execute slack-send-message with params {...}"
 * 
 * Step 4: Orion looks up tool in registry:
 *         - Tool: "slack-send-message"
 *         - Category: "comms"
 *         - Queue: "comms-queue"
 * 
 * Step 5: Orion pushes job to "comms-queue"
 * 
 * Step 6: comms-worker pulls job from queue
 *         - Has MCP Server running
 *         - Calls: server.call("slack-send-message", params)
 * 
 * Step 7: comms-worker gets result, pushes to Redis result channel
 * 
 * Step 8: Orion retrieves result and sends to Cortex
 * 
 * ============================================
 * SETUP STEPS:
 * ============================================
 * 
 * 1. Update Orion:
 *    - Import toolRegistry
 *    - Add /tools endpoints to expose tool list
 *    - Add /tools/:id/execute endpoint to route requests
 * 
 * 2. Create Worker Categories:
 *    - executor/src/workers/comms.worker.ts ✅ (exists)
 *    - executor/src/workers/infra.worker.ts (create)
 *    - executor/src/workers/data.worker.ts (create)
 *    - ... (more as needed)
 * 
 * 3. Organize Tools by Category:
 *    - executor/src/tools/comms/* (Slack, Email, Teams, etc.)
 *    - executor/src/tools/infra/* (AWS, GCP, Docker, etc.)
 *    - executor/src/tools/data/* (DB, APIs, etc.)
 * 
 * 4. Each Worker:
 *    a. Creates MCP Server for its category
 *    b. Registers all tools in that category
 *    c. Starts listening to its queue
 *    d. Executes jobs and returns results
 * 
 * 5. Update Cortex:
 *    - Call Orion's /tools endpoint to get tool list
 *    - Use LLM to decide which tool
 *    - Call Orion's /tools/:id/execute endpoint
 * 
 * ============================================
 * HANDLING 50+ TOOLS:
 * ============================================
 * 
 * Don't create one worker with 50 tools.
 * Divide by logical groups (already doing this!):
 * 
 *   Category        | Tools | Worker Count
 *   ----------------+-------+-------------
 *   Communications  |  8    | 2 instances
 *   Infrastructure  | 12    | 3 instances
 *   Data/Database   |  15   | 3 instances
 *   Analytics       |  7    | 2 instances
 *   Files/Storage   |  5    | 1 instance
 *   Automation      |  3    | 1 instance
 * 
 * You can run multiple instances of same category worker.
 * Use load balancing when pulling from queue.
 * 
 * ============================================
 * MCP TRANSPORT:
 * ============================================
 * 
 * Option A: Stdio (default, good for single process)
 *   - Each worker process has stdio transport
 *   - Parent orchestrator manages all workers
 * 
 * Option B: HTTP/SSE (recommended for distributed)
 *   - Each worker runs on different port
 *   - Orion can call workers via HTTP
 *   - Better for multi-machine setup
 * 
 * Option C: WebSocket (for real-time)
 *   - Better for streaming responses
 *   - Good for async tool execution
 * 
 * ============================================
 * CONFIG EXAMPLE:
 * ============================================
 * 
 * .env file:
 * 
 * # Redis queues per category
 * QUEUE_COMMS=comms-queue
 * QUEUE_INFRA=infra-queue
 * QUEUE_DATA=data-queue
 * 
 * # Worker configuration
 * WORKER_CATEGORY=comms
 * WORKER_ID=comms-worker-1
 * WORKER_PORT=3003
 * 
 * # MCP Transport
 * MCP_TRANSPORT=http
 * MCP_LISTEN_PORT=3003
 * 
 * ============================================
 */

export const architectureGuide = "See comments above";
