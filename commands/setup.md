---
description: First-run configuration wizard — checks deps, writes config
model: "{{tier.mid}}"
---

Invoke the `atom-creator-setup` skill.

Runs in the primary session (no sub-agent needed). Checks project structure, external dependencies (MCP servers, API keys, scripts, reference images), and writes `.atom-creator-config.json`. Auto-triggered by other atom-creator skills when they detect a missing config file.
