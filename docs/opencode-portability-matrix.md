# OpenCode portability matrix

Feature-by-feature map: Claude Code `atom-creator` plugin → OpenCode `atom-creator-llm-agnostic`.

Net parity: **~85%**, with two explicit UX downgrades called out at the bottom.

---

## Core extensibility

| Feature | Claude Code | OpenCode | Notes |
|---|---|---|---|
| **Skills (Agent Skills spec)** | Native (`.claude/skills/` / plugin-bundled) | Native (`.opencode/skills/` or `~/.config/opencode/skills/`) | Identical SKILL.md format. All 15 commands ship as skills here. |
| **Slash commands** | Native (`.claude/commands/` + plugin `commands/`) | Native (`.opencode/commands/`) | Frontmatter differs slightly: OpenCode uses `agent:` + `subtask:` keys. 5-line shims invoke skills. |
| **Sub-agents** | Native (`.claude/agents/`) with per-agent `model: opus` | Native with `mode: subagent`, per-agent `model` via `opencode.json` | Per-agent model override works — set in `opencode.json` not frontmatter. |
| **TypeScript plugins** | Not supported (CC is markdown-only for plugins) | Native — npm package in `opencode.json`, 25+ lifecycle hooks | **Upgrade over CC.** 12 bash hooks port to type-safe TS here. |
| **Custom tools** | Via MCP only | Native via `tool()` helper with Zod schemas | Cleaner DX than MCP for simple wrappers. |
| **MCP servers** | Native | Native (configured in `opencode.json`) | Perplexity, Parallel Web, YouTube transports work unchanged. |

---

## Lifecycle hooks

| Hook | Claude Code | OpenCode | Port |
|---|---|---|---|
| `PostToolUse` (Write/Edit of *.json) | bash | `tool.execute.after` + path filter | 1:1 |
| `PostToolUse` (Write/Edit of *.sql) | bash | `tool.execute.after` + path filter | 1:1 |
| `PreToolUse` (Write specs/) | bash | `tool.execute.before` + path filter | 1:1 |
| `SessionStart` | Native | **NOT SUPPORTED** (open feature request) | Use `session.created` instead — but no context injection. |
| `UserPromptSubmit` | Native | `message.updated` (approximate) | Close-enough for most uses. |
| `SessionEnd` | Native | `session.idle` | 1:1 |
| `Stop` / interrupt | Native | `permission.asked` | 1:1 |

---

## Provider model

| Feature | Claude Code | OpenCode | Notes |
|---|---|---|---|
| **Provider** | Anthropic-only | BYO — Anthropic, OpenAI-compatible, Moonshot, DeepSeek, GLM, Ollama, anything | **Upgrade.** One-line swap in `opencode.json`. |
| **Per-agent model override** | Native (`model: opus` in agent frontmatter) | Native via `opencode.json` `agent.<name>.model` | Syntax moves from frontmatter to config. Skill/agent files stay provider-neutral. |
| **Model tier templating** | Not supported | `{{tier.high}}` / `{{tier.mid}}` resolves via config layer | **Upgrade.** Agents declare tier hints, users resolve. |

---

## Interactive UX

| Feature | Claude Code | OpenCode | Notes |
|---|---|---|---|
| **AskUserQuestion structured panels** | Native | **NOT SUPPORTED** | 🔻 **UX downgrade #1.** The 14 decision points in `/plan` degrade to inline markdown prompts or god-mode defaults. No native chooser UI. Workaround: `--flag` overrides + god-mode defaults. |
| **Plan mode / EnterPlanMode** | Native at any level | **NOT SUPPORTED** at skill level (agents have `mode: primary` vs `subagent` only) | 🔻 **UX downgrade #2.** The `/plan` skill writes the spec directly and asks for approval inline. |
| **Permission gating** | Native, coarse | Native, granular (glob patterns on bash, per-tool ask/allow/deny) | **Upgrade.** Better than CC — can gate `git push`, allow `grep *`, deny `rm`. |
| **Interactive forms** | Via AskUserQuestion | Inline markdown only | Downstream of UX #1. |

---

## Parallelism

| Feature | Claude Code | OpenCode | Notes |
|---|---|---|---|
| **Parallel sub-agents** | Task tool, per-agent `model: opus` override | Task tool, inherits global model by default | Per-agent `model` via `opencode.json` fixes this — but requires user config. 6-agent audit works identically once configured. |
| **Parallel tool calls** | Native in one message | Native | 1:1. |

---

## Distribution

| Feature | Claude Code | OpenCode | Notes |
|---|---|---|---|
| **Plugin distribution** | Claude plugin marketplace (JSON registry) | npm + `opencode.json` | **Upgrade.** `npx install` works out of the box. Anyone on Node can install without CC-specific tooling. |
| **Plugin versioning** | `plugin.json` + marketplace sync | `package.json` semver | Standard npm semantics. |

---

## Summary of downgrades

### 🔻 UX downgrade #1 — no structured question panels

The `/plan` skill's 14 creative decision points (genre selection, description taxonomy, blueprint mode, etc.) require structured choice UI in Claude Code. OpenCode has no equivalent.

**Mitigation:** god-mode-first flow with `--flag` overrides. The target audience for this port is batch-generating courses cheaply, not artisanal spec dialogue. If panels are re-implemented, it would be via a custom `tui.prompt.append` hook in the TS plugin (v1.1 polish pass).

### 🔻 UX downgrade #2 — no plan mode

Claude Code's `EnterPlanMode` / read-only-plan-first-write-later flow is not available to skills in OpenCode. Agent-level `mode: primary` vs `subagent` is the only distinction.

**Mitigation:** the `/plan` skill writes its research notes to `courses/specs/{slug}-spec.md` as `DRAFT` status, presents the spec inline, and asks for explicit "approve" confirmation before setting `APPROVED`. Equivalent safety, worse UX.

---

## What's not a downgrade (common misconceptions)

- **MCP:** Both CLIs support MCP identically. No port work.
- **Bash execution:** Both support it. OpenCode's permission model is actually better (glob patterns).
- **Hooks:** Port is a net upgrade — TS is type-safe, testable, and can throw structured errors. The bash originals stay under `scripts/` as reference.
- **Multi-modal:** Both handle images. Vision quality is provider-dependent, not CLI-dependent.
