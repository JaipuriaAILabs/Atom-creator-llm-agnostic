---
name: atom-creator-create
description: Generate course markdown + JSON from an APPROVED spec. Invoke after /plan, or when the user says /create {slug} or "generate course content for {slug}". Detects archetype (Concept Sprint or Hands-On) from spec and loads the appropriate generation rules. Returns: courses/{slug}-{concept-sprint|hands-on-guide}.md + courses/JSONS/{slug}.json.
license: MIT
recommendedAgent: course-researcher
---

# Atom Creator — Create Course Content (Stage 2)

> Pipeline: `:plan` → `:create` (you are here) → `:audit` → `:assets` → `:db-insert` → `:final-audit`

**Purpose:** Generate course markdown + JSON from an approved spec. Detects archetype from the spec header and loads the appropriate generation rules. Performs structural validation but NOT content quality audit — run `/audit` for that.

**Input:** `{slug}` — positional argument. Supports flags: `--restore <status>` and `--screens N,M,P`.

**Output:**
- `courses/{slug}-concept-sprint.md` (Concept Sprint) or `courses/{slug}-hands-on-guide.md` (Hands-On)
- `courses/JSONS/{slug}.json` (structured JSON for the Rehearsal app)

**Next step:** `/audit {slug}`

---

## Pipeline

### Step 0: Argument Resolution + Environment Check

If no slug provided (or only flags), Glob `courses/specs/*-spec.md`, list available, ask which to generate for. If `.atom-creator-config.json` missing, run `atom-creator-setup`.

### Step 1: Validate Spec

**Flag parsing (before status validation):**

- `--restore <status>`: Read `shared/spec-versioning.md`. Execute Restore Protocol. STOP after restore.
- `--screens 5,8,12`: Partial regen mode. Validate each as positive integer. If combined with `--restore`: error. If combined with blueprint mode: error. Use Protocol A-Partial (accepts CREATED, APPROVED, or GENERATED). Verify BOTH MD and JSON already exist.

**Normal full generation:**

1. Read `shared/handoff-protocol.md` for parsing rules
2. Read `shared/status-definitions.md` for status acceptance
3. Locate spec at `courses/specs/{slug}-spec.md`. If not found, list available and suggest closest match.
4. Verify `**Status:**` is `APPROVED`, `GENERATED — audit passed`, or `REFINED — v{any}` (prefix match).
5. If status is `GENERATED` / `REFINED` (re-gen case): warn user via inline prompt: "This course has already been generated. Re-generating resets status to CREATED and requires re-audit. Continue? (yes/cancel)". God-mode default: yes.
6. DRAFT → abort with "Run `/plan {slug}` to complete QG2 approval."
7. CREATED → abort with "Course content already generated. Run `/audit {slug}` to quality-check, or re-run `/create {slug}` to regenerate (resets to CREATED)."

### Step 2: Extract Spec Data

#### 2.5 — Detect Archetype

Read `**Archetype:**` from the spec header. Concept Sprint (or absent) → CS path. Hands-On → HO path. Archetype determines which files load (Step 3), which rules apply (Step 4), which structural checks run (Step 6).

#### 2.7 — Detect Blueprint Mode

Check for `## Course Blueprint` heading. **Present** → Multi-artifact mode. Extract blueprint: mode, total screens, Screen Architecture, Game Placements, Interview Subtype Framings. Add to constraint block. **Absent** → Default mode.

#### Concept Sprint constraint block

Extract from spec:
```
Genre: [one of 8]
Genre Prose Mechanisms: [list of 4]
Genre DO NOTs: [list of 3-4]
Braided Technique: [No / Yes: {details}]
Provocation Level: [Professional / Contemporary / Provocative]
Voice: [letter + name]
Layer 1 title: [Title]
Layer 2 skill: [Skill name]
Screen count: [12-14]
Framework type: [Type # + name]
Artifact type: [Type # + name]
Artifact rendering: [Narrative / Table (NxM)]
Artifact intro: [Pattern #]
Contrast: [Approach # + name] (if applicable)
Twist: [Mechanism # + name] (if applicable)
Human Problem: [Approach # + name] (if applicable)
Expert Tip: [Format # + name] (if applicable)
Synthesis: [Framing # + name] (if applicable)
Interview: [Framing # + name]
Scene-entry: [Approach # + name + family]
Scene-entry distribution: [Family plan]
Audience Posture: [novice-on-stack / domain-native]   ← activates C72 HARD GATE
```

**Research data** from `## Research Summary (Appendix)`:
- Company Examples table
- Counterintuitive Finding
- Domain Metrics table
- Failure Case
- Expert Practice
- Glossary Terms table
- Course Generation Brief
- **Research Registry** — source-of-truth for every R-claim; only VERIFIED + PLAUSIBLE claims can appear in prose (PLAUSIBLE claims require hedging)

#### Hands-On constraint block

```
Archetype: Hands-On
Voice: The Instructor
Layer 1 title: [Title]
Layer 2 skill: [Skill name]
Screen count: [8-18]
Screen plan: [Full screen-by-screen table]
Artifacts: [Count + types]
MCQ count: [4-12]
Video count: [0-3]
Opening hook: [Style]
Visual direction: [Approach]
Game: [Included / Replaced / Neither]
```

### Step 3: Load Generation Rules

Read all files in parallel. Load ONLY for the detected archetype.

**Concept Sprint:** Read `shared/create-rules-cs.md` — follow its "Files to Load" section. Also load `shared/genre-system.md` (or `.claude/generation-guide/genre-system.md`).

**Hands-On:** Read `shared/create-rules-ho.md` — follow its "Files to Load" section.

**Both:** Load `.claude/generation-guide/generation-constraints.md` (banned phrases + DO NOT rules, single source of truth) and `.claude/generation-guide/audience-posture.md` (novice-first unpacking rules — MANDATORY when spec says `Audience Posture: novice-on-stack`; enforces P43 + C72).

Load `atom-creator-learnings.md` — apply any NEW learnings relevant to `:create`.

### Step 4: Generate Course Markdown

**If `PARTIAL_MODE`:** Read `shared/partial-regen.md`. Execute Partial Regeneration Protocol — handles Steps 4, 4.5, 5, 7 internally. Skip to Step 6 (structural checks on full course).

**Resume detection (full generation only):** If MD already exists at `courses/{slug}-{concept-sprint|hands-on-guide}.md`: ask user — regenerate from scratch / convert existing MD to JSON only / cancel. God-mode: regenerate.

#### Concept Sprint

Load `shared/create-rules-cs.md` for CS generation rules. Check the genre's Screen Function Specifications for how each screen type functions within the selected genre. Follow all genre-aware generation rules, quality rules, interview block structure, and blueprint-constrained generation.

#### Hands-On

Load `shared/create-rules-ho.md`. Follow Instructor voice, interview block structure, all quality rules.

#### Common

**Never begin a card with a sentence about what the card will cover. Begin with the content itself.**

Output filename:
- Concept Sprint → `courses/{slug}-concept-sprint.md`
- Hands-On → `courses/{slug}-hands-on-guide.md`

### Step 4.5: Inline Validation

Read `shared/inline-validation.md`. Execute Inline Validation Protocol (19 deterministic checks: V1-V9, V7b, V10-V19, V-ST1, V-ST2, V-ST3) on generated markdown and JSON. V17-V18 run on MD (number density, date anchoring). V19, V-ST2, V-ST3 run after JSON conversion.

Flag any screens for manual review before Step 5. Auto-fix patterns where the protocol specifies.

### Step 5: Convert to JSON

Read in parallel:
1. `.claude/generation-guide/json-schema.md` (or `shared/json-schema.md`) — block types, validation rules
2. `.claude/generation-guide/json-structuring.md` — DB format, conversion rules

**MANDATORY DUAL OUTPUT:** Both MD and JSON must be generated in the same session.

Convert the markdown to JSON following schema + structuring rules. For Hands-On courses, set `archetype: "hands_on"` in the JSON metadata.

**Cover screen as `screens[0]` (MANDATORY):**

```json
{
  "index": 0,
  "type": "cover",
  "image": "visual-0-cover.png",
  "mobile_image": "visual-0-cover-mobile.png",
  "title": "<metadata.subtitle value>",
  "subtitle": "<metadata.skill value>",
  "description": "<metadata.description value>",
  "blocks": []
}
```

**Cover field mapping:**
- `title` = `metadata.subtitle` (Layer 1 emotional title)
- `subtitle` = `metadata.skill` (Layer 2 technical skill)
- `description` = `metadata.description` (hook description, 80-120 chars)
- `image` = `"visual-0-cover.png"` (desktop 4:3)
- `mobile_image` = `"visual-0-cover-mobile.png"` (portrait 3:4)
- `blocks` = empty array (app renders cover as a visual card)

**Anti-pattern:** `metadata.cover` MUST NOT exist. Cover is `screens[0]`.

Content screens follow: `screens[1]` is the first content screen.

Write to `courses/JSONS/{slug}.json`. After writing, invoke `scripts/validate-json-on-save.sh {path}` via Bash.

### Step 5.5: Game & Tool Embed Gate

After writing base JSON, check if spec has `## Game Concept` and/or `## Tool Concept`. God-mode default: embed whichever exists as a file on disk or is declared in the spec.

**Game embed:**
```json
"game": {
  "position_after_screen": N,
  "title": "Game Title",
  "description": "Brief mechanic description",
  "rounds": ["Round 1", "Round 2", ...],
  "game_url": "/games/{slug}/{slug}-game.html"
}
```
`position_after_screen` from spec "Embeds after: Screen N".

**Tool embed:**
```json
"tool": {
  "name": "Tool Name",
  "subtype": "Self-Audit|Calculator|Matcher|Builder|Analyzer",
  "tool_url": "/games/{slug}/{slug}-tool.html"
}
```

Neither → no `game` or `tool` keys.

**Set course description:** After JSON conversion, set `description` in `course_metadata` (MD appendix + JSON). If the spec contains a `Course Description` field, use it VERBATIM (user-approved). Otherwise generate using the Opener × Stickiness taxonomy.

**Description taxonomy** (2-axis):

| Opener | Pattern |
|---|---|
| How [subject] | Observational window |
| Learn how to | Teaching promise |
| How to | Skill acquisition |
| Why [subject] | Counterintuitive revelation |
| [Imperative] | Empowering command |

**Stickiness (SUCCESs):** Simple / Unexpected / Concrete / Credible / Emotional / Stories. No type used >2x in a batch of 10.

**Format:** Single line, plain human language, focused on skill/art (not case study). No em/en dashes. No domain jargon. Must NOT repeat Layer 1 title or Layer 2 skill name.

### Step 6: Structural Checks

Load `shared/structural-checks.md` — single source of truth for C1-C72 + C-HO1-5 + C35-C43 blueprint.

**Execution order:**

1. Determine archetype from Step 1
2. Universal Checks (C1-C34): run "Both archetype" checks. Some have archetype-specific variants (C7, C9, C21, C22-C25, C31) — apply the correct variant.
3. Archetype-specific: CS variants of C7, C9, C21, C22, C23, C24, C25, C31, C33 — OR — HO variants + C-HO1 through C-HO5 (Premium Tutorial checks)
4. Card Architecture (C44-C56): run for BOTH. Note archetype-specific exemptions (C54 hands-on demo numbered steps; C55/C56 different story screen type lists)
5. Scrollytelling Checks (C57-C64): run for BOTH. Includes narrative proportion (C57), midpoint story card (C58 HARD GATE), genre consistency (C59), image uniqueness (C60), MCQ position distribution (C61 HARD), protagonist presence (C62 HARD), no self-created frameworks (C63 HARD), resolution aftermath (C64)
6. Novice-first: C72 (HARD GATE when spec declares `Audience Posture: novice-on-stack`)
7. Blueprint checks (C35-C43): ONLY when blueprint exists in spec

**Severity:**
- HARD GATE: fix before proceeding. Use check's prescribed error message from `structural-checks.md`.
- SOFT WARN: log, include in summary.
- All check IDs, severity, and error messages from `structural-checks.md` — do NOT hardcode.

Dispatch to the `structural-validator` agent (or run inline) for mechanical grep-based checks.

If any check fails, surface the specific failure and fix before proceeding.

### Step 7: Update Spec Status

**Snapshot first:** Read `shared/spec-versioning.md`. Execute Snapshot Protocol to capture current spec state before overwriting. If `PARTIAL_MODE`, use partial variant suffix.

Update spec `**Status:**` to `CREATED`. If spec was previously `GENERATED — audit passed` or `REFINED` (re-gen case), reset to `CREATED` to force re-audit.

If `PARTIAL_MODE`, append: `**Last partial regen:** screens {list} on {ISO timestamp}`.

### Step 8: Summary + Decision Hook

**If `PARTIAL_MODE`:** Summary was already output by `shared/partial-regen.md`. Offer `/audit {slug}` as next step. Skip full summary.

**Full generation summary:**

```
## Course Content Created  [Stage 2/6 complete]

  Archetype: [Concept Sprint / Hands-On]
  MD:   courses/{slug}-{concept-sprint|hands-on-guide}.md ✓
  JSON: courses/JSONS/{slug}.json ✓
  Checks: [N] screens, [N] MCQs, [N] glossary terms ✓

  Next: /audit {slug}   (6-agent content quality audit, ~2-3 min)
  Skip: /assets {slug}  (generate visuals + game — risks rework if content has issues)
```

Ask inline: "Ready to audit? (audit / assets / later)". God-mode default: audit.

---

## Troubleshooting

**Spec not found:** List `courses/specs/*.md`. Most common cause: typo in slug.

**Spec status DRAFT:** User hasn't completed approval. Tell them to run `/plan` and complete through QG2.

**Archetype field missing:** Default to Concept Sprint. Older specs are always concept sprints.

**Structural checks fail:** Fix specific issue (missing MCQs, wrong screen count) and re-verify. Do NOT proceed to status update with structural failures.

---

## Gotchas

- **Speculative language for Tier B numbers (P37):** On story bridge screens, use "more than", "nearly", "close to" for Tier B numbers (single-source, internal, contested). Tier A (multi-source verified) stays precise.
- **Financial figure date anchoring (V18):** Every revenue, AUM, market cap must have a date anchor ("as of FY24"). Volatile figures from sources >12 months old must be reverified. Bridgewater AUM "$150 billion" was wrong (actual $92-136B).
- **Reputational risk check (Dan Price precedent):** Never use a named person as a POSITIVE example without checking for post-research legal / reputational issues. Depersonalize to company name when the story works without the individual.
- **Novice-first (P43 + C72):** Senior titles (Founder, CXO, Senior Leader, Product Leader) do NOT imply technical literacy on a post-2023 specialized stack. When spec declares `Audience Posture: novice-on-stack`: unpack every acronym on first use (e.g., "MCP (Model Context Protocol — Anthropic's Nov 2024 spec)"), show before tell, concrete analogy before technical precision.
- **No fabricated MCQ scenarios:** MCQs use you/your framing — no invented characters, no made-up company names. Use real companies from the Research Registry.
- **Glossary term legitimacy (C66):** Every glossary term must appear in at least one research source as an established domain concept. Never coin compound nouns ("Competence-to-Compatibility Shift", "Strategic Refusal").
