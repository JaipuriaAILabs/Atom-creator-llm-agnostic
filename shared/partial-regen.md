# Partial Regeneration Protocol

Regenerates specific screens from an existing course while preserving all other screens.
Triggered by `/atom-creator:create {slug} --screens 5,8,12`.

**Dependencies:**
- `shared/inline-validation.md` — called per regenerated screen (V1-V6 checks, single-screen mode)
- `shared/spec-versioning.md` — called at status write (snapshot before CREATED)

---

## Prerequisites

Before starting the per-screen loop, verify:

1. **Course files exist:** BOTH the course MD (`courses/{slug}-concept-sprint.md` or `courses/{slug}-hands-on-guide.md`) AND JSON (`courses/JSONS/{slug}.json`) must already exist. If not: error "Partial regen requires existing course files. Run full `/atom-creator:create {slug}` first."
2. **Spec status:** Must be `CREATED`, `APPROVED`, or `GENERATED — audit passed` (Protocol A-Partial from `status-definitions.md`).
3. **No conflicting flags:** `--screens` must NOT be combined with `--restore` (error: "Cannot combine flags") or blueprint mode (error: "Partial regen and blueprint mode are mutually exclusive").
4. **Valid screen numbers:** Each number in the comma-separated list must be a positive integer. Validate against the actual screen count in the existing course. If any number exceeds the actual count: error "Screen {N} out of range. Course has {total} content screens (1-{total})."

---

## Per-Screen Regeneration Loop

For each screen number in the `--screens` list (processed sequentially):

### 1. Boundary Context Extraction

Read the EXISTING course MD file. Parse into screens by splitting on `---` separators.

- **Screen 1** (orient/intro): No previous screen exists. Use the spec's **Story Arc Summary Act 1** as backward context instead.
- **Last screen** (interview/recap): No next screen exists. Use the spec's **Interview Framing** decision as forward context instead.
- **All other screens:** Extract the **last 2 paragraphs** of the PREVIOUS screen and the **first 2 paragraphs** of the NEXT screen as boundary context.

Also include the spec's **Story Arc Summary** as supplementary context for all screens to preserve overall narrative coherence (especially important for Story-first framing courses).

### 2. Screen Constraint Extraction

From the **spec's screen plan** (or Screen Architecture table if blueprint mode):
- Extract the screen type, voice assignment, and any specific creative decisions for this screen number

From the **existing screen** being replaced:
- Extract: heading title, MCQ count, glossary term count
- These serve as structural preservation guides — the regenerated screen should maintain similar structure

### 3. Regenerate

Include all generation rules from Step 3 context (already loaded: design-philosophy, screen-rules/hands-on-screen-rules, banned-phrases, voice directives).

Frame the boundary context as:
```
CONTINUITY CONTEXT — preserve narrative flow with adjacent screens:

PREVIOUS SCREEN (ending):
{last 2 paragraphs of previous screen, or Story Arc Act 1 for screen 1}

NEXT SCREEN (opening):
{first 2 paragraphs of next screen, or Interview Framing for last screen}

STORY ARC:
{Story Arc Summary from spec}
```

Generate ONLY that screen's markdown content. Apply all quality rules (banned phrases, MCQ rigor, voice, fabricated names ban, etc.) as in full generation.

### 4. Inline Validate

Read `${CLAUDE_PLUGIN_ROOT}/shared/inline-validation.md` (if not already loaded).
Run **single-screen mode** validation on the regenerated screen:
- Execute all 6 checks (V1-V6) on just this screen
- Auto-fix if needed (max 2 cycles)
- Record pass/fail status + fixes applied

### 5. Replace in Files

**Markdown:** Replace the screen section between its `---` separators in the course MD file with the new content. Preserve the `---` separators themselves.

**JSON:** Convert the regenerated screen's markdown to JSON following `json-schema.md` + `json-structuring.md` rules. Replace the corresponding `screens[N]` object in the JSON file (N = screen number, accounting for screens[0] being the cover). Preserve all other `screens[]` entries unchanged.

**Verify:** After replacement, confirm the total screen count in the JSON matches the original. If it differs, something went wrong with the splicing — abort and report.

---

## After All Screens

### Structural Checks

Run the FULL C1-C43 structural checks (Step 6 from `create.md`) on the complete course — both unchanged and replaced screens together. This catches any continuity breaks, formatting issues, or structural violations introduced by partial regeneration.

If any check fails, surface the specific failure and fix before proceeding to status update.

### Status Update

Read `${CLAUDE_PLUGIN_ROOT}/shared/spec-versioning.md`.
Execute the Snapshot Protocol with the **partial regen variant** suffix:
```
_CREATED_PARTIAL-{screen-list}_
```
Example: `_CREATED_PARTIAL-5-8-12_2026-03-14T11-20-00.md`

Set spec status to `CREATED` (forces re-audit).
Append to the spec file: `**Last partial regen:** screens {list} on {ISO timestamp}`

### Summary Output

```
## Partial Regeneration Complete  [Stage 2/4 — selective]

  Screens regenerated: {list}
  Screens unchanged: {complement list}
  Inline validation: {pass count} passed, {fix count} auto-fixed
  Structural checks: C1-C43 passed ✓
  Status: CREATED (run :audit to verify)

  Next: Run /atom-creator:audit {slug} to quality-check the updated content
```

Use `AskUserQuestion`:
- "Run /atom-creator:audit {slug} now (Recommended)"
- "I'll run it later"

---

## Edge Cases

| Condition | Behavior |
|-----------|----------|
| `--screens 1` (orient/intro) | No previous screen context. Use spec's Story Arc Summary Act 1 as backward context |
| `--screens {last}` (interview/recap) | No next screen context. Use spec's Interview Framing decision as forward context |
| Screen number > actual count | Error: "Screen {N} out of range. Course has {total} content screens (1-{total})." |
| `--screens` on nonexistent course | Error: "Partial regen requires existing course files. Run full `:create` first." |
| `--screens` + `--restore` | Error: "Cannot combine `--screens` and `--restore` flags." |
| `--screens` + blueprint mode | Error: "Partial regen and blueprint mode are mutually exclusive." |
| JSON screen count mismatch after splice | Abort: "Screen count mismatch after splice — {expected} vs {actual}. Reverting." |
