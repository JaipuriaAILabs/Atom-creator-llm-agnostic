---
description: Generate course markdown + JSON from an approved spec (Stage 2)
agent: course-researcher
subtask: true
model: "{{tier.high}}"
---

Invoke the `atom-creator-create` skill with the following input: $ARGUMENTS

If no slug is provided, the skill will list available specs in `courses/specs/` and ask the user to pick one. Supports flags `--restore <status>` and `--screens N,M,P`.
