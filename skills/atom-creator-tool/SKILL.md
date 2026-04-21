---
name: atom-creator-tool
description: Generate an interactive Course Tool (self-audit, calculator, matcher, builder, analyzer) from an approved spec's ## Tool Concept section. Invoke when the user says /tool {slug} or "generate tool for {slug}". Separate from games — a course can have both. Returns: games/{slug}/{slug}-tool.html single-file HTML.
license: MIT
recommendedAgent: content-auditor
---

# Atom Creator — Generate Course Tool (Standalone)

> Stage 4 has three parallel tracks: visuals + game + **tool**. This skill can run as part of `:assets` or standalone.

**Purpose:** Generate an interactive Course Tool from the approved spec's `## Tool Concept` section. Tools serve the learner — they take inputs from the learner's real situation and produce personalized analysis. A **Game** challenges the learner. A **Tool** serves the learner. A course can have both.

**Tool Subtypes:** Self-Audit, Calculator, Matcher/Picker, Builder, Analyzer

**Prerequisites:**
1. Spec: `courses/specs/{slug}-spec.md` (status `GENERATED — audit passed`, `REFINED — v{any}`, or `CREATED` with warning)
2. Course markdown: `courses/{slug}-concept-sprint.md` OR `courses/{slug}-hands-on-guide.md`
3. Spec must contain `## Tool Concept` section (created via `:plan` Decision 16)

**Input:** `{slug}`
**Output:** `games/{slug}/{slug}-tool.html` — single-file interactive tool

---

## Pipeline

### Step 0: Argument Resolution + Environment Check

If no slug, Glob specs and ask. If `.atom-creator-config.json` missing, run `atom-creator-setup`.

### Step 1: Validate Prerequisites

1. Load `shared/handoff-protocol.md` and `shared/status-definitions.md`.
2. Locate spec. If missing, suggest closest match.
3. Verify status: `GENERATED — audit passed`, `REFINED — v{any}`, or `CREATED` (with warning).
4. DRAFT → abort with "Run `/plan`". APPROVED → abort with "Run `/create`".
5. If `CREATED` only: warn that vocabulary may mismatch an unaudited course; ask whether to run `/audit {slug}` first. God-mode default: proceed without audit.
6. Verify course MD exists.
7. Check spec contains `## Tool Concept` section. If absent: "This spec has no Tool Concept. Either re-run `:plan` or add the section manually following `shared/spec-template.md`."

### Step 2: Context Load

Read in parallel:
1. Spec
2. Course MD
3. `shared/tool-design-system.md` — 8 design principles + 5 subtype specs + technical constraints
4. `shared/tool-audit.md` — Agent 5 Tool Quality Auditor definition
5. `atom-creator-learnings.md` (if present) — Tool Design section

### Step 2b: Subtype Diversity Check

1. Read `courses/batch-diversity-log.md` — find the Tool Subtype column in the Visual & Game Assets table.
2. Count usage per subtype.
3. If the spec's proposed subtype is at the cap (4 uses), flag:
   - Present count to user
   - Suggest next-best subtype from the Subtype → Framework Type Mapping
   - User confirms (god-mode default: accept the suggested alternative)
4. If spec proposes no subtype, derive from framework type using the mapping table.

### Step 3: Extract & Parse

#### 3a — Tool Concept from Spec
- **Subtype:** Self-Audit / Calculator / Matcher-Picker / Builder / Analyzer
- **Course vocabulary (4-6 terms):** will become UI labels
- **User input:** what the user enters
- **Output:** what they get
- **Time estimate:** 2-5 minutes
- **Shareability:** copy-to-clipboard format string
- **Sketch:** 2-3 sentence description

#### 3b — Learning Context from Course MD
- **Framework name + dimensions:** rating axes (Self-Audit) or qualifying questions (Matcher) or output sections
- **Key metrics + thresholds:** for Calculator / Analyzer
- **Glossary terms:** the 4+ course vocabulary terms that must appear verbatim in the UI
- **Artifact type:** may inform the tool's output format

#### 3c — Visual Identity from Spec
- **Accent color** — from `## Visual Direction` (becomes tool accent per P7)
- **Background** — always `#0a0a0a` (dark UI is non-negotiable)

### Step 4: Build the Tool

Delegate to the `tool-design` skill via OpenCode skill composition. Pass this context block:

```
Slug: {slug}
Course title (Layer 1): [from spec]
Technical skill (Layer 2): [from spec]
Course MD path: [path from Step 1]

Tool Concept:
  Subtype: [from spec]
  Course vocabulary (4+ terms): [list]
  User input: [what the user enters]
  Output: [what they get]
  Time estimate: [from spec]
  Shareability format: [copy-to-clipboard string]
  Sketch: "[2-3 sentences]"

Visual identity:
  Accent: [hex from Visual Direction]
  Background: #0a0a0a

Design system: shared/tool-design-system.md
Audit checklist: shared/tool-audit.md

HARD CONSTRAINTS (non-negotiable):
- Single HTML file — no npm, no build step, no external APIs
- Vanilla JS only (no React, no GSAP)
- max-width: 680px, scrollable (NOT 100dvh)
- Dark UI: #0a0a0a background, course accent color
- "Nothing leaves your browser" must appear in the results section
- At least 4 course vocabulary terms as UI labels
- 3+ qualitatively distinct result states
- Empty state: submit disabled until required fields filled
- Copy-to-clipboard share card in results

MULTI-STEP STRUCTURE:
- Step 1: Context / naming inputs
- Step 2: Rating / data entry (course vocabulary as labels)
- Step 3: Results — scores, interpretation, prioritized actions, share card

OUTPUT FILE: games/{slug}/{slug}-tool.html
```

**Reference implementation:** `games/manager-organizational-resilience-design/org-resilience-audit.html` — study this pattern (Self-Audit, step flow, live score bar, share card).

If the `tool-design` skill is unavailable, generate the tool inline using the course-researcher or content-auditor agent with the same constraint block.

### Step 5: Tool Quality Audit (Agent 5)

Load `shared/tool-audit.md`. Run the 12-check audit (8 HARD, 4 SOFT):

| # | Check | Gate |
|---|-------|------|
| T1 | Course vocabulary integration (4+ terms as UI labels) | HARD |
| T2 | Input clarity (label + placeholder + help text) | HARD |
| T3 | Output actionability (3+ states, personalized actions) | HARD |
| T4 | Personalization depth (3+ qualitatively distinct result states) | HARD |
| T5 | Shareability (copy-to-clipboard moment exists) | SOFT |
| T6 | Privacy notice ("Nothing leaves your browser" visible) | HARD |
| T7 | Single-file compliance (no external APIs or scripts) | HARD |
| T8 | Dark UI compliance (#0a0a0a bg, course accent) | HARD |
| T9 | Mobile responsiveness (680px max-width, 44px touch targets) | HARD |
| T10 | Time estimate accuracy (2-5 min achievable) | SOFT |
| T11 | Empty state handling (submit disabled until fields filled) | HARD |
| T12 | Visual polish (transitions, animated reveals) | SOFT |

**Handling:**
- Single pass — no retry loop
- If >3 HARD failures, recommend full tool regeneration
- All HARD failures presented as fix checklist for user review
- God-mode default: auto-apply small HTML fixes that don't require creative judgment; flag structural HARD failures for user approval

**HARD GATE:** Tool is not delivered until all 8 HARD checks PASS.

### Step 5b: Update Batch Diversity Log

1. Read `courses/batch-diversity-log.md`
2. Find the row matching `{slug}` in the Visual & Game Assets table
3. Update `Tool Subtype` + `Tool Name` columns
4. If row doesn't exist, append a new row with tool columns populated
5. Write the updated log

### Step 6: Output Summary

```
## Tool Generated

### Tool
  HTML: games/{slug}/{slug}-tool.html ✓
  Subtype: [subtype]
  Time estimate: [N] minutes
  Audit: All 8 HARD checks PASS ✓

  Next: open games/{slug}/{slug}-tool.html in a browser to verify.
```

---

## Troubleshooting

**No Tool Concept in spec:** Add it manually following `shared/spec-template.md`, or re-run `/plan {slug}` to regenerate with Decision 16 included.

**T1 failure (vocabulary):** Tool designer didn't use course terms verbatim. Patch by replacing generic labels with exact terms from the course glossary.

**T8 failure (dark UI):** Every `background` declaration should reference `#0a0a0a`, `#141414`, or `#1a1a1a`. No exceptions. Search for inline styles or CSS variables that produce light surfaces.

**T11 failure (empty state):** Add `if (requiredFields.some(f => !f.value.trim())) return;` to the submit handler. Disable submit button by default; enable via input event listeners.

**Tool feels generic:** Most common failure. Tool designer must read the course MD and use exact framework terminology — not paraphrases.
