# AGENTS.md — Project Instructions (cross-CLI portable)

This file is read by any Anthropic-Agent-Skills-compatible CLI (Claude Code, OpenCode, and forthcoming compatible agents) that opens a workspace containing this file. It defines the **contract between the human and the agent** for generating Rehearsal courses.

Drop this file at the root of your course-generation workspace. It takes precedence over generic model defaults.

---

## Project overview

This workspace produces **Rehearsal courses** — two archetypes:

| | Concept Sprint | Hands-On Guide ("Premium Tutorial") |
|---|---|---|
| **Best for** | Business strategy, management, analytical frameworks | Software tools, technical workflows, tutorials |
| **Screens** | 12-14 (sweet spot 13) | 8-18 |
| **Voice** | 4 rotating (Diagnostician, Contrarian, Narrator, Analyst) | Fixed: The Instructor |
| **Rules file** | `shared/screen-rules.md` (via skill-loaded generation-guide) | `shared/hands-on-screen-rules.md` |
| **Quality checks** | C1-C60 | C1-C60 + C-HO1 through C-HO5 |

A 6-stage pipeline transforms a raw topic into a shippable course:

```
/plan → /create → /audit → /assets → /db-insert → /final-audit
```

Each command invokes a skill. Each skill writes or reads a specific artifact. The **spec file is the persistent contract between stages** — every command validates its input spec status before proceeding.

---

## Directory structure

```
courses/                 Source of truth for generated courses
├── specs/               Approved course specs (stage handoff contracts)
├── JSONS/               Structured JSON for the Rehearsal app
├── sql/                 SQL INSERT statements for Supabase import
├── {slug}-concept-sprint.md   The rendered course markdown
└── batch-diversity-log.md     Auto-maintained diversity log — never edit manually

games/                   Interactive HTML mini-games + design docs
visuals/                 Generated course images (7-12 per course)
docs/                    Architecture plans and reference
previews/                HTML course flow previews
```

Workspace-level siblings (referenced by skills, not shipped with this plugin):

```
~/Python Projects/Rehearsal-Brand-Kit/    Rehearsal brand identity
~/Python Projects/Gradeless-AI-Brand-Kit/ Gradeless AI brand identity
```

---

## Generation philosophy

- **One framework per course, max.** Named multi-stage frameworks bloat cognitive load. When a concept is needed, it lives in a glossary card, not a meta-structure screen.
- **75-word hard cap per text block** (`C54`). Split at but/however pivots.
- **Person-place-action openings.** No staccato screenplay ("Final round. One of the top banks.") openings (P30).
- **Sensory density, forward-momentum bottom lines.** Stories must have a midpoint story card (`C58` HARD GATE).
- **Glossary card = definition only.** Strip setup paragraphs and forced narrative callbacks.
- **One `apply` screen, placed at position N−1.** Not three scattered `first_apply` / `harder_apply` / `apply` screens.
- **Screen 0 is always `type: "cover"` inside `screens[0]`.** NOT in `metadata.cover`.
- **No fabricated MCQ scenarios.** Use `you/your` framing; never invent characters.
- **Novice-first writing** (`P43`, `C72` HARD GATE for novice-on-stack specs). Senior titles do not imply technical literacy. Unpack every acronym on first use.

Full rule corpus lives in `shared/structural-checks.md`, `shared/content-audit.md`, `shared/storytelling-audit.md`.

---

## CRITICAL: Factual Verification Must Use Live Internet (NON-NEGOTIABLE)

**Every factual claim in any Rehearsal course must be verified against live internet sources using `mcp__perplexity__perplexity_search`, OpenCode's `webfetch`/`websearch` tool, or equivalent live-web access. Training-data plausibility checks are NOT verification.**

This rule exists because a previous batch of eight courses went through "external audits" that used LLM pattern-matching instead of actual web searches. A fabricated quote attributed to a Finance Minister, ghost academic citations, and wrong financial figures passed through undetected.

### Rules

1. **No audit agent may perform factual verification without explicit web search tool access.** If the agent lacks web search, use a general-purpose agent with explicit Perplexity instructions.
2. **Every "Study by X (Year)" citation must be searched on the internet.** If 2 searches don't find it → FABRICATED. Remove it.
3. **Every person attribution ("X said/did Y") must be web-verified** against the correct individual, not a more famous colleague.
4. **Every financial figure must be verified** for correct denomination (USD vs INR), correct metric (revenue vs profit vs GMV), and correct direction (higher vs lower).
5. **Post-August-2025 claims are unverifiable by training data** — they MUST be web-searched or flagged as unverifiable.
6. **"Directionally verified" and "flagged as suspicious" are NOT acceptable audit outcomes.** The only acceptable outcomes are: **VERIFIED** (with source URL), **FABRICATED** (searched, not found), or **UNVERIFIABLE** (explicitly marked for editorial review).

### Enforcement

- The `check-storytelling-signals` and `guard-ship-ready` TypeScript hooks enforce this at runtime.
- Any session that claims audit completion without web verification evidence is non-compliant and the run should be rejected.

---

## Status state machine

Every course spec file carries a status header. Commands validate status before proceeding and refuse to operate on wrong-status inputs.

| Status | Set by | Meaning | Accepted by |
|---|---|---|---|
| `DRAFT` | `:plan` (initial) | Not yet approved | — |
| `APPROVED` | `:plan` (QG2 HARD gate) | Ready for content generation | `:create` |
| `CREATED` | `:create` | MD + JSON generated, needs audit | `:audit`, `:assets` (warn) |
| `GENERATED — audit passed` | `:audit` | Content verified, ready for assets | `:create`, `:audit`, `:assets`, `:visuals`, `:game`, `:tool`, `:refine` |
| `REFINED — v{X.Y.Z}` | `:refine` | Verified against pipeline v{X.Y.Z} | all above + `:final-audit` |
| `SHIP-READY — final audit passed` | `:final-audit` | All quality gates passed, ready for deployment | All commands |

Invalid status transitions produce prescriptive error messages (see `shared/status-definitions.md`).

---

## How to invoke skills

### In OpenCode

Skills auto-load when placed under `.opencode/skills/{skill-name}/SKILL.md`. The model selects a skill based on its `description` frontmatter. You can also invoke explicitly by name:

```
> Use the atom-creator-plan skill with this input: "Senior Leader — KPI redesign for engineering VPs"
```

Slash commands are the idiomatic shortcut:

```
> /plan Senior Leader — KPI redesign for engineering VPs
```

### In Claude Code (upstream plugin)

The equivalent CC plugin exposes each command under `/atom-creator:<name>`:

```
> /atom-creator:plan Senior Leader — KPI redesign
```

---

## Sub-agents

Four sub-agents are available; they delegate specialized work under the pipeline's orchestration:

| Agent | Used by | Model tier |
|---|---|---|
| `course-researcher` | `/plan` (Phase 2 research) | high |
| `content-auditor` | `/audit` (6 parallel audit passes) | mid |
| `structural-validator` | `/create`, `/refine` (C1-C60 checks) | mid |
| `visual-director` | `/assets`, `/visuals` (art direction) | high |

Set per-agent models in `opencode.json`:

```json
{
  "agent": {
    "course-researcher": { "model": "moonshot/kimi-k2.6-max" },
    "content-auditor":   { "model": "moonshot/kimi-k2.6" }
  }
}
```

---

## Key environment variables

| Variable | Purpose | Required for |
|---|---|---|
| `MOONSHOT_API_KEY` | Kimi K2.6 default provider | Default model |
| `PERPLEXITY_API_KEY` | Live web factual verification | `/audit`, `/final-audit` (non-negotiable) |
| `FAL_KEY` | fal.ai SeedDream image gen | `/assets`, `/visuals` |
| `ATOM_CREATOR_ASSETS` | Override UGC reference image dir | `/ugc` only (optional) |

Put these in `.env` at the project root. The installer writes them interactively on first run.

---

## When in doubt

1. Read the upstream command file: `shared/` or `commands/` (the command file is the authoritative phase definition).
2. Read `shared/structural-checks.md` for any C-code threshold — that file is the single source of truth.
3. Never hardcode thresholds in skill prose — always cross-reference `shared/`.
4. The **batch diversity log** (`courses/batch-diversity-log.md`) is auto-maintained by the pipeline. Do not hand-edit.
