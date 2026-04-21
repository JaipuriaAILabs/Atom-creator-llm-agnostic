---
name: atom-creator-visuals
description: Generate course images through a self-contained 6-phase pipeline — context load, philosophy gate, art direction brief, sample prompt, full prompt set, generation, audit. Invoke when the user says /visuals {slug} or as part of /assets. Dual format (v3 JSON for Gemini/NBP + natural language for SeedDream 4.5). Returns: 2 covers + 1 body image per story screen (5-10 total) in visuals/{slug}/.
license: MIT
recommendedAgent: visual-director
---

# Atom Creator — Generate Course Images

> Stage 4 has three parallel tracks: **visuals** + game + tool. This skill owns the visuals track.

**Purpose:** Generate course images through a self-contained 6-phase pipeline that moves visual creative direction AFTER course content exists. Produces 2 covers + 1 unique body image per story screen (typically 8-10 for CS; 3-8 for HO) with dual-format prompts: v3 JSON for Gemini/NBP + natural language for SeedDream 4.5.

**Image count is dynamic:** Count story screens (orient, bridge, contrast, artifact, framework, twist, expert_move, resolution, synthesis) from the course MD. No hardcoded "standard 5" or "storyboard 7-10" modes.

**Prerequisites:**
1. Spec: `courses/specs/{slug}-spec.md` (status `GENERATED — audit passed`, `REFINED — v{any}`, or `CREATED` with warning)
2. Course markdown at one of the two archetype paths

**Input:** `{slug}`

**Output:**
- `visuals/{slug}/art-direction.md` — visual philosophy, palette, style seed, composition plan
- `visuals/{slug}/prompts-nbp.md` — Gemini / Nano Banana Pro prompts (v3 JSON)
- `visuals/{slug}/prompts-seedream.md` — SeedDream 4.5 prompts (natural language, 30-100 words each)
- `visuals/{slug}/visual-0-cover.png` + `visual-0-cover-mobile.png` + `visual-{N}.png` — PNG images

---

## Pipeline Overview

| Phase | What | Gate | Output |
|---|---|---|---|
| 0 | Context Load | — | In-memory course context |
| 1 | Visual Philosophy Gate | **YES (HARD)** | Approved type + metaphor |
| 2 | Art Direction Brief | — | `art-direction.md` |
| 3 | Sample Prompt | **YES (HARD)** | 1 approved prompt (cover) |
| 4 | Full Prompt Set | — | `prompts-nbp.md` + `prompts-seedream.md` |
| 5 | Image Generation | — (optional auto) | PNG files |
| 6 | Visual Audit | — (auto) | VA1-VA10 report |

---

## Step 0: Argument Resolution + Environment Check

If no slug, Glob specs and ask. If `.atom-creator-config.json` missing, run `atom-creator-setup`.

## Step 1: Validate Prerequisites

1. Load `shared/handoff-protocol.md` + `shared/status-definitions.md`.
2. Locate spec. Verify status is `GENERATED — audit passed`, `CREATED`, or `REFINED — v{X.Y.Z}` (prefix match).
3. DRAFT → abort. APPROVED → abort. CREATED → warn inline, god-mode default: proceed.
4. Verify course MD exists at one of the two archetype paths.

## Step 1.5: Legacy & Refresh Detection

**Legacy spec:** grep for `## Art Direction Brief` in spec. If found, offer to adapt the legacy brief into `art-direction.md` format (skip Phase 1-2) OR generate fresh direction. God-mode default: generate fresh.

**Refresh:** check if `visuals/{slug}/prompts-nbp.md` or `prompts-seedream.md` already exists.
- Parse existing prompts: count body image prompts, extract screen references, entity labels
- Parse current course MD: count screens, extract screen types, entity names
- Diff and flag: SCREEN COUNT MISMATCH / ENTITY MISMATCH / MISSING SCREENS / EXTRA VISUALS
- Present refresh plan as a table. User approves which to keep / regenerate / remove.
- First-time generation: skip this step.

---

## Phase 0: Context Load

Read in parallel:
1. Spec — research findings, genre, company examples, glossary terms, archetype
2. Course markdown — full narrative content for image prompts
3. Course JSON — screen types and metadata
4. `courses/batch-diversity-log.md` — Visual & Game Assets table for accent color + background diversity

**Extract from spec:**
- Genre from `## Genre Direction`
- Archetype from `**Archetype:**`
- Research summary (company names, key stories, frameworks)
- Glossary terms

**Extract from course MD:**
- Total screen count
- Screen types per screen (orient, bridge, mcq, framework, interview, etc.)
- Company names and stories (which companies appear on which screens)
- Framework name and stages
- The most emotionally striking sentence per story screen (VD8 — this becomes the prompt seed)

---

## Phase 1: Visual Philosophy Gate (HARD)

Dispatch to the `visual-director` agent. Agent classifies visual type:

- **Company-Driven:** When one company dominates (60%+ narrative). Borrow design language. Near-logos (modify one structural element for legal defensibility). Variant: "Protagonist + Cameo Brand Colors" — protagonist brand recurs on every card, secondary brand colors activate only on cards those secondaries appear on.
- **Personality-Driven:** When anchored by a famous person. Distinctive silhouette (posture, clothing, accessories). Never a face.
- **Lateral:** Metaphorical subject with elevated treatment. 5-step lateral thinking process with 8 culture-agnostic principles.

Present classification for approval with Literal ↔ Lateral dial override option:

```
Visual Philosophy Classification

Proposed type: {Company-Driven | Personality-Driven | Lateral}
Rationale: {1-2 sentences}

Proposed metaphor (Lateral only): {metaphor}

Literal ↔ Lateral dial:
  1. Highly Literal (Brand-Protagonist)
  2. Balanced (Default)
  3. Highly Lateral

Reply:
  approve       — accept classification + metaphor
  dial: N       — shift literal/lateral dial
  swap: {type}  — override to different type
```

**God-mode default:** approve the highest-confidence classification. If 3+ story domains are present in the course, prefer moment-specific subjects per card bound by a shared STYLE SEED (not a single-domain metaphor).

## Phase 2: Art Direction Brief

Design the style seed. Write to `visuals/{slug}/art-direction.md`:

- **Background:** Pick from the batch diversity log's unused buckets. Default: deep charcoal ground (vivid saturated on dark = striking). Avoid warm sandstone defaults.
- **Accent color:** Borrow from the protagonist company's brand (Reddit = orange-red, Wall Street = navy, Cloudflare = orange). Lock it: no other warm accent once locked (gold / amber / silver alongside orange-red = banned).
- **Palette:** 5 colors total. Fresh per course — never carry over from previous. Check batch diversity log.
- **Style fusion:** "Flat editorial illustration with risograph grain texture, crisp vector edges, hard geometric shadows" (proven SeedDream formula — use exactly).
- **Chinese keywords (SeedDream precision):** `扁平插画` `高对比度` `Riso印刷` `极简主义` `戏剧性侧光` `电影感`
- **Composition plan:** Per-screen moment list (VD8 — emotional beat, not topic). Which frame carries which story moment.

**Type-specific directions:**

- **Geographic Art Heritage:** Research art movements of the geographic anchor (Mughal miniatures for North India, Warli for Maharashtra, Tanjore for South India). Translate technique without using proper nouns.
- **Multi-brand pop palettes:** HIGH SATURATION on bright backgrounds. Color = teaching vocabulary.
- **Luxury:** Luxury silhouettes ("luxury supercar", never just "car"). Shape communicates price tier.
- **Multi-industry:** Actual products (cars for automotive, laptops for tech, mannequins for fashion).
- **Persona-Driven 3 tiers minimum:** Proportions + accessories + clothing. Research outsider descriptions.

## Phase 3: Sample Prompt (HARD)

Generate 1 cover prompt first (cheapest cost to catch direction errors — $0.04 per SeedDream attempt).

Run `python3 visuals/generate_fal.py {slug} --sample` to produce 1 test image.

After generation, verify aspect ratio: `sips -g pixelWidth -g pixelHeight {path}`. Regenerate if wrong.

Print the sample image path + prompt used. Ask user inline:

```
Sample generated: visuals/{slug}/visual-0-cover.png
Prompt: "..."

Reply:
  approve          — proceed with full set (10-12 more images)
  regenerate       — same prompt, different seed
  regenerate: "..." — new prompt
  adjust: ...      — specific adjustment (color, composition, mood)
```

**God-mode default:** approve if aspect ratio is correct and no obvious art direction violations.

## Phase 4: Full Prompt Set

Generate prompts for every story screen. Write two files:

- `visuals/{slug}/prompts-nbp.md` — v3 JSON prompts for Gemini/NBP (FALLBACK ENGINE)
- `visuals/{slug}/prompts-seedream.md` — natural language prompts for SeedDream 4.5 (PRIMARY ENGINE)

**Prompt rules (both formats):**
- Every prompt begins from the most emotionally striking sentence of the target screen (VD8)
- ≤2000 chars per prompt
- **Edge-to-edge directive (MANDATORY):** "Image fills the entire canvas edge to edge with [bg-color] — no white borders, no white margins, no padding of any kind, no letterboxing"
- **No text / labels** unless taxonomic uppercase identifiers (single letters, numbers)
- **No fabricated sensory counts** — no "eleven messages", "12:19 PM Pacific Time", etc.

**SeedDream-specific rules:**
- **NO hex codes** — render as visible text. Use descriptive color names ("warm amber", "deep midnight navy").
- Single-object compositions preferred (1-2 objects).
- **No photorealism default** — include "no photorealism, no gradients, no soft shadows".
- **No proper nouns** — artist names become portrait subjects, not style cues.
- **No text-trigger words** — "stamp", "tag", "label", "sign" render garbled text. Use "seal impression", "geometric mark".
- **No genre words** — "noir", "thriller", "comic", "graphic novel" push toward cartoon / anime.
- **Gender-coding swaps** — "shawl-collar" → "V-neck pullover", "compact" → "adult male", "light-brown" → "brown", "wavy" → "short cropped".
- **Full character descriptors every prompt** — shortening to "a man in a suit" drops age rendering. Repeat full descriptor.
- **Indian architecture** — "courthouse" = Western. Specify "Mughal-style pointed arches, jali lattice, red sandstone".
- **Text removal** — use "No text, no titles, no labels, no letters, no numbers anywhere".
- **Abstract > literal** — geometric spaces, not scene objects. Monolithic walls, panels, cracks.
- **Environmental effects > object hybrids** — light contamination, shadow distortion, density changes (1 bird → 500 birds), NOT emoji-faced animals.
- **No action verbs** — cracking, toppling, exploding break immersion. Use density/scale changes.

**Moment-specific per card:** When course narrative spans multiple domains (control room + dashboard + desk + cards + cloud), use moment-specific subjects per card bound by a SHARED STYLE SEED (how it's rendered — palette + ink weight + render rules), not a single metaphor subject.

**Flashback register:** Use period PROPS (rotary-dial phone, CRT monitor, cassette recorder), NOT palette shift. Keep master palette constant. Bridge the protagonist's visual motif into flashback panels (e.g., Cloudflare cloud ON the 1999 CRT).

## Phase 5: Image Generation (Two-Tier Fallback)

**Primary:** SeedDream 4.5 via fal.ai.
```bash
python3 visuals/generate_fal.py {slug}
```
Cost: ~$0.04/image. Correct 4:3 / 3:4 aspect ratios. 11-image set: ~$0.44.

**Fallback:** Gemini Pro via the nano-banana-pro skill (`--model pro`).
Cost: ~$0.134/image. **WARNING:** Pro outputs 16:9 by default (needs crop); Flash outputs square 1024×1024 regardless of aspect config. Always verify with `sips` post-generation.

**After EVERY image:** verify aspect ratio.
```bash
sips -g pixelWidth -g pixelHeight visuals/{slug}/visual-{N}.png
```
Regenerate if wrong.

**Target aspects:**
- Body images: 4:3 landscape
- Desktop cover: 4:3 landscape → `visual-0-cover.png`
- Mobile cover: 3:4 portrait → `visual-0-cover-mobile.png` (SEPARATE composition, not a crop)

**White-bar fix for SeedDream:** Never say "split composition". Use "fills entire image edge to edge". Change seed (42 → 99) when artifact persists.

## Phase 6: Visual Audit (VA1-VA15)

Load `shared/visual-audit.md`. Run 15 audit checks, including:

- VA1: Text-free covers
- VA2: Palette consistency across set
- VA3: Spatial memory patterns (distinct spatial vocabulary per screen)
- VA4: No white-passing backgrounds (R,G,B all > #E0 = banned)
- VA5: Filename compliance (`visual-{N}.png`, no descriptive slugs)
- VA6: Correctness checkmarks use course accent color (not hardcoded green)
- VA7: Aspect ratio correct (4:3 body + desktop cover, 3:4 mobile cover)
- VA8: No text / labels / letters / numbers in images
- VA9: Cover matches body set style
- VA10: Edge-to-edge (no white borders/margins/letterboxing)
- VA11 (soft-warn): Filesize ≤ 4 MB (>4 MB often signals drift toward photorealism)
- VA12-VA15: Additional polish standards from `shared/visual-polish-standards.md`

Report PASS / WARN per check.

---

## Output Summary

```
## Visuals Generated

  Images: {N} (2 covers + {N-2} body) in visuals/{slug}/
  Prompts: prompts-seedream.md + prompts-nbp.md
  Art direction: art-direction.md
  Audit: {passes}/{total} VA checks PASS

  Cost: ~${cost} (SeedDream × {N} images)

  Next: /game {slug}   (generate interactive mini-game)
  Or:   review images in visuals/{slug}/ and adjust art direction
```

---

## Update Batch Diversity Log

After final approval, update `courses/batch-diversity-log.md` Visual & Game Assets table for this course: Accent, Accent2, Background, BG Type, Style Identity, Visual Language, Cover BG.

---

## Gotchas

- **Aspect ratio silent drop** — Gemini Pro drops `--aspect portrait` and returns 16:9. Always verify with `sips`.
- **White bars on SeedDream mobile covers** — say "edge to edge". Change seed if artifact persists.
- **Chinese keywords** — not optional for SeedDream precision. Without them, style drifts.
- **Hex codes in SeedDream prompts** — render as visible text. Use color names only.
- **Artist names in SeedDream** — become portrait subjects, not style cues. Describe technique instead.
- **Flashback via palette shift** — breaks set unity. Use period props, not palette.
- **Moment mismatch across the set** — index drift after restructure. Rebuild mapping by TITLE, not index.
- **Benchmark for quality:** the five warm-toned panels in `visuals/manager-custodian/visual-5.png` — this is the level of visual memorability to aim for.
