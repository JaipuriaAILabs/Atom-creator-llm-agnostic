# Visual Audit — 15 Quality Checks (v7.4.0)

> **What this file covers:** 15 quality checks for visual prompts and generated images.
> **When to load:** During `:visuals` Phase 6 (Visual Audit), and by Agent 4 in `:audit` for visual pipeline integrity.
> **Archetype applicability:** Both Concept Sprint and Hands-On.
> **Version:** 7.4.0

---

## Summary Table

| ID | Check | Severity | Auto-fixable? | What it catches |
|----|-------|----------|---------------|-----------------|
| VA1 | Prompt self-containment | HARD | No | Cross-image references ("same as VISUAL 2") |
| VA2 | Prompt character count | HARD | No (requires rewrite) | Prompts exceeding 2000 chars |
| VA3 | v3 JSON format compliance (NBP only) | HARD | No | Plain-text prompts or missing JSON keys. SeedDream prompts exempt |
| VA4 | Image aspect ratio | HARD | No (requires regen) | Square images when landscape/portrait expected |
| VA5 | File naming convention | SOFT | Yes (rename) | Wrong naming pattern |
| VA6 | Visual-content alignment | HARD | No | Entity labels not matching course content |
| VA7 | Style seed consistency | HARD | No | Different style seeds across prompts |
| VA8 | Composition variety | SOFT | No | Same archetype or camera angle repeated |
| VA9 | Palette compliance | SOFT | No | Colors outside the defined 5-6 semantic palette |
| VA10 | Background ban + edge-to-edge | HARD | No | White-passing backgrounds OR white borders/margins/padding/letterboxing |
| VA11 | No explanatory labels | SOFT | No | Conceptual captions in prompts — only proper nouns allowed |
| VA12 | Consistent character | SOFT | No | Silhouette type changes between body images |
| VA13 | Film still test | SOFT | No | Prompt describes a diagram instead of a scene with figures |
| VA14 | No hex codes in prompt body | HARD | Yes (replace with color names) | Hex codes in scene descriptions that SeedDream renders as garbled text |
| VA15 | Character style consistency | SOFT | No | Character-as-concept element rendered in different style than the visual world |
| VA16 | Filesize vs flatness | SOFT | No | Image >4 MB may indicate photorealistic drift — inspect for stock-photo energy (v10.19.0) |
| VA17 | Novice-first text in images | HARD (when novice-on-stack) | No | Rendered specialized text (MCP, HTTP 402, GPTBot/1.0, Ed25519 etc.) in image when spec Audience Posture = novice-on-stack (v10.19.0) |

---

## Check Definitions

### VA1: Prompt Self-Containment (HARD)

Every prompt must be fully self-contained. Gemini processes each prompt independently with no memory of previous generations. Any cross-image reference causes the model to hallucinate the referenced element, producing inconsistent output.

**Scan each prompt section for these patterns (case-insensitive):**

```
same as (VISUAL|visual|image|cover|slot)\s*\d
(like|matching|identical to|mirrors?|echoes?|repeats?)\s*(VISUAL|visual|image|cover|slot)\s*\d
(see|refer to|from)\s*(VISUAL|visual|image|cover|slot)\s*\d
as in the (previous|earlier|first|second|third)\s*(image|visual|slot|cover)
reuse the .* from (VISUAL|visual|image|cover|slot)\s*\d
```

Also scan for implicit cross-references that assume shared context:
```
the same (background|palette|composition|layout|style|elements?)
(continuing|continued) from
(building on|extending) the
```

**Pass:** Zero matches across all prompt sections.

**Fail:** Any match. Report the offending prompt section number, the matched pattern, and the surrounding sentence.

**Why HARD:** Cross-references produce unpredictable output from Gemini. The model has no access to other prompts or previously generated images. Every reference to another visual is a hallucination seed.

**Fail example:** "Use the same warship silhouette as VISUAL 2, but rotated 90 degrees." — Gemini has no knowledge of VISUAL 2's warship. It will generate an arbitrary warship that does not match.

**Pass example:** "A single warship silhouette facing left, rendered in flat dark-gray geometry against a deep navy background (#1a1a2e). Hull shape: angular modern destroyer with a single radar mast." — Fully self-contained; Gemini can render this without any external context.

**Fix:** Inline the referenced element's full description into the prompt. Copy the relevant style seed, subject description, and composition details from the referenced prompt into the current one.

---

### VA2: Prompt Character Count (HARD)

Gemini API truncates prompts beyond ~2000 characters, silently dropping tail content. Truncated prompts lose composition instructions, constraint blocks, and palette specifications — the elements most likely to appear at the end.

**Process:**

1. For each prompt section in `prompts-nbp.md` (or `prompts.md` for legacy), extract the full prompt text (everything between the section heading and the next section heading or EOF).
2. Count characters (including whitespace and newlines within the prompt body, excluding the section heading itself).
3. Report per-prompt counts in a table.

**Thresholds:**
- 0-1800 chars: PASS
- 1801-2000 chars: WARN (approaching limit, log character count)
- 2001+ chars: FAIL

**Pass:** All prompts at or below 2000 characters.

**Fail:** Any prompt exceeding 2000 characters. Report the prompt section, character count, and how many characters over the limit.

**Why HARD:** Truncation is silent — there is no error from the API. The image simply misses whatever instructions were cut. This is the most common cause of "Gemini ignored my aspect ratio" and "Gemini ignored my palette" complaints.

**Fix:** Rewrite the prompt to fit within 2000 characters. Prioritize: (1) style seed, (2) subject description, (3) composition, (4) palette hex codes, (5) constraints. Cut redundant adjectives and merge overlapping instructions. Never cut the constraints block — move it earlier in the prompt if necessary.

---

### VA3: v3 JSON Format Compliance — NBP only (HARD)

NBP/Gemini prompts (`prompts-nbp.md`) must use the nested JSON prompt format (v3). The v3 format ensures consistent interpretation of scene, subject, composition, and palette instructions by Gemini Pro.

**SeedDream prompts (`prompts-seedream.md`) are EXEMPT from VA3.** SeedDream 4.5 performs best with natural language prose (30-100 words, subject-first ordering). Verify SeedDream prompts have: style/subject/setting/composition/constraints in flowing sentences, ≤2000 chars, and consistent style seed.

**Required top-level keys:**

```json
{
  "meta": {},
  "scene": {},
  "subject": {},
  "composition": {},
  "palette": {},
  "constraints": {}
}
```

**Required nested keys per section:**

| Section | Required keys | Optional keys |
|---------|--------------|---------------|
| `meta` | `quality`, `camera`, `lighting`, `render_style` | `mood`, `era` |
| `scene` | `environment`, `atmosphere`, `background` | `foreground`, `depth` |
| `subject` | `primary`, `action` | `secondary`, `scale`, `detail` |
| `composition` | `archetype`, `framing` | `rule_of_thirds`, `negative_space` |
| `palette` | `background`, `accent`, `secondary` | `content`, `failure`, `glow` |
| `constraints` | `no` (array of banned elements) | `text_register`, `aspect` |

**Process:**

1. For each prompt section, attempt to parse the prompt body as JSON.
2. If parsing fails, check whether the prompt is plain text (no `{` or `}` characters) — flag as FORMAT VIOLATION.
3. If JSON parses, verify all required top-level keys exist.
4. For each top-level key, verify all required nested keys exist.
5. Verify `constraints.no` is an array (not a string).

**Pass:** All prompts parse as valid JSON with all required keys present.

**Fail:** Any prompt that is plain text, has malformed JSON, or is missing required keys. Report the prompt section, the specific failure (parse error / missing key), and the key path.

**Why HARD:** Plain-text prompts produce significantly less consistent output from Gemini Pro. The structured format enables reliable camera angle, lighting, and palette control. Without it, Gemini defaults to its own aesthetic choices, breaking course-level visual coherence.

---

### VA4: Image Aspect Ratio (HARD)

Gemini silently ignores aspect ratio instructions in some configurations, defaulting to 1024x1024 (square). Every generated image must be verified post-generation.

**Process:**

For each PNG file in `visuals/{slug}/`, run:
```bash
sips -g pixelWidth -g pixelHeight visuals/{slug}/{filename}
```

**Expected ratios by file type:**

| File pattern | Expected | Width:Height relationship |
|-------------|----------|--------------------------|
| `visual-{N}.png` (body) | Landscape 4:3 | width > height |
| `visual-0-cover.png` (desktop cover) | Landscape 4:3 | width > height |
| `visual-0-cover-mobile.png` (mobile cover) | Portrait 3:4 | height > width |

**Tolerance:** Allow up to 5% deviation from the exact 4:3 or 3:4 ratio. The check is width-vs-height relationship, not exact pixel math.

**Pass:** Every file matches its expected orientation (landscape or portrait).

**Fail:** Any file where the orientation is wrong. Most common failure: body image or desktop cover is square (1024x1024) when landscape was requested. Report the filename, actual dimensions, and expected orientation.

**Why HARD:** Square images on a landscape slot look visually wrong in the app — they are either letter-boxed (wasting screen space) or cropped (losing composition). Mobile covers rendered landscape on a portrait slot break the entire card layout.

**Fix:** Regenerate the failing image with explicit `--ratio 4:3` (body/desktop cover) or `--ratio 3:4` (mobile cover) using Gemini Pro. Do not attempt to crop or resize — the composition was designed for the wrong frame.

---

### VA5: File Naming Convention (SOFT)

All image files must follow the unified naming convention. Legacy naming with descriptive slugs is deprecated.

**Expected patterns (regex):**

```
^visual-0-cover\.png$                    # Desktop cover
^visual-0-cover-mobile\.png$             # Mobile cover
^visual-[1-9][0-9]*\.png$               # Body images (visual-1.png through visual-N.png)
```

**Process:**

1. List all `.png` files in `visuals/{slug}/`.
2. Test each filename against the three patterns above.
3. Flag any file that does not match.

**Common violations:**
- `visual-3-warship-grid.png` — descriptive slug (deprecated)
- `Visual-1.png` — uppercase letter
- `cover.png` — missing the `visual-0-` prefix
- `visual-01.png` — zero-padded body number

**Pass:** Every PNG file matches one of the three expected patterns.

**Fail (SOFT):** Any file with a non-conforming name. Report the filename and suggest the corrected name.

**Auto-fix:** Rename the file on disk using `mv`. Map descriptive-slug names to their numeric equivalents based on the prompt order in `prompts-nbp.md`. Log each rename operation.

**Why SOFT:** Naming does not affect image quality or rendering. The app's `media_base` path resolution can handle either format. But inconsistent naming creates confusion when referencing images in JSON `media.src` fields and when running batch operations.

---

### VA6: Visual-Content Alignment (HARD)

Entity labels baked into images must reference entities that actually appear in the course content. A label reading "ENRON" on an image for a course that never mentions Enron is a factual error visible to every learner.

**Process:**

1. Parse each prompt's `subject` and `composition` sections for entity names — proper nouns, company names, framework terms, and any ALL-CAPS labels.
2. Extract the label list: collect all strings that appear as instructed text/labels in the prompt (typically in a `labels` or `text_register` field, or inline as quoted strings).
3. For each label, grep the course markdown (`courses/{slug}-concept-sprint.md` or `courses/{slug}-hands-on-guide.md`) for the entity.
4. Also check the spec (`courses/specs/{slug}-spec.md`) Research Summary section as a secondary source.

**Pass:** Every label in every prompt matches an entity found in the course markdown or spec.

**Fail:** Any label referencing an entity not found in either file. Report the prompt section, the offending label, and the grep result.

**Nuance:**
- Framework stage names are valid labels even if they appear only in the metadata block (e.g., "SHIELD" stages).
- Abbreviated forms are acceptable if the full form appears in the course (e.g., label "LTCM" when course mentions "Long-Term Capital Management").
- Generic architectural labels ("ZONE A", "LAYER 1") are exempt — they describe composition, not course entities.

**Why HARD:** Learners trust images as factual content. A mismatched entity label undermines credibility and creates confusion about what the course actually covers. This is especially critical for Hero Company Homage images where company-specific UI elements are the visual vocabulary.

---

### VA7: Style Seed Consistency (HARD)

The style seed is the primary mechanism for visual coherence across a course's image set. Every prompt must begin with the identical style seed paragraph. Any deviation causes style drift — one image looks like it belongs to a different course.

**Process:**

1. Extract the first continuous paragraph (before the JSON block) from each prompt section. This is the style seed.
2. Normalize whitespace (collapse multiple spaces, trim leading/trailing whitespace) for comparison.
3. Compare pairwise: every prompt's style seed must be character-identical to every other prompt's style seed after normalization.

**Pass:** All prompts share the identical style seed (post-normalization).

**Fail:** Any prompt whose style seed differs from the others. Report the deviating prompt section, highlight the specific character differences (use a diff), and show the expected seed.

**Edge case — covers:** The cover prompts may append additional cover-specific instructions AFTER the shared style seed (e.g., "Text-free composition" or "Central figure framing"). The shared seed portion must still be identical. Compare only the first N characters matching the shortest seed occurrence.

**Why HARD:** The style seed is prepended to every prompt specifically to ensure Gemini produces a visually cohesive set. Without it, each image is generated in isolation with no stylistic anchor. Even minor wording changes (e.g., "warm" vs. "golden" lighting) cause visible inconsistency in the output.

---

### VA8: Composition Variety (SOFT)

A course image set must feel like a curated gallery, not a repeated template. Same camera angle or same composition archetype across multiple images signals lazy prompt engineering.

**Process:**

1. Parse each prompt's JSON `meta.camera` value. Build a frequency table.
2. Parse each prompt's JSON `composition.archetype` value. Build a frequency table.
3. Check for repeats.

**Camera angle check:**
- Extract from `meta.camera` (e.g., "overhead", "eye-level", "macro", "isometric", "three-quarter", "front-facing").
- WARN if any two body image prompts share the exact same camera value.
- Cover prompts are exempt (covers often use "front-facing" or "central" by convention).

**Composition archetype check:**
- Extract from `composition.archetype` (e.g., "Central Figure", "Diagonal Division", "Depth Layers", "Geometric Hierarchy", "Side-by-Side", "Fragmentation", "Convergence", "Isolation", "Enclosure", "Perspective Shift").
- WARN if any two body image prompts share the exact same archetype.

**Pass:** No camera angle repeats AND no archetype repeats across body images.

**Warn:** Any repeated camera angle or archetype. Report which prompts share the value and suggest alternatives from the unused pool.

**Why SOFT:** Variety is a quality signal, not a correctness requirement. Two images with the same camera angle can still be visually distinct if subject and composition differ. But repeated patterns suggest the prompt set was not designed with intentional variation.

---

### VA9: Palette Compliance (SOFT)

Every course defines a semantic palette of 5-6 colors in its Art Direction Brief (spec) or `prompts-nbp.md` header. Prompts should reference only these defined colors to maintain visual coherence.

**Process:**

1. Extract the defined palette from the spec's Art Direction Brief (`## Art Direction Brief > Palette`) or from the `prompts-nbp.md` palette header section. Store as a set of hex codes (lowercase, 6-digit format).
2. Scan every prompt's `palette` JSON section. Extract all hex codes using the pattern: `#[0-9a-fA-F]{6}`.
3. Also scan `scene.background` and any inline hex references in `subject` or `composition` sections.
4. Compare each extracted hex against the defined palette set.

**Tolerance:** Allow hex codes that are within 10 units on each RGB channel of a defined palette color (accounts for intentional tinting for color arc progression — muted/emerging/vivid versions of the accent).

**Pass:** All hex codes in all prompts are within tolerance of a defined palette color.

**Warn:** Any hex code that does not match any defined palette color within tolerance. Report the prompt section, the offending hex, and the nearest palette color with the RGB distance.

**Exempt:** Pure black (`#000000`) and near-black values (`#0a0a0a`, `#1a1a1a`) used as base/outline colors. These are utility colors, not palette violations.

**Why SOFT:** Minor palette deviations (a slightly warmer gray, a desaturated accent for a muted hook image) can be intentional creative choices aligned with the color arc plan. The check surfaces unintentional drift — a random blue appearing in a coral-accented course — without blocking output.

---

### VA10: Background Ban (HARD)

The Rehearsal app renders on a white background. Any image with a white-passing background blends into the page, losing its visual boundary and looking unfinished.

**Process:**

1. For each prompt, extract the background color from `palette.background` or `scene.background`.
2. Parse the hex code into RGB components.
3. Test: are ALL THREE channels (R, G, B) greater than `#E0` (224 decimal)?

**Banned values (explicit blocklist):**
- `#ffffff` — pure white
- `#F5F0E8` — cream
- `#F0F0F0` — off-white
- `#FAFAFA` — near-white
- `#F5F5F5` — ghost white
- `#FFFAF0` — floral white
- `#FFF8F0` — warm white
- Any hex where `R > 224 AND G > 224 AND B > 224`

**Pass:** No prompt uses a banned or white-passing background hex.

**Fail:** Any prompt with a background hex that fails the RGB test or matches the blocklist. Report the prompt section, the offending hex, and its RGB values.

**Recommended alternatives for light courses:**
- Sand: `#E8DCC8` (R=232, G=220, B=200 — B is below 224)
- Warm gray: `#D8D4D0` (all channels below 224)
- Light teal tint: `#D0E8E4` (R below 224)
- Pale lavender: `#DDD8E8` (R and G below 224)

**Why HARD:** This is a rendering-environment constraint, not an aesthetic preference. White-passing images on a white page have no visual boundary. On bright or miscalibrated monitors, cream and off-white read as identical to the page background. The image appears "broken" or unfinished. This is consistently the most reported visual defect from user testing.

**Post-generation verification:** After images are generated, visually inspect each PNG's edge pixels. Gemini sometimes overrides the instructed background with white, especially on images with few foreground elements. If the generated image has a white-passing background despite the prompt specifying a colored one, regenerate.

**Edge-to-edge directive (v10.19.0):** every prompt must contain this defensive instruction against padding and letterboxing:

```
Image fills the entire canvas edge to edge with {background-color} — no white borders, no white margins, no padding of any kind, no letterboxing.
```

**Why:** SeedDream's training data biases toward centered poster compositions with uniform margins. Without the explicit directive, SeedDream frequently renders mobile-portrait covers with 10-30px white borders on one or both sides — a VA10 failure mode that looks like letterboxing. The directive suppresses this behavior. Observed 2026-04-20 in `founder-agent-readiness` mobile cover regeneration: initial prompt omitted edge-to-edge, image came back with visible white borders. Revised prompt with edge-to-edge directive: clean fill. 100% of 11-image regens after directive added respected edge-to-edge.

**Pass:** every prompt contains the edge-to-edge directive, and the referenced background color matches the prompt's palette background.

**Fail:** prompt is missing the directive OR the directive names a different color than the prompt's actual palette background (mismatch indicates copy-paste error across prompts).

---

### VA16: Filesize vs Flatness (SOFT — v10.19.0)

Flat editorial vector images land at 2-3 MB. Photorealistic drift shows up as 3.5-5.7 MB. Filesize is a reliable passive signal of style drift.

**Process:** for each generated PNG in `visuals/{slug}/*.png`, check filesize via `ls -la` or `stat`. Flag any image > 4 MB for visual inspection.

**What to look for in flagged images:**
- Photorealistic skin / fabric / wood textures that violate the flat-editorial-vector style seed.
- Soft gradient shadows (the style seed says hard-edged shadows or none).
- Stock-photo composition (realistic office, realistic studio, realistic street scene).
- Halftone grain overlays that weren't part of the style seed (halftone is only permitted when the style seed explicitly includes it).

**Pass:** all images < 4 MB, OR images > 4 MB inspected and confirmed intentional (e.g., dense compositions like Screen 1 of founder-agent-readiness at 5.3 MB is an intentionally dense library/podium scene).

**Fail (SOFT):** image > 4 MB with no style-seed justification for the density. Recommend regeneration with tightened "flat vector, hard edges, no photorealism, no gradients" language.

**Why SOFT:** filesize is an indicator, not a verdict. Some intentionally dense compositions legitimately exceed 4 MB. The check flags for human review, doesn't auto-reject.

**Session of origin:** `founder-agent-readiness` 2026-04-20. Screen 7 dropped from 5.7 MB (halftone-heavy sepia flashback version) to 3.5 MB on rework (period props in unified palette). Screen 11 dropped from 3.0 MB (photoreal home office) to 2.0 MB (flat graphic silhouette). Filesize correlated with style drift every time.

---

### VA17: Novice-First Text in Images (HARD when novice-on-stack — v10.19.0)

Extends P43/C72 novice-first discipline to image content. When the spec declares `Audience Posture: novice-on-stack`, no specialized vocabulary may appear as rendered text IN the image.

**Process:** for each prompt in `prompts-seedream.md` or `prompts-nbp.md`:

1. Check the spec for `Audience Posture:` — if not `novice-on-stack`, skip this check.
2. Grep the prompt body for rendered-text instructions like "label X as Y", "text reads Y", "sign says Y", or any on-image text placement that would render specialized vocabulary from the course.
3. Check the prompt's `constraints` array for "no text" / "no letters" / "no numbers" — if missing, flag as FAIL.
4. Check any instructed taxonomic labels: are they course vocabulary a novice would recognize (e.g., "SITE", "DOCS", "API" — the five-surface categories explicitly taught)? Or are they specialized acronyms (e.g., "MCP", "HTTP 402", "Ed25519", "GPTBot/1.0") that the novice-on-stack reader wouldn't parse without course prose support?

**Pass:** prompt either uses no on-image text at all OR only renders course-vocabulary labels the reader has been explicitly taught in the course body.

**Fail (HARD when novice-on-stack):** prompt instructs rendering of specialized acronyms/protocols/cryptographic primitives/emerging-term vocabulary in the image. Suggested fix: drop the text entirely and use brand-adjacent color-coded silhouettes instead (Anthropic = terra-cotta camera-rig; OpenAI = monochrome ink camera-rig; Google = sky-blue camera-rig).

**Why HARD:** the novice-first posture tries to give the reader a smooth entry into specialized vocabulary. If images preempt the prose by rendering "HTTP 402" as a visible sign before the course prose has unpacked it, the posture breaks — the reader encounters the term as decoration rather than as taught vocabulary.

**Exemption:** when `Audience Posture: domain-native`, this check does not apply. Domain-native audiences already know the terms; rendering them in images reinforces expert recognition.

---

### VA11: No Explanatory Labels (SOFT)

Prompts must not instruct conceptual captions or explanatory labels. These are words that explain the concept to the viewer instead of showing it through composition. Applies to both NBP and SeedDream prompts.

**BANNED label patterns:**
- Framework terms used as image text: VERTICAL, COMPOUND, HORIZONTAL, ADJACENT, NON-ADJACENT
- State descriptions: STAYS, LEAVES, LOCKED, UNLOCKED, BEFORE, AFTER
- Concept names: RARE SKILL, LEVERAGE, AUTONOMY, FLYWHEEL, INVERSION
- Any label that requires the viewer to know the course content to understand

**ALLOWED text in images:**
- Real-world proper nouns that exist outside the course: CIA, KGB, PEPSICO, LUBYANKA
- Even these should be used sparingly — prefer pure visual storytelling

**Check method:** Grep each prompt for uppercase multi-word phrases or quoted strings. Flag any that match the banned patterns above. Also flag any prompt that contains `"label"`, `"reading"`, or `"text"` instructions.

**Why this matters:** Labels convert film stills into infographics. The visual world must tell the story through composition (watchtower vs rooftop city), not through captioned diagrams. See `visual-philosophy.md` rule VS2.

---

### VA12: Consistent Character (SOFT)

All body images in a course must use the same silhouette figure type. The character defined in the Art Direction Brief is the reader's avatar throughout the course.

**Check method:** Extract the figure description from each body prompt. All must match the character established in the Art Direction Brief (e.g., "white trenchcoat silhouette"). Flag any prompt where the figure type changes — e.g., switches to an architectural form, a mannequin, a different clothing style, or an abstract shape.

**Common failure modes:**
- Prompt describes "a building that IS a person" → SeedDream renders a rock/mannequin, not the established character
- Prompt switches from "trenchcoat silhouette" to "geometric figure" mid-series
- Framework/flywheel images drop the character entirely in favor of abstract shapes

**Why this matters:** Character consistency creates series identity. The viewer should feel like they're following the same operative through different scenes — not looking at disconnected illustrations. See `visual-philosophy.md` rule VS4.

---

### VA13: Film Still Test (SOFT)

Each prompt must describe a **scene** (environment + figure + action/state), not a **diagram** (shapes + arrows + labels). The test: "Would this work as a frame from a movie?"

**Diagram signals (flag if present):**
- "arrows converge," "arrows connect," "arrows point"
- "cycle," "loop," "flow diagram," "chart"
- "arranged in a grid/matrix/table"
- "bars at different heights," "profile line"
- Prompt has no figure/character/silhouette — purely abstract shapes
- Prompt's primary subject is a framework rather than a person in an environment

**Film still signals (good):**
- A figure in an environment doing something or observing something
- Spatial relationships between architectural elements (watchtower vs city)
- Light and shadow creating mood (amber glow, dark corners)
- A moment frozen in time (figure walking through a checkpoint, studying a wall)

**Why this matters:** The cover creates an emotional promise. Body images that become diagrams break that promise. A plumber should feel like a spy looking at every image, not just the cover. See `visual-philosophy.md` rules VS1, VS3, VS5.

---

### VA14: No Hex Codes in Prompt Body (HARD)

Hex codes like `#FF3B30`, `#1D1D1F`, `#2D5016` in the scene description portion of prompts can be rendered as garbled text by SeedDream. Hex codes belong ONLY in the style seed (prepended paragraph) or in the art-direction.md palette table.

**Check method:** For each body prompt section (everything after the style seed), scan for the pattern `#[0-9a-fA-F]{3,8}`. The style seed paragraph itself is EXEMPT — hex codes there are acceptable because SeedDream uses them for color reference without rendering.

**Pass:** Zero hex codes found in any body prompt's scene description.

**Fail:** Any hex code in a scene description. Report the prompt section and the offending hex.

**Fix:** Replace hex codes with descriptive color names: "vivid hot coral" not "#FF3B30", "deep forest green" not "#2D5016", "warm saffron terracotta" not "#B5651D".

**Why HARD:** SeedDream attempts to render any text-like string. Hex codes produce garbled alphanumeric artifacts that are impossible to remove post-generation. See `visual-philosophy.md` SD1 extension.

---

### VA15: Character Style Consistency (SOFT)

When using Character-as-Concept (Principle 2), the character must be rendered in the SAME visual style as all other elements. A Warli course with stick-figure humans must have a stick-figure cobra. An iPod course with flat silhouettes must have flat geometric shapes.

**Check method:** Identify the art style from the style seed (e.g., "Warli folk art," "iPod silhouette"). For each body prompt, check that the character-as-concept element (cobra, puppet, etc.) includes explicit style-matching language. Flag any prompt where the character description uses words like "realistic," "detailed," "photographic," "rendered," "3D" that conflict with the established style.

**Pass:** Every character-as-concept description includes style-matching keywords consistent with the art direction.

**Warn:** Any character description that lacks explicit style-matching or uses conflicting descriptors.

**Why this matters:** A realistic cobra in a Warli world breaks immersion instantly — it looks like a photographic snake pasted into a folk painting. The character must feel native to the visual world. See `visual-philosophy.md` SD5.

---

## Execution Protocol

### When to run

| Trigger | Checks run | Input |
|---------|-----------|-------|
| `:visuals` Phase 4 (post-prompt, pre-generation) | VA1, VA2, VA3, VA6, VA7, VA8, VA9, VA10, VA11, VA12, VA13, VA14, VA15 | `prompts-nbp.md` + `prompts-seedream.md` |
| `:visuals` Phase 5b (post-generation batch audit) | VA4, VA5, VA10 (re-verify on pixels) | PNG files on disk |
| `:audit` Agent 4 Step 6 (visual pipeline integrity) | VA1, VA4, VA5, VA6, VA7 | `prompts-nbp.md` + PNG files |

### Severity handling

- **HARD failures** block the pipeline. Prompts must be corrected before generation (VA1-VA3, VA6-VA7, VA10). Images must be regenerated if they fail post-generation checks (VA4, VA10).
- **SOFT failures** are reported but do not block. They surface in the audit summary as recommendations. The user may choose to address them or accept the current state. VA11-VA13 are storytelling quality checks — they catch the difference between "technically valid" and "emotionally compelling."

### Output format

After running all applicable checks, output a summary:

```
VISUAL AUDIT SUMMARY
────────────────────
Prompts scanned: {N}
Images scanned: {N}

HARD checks:   {pass_count}/{total} passed
SOFT checks:   {pass_count}/{total} passed

Failures:
  VA{N} [{HARD/SOFT}] — {prompt/image}: {description}
  VA{N} [{HARD/SOFT}] — {prompt/image}: {description}

Warnings:
  VA{N} [SOFT] — {prompt/image}: {description}
```

If ALL checks pass:
```
Visual audit: all {N} prompts + {N} images clean
```
