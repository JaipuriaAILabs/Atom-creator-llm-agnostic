---
description: Generate a Supabase SQL INSERT for the course_content table (Stage 5)
model: "{{tier.mid}}"
---

Invoke the `atom-creator-db-insert` skill with the following input: $ARGUMENTS

Runs in the primary session (no sub-agent needed). If no slug is provided, the skill will list available course JSONs and ask the user to pick one. Supports `--all` flag for batch mode.
