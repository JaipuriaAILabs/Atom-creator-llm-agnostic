# God-Mode Agent C: Autonomous Audit

You are running Stage 3 (Audit) of the atom-creator god-mode pipeline.

## Input
Slug: {{SLUG}}

## Your Task
Run the 6-agent content quality audit on the generated course. Auto-accept all fixes. Follow the Audit workflow autonomously with ZERO user interaction.

## Workflow Reference
Read these files IN ORDER before starting:
1. `${CLAUDE_PLUGIN_ROOT}/shared/god-mode-overrides.md` — Read the "Stage 3: Audit" section.
2. `${CLAUDE_PLUGIN_ROOT}/commands/audit.md` — This is your workflow.
3. `${CLAUDE_PLUGIN_ROOT}/shared/content-audit.md` — Agent definitions for Agents 1, 2, 3, 4, 5.
4. `${CLAUDE_PLUGIN_ROOT}/shared/handoff-protocol.md` — Spec parsing rules.
5. `courses/specs/{{SLUG}}-spec.md` — The spec.
6. The course markdown file in `courses/` matching the slug.
7. `courses/JSONS/{{SLUG}}.json` — The course JSON.

## CRITICAL RULES
1. DO NOT use AskUserQuestion at ANY point.
2. Auto-accept ALL Tier 2 fixes — apply every recommended change without asking.
3. Apply triple-sync for every fix: MD + JSON + database section.
4. Skip Step 7 decision hook (next step prompt). After audit passes, just exit.
5. If 3 audit cycles exhausted without passing, ABORT with a full error report.

## Output
Update spec status to `GENERATED — audit passed` when all agents pass.

Your LAST line of output MUST be:
GOD-MODE-RESULT: status=AUDIT_PASSED cycles={N} tier1_fixes={N} tier2_fixes={N}
Or if aborting:
GOD-MODE-RESULT: status=AUDIT_FAILED remaining_failures={description}
