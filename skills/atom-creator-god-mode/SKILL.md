---
name: atom-creator-god-mode
description: Run the entire atom-creator pipeline autonomously — plan, create, audit, visuals, game, db-insert, final-audit — from a single topic input. Invoke when the user says /god-mode {topic} or "fully generate a course on {topic}". Auto-resolves all creative decisions. Pauses only at visual and game cost gates. Returns: complete course package (spec, MD, JSON, images, game, SQL).
license: MIT
recommendedAgent: course-researcher
---

# Atom Creator — God Mode (Full Pipeline, Zero Interaction)

> God-mode runs the ENTIRE atom-creator pipeline in one command:
> `:plan` → `:create` → `:audit` → `:visuals` → `:game` → `:db-insert` → `:final-audit`
>
> Auto-resolves ALL creative decisions, quality gates, and approval prompts.
> Only pauses at 2 hard gates: before visual generation and before game generation (image-gen API cost).
>
> For the interactive version with full control over every decision, use `/plan <input>`.

**Input formats:**
```
/god-mode Territory Sales Manager / FMCG / Mid-level   (structured)
/god-mode https://economist.com/some-article            (URL)
/god-mode /path/to/report.pdf                           (file)
/god-mode "US-Iran tensions and market turbulence"       (topic)
```

**Flags:**
- `--content-only` — skip visuals + game (content pipeline only). Runs: Plan → Create → Audit → SQL → Final Audit.

**Output:** Complete course package — spec, course MD, course JSON, 7-12 visuals (2 covers + 5-10 body), interactive game, SQL INSERT.

---

## Pipeline

### Step 0: Read Learnings

If `atom-creator-learnings.md` exists, read it. Apply ALL new learnings throughout the pipeline — visual, writing, factual, game, tool, JSON, SQL corrections accumulated from previous sessions.

### Step 0.1: Environment Check

If `.atom-creator-config.json` is missing, run `atom-creator-setup` first. Create `atom-creator-learnings.jsonl` if missing.

### Step 1: Warning Gate

Print the banner:

```
⚡ GOD MODE — Full Autonomous Pipeline

This command will run the ENTIRE course generation pipeline:

  Stage 1: Research + skill extraction + creative decisions (auto-resolved)
  Stage 2: Course content generation (MD + JSON)
  Stage 3: 6-agent content quality audit (auto-accept all fixes)
  Stage 4: Visual generation (7-12 images) — PAUSE for your approval
  Stage 5: Game generation — PAUSE for your approval
  Stage 6: SQL INSERT for Supabase
  Stage 7: External evaluator audit (auto-capture findings)

⏱️  Estimated time: 15-25 minutes (Kimi K2.6 backing; longer on smaller models)
💰  Image cost: ~$0.28-0.48 (7-12 images × SeedDream: 2 covers + 5-10 body)
⏸️  2 pause points: before visuals, before game

All creative decisions auto-resolved using batch variety + decision logic rules.
No interaction required until the visual generation gate.

Input: {$ARGUMENTS}
```

Wait for user to reply. Reasonable defaults if user replies `go` / `start` / blank-within-60s: proceed. If user replies `cancel`: stop immediately and suggest `/plan {$ARGUMENTS}` for interactive mode.

### Step 2: Record Baseline

Use Glob on `courses/specs/*-spec.md`. Store the list of existing filenames so the NEW spec can be identified after Agent A completes.

### Step 3: Stage 1 — Autonomous Plan (Agent A)

Read `shared/god-mode-agent-a-plan.md`. Replace `{{USER_INPUT}}` with `$ARGUMENTS`. Dispatch a sub-agent via OpenCode's Task tool (use the `course-researcher` agent) with this prompt. Mode: autonomous — bypass approval panels using god-mode defaults.

**God-mode default decision table:**

| Decision | Default |
|---|---|
| Archetype | Concept Sprint (unless input mentions "tutorial", "software", "step-by-step", "workflow") |
| Genre | Investigative Journalism (fallback: Behavioral Science for psych-heavy topics) |
| Audience posture | `novice-on-stack` for post-2023 tech topics (GenAI, agents, web3); else `domain-native` |
| Framing axis | Framework-first + Professional |
| Voice | Standard rotation: Diagnostician → Contrarian → Narrator → Analyst |
| Accent color | Pick from `courses/batch-diversity-log.md` unused bucket; else Indigo `#4e44fd` |
| Background | Deep midnight navy `#0a0f1e` |
| Opener taxonomy | "How [subject]" opener |
| Stickiness | Unexpected (counterintuitive revelation) |
| Visual type | Lateral (unless one company ≥60% narrative → Company-Driven) |
| Game mechanic | Classification (3-option, 5-round) with budget constraint |
| Tool subtype | Self-Audit Scorecard |
| Interview framing | Framing 5 (Current Affairs + Technical) |
| Midpoint card | Auto-select screen ⌈N/2⌉ as `type: "story_bridge"` |
| Screen count | 13 (Concept Sprint sweet spot) |
| Provocation level | Professional |
| Blueprint mode | Default (single game, single interview) |

### Post-Agent A Verification

1. Parse the output for `GOD-MODE-RESULT:` marker and extract the slug.
2. Fallback: Glob `courses/specs/*-spec.md`, diff against baseline, take the new file.
3. Read `courses/specs/{slug}-spec.md`. Confirm `Status: APPROVED`.
4. Extract archetype, skill name, role, industry for the final summary.

**ABORT if verification fails:**
```
❌ God-mode aborted at Stage 1 (Plan).
   No spec file with status APPROVED was produced.
   Possible cause: no viable skill passed the 5-gate validation.

   To debug: /plan {$ARGUMENTS} for interactive version.
```

### Step 4: Stage 2 — Autonomous Create (Agent B)

Read `shared/god-mode-agent-b-create.md`. Replace `{{SLUG}}` with the extracted slug. Dispatch a sub-agent (course-researcher). All structural checks auto-apply Tier 1 fixes.

**Post-Agent B verification:**
- Glob `courses/{slug}*.md` — confirm MD exists
- Glob `courses/JSONS/{slug}.json` — confirm JSON exists
- Read spec, confirm `Status: CREATED`

**ABORT if verification fails:** preserve APPROVED spec, instruct user to resume via `/create {slug}`.

### Step 5: Stage 3 — Autonomous Audit (Agent C)

Read `shared/god-mode-agent-c-audit.md`. Replace `{{SLUG}}`. Dispatch a sub-agent (content-auditor). All 6 audit domains run; Tier 1 auto-fix + Tier 2 auto-accept (except HIGH RISK factual claims which are flagged).

**Post-Agent C verification:**
- Read spec, confirm `Status: GENERATED — audit passed`
- Extract `## Visual Direction` for the visual hard gate
- Extract `## Game Concept` for the game hard gate

**ABORT if verification fails:** instruct user to resume via `/audit {slug}`.

### Step 6: Hard Gate — Before Visuals

**If `--content-only`:** Skip to Step 10 (DB Insert). Print "⏭️ Visuals skipped".

Otherwise, read the spec's `## Visual Direction` and print:

```
⏸️ VISUAL GENERATION GATE

Stages 1-3 complete. Ready to generate visuals.

Visual direction from spec:
  Concept:      {lateral concept}
  Visual world: {visual world description}
  Accent:       {accent color} ({hex})
  Background:   {background color}
  Orientation:  {orientation}

Estimated cost: ~$0.28-0.48 (7-12 images × SeedDream: 2 covers + 5-10 body)

Reply:
  generate — proceed with visual generation (Recommended)
  skip     — continue to game without visuals
  abort    — stop pipeline here
```

Wait for user reply. God-mode default (after reasonable timeout): `generate`.

### Step 7: Stage 4a — Visuals (Agent D)

**Only if user approved.** Read `shared/god-mode-agent-d-visuals.md`. Replace `{{SLUG}}`. Dispatch a sub-agent (visual-director).

**Post-Agent D verification:**
- Glob `visuals/{slug}/visual-*.png` — record count
- Check `visuals/{slug}/prompts-seedream.md` exists
- Note any skipped images for summary

If generation errors persisted, note in summary but continue.

### Step 8: Hard Gate — Before Game

**If `--content-only`:** Skip to Step 10. Print "⏭️ Game skipped".

Read the spec's `## Game Concept` and print:

```
⏸️ GAME GENERATION GATE

Visuals: {complete / skipped}. Ready to generate game.

Game concept from spec:
  Mechanic:      {mechanic family}
  Rounds:        {rounds}
  Embeds after:  Screen {N}
  Aesthetic:     {aesthetic family}
  Learning arc:  {arc summary}

Reply:
  generate — proceed with game generation (Recommended)
  skip     — continue to SQL without game
  abort    — stop pipeline here
```

God-mode default: `generate`.

### Step 9: Stage 4b — Game (Agent E)

**Only if user approved.** Read `shared/god-mode-agent-e-game.md`. Replace `{{SLUG}}`. Dispatch a sub-agent (content-auditor — the game generator handles its own audit internally).

**Post-Agent E verification:**
- Check `games/{slug}/design.md` exists
- Check `games/{slug}/*-game.html` exists

If game generation failed, note in summary but continue.

### Step 10: Stage 5 — DB Insert (Inline)

Run inline — simple metadata extraction + SQL generation, no sub-agent needed. Follow the `atom-creator-db-insert` skill steps:

1. Read `courses/JSONS/{slug}.json`
2. Read spec for difficulty_level
3. Extract metadata (id, technical_atom_name, course_metadata, glossary, screens, counts)
4. Generate SQL using the canonical template (with ON CONFLICT upsert, `::jsonb` casts, doubled single quotes)
5. Write to `courses/sql/{slug}-insert.sql`

### Step 11: Stage 7 — Final Audit (Inline)

Run the external evaluator audit inline — lightweight version of the `atom-creator-final-audit` skill:

1. Dispatch a sub-agent (content-auditor). Instruct: run 4-pass external audit (factual web-verified, narrative craft, structural integrity, reputational risk). Write report to `docs/{slug}-external-audit-report.md`.
2. Read the report. For each HIGH finding: fix in MD + JSON (triple-sync). Auto-capture to `atom-creator-learnings.jsonl`. If content changed, regenerate SQL.
3. If all HIGH findings resolved: update spec status to `SHIP-READY — final audit passed`. Else: keep `GENERATED — audit passed`, note unresolved findings.

### Final Summary

```
## ⚡ God-Mode Complete

### Course: {Course Title}
**Skill:** {skill name} | **Role:** {role} | **Archetype:** {archetype}

### Artifacts Generated

| Stage | Artifact | Status |
|-------|----------|--------|
| 1. Plan | courses/specs/{slug}-spec.md | ✅ APPROVED |
| 2. Create | courses/{slug}-concept-sprint.md | ✅ CREATED |
| 2. Create | courses/JSONS/{slug}.json | ✅ CREATED |
| 3. Audit | Content quality audit | ✅ PASSED |
| 4a. Visuals | visuals/{slug}/ ({N} images) | ✅ / ⏭️ SKIPPED |
| 4b. Game | games/{slug}/{slug}-game.html | ✅ / ⏭️ SKIPPED |
| 5. SQL | courses/sql/{slug}-insert.sql | ✅ / ⏭️ SKIPPED |
| 6. Final Audit | docs/{slug}-external-audit-report.md | ✅ SHIP-READY |

### Auto-Resolved Decisions
- Archetype: {auto-detected}
- Skill: {skill name} (Score: {score}/125)
- Genre: {genre}
- Voice: {voice letter + name}
- Accent: {color} ({hex})
- Background: {color}
- {count} creative decisions auto-resolved via god-mode defaults

### Audit Stats
- Audit cycles: {N}
- Tier 1 auto-fixes: {count}
- Tier 2 auto-accepted: {count}
- HIGH findings fixed: {count}

### Cost
- Text generation: ~${X} (at Kimi K2.6 pricing)
- Images: {count} × ~$0.04 = ~${total}
- UGC video (if generated): ~$0.15-0.20

### Next Steps
- Review the course: courses/{slug}-concept-sprint.md
- Paste SQL into Supabase: courses/sql/{slug}-insert.sql
```

**Capture learnings:** If the user corrected the approach at ANY stage during this god-mode run, append each correction to `atom-creator-learnings.md` under the appropriate category. Format: `### {date} | :god-mode | {slug}` + Correction/Rule/Applies-to/Status=NEW.
