# Personal Knowledge Infrastructure (PKI)

A multi-agent AI system that captures, classifies, stores, and proactively surfaces information across 10+ life domains. Designed and built for one user — me — because no existing tool could handle the cross-domain complexity of managing health, career, finances, benefits, projects, and household in a single system.

**I am not a software engineer.** My background is Navy nuclear power, manufacturing maintenance, and program management. I defined the requirements, made the architecture decisions, and directed the implementation. The system was built iteratively across 7 phases using Claude Code.

---

## The Problem

Information fragmentation across life domains creates cognitive overhead that compounds. A doctor's appointment needs to update your calendar, trigger a benefits portal check, log a journal entry, and adjust your supplement schedule. No off-the-shelf tool orchestrates that — because no product manager has ever been paid to build for a market of one.

So I built it.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           20+ Autonomous Agents          │
│  (launchd schedules, 2x/day to weekly)   │
└─────┬───────┬───────┬───────┬────────────┘
      │       │       │       │
      ▼       ▼       ▼       ▼
┌─────────────────────────────────────────┐
│            MCP Protocol Layer            │
│      57 tools across 6 domains           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│       Postgres (Neon, 23 schemas)        │
│  Structured knowledge SSOT, 182+ tables  │
│  pgvector embeddings, HNSW indexes      │
└─────┬───────┬───────┬───────┬────────────┘
      │       │       │       │
      ▼       ▼       ▼       ▼
┌─────────────────────────────────────────┐
│         LLM Routing Layer                │
│  Cloud (Anthropic) for complex reasoning │
│  Local (Ollama) for routine classification│
│  Batch API for cost-sensitive inference  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      Cloudflare Workers Dashboard       │
│  OAuth auth, private + shop views        │
│  Real-time data from Postgres            │
└─────────────────────────────────────────┘
```

## Key Design Decisions

| Decision | Chosen | Rejected |
|----------|--------|----------|
| Data store | Postgres (Neon) | File-based vault (Obsidian) |
| Hosting | Cloud (Neon) | Self-hosted (Home server) |
| Tool standard | MCP Protocol | Custom API |
| Dashboard | Cloudflare Workers + Next.js | Static site |
| LLM routing | Hybrid (cloud + local) | Cloud-only or local-only |
| Auth | OAuth (Google) | Password, passkey (deferred) |

## What Ships

- **Calendar sync**: Apple EventKit → Postgres, 2x/day
- **Job alert monitor**: IMAP inbox scanning + LLM classification + fit scoring, 2x/day
- **Email classification**: Employer/recruiter email routing, every 4 hours
- **Health data sync**: FHIR record retrieval from health systems (on-demand)
- **VA benefits sync**: VA.gov claims + disability ratings + appeals status (on-demand)
- **CoS Curation**: Daily briefing agent that surfaces what needs attention
- **Life Advisory Council**: 8 persona-driven AI advisors that deliberate on decisions
- **Forgotten thread trawler**: Weekly scan for commitments that fell through the cracks
- **Model researcher**: Weekly evaluation of local LLM performance against task anchors
- **Witness**: Restricted-tier journal synthesis, local LLM only, weekly
- **Deadline scanner**: Daily check for upcoming dates and expirations

## Tech Stack

**Database**: Neon Postgres 17, 23 schemas, pgvector, HNSW indexes
**Agent Runtime**: Claude Code (complex agents) + standalone TypeScript scripts (high-volume)
**LLM Providers**: Anthropic API (Sonnet, Haiku), Ollama local (Llama, Qwen variants)
**RAG Pipeline**: bge-m3 embeddings, Cohere reranker, hybrid cloud/local retrieval
**Dashboard**: Next.js + Cloudflare Workers via OpenNext, Auth.js v5 + Google OAuth
**MCP Server**: TypeScript, @modelcontextprotocol/sdk, @neondatabase/serverless
**Scheduling**: macOS launchd (20+ plists)
**Embeddings**: pgvector, 1024-dimensional, across 9 short-prose table families

## Product Lessons Learned

Building for a single user sounds easier than building for a market. You know exactly what the user needs — you are the user. There is no one to convince and no stakeholder to negotiate with.

What I did not expect: that is also the hardest part.

With no other user to challenge your assumptions, you build things you never use and optimize for scenarios that never happen. The most useful addition to the system was the Life Advisory Council — eight AI personas (CFO, CTO, health advisor, legal counsel, coach, and others) that debate decisions and surface disagreements. It is a way of manufacturing the adversarial perspective that a product team provides naturally.

The broader lesson: when AI lowers the cost of building software to nearly zero, the bottleneck shifts from engineering capacity to product thinking. Anyone who can define what needs to be built can now direct its construction. That changes who builds products — and which problems get solved.

---

*Built by Caleb Hopper.*
