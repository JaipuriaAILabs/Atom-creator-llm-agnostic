# UGC Learnings Protocol — Self-Evolution System

> Loaded by `:ugc` Step 0 (checkpoint) and Step 6 (auto-capture).
> Follows the same CAPTURE → STAGE → PROMOTE → ENFORCE lifecycle as the core atom-creator learnings system.
> NOT loaded by other commands — scoped to UGC video generation only.

---

## Overview

The UGC system evolves its own rules through a 4-stage lifecycle:

```
CAPTURE → STAGE → PROMOTE → ENFORCE
   ↑                           │
   └───── new findings ────────┘
```

- **Capture:** Photo/video iteration corrections auto-written to `.claude/ugc-learnings.jsonl`
- **Stage:** Entries sit in `.jsonl` as `NEW` status, visible at Step 0 checkpoint
- **Promote:** When recurrence ≥ 2 across different courses, propose promotion to permanent rules
- **Enforce:** Promoted rules embed in `shared/ugc-*.md` `## Gotchas` sections and ship via plugin updates

---

## File Locations

| File | Purpose | Tracked in git? |
|------|---------|----------------|
| `.claude/ugc-learnings.jsonl` | Per-user staging area for NEW findings | NO (.gitignore) |
| `.claude/ugc-learnings.md` | Human-readable learnings log | YES |
| `shared/ugc-*.md` `## Gotchas` sections | Promoted rules, loaded every run | YES (plugin source) |

---

## Error Taxonomy

Each finding is classified by domain prefix. The prefix determines which target file receives the promoted rule.

| Domain Prefix | Description | Promotion Target |
|--------------|-------------|-----------------|
| `ugc_photo_face` | Face consistency drift from leaner references | `shared/ugc-correspondent-system.md` |
| `ugc_photo_outfit` | Outfit rule violation (wrong tee, missing jewelry, tattoo appeared) | `shared/ugc-correspondent-system.md` |
| `ugc_photo_composition` | Framing, lighting, background, or exposure issues | `shared/ugc-photo-rules.md` |
| `ugc_video_morphing` | Face or body morphing artifacts in video | `shared/ugc-kling-prompting.md` |
| `ugc_video_lipsync` | Lip sync timing or quality issues | `shared/ugc-kling-prompting.md` |
| `ugc_video_audio` | Voice quality, accent, volume, or ambient issues | `shared/ugc-kling-prompting.md` |
| `ugc_video_motion` | Unnatural movement, gesture artifacts, or generation hangs | `shared/ugc-kling-prompting.md` |
| `ugc_script_tone` | Dialogue delivery tone mismatch with intended register | `shared/ugc-correspondent-system.md` |
| `ugc_prompt_*` | General prompt engineering patterns (photo or video) | `shared/ugc-kling-prompting.md` |

---

## JSONL Entry Format

Each line in `.claude/ugc-learnings.jsonl` is a JSON object:

```json
{
  "id": "2026-03-29-001",
  "date": "2026-03-29",
  "command": ":ugc",
  "slug": "manager-organizational-resilience-design",
  "domain": "ugc_photo_outfit",
  "severity": "HIGH",
  "finding": "Burgundy tactical vest generated with PRESS badge and circular emblem despite negative prompt. Required 3 iterations with triple-negative phrasing to remove.",
  "rule": "When requesting clean vest surface, repeat the negative at least 3 times in different phrasings: 'no patches no emblems no stickers no badges no logos no insignia no symbols no credentials no writing of any kind'",
  "applies_to": ":ugc Step 3 (photo generation)",
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
| `command` | string | Always `:ugc` |
| `slug` | string | Course slug where finding occurred |
| `domain` | string | Error taxonomy prefix (see table above) |
| `severity` | string | `HIGH` or `CRITICAL` (only these are auto-captured) |
| `finding` | string | What went wrong — specific enough to grep for |
| `rule` | string | The corrective rule to prevent recurrence |
| `applies_to` | string | Which step this rule affects (e.g., `:ugc Step 3`) |
| `status` | string | `NEW` → `PROMOTED` → `ARCHIVED` |
| `recurrence` | number | Count of times this pattern has been seen |
| `related_ids` | array | IDs of similar findings (for recurrence tracking) |

---

## Lifecycle Stages

### 1. Auto-Capture (`:ugc` Step 6 — Review + Learning Capture)

After the user reviews the final video and selects corrections in Panel 7:

1. For each selected correction category, classify using the error taxonomy (domain prefix)
2. Check existing entries in `.jsonl` for similar findings (fuzzy match on `finding` + `domain`)
3. If match found: increment `recurrence`, add current ID to `related_ids`
4. If no match: create new entry with `recurrence: 1`, `status: "NEW"`
5. Append to `.claude/ugc-learnings.jsonl`
6. Append human-readable summary to `.claude/ugc-learnings.md`

**Auto-capture also triggers on iteration rejections:**
- Each photo rejection (Panel 4) captures a `ugc_photo_*` entry
- Each video rejection (Panel 6) captures a `ugc_video_*` entry
- These capture the specific correction, not just that a rejection occurred

**Auto-capture criteria:**
- The correction must be actionable (has a clear rule to prevent recurrence)
- The correction must be generalizable (not a one-off Gemini rendering glitch)

### 2. Checkpoint (`:ugc` Step 0 — Context Load)

At Step 0:

1. Read `.claude/ugc-learnings.jsonl` if it exists
2. Count entries by status: `{NEW: N, PROMOTED: N, ARCHIVED: N}`
3. Display checkpoint summary:
   ```
   📹 UGC Learnings: {N} NEW, {N} promoted
   ```
4. Load any `NEW` entries relevant to the current appearance type (Hook/Whisper/Close)

### 3. Promotion Proposal (`:ugc` Step 0)

**Trigger:** Any entry with `recurrence ≥ 2` AND `status: "NEW"`

**Proposal format:**
```
🔄 UGC Promotion candidates ({N} entries with recurrence ≥ 2):

1. [{domain}] {rule}
   Seen in: {slug1}, {slug2}
   Target: {promotion_target from taxonomy}
   → Promote to ## Gotchas in {target_file}?

[Auto-approve all / Review individually / Skip]
```

**If promoted:**
1. Update entry `status` to `"PROMOTED"`
2. Add the rule text to `## Gotchas` section in the target shared file
3. Note the promotion in the entry: `"promoted_to": "{file}:{section}"`

### 4. Pruning

When `.jsonl` exceeds 15 entries with `status: "NEW"`:
- Sort by `recurrence` (ascending) then `date` (oldest first)
- Archive lowest-recurrence, oldest entries until count = 10
- Set their `status` to `"ARCHIVED"`

---

## Integration with `.claude/ugc-learnings.md`

The human-readable `.md` file coexists with the structured `.jsonl`:

- `.md` = human-readable, git-tracked, session notes
- `.jsonl` = machine-readable, per-user, structured lifecycle data

When a `.md` entry is marked `PROMOTED`, its corresponding `.jsonl` entry should also be `PROMOTED`.

### Initial `.md` template (created by `:setup` or first `:ugc` run):

```markdown
# UGC Session Learnings

> Auto-maintained by :ugc command. Read at Step 0, written at Step 6.
> Mature learnings promote to shared/ugc-*.md via promotion cycle.

---

## Photo Generation

## Video Generation

## Script & Delivery

## Character Design
```

---

## Promotion Routing Table

Quick reference for where promoted rules land:

| Domain | Target File | Target Section |
|--------|------------|----------------|
| `ugc_photo_face` | `shared/ugc-correspondent-system.md` | `## Gotchas` |
| `ugc_photo_outfit` | `shared/ugc-correspondent-system.md` | `## Gotchas` |
| `ugc_photo_composition` | `shared/ugc-photo-rules.md` | `## Gotchas` |
| `ugc_video_morphing` | `shared/ugc-kling-prompting.md` | `## Gotchas` |
| `ugc_video_lipsync` | `shared/ugc-kling-prompting.md` | `## Gotchas` |
| `ugc_video_audio` | `shared/ugc-kling-prompting.md` | `## Gotchas` |
| `ugc_video_motion` | `shared/ugc-kling-prompting.md` | `## Gotchas` |
| `ugc_script_tone` | `shared/ugc-correspondent-system.md` | `## Gotchas` |
| `ugc_prompt_*` | `shared/ugc-kling-prompting.md` | `## Gotchas` |
