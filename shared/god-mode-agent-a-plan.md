# God-Mode Agent A: Autonomous Plan

You are running Stage 1 (Plan) of the atom-creator god-mode pipeline.

## User Input
{{USER_INPUT}}

## Your Task
Execute the full Plan workflow to produce an APPROVED course spec. You must complete ALL phases (0 through 5) autonomously with ZERO user interaction.

## Workflow Reference
Read these files IN ORDER before starting:
1. `${CLAUDE_PLUGIN_ROOT}/shared/god-mode-overrides.md` — Read the "Stage 1: Plan" section. These are your MANDATORY override rules.
2. `${CLAUDE_PLUGIN_ROOT}/commands/plan.md` — This is your workflow. Follow it phase by phase.
3. `${CLAUDE_PLUGIN_ROOT}/shared/spec-template.md` — Spec output format.

Load these when needed during execution:
- `${CLAUDE_PLUGIN_ROOT}/shared/decision-tables.md` — If archetype is Concept Sprint (15 decisions)
- `${CLAUDE_PLUGIN_ROOT}/shared/hands-on-decisions.md` — If archetype is Hands-On Guide (10 decisions)

DO NOT read `shared/review-panels.md` — review panels are SKIPPED in god-mode.

## CRITICAL RULES
1. DO NOT use AskUserQuestion at ANY point. Every decision point has an auto-resolution rule in god-mode-overrides.md.
2. Phase 0: Auto-infer Role/Industry/Level. Default Level="Mid-level" if unclear. Skip all confirmations.
3. Phase 0.7: Auto-detect archetype from research results (Concept Sprint if ambiguous).
4. Phase 1.3 (QG1): Pick the skill with the highest composite score (Signal x Differentiation x Urgency). Tiebreak: higher Differentiation.
5. Pre-Decision: Default to Framework-first + Professional. See overrides for Story-first escape hatch.
6. Phase 3: Follow Decision Logic Cheatsheet for all decisions. Tiebreak by batch variety (least-used option across last 4 courses).
7. Phase 4: SKIP review panels entirely. Phase 3 decisions are final.
8. **Story Compellingness Gate (v10.8.0):** After Phase 1.1 research completes, run the 5-signal test: (1) Irony/Paradox, (2) Named Protagonist Making a Decision, (3) Stakes with Numbers, (4) Contrast Pair, (5) "So What" for a Novice. If score is 1-2/5, STOP and present assessment to user via AskUserQuestion with options: different angle, different skill, proceed anyway. If 3-4/5, note weak signals in spec as "Narrative Risk." If 5/5, proceed. This is the ONE exception to the "no AskUserQuestion" rule in god-mode — a weak story must be flagged.
9. **Research Curation Map (v10.8.0):** After generating the Course Generation Brief, produce a Research Curation Map assigning each research artifact to a narrative beat. Mark remaining artifacts as "Background — not included." Maximum 3 primary companies, 5 active glossary terms, 6 key metrics.
10. **Novice Audience (v10.8.0):** The target audience is INTERESTED NOVICES with zero domain knowledge. Research should surface stories that would intrigue a non-expert. Apply the Delhi Dinner Table Test: would this story land at a dinner party where nobody works in this field?
8. QG2: Auto-approve. Set status to APPROVED. Write the spec file.

## Output
Write the approved spec to `courses/specs/{slug}-spec.md` with `Status: APPROVED`.
Your LAST line of output MUST be exactly this format (for the orchestrator to parse):
GOD-MODE-RESULT: slug={slug} archetype={concept_sprint|hands_on} skill={skill name}
