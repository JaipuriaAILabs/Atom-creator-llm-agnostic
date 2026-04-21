# God-Mode Auto-Resolution Rules

> This file is loaded by each Agent spawned during `/atom-creator:god-mode`.
> It replaces every `AskUserQuestion` call in the standard pipeline with deterministic auto-resolution rules.
>
> **Core directive:** DO NOT use `AskUserQuestion` at any point. Follow these rules to resolve every decision point autonomously.

---

## Stage 1: Plan (`commands/plan.md`)

### Phase 0: Input Detection + Content Extraction

**0.2 — Role/Industry/Level inference (unstructured inputs):**
- Auto-accept the best inference. Do not ask for confirmation.
- Default Level to "Mid-level" if unclear.
- Default Industry to "Cross-Industry" if unclear.

**0.3 — Confirm inferred mapping (unstructured inputs):**
- Skip confirmation. Proceed with inferred mapping as if user selected "Confirm — proceed to research."

**0.5 — Structured input parsing (missing fields):**
- Default Level to "Mid-level" if absent.
- Default Industry to "Cross-Industry" if only Role provided (1 field, no delimiters).
- If Role is missing entirely, ABORT — cannot auto-resolve without a role.

**0.6 — Existing course check:**
- If a course already exists for this role, auto-select "Generate a second course (exclude existing skill)."
- Never auto-select "Update existing course."

**0.7 — Archetype selection:**
- Auto-select "Auto-detect from topic."
- After Phase 1 research, apply the classification:
  - Topic involves a specific tool/software/platform with actionable steps → **Hands-On Guide**
  - Topic involves strategic concepts, frameworks, company examples → **Concept Sprint**
  - Ambiguous → **Concept Sprint** (more versatile format)

### Phase 1: Research + Skill Extraction

**1.3 — QG1 skill selection:**
- Pick the candidate with the highest composite score (Signal x Differentiation x Urgency).
- If tied, pick the one with higher Differentiation (more unique = more engaging).
- Do not ask user. Proceed immediately with the top candidate.

### Phase 1.2c + 1.5 — Research Registry (v8.1.0)

- Auto-extract claims without user review. Generate 8-20 R-numbers per course.
- Run `web_fetch` verification in parallel (batch up to 5 URLs per call).
- Auto-accept all VERIFIED claims.
- Auto-hedge all PLAUSIBLE claims (apply approximate language).
- For HIGH RISK claims: attempt one replacement search via `mcp__perplexity__perplexity_search`. If replacement found with VERIFIED status, substitute. If not, apply maximum hedging and include with a note in the Registry. Do NOT block generation for HIGH RISK claims in god-mode.
- For claims with 0 sources: auto-remove. Do NOT include in Registry or spec.
- Do NOT present the Research Registry for user review. It is assembled silently and written to the spec.
- Time budget: max 90 seconds for all web_fetch calls combined. If verification is slow (>90s), mark remaining unverified claims as PLAUSIBLE and proceed.

### Genre Auto-Resolution (replaces Framing Direction)

1. Run genre signal extraction (Step 1.1b) on research findings
2. Pick the highest-scoring genre
3. Tiebreaker priority: Literary Journalism > Investigative > Corporate Biography > Legal > Industry Epic > Geopolitical > Practitioner Memoir > Behavioral Science
4. Default (no signal above 1): Behavioral Science (concept-first, safest)
5. Braided Technique: Always No in god-mode (requires user judgment on vocabulary mapping)
6. Provocation Level: Professional (default)
7. Voice: Genre's Primary voice (from Genre × Voice Affinity matrix)

**Content-only mode:** God-mode NEVER selects content-only. Always includes game + tool in autonomous mode.

### Phase 2.5: Course Blueprint

- **Auto-select "Default mode (Recommended)"** — god-mode always bypasses the blueprint system.
- Do NOT present the mode selection question.
- Do NOT load `shared/blueprint-system.md`.
- Proceed directly to Phase 3 with standard single-game, single-interview behavior.

**Rationale:** Multi-artifact mode requires nuanced structural decisions that benefit from human judgment. God-mode prioritizes speed and safety — default mode is proven and predictable.

### Phase 3: Creative Decisions (Concept Sprint / Hands-On)

For every decision, follow the **Decision Logic Cheatsheet** in `shared/decision-tables.md` (or `shared/hands-on-decisions.md` for Hands-On):

1. Read all options for the decision
2. Apply the cheatsheet's recommended selection logic
3. **Tiebreaker:** Batch variety — scan `courses/specs/*.md` for the batch variety table, pick the option least-used across the last 4 courses
4. If still tied, pick the first option listed (the spec author's recommendation)
5. Record each decision with a one-line rationale

**Title selection (Decision 1):** Pick the highest-scoring title option. Prioritize underused naming archetypes from the variety map. Never pick a title that uses the same archetype as the previous course.

**Description selection:** Pick the description option with the best batch variety score (least-used Opener type among last 2 courses + Stickiness type used fewest times in current batch). If tied, pick the option whose Stickiness type most naturally fits the research hook (e.g., use "Unexpected" when a counterintuitive finding is the strongest hook, "Concrete" when a vivid sensory detail anchors the skill). Record both the description text and its Opener x Stickiness types in the spec.

### Phase 4: Review Panels

- **SKIP entirely.** Do not present any review panels.
- The decisions from Phase 3 are final.
- Phase 3's auto-resolved decisions ARE the user's choices — proceed directly to spec writing.

### QG2: Spec Approval

- Auto-approve. Set status to `APPROVED`.
- Write the spec file to `courses/specs/{slug}-spec.md`.
- Do NOT present the spec for user review.

---

## Stage 2: Create (`commands/create.md`)

### Step 8: Decision Hook (Next Step Prompt)

- Skip entirely. Do not ask "What would you like to do next?"
- After MD + JSON files are written and structural checks pass, exit the agent.
- Update spec status to `CREATED`.

---

## Stage 3: Audit (`commands/audit.md`)

### Tier 2 Fixes

- **Auto-accept ALL Tier 2 fixes.** Do not present individual fixes for approval.
- Apply all recommended changes for:
  - Ambiguous MCQ distractors → apply the recommended rewrite
  - High-risk company claims → apply cautionary hedging language
  - Any other Tier 2 items → apply recommended fix
- Apply triple-sync: every fix applied to MD + JSON + database section simultaneously.

### Step 7: Decision Hook (Next Step Prompt)

- Skip entirely. Do not ask "What would you like to do next?"
- After all audit cycles complete and status is `GENERATED — audit passed`, exit the agent.

### Max Cycles

- If 3 audit cycles exhausted without all agents passing, ABORT.
- Output a full error report listing all remaining failures by agent.
- Do NOT ask user whether to continue — just abort.

---

## Stage 4a: Visuals (`commands/visuals.md`)

### Visual Pipeline Override (MANDATORY)

God-mode auto-resolves creative decisions but **NEVER bypasses the visual generation skill pipeline.**

- The `/course-visual-generator` (concept sprint) or `/hands-on-visual-generator` (hands-on) skill MUST be invoked via `/atom-creator:visuals`.
- Do NOT generate images directly using `nano-banana-pro:generate`.
- Do NOT write image prompts without running the full 6-phase pipeline.
- The skill pipeline ensures: Style Seed consistency, art direction brief, palette/perspective locking, visual audit, and photorealism bans.
- All quality gates run — god-mode auto-approves them (see below), but the pipeline itself is not skipped.

### Audit Gate

- Skip the audit gate check. Do not warn about unaudited content.
- Proceed directly to visual generation regardless of spec status.

### Phase 1 — Visual Philosophy Gate

- Auto-classify visual type:
  - If hero company detected (60%+ narrative) AND recognizable design language → **Company-Driven**
  - If famous persona anchors the course AND recognizable by silhouette → **Personality-Driven**
  - Otherwise → **Lateral** (default)
- For Lateral type: pick the highest-scored metaphor candidate from the brainstorm. Tiebreaker: prefer cognitive dissonance candidates over literal domain references.
- Do NOT present the classification or metaphor options to the user.

### Phase 2 — Art Direction Brief

- Auto-generate the art direction brief (`visuals/{slug}/art-direction.md`) without user review.
- Accept all auto-derived palette, style fusion, composition, and style seed decisions.
- Do NOT ask user to review or modify the brief.

### Phase 3 — Sample Prompt

- AUTO-APPROVE. Skip test-and-iterate.
- Generate the sample cover prompt, then immediately proceed to full prompt set generation.
- Do NOT present the sample for user review or test generation.

### Phase 4-5 — Full Prompts + Image Generation

- Generate all prompts immediately after Phase 3.
- Still run the mandatory post-generation aspect ratio check (`sips -g pixelWidth -g pixelHeight`) after EVERY image.
- If aspect ratio is wrong (square 1024x1024 when landscape 4:3 expected), regenerate with `--model pro --ratio 4:3` up to 3 times.
- If still wrong after 3 attempts, mark that image as SKIPPED and continue with remaining images.

### Phase 6 — Visual Audit

- Auto-pass SOFT warnings (VA checks with WARN severity).
- Fail only on HARD checks (VA checks with FAIL severity). If any HARD check fails, attempt one auto-fix cycle. If still failing after auto-fix, report the failure and continue.
- Do NOT present the visual audit report to the user.

---

## Stage 4b: Game (`commands/game.md`)

### Audit Gate

- Skip the audit gate check. Do not warn about unaudited content.
- Proceed directly to game generation regardless of spec status.

### Experience QG (5-Point Test)

- Run the 5-point experiential quality test silently (no user display).
- If score >= 3/5: proceed to generation.
- If score < 3/5: auto-redesign the game concept ONCE (adjust mechanics to improve experiential score).
- If redesigned concept still scores < 3/5: SKIP game generation entirely. Report the failure in the agent output.

### Game Audit (Agent 4)

- Auto-accept ALL game audit fixes without presenting them for approval.
- If the game audit identifies critical structural failures that cannot be auto-fixed, SKIP game output. Report the failure.

### Next Step Prompt

- Skip entirely. Do not ask "What would you like to do next?"
- After game files are written and audit passes, exit the agent.

---

## Stage 5: DB Insert (inline in orchestrator)

### Step 3: Metadata Confirmation

- Skip. Do not present metadata for user confirmation.
- Auto-proceed with extracted metadata.
- If metadata is incomplete (missing `course_metadata` fields), read the spec file to fill gaps.
- If still incomplete after reading both JSON and spec, SKIP SQL generation only. All other artifacts are preserved.
