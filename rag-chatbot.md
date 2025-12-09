# RAG_CHATBOT.md

A practical, step‑by‑step guide to building a Retrieval‑Augmented Generation (RAG) chatbot for an **Asset Inventory Management System** using **Next.js (UI)**, **NestJS (API)**, **TypeORM**, **PostgreSQL** (with optional **pgvector**), and **Replicate (gpt-4o-mini)**.

---

# 1. Summary

This document lists requirements, tools, architecture, and a full step‑by‑step implementation plan to build a production‑quality RAG chatbot that answers asset-related questions. It covers a hybrid approach (structured SQL + semantic search), prompt templates, ready‑made prompts, a short disclaimer, token‑saving techniques, monitoring, and rollout tips.

---

# 2. Requirements (prereqs)

* Developer skills: Node.js, TypeScript, SQL, basic ML/embeddings concepts.
* Accounts & Keys:

  * Replicate API key (for gpt-4o-mini and embedding model)
  * Postgres DB credentials (admin user for extension setup)
* Environment:

  * Node.js 18+ and pnpm / npm / yarn
  * Docker (optional, recommended for local dev)
* Services (recommended):

  * PostgreSQL 14+ (with ability to install extensions)
  * Redis (for caching and job queues)
* Libraries and tooling:

  * Next.js (client UI)
  * NestJS (server/API)
  * TypeORM (data access)
  * pgvector extension for Postgres (optional, recommended for semantic retrieval)
  * BullMQ (or Bull) for background jobs
  * A lightweight admin UI (AdminJS, Prisma Studio, or pgAdmin)

---

# 3. Tools & Components (stack)

* Frontend: **Next.js** (React) — chat UI, example prompts, feedback controls
* Backend: **NestJS** — `/api/chat` endpoint, retrieval orchestration, Replicate wrapper
* Database: **PostgreSQL** + **pgvector** extension (optional) — structured data + embeddings table
* ORM: **TypeORM** — models/entities and DB access
* LLM: **Replicate** — `openai/gpt-4o-mini` (generation) and an embedding model (Replicate or OpenAI alternative)
* Cache/Queue: **Redis** + **BullMQ** — embedding generation jobs, rate limiting, caching
* Optional helpers: **LangChain / LlamaIndex** for retrieval pipelines (optional)

---

# 4. Architecture & High‑level Flow

```
[User (Next.js Chat UI)]
     ↓ (POST /api/chat)
[NestJS API] 
  ├─ (1) Intent/parser → try to extract structured filters
  ├─ (2) Structured SQL via TypeORM (if filters present)
  ├─ (3) (Optional) Semantic retrieval via pgvector
  ├─ (4) Build concise prompt (system + context + user)
  └─ (5) Call Replicate (gpt-4o-mini) → receive short, direct answer
     ↓
[Next.js Chat UI displays answer]

Optional background tasks:
- Embedding generation (on create/update) → store into `asset_embeddings`
- Periodic reindex / batch embedding jobs for historical data
```

---

# 5. Data Model (recommended minimum)

* `assets` — id, name, type, serial_no, status, location, assigned_to, created_at, updated_at
* `issuances` — id, asset_id, issued_to_user_id, department_code, issuance_date, notes
* `maintenance_logs` — id, asset_id, notes, performed_by, maintenance_date
* `disposals` — id, asset_id, disposal_date, reason

**Embedding table (pgvector)**

```sql
CREATE EXTENSION IF NOT EXISTS vector; -- run as postgres superuser

CREATE TABLE asset_embeddings (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
  source_table TEXT, -- 'assets' | 'issuances' | 'maintenance_logs'
  source_id INT,     -- id in the source table
  content TEXT,      -- text used to create the embedding
  embedding VECTOR(1536),
  updated_at TIMESTAMP DEFAULT now()
);
```

Notes:

* `content` should include short meaningful text (description, issuance note, maintenance summary).
* Embedding dimension (1536) is example — match the embedding model you pick.

---

# 6. When to use pgvector (short answer)

* **Use pgvector** when you want semantic/meaning‑based matching (user makes vague or freeform queries like "items given to new employees").
* **Do not rely on pgvector** for exact, auditable numbers — use structured SQL for that.
* Hybrid approach (structured + semantic) gives the best balance of accuracy and conversational power.

---

# 7. End‑to‑end Step‑by‑Step Build Plan

This is a practical checklist you can follow in sequence.

## Step 0 — Project setup

1. Create monorepo (or separate repos) for `frontend` (Next.js) and `backend` (NestJS).
2. Initialize TypeScript, ESLint, Prettier, and CI pipelines.

## Step 1 — Database & TypeORM

1. Provision Postgres (locally via Docker or cloud).
2. Install `pgvector` extension (if you plan to use it).

   * `CREATE EXTENSION IF NOT EXISTS vector;`
3. Create TypeORM entities for `assets`, `issuances`, `maintenance_logs`, `disposals`.
4. Create `asset_embeddings` table (see schema above).
5. Run migrations.

## Step 2 — Backend baseline

1. Scaffold NestJS app.
2. Add TypeORM integration and DB connection.
3. Implement endpoints:

   * `POST /api/chat` — main chat entrypoint
   * Optional admin endpoints to trigger reindexing
4. Add authentication middleware (JWT / session) and RBAC checks.

## Step 3 — Embedding pipeline

1. Choose embedding model (Replicate or alternative).
2. Implement a service that:

   * Receives an object (issuance note, asset description)
   * Calls the embedding model (Replicate) to get the vector
   * Stores vector in `asset_embeddings`.
3. Wire embeddings generation to entity hooks (on create/update) or background jobs (BullMQ) for bulk processing.
4. Add an admin job to backfill embeddings for historical data.

## Step 4 — Semantic retrieval (pgvector)

1. Implement NestJS service `EmbeddingService` to:

   * Create embedding for user query
   * Execute a similarity query against `asset_embeddings`:

     ```sql
     SELECT source_table, source_id, content
     FROM asset_embeddings
     ORDER BY embedding <-> '[query_vector]'::vector
     LIMIT 5;
     ```
2. Normalize & de-duplicate retrieved records and attach to context.

## Step 5 — Hybrid retrieval flow

1. Implement query parser (simple rule-based or use the LLM to extract filters). Steps:

   * Try to extract structured filters (asset_id, department_code, date range)
   * If filters exist, run structured SQL via TypeORM
   * Independently run pgvector semantic search if the query is fuzzy or if additional context is helpful
2. Combine structured results + semantic snippets for LLM prompt.

## Step 6 — Prompt engineering & Replicate integration

1. Define a *system prompt* that enforces concise answers and a strict output format.

   **Example system prompt:**

   ```text
   You are an AI assistant for an Asset Inventory Management System.
   Your purpose is to answer questions strictly related to asset management —
   such as assets, issuance, maintenance, disposal, or related operational data.

   Guidelines:
   - Give very short and factual answers.
   - No unnecessary commentary, greetings, or explanations.
   - If the user asks a question outside asset management topics, respond exactly with:
     "Sorry, I could not answer that question. I'm an AI smart assistant chatbot for asset management purposes only."
   - Never generate or assume data not found in the provided context or database.
   ```

2. Create prompt templates (see examples below).
3. From NestJS, call Replicate's model (`gpt-4o-mini`) with a request containing:

   * System instruction
   * Context (structured records + semantic snippets)
   * User message
   * Parameters (temperature: 0.0–0.3, max_tokens small)
4. Parse model response, validate (optionally), and return to frontend.

## Step 7 — Frontend chat UI

1. Implement chat UI in Next.js.
2. Show **ready‑made prompts** under input box (examples below).
3. Show the disclaimer banner and feedback buttons (👍 / 👎).
4. Display structured responses in a compact format (tables, bullets).

## Step 8 — Monitoring, QA & feedback loop

1. Log queries, context used, LLM responses, and whether users accepted the answers.
2. Build a simple review queue for flagged answers.
3. Re-train prompt templates and retrieval heuristics from feedback.

## Step 9 — Production hardening

1. Add caching (Redis) for expensive queries.
2. Add rate limiting and concurrency controls for Replicate calls.
3. Secure API keys and secrets (Vault or environment variables).
4. Add audit logging for sensitive queries.

---

# 8. Prompt templates & ready‑made prompts

## System prompt (enforce style)

```
System: "You are a concise asset management assistant. Answer in one or two short sentences. Do not add filler text or speculative comments. If you don’t have enough data, say: 'Insufficient data — please check the asset records.'"
```

## Prompt template (hybrid)

```
SYSTEM: <system prompt above>
CONTEXT: [StructuredRecords]
CONTEXT_SNIPPETS: [semantic_snippets]
USER: "{user_query}"
INSTRUCTION: "Provide a short factual answer. If returning counts or lists include exact numbers and short bullets."
```

## Ready‑made prompts for UI (examples to show users)

* `What is the status of Asset #A0452?`
* `Show assets issued to department DEP5487 in the last 2 months.`
* `List laptops currently under maintenance.`
* `Who is assigned Asset #X340?`
* `Items given to new employees this quarter` (best with: include start/end date or say "new hires this quarter where hire_date >= ...")

**How these help the LLM:**

* Encourage structured queries → easier to map to SQL → more accurate answers
* Reduce ambiguity → fewer hallucinations and fewer tokens spent by model guessing
* Enable predictable prompt templates → easier to enforce concise responses

---

# 9. Token & Cost optimization (practical tips)

* **Low temperature** (0–0.3) for deterministic output.
* **Limit max_tokens** to reasonable values (e.g., 128) and paginate if results exceed.
* **Prune context**: only include top‑K semantic snippets (K = 3–5) and only necessary fields from structured rows.
* **Compress long logs**: summarize long maintenance notes offline (embedding job) and store short summaries to include in context.
* **Use templates** so LLM responses are short and predictable.
* **Cache** frequent responses in Redis.

---

# 10. Safety, validation & disclaimers

* **Always validate critical numeric answers** with SQL aggregation before showing them as authoritative.
* Add UI disclaimer (visible near chat input):

> ⚠️ *This AI assistant may make mistakes. For critical or auditable information, please verify using the official reports and analytics dashboard. For best results, ask direct questions and include asset IDs or department codes.*

* Store user consent and access logs when users request sensitive asset data.

---

# 11. Example code snippets (conceptual)

> *These are illustrative snippets — adapt them for your codebase.*

## TypeORM entity (asset_embeddings)

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('asset_embeddings')
export class AssetEmbedding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  asset_id: number;

  @Column({ type: 'text' })
  content: string;

  // Note: TypeORM doesn't have a built-in 'vector' type mapping in some versions.
  // Use columnType or a custom transformer depending on your driver.
  @Column({ type: 'vector', nullable: true })
  embedding: number[]; // stored as pgvector

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
```

## Example semantic search SQL

```sql
-- query_vector is the embedding produced for the user query
SELECT source_table, source_id, content
FROM asset_embeddings
ORDER BY embedding <-> '[query_vector]'::vector
LIMIT 5;
```

## Example Replicate call (conceptual)

```js
// Pseudocode: replace with proper HTTP client
const body = {
  model: 'openai/gpt-4o-mini',
  input: {
    system: 'You are a concise asset assistant...',
    context: combinedContext, // small, pruned string
    prompt: userMessage,
    temperature: 0.2,
    max_tokens: 120
  }
};
// fetch Replicate API with Authorization: Bearer <API_KEY>
```

---

# 12. Testing & validation

* Unit tests for retrieval logic (both SQL and pgvector branches).
* Integration test that simulates a chat query end‑to‑end (create test records → call /api/chat → assert format and correctness).
* A/B test prompt templates for accuracy vs token cost.

---

# 13. Monitoring & feedback loop

* Store: user query, structured filters, semantic hits, LLM prompt, LLM output, user feedback (thumbs up/down).
* Build a small admin review list for low‑confidence or flagged answers.
* Periodically tune: prompt templates, top‑K, and embedding model if needed.

---

# 14. Deployment checklist

* Secure env variables and API keys
* Run DB migrations and extension install
* Set up Redis and background workers
* Enable logging and metrics (Prometheus/Grafana or similar)
* Deploy Next.js as a static app or server (Vercel, Netlify, or self‑host)
* Deploy NestJS as serverless function or container (Heroku, AWS ECS, GCP Cloud Run)

---

# 15. Appendix — UX copy to add to chat UI

**Header system message:**

> Hello — I can help find asset info quickly. For accurate results include asset ID, code, or date ranges. This assistant may be helpful but not authoritative for audits.

**Disclaimer (near chat input):**

> ⚠️ *AI answers may be approximate. Please verify with official reports for critical decisions.*

**Ready prompts UI (rotating):**

* `What is the status of Asset #A0452?`
* `Show assets issued to department DEP5487 in the last 2 months.`
* `List laptops currently under maintenance.`

---

# 16. Final tips

* Start small: ship direct-lookup and simple chat first (no pgvector). Add semantic search and embeddings later.
* Keep the LLM’s role narrow: help interpret intent and format answers; rely on DB for facts.
* Provide clear guidance to users (prompts + disclaimer) to reduce ambiguous queries and hallucinations.

---

If you want, I can:

* Add a **visual flowchart** (diagram) for this architecture, or
* Create **concrete NestJS + TypeORM** code files (controller + service + embedding worker) as a starter template.
