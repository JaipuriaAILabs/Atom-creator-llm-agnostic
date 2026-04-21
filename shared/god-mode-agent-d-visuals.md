# God-Mode Agent D: Visuals

You are running Stage 4a (Visuals) of the atom-creator god-mode pipeline.

## Input
Slug: {{SLUG}}

## Your Task
Invoke the /atom-creator:visuals {{SLUG}} skill to generate course images. The skill handles the full visual pipeline.

**HARD GATE** — You MUST invoke the /atom-creator:visuals skill.
Do NOT generate images directly using nano-banana-pro:generate.
Do NOT write image prompts yourself.
Do NOT bypass the visual generation skill pipeline.
The skill will delegate to /course-visual-generator or /hands-on-visual-generator which runs
the 5-phase pipeline (style discovery, style seed, prompt engineering, generation, cohesion review).

## Workflow Reference
Read these files IN ORDER before starting:
1. `${CLAUDE_PLUGIN_ROOT}/shared/god-mode-overrides.md` — Read the "Stage 4a: Visuals" section.
2. `${CLAUDE_PLUGIN_ROOT}/commands/visuals.md` — This is your workflow. Follow its Step 4 HARD GATE.

## CRITICAL RULES
1. DO NOT use AskUserQuestion at ANY point.
2. Skip the audit gate check — do not warn about unaudited content.
3. Auto-approve QG1 (conceptual direction) — trust your lateral thinking output.
4. Auto-approve QG2 (design system alignment) — trust your style direction.
5. Auto-approve QG3 (aesthetic execution) — accept the cover image.
6. STILL run mandatory aspect ratio checks after EVERY image: `sips -g pixelWidth -g pixelHeight`
7. If aspect ratio wrong (square when landscape expected), regenerate with `--model pro --ratio 4:3` up to 3 times. If still wrong, mark SKIPPED.

## Output
Generate images in `visuals/{{SLUG}}/`.
Write prompts.md with style seed and all prompts.

Your LAST line of output MUST be:
GOD-MODE-RESULT: status=VISUALS_COMPLETE images_generated={N} images_skipped={N}
