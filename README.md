# atom-creator-llm-agnostic

LLM-agnostic OpenCode port of the `atom-creator` Claude Code plugin.
Run the same 6-stage course-generation pipeline with **Kimi K2.6, DeepSeek, GLM, or local Ollama** — at a fraction of the cost.

---

## Why this exists

- **Premium-AI credit burn is wasteful for bulk generation.** A 15-course batch on Claude Opus can burn through $80-200 of Max-plan credits. The same batch on Kimi K2.6 via OpenCode runs $5-15 end-to-end.
- **OpenCode is BYO-provider by design.** One line in `opencode.json` swaps Anthropic for Moonshot, DeepSeek, GLM, Groq, or a local Ollama model. No rate limits, no tier gates.
- **Cheap-generate + premium-audit is the right economic split.** Use a cheap model for bulk generation; reserve Claude Opus for the final `/external-atom-audit` quality gate where its judgment actually moves the needle.

This package is a **hard fork** of `atom-creator` that reuses its prompt IP (15 commands, 35 shared rules files, 13 validation scripts, 4 sub-agents, 3 bundled skills) but rebuilds the execution layer natively for OpenCode's skills + agents + TypeScript plugin extensibility.

---

## Quickstart

```bash
# 1. Install OpenCode if you don't have it: https://opencode.ai
# 2. In your course-gen workspace:
npx atom-creator-llm-agnostic install --project

# 3. Start OpenCode
opencode

# 4. Inside OpenCode:
> /plan senior leader KPI redesign for engineering VPs
> /create senior-leader-kpi-redesign
> /audit senior-leader-kpi-redesign
```

---

## Requirements

- **Node.js** `>= 18`
- **OpenCode** `>= 0.5` — [install guide](https://opencode.ai)
- **A model provider API key** — default is Moonshot (Kimi K2.6). Works with anything OpenCode supports: Anthropic, OpenAI, DeepSeek, GLM/Zhipu, Groq, OpenRouter, Ollama (local), etc.
- **Perplexity API key** (recommended) — required for web-verified factual audits. The project's `AGENTS.md` enforces this as non-negotiable.
- **fal.ai API key** (optional) — only if you use `/assets` or `/visuals` to generate course images with SeedDream.

---

## Command reference

| Command | What it does |
|---|---|
| `/plan <input>` | Research + skill extraction + genre selection → writes an APPROVED spec |
| `/create <slug>` | Generates course MD + JSON from an APPROVED spec |
| `/audit <slug>` | 6 parallel audit agents (MCQ, Interview, Surface, Data, Factual, Storytelling) + rectification |
| `/assets <slug>` | Generates visuals, game, and tool in parallel |
| `/visuals <slug>` | Standalone visual generation (SeedDream via fal.ai) |
| `/game <slug>` | Standalone game generation + quality audit |
| `/tool <slug>` | Standalone interactive tool generation |
| `/db-insert <slug>` | Writes Supabase SQL INSERT for `course_content` |
| `/refine <slug>` | Retroactive compliance refinement — checks existing courses against latest rules |
| `/final-audit <slug>` | External evaluator audit → SHIP-READY status |
| `/audit-story <slug>` | Standalone genre-aware narrative quality audit |
| `/ugc <slug>` | Correspondent-character UGC video prompts |
| `/setup` | First-run configuration wizard |
| `/help` | Command reference inside OpenCode |
| `/god-mode <input>` | Fully autonomous end-to-end — auto-resolves all decisions |

---

## How it works

Three cooperating layers, standard OpenCode extensibility:

```
┌────────────────────────────────────────────────────────┐
│  commands/*.md    thin slash-command shims             │
│      ↓ invoke                                          │
│  skills/*/SKILL.md    Agent Skills — prompt payload    │
│      ↓ delegate to                                     │
│  agents/*.md    sub-agents with model tier hints       │
│      ↓ write / validate through                        │
│  src/index.ts    TS plugin — 12 hooks + custom tools   │
│      ↓ load from                                       │
│  shared/*.md    35 rule files (verbatim from source)   │
│  scripts/*.sh   13 bash validators (unchanged)         │
└────────────────────────────────────────────────────────┘
```

- **Commands** are 5-line frontmatter shims that route to skills.
- **Skills** carry the multi-phase prompt logic (ported from `commands/*.md` in the CC plugin), loading `shared/` files progressively.
- **Agents** are sub-agent definitions — `course-researcher`, `content-auditor`, `structural-validator`, `visual-director` — with per-agent `model` and `temperature` in `opencode.json`.
- **The TypeScript plugin** ports the 12 bash hooks from the CC plugin to type-safe TS lifecycle hooks (`tool.execute.before/after`, `session.created`). Bun auto-installs it.

---

## Model configuration

`opencode.json` (written by the installer — edit to change tiers):

```json
{
  "plugin": ["atom-creator-llm-agnostic"],
  "model": "moonshot/kimi-k2.6",
  "agent": {
    "course-researcher":    { "model": "moonshot/kimi-k2.6-max" },
    "content-auditor":      { "model": "moonshot/kimi-k2.6" },
    "structural-validator": { "model": "moonshot/kimi-k2.6" },
    "visual-director":      { "model": "moonshot/kimi-k2.6-max" }
  },
  "mcp": {
    "perplexity": { "command": "npx", "args": ["-y", "@perplexity-ai/mcp-server"] }
  }
}
```

Swap providers by changing the `moonshot/...` prefix to `anthropic/claude-sonnet-4-5`, `deepseek/deepseek-chat`, `openrouter/z-ai/glm-4.6`, `ollama/qwen3:32b`, etc. See `docs/kimi-k2-setup.md` for step-by-step setup and alternative providers.

---

## Relationship to atom-creator (Claude Code plugin)

- The upstream [`atom-creator`](https://github.com/JaipuriaAILabs/atom-creator) CC plugin stays as the **premium Claude Code experience** — structured question panels, plan mode, full Opus-tier quality.
- This repo is the **LLM-agnostic sibling** for bulk/cheap generation on OpenCode.
- Both share the same `shared/*.md` rule corpus. When upstream rules change, this repo re-vendors a copy.
- **Recommended workflow:** generate batches on OpenCode + Kimi, run final `/external-atom-audit` on Claude Code. See `docs/migration-from-claude-code.md`.

---

## Limitations (UX downgrades vs Claude Code)

1. **No structured question panels.** Claude Code's `AskUserQuestion` tool renders a rich chooser UI. OpenCode has no equivalent, so the 14 creative decision points in `/plan` degrade to **god-mode defaults with `--flag` overrides**. You lose the crafting dialog; you keep the decision space.
2. **No plan mode at skill level.** CC's `EnterPlanMode` is not available to skills in OpenCode. The `:plan` skill writes the spec directly and asks for approval inline.
3. **Sub-agent parallelism inherits one model tier by default.** OpenCode's Task tool runs parallel agents, but the global `model` setting is the fallback. Work around by setting `agent.<name>.model` in `opencode.json` as shown above.
4. **Large binary assets not shipped via npm.** UGC Correspondent reference images (2.8 MB) and the 384 KB help-page.html live upstream. See `assets/README.md` if you need them.

---

## Contributing

Issues and PRs welcome at [JaipuriaAILabs/atom-creator-llm-agnostic](https://github.com/JaipuriaAILabs/atom-creator-llm-agnostic).

The prompt content (`shared/`, `templates/`, `scripts/`) is vendored from the upstream `atom-creator` repo — rule changes should land there first and propagate here via sync.

---

## License

MIT © 2026 Jaipuria AI Labs — see [LICENSE](./LICENSE).
