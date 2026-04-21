---
name: atom-creator-assets
description: Generate all course assets in parallel — visuals, game, tool, optional UGC video. Invoke after /audit, or when the user says "generate assets for {slug}" or /assets {slug}. Launches up to 4 parallel sub-agents. Returns: PNG images, game HTML, tool HTML (if spec has Tool Concept), UGC video (if spec has UGC Concept).
license: MIT
recommendedAgent: visual-director
---

# Atom Creator — Generate Assets (Stage 4)

> Pipeline: `:plan` → `:create` → `:audit` → `:assets` (you are here) → `:db-insert` → `:final-audit`

**Purpose:** Generate course visuals, interactive game, course tool, and (if configured) Correspondent UGC video — in parallel. Fastest path to completing all course assets. Each generator has its own quality gate.

**Prerequisites:**
1. Spec: `courses/specs/{slug}-spec.md`
2. Course MD: `courses/{slug}-concept-sprint.md` OR `courses/{slug}-hands-on-guide.md`
3. Recommended: spec status `GENERATED — audit passed` or `REFINED — v{any}`

**Input:** `{slug}`

**Output:**
- PNG images in `visuals/{slug}/` (2 covers + 5-10 body)
- `games/{slug}/design.md` + `games/{slug}/{slug}-game.html`
- `games/{slug}/{slug}-tool.html` (if spec has `## Tool Concept`)
- `visuals/correspondent/{slug}/*.png` + `*.mp4` (if spec has `## UGC Concept` or `## Song Score`)

---

## Pipeline

### Step 0: Argument Resolution + Environment Check

If no slug, Glob specs and ask. If `.atom-creator-config.json` missing, run `atom-creator-setup`.

### Step 0.5: Read Learnings

If `atom-creator-learnings.md` exists, read the **Visual Generation** and **Game Design** sections. Pass relevant learnings to the visual + game + tool sub-agents in their context prompts.

### Step 1: Validate Prerequisites

1. Load `shared/status-definitions.md`.
2. Locate spec. If missing, list available + suggest closest match.
3. Verify status is `GENERATED — audit passed`, `REFINED — v{any}`, or `CREATED` (with warning).
4. DRAFT → abort with "Run `/plan`". APPROVED → abort with "Run `/create`".
5. Verify course MD exists (try both archetype paths).

### Step 2: Audit Gate

If spec status is `CREATED` (not `GENERATED — audit passed` / `REFINED`):

Warn the user: "Content audit hasn't been run. Generating assets on unaudited content risks wasting image generation credits if content needs revision later."

**God-mode default:** proceed without audit. (Override by replying inline: "run audit first".) If user selects "run audit first", delegate to the `atom-creator-audit` skill first and return; assets will be offered after audit completes.

### Step 3: Tool / UGC Detection

Before launching, scan the spec for optional sections:
- `## Tool Concept` — if present, launch Agent C (Tool)
- `## UGC Concept` or `## Song Score` — if present, launch Agent D (UGC Video)

Launch all applicable agents via OpenCode's Task tool in PARALLEL (one message, multiple dispatches):

**Agent A (Visuals):** Delegate to the `atom-creator-visuals` skill. Do NOT generate images directly — the visuals skill owns the 6-phase pipeline (context → philosophy gate → art direction → sample prompt → full set → generation → audit). Pass slug + spec path + course MD path + current status.

**Agent B (Game):** Delegate to the `atom-creator-game` skill. Pass slug + spec (extract `## Game Concept`) + course MD + `games/GAME-DESIGN.md` + current status. The game generator handles its own Agent 4 (game mechanics audit).

**For multi-game courses (spec has `## Course Blueprint` with multiple Game entries):**
- Games generate SEQUENTIALLY, not in parallel
- Each game gets its own context load + mechanic selection + quality gate
- Pass the full Game Placements table from the blueprint to the game generator

**Agent C (Tool) — only if spec has `## Tool Concept`:** Delegate to `atom-creator-tool` skill. Pass slug + spec (extract `## Tool Concept`) + course MD + `shared/tool-design-system.md` + `shared/tool-audit.md`.

**Agent D (UGC Video) — only if spec has `## UGC Concept` or `## Song Score`:** Delegate to `atom-creator-ugc` skill. Pass slug + spec (extract UGC concept or Song Score) + full course MD for placement analysis. Agent D is independent — does not depend on Agents A, B, C.

**If no applicable Concept sections:** Silently skip the absent agents.

### Step 4: Consolidated Summary

After all dispatched agents complete, check ALL artifacts across the pipeline:

```
## Assets Generated  [Stage 4/6 complete]

### Course Content
  MD:   courses/{slug}-{concept-sprint|hands-on-guide}.md ✓/✗
  JSON: courses/JSONS/{slug}.json ✓/✗

### Visuals
  Directory: visuals/{slug}/
  Images: [N images found / not generated]

### Game
  Design: games/{slug}/design.md ✓/✗
  HTML:   games/{slug}/{slug}-game.html ✓/✗

### Tool
  HTML: games/{slug}/{slug}-tool.html ✓/✗ [or: not generated — no Tool Concept in spec]

### UGC Video
  Still: visuals/correspondent/{slug}/{slug}-ugc-{appearance}.png ✓/✗
  Video: visuals/correspondent/{slug}/{slug}-ugc-{appearance}-video.mp4 ✓/✗

### Spec
  Archived: courses/specs/{slug}-spec.md ✓

  Next: /db-insert {slug}   — generate SQL for Supabase import
```

List any missing artifacts with remediation ("Visuals not found — run `/visuals {slug}` to generate").

---

## Troubleshooting

**Course MD not found:** Run `/create {slug}` first. Both visual and game generators need narrative context from the course content.

**One agent fails, other succeeds:** The parallel agents are independent. If visuals fail but game succeeds (or vice versa), the successful output is preserved. Re-run the failed stage individually: `/visuals {slug}` or `/game {slug}`.

**Both agents fail:** Check that prerequisites are met (spec + course MD exist). If both fail on content issues, run `/audit {slug}` first to fix content before retrying assets.

**Image generation cost:** Defaults to SeedDream 4.5 via fal.ai (~$0.04/image). For 7-12 images, expect ~$0.28-0.48 per course. Gemini Pro fallback is ~$0.134/image.
