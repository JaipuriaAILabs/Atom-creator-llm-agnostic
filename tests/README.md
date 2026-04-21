# Testing

This directory contains automated integrity tests for atom-creator-llm-agnostic.
The tests do not require a running OpenCode session — they verify static
assets, compiled plugin output, and hook parity against the original bash
scripts.

## Running

Prereq: `npm install && npm run build`.

```bash
# Full e2e pipeline test (default `npm test` entry point)
npm test
# or directly:
bash tests/e2e-opencode-full-pipeline.sh

# Just hook parity (bash vs TS ports)
bash tests/hook-parity.sh
```

Both scripts exit non-zero on any failure and print a structured pass/fail
summary.

## What the tests check

### `e2e-opencode-full-pipeline.sh`

1. **Build present** — `dist/index.js` exists.
2. **Skills frontmatter** — all 15 `skills/*/SKILL.md` have `name:` and `description:`.
3. **Agents frontmatter** — all 4 `agents/*.md` have `mode:`, `model:`, `permission:`.
4. **Commands frontmatter** — all 15 `commands/*.md` have `description:`.
5. **Plugin factory** — `dist/index.js` exports a default function that resolves
   to a handlers object with `tool.execute.before`, `tool.execute.after`,
   `session.created`, and a `tools[]` array.
6. **install.js --dry-run** — `node install.js install --dry-run --non-interactive`
   exits cleanly without writing any files.
7. **Bash hook syntax** — every `scripts/*.sh` parses with `bash -n`.
8. **Hook parity** — delegates to `hook-parity.sh`.

### `hook-parity.sh`

Drives 5 critical hooks against the same fixtures in both their bash and
TypeScript forms, then diffs exit codes:

| Hook | Fixture | Expected exit |
|---|---|---|
| `validate-json` | `invalid.json` (malformed) | 2 (block) |
| `validate-json` | `deprecated-value-key.json` | 2 (block) |
| `validate-json` | `valid-course.json` | 0 (pass) |
| `validate-sql` | `sql-with-description-column.sql` | 2 (block) |
| `validate-sql` | `sql-valid.sql` | 0 (pass) |
| `protect-approved-specs` | APPROVED spec | 0 (warn, don't block) |
| `guard-ship-ready` | SHIP-READY without audit | 2 (HARD BLOCK) |
| `guard-ship-ready` | SHIP-READY with audit + all files | 0 (pass) |
| `enforce-pipeline-order` | CREATED status | 0 (soft warn) |

**Not yet covered (TODO):** `check-triple-sync`, `check-mcq-balance`,
`check-docs-freshness`, `check-game-patterns`, `check-aspect-ratio`,
`check-storytelling-signals`, `guard-game-generation`. The 5 covered hooks
include every HARD-BLOCK path — the ones whose semantics must never drift.

## Fixtures

Minimal fixtures live under `tests/fixtures/`. Each fixture targets one code
path:

- `invalid.json` — malformed JSON (trips `JSON.parse` error)
- `valid-course.json` — 13 screens, all blocks well-formed
- `deprecated-value-key.json` — trips the `value`-vs-`text` check
- `sql-valid.sql` — has `ON CONFLICT`, no `description` column
- `sql-with-description-column.sql` — trips description-as-column check
- `sql-missing-onconflict.sql` — missing `ON CONFLICT` (soft warn path)
- `approved-spec/` — spec with Status: APPROVED (triggers protect-approved-specs)
- `ship-ready-blocked/` — GENERATED spec + SHIP-READY content + NO audit report
- `ship-ready-ok/` — GENERATED spec + SHIP-READY content + audit report + all
  3 course files (MD + JSON + SQL)

### Adding new fixtures

1. Keep them minimal — enough to trigger one code path.
2. Put them directly under `tests/fixtures/` if they are single files, or
   under `tests/fixtures/{scenario-name}/` if the hook walks a project tree.
3. Update `hook-parity.sh` with a `compare "name" "$bash_rc" "$ts_rc"` line.
4. Update this README's fixture list.

## Known gaps

- **No live OpenCode integration test.** We cannot programmatically drive an
  OpenCode session. To verify end-to-end:
  1. Install OpenCode: https://opencode.ai
  2. In a scratch dir: `node /path/to/install.js install --project`
  3. Run `opencode` and try `/plan Product Manager AI readiness`.
  4. Verify a spec file is written under `courses/specs/`.
- **No cost benchmark.** The plan's "cost benchmark" step (CC+Opus vs
  OpenCode+Kimi) requires two real pipeline runs; it is a manual check.
- **Audit prompt quality.** Parity tests only cover exit codes — prose
  quality of the audit passes requires manual review of a generated course.
