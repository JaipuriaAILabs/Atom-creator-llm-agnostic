---
name: atom-creator-db-insert
description: Generate a Supabase-ready SQL INSERT for the course_content table from a generated course JSON. Invoke when the user wants to ship a course to production, says "generate SQL for {slug}", or runs /db-insert. Requires an existing courses/JSONS/{slug}.json. Returns: courses/sql/{slug}-insert.sql.
license: MIT
---

# Atom Creator — DB Insert (Stage 5)

> The full pipeline: `:plan` → `:create` → `:audit` → `:assets` → `:db-insert` → `:final-audit`

**Purpose:** Generate a Supabase-ready SQL INSERT statement for the `course_content` table from a generated course JSON. Produces a `.sql` file that can be pasted directly into the Supabase SQL Editor.

**Prerequisites:**
1. Course JSON: `courses/JSONS/{slug}.json` (REQUIRED — run `:create` first)
2. Recommended: spec status `CREATED`, `GENERATED — audit passed`, or `REFINED — v{X.Y.Z}`

**Input:** `{slug}` — positional argument
**Output:** `courses/sql/{slug}-insert.sql`

---

## Target Table Schema: `course_content`

| Column | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `text` | YES | — | `{role-slug}_{skill-slug}`, e.g. `territory-sales-manager_beat-planning` |
| `technical_atom_id` | `text` | YES | — | Same as `id` |
| `technical_atom_name` | `text` | YES | — | Human skill name (e.g. "Beat planning") |
| `course_metadata` | `jsonb` | YES | — | Object with `archetype`, `company`, `role`, `subtitle`, `skill`, `description`, `media_base`, `phases` |
| `glossary` | `jsonb` | YES | — | Glossary object keyed by term |
| `screens` | `jsonb` | YES | — | Full screens array |
| `screen_count` | `integer` | NO | 18 | |
| `mcq_count` | `integer` | NO | 14 | |
| `subjective_count` | `integer` | NO | 2 | `text_question` + `interview` blocks combined |
| `glossary_term_count` | `integer` | NO | 0 | |
| `version` | `integer` | NO | 1 | |
| `status` | `text` | NO | `'active'` | |
| `difficulty_level` | `text` | NO | `'mid'` | One of: `entry`, `mid`, `senior`, `managerial` |

**Critical:** There is NO separate `description` column. The course description lives inside `course_metadata.description`.

---

## Pipeline

### Step 0: Environment Check

If `.atom-creator-config.json` is missing, run the `atom-creator-setup` skill first.

### Step 1: Locate Course JSON

1. Read `courses/JSONS/{slug}.json`. If not found, use Glob to list `courses/JSONS/*.json` and suggest the closest match.
2. Optionally read `courses/specs/{slug}-spec.md` for difficulty level and archetype if the JSON lacks them.
3. Status check (soft): if the spec exists and status is not `GENERATED — audit passed` / `REFINED` / `SHIP-READY`, warn the user — but proceed.

### Step 1.5: Pre-Generation Validation (HARD GATE)

Before extracting metadata:

1. **Cover placement check:**
   - `screens[0].type` MUST be `"cover"`. If not, ABORT: "Cover screen missing at screens[0]. Run `/create {slug}` to regenerate."
   - `metadata.cover` MUST NOT exist. If present, ABORT: "Cover data found in metadata.cover. Cover belongs in screens[0]."
2. **Cover completeness:** `screens[0]` must have `image`, `mobile_image`, `title`, `subtitle`, `description`. Any missing → ABORT.
3. **Description sync:** `metadata.description` must equal `screens[0].description`. If mismatched, ask user which is canonical; fix both.
4. **Image reference spot-check:** Look for `visuals/{slug-dir}/{image}` and `{mobile_image}` on disk. WARN (non-blocking) if missing.
5. **Screen count validation:** count screens, MCQs, text_questions, interviews, glossary terms. WARN if JSON metadata disagrees with actuals.

### Step 2: Extract Metadata

Parse the course JSON:

1. `id` — top-level `id`, else derived from `course_metadata.role` + `course_metadata.skill` as `{role-slug}_{skill-slug}`
2. `technical_atom_id` — same as `id`
3. `technical_atom_name` — from `course_metadata.skill`
4. `course_metadata` — full object; verify it has `archetype`, `company`, `role`, `subtitle`, `skill`, `media_base`, `phases`
5. `glossary` — full object
6. `screens` — full array
7. `screen_count` — count of items in `screens`
8. `mcq_count` — count blocks where `type == "mcq"`
9. `subjective_count` — count blocks where `type == "text_question"` OR `type == "interview"`
10. `glossary_term_count` — count of keys in `glossary`
11. `difficulty_level` — from spec (Entry→`entry`, Mid→`mid`, Senior→`senior`, Managerial→`managerial`), default `mid`
12. `archetype` injection — if `course_metadata` lacks `archetype`, inject `"archetype": "concept_sprint"` (or `"hands_on"`) as the first field

### Step 2.5: Game & Tool Inclusion Gate

Check the course JSON for top-level `game` and `tool` keys. If present, they are preserved in the embedded JSON. If absent and the spec has `## Game Concept` / `## Tool Concept` sections, offer to embed them:

- Game embed adds `"game": { "position_after_screen": N, "title", "description", "rounds", "game_url": "/games/{slug}/{slug}-game.html" }`
- Tool embed adds `"tool": { "name", "subtype", "tool_url": "/games/{slug}/{slug}-tool.html" }`

**God-mode default:** embed whichever exists as files on disk. Skip if the spec has no matching Concept section.

### Step 3: Assemble SQL

Generate the SQL following this template:

```sql
-- Course Content INSERT: {technical_atom_name}
-- Generated: {YYYY-MM-DD} (atom-creator-llm-agnostic)
-- Run this in Supabase SQL Editor

INSERT INTO course_content (
  id, technical_atom_id, technical_atom_name,
  course_metadata, glossary, screens,
  screen_count, mcq_count, subjective_count,
  glossary_term_count, version, status, difficulty_level
) VALUES (
  '{id}',
  '{technical_atom_id}',
  '{technical_atom_name}',
  '{course_metadata_json}'::jsonb,
  '{glossary_json}'::jsonb,
  '{screens_json}'::jsonb,
  {screen_count},
  {mcq_count},
  {subjective_count},
  {glossary_term_count},
  1,
  'active',
  '{difficulty_level}'
)
ON CONFLICT (id) DO UPDATE SET
  technical_atom_name = EXCLUDED.technical_atom_name,
  course_metadata = EXCLUDED.course_metadata,
  glossary = EXCLUDED.glossary,
  screens = EXCLUDED.screens,
  screen_count = EXCLUDED.screen_count,
  mcq_count = EXCLUDED.mcq_count,
  subjective_count = EXCLUDED.subjective_count,
  glossary_term_count = EXCLUDED.glossary_term_count,
  difficulty_level = EXCLUDED.difficulty_level,
  updated_at = now();
```

**Escaping:**
- Double all single quotes in JSON strings (`'` → `''`)
- Cast JSON columns with `::jsonb`
- JSON strings must NOT contain unescaped newlines inside string values — rely on your JSON serializer to escape them as `\n`

### Step 4: Write SQL File

Ensure `courses/sql/` exists (create if missing). Write to `courses/sql/{slug}-insert.sql`.

After writing, invoke `scripts/validate-sql-on-save.sh {path}` via Bash tool (if the script exists) to verify basic SQL sanity.

### Step 5: Summary

```
## SQL Generated  [Stage 5/6 complete]

  File:    courses/sql/{slug}-insert.sql
  Size:    {bytes} bytes
  Screens: {N} | MCQs: {N} | Subjective: {N} | Glossary terms: {N}
  ID:      {id}

  Next: /final-audit {slug}   — run external evaluator audit
  Or:   paste SQL into Supabase SQL Editor to publish
```

### Batch mode (`--all` flag)

If invoked with `--all`, glob `courses/JSONS/*.json`, loop each slug through Steps 1-4, aggregate the summaries, report count of SQL files generated + any ABORTs.

---

## Gotchas

- **Single quote escaping is the #1 source of SQL errors.** Every apostrophe in prose (`it's`, `don't`) must become `''` inside the JSONB string literal.
- **`description` column does NOT exist.** Older pipelines had it as a top-level column; do not re-add. The description lives inside `course_metadata` only.
- **`archetype` field is mandatory** in `course_metadata` — inject if missing before writing SQL.
- **ON CONFLICT upsert** is intentional — it lets `:refine` regenerate SQL without manual DELETE.
