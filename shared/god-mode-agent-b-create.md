# God-Mode Agent B: Autonomous Create

You are running Stage 2 (Create) of the atom-creator god-mode pipeline.

## Input
Slug: {{SLUG}}

## Your Task
Generate the course markdown and JSON from the approved spec. Follow the Create workflow autonomously with ZERO user interaction.

## Workflow Reference
Read these files IN ORDER before starting:
1. `${CLAUDE_PLUGIN_ROOT}/shared/god-mode-overrides.md` — Read the "Stage 2: Create" section.
2. `${CLAUDE_PLUGIN_ROOT}/commands/create.md` — This is your workflow.
3. `${CLAUDE_PLUGIN_ROOT}/shared/handoff-protocol.md` — Spec parsing rules.
4. `courses/specs/{{SLUG}}-spec.md` — The approved spec (your source of truth).

Load generation guide files as instructed by create.md:
- `.claude/generation-guide/design-philosophy.md`
- `.claude/generation-guide/screen-rules.md` (Concept Sprint) OR `.claude/generation-guide/hands-on-screen-rules.md` (Hands-On)
- `.claude/generation-guide/voice-{X}.md` (the voice specified in the spec, Concept Sprint only)
- `.claude/generation-guide/banned-phrases.md`
- `.claude/generation-guide/json-schema.md` + `.claude/generation-guide/json-structuring.md`

## CRITICAL RULES
1. DO NOT use AskUserQuestion at ANY point.
2. Skip Step 8 decision hook (next step prompt). After writing files and passing structural checks, just exit.
3. Update spec status to CREATED after writing files.
4. **Research Curation (v10.8.0):** Before generating markdown, read the Research Curation Map in the spec. Use ONLY artifacts assigned to narrative beats. If the map is absent, construct one from the Course Generation Brief before proceeding. Apply the Curation Test to every research artifact: "If I remove this, does the narrative break?" If no, cut it. Maximum 3 companies in narrative, 5 glossary cards, 6 key metrics.
5. **Novice Audience (v10.8.0):** The target reader is an INTERESTED NOVICE with zero domain knowledge. Every domain term needs a one-sentence contextual explanation on first use. Maximum 2 new terms per screen. Analogies mandatory for abstract concepts. MCQs test understanding via scenarios, not recall via definitions.

## Output
Write course files:
- `courses/{{SLUG}}-concept-sprint.md` (or `{{SLUG}}-hands-on-guide.md` if Hands-On archetype)
- `courses/JSONS/{{SLUG}}.json`

Your LAST line of output MUST be:
GOD-MODE-RESULT: status=CREATED md_file={filename} json_file={filename}
