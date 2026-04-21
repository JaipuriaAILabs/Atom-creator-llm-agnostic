# Migration from Claude Code `atom-creator` → OpenCode `atom-creator-llm-agnostic`

For teams already using the upstream Claude Code plugin who want to try cheap bulk generation on OpenCode.

---

## TL;DR

- **Keep both installed.** They operate on the same `courses/`, `visuals/`, `games/` directories.
- **Bulk-generate on OpenCode** (Kimi K2.6 or similar) → **final-audit on Claude Code** (Opus).
- File formats are identical. `shared/*.md` rules are vendored verbatim.
- Expect some prose quality drop on cheap models. Structural checks (C1-C60) pass identically.

---

## Install side-by-side

```bash
# 1. You already have the Claude Code plugin via:
#    /plugin marketplace add JaipuriaAILabs/rehearsal-dev
#    /plugin install atom-creator@rehearsal-dev

# 2. Add the OpenCode port to the same workspace:
cd ~/Python\ Projects/Rehearsal\ Course\ Gen-\ Revised
npx atom-creator-llm-agnostic install --project

# 3. Both now coexist. Run whichever CLI you prefer per task:
claude    # for premium / final-audit
opencode  # for bulk / cheap-generate
```

The OpenCode installer writes `./.opencode/` and `./opencode.json`. The Claude Code plugin lives in the marketplace cache. They do not collide.

---

## Command mapping

Every command is **1:1 equivalent**, just drop the `atom-creator:` namespace prefix.

| Claude Code | OpenCode |
|---|---|
| `/atom-creator:plan <input>` | `/plan <input>` |
| `/atom-creator:create <slug>` | `/create <slug>` |
| `/atom-creator:audit <slug>` | `/audit <slug>` |
| `/atom-creator:assets <slug>` | `/assets <slug>` |
| `/atom-creator:visuals <slug>` | `/visuals <slug>` |
| `/atom-creator:game <slug>` | `/game <slug>` |
| `/atom-creator:tool <slug>` | `/tool <slug>` |
| `/atom-creator:db-insert <slug>` | `/db-insert <slug>` |
| `/atom-creator:refine <slug>` | `/refine <slug>` |
| `/atom-creator:final-audit <slug>` | `/final-audit <slug>` |
| `/atom-creator:audit-story <slug>` | `/audit-story <slug>` |
| `/atom-creator:ugc <slug>` | `/ugc <slug>` |
| `/atom-creator:setup` | `/setup` |
| `/atom-creator:help` | `/help` |
| `/atom-creator:god-mode <input>` | `/god-mode <input>` |

---

## What's different

### 1. File locations

| Artifact | Claude Code | OpenCode |
|---|---|---|
| Skills | `~/.claude/plugins/marketplaces/rehearsal-dev/atom-creator/skills/` | `./.opencode/skills/` or `~/.config/opencode/skills/` |
| Agents | `...rehearsal-dev/atom-creator/agents/` | `./.opencode/agents/` |
| Commands | `...rehearsal-dev/atom-creator/commands/` | `./.opencode/commands/` |
| Config | `.claude/settings.local.json` (per-project) | `opencode.json` (project root) |
| Hooks | bash in `scripts/*.sh` + `hooks/*.json` | TS in `node_modules/atom-creator-llm-agnostic/dist/` |
| API keys | `.env` | `.env` (same) |

### 2. Decision points in `/plan` (UX downgrade)

Claude Code renders the 14 creative decision points as rich chooser panels. **OpenCode does not support this.** The OpenCode `/plan` skill:

- Applies **god-mode defaults** by default (same as `/atom-creator:god-mode` in CC).
- Accepts **`--flag` overrides** like `--genre Investigative --description-opener hook-fact`.
- Falls back to inline markdown prompts for critical decisions (approve-or-revise-spec gate).

If you rely on the crafting dialog, stay on Claude Code for `/plan` and use OpenCode only for `/create` onwards.

### 3. Plan mode gone

No `EnterPlanMode` in OpenCode. The `/plan` skill writes its spec directly as `DRAFT`, shows it inline, then bumps to `APPROVED` on your confirmation. Functionally equivalent, less polished UX.

### 4. Sub-agent models set in config, not frontmatter

Claude Code: `model: opus` in the agent's frontmatter.
OpenCode: `agent.<name>.model` in `opencode.json`.

See `docs/kimi-k2-setup.md` for per-agent config.

### 5. External audit still requires Claude Code

`/external-atom-audit` (the final quality gate) is a separate plugin and still runs on Claude Code. The cheap-generate / premium-audit split is the intentional design.

---

## Recommended workflow: cheap-generate + premium-audit

For a 15-course batch:

```bash
# Stage 1-5 (plan, create, audit, assets, db-insert) — OpenCode + Kimi
opencode
> /plan <course 1>
> /create <course 1>
> /audit <course 1>
> /assets <course 1>
> /db-insert <course 1>
# Repeat for 2-15

# Stage 6 (final audit) — Claude Code + Opus
claude
> /atom-creator:final-audit <course 1>
> /atom-creator:final-audit <course 2>
# Repeat for 2-15
```

Rough economics for 15 courses end-to-end:

| All-Opus | Cheap + Premium-audit | Savings |
|---|---|---|
| $80 - $200 | $10 - $25 | **~85%** |

Premium-audit still runs on Opus where its judgment demonstrably matters (ghost citations, wrong-figure catches, person-attribution verification).

---

## Syncing rule updates

The `shared/*.md` rule corpus (35 files) is **vendored** into both plugins. When rules change upstream in `atom-creator`:

1. Rule changes land in `atom-creator/shared/` first.
2. Re-vendor into `atom-creator-llm-agnostic/shared/` (copy).
3. Bump version in both `package.json` and upstream `plugin.json`.
4. Users pull latest via `npm update atom-creator-llm-agnostic` + `/atom-creator:refine --all --dry-run` on Claude Code.

Alternative: make `shared/` a git submodule. Cleaner, higher install friction. Current default is vendor-and-sync.

---

## Known issues

- **No structured question panels** in OpenCode — `/plan` is god-mode-first. See `docs/opencode-portability-matrix.md` for details.
- **Large assets not shipped via npm** — UGC Correspondent reference images (2.8 MB) and `help-page.html` (384 KB) live upstream only. See `assets/README.md`.
- **Parallel sub-agents inherit global model by default** — work around by setting `agent.<name>.model` explicitly in `opencode.json`.
- **External audit is Claude-Code-only** — by design. The cheap-generate + premium-audit split is the recommended architecture.
