---
name: atom-creator-refine
description: Evaluate existing courses against the latest structural rules (C1-C72 + V1-V16) and run the 6-agent audit. Report-first compliance summary grouped by version delta, then apply fixes with user approval. Supports --all batch mode, --dry-run (report only), --tier1-only (skip creative fixes). Invoke when the user says /refine {slug} or "check course compliance". Returns: compliance report + fixed files + updated refine-manifest.
license: MIT
recommendedAgent: course-researcher
---

# Atom Creator — Refine (Retroactive Compliance)

> **Not part of the normal pipeline.** This skill operates on existing courses independently.
> Pipeline: `:plan` → `:create` → `:audit` → `:assets` → `:db-insert` → `:final-audit`
> `:refine` sits outside — it evaluates any course with a JSON file against the CURRENT version.

**Purpose:** Evaluate existing courses against the latest structural rules (C1-C72 + V1-V16 — see `shared/structural-checks.md` as authoritative) AND run the full 6-agent content quality audit. Presents a **report-first** compliance summary grouped by version delta BEFORE applying any fixes. Tracks per-course compliance history via manifest.

**Prerequisites:** Course JSON must exist. No spec status requirement (Protocol E: any status, JSON required).
1. Course JSON: `courses/JSONS/{slug}.json` (REQUIRED)
2. Course MD (optional, enables V1-V15 inline checks + 6-agent audit)
3. Course SQL (optional, regenerated if present)
4. Spec (optional, used for archetype detection + blueprint checks + status update)

**Input:** `/refine <slug>` OR `/refine --all`
Flags: `--dry-run`, `--tier1-only`. Combinable: `--all --dry-run`, `--all --tier1-only`.

**Output:**
- Compliance report shown BEFORE any fixes
- Fixed course files (JSON, MD, SQL) — unless `--dry-run`
- `courses/refine-reports/{slug}-refine-report.md` (per-course)
- `courses/refine-reports/batch-refine-report-{date}.md` (batch mode)
- Updated `courses/refine-manifest.json`
- Spec status updated to `REFINED — v{current_version}` (if spec exists)

---

## Pipeline

### Step 0: Argument Resolution + Environment Check

If no slug (and no `--all`), Glob `courses/JSONS/*.json`, list available, ask which to refine. If `.atom-creator-config.json` missing, run `atom-creator-setup`.

### Step 1: Parse Arguments + Validate Prerequisites

**Flag parsing:**
- **slug:** first positional argument (unless `--all`)
- **`--all`:** batch mode — process all courses with JSON files
- **`--dry-run`:** report only, apply no fixes
- **`--tier1-only`:** apply only Tier 1 auto-fixes, skip Tier 2 creative fixes

**Protocol E validation (any status, JSON required):**

For single-course mode:
1. Locate `courses/JSONS/{slug}.json`. If missing, list available + suggest closest.
2. Check for MD (try both archetype paths). If neither: WARN "inline validation (V1-V15) skipped. 6-agent audit runs with JSON-only context."
3. Check for SQL. If missing: WARN "triple-sync will skip SQL regeneration."
4. Check for spec. If missing: WARN "archetype inferred from JSON metadata. Blueprint checks (C35-C43) skipped. Status not updated."

**Manifest read:**
5. Read `courses/refine-manifest.json`. If not found, initialize: `{"schema_version": 1, "courses": {}}`.
6. Look up course's entry: extract `last_verified_version` (or `null`).
7. Read `shared/version.json` (or equivalent) for the current plugin version.

**Batch mode (`--all`):**
- Glob `courses/JSONS/*.json` to build course list.
- For each JSON, derive slug from filename.
- Read manifest for last-verified status per course.
- Present list via inline prompt:
  ```
  Found {N} courses. Run compliance check on all?
  Reply:
    all      — run all {N} courses
    {1,3,7}  — comma-separated indices for subset
    cancel   — exit
  ```
- God-mode default: `all`.

**Batch Agent 5 opt-out:** For 5+ courses, ask: "Skip Agent 5 web verification for speed? (yes/no). Saves ~1 min per course." God-mode default: skip web lookups in batch mode (structural factual checks still run).

For each course in the batch, execute Steps 2-8, then aggregate in Step 8.

### Step 2: Context Load

Load in parallel:
1. `shared/structural-checks.md` — C1-C72 definitions
2. `shared/inline-validation.md` — V1-V15 checks
3. `shared/content-audit.md` — 6 agent definitions + rectification patterns
4. `shared/storytelling-audit.md` — Agent 6 checks
5. `.claude/generation-guide/json-schema.md` — JSON structure rules
6. `.claude/generation-guide/banned-phrases.md` — V1 + Agent 3
7. `.claude/generation-guide/design-philosophy.md` — principles reference
8. `atom-creator-learnings.md` — apply new learnings
9. Course JSON
10. Course MD (if found)
11. Spec (if found)

If `shared/structural-checks.md` missing, fall back to `:create` inline definitions. WARN: "No `structural-checks.md` found. Using `:create` definitions."

### Step 3: Detect Course Context

Determine from loaded files:

1. **Archetype:** Read `metadata.archetype` from JSON. If missing, check spec marker. Default `concept_sprint`.
2. **Estimated generation version** — heuristic markers:
   - `screens[0].type == "cover"` → post-cover-migration (v4.0+)
   - `screens[0].mobile_image` exists → post-dual-cover (v4.0+)
   - Standardized interview card ("The Real Question") → post-v6.4.2
   - No text block >75 words → post-v6.5.0 (Blinkist readability)
   - `"bold": true` on closing text blocks → post-v6.0
   - MCQ titles use "Test Your Instinct", glossary titles use "Remember This Term" → post-v10.1.0
   - All glossary blocks have `practice` objects → post-v5.0
   - A/B/C/D letter prefixes on MCQ options → pre-v6.0
3. **Blueprint mode:** spec has `## Course Blueprint`? → C35-C43 apply.
4. **Genre:** spec has `## Genre Direction`? → extract Genre for C59. Legacy `## Framing Direction` → auto-map. Neither → skip genre checks.
5. **Manifest delta:** calculate which checks are NEW since `last_verified_version` using the Check-to-Version Mapping table.
6. **Available files:** record which exist (JSON / MD / Spec / SQL).

Output context summary:
```
COURSE CONTEXT
──────────────
Slug:         {slug}
Title:        {metadata.subtitle}
Archetype:    {concept_sprint / hands_on}
Est. version: ~v{X.Y.Z}
Last refined: v{X.Y.Z} on {date} / never
Current:      v{current_plugin_version}
Blueprint:    {yes / no / unknown (no spec)}
Files:        JSON ✓ | MD {✓/✗} | Spec {✓/✗} | SQL {✓/✗}
Screens:      {N}
```

### Step 4: Structural Check Engine

Run ALL applicable checks against the JSON (and MD where relevant). Execute in parallel (batch Grep/Read calls).

**Phase A — Universal Checks (C1-C34):** apply to ALL courses regardless of archetype. Key checks: C26 (`blocks` before `media`), C27 (`"hero"` placement only), C29 (heading `blocks[0]` on non-cover), C30 (one-thumb-scroll budget), C31 (interview ≤50 words), C33 (private company revenue hedging), C34 (glossary `practice` object).

**Phase B — Archetype-Specific:** CS-specific variants OR HO + C-HO1-5.

**Phase C — Card Architecture (C44-C56):** BOTH archetypes.

**Phase D — Scrollytelling (C57-C64):** BOTH archetypes. Includes C58 (midpoint story card HARD GATE), C61 (MCQ position distribution HARD), C62 (protagonist presence HARD), C63 (no self-created frameworks HARD), C64 (resolution aftermath).

**Phase E — Novice-first (C72):** HARD GATE when spec declares `Audience Posture: novice-on-stack`.

**Phase F — Blueprint Checks (C35-C43):** ONLY when blueprint exists in spec.

Dispatch mechanical checks to the `structural-validator` agent (fast, grep-based). Dispatch narrative checks to the `content-auditor` agent (6-domain audit).

### Step 5: Inline Validation (if MD exists)

Run V1-V19 from `shared/inline-validation.md` on the MD. V1-V16 is mandatory; V17-V18 require MD; V19, V-ST2, V-ST3 require JSON.

### Step 6: 6-Agent Content Audit

Dispatch the `content-auditor` agent to run all 6 domains. Pass: course files, genre (if detected), concept vocabulary, archetype, Research Registry (if spec available).

**Batch Agent 5 opt-out:** in batch mode with user-approved skip, run Agent 5 without live web verification (structural factual checks only).

### Step 7: Report-First Compliance Summary

Present the report BEFORE any fixes. Group by:
- **NEW violations (since last-verified version)** — checks introduced after the course was last refined
- **EXISTING violations (carried over)** — checks that existed before, still failing
- **HARD GATE count** (BLOCKS triple-sync)
- **SOFT WARN count**
- **6-agent findings** summarised by severity

Format:
```
## Refine Report — {slug}

Current version: v{current}
Last verified:   v{last} / never
Delta:           {N} new checks

### HARD GATE violations ({N}):
  C54 @ screens[3].blocks[2]: Text block is 89 words (cap: 75)
  C58 @ screens[7]: Midpoint screen is type "mcq" (expected: story card)
  ...

### SOFT WARN issues ({N}):
  C55 @ screens[7]: Only 2 body blocks (recommend ≥3)
  ...

### 6-Agent Audit Findings:
  Agent 1 (MCQ Rigor): {summary, {N} HIGH, {N} MEDIUM}
  Agent 2 (Interview):
  Agent 3 (Surface):
  Agent 4 (Data Integrity):
  Agent 5 (Factual): {N HIGH claims, X VERIFIED, Y UNVERIFIED}
  Agent 6 (Storytelling): {N WARN items}

### Fix Plan:
  Tier 1 (auto-fix):  {N} items — banned phrase replacements, format normalizations
  Tier 2 (user approval): {N} items — MCQ rewrites, HIGH factual claims
```

Ask inline:
```
Reply:
  apply        — apply Tier 1 + Tier 2 (with per-item approval for Tier 2)
  tier1        — apply Tier 1 only
  dry-run      — keep report, apply nothing
  cancel
```

**God-mode default:** `apply` with auto-accept on Tier 2 except HIGH factual claims. If `--dry-run` flag is set, skip user prompt — just write the report. If `--tier1-only` flag is set, auto-apply Tier 1, skip Tier 2.

### Step 8: Apply Fixes (if approved)

**Tier 1 auto-fixes:** banned phrase replacements, ALL-CAPS normalization, number format, imperial-to-metric, fictional company removal, cover sync (`metadata.subtitle` ↔ `screens[0].title`, `metadata.description` ↔ `screens[0].description`), image filename casing, remove deprecated `metadata.cover`.

**Tier 2 user-approval:** ambiguous MCQs, interview rewrites, HIGH factual claims, missing image references, description-content misalignment. Show before/after per item.

**Triple-sync:** after each fix, update MD + JSON + SQL (if SQL exists). Run `scripts/check-triple-sync.sh {slug}` to verify.

**SQL regeneration:** if MD or JSON content changed and SQL exists, invoke `atom-creator-db-insert` skill inline to regenerate `courses/sql/{slug}-insert.sql`.

### Step 9: Update Manifest + Spec Status

**Manifest update:**
```json
{
  "schema_version": 1,
  "courses": {
    "{slug}": {
      "last_verified_version": "{current_version}",
      "last_verified_date": "{YYYY-MM-DD}",
      "tier1_fixes_applied": {N},
      "tier2_fixes_applied": {N},
      "hard_gate_violations_resolved": {N},
      "hard_gate_violations_pending": {N}
    }
  }
}
```

**Spec status update (if spec exists and all HARD GATEs resolved):**
- Update `**Status:**` to `REFINED — v{current_version}`
- Append: `**Refined Date:** {YYYY-MM-DD}`

**If HARD GATEs remain:** leave status unchanged, list pending in the report.

### Step 10: Write Per-Course Report

Write full report to `courses/refine-reports/{slug}-refine-report.md`. Create directory if missing.

### Batch aggregation (Step 11, `--all` mode only)

After all courses processed, aggregate:
- Total courses refined / pending / skipped
- Total Tier 1 fixes applied
- Total Tier 2 fixes applied
- Courses with HARD GATEs pending (need manual fix)

Write to `courses/refine-reports/batch-refine-report-{YYYY-MM-DD}.md`.

---

## Output Summary

```
## Refine Complete  [{slug} / batch of {N}]

  Tier 1 fixes: {N} applied automatically
  Tier 2 fixes: {N} applied with user approval
  HARD GATE resolved: {N} / {total}
  HARD GATE pending:  {N}

  Files updated:
    MD:   courses/{slug}-{archetype}.md
    JSON: courses/JSONS/{slug}.json
    SQL:  courses/sql/{slug}-insert.sql (regenerated)
    Spec: courses/specs/{slug}-spec.md (status: REFINED — v{version})

  Manifest: courses/refine-manifest.json updated
  Report:   courses/refine-reports/{slug}-refine-report.md

  Next: /audit {slug} (re-audit) or /assets {slug} (generate assets)
```

---

## Gotchas

- **Protocol E is permissive** — accepts any status as long as JSON exists. Designed to refine legacy courses.
- **Spec-less refinement is partial** — blueprint checks (C35-C43) skip without spec. Archetype is inferred from JSON metadata.
- **Batch mode Agent 5 opt-out** — live web verification is expensive at scale. Skip for batch runs; run full `/final-audit` on priority courses individually.
- **Report-first is load-bearing** — never apply fixes without showing the report first. User trust depends on preview.
- **Triple-sync matters** — Tier 1 fixes touch MD + JSON; if SQL exists and content changed, SQL must be regenerated. Partial sync causes production bugs.
- **Manifest provides "delta since last refine" view** — only NEW checks (introduced after last-verified version) show as "NEW violations" in the report. This is what makes retroactive refinement fast over time.
