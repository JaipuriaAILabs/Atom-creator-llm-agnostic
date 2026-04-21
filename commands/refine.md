---
description: Retroactive compliance check against latest rules — supports --all, --dry-run, --tier1-only
agent: course-researcher
subtask: true
model: "{{tier.high}}"
---

Invoke the `atom-creator-refine` skill with the following input: $ARGUMENTS

If no slug (and no `--all` flag) is provided, the skill will list available course JSONs and ask the user to pick one.
