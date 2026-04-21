# Learnings Protocol — Self-Evolution System

> Loaded by `:plan` Step 0.5 for promotion proposals. Referenced by `:audit` and `:final-audit` for auto-capture.
> NOT loaded by every command — progressive disclosure.

---

## Overview

The atom-creator plugin evolves its own rules through a 4-stage lifecycle:

```
CAPTURE → STAGE → PROMOTE → ENFORCE
   ↑                           │
   └───── new findings ────────┘
```

- **Capture:** HIGH/CRITICAL audit findings auto-written to `.claude/atom-creator-learnings.jsonl`
- **Stage:** Entries sit in `.jsonl` as `NEW` status, visible at Step 0.5 checkpoint
- **Promote:** When recurrence ≥ 2 across different courses, propose promotion to permanent rules
- **Enforce:** Promoted rules embed in command `## Gotchas` sections and ship via plugin updates

---

## File Locations

| File | Purpose | Tracked in git? |
|------|---------|----------------|
| `.claude/atom-creator-learnings.jsonl` | Per-user staging area for NEW findings | NO (.gitignore) |
| `.claude/atom-creator-learnings.md` | Human-readable learnings log (legacy + current) | YES |
| `commands/*.md` `## Gotchas` sections | Promoted rules, loaded every run | YES (plugin source) |
| `.claude/atom-creator-config.json` | Per-user setup config | NO (.gitignore) |

---

## Error Taxonomy

Each finding is classified by domain prefix. The prefix determines which target file receives the promoted rule.

| Domain Prefix | Description | Promotion Target |
|--------------|-------------|-----------------|
| `visual_hex` | Hex codes rendered as text | `shared/visual-philosophy.md` rules, `shared/visual-audit.md` checks |
| `visual_composition` | Layout/composition issues | `shared/visual-philosophy.md` VD rules |
| `visual_style` | Style/rendering problems | `shared/visual-philosophy.md` SD rules |
| `visual_cultural` | Cultural context in visuals | `shared/visual-philosophy.md` rules |
| `visual_register` | Emotional register mismatch | `shared/visual-philosophy.md` VD rules |
| `bio_wrong_title` | Person's job title incorrect | `shared/content-audit.md` Agent 5 steps |
| `bio_wrong_sequence` | Career sequence incorrect | `shared/content-audit.md` Agent 5 steps |
| `factual_stale_number` | Financial figure without date anchor | `shared/inline-validation.md` V18 |
| `factual_ghost_citation` | Citation to nonexistent publication | `shared/content-audit.md` Agent 5 steps |
| `factual_merged_sources` | Stats from different studies merged | `shared/content-audit.md` Agent 5 steps |
| `factual_inverted_claim` | Comparison direction reversed | `shared/content-audit.md` Agent 5 steps |
| `factual_registry_drift` | Claim in Registry but prose drifted from source evidence | `shared/content-audit.md` Agent 5 steps |
| `factual_registry_absent` | Claim in prose has no R-number (synthesis drift) | `shared/create-rules-cs.md` generation rules |
| `factual_registry_direction` | Comparison direction inverted from Registry evidence | `shared/content-audit.md` Agent 5 steps |
| `factual_reputational` | Named person with legal/reputational issues | `commands/create.md` generation rules |
| `structural_*` | JSON/MD structure violations | `shared/structural-checks.md` |
| `story_*` | Narrative quality issues | `shared/storytelling-audit.md` |
| `mcq_*` | MCQ design problems | `shared/content-audit.md` Agent 1 |
| `json_*` | JSON schema violations | `generation-guide/json-schema.md` |
| `sql_*` | SQL generation errors | `commands/db-insert.md` |
| `game_*` | Game design issues | `shared/game-audit.md` |
| `tool_*` | Tool design issues | `commands/tool.md` |
| `prompt_*` | Image prompt engineering | `shared/visual-philosophy.md` |

---

## JSONL Entry Format

Each line in `.claude/atom-creator-learnings.jsonl` is a JSON object:

```json
{
  "id": "2026-03-20-001",
  "date": "2026-03-20",
  "command": ":audit",
  "slug": "product-manager-feedback-loop-mapping",
  "domain": "factual_merged_sources",
  "severity": "HIGH",
  "finding": "Pendo (6.4% features drive 80% clicks) and Userpilot (181 companies, 16.5% median) are different reports — were merged into one fictional citation.",
  "rule": "Never merge statistics from different studies into a single attribution. Each stat traces to its own named source.",
  "applies_to": ":create Step 4 (citation handling)",
  "status": "NEW",
  "recurrence": 1,
  "related_ids": []
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `{date}-{sequence}` — unique per day |
| `date` | string | ISO date of capture |
| `command` | string | Which command captured this (`:audit`, `:final-audit`, `:visuals`, etc.) |
| `slug` | string | Course slug where finding occurred |
| `domain` | string | Error taxonomy prefix (see table above) |
| `severity` | string | `HIGH` or `CRITICAL` (only these are auto-captured) |
| `finding` | string | What went wrong — specific enough to grep for |
| `rule` | string | The corrective rule to prevent recurrence |
| `applies_to` | string | Which command + step this rule affects |
| `status` | string | `NEW` → `PROMOTED` → `ARCHIVED` |
| `recurrence` | number | Count of times this pattern has been seen |
| `related_ids` | array | IDs of similar findings (for recurrence tracking) |

---

## Lifecycle Stages

### 1. Auto-Capture (`:audit` Step 9, `:final-audit` Step 4)

After audit completes, for each HIGH or CRITICAL finding:

1. Classify using the error taxonomy (domain prefix)
2. Check existing entries in `.jsonl` for similar findings (fuzzy match on `finding` + `domain`)
3. If match found: increment `recurrence`, add current ID to `related_ids`
4. If no match: create new entry with `recurrence: 1`, `status: "NEW"`
5. Append to `.claude/atom-creator-learnings.jsonl`

**Auto-capture criteria:**
- Severity must be HIGH or CRITICAL (MEDIUM and LOW are informational only)
- The finding must be actionable (has a clear corrective rule)
- The finding must be generalizable (not a one-off data error)

### 2. Checkpoint (`:plan` Step 0.5, all commands Step 0.1)

At Step 0.5 in `:plan` (or when loading learnings in other commands):

1. Read `.claude/atom-creator-learnings.jsonl` if it exists
2. Count entries by status: `{NEW: N, PROMOTED: N, ARCHIVED: N}`
3. Display checkpoint summary:
   ```
   📚 Learnings checkpoint: {N} NEW, {N} promoted
   ```

### 3. Promotion Proposal (`:plan` Step 0.5)

Only `:plan` proposes promotions (it's the command that starts new courses, so it's the natural checkpoint).

**Trigger:** Any entry with `recurrence ≥ 2` AND `status: "NEW"`

**Proposal format:**
```
🔄 Promotion candidates ({N} entries with recurrence ≥ 2):

1. [{domain}] {rule}
   Seen in: {slug1}, {slug2}
   Target: {promotion_target from taxonomy}
   → Promote to ## Gotchas in {target_command}?

[Auto-approve all / Review individually / Skip]
```

**If promoted:**
1. Update entry `status` to `"PROMOTED"`
2. Add the rule text to the appropriate `## Gotchas` section in the target command file
3. Note the promotion in the entry: `"promoted_to": "{file}:{section}"`

### 4. Pruning

When `.jsonl` exceeds 15 entries with `status: "NEW"`:
- Sort by `recurrence` (ascending) then `date` (oldest first)
- Archive lowest-recurrence, oldest entries until count = 10
- Set their `status` to `"ARCHIVED"`

---

## Integration with `.claude/atom-creator-learnings.md`

The existing human-readable `.md` file continues to serve as the readable learnings log. It is:
- Written to by commands that capture session corrections (e.g., visual direction feedback)
- Read at Step 0 by most commands for context
- The source of truth for learnings that predate the `.jsonl` system

The `.jsonl` file is the machine-readable counterpart for structured lifecycle management. Both coexist:
- `.md` = human-readable, git-tracked, session notes + PROMOTED status annotations
- `.jsonl` = machine-readable, per-user, structured lifecycle data

When a `.md` entry is marked `PROMOTED`, its corresponding `.jsonl` entry (if one exists) should also be `PROMOTED`.

---

## Promotion Routing Table

Quick reference for where promoted rules land:

| Domain | Target File | Target Section |
|--------|------------|----------------|
| `visual_*` | `commands/visuals.md` | `## Gotchas` |
| `bio_*` | `commands/audit.md` | `## Gotchas` |
| `factual_*` | `commands/create.md` or `commands/audit.md` | `## Gotchas` |
| `structural_*` | `shared/structural-checks.md` | New check entry |
| `story_*` | `commands/audit-story.md` | `## Gotchas` |
| `mcq_*` | `commands/create.md` | `## Gotchas` |
| `json_*` | `commands/create.md` | `## Gotchas` |
| `sql_*` | `commands/db-insert.md` | `## Gotchas` |
| `game_*` | `commands/game.md` | `## Gotchas` |
| `tool_*` | `commands/tool.md` | `## Gotchas` |
| `prompt_*` | `commands/visuals.md` | `## Gotchas` |
