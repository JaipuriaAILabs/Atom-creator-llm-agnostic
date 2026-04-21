# Kimi K2.6 setup (and alternative providers)

This guide covers the recommended default stack (Moonshot + Kimi K2.6) and drop-in alternatives.

---

## 1. Get a Moonshot API key

1. Sign up at [platform.moonshot.ai](https://platform.moonshot.ai/).
2. Create an API key in the console — copy it somewhere safe.
3. Budget: Moonshot's free tier covers 1M tokens/day. Kimi K2.6 paid pricing is roughly **$0.15 per 1M input tokens / $2.50 per 1M output tokens** as of this writing. A full course (spec + create + audit) runs **30K-80K input + 8K-20K output tokens** → **$0.04-0.07 per course**. Even a full 15-course batch with audits stays under $2.

---

## 2. Configure `opencode.json`

The `npx @shivak11/atom-creator-llm-agnostic install` command writes the baseline for you. After running the installer, your `opencode.json` should look like:

```json
{
  "$schema": "https://opencode.ai/schema/config.json",
  "plugin": ["@shivak11/atom-creator-llm-agnostic"],
  "model": "moonshot/kimi-k2.6",
  "provider": {
    "moonshot": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.moonshot.ai/v1",
        "apiKey": "{env:MOONSHOT_API_KEY}"
      },
      "models": {
        "kimi-k2.6":     { "name": "Kimi K2.6" },
        "kimi-k2.6-max": { "name": "Kimi K2.6 Max" }
      }
    }
  },
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

The installer does not write the `provider` block (it varies by user) — add it manually the first time.

---

## 3. Per-agent model overrides

The tier strategy:

| Agent | Purpose | Recommended model | Why |
|---|---|---|---|
| `course-researcher` | Phase-2 research, skill extraction, spec craft | `kimi-k2.6-max` | Needs nuance, long context, structured thinking |
| `content-auditor` | 6 parallel audit passes | `kimi-k2.6` | Speed + throughput; findings are pattern-matched |
| `structural-validator` | C1-C60 deterministic checks | `kimi-k2.6` | Mostly structural; low-nuance |
| `visual-director` | Art direction briefs, visual-slot strategy | `kimi-k2.6-max` | Creative judgment, spatial reasoning |

Adjust in `agent.*.model`. Changes take effect on next session start.

---

## 4. Cost expectations

Ballpark per full course (plan + create + 6-agent audit, no assets):

| Stack | Cost/course | Cost for 15-course batch |
|---|---|---|
| Claude Code + Opus | $5 - $15 | $75 - $225 |
| Claude Code + Sonnet | $1 - $3 | $15 - $45 |
| **OpenCode + Kimi K2.6** | **$0.04 - $0.07** | **$0.60 - $1.10** |
| OpenCode + DeepSeek V3.5 | $0.05 - $0.10 | $0.75 - $1.50 |
| OpenCode + Ollama Qwen3:32b | $0 (local) | $0 (local) |

Quality differential: Kimi K2.6 produces structurally-correct JSON that passes C1-C60 reliably. Prose quality trails Opus by a visible notch on opening hooks and closing beats. The recommended workflow is: **bulk generate on Kimi → polish the 3-4 Flagship courses on Opus via the upstream Claude Code plugin**.

---

## 5. Troubleshooting

### Rate limits
Moonshot enforces per-minute token caps on free tier. If you hit them mid-batch, the 6-parallel-agent audit is the likely culprit — it fans out 6 concurrent requests.

**Fix:** drop to sequential audits temporarily:
```json
{ "agent": { "content-auditor": { "parallelism": 1 } } }
```

### Context length
Kimi K2.6 has a 200K token context. If `/create` on a 17-screen hands-on course overflows, split into two passes or switch that one agent to `claude-sonnet-4-5`.

### Chinese character support
Kimi natively handles Chinese prompt keywords (e.g. the SeedDream prompts-seedream.md uses `扁平插画`, `戏剧性侧光`). No encoding workaround needed.

### "model not found" error
Check exact model IDs at [platform.moonshot.ai/docs](https://platform.moonshot.ai/docs). Moonshot occasionally renames (`moonshot-v1-128k` became `kimi-k2`, etc.).

---

## 6. Alternative providers

### DeepSeek V3.5 — great throughput, cheap

```json
{
  "model": "deepseek/deepseek-chat",
  "provider": {
    "deepseek": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.deepseek.com/v1",
        "apiKey": "{env:DEEPSEEK_API_KEY}"
      },
      "models": {
        "deepseek-chat":     { "name": "DeepSeek V3.5" },
        "deepseek-reasoner": { "name": "DeepSeek R1" }
      }
    }
  }
}
```

Strengths: extremely cheap, good at structured output. Weakness: prose voice is drier than Kimi.

### GLM-4.6 / Zhipu via OpenRouter

```json
{
  "model": "openrouter/z-ai/glm-4.6",
  "provider": {
    "openrouter": {
      "npm": "@openrouter/ai-sdk-provider",
      "options": { "apiKey": "{env:OPENROUTER_API_KEY}" }
    }
  }
}
```

Strengths: excellent Chinese-English bilingual voice, strong narrative flair. Weakness: slower, more expensive than Kimi.

### Local Ollama (Qwen3, Llama 3.3, etc.)

Zero-cost option if you have a 32GB+ GPU or Apple Silicon M3+.

```json
{
  "model": "ollama/qwen3:32b",
  "provider": {
    "ollama": {
      "npm": "ollama-ai-provider",
      "options": { "baseURL": "http://localhost:11434/api" },
      "models": {
        "qwen3:32b":      { "name": "Qwen 3 32B" },
        "llama3.3:70b":   { "name": "Llama 3.3 70B" }
      }
    }
  }
}
```

Prerequisite: `brew install ollama && ollama pull qwen3:32b`. Expect 3-5x slower wall-clock but $0 cost. Structural output quality is acceptable for drafts; we still recommend premium-audit on Claude for final pass.

### Anthropic (for premium audits)

Even when cheap-generating, set the final audit to Opus for quality:

```json
{
  "agent": {
    "content-auditor": { "model": "anthropic/claude-opus-4.7" }
  }
}
```

This gives the cheap-generate / premium-audit split recommended in the master plan.
