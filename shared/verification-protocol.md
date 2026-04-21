# Dual-Track Perplexity Verification Protocol

> Canonical reference for the research verification system. Used by:
> - `commands/plan.md` Phase 1.5 (primary implementation)
> - `agents/course-researcher.md` (agent prompt reference)
> - `skills/research-verifier/SKILL.md` (skill reference)
> - `shared/content-audit.md` Agent 5 (audit cross-reference)

## The Problem

Perplexity MCP provides LLM-synthesized research. Using LLM output as input to another LLM creates compounding hallucination risk.

**Known failure patterns (from atom-creator-learnings.md):**

| Pattern | Example | Root Cause |
|---------|---------|------------|
| **Attribution swap** | Andrew Chen credited for Kevin Frisch's $100M ad fraud test at Uber | Perplexity merged two executives' contributions |
| **Citation merging** | Pendo (6.4%) and Userpilot (181 companies) merged into one fictional stat | Two different studies combined into one attribution |
| **Ghost publications** | "2024 Deloitte survey" about 53% CXOs — publication doesn't exist | Perplexity synthesized a plausible-sounding source |
| **Direction inversion** | LinkedIn lateral move data INVERTED — said worse retention, actual data says 41% longer | Perplexity got the comparison direction wrong |
| **Financial conflation** | Meesho revenue called "profitability" | Revenue ≠ profit ≠ valuation ≠ GMV |
| **Reputational blindspot** | Dan Price (Gravity Payments) used as positive example — charged with assault since 2022 | Perplexity didn't surface post-research legal issues |

## The Protocol: Dual-Track Research

### Track 1: Discovery (Perplexity)
Use for SPEED — finding candidate information, URLs, company data.

Tools:
- `mcp__perplexity__perplexity_research` — deep multi-source investigation
- `mcp__perplexity__perplexity_search` — specific facts, URLs, recent data

Output: Candidate claims + source URLs. These are LEADS, not FACTS.

### Track 2: Verification (Web Fetch)
Use for TRUTH — reading primary sources to confirm claims.

Tools:
- `mcp__claude_ai_Parallel_Web__web_fetch` (preferred — accepts multiple URLs)
- `WebFetch` (built-in fallback)

For EVERY claim with:
- Specific numbers, percentages, or financial figures
- Specific dates or durations
- Attribution to a named person
- Causal claims ("X led to Y")
- Biographical claims (job titles, career sequences)

### Verification Steps

1. **Extract source URL** from Perplexity output
2. **web_fetch the actual page** with `search_objective` = claim text
3. **Compare** claim against raw source:
   - **Exact match** → VERIFIED
   - **Directional match** (different precision) → VERIFIED with precision note
   - **Absent** (page exists, claim not there) → PLAUSIBLE
   - **Contradicts** → HIGH RISK (include contradicting text)
   - **Inaccessible** (404, paywall) → fall back to Perplexity verification

### Verification Classification

| Status | Criteria | Course Prose Treatment |
|--------|----------|----------------------|
| `VERIFIED` | 2+ sources confirm with matching specifics | Precise language: exact numbers, names, dates |
| `PLAUSIBLE` | 1 non-marketing source supports | Hedging: "roughly", "approximately", "around" |
| `HIGH RISK` | Marketing-only source, or contradiction found | Heavy hedging: "reportedly", "according to some estimates" |
| `REMOVED` | 0 sources found | DO NOT include in course. HARD GATE |

### Research Registry Format

```
| R# | Claim | Type | Source URL | Evidence (first 200 chars) | Verification | Hedging? |
|----|-------|------|-----------|---------------------------|-------------|----------|
| R1 | Meesho revenue ₹7,615 crore FY24 | metric | ET article URL | "The Bengaluru-based social commerce..." | VERIFIED | No |
| R2 | 53% of CXOs admit metrics gaming | metric | [not found] | — | REMOVED | — |
```

Claim types: `metric`, `attribution`, `causal`, `biographical`, `temporal`

## Exempt from Verification

These categories do NOT require web_fetch verification:
- General industry knowledge ("FMCG companies use distributor networks")
- Framework definitions ("Porter's Five Forces consists of...")
- Historical facts widely documented across 10+ sources
- Academic theory citations (cite the paper/book, not a Perplexity summary)

## Parallelization

Batch up to 5 URLs per `web_fetch` call (the tool accepts multiple URLs with a common `search_objective`). Group claims by source URL to minimize API calls.

## Integration Points

- **`:plan` Phase 1.5** — primary implementation of the protocol
- **`:create`** — reads Research Registry, applies hedging rules per verification status
- **`:audit` Agent 5** — cross-references Registry: claims absent from Registry start at MEDIUM risk floor
- **`:audit` Agent 5 Step 6** — Precision Drift check: flags claims that add temporal qualifiers not in source
- **`agents/course-researcher.md`** — agent follows this protocol for all research tasks
- **Hook F (validate-sql-on-save.sh)** — pre-flight JSON check before SQL embedding
