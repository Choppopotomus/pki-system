# Personal Knowledge Infrastructure (PKI)

Last year I hit a wall managing health, career, finances, benefits, projects, and household across a dozen disconnected tools. No off-the-shelf product handled the cross-domain complexity — because no product manager gets paid to build for a market of one. So I built one.

This is a multi-agent AI system that captures, classifies, stores, and proactively surfaces information across 10+ life domains. It runs 20+ scheduled agents, routes work between local and cloud LLMs depending on sensitivity and cost, stores everything in Postgres, and surfaces what matters through a dashboard.

**I'm not a software engineer.** My background is Navy nuclear power, manufacturing maintenance, and program management. I defined the requirements, made the architecture decisions, and directed the implementation across 7 phases.

---

## One Decision I Got Wrong First

The initial version sent everything to Claude's API — classification, personal journal analysis, high-level reasoning, all of it. It worked. But I was sending health records and journal entries to a cloud I didn't control, and the API bill climbed fast.

The fix was a hybrid that should have been the starting point: local models (Ollama — Llama, Qwen variants) handle anything involving PII or repetitive classification. Claude handles complex reasoning — strategy, synthesis, council deliberations. The local models are less capable and need more careful prompting. The wins: health data never leaves my machine, and the API bill dropped 70%.

| Decision | Chosen | Rejected |
|----------|--------|----------|
| PII/compliance data routing | Local models (on-device) | Cloud API (initial — reversed) |
| Complex reasoning | Cloud LLM (Anthropic Claude) | Local model (too unreliable) |
| Data store | Postgres (Neon) | File-based vault (Obsidian) |
| Hosting | Cloud (Neon) | Self-hosted (deferred) |
| Agent tools | MCP Protocol (standard) | Custom API |
| Dashboard | Cloudflare Workers | Static site |
| Auth | OAuth (Google) | Password (deferred) |

---

## Architecture

```
20+ Autonomous Agents ──► MCP Tools (57) ──► Postgres (23 schemas)
                                                    │
                                          LLM Routing Layer
                                          ┌─────────┬─────────┐
                                          │  Local   │  Cloud  │
                                          │ (PII ✓)  │ (Smart) │
                                          └─────────┴─────────┘
                                                    │
                                          Cloudflare Dashboard
```

## What Ships

- **Calendar sync** — Apple EventKit → Postgres, 2x/day
- **Job alert monitor** — IMAP inbox → LLM classifies → scores against rubric
- **Email classification** — Employer/recruiter routing, every 4 hours
- **Health data sync** — FHIR records from health systems (on-demand)
- **VA benefits sync** — Claim status, ratings, appeals (on-demand)
- **CoS Curation** — Daily briefing: what needs attention today
- **Life Advisory Council** — 8 AI personas that debate decisions
- **Forgotten thread trawler** — Weekly scan for dropped commitments
- **Model researcher** — Weekly local LLM performance eval
- **Witness** — Journal synthesis, local LLM only, weekly
- **Deadline scanner** — Daily check for upcoming dates

## Tech Stack

**Database:** Neon Postgres 17, 23 schemas, pgvector, HNSW indexes
**Agent runtime:** Claude Code (complex) + TypeScript scripts (high-volume)
**LLM providers:** Anthropic API (Sonnet, Haiku), Ollama local (Llama, Qwen)
**RAG:** bge-m3 embeddings, Cohere reranker, hybrid cloud/local retrieval
**Dashboard:** Next.js + Cloudflare Workers, Auth.js v5 + Google OAuth
**MCP server:** TypeScript, @modelcontextprotocol/sdk
**Scheduling:** macOS launchd (20+ plists)

## What It Actually Does for Me

The outcome I care about most: it reminds me of commitments I've made and holds me to them. I told myself I'd follow up on a job application in two weeks — it flags it. I said I'd check a lab result after an appointment — it prompts me. That accountability is what makes the system useful, not the automation or the AI.

## What Surprised Me

Building for a single user sounds easier. You know exactly what the user needs — you are the user. No stakeholders to negotiate with, no PM to convince.

What I didn't expect: that's also the hardest part. No one tells you you're wrong. I built things I never used and optimized for scenarios that never happened. The Life Advisory Council — eight AI personas that debate decisions — was my response to that. It's a way of manufacturing the adversarial perspective a product team naturally provides. It turned out to be the most useful part of the system.

The broader lesson: when AI lowers the cost of building software, the bottleneck shifts from engineering to product thinking. Anyone who can define what needs to be built can now direct its construction. That changes who gets to build products.

---

*If this resonates, I'd welcome a conversation: chop.ops@proton.me. Built by Caleb Hopper.*
