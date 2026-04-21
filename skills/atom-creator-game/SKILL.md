---
name: atom-creator-game
description: Generate an interactive single-file HTML mini-game from an approved spec's ## Game Concept section. Invoke when the user says /game {slug} or as part of /assets. Runs mechanic diversity check, Agent 4 quality audit (7-gate checklist), aesthetic family selection. Returns: games/{slug}/design.md + games/{slug}/{slug}-game.html.
license: MIT
recommendedAgent: content-auditor
---

# Atom Creator — Generate Interactive Game

> Stage 4 has three parallel tracks: visuals + **game** + tool. This skill owns the game track.

**Purpose:** Generate an interactive mini-game from the approved spec's game concept. Includes automatic game mechanics audit (Agent 4) as a hard quality gate.

**Prerequisites:**
1. Spec: `courses/specs/{slug}-spec.md` (status `GENERATED — audit passed`, `REFINED — v{any}`, or `CREATED` with warning)
2. Course markdown at one of the two archetype paths

**Input:** `{slug}`

**Output:**
- `games/{slug}/design.md` (game design document)
- `games/{slug}/{slug}-game.html` (single-file playable game)

---

## Pipeline

### Step 0: Argument Resolution + Environment Check

If no slug, Glob specs and ask. If `.atom-creator-config.json` missing, run `atom-creator-setup`.

### Step 1: Validate Prerequisites

1. Load `shared/handoff-protocol.md` + `shared/status-definitions.md`.
2. Locate spec. If missing, suggest closest match.
3. Verify status: `GENERATED — audit passed`, `REFINED — v{any}`, or `CREATED`.
4. DRAFT → abort. APPROVED → abort. CREATED → warn inline; god-mode default: proceed.
5. Verify course MD exists (try both paths). Record which path was found.

### Step 2: Context Load

Read in parallel:
1. Spec — game concept + visual direction
2. Course MD — learning context for game design
3. `games/GAME-DESIGN.md` — game design system and reusable patterns
4. `atom-creator-learnings.md` (if present) — Game Design section

### Step 2b: Mechanic Diversity Check

1. Read `courses/batch-diversity-log.md` — find Visual & Game Assets table.
2. Count mechanic uses.
3. If the spec's proposed mechanic is at the diversity cap (3 uses), flag and suggest alternatives with 0-1 uses.
4. **Pedagogical fit overrides diversity cap (v10.16.0):** If the proposed mechanic fits the course's core skill significantly better than any lower-usage alternative, USE THE PROPOSED MECHANIC. Document override in `design.md` under `## Mechanic Selection — Diversity Override` section with one-sentence rationale. Diversity is a secondary tiebreaker — NOT a primary gate.

**God-mode default:** accept the spec's mechanic. Override only when the spec has no specific proposal.

### Step 3: Extract & Parse

#### 3a — Game Concept from Spec

Extract all six fields from `## Game Concept`:

- **Mechanic family:** one of 10 families in `shared/decision-tables.md` Decision 15 (Allocation, Matrix Placement, Multi-Round Strategy, Progressive Reveal, Signal Detection, Dialogue Tree, Portfolio Builder, Slider Balance, Contradiction Hunt, Rapid Classify Swipe)
- **Rounds:** number + what changes per round (learning arc). Rapid Classify Swipe: typically 10-15 cards in one deck.
- **Embed position:** `position_after_screen` (typically after Screen 8 or 10)
- **Game sketch:** what the player does, what goes wrong in Round 1, what the framework reveals by the final round
- **Aesthetic family** (Decision 15a): one of `Arcade Pop | Sci-Fi Matrix | Editorial Mono | Keynote Vitrine | WhatsApp Mockup | NOVEL: {context}`. **Native-UI-First Rule:** if the mechanic has a real-world software UI analog (Dialogue Tree → WhatsApp/Slack/email; Classification → filing cabinet; Allocation → bank transfer UI), prefer `NOVEL: {context-name}` over any documented family.
- **Performance tailoring signal:** the variable that drives the Reflect-phase tailored line (e.g., `misses`, `catches`, `streak`, `correctCount`). Specify which 3 buckets trigger which copy.
- **Scoring substrate:** `evergreen logic` | `AI-capability classification`. Determines whether Agent 4 Check 23 (AI honest calibration) applies.

**If any field is missing from the spec — HARD BLOCK.** Use inline prompt:
- Option 1: re-run `/plan --refine {slug}` to add missing fields
- Option 2: annotate spec with explicit defaults and proceed (WRITES defaults back to spec)
- Option 3: abort

**God-mode default:** option 2 (annotate with canonical defaults) — but write the values BACK TO THE SPEC, never keep them only in conversation context. Agent 4 verifies alignment against `design.md` so the spec MUST carry declared values.

**Canonical defaults (if annotating):**
- Aesthetic family: run Native-UI-First test first. If mechanic has real-world UI analog → `NOVEL: {context-name}`. Else: Arcade Pop for Allocation/Classification mechanics; Editorial Mono for reflective / analytical mechanics; Sci-Fi Matrix for Signal Detection.
- Tailoring signal: mechanic-dependent. Contradiction Hunt → `misses`. Rapid Classify → `catches`. Allocation → `starRating`. Dialogue Tree → `deployCount` or `correctReplies`.
- Scoring substrate: `evergreen logic` unless Rapid Classify / Signal Detection on AI content → `AI-capability classification`.

**Multi-game detection (Blueprint mode):** If spec has `## Course Blueprint` with multiple Game entries: extract ALL game concepts. Games generate SEQUENTIALLY (each gets own context + mechanic selection + quality gate). Each produces separate files: `design-{N}.md` and `{slug}-game-{N}.html`. Each must use a DISTINCT primary mechanic.

#### 3b — Learning Context from Course MD

Extract:
- **Framework name + stages** — becomes the round structure or player choices
- **Companies + concepts** — become game content (no fabricated companies — use real ones from the Research Registry)
- **Glossary terms** — become UI labels verbatim (at least 4 must appear in the game)
- **Artifact type** — informs game output format

#### 3c — Visual Identity

- Accent color from spec's `## Visual Direction`
- Background: aesthetic-family-specific (e.g., Arcade Pop = vibrant; Editorial Mono = #0a0a0a)

### Step 4: Dispatch to Game Designer

Delegate to the `game-design` skill via OpenCode skill composition (it auto-loads when a game-design skill is nearby). Pass:

```
Slug: {slug}
Course title (Layer 1): [from spec]
Technical skill (Layer 2): [from spec]
Course MD path: [path from Step 1]

Game Concept:
  Mechanic family: [from spec]
  Rounds: [count + arc]
  Embed position: after Screen [N]
  Game sketch: "[2-3 sentences from spec]"
  Aesthetic family: [from spec]
  Performance tailoring signal: [variable + 3 buckets]
  Scoring substrate: [evergreen logic | AI-capability classification]

Learning context:
  Framework: [name + stages]
  Real companies: [list from Research Registry]
  Glossary terms: [4+ terms to use verbatim]

Visual identity:
  Accent: [hex]
  Background: [per aesthetic family]

Design system: games/GAME-DESIGN.md
Audit: shared/game-audit.md

HARD CONSTRAINTS:
- Single HTML file — no npm, no build step, no external APIs
- Vanilla JS + optional Web Audio API (prefer over Tone.js for chiptune)
- max-width: viewport-fit scrollable
- Mute toggle with localStorage persistence (key: `{slug}-game-muted`)
- Color-state mapping: game state colors mirror course visual-N doors/categories exactly
- FORCED states rendered with distinct visual treatment (not silently converted)
- Budget constraint (if Multi-Round Strategy): valuable option paired with scarcity

OUTPUT FILES:
  games/{slug}/design.md
  games/{slug}/{slug}-game.html
```

Also load `game-design-theory` skill for pedagogical depth (Step 3c depth items, 7-Gate Zero-Shot Checklist).

**Hook-transcript workaround (known issue):** When `:game` is delegated from a parent skill, the `guard-game-generation` hook may read the PARENT transcript, not the subagent's. Before delegating, the parent session must:
1. Invoke the `game-design` skill once — satisfies Gate 1
2. Invoke the `game-design-theory` skill once — satisfies Gate 2
3. Read the reference game HTML for the chosen aesthetic family — satisfies Gate 3

Reference HTMLs:
- Editorial Mono: `games/manager-organizational-resilience-design/manager-organizational-resilience-design-game.html`
- WhatsApp Mockup: `games/enterprise-growth-lead-techno-commercial-selling/enterprise-growth-lead-techno-commercial-selling-game.html`
- Arcade Pop: `games/founder-agent-readiness/founder-agent-readiness-game.html`

### Step 5: Game Quality Audit (Agent 4)

Load `shared/game-audit.md`. Run the audit (7-gate + 23-check system):

**7 Gates (HARD):**
1. Pedagogical alignment — game teaches what course teaches
2. Non-triviality — optimal strategy not obvious; wrong choices have real costs
3. Depth of interaction — not just multiple-choice recast as a game
4. Binary + honest scoring — every attempt PASS / FAIL / FORCED with honest feedback
5. Mechanic-aesthetic match — aesthetic family fits the mechanic
6. Single-file compliance — no external APIs, no npm
7. Course vocabulary integration — 4+ glossary terms verbatim

**23 Checks** (mix of HARD and SOFT):
- C1-C5: Mechanic integrity (rounds advance state, state affects scoring, etc.)
- C6-C10: Visual + audio polish
- C11-C15: Failure handling (FORCED states, retry rules, edge cases)
- C16-C20: Course integration (companies, glossary, framework)
- C21-C23: AI honest calibration (only if scoring substrate is AI-capability classification)

**HARD GATE:** All 7 gates must PASS. If gates 2 or 4 fail, recommend full regeneration (mechanic fundamentally broken).

**Handling:**
- Auto-apply small fixes (label changes, color swaps, FORCED state rendering)
- Flag structural HARD failures for user approval (regenerate? specific fix?)
- God-mode default: auto-apply small fixes; flag gates 2 / 4 failures for user

### Step 5b: Update Batch Diversity Log

Update `courses/batch-diversity-log.md` Visual & Game Assets table for this slug:
- Game Mechanic column
- Game Name column
- Aesthetic family (add column if missing)

### Step 6: Output Summary

```
## Game Generated

### Game
  HTML:      games/{slug}/{slug}-game.html ✓
  Design:    games/{slug}/design.md ✓
  Mechanic:  [mechanic family]
  Aesthetic: [aesthetic family]
  Rounds:    [count]
  Audit:     All 7 gates PASS ✓

  Next: open games/{slug}/{slug}-game.html to play-test
```

---

## Gotchas

- **Missing spec fields are HARD BLOCK** — never silently default. Six fields (mechanic, rounds, embed position, sketch, aesthetic, tailoring signal, scoring substrate) must be in the spec. Annotate with defaults and WRITE BACK to spec.
- **Native-UI-First Rule** — real-world UI analogs beat documented aesthetic families. Dialogue Tree → WhatsApp/Slack/email. Classification → filing cabinet / library. Allocation → bank transfer UI. Progressive Reveal → notebook / CCTV. Documented families are fallback.
- **Budget constraint as pedagogy** — Multi-Round Strategy with a "valuable option" MUST pair with a quantified budget tighter than blanket-apply. Without it, the naive move is trivially optimal.
- **Transfer test in final round** — every Multi-Round game should have a final-round transfer test featuring at least one novel entity not named in the course MD. Forces framework reasoning, not pattern matching.
- **FORCED state disambiguation** — when budget forces a non-optimal move, render with distinct visual treatment. Preserves Gate 4 (binary + honest) — player sees penalty, not sanitized fallback.
- **Chiptune via Web Audio beats Tone.js** — for <10 distinct sounds + one music loop, use `OscillatorNode` + `BiquadFilterNode`. Reserve Tone.js for polyphonic / scheduled music.
- **Mute toggle with localStorage** — persist state using slug-scoped key: `{slug}-game-muted` = '0' | '1'. Required for every game with audio.
- **Surprise R4 intervention** — streak-based surprise interventions > static round content for teaching consequence.
- **Brand color = state color** — if a course has a framework visualized in one of its images (e.g., Screen 8 shows three doors in three brand colors), the game MUST use the same color-to-state mapping. Syncs mental-model across visual and interactive.
- **Forced-state visual treatment** — when budget hits 0 and player picks License (or similar), render "FORCED BLOCK" with distinct visual (dashed shadow, forced label). Preserves 7-Gate Gate 4.
