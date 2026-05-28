<div align="center">

<img src="./apps/web/app/icon.svg" alt="WorkVerse" width="80" height="80" />

# WorkVerse

**AI-Powered Virtual Office — Execute Work, Not Just Plan It**

[![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)]()
[![Monorepo](https://img.shields.io/badge/monorepo-Turborepo-EF4444?style=for-the-badge)]()

</div>

---

## Overview

WorkVerse is a unified virtual office where teams enter a shared digital workspace, collaborate in real-time, and issue natural-language commands that get executed end-to-end by AI agents — no manual workflows, no tab-switching.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js · HTML5 Canvas · WebRTC |
| **Backend** | Fastify · WebSocket · Redis Pub/Sub |
| **AI** | LLM APIs · MCP · n8n Workflows · RAG |
| **Storage** | PostgreSQL (Prisma) · MongoDB · Redis · Vector DB |
| **Auth** | Clerk |
| **Infra** | Turborepo · Docker · Kubernetes · Helm |
| **Observability** | Prometheus · Grafana |

---

## Project Structure

```
workverse/
├── apps/
│   ├── web/             # Next.js frontend (virtual office UI)
│   ├── cortex/          # Core API server (Fastify)
│   ├── synapse/         # WebSocket & real-time services
│   ├── flux/            # Event streaming & messaging
│   ├── orion/           # Service discovery & routing
│   ├── space/           # Virtual office spatial engine
│   ├── executor/        # Task execution service
│   ├── forger/          # Workflow generation engine
│   ├── mail-forger/     # Email automation service
│   ├── scribe/          # Message persistence worker
│   ├── n8n/             # n8n workflow integration
│   └── docs/            # Documentation site
├── packages/
│   ├── db/              # Prisma schema & DB client
│   ├── redis/           # Redis client & utilities
│   ├── mcp/             # MCP server & tool registry
│   ├── queue/           # Job queue abstractions
│   ├── schemas/         # Shared validation schemas
│   ├── security/        # Auth & security utilities
│   ├── email/           # Email templates & sending
│   ├── convo-store/     # Conversation storage layer
│   ├── evaluator/       # AI evaluation utilities
│   ├── ui/              # Shared React components
│   ├── eslint-config/   # Shared ESLint config
│   └── typescript-config/ # Shared TS config
├── containers/          # Dockerfiles
├── infra/               # K8s manifests & Helm charts
├── turbo.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **Bun** (`npm install -g bun`)
- **Docker** & Docker Compose

### Setup

```bash
git clone https://github.com/your-org/workverse.git
cd workverse

bun install

cp .env.example .env
# Fill in your environment variables

docker-compose up -d

bun dev
```

---

## Roadmap

- [x] Virtual Office UI (2D Canvas + presence)
- [x] Real-time chat & WebSocket infrastructure
- [ ] LLM intent parsing + MCP tool selection
- [ ] n8n workflow generation from prompts
- [ ] Tool integrations (Email, GitHub, Slack, Zoom)
- [ ] RAG memory layer + Vector DB
- [ ] Mobile app
- [ ] Enterprise SSO + audit logs

---

## Contributing

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

```bash
git checkout -b feature/your-feature
git commit -m "feat: description"
git push origin feature/your-feature
```

---

## License

MIT — see [LICENSE](./LICENSE).

<div align="center">

**Built with 🔥 by the WorkVerse team**

</div>
