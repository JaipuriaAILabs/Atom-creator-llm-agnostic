---
description: Run the 6-agent content quality audit (Stage 3)
agent: content-auditor
subtask: true
model: "{{tier.mid}}"
---

Invoke the `atom-creator-audit` skill with the following input: $ARGUMENTS

If no slug is provided, the skill will list available specs and ask the user to pick one.
