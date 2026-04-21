---
name: atom-creator-help
description: Show the atom-creator command reference and pipeline map. Invoke when the user asks "what does atom-creator do?", "how do I start?", "list the commands", or types /help. Returns a quick reference card printed to chat plus a link to the HTML help page if bundled.
license: MIT
---

# Atom Creator — Help

Show the interactive pipeline reference. When a bundled HTML help page exists, open it in the browser; otherwise print the quick reference below.

## Steps

1. **Find the help page.** Check in order:
   - `docs/help-page.html` at the workspace root
   - `{repo-root}/docs/help-page.html` (relative to this skill's install location)

2. **Open it.** If found, run `open <path>` (macOS) or `xdg-open <path>` (Linux) via the Bash tool. Confirm: "Opened the atom-creator help page in your browser."

3. **Fallback.** If no HTML file found, print the quick reference below.

---

## Quick Reference

**New course?** `/plan <Role / Industry / Level>`
**Fully automatic?** `/god-mode <Role / Industry / Level>`

**Pipeline:** `:plan` → `:create` → `:audit` → `:assets` → `:db-insert` → `:final-audit`

**Standalone commands:**
- `:setup` — First-run config
- `:visuals` — Course images (6-phase pipeline)
- `:game` — Interactive mini-game
- `:tool` — Course tool (self-audit, calculator, matcher)
- `:ugc` — Correspondent UGC video
- `:audit-story` — Standalone storytelling craft audit
- `:refine` — Retroactive compliance refinement (supports `--all`, `--dry-run`, `--tier1-only`)

**Agents:**
- `course-researcher` — Deep research + Perplexity verification (high tier)
- `content-auditor` — 6-domain audit pipeline (mid tier)
- `structural-validator` — C1-C72 mechanical checks (mid tier)
- `visual-director` — Art direction + UGC (high tier)

**Archetypes:**

| Type | Best for | Screens | Voice |
|---|---|---|---|
| Concept Sprint | Business strategy, management, analytical frameworks | 12-14 (sweet spot 13) | 4 rotating voices |
| Hands-On Guide | Software tools, technical workflows, step-by-step tutorials | 8-18 | Fixed: The Instructor |

**Two hard gates:**
- QG2 (spec approval) at the end of `:plan`
- Content audit pass at the end of `:audit`

**Self-evolution:** Findings auto-capture to `atom-creator-learnings.jsonl`. Recurrence ≥ 2 → promotion proposal. Run `:refine --promote` to cycle.

**Cost per course (Kimi K2.6 backing):**
- Text generation (:plan + :create + :audit): ~$0.10-0.40 depending on length
- SeedDream images (2 covers + 8-10 body): ~$0.40-0.50
- Kling video (UGC, optional): ~$0.15-0.20 per clip

For the full spec, see `docs/AGENTS.md` and `docs/opencode-portability-matrix.md`.
