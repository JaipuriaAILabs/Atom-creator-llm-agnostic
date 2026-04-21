---
name: course-quality-checker
description: Quick course quality check without full 6-agent audit. Use when user asks 'is this course good?', 'check quality', 'what's wrong with this course?', 'quick check', or 'spot check'. Read-only — does not modify files. Returns a quality scorecard in 30 seconds vs 5+ minutes for full audit.
allowed-tools: Read, Grep, Glob
---

# Course Quality Checker

Quick, read-only quality assessment for Rehearsal courses. Runs the 10 most critical checks from the 60-check structural validation and storytelling systems.

## When to Use

- User asks about course quality without wanting a full audit
- Quick sanity check before running `:audit`
- Spot-checking a specific concern

## When NOT to Use

- Full compliance check → use `/atom-creator:audit`
- Storytelling rework → use `/atom-creator:audit-story`
- Batch compliance scan → use `/atom-creator:refine --all --dry-run`

## The 10-Point Scorecard

For the target course, read the MD and JSON files, then check:

### Structure (4 checks)
1. **C44** — MCQ and glossary NEVER on same card → PASS/FAIL
2. **C45** — No two exercise cards back-to-back without story card → PASS/FAIL
3. **C57** — ≥55% story screens (narrative proportion) → PASS/FAIL + percentage
4. **C58** — Midpoint screen is a story card → PASS/FAIL

### Schema (3 checks)
5. **C46** — Max 1 glossary term per screen → PASS/FAIL + count
6. **C49** — No images on practice/glossary cards → PASS/FAIL
7. **JSON** — All text blocks use `"text"` not `"value"`, all have `"font"` field → PASS/FAIL + count

### Storytelling (3 checks)
8. **P30** — Screen 1 opens with Person-Place-Action (company + data on first line) → PASS/FAIL
9. **P33** — Company named with context before framework appears → PASS/FAIL
10. **C54** — No text block exceeds 75 words → PASS/FAIL + max found

## Output Format

```
## Quick Quality Check: {course-title}

Score: 8/10 ✓

| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | C44 Card separation | ✓ PASS | — |
| 2 | C45 Story-exercise rhythm | ✓ PASS | — |
| 3 | C57 Narrative proportion | ✓ PASS | 62% story screens |
| 4 | C58 Midpoint story card | ✗ FAIL | Screen 9 is glossary |
| 5 | C46 Single glossary/screen | ✓ PASS | — |
| 6 | C49 No media on exercises | ✓ PASS | — |
| 7 | JSON schema | ✓ PASS | All 47 text blocks valid |
| 8 | P30 Opening quality | ✓ PASS | "Meesho's warehouse..." |
| 9 | P33 Company before concept | ✗ FAIL | Framework at screen 2 |
| 10 | C54 Text density | ✓ PASS | Max: 68 words |

Recommendation: Fix C58 (swap midpoint screen) then run full /atom-creator:audit
```

## Finding Course Files

1. List courses: `courses/*-concept-sprint.md` and `courses/*-hands-on-guide.md`
2. JSON companion: `courses/JSONS/{slug}.json`
3. If user doesn't specify, ask which course to check
