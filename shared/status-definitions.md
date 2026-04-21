# Spec Status Definitions

Centralized reference for spec file status values, transitions, and acceptance rules.

---

## Status Values

| Status | Set by | Meaning |
|--------|--------|---------|
| `DRAFT` | `:plan` (initial creation) | Spec created but not yet approved by user |
| `APPROVED` | `:plan` (after QG2 hard gate) | User approved all decisions — ready for content generation |
| `CREATED` | `:create` (after structural checks pass) | Course MD + JSON generated and structurally valid — ready for audit |
| `GENERATED — audit passed` | `:audit` (after all 6 agents pass) | Content quality verified — ready for asset generation |
| `REFINED — v{X.Y.Z}` | `:refine` (after fixes applied) | Course verified against pipeline version X.Y.Z guidelines |
| `SHIP-READY — final audit passed` | `:final-audit` (after all HIGH fixes resolved) | All quality gates passed — ready for Supabase deployment |

## Acceptance Rules

| Command | Accepts | Rejects | Notes |
|---------|---------|---------|-------|
| `:create` | `APPROVED`, `GENERATED — audit passed`, `REFINED — v{any}` | `DRAFT`, `CREATED` | Re-running on `GENERATED` or `REFINED` resets status to `CREATED` (forces re-audit) |
| `:create --screens` | `CREATED`, `APPROVED`, `GENERATED — audit passed`, `REFINED — v{any}` | `DRAFT` | Partial regen resets status to `CREATED` (forces re-audit) |
| `:audit` | `CREATED`, `GENERATED — audit passed`, `REFINED — v{any}` | `DRAFT`, `APPROVED` | `GENERATED` and `REFINED` accepted for re-audit |
| `:assets` | `GENERATED — audit passed`, `REFINED — v{any}`, `CREATED`* | `DRAFT`, `APPROVED` | *`CREATED` accepted with warning + user confirmation gate |
| `:visuals` | `GENERATED — audit passed`, `REFINED — v{any}`, `CREATED`* | `DRAFT`, `APPROVED` | *`CREATED` accepted with warning + user confirmation gate |
| `:game` | `GENERATED — audit passed`, `REFINED — v{any}`, `CREATED`* | `DRAFT`, `APPROVED` | *`CREATED` accepted with warning + user confirmation gate |
| `:refine` | Any status (JSON required) | — | Sets status to `REFINED — v{X.Y.Z}`. Protocol E |
| `:final-audit` | `GENERATED — audit passed`, `REFINED — v{any}`, `SHIP-READY`*, `CREATED`** | `DRAFT`, `APPROVED` | *Re-audit allowed. **`CREATED` with soft warning. Protocol F |
| `:tool` | `GENERATED — audit passed`, `REFINED — v{any}`, `CREATED`* | `DRAFT`, `APPROVED` | *`CREATED` accepted with warning. Protocol C |

## Prescriptive Error Messages

| Condition | Message |
|-----------|---------|
| Spec not found | "No spec found at `courses/specs/{slug}-spec.md`. Run `/atom-creator:plan <topic>` to create one. Available specs: [list]" |
| Status is `DRAFT` | "Spec exists but hasn't been approved. Run `/atom-creator:plan {slug}` to complete the approval flow (QG2)." |
| Status is `APPROVED` (for `:audit`) | "Course content hasn't been generated yet. Run `/atom-creator:create {slug}` first." |
| Course MD missing | "Course markdown not found at `courses/{slug}-concept-sprint.md`. Run `/atom-creator:create {slug}` to generate it." |
| Audit not passed (for `:assets`) | "Content audit hasn't been run. Generating assets on unaudited content risks wasting Gemini API credits. Run `/atom-creator:audit {slug}` first, or proceed at your own risk." |
| Status is `REFINED — v{old}` | "Course last refined at v{old}. Current is v{current}. Re-refining will check for violations introduced since v{old}." |

---

## Status Matching

All statuses except `REFINED` and `SHIP-READY` use exact string matching.

- `REFINED` uses **prefix matching** because the version suffix varies:
  - Match: `startsWith("REFINED")` — accepts `REFINED — v6.7.0`, `REFINED — v6.5.0`, etc.
  - When checking if a command accepts `REFINED`, treat ALL `REFINED — v{any}` statuses identically.

- `SHIP-READY` uses **exact matching**: `SHIP-READY — final audit passed`
  - Commands that accept `GENERATED — audit passed` also accept `SHIP-READY — final audit passed` (it's a superset).
  - Re-running `:create` on a SHIP-READY course resets to `CREATED` (forces full re-audit cycle).

---

## Validation Protocols

Named protocols for status validation. Each command references its protocol by name instead of re-implementing status checking logic.

### Protocol A: Requires APPROVED, GENERATED, or REFINED
**Used by:** `:create`
- **Accepts:** `APPROVED`, `GENERATED — audit passed`, `REFINED — v{any}`
  - If `GENERATED — audit passed` or `REFINED`: warn that re-generating resets status to `CREATED` (forces re-audit)
- **Rejects:**
  - `DRAFT` → "Spec exists but hasn't been approved. Run `/atom-creator:plan {slug}` to complete the approval flow (QG2)."
  - `CREATED` → "Course content already generated. Run `/atom-creator:audit {slug}` to quality-check it, or re-run `/atom-creator:create {slug}` to regenerate (this will reset status to CREATED and require re-audit)."

### Protocol B: Requires CREATED, GENERATED, or REFINED
**Used by:** `:audit`
- **Accepts:** `CREATED`, `GENERATED — audit passed` (for re-audit), `REFINED — v{any}` (for re-audit)
- **Rejects:**
  - `DRAFT` → "Spec exists but hasn't been approved. Run `/atom-creator:plan {slug}` to complete the approval flow (QG2)."
  - `APPROVED` → "Course content hasn't been generated yet. Run `/atom-creator:create {slug}` first."

### Protocol C: Prefers GENERATED or REFINED, accepts CREATED with warning
**Used by:** `:assets`, `:visuals`, `:game`
- **Accepts:** `GENERATED — audit passed`, `REFINED — v{any}`
- **Soft gate:** `CREATED` → warn via `AskUserQuestion`: "Content audit hasn't been run. Generating assets on unaudited content risks wasting Gemini API credits. Run `/atom-creator:audit {slug}` first, or proceed at your own risk." Options: "Run audit first (Recommended)", "Proceed without audit"
- **Rejects:**
  - `DRAFT` → "Spec exists but hasn't been approved. Run `/atom-creator:plan {slug}` to complete the approval flow (QG2)."
  - `APPROVED` → "Course content hasn't been generated yet. Run `/atom-creator:create {slug}` first."

### Protocol A-Partial: Requires CREATED, APPROVED, GENERATED, or REFINED (with --screens)
**Used by:** `:create --screens`
- **Accepts:** `CREATED`, `APPROVED`, `GENERATED — audit passed`, `REFINED — v{any}`
  - If `GENERATED — audit passed` or `REFINED`: warn that partial regen resets status to `CREATED` (forces re-audit)
  - If `APPROVED`: verify existing course files (MD + JSON) exist before proceeding — partial regen requires files to splice into
- **Rejects:**
  - `DRAFT` → "Spec exists but hasn't been approved. Run `/atom-creator:plan {slug}` to complete the approval flow (QG2)."

### Protocol D: Accepts any status with JSON (soft warning if unaudited)
**Used by:** `:db-insert`
- **Accepts:** Any status, as long as the course JSON file exists at `courses/JSONS/{slug}.json`
- **Proceeds silently for:** `GENERATED — audit passed`, `REFINED — v{any}`
- **Soft warning:** If spec status is NOT `GENERATED — audit passed` or `REFINED`, warn: "Generating SQL for content that hasn't passed audit. Consider running `/atom-creator:audit {slug}` first to catch quality issues before deploying to Supabase."
- **No spec required:** If no spec exists at all, proceed with JSON-only (the JSON has all needed data)

### Protocol F: Requires GENERATED, REFINED, or SHIP-READY (final audit)
**Used by:** `:final-audit`
- **Accepts:** `GENERATED — audit passed`, `REFINED — v{any}`, `SHIP-READY — final audit passed` (for re-audit)
- **Soft gate:** `CREATED` → warn via `AskUserQuestion`: "Internal audit hasn't passed yet. Running the final audit on unaudited content may produce many findings. Run `/atom-creator:audit {slug}` first, or proceed at your own risk." Options: "Run audit first (Recommended)", "Proceed anyway"
- **Rejects:**
  - `DRAFT` → "Spec exists but hasn't been approved. Run `/atom-creator:plan {slug}` to complete the approval flow (QG2)."
  - `APPROVED` → "Course content hasn't been generated yet. Run `/atom-creator:create {slug}` first."
- **Status update:** On success (all HIGH findings resolved), sets spec status to `SHIP-READY — final audit passed`. Adds `**Final Audit Date:** {YYYY-MM-DD}` to spec.

### Protocol E: Accepts any status with JSON (refine mode)
**Used by:** `:refine`
- **Accepts:** Any status, as long as the course JSON file exists at `courses/JSONS/{slug}.json`
- **No spec required:** If no spec exists, proceed with JSON-only context. Some checks requiring spec context (C53 artifact rendering gate, C35-C43 blueprint checks) will be SKIPPED and reported as such.
- **Status update:** After successful refinement (fixes applied or report-only with zero violations), sets spec status to `REFINED — v{X.Y.Z}` where X.Y.Z is the current plugin version. If no spec exists, status is not updated.
- **Batch mode:** When invoked with `--all`, apply Protocol E to each course JSON found via glob `courses/JSONS/*.json`. Spec lookup attempted per-course if individual spec files exist.
