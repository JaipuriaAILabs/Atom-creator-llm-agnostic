---
name: atom-creator-audit
description: Run the 6-agent content quality audit on a generated course. Invoke after /create, or when the user says "audit course {slug}". Tests MCQ rigor, interview quality, surface consistency, data integrity, factual compliance, storytelling craft. Returns: rectified MD + JSON with spec status updated to GENERATED — audit passed.
license: MIT
recommendedAgent: content-auditor
---

# Atom Creator — Content Quality Audit (Stage 3)

> Pipeline: `:plan` → `:create` → `:audit` (you are here) → `:assets` → `:db-insert` → `:final-audit`

**Purpose:** Run 6-agent content quality audit on generated course files. Tests MCQ rigor, interview quality, surface consistency, data integrity (cover placement, image references, JSON structure), factual/legal compliance, and storytelling craft (genre-aware narrative quality). Can re-audit existing courses independently.

**Prerequisites:**
1. Spec: `courses/specs/{slug}-spec.md` (status `CREATED`, `GENERATED — audit passed`, or `REFINED — v{any}`)
2. Course MD: `courses/{slug}-concept-sprint.md` (CS) or `courses/{slug}-hands-on-guide.md` (HO)
3. Course JSON: `courses/JSONS/{slug}.json`

**Input:** `{slug}`
**Output:** Audit pass/fail with rectification of course MD + JSON if needed. Spec status updated to `GENERATED — audit passed` on success.

---

## Pipeline

### Step 0: Argument Resolution + Environment Check

If no slug provided, Glob `courses/specs/*-spec.md`, list available, ask user which to audit. If `.atom-creator-config.json` missing, run `atom-creator-setup` first.

### Step 1: Validate Prerequisites

1. Load `shared/status-definitions.md`.
2. Locate spec at `courses/specs/{slug}-spec.md`. If absent, list available.
3. Verify spec status is `CREATED`, `GENERATED — audit passed`, or `REFINED — v{any}` (prefix match).
4. If `DRAFT`: abort with "Run `/plan {slug}` to complete approval."
5. If `APPROVED` only: abort with "Run `/create {slug}` first."
6. Verify course MD exists at ONE of the two archetype paths.
7. Verify course JSON at `courses/JSONS/{slug}.json`.

### Step 2: Context Load

Read in parallel:
1. `courses/specs/{slug}-spec.md` — extract voice + all creative decisions
2. `shared/content-audit.md` — 6 agent definitions + rectification loop
3. `shared/banned-phrases.md` (or `.claude/generation-guide/banned-phrases.md`) — 31 phrases + 11 patterns for Agent 3
4. `shared/genre-system.md` (or `.claude/generation-guide/genre-system.md`) — genre opening templates, pacing, voice consistency
5. `shared/storytelling-audit.md` — Agent 6 check definitions (S1-S10 + genre-specific)
6. `atom-creator-learnings.md` — apply NEW factual + storytelling learnings
7. The course MD file
8. `courses/JSONS/{slug}.json`

Also extract the `### Research Registry` from the spec (if present) — build an R-number lookup map for Agent 5 claim cross-reference. If absent (legacy spec), Agent 5 uses the Hallucination Heuristic only.

### Genre Extraction

Extract the course genre for agent context:
1. Check spec for `## Genre Direction > **Genre:**` — if found, use directly.
2. If spec has `## Framing Direction` (legacy) → auto-map:
   - Framework-first → Behavioral Science (default) or Practitioner Memoir
   - Story-first: Historical Novella → Literary Journalism
   - Braided Story → base genre from research signals + Braided Technique
3. If neither: set Genre = "none" (genre checks skipped).

Pass the genre to all 6 audit domains.

### Step 3: Content Quality Audit

Dispatch the `content-auditor` agent via OpenCode's Task tool. Instruct the agent to run all 6 domains sequentially (OpenCode has no per-domain model override):

- **Agent 1 — MCQ Rigor Auditor:** failure certificate test on every distractor, answer distribution, explanation specificity.
- **Agent 2 — Interview Auditor:** single question rule, bus-commuter test, fresher recall test, banned interview patterns, genre opening compliance, genre pacing compliance.
- **Agent 3 — Surface Consistency Auditor:** number systems, header naturalness, banned phrases, imperial units, genre voice consistency, genre research depth, novice-first unpacking (C72) when spec declares `Audience Posture: novice-on-stack`.
- **Agent 4 — Data Integrity Auditor:** cover placement (`screens[0].type == "cover"`), image reference validation, description-content alignment, screen counts, JSON structure, glossary `practice` object presence (C34).
- **Agent 5 — Factual & Legal Compliance Auditor:** company claim verification via WebFetch + Perplexity MCP, Research Registry cross-reference, risk classification, tone scan, reputational risk.
- **Agent 6 — Storytelling Craft Auditor:** genre-aware narrative quality (P30-P36, thriller rules, genre DO NOTs, Delhi dinner table test). 10 universal checks (S1-S10) + genre-specific. Only S7 (Midpoint Story Card) is HARD GATE; others SOFT WARN.

If the content-auditor agent is unavailable, run the 6 domains inline from this skill — do not skip any.

### Step 4: Rectification Loop

**Tier 1 — Auto-Fix (apply immediately):**
- Banned phrase replacements, ALL-CAPS header fixes, number formatting normalization, imperial-to-metric conversions, fictional company removal
- Sync `metadata.subtitle` ↔ `screens[0].title`
- Sync `metadata.description` ↔ `screens[0].description`
- Fix image filename casing (lowercase `visual-{N}.png`)
- Remove `metadata.cover` key if present

**Tier 2 — User-Approval (show before/after):**
- Ambiguous MCQs, interview questions that fail bus-commuter test, number system conflicts, HIGH / CRITICAL company claims
- Missing images: show list of referenced-but-missing files, suggest regeneration
- Description-content misalignment: show description text + missing company/stat, suggest rewrite grounded in course content

**God-mode default for Tier 2:** auto-accept all fixes except HIGH RISK factual claims (those require explicit user approval or the fix is skipped and logged).

**Loop constraints:**
- Maximum 3 audit-rectify cycles
- Each cycle re-runs only failing agents
- If still failing after 3 cycles, BLOCK and output:

```
## Audit Exhaustion Report

Cycles completed: 3/3
Agents PASSED: [list]
Agents FAILED: [list]

### Pending Failures
[for each failing agent, list specific issues with file locations + line numbers]

### Tier 1 Fixes Applied
[Count] automatic fixes already applied to MD + JSON

### Tier 2 Fixes Pending
[list each with description]

### Recovery Instructions
1. Manually fix the issues listed above in both MD and JSON
2. Re-run: /audit {slug}
```

**HARD GATE:** Content audit must pass before declaring success.

### Step 5: Update Spec Status

**Snapshot first:** Read `shared/spec-versioning.md`. Execute the Snapshot Protocol to capture the CREATED state before overwriting with GENERATED.

Update the spec's `**Status:**` to `GENERATED — audit passed`.

### Step 6: Triple-Sync Verification

Run `scripts/check-triple-sync.sh {slug}` via Bash tool. If the script flags MD-JSON-SQL drift (title, description, screen count, subtitle), fix and re-verify. If no SQL exists yet, skip SQL sync.

### Step 7: Output Summary

```
## Content Audit Passed  [Stage 3/6 complete]

  Audit: All 6 agents passed ✓
  Tier 1 fixes: [N] applied automatically
  Tier 2 fixes: [N] approved by user
  Cycles: [N]/3

  MD:   courses/{slug}-{concept-sprint|hands-on-guide}.md (updated)
  JSON: courses/JSONS/{slug}.json (updated)
  Spec: courses/specs/{slug}-spec.md (status: GENERATED — audit passed)

  Next: /assets {slug}   — generate visuals + game + tool in parallel
```

### Step 8: Auto-Capture Findings to Learnings

For each HIGH or CRITICAL finding:
1. Read `shared/learnings-protocol.md` for the JSONL entry format and error taxonomy.
2. Classify using the error taxonomy (domain prefix from `shared/learnings-protocol.md`).
3. Check `atom-creator-learnings.jsonl` for similar findings (match on `domain` + fuzzy match on `finding`).
4. If match found: increment `recurrence` on the existing entry, add this ID to `related_ids`.
5. If no match: create new entry with `recurrence: 1`, `status: "NEW"`.
6. Append to `atom-creator-learnings.jsonl` AND to `atom-creator-learnings.md` in human-readable form under the appropriate category.
7. Report: "📚 {N} findings auto-captured to learnings system."

**Skip conditions:** Do not capture if severity is MEDIUM/LOW, the finding is a one-off data error, or an identical entry already exists with `recurrence ≥ 3` and `status: "PROMOTED"`.

---

## Gotchas

- **Biographical verification (Nooyi precedent):** Wrong role category (engineer vs strategist) = HIGH risk. Primary-source verification required (LinkedIn, company pages). Not Wikipedia.
- **Financial figure date anchoring:** Every revenue, AUM, market cap needs a date anchor. Volatile figures from sources >12 months old must be reverified.
- **Directional verification of comparisons:** LinkedIn lateral move retention data was inverted in one course. For any X better/worse than Y claim, verify the DIRECTION, not just existence.
- **Agent 5 cannot verify claims without web access.** If Perplexity MCP + WebFetch are both unavailable, abort with a configuration error — this audit is web-verification-mandatory per project CLAUDE.md.
