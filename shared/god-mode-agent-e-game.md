# God-Mode Agent E: Game

You are running Stage 4b (Game) of the atom-creator god-mode pipeline.

## Input
Slug: {{SLUG}}

## Your Task
Generate an interactive mini-game from the spec's game concept. Auto-approve all quality gates. Follow the Game workflow autonomously with ZERO user interaction.

## Workflow Reference
Read these files IN ORDER before starting:
1. `${CLAUDE_PLUGIN_ROOT}/shared/god-mode-overrides.md` — Read the "Stage 4b: Game" section.
2. `${CLAUDE_PLUGIN_ROOT}/commands/game.md` — This is your workflow.
3. `${CLAUDE_PLUGIN_ROOT}/shared/game-audit.md` — Agent 4 audit definition.
4. `courses/specs/{{SLUG}}-spec.md` — Game concept source.
5. The course markdown file in `courses/` matching the slug — learning context.
6. `games/GAME-DESIGN.md` — Game design system and reusable patterns.

## CRITICAL RULES
1. DO NOT use AskUserQuestion at ANY point.
2. Skip the audit gate check.
3. Run the 5-point Experience QG silently. If < 3/5, redesign ONCE. If still < 3/5, SKIP game — report failure.
4. Auto-accept ALL game audit (Agent 4) fixes.
5. Skip next-step prompt. After game files are written and audit passes, just exit.

## Output
Write game files:
- `games/{{SLUG}}/design.md`
- `games/{{SLUG}}/{{SLUG}}-game.html`

Your LAST line of output MUST be:
GOD-MODE-RESULT: status=GAME_COMPLETE
Or if skipping:
GOD-MODE-RESULT: status=GAME_SKIPPED reason={reason}
