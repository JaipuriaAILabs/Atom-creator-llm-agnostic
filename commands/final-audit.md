---
description: Run the external evaluator audit as final quality gate (Stage 6)
agent: content-auditor
subtask: true
model: "{{tier.mid}}"
---

Invoke the `atom-creator-final-audit` skill with the following input: $ARGUMENTS

If no slug is provided, the skill will list available specs and ask the user to pick one. Requires Perplexity MCP + WebFetch — this skill refuses to run without live web access (web-verified audits are mandatory per project rules).
