---
name: atom-creator-setup
description: First-run configuration wizard. Invoke on first use, after upgrading the plugin, or when any other atom-creator command detects a missing config file. Checks project structure, verifies external dependencies (MCP servers, API keys, scripts), and writes .atom-creator-config.json. Returns a dependency status report.
license: MIT
---

# Atom Creator — Setup

> Run this before using atom-creator for the first time, or after upgrading. Also auto-triggered by other atom-creator skills when they detect a missing `.atom-creator-config.json`.

**Purpose:** Verify project structure, check external dependencies, create the configuration file, and ensure the workspace is ready for course generation.

**Input:** none

**Output:** `.atom-creator-config.json` at the workspace root (project-local) — plus a dependency status report printed to the user.

---

## Pipeline

### Step 1: Check Project Structure

Verify these directories exist. Create any that are missing:

```
courses/
courses/specs/
courses/JSONS/
courses/sql/
courses/audit-reports/
courses/refine-reports/
visuals/
games/
docs/
previews/
```

For each missing directory, create it and note: `Created: courses/audit-reports/` (etc.).

### Step 2: Check Learnings Infrastructure

1. If `atom-creator-learnings.md` does NOT exist at the workspace root, create it with this header:
   ```markdown
   # atom-creator Session Learnings

   > Auto-maintained by atom-creator skills. Read at the top of every skill run, written at session end.
   > Each skill reads this file for accumulated corrections. Each session appends new learnings.
   > Mature learnings promote to formal plugin rules via the atom-creator-refine skill.

   ---
   ```
2. If `atom-creator-learnings.jsonl` does NOT exist, create it as an empty file.

### Step 3: Check External Dependencies

Build a status table. Check each dependency via the Bash tool (or Glob / Read as appropriate).

**Detection methods:**
- **MCP servers:** Check the user's `opencode.json` (or `~/.config/opencode/opencode.json`) for entries under `mcp.*`. The expected registered servers are: `perplexity`, `parallel-web` (optional), `youtube` (optional).
- **API keys:** `grep -q "^KEY=" .env` — expected keys: `FAL_KEY`, `BYTEPLUS_API_KEY`, `PERPLEXITY_API_KEY`.
- **Scripts:** Check file existence with Glob for `visuals/generate_fal.py`, `visuals/generate_video_fal.py`, `scripts/validate-json-on-save.sh`, etc.
- **Python:** Run `python3 --version` via Bash. Require 3.10+.
- **Reference images:** Count files: `ls visuals/correspondent/leaner/*.png | wc -l` (need ≥5 for UGC generation).

Build the dependency status report:

```
DEPENDENCY CHECK
────────────────────────────────────────
Required:
  ✓ Perplexity MCP        — registered in opencode.json (research, fact-checking)
  ✓ Python 3.10+          — v3.12.2

Required with API Key:
  ✓ FAL_KEY               — SET in .env (SeedDream 4.5 image + Kling video)
  ✗ BYTEPLUS_API_KEY      — MISSING (only needed if using BytePlus direct SeedDream)

Recommended:
  ✓ Parallel Web MCP      — registered (primary-source verification)
  ✗ YouTube MCP           — not registered (video research disabled)

Scripts:
  ✓ generate_fal.py        — found at visuals/generate_fal.py
  ✓ generate_video_fal.py  — found at visuals/generate_video_fal.py

UGC Video Generation:
  ✓ FAL_KEY               — SET in .env
  ✓ Correspondent refs    — 9 images in visuals/correspondent/leaner/
────────────────────────────────────────
```

### Step 4: Guidance for Missing Dependencies

For each MISSING required dependency, print setup instructions:

**FAL_KEY:**
```
FAL_KEY (required for SeedDream image + Kling video generation):
→ Get a key at https://fal.ai/dashboard/keys
→ Add to .env:   FAL_KEY=your-key
→ Without this: image + video generation unavailable
```

**Perplexity MCP:**
```
Perplexity MCP (required for research and fact-checking):
→ Get a key at https://www.perplexity.ai/settings/api
→ Register in opencode.json under "mcp":
    {
      "mcp": {
        "perplexity": {
          "command": "npx",
          "args": ["-y", "@perplexity-ai/mcp-server"],
          "env": { "PERPLEXITY_API_KEY": "your-key" }
        }
      }
    }
→ Without this: research falls back to WebSearch (lower quality, no verification track)
```

### Step 5: Capture User Identity

Read git config for the current user (`git config user.name`, `git config user.email`). Non-fatal if missing.

### Step 6: Write Config File

Write `.atom-creator-config.json` at the workspace root:

```json
{
  "setup_date": "{YYYY-MM-DD}",
  "user": "{git user.name}",
  "email": "{git user.email}",
  "plugin_version": "llm-agnostic-1.0.0",
  "runtime": "opencode",
  "dependencies": {
    "perplexity_mcp": true,
    "youtube_mcp": false,
    "parallel_web_mcp": true,
    "fal_key": true,
    "byteplus_api": false,
    "seedream_script": true,
    "video_gen_script": true,
    "python3": true
  },
  "learnings_file": "atom-creator-learnings.jsonl",
  "learnings_md": "atom-creator-learnings.md"
}
```

### Step 7: Summary

```
atom-creator (llm-agnostic) — Setup Complete
────────────────────────────────────────────
User:         {name} ({email})
Dependencies: {N}/{total} connected
Missing:      {list of missing, or "None"}
Learnings:    created / exists at atom-creator-learnings.jsonl
Config:       written to .atom-creator-config.json

Ready to run: /plan <topic>   (invokes atom-creator-plan skill)

Full pipeline:
  :plan → :create → :audit → :assets → :db-insert → :final-audit
```

---

## Troubleshooting

**MCP server shows as unavailable but is installed:** Restart OpenCode after editing `opencode.json`. The MCP servers need a fresh session to register.

**FAL_KEY not detected:** The key must be in `.env` at the workspace root, not in the shell environment. OpenCode loads `.env` at session start.

**Python version too old:** SeedDream requires Python 3.10+. Use `pyenv` or `homebrew` to install.

**Config file exists but outdated:** Delete `.atom-creator-config.json` and re-run this skill to refresh.
