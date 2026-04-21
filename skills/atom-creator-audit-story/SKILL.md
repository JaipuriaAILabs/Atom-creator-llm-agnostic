---
name: atom-creator-audit-story
description: Run the Agent 6 storytelling-craft audit standalone on any existing course. Invoke when the user wants to check narrative quality without running the full 6-agent audit, or says /audit-story {slug}. Genre-aware — runs 10 universal checks (S1-S10) plus genre-specific checks. Optional prose rework with user approval. Returns: courses/audit-reports/{slug}-storytelling.md.
license: MIT
recommendedAgent: content-auditor
---

# Atom Creator — Storytelling Craft Audit (Standalone)

> Full pipeline: `:plan` → `:create` → `:audit` → `:assets`
> This skill runs independently — use it to audit storytelling on ANY existing course without touching the other audit agents.

**Purpose:** Run Agent 6 (Storytelling Craft Auditor) standalone. Produces a genre-compliance report with per-screen findings. Optionally reworks prose after user approval.

**Prerequisites:**
1. Course MD: `courses/{slug}-concept-sprint.md` or `courses/{slug}-hands-on-guide.md`
2. Course JSON: `courses/JSONS/{slug}.json`
3. Spec (OPTIONAL): `courses/specs/{slug}-spec.md` — needed for genre detection + concept vocabulary. Without a spec, only universal checks (S1-S10) run.

**Input:** `{slug}`
**Output:** Storytelling audit report (PASS / WARN per check) + optional prose rework.

---

## Pipeline

### Step 0: Argument Resolution

If no slug is provided, Glob `courses/JSONS/*.json`, list available slugs, ask the user which to audit.

### Step 0.1: Environment Check

If `.atom-creator-config.json` is missing, run `atom-creator-setup` first.

### Step 1: Validate Prerequisites

1. Locate course JSON at `courses/JSONS/{slug}.json`. If absent, list available and suggest closest match.
2. Verify course MD — check BOTH `courses/{slug}-hands-on-guide.md` and `courses/{slug}-concept-sprint.md`. Use whichever exists.
3. Check for spec at `courses/specs/{slug}-spec.md`:
   - If found: note for genre extraction in Step 3
   - If missing: log "No spec found — running universal checks only"
4. Detect archetype from MD filename (`-concept-sprint.md` vs `-hands-on-guide.md`).

### Step 2: Context Load

Read in parallel:
1. Course JSON
2. Course MD
3. Spec (if present)
4. `shared/storytelling-audit.md` — Agent 6 check definitions
5. `shared/genre-system.md` (or `.claude/generation-guide/genre-system.md`) — genre opening templates, prose mechanisms, DO NOTs
6. `atom-creator-learnings.md` (if present) — apply new Writing & Storytelling learnings

### Step 3: Genre Detection

Extract the course's genre for genre-specific checks:

1. **From spec (if loaded):** Check `## Genre Direction > **Genre:**`. If found → use directly.
2. **Legacy spec mapping:** If spec has `## Framing Direction` instead:
   - Framework-first → Behavioral Science (default)
   - Story-first: Historical Novella → Literary Journalism
   - Braided Story → base genre from research signals + Braided Technique
3. **No spec or no genre section:** set genre = "none"; log: "Running universal checks only"

Also extract concept vocabulary (if spec available): Layer 2 skill, glossary term names, framework names, methodology terms.

### Step 4: Run Storytelling Audit

Dispatch a sub-agent via OpenCode's Task tool to the `content-auditor` agent, scoped to Agent 6 only.

**Agent input:**
- Course JSON content
- Course MD content
- Detected genre (or "none")
- Concept vocabulary list (or empty)
- Archetype (Concept Sprint or Hands-On)

**Agent instructions:**
- Run all applicable universal checks (S1-S10) per archetype rules in `storytelling-audit.md`
- If genre ≠ "none" AND archetype = Concept Sprint: also run genre-specific checks for the detected genre
- For each check: report PASS, SOFT WARN, or HARD GATE FAIL with exact screen index, text excerpt, and matched pattern
- Do NOT generate rewrites or suggestions — report findings only
- Only S7 (Midpoint Story Card) is HARD GATE; all others SOFT WARN

### Step 5: Present Report

Display the structured report:

```
STORYTELLING CRAFT AUDIT — {slug}
Genre: {genre} | Archetype: {archetype}
════════════════════════════════════════════════

UNIVERSAL CHECKS (S1-S10)
─────────────────────────
S1  Person-Place-Action Opening    {PASS|WARN}  screens[1]
S2  Sensory Density Floor          {PASS|WARN}  screens[1-3]
...
S7  Midpoint Story Card            {PASS|FAIL}  screens[{N/2}]   [HARD GATE]
...

GENRE-SPECIFIC CHECKS ({genre})
─────────────────────────────────
G1  ...

SUMMARY
───────
Universal:      {N}/10 passed
Genre-specific: {N}/{total} passed
HARD GATE:      {PASS|FAIL}
Overall:        {PASS|WARN — {N} items flagged}
```

### Step 6: Rework Gate

Ask the user inline:

> Storytelling audit complete. Reply:
> - `rework` — review each WARN item, apply prose fixes with your approval (before/after preview per screen)
> - `export` — save the report to `courses/audit-reports/{slug}-storytelling.md`
> - `skip` — close the audit, no changes

**If `rework`:**
1. For each WARN item in screen order:
   - Show current text (before)
   - Propose a specific prose fix (after) — addresses ONLY the flagged pattern
   - Ask the user to approve or reject
2. Apply approved fixes to BOTH:
   - Course MD (`courses/{slug}-{concept-sprint|hands-on-guide}.md`)
   - Course JSON (`courses/JSONS/{slug}.json`)
3. After all fixes, re-run ONLY the checks that had WARN findings on the modified screens.
4. Report: "{N} fixes applied, {N} checks now pass"

**If `export`:**
1. Create `courses/audit-reports/` if missing.
2. Write the full report to `courses/audit-reports/{slug}-storytelling.md`.
3. Report: "Saved to courses/audit-reports/{slug}-storytelling.md"

**If `skip`:** "No changes made. Re-run anytime with `/audit-story {slug}`."

**God-mode default (no user reply within reasonable time):** `export` — save the report, do not auto-rework (rework requires per-screen judgment).

### Step 7: Summary

```
## Storytelling Audit Complete

  Course:         {slug}
  Genre:          {genre}
  Archetype:      {archetype}
  Universal:      {N}/10 passed
  Genre-specific: {N}/{total} passed ({genre})
  Reworked:       {N} screens (or "none")
  Report:         {path or "not exported"}

  Next: /audit {slug} for full 6-agent audit
        /refine {slug} for comprehensive compliance check
```

---

## Troubleshooting

**No spec found:** Universal checks (S1-S10) still run; genre-specific checks skipped. For full genre compliance, create or locate the spec.

**Legacy course with Framing Direction:** Auto-mapped to genre. Mapping may not be exact — review the detected genre in the report output.

**HARD GATE failure (S7):** Midpoint screen is a non-story card. Fix by swapping the midpoint screen with an adjacent story screen, then re-run.

**Rework breaks other audit checks:** If prose rework changes content significantly, re-run the full audit: `/audit {slug}`. This skill only re-checks its own Agent 6 checks.
