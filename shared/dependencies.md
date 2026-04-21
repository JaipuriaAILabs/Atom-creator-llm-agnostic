# External Dependencies

> Loaded by `:setup` only. Not loaded by every command (progressive disclosure).
> Documents ALL external dependencies for the atom-creator plugin.

---

## Required

| Dependency | Used by | Purpose | Setup |
|-----------|---------|---------|-------|
| Perplexity MCP | `:plan`, `:audit`, `:refine` | Deep research, fact-checking, claim verification | Install via Claude MCP marketplace |
| YouTube MCP | `:plan` | Research (lectures, case studies, expert talks) | Install via Claude MCP marketplace |
| Nano Banana Pro skill | `:visuals`, `:assets` | Gemini image generation (`/nano-banana-pro:generate --model pro`) | Install skill from marketplace |
| Python 3.10+ | `:visuals` (SeedDream path) | Run `generate_seedream.py` | System requirement |

## Required with API Key

| Dependency | Env Var | Used by | Purpose | Get key at |
|-----------|---------|---------|---------|------------|
| BytePlus ModelArk | `BYTEPLUS_API_KEY` | `:visuals` (SeedDream) | SeedDream 4.5 image generation | console.byteplus.com |

## Recommended

| Dependency | Used by | Fallback | Notes |
|-----------|---------|----------|-------|
| Parallel Web MCP | `:plan` (Research Registry verification), `:audit` (Agent 5 primary-source checks), `:final-audit` | `WebFetch` (built-in) — loses batch URL capability | Primary-source verification reads actual source pages. Without this, verification falls back to secondary AI synthesis. |

## Optional (fallbacks exist)

| Dependency | Used by | Fallback | Notes |
|-----------|---------|----------|-------|
| Reddit MCP | `:plan` research | Perplexity search | Community sentiment, pain points |

## Required for UGC Video Generation

| Dependency | Env Var | Used by | Purpose |
|-----------|---------|---------|---------|
| fal.ai API | `FAL_KEY` (in `.env`) | `:ugc` | Kling v3 Pro video generation + SeedDream fallback |
| `generate_video_fal.py` | -- | `:ugc` | Kling image-to-video script |
| Correspondent references | -- | `:ugc` | Face consistency anchors (need >= 5 images in `visuals/correspondent/leaner/`) |
| Nano Banana Pro skill | -- | `:ugc` | Photorealistic still frame generation (Gemini Pro) |

## Scripts (shipped with project)

| Script | Path | Purpose | Required? |
|--------|------|---------|-----------|
| `generate_seedream.py` | `visuals/generate_seedream.py` | SeedDream 4.5 Lite image generation via BytePlus API | Only for SeedDream path |
| `generate_video_fal.py` | `visuals/generate_video_fal.py` | Kling v3 Pro image-to-video via fal.ai API | Only for UGC video path |
| `upload_visuals_to_supabase.py` | `.claude/scripts/upload_visuals_to_supabase.py` | Upload generated visuals to Supabase storage | Optional (manual upload works) |

## Skills (invoked by commands)

| Skill | Used by | Purpose |
|-------|---------|---------|
| `/nano-banana-pro:generate` | `:visuals`, `:ugc` | Gemini Pro image generation with aspect ratio control |
| `/game-design` | `:game` | Interactive mini-game generation |
| `/tool-design` | `:tool` | Course tool generation |
| `/external-atom-audit` | `:final-audit` | External evaluator-style quality audit |
| `/course-visual-generator` | `:visuals` (legacy delegation) | Concept sprint visual pipeline |
| `/hands-on-visual-generator` | `:visuals` (legacy delegation) | Hands-on visual pipeline |

---

## Dependency Check Script

Used by `:setup` to verify environment. Each check returns `true`/`false`:

```
Perplexity MCP:      grep for mcp__perplexity in available tools
YouTube MCP:         grep for mcp__claude_ai_Youtube in available tools
BytePlus API Key:    check $BYTEPLUS_API_KEY env var
FAL_KEY:             grep -q "FAL_KEY" .env (for UGC video generation)
Nano Banana Pro:     check skill exists in skill list
Parallel Web MCP:    grep for mcp__claude_ai_Parallel_Web in available tools
SeedDream script:    file exists at visuals/generate_seedream.py
Video gen script:    file exists at visuals/generate_video_fal.py
Upload script:       file exists at .claude/scripts/upload_visuals_to_supabase.py
Correspondent refs:  count files in visuals/correspondent/leaner/*.png (need >= 5)
Python 3.10+:        python3 --version >= 3.10
```
