# Structural Checks — C1 through C64

> **Loaded by:** `:create` (Step 6), `:refine` (Step 4)
> **Version:** 7.2.0
> **Total:** 64 universal + 5 hands-on + 9 blueprint = 78 checks

---

## Rule Authority Protocol — Threshold Registry

All numeric thresholds below are AUTHORITATIVE. Any other file that cites these values MUST reference this table, not hardcode its own numbers. If a threshold here changes, ALL downstream references are stale by definition.

| Parameter | Concept Sprint | Hands-On | Last Updated |
|-----------|---------------|----------|-------------|
| Screen count | 12-18 | 8-18 | v7.0.0 |
| MCQ count | Exactly 3 standalone (1 retention + 1 behavioral + 1 aptitude) | Exactly 3 standalone (1 retention + 1 behavioral + 1 aptitude) | v10.0.0 |
| Glossary terms | 5-7 | 0-7 | v7.0.0 |
| Max glossary cards | 5 | 5 | v7.0.0 |
| Company focus | see C12 | see C12 | v7.4.0 |
| Text block density cap | 75 words | 75 words | v6.5.0 |
| Narrative proportion | ≥55% | ≥55% | v7.0.0 |
| Interview word limit | 50 | 50 | v4.4.0 |
| Table column cap | 3 | 3 | v6.4.0 |

**Downstream files that reference these thresholds (must NOT hardcode):**
- `shared/content-audit.md` (Agent 4 Step 23)
- `shared/create-rules-cs.md` (Check Summary)
- `shared/create-rules-ho.md` (Check Summary)
- `commands/plan.md` (archetype selection)

---

## Category 1: Universal Checks (C1-C34) — Both Archetypes

These checks run for BOTH Concept Sprint and Hands-On courses. Some checks have archetype-specific variants noted inline.

### C1: File Existence
- **Severity:** HARD GATE
- **Archetype:** Both (path varies)
- **Inspect:** Filesystem — check for MD and JSON output files
- **Pass (CS):** `courses/{slug}-concept-sprint.md` exists AND `courses/JSONS/{slug}.json` exists
- **Pass (HO):** `courses/{slug}-hands-on-guide.md` exists AND `courses/JSONS/{slug}.json` exists
- **Fail message:** "C1 HARD GATE: Output file missing — {path} not found."
- **Fix tier:** None (generation failure — re-run `:create`)

### C2: JSON Parse
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** `courses/JSONS/{slug}.json` — attempt JSON.parse
- **Pass:** JSON parses without errors
- **Fail message:** "C2 HARD GATE: JSON parse error in {slug}.json — {error}."
- **Fix tier:** Tier 1 (auto-fix) — fix malformed JSON syntax

### C3: Cover Placement
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** `screens[0].type` in JSON
- **Pass:** `screens[0].type` is `"cover"` — cover is a screen, not metadata
- **Fail message:** "C3 HARD GATE: screens[0].type is '{actual}' — must be 'cover'. Cover is a screen object, not metadata."
- **Fix tier:** Tier 1 (auto-fix) — move cover data into screens[0] with type "cover"
- **Auto-fix:** Restructure JSON to place cover as first screen element

### C4: Cover Completeness
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** `screens[0]` object — check for required keys
- **Pass:** `screens[0]` has all of: `image`, `mobile_image`, `title`, `subtitle`, `description`
- **Fail message:** "C4 HARD GATE: Cover screen missing {key}. Required: image, mobile_image, title, subtitle, description."
- **Fix tier:** Tier 2 (user approval) — missing fields need content decisions
- **Related principle:** Cover Data Architecture convention

### C5: No metadata.cover
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** `metadata` object in JSON
- **Pass:** The `metadata` object does NOT contain a `cover` key
- **Fail message:** "C5 HARD GATE: metadata contains 'cover' key — cover data belongs in screens[0], not metadata."
- **Fix tier:** Tier 1 (auto-fix) — delete `metadata.cover`, ensure data is in `screens[0]`
- **Auto-fix:** Remove `cover` key from `metadata` object

### C6: Description Sync
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** `metadata.description` and `screens[0].description` in JSON
- **Pass:** `metadata.description` === `screens[0].description` (exact string match)
- **Fail message:** "C6 HARD GATE: Description mismatch — metadata.description ('{meta}') !== screens[0].description ('{cover}')."
- **Fix tier:** Tier 1 (auto-fix) — copy `metadata.description` to `screens[0].description`
- **Auto-fix:** Sync `screens[0].description` to match `metadata.description`

### C7: Story Screen Bottom Lines
- **Severity:** HARD GATE
- **Archetype:** Both (screen types vary)
- **Inspect (CS):** Every `orient`, `story_bridge`, `framework`, and `resolution` screen — check last non-blank line before `---`
- **Inspect (HO):** Every `concept`, `demo`, and `recap` screen — check last non-blank line before `---`. `try_it` screens ending with MCQ explanations are exempt. `tip` and `artifact` screens are exempt (they end with structured blocks)
- **Pass:** The last non-blank line before `---` matches `**...**` (bold closing line, 1-2 sentences)
- **Fail message:** "C7 HARD GATE: Screen {N} ({type}) does not end with a **bold closing line**. Last line: '{line}'."
- **Fix tier:** Tier 1 (auto-fix) — wrap last sentence in `**...**` or compose a bold closing line
- **Auto-fix:** Bold-wrap the final sentence or generate a punchy closing line
- **Related principle:** Thriller narrative rule 4

### C8: Triple-Repetition Scan
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** All content — scan for 3+ consecutive sentences OR clauses starting with the same word
- **Pass:** No triple-repetition patterns found. Catch both multi-sentence patterns ("Nobody X. Nobody Y. Nobody Z.") and single-sentence triples ("Same X, same Y, same Z")
- **Fail message:** "C8 HARD GATE: Triple repetition at Screen {N} — 3 consecutive sentences/clauses starting with '{word}'."
- **Fix tier:** Tier 1 (auto-fix) — rewrite to vary sentence openers
- **Auto-fix:** Restructure sentences to break repetition pattern
- **Watch words:** Same, Both, Not, No, Every, Each, Neither, None, They, This

### C9: Scene Entry Ban
- **Severity:** HARD GATE
- **Archetype:** Concept Sprint ONLY — skip for Hands-On (Hands-on courses use the Instructor voice with direct address, not scene-setting entries)
- **Inspect:** Grep MD story screens (not MCQ options, not interview questions, not blockquotes) for any `You are` pattern: `You are (sitting|standing|walking|reporting|managing|leading|heading|joining|the new|the only|an?)\b`
- **Pass:** No matches found on story screens (MCQ stems and interview cards are exempt)
- **Fail message:** "C9 HARD GATE: Screen {N} uses 'You are [role]' framing — ALL second-person role-play banned on story screens (v9.0.1). Rewrite in third-person journalism."
- **Fix tier:** Tier 1 (auto-fix) — rewrite to third-person narrative
- **Auto-fix:** Replace "You are [role/action]" with third-person equivalent ("The operations director..." not "You are the operations director...")

### C10: Self-Undermining Transitions
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Grep MD for "Everything so far", "Up to this point", "What we've covered so far"
- **Pass:** No matches found
- **Fail message:** "C10 HARD GATE: Screen {N} contains self-undermining transition '{phrase}' — these imply earlier content was incomplete."
- **Fix tier:** Tier 1 (auto-fix) — remove or rewrite the transition
- **Auto-fix:** Delete undermining phrase and bridge directly to new content

### C11: Meta-Narration Padding
- **Severity:** HARD GATE
- **Archetype:** Both (exception for Hands-On)
- **Inspect:** Grep MD for sentences opening with "Start with", "Let's look at", "Now consider", "Walk back to", "Begin with", "Let's turn to"
- **Pass (CS):** No matches found
- **Pass (HO):** No matches found EXCEPT "Let's" is permitted in the Instructor voice when followed by a concrete action (e.g., "Let's configure the webhook" is OK; "Let's look at the concept of webhooks" is NOT)
- **Fail message:** "C11 HARD GATE: Screen {N} opens with meta-narration '{phrase}' — jump directly into content."
- **Fix tier:** Tier 1 (auto-fix) — remove the meta-narration opener
- **Auto-fix:** Delete padding phrase and start with substantive content

### C12: Company Focus — Primary/Tertiary Classification (v7.4.0 upgrade)

**Severity:** Tiered (see below)
**Archetype:** Both
**Category:** Narrative Focus

Count distinct company names in narrative content. Classify each by depth:
- **Primary** (3+ screens with narrative detail — named people, specific metrics, decisions described): These are case study companies.
- **Secondary** (1-2 screens with some narrative detail — company named with specific data but not a sustained case study).
- **Tertiary** (mentioned once in passing, comparison, or list context — e.g., "like Uber, Airbnb, and Lyft").

**Pass conditions:**
- Primary companies ≤ 3: **HARD GATE**. More than 3 deep case studies fragments narrative focus.
- Primary + Secondary companies ≤ 5: **SOFT WARN**. Course may justify more with genre-specific needs.
- Tertiary mentions: no limit (passing references add texture without fragmenting focus).

**Genre override:** Industry Epic genre courses are EXEMPT from the Primary ≤ 3 HARD GATE — the genre structurally requires multi-company sweep (see IE1 in genre-system.md). Apply SOFT WARN at Primary ≤ 5 instead.

**Fail message (primary):** `"C12 HARD GATE: {count} primary case study companies (3+ screens each). Max 3 primaries for narrative focus. Companies: {list with screen counts}. Consolidate or relegate to secondary."`

**Fail message (secondary):** `"C12 WARN: {count} total companies with narrative detail (primary + secondary). Consider consolidating secondary companies into tertiary mentions."`

**Fix tier:** Tier 2 (user approval) — consolidating companies requires editorial judgment.

All non-tertiary companies must trace to the spec's Research Summary. Flag any Primary/Secondary company not in the Research Summary as HIGH: `"Case study company '{name}' not in spec research."` (unchanged from previous C12).

### C13: Stat Density
- **Severity:** SOFT WARN
- **Archetype:** Both
- **Inspect:** Count standalone statistics (number + % or currency symbol) per story/content screen
- **Pass:** No screen has more than 1 standalone statistic
- **Fail message:** "C13 WARN: Screen {N} has {count} standalone statistics — recommend max 1 per screen."
- **Fix tier:** None (warning only)

### C14: Glossary Count Per Screen (DEPRECATED)
- **Severity:** DEPRECATED — superseded by C46 (Glossary Per Card Limit)
- **Archetype:** Both
- **Note:** C14 previously enforced max 2 glossary terms per screen. v6.0 card architecture reduced this to max 1 via C46. C46 enforces exactly 1 glossary block per screen — no exceptions. C14 is no longer checked.

### C15: No Card/Screen References
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Grep learner-facing content (exclude metadata tables and summary sections) for "Card [0-9]", "Screen [0-9]", "from Card", "from Screen", "previous card", "next card"
- **Pass:** No matches found
- **Fail message:** "C15 HARD GATE: Screen {N} references card/screen numbers — '{match}'. Remove all meta-references."
- **Fix tier:** Tier 1 (auto-fix) — rewrite to remove card/screen references
- **Auto-fix:** Replace with content-aware transitions (e.g., "earlier" or "the X framework")

### C16: Card Heading Presence
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect (CS):** Every non-cover screen — check for H3 heading (`### `) as first non-blank line after `---` separator
- **Inspect (HO):** Every non-cover screen — ALL screen types including `try_it`, `intro`, `setup` get headings
- **Pass:** First non-blank content line matches `### ` pattern. No screen type is exempt — MCQ, aptitude, challenge screens get headings too
- **Fail message:** "C16 HARD GATE: Screen {N} ({type}) missing H3 heading as first content line."
- **Fix tier:** Tier 1 (auto-fix) — insert heading based on screen type
- **Auto-fix:** Generate contextual heading from screen content

### C17: No Glossary at Card Top
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Check if any screen body starts with a `>` blockquote as first content line
- **Pass:** First content line on every screen is narrative text, not a blockquote
- **Fail message:** "C17 HARD GATE: Screen {N} body starts with a blockquote — first content must be narrative text."
- **Fix tier:** Tier 1 (auto-fix) — move glossary blockquote after narrative paragraphs
- **Auto-fix:** Insert 2+ narrative sentences before the blockquote

### C18: Glossary Placement Distance
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** For each screen, check position of first glossary blockquote (`> **Term**`) relative to narrative paragraphs
- **Pass:** First glossary blockquote appears after at least 2 narrative paragraphs
- **Fail message:** "C18 HARD GATE: Screen {N} glossary blockquote appears after only {count} narrative paragraph(s) — need at least 2."
- **Fix tier:** Tier 1 (auto-fix) — add narrative paragraphs before glossary
- **Auto-fix:** Expand narrative context before the glossary term

### C19: Bridge Before MCQ
- **Severity:** HARD GATE
- **Archetype:** Both (variant for Hands-On)
- **Inspect (CS):** Check for narrative transition text between `---` and first `### Q` on every MCQ screen
- **Inspect (HO):** On `try_it` screens, narrative context (2-3 sentences) must precede the first MCQ. The bridge must reference the preceding `demo` screen's tool action — not just "try it yourself" or generic encouragement
- **Pass:** 2-3 sentence narrative bridge exists before every MCQ block. Zero cold jumps to quiz questions. Single-sentence bridges = FAIL
- **Fail message:** "C19 HARD GATE: Screen {N} has no narrative bridge before MCQ — cold jump to quiz question."
- **Fix tier:** Tier 1 (auto-fix) — generate bridge paragraph
- **Auto-fix:** Compose 2-3 sentence narrative transition referencing preceding content
- **Related principle:** P10

### C20: Factual Source Annotation
- **Severity:** SOFT WARN
- **Archetype:** Both
- **Inspect:** Scan for specific numeric claims (revenue, percentage, growth rate) paired with company names — check for source annotation in metadata or comments
- **Pass:** Every specific numeric + company claim has a source annotation
- **Fail message:** "C20 WARN: Screen {N} has unattributed numeric claim '{claim}' — add source annotation."
- **Fix tier:** None (warning only)

### C21: Story Card Images
- **Severity:** HARD GATE (for practice/glossary image violation) + SOFT WARN (for missing story image)
- **Archetype:** Both (variant for Hands-On)
- **Inspect (CS):** Every STORY card (orient, story_bridge, framework, terms_in_context, resolution, advanced_move) — check for `media` array. PRACTICE and GLOSSARY cards — check they do NOT have `media` arrays (Principle 25)
- **Inspect (HO):** `demo` screens have screenshot references (`media` field). AI-generated images on `intro`, `recap`, and optionally one mid-course screen. `try_it` screens with MCQs do NOT have images (Principle 25). `tip` and `artifact` screens may omit images
- **Pass (CS):** Every story card has at least one image reference in `media`. No practice/glossary card has `media`
- **Pass (HO):** `demo` screens have `media` references. No `try_it` screen with MCQs has `media`
- **Fail message (CS):** "C21 WARN: Story card Screen {N} ({type}) missing image." / "C21 HARD GATE: Practice/Glossary card Screen {N} has media array — remove it."
- **Fail message (HO):** "C21 WARN: demo screen {N} lacks a media reference."
- **Fix tier:** Tier 1 (auto-fix for media removal) / None (warning for missing images)
- **Related principle:** P25

### C22: Interview Isolation
- **Severity:** HARD GATE
- **Archetype:** Both (v6.4.2 update)
- **Inspect (CS):** Interview screen contains ONLY the interview block. No MCQs, no glossary, no reflection prompts on the same screen
- **Inspect (HO):** Interview screen REQUIRED (last screen for all archetypes). Uses standard 3-block structure ("The Real Question"). No guidance/hints/criteria visible on card. `guidance` field exists in JSON only for AI evaluation backend. No "Reflection Question" labels
- **Pass:** Interview screen has exactly the standard 3-block structure. No other block types present
- **Fail message:** "C22 HARD GATE: Interview screen {N} contains non-interview blocks — isolate interview to its own screen."
- **Fix tier:** Tier 2 (user approval) — decide where to move extra blocks
- **Related principle:** screen-rules.md interview rule

### C23: Narrative Framework Quality
- **Severity:** HARD GATE
- **Archetype:** Both (variant for Hands-On)
- **Inspect (CS):** Grep for colon-definition framework lists (e.g., "X: description"). Check for bare single-word screen endings. Check for reflection questions outside interview
- **Inspect (HO):** No colon-definition framework lists on `concept` screens — use narrative explanation. No bare single-word screen endings. No reflection questions (use MCQs on `try_it` screens instead)
- **Pass:** No colon-definition lists. No single-word screen endings. No reflection questions outside interview
- **Fail message:** "C23 HARD GATE: Screen {N} has colon-definition framework list / single-word ending / reflection question outside interview."
- **Fix tier:** Tier 1 (auto-fix) — rewrite colon lists as narrative, remove reflection questions
- **Auto-fix:** Convert "X: description" patterns to narrative prose
- **Related principle:** P2

### C24: Try-It Context Quality
- **Severity:** HARD GATE
- **Archetype:** Hands-On ONLY
- **Inspect:** Every `try_it` screen — check that it references the specific tool action from the preceding `demo` by name
- **Pass:** Each `try_it` screen names the specific tool action (e.g., "You just configured a webhook trigger" not "Now test what you learned"). Generic checkpoint language = FAIL
- **Fail message:** "C24 HARD GATE: try_it Screen {N} uses generic checkpoint language — must reference specific tool action from preceding demo."
- **Fix tier:** Tier 1 (auto-fix) — rewrite bridge to reference preceding demo action
- **Auto-fix:** Insert specific tool action reference from the preceding demo screen

### C25: Demo Step Clarity
- **Severity:** HARD GATE
- **Archetype:** Hands-On ONLY
- **Inspect:** Every `demo` screen — check for numbered steps (1. 2. 3.) with explicit tool actions
- **Pass:** Each demo screen contains numbered steps. Each step names the exact UI element, command, or action. Vague instructions ("configure the settings appropriately") = FAIL
- **Fail message:** "C25 HARD GATE: demo Screen {N} has vague step '{step}' — name the exact UI element, command, or action."
- **Fix tier:** Tier 2 (user approval) — requires domain knowledge to specify exact tool actions

### C26: JSON Key Ordering
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** In every non-cover story screen, check that `blocks` array appears before `media` array in JSON key order
- **Pass:** `blocks` (starting with heading) precedes `media` in every non-cover story screen. The app renders: heading (blocks[0]) → image (media[0]) → body (blocks[1..N]). If `media` precedes `blocks`, the title renders after the image — breaking TITLE → IMAGE → Body hierarchy
- **Fail message:** "C26 HARD GATE: Screen {N} has 'media' before 'blocks' in JSON — reorder to blocks-first for TITLE → IMAGE → Body render order."
- **Fix tier:** Tier 1 (auto-fix) — reorder JSON keys
- **Auto-fix:** Move `blocks` array before `media` array in screen JSON object
- **Related principle:** P16

### C27: Image Placement
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** All `media[].placement` values in JSON
- **Pass:** Every `media[].placement` value is `"hero"`. The `"above_content"` value is DEPRECATED
- **Fail message:** "C27 HARD GATE: Screen {N} has media placement '{value}' — must be 'hero'. 'above_content' is deprecated."
- **Fix tier:** Tier 1 (auto-fix) — replace placement value
- **Auto-fix:** Set `placement` to `"hero"` on all media items

### C28: Content Density
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Count block types per screen in JSON
- **Pass:** Max 2 MCQ blocks per screen. Max 1 glossary (with practice) per screen. Max 1 table per screen (tables + MCQs = split required)
- **Fail message:** "C28 HARD GATE: Screen {N} exceeds content density — {count} {type} blocks (max {max})."
- **Fix tier:** Tier 2 (user approval) — decide how to split content across screens
- **Related principle:** P17

### C29: Heading Block
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** First block in every non-cover screen in JSON
- **Pass:** First block is `{"type":"text","font":"heading"}`. No screen type is exempt (MCQ, aptitude, challenge screens get headings too)
- **Fail message:** "C29 HARD GATE: Screen {N} ({type}) first block is not a heading — must be {\"type\":\"text\",\"font\":\"heading\"}."
- **Fix tier:** Tier 1 (auto-fix) — insert heading block
- **Auto-fix:** Insert `{"type":"text","font":"heading","text":"..."}` as first block, deriving heading text from screen content

### C30: No Single-Word Text Blocks
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** All text blocks in JSON — check word count
- **Pass:** No text block contains ≤2 words as standalone content ("Drift.", "How?", "Why?")
- **Fail message:** "C30 HARD GATE: Screen {N} has a {count}-word standalone text block '{text}' — integrate into adjacent paragraph."
- **Fix tier:** Tier 1 (auto-fix) — merge into adjacent text block
- **Auto-fix:** Append or prepend the short text to the nearest body text block
- **Related principle:** banned-phrases.md Pattern #12

### C31: Interview Word Count
- **Severity:** HARD GATE (CS) / variant for HO
- **Archetype:** Both (variant for Hands-On)
- **Inspect (CS):** Count words in interview question text
- **Inspect (HO):** No `concept` or `intro` screen exceeds 350 words. WARN if average exceeds 180
- **Pass (CS):** Interview question ≤50 words
- **Pass (HO):** No narrative screen exceeds 350 words. Average ≤180 words
- **Fail message (CS):** "C31 HARD GATE: Interview question is {count} words — max 50."
- **Fail message (HO):** "C31 WARN: Narrative screen average is {avg} words — target ~150, warn at 180."
- **Fix tier:** Tier 1 (auto-fix for CS) — trim interview question / None (warning for HO)
- **Related principle:** P18

### C32: Interview Guidance
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Interview `guidance` field in JSON
- **Pass:** `guidance` field is a non-empty string with 3-5 evaluation criteria referencing specific course framework concepts. Empty string = FAIL
- **Fail message:** "C32 HARD GATE: Interview guidance field is empty or missing evaluation criteria."
- **Fix tier:** Tier 2 (user approval) — requires course-specific evaluation criteria

### C33: Narrative Screen Verbosity
- **Severity:** SOFT WARN (average) + HARD GATE (individual max)
- **Archetype:** Both (variant for Hands-On)
- **Inspect (CS):** Word count per narrative screen (orient, story_bridge, framework, resolution)
- **Inspect (HO):** Word count per `concept` or `intro` screen
- **Pass:** No narrative screen exceeds 350 words. Average across all narrative screens ~150 words
- **Fail message:** "C33 WARN: Narrative screen average is {avg} words — target ~150, warn at 180." / "C33 HARD GATE: Screen {N} ({type}) is {count} words — max 350."
- **Fix tier:** Tier 2 (user approval) — requires editorial judgment to cut content
- **Related principle:** P18

### C34: Glossary Practice Completeness
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Every `"type": "glossary"` block in JSON — check for `practice` object
- **Pass:** Every glossary block has a `practice` object containing: `question` (string, you/your framing), `options` (4-item string array, balanced lengths, NO A/B/C/D prefixes), `correct` (0-3 integer), `explain` (string)
- **Fail message:** "C34 HARD GATE: Glossary block on Screen {N} missing practice object (or practice is incomplete). Frontend renders glossary as learn+test cards — missing practice breaks rendering."
- **Fix tier:** Tier 1 (auto-fix) — generate practice question from glossary term
- **Auto-fix:** Compose question/options/correct/explain from the glossary definition

---

## Category 2: Blueprint Checks (C35-C43) — Blueprint Mode Only

Run ONLY when a blueprint exists in the spec file. Blueprint mode is an optional Phase 2.5 output from `:plan`.

### C35: Blueprint Screen Count
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Total screen count (excluding cover) vs blueprint `Total Screens`
- **Pass:** Actual screen count matches blueprint specification
- **Fail message:** "C35 HARD GATE: Screen count {actual} does not match blueprint Total Screens {expected}."
- **Fix tier:** Tier 2 (user approval) — adding/removing screens requires editorial decision

### C36: Blueprint Type Sequence
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Screen type sequence vs blueprint Screen Architecture table row-by-row
- **Pass:** Screen type sequence matches blueprint exactly
- **Fail message:** "C36 HARD GATE: Screen {N} type '{actual}' does not match blueprint '{expected}'."
- **Fix tier:** Tier 2 (user approval) — reordering screens requires narrative adjustment

### C37: Blueprint Bridge Presence
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Every screen with an interactive block (Retention, Applied, Current-Affairs, or preceding a Game position) — check preceding screen for narrative bridge
- **Pass:** A narrative segway bridge of 2-3 sentences exists on the preceding screen for every interactive block
- **Fail message:** "C37 HARD GATE: Screen {N} (interactive block) has no narrative bridge on preceding Screen {N-1}."
- **Fix tier:** Tier 1 (auto-fix) — generate bridge paragraph on preceding screen
- **Auto-fix:** Insert 2-3 sentence narrative bridge on the screen preceding the interactive block

### C38: Interactive Block Spacing
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Distance between interactive blocks (including game positions) in screen sequence
- **Pass:** 2+ narrative screens between any two interactive blocks
- **Fail message:** "C38 HARD GATE: Only {count} narrative screen(s) between interactive blocks at Screen {N} and Screen {M} — need 2+."
- **Fix tier:** Tier 2 (user approval) — requires inserting narrative screens or relocating interactive blocks

### C39: Interactive Block Window
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Count interactive blocks in any 5-screen sliding window
- **Pass:** Max 3 interactive blocks in any 5-screen window
- **Fail message:** "C39 HARD GATE: {count} interactive blocks in 5-screen window (Screens {start}-{end}) — max 3."
- **Fix tier:** Tier 2 (user approval) — requires redistributing interactive blocks

### C40: Retention Proximity
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Each Interview:Retention MCQ block — check what content it tests
- **Pass:** Each Retention MCQ tests content from the preceding 2-3 screens only
- **Fail message:** "C40 HARD GATE: Retention MCQ on Screen {N} tests content from Screen {M} — too far back (max 2-3 screens)."
- **Fix tier:** Tier 2 (user approval) — requires rewriting MCQ to test recent content

### C41: Applied Guidance
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Each Interview:Applied `text_question` block — check `guidance` field
- **Pass:** Non-empty `guidance` field with 3-5 evaluation criteria referencing specific course framework concepts
- **Fail message:** "C41 HARD GATE: Applied interview on Screen {N} has empty/insufficient guidance — need 3-5 evaluation criteria."
- **Fix tier:** Tier 2 (user approval) — requires domain-specific evaluation criteria

### C42: Current-Affairs Verifiability
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Each Interview:Current-Affairs `text_question` — check for real, verifiable event reference
- **Pass:** Each Current-Affairs question references a real, verifiable event
- **Fail message:** "C42 HARD GATE: Current-Affairs interview on Screen {N} does not reference a verifiable event."
- **Fix tier:** Tier 2 (user approval) — requires finding a real current event

### C43: Interactive Density
- **Severity:** HARD GATE
- **Archetype:** Both (blueprint mode)
- **Inspect:** Count all interactive blocks (Retention + Applied + Current-Affairs + Game positions) vs total screens
- **Pass:** Interactive blocks ≤ 40% of total screens
- **Fail message:** "C43 HARD GATE: Interactive blocks are {pct}% of total screens — max 40%."
- **Fix tier:** Tier 2 (user approval) — requires removing interactive blocks or adding narrative screens

---

## Category 3: Card Architecture Checks (C44-C58) — v6.0+ Rules

These checks enforce the v6.0 independent card type system and narrative structure. Run for BOTH archetypes.

### C44: Card Type Separation
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Each screen's `blocks` array — check if any screen contains both `"type": "mcq"` and `"type": "glossary"` blocks
- **Pass:** No screen has both MCQ and glossary blocks. MCQs go on PRACTICE cards, glossary goes on GLOSSARY cards. These are independent card types
- **Fail message:** "C44 HARD GATE: Screen {N} contains both MCQ and glossary blocks. Separate into independent cards."
- **Fix tier:** Tier 2 (user decides which block stays on this screen, other moves to new screen)
- **Related principle:** P19

### C45: Story-Exercise Rhythm
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Scan the `screens` array — identify exercise cards (screens containing `mcq` or `glossary` blocks) and check adjacency
- **Pass:** Every exercise card is preceded by a story card. No Glossary→Glossary, Glossary→Practice, Practice→Glossary, Practice→Practice adjacency. **NO EXCEPTIONS** (CS). Exception for HO: consecutive GLOSSARY cards earned by same story are OK
- **Fail message:** "C45 HARD GATE: Consecutive exercise cards at Screen {N} and Screen {N+1} — insert a story card between them."
- **Fix tier:** Tier 2 (user approval) — requires inserting a story screen or reordering
- **Related principle:** P19

### C46: One Glossary Per Card
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Every screen containing a `glossary` block — count glossary blocks on that screen
- **Pass:** EXACTLY 1 glossary block per `terms_in_context` screen. Never 2 or more.
- **Fail message:** "C46 HARD GATE: Screen {N} has {count} glossary blocks — must be exactly 1. The frontend renderer expects a single glossary learn-test card per screen — multiple glossary blocks cause the second term to be silently dropped. Split into separate glossary cards."
- **Fix tier:** Tier 1 (auto-fix) — split into N separate `terms_in_context` screens, one per glossary block. Each new screen gets: heading block ("Remember This Term"), bridge text block, and the single glossary block (with its practice object). Renumber all subsequent screen indices.
- **Auto-fix:** Create new screen for each extra glossary block beyond 1, inserting after the current screen
- **Note:** Supersedes deprecated C14. If 2 terms are conceptually related and earned by the same story beat, they still get SEPARATE screens. For Concept Sprint, consecutive glossary screens are prohibited by C45 — insert a story card between them. For Hands-On, consecutive glossary screens earned by the same story beat are permitted by C45.

### C47: Standardized Practice + Glossary Titles
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Heading text on every screen containing `mcq` or `glossary` blocks
- **Pass:** MCQ screens have heading matching: "Test Your Instinct". Glossary screens have heading "Remember This Term". No narrative headings on exercise screens
- **Fail message:** "C47 HARD GATE: Screen {N} ({card_type}) has non-standard heading '{heading}' — must be one of the standardized titles."
- **Fix tier:** Tier 1 (auto-fix) — replace heading text
- **Auto-fix:** Replace heading with appropriate standardized title based on card type (MCQ → "Test Your Instinct", Glossary → "Remember This Term")
- **Related principle:** P20

### C48: No A/B/C/D Labels
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Grep all `options` arrays in `mcq` and glossary `practice` blocks — check each option string
- **Pass:** No option string starts with a letter prefix pattern (`^[A-D][).\s]` or `^[A-D]\s`). Plain text only
- **Fail message:** "C48 HARD GATE: Screen {N} MCQ/practice option starts with letter prefix '{prefix}' — remove A/B/C/D labels."
- **Fix tier:** Tier 1 (auto-fix) — strip prefix
- **Auto-fix:** Remove letter prefix pattern from the beginning of each option string
- **Related principle:** P21

### C49: Practice/Glossary No Images
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Screens containing `mcq` or `glossary` blocks — check for `media` array
- **Pass:** No screen with `mcq` or `glossary` blocks has a `media` array. Only story cards get hero images
- **Fail message:** "C49 HARD GATE: Screen {N} ({card_type}) has media array — only story cards get images. Remove media."
- **Fix tier:** Tier 1 (auto-fix) — delete `media` array from the screen
- **Auto-fix:** Remove the `media` key and its value from the screen JSON object
- **Related principle:** P25

### C50: Standard Interview Card
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** The interview screen — check for standard 3-block structure
- **Pass:** Interview screen uses: (1) heading "The Real Question", (2) motivational text block, (3) interview block with standard `topics`. No custom question text. No `**Guidance:**` section, no hints, no evaluation criteria in the MD. The `guidance` field exists in JSON only
- **Fail message:** "C50 HARD GATE: Interview screen does not use standard 3-block structure ('The Real Question' heading + motivational text + interview block with standard topics)."
- **Fix tier:** Tier 1 (auto-fix) — restructure to standard format
- **Auto-fix:** Replace interview screen content with standard 3-block structure, moving any guidance text to the JSON-only `guidance` field

### C51: No Whole-String Markdown Bold
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Grep all `"text"` values in the JSON `blocks` array. Check if any text value starts AND ends with `**` (full-string wrap). Pattern: `"text": "**[^"]*\*\*"`
- **Pass:** No text value has full-string `**...**` wrap. Inline term bold mid-sentence is fine (e.g., `"called **legend depth** — the compound effect"` passes). Full-string wrap (e.g., `"**The entire bottom line sentence.**"`) triggers pull-quote rendering in the frontend — oversized font, bordered box, not intended bold
- **Fail message:** "C51 HARD GATE: Screen {N} text block has whole-string markdown bold — triggers pull-quote rendering. Strip ** and use bold:true if needed."
- **Fix tier:** Tier 1 (auto-fix) — strip bold markers, add property
- **Auto-fix:** Strip `**` prefix and suffix from the text value; ensure block has `"bold": true` if it is a closing bottom-line sentence
- **Related principle:** P26, inline validation V8

### C52: Voice Interview Block
- **Severity:** HARD GATE
- **Archetype:** Both (mandatory for ALL course types)
- **Inspect (CS):** The last screen must have `type: "interview"`. Its blocks array must contain `"type": "interview"` (voice recording), NOT `"type": "text_question"` (text-only)
- **Inspect (HO):** The course MUST contain an `interview`-type screen as the last screen. Its blocks array MUST contain `"type": "interview"` (voice recording block), NOT `"type": "text_question"`. Same requirements as CS
- **Pass:** Last screen is interview type. Contains standard 3-block structure: (1) heading "The Real Question", (2) motivational text block, (3) interview block with `"type": "interview"` (voice recording). Voice interview requires: `name` (skill name string), `topics` (standard text array — not custom question), `scores` (array of 3 objects with `"label"` and `"score": 0`), `feedback` (AI feedback template), `guidance` (3-5 evaluation criteria referencing course framework concepts). Interview is mandatory for ALL course types
- **Fail message:** "C52 HARD GATE: Last screen must be voice interview (type: 'interview' block), not text_question. Voice interview requires name, topics, scores, feedback, guidance fields."
- **Fix tier:** None (detection only — structural issue requires rebuild of the interview screen with correct block type and all required fields)
- **Related principle:** screen-rules.md INTERVIEW section, content-audit.md Agent 2

### C53: Table Rendering Gate (3-column hard cap)
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** All `"type": "table"` blocks in JSON — check `headers` array length, row count, and spec `Artifact Rendering` field
- **Pass:** Four sub-checks:
  - **(a) Hard cap (always):** No table block has more than 3 entries in its `headers` array
  - **(b) Spec gate (when `Artifact Rendering` field exists):** If spec says `Narrative` → no `"type": "table"` blocks exist. If spec says `Table (NxM)` → a table block exists and column count matches spec
  - **(c) Row count:** No table has >8 rows. WARN if >6 rows
  - **(d) Legacy (no `Artifact Rendering` field):** Skip spec gate check, but 3-column hard cap still enforced
- **Fail message (a):** "C53 HARD GATE: Table on Screen {N} has {C} columns — hard cap is 3 (Principle 27). Restructure as narrative or reduce columns."
- **Fail message (b-narrative):** "C53 HARD GATE: Spec mandates Narrative rendering but Screen {N} contains a table block. Convert table data to prose."
- **Fail message (c):** "C53 HARD GATE: Table on Screen {N} has {R} rows — max 8 for mobile scroll." / "C53 WARN: Table on Screen {N} has {R} rows — recommend max 6."
- **Fix tier:** Tier 2 (user approval) — restructuring tables requires editorial judgment on what to narrativize vs keep tabular
- **Related principle:** P27

### C54: Text Block Density (75-word hard cap)
- **Severity:** HARD GATE (>75 words) + SOFT WARN (>60 words)
- **Archetype:** Both
- **Inspect:** Every screen — scan all `"type": "text"` blocks with `"font": "body"` — count words
- **Pass:** No body text block exceeds 75 words. Warn at 60+ words
- **Fail message:** "C54 HARD GATE: Screen {N} has a {W}-word text block — split at sentence boundaries and rewrite for coherence (Principle 28)." / "C54 WARN: Screen {N} has a {W}-word text block — consider splitting (target 20-50 words)."
- **Exempt:** Blocks with `"bold": true` (closing lines). Blocks on screens containing `mcq` or `glossary` blocks (exercise card bridges). For Hands-On: also exempt text blocks containing numbered step patterns (`1. `, `2. `, `3. `) on `demo` screens
- **Fix tier:** Tier 1 (auto-fix) — split at sentence boundaries
- **Auto-fix:** Split block at sentence boundary into two blocks, rewriting each for standalone coherence (no orphaned examples or dangling pronouns)
- **Related principle:** P28A

### C55: Story Screen Minimum Body Blocks
- **Severity:** SOFT WARN
- **Archetype:** Both (screen types vary)
- **Inspect (CS):** Story screens (orient, framework, resolution, deepen, advanced_move, terms_in_context) — count body text blocks (`"type": "text", "font": "body"`)
- **Inspect (HO):** Story screens (intro, concept, recap) — count body text blocks. All other screen types (demo, try_it, tip, setup, artifact) are exempt
- **Pass:** 3+ body text blocks per story screen
- **Fail message:** "C55 WARN: Screen {N} ({type}) has only {count} body text blocks — story screens should have 3+ paragraphs for readable density."
- **Fix tier:** Tier 2 (user approval) — expanding content requires editorial judgment
- **Note:** Bridge screens, exercise screens (mcq, glossary, interview), and HO types (demo, try_it, tip, setup, artifact) are EXEMPT

### C56: Readability Engagement Checks
- **Severity:** SOFT WARN (all sub-checks)
- **Archetype:** Both (screen types vary)
- **Inspect (CS):** Story screens: orient, story_bridge, framework, resolution, deepen, advanced_move, terms_in_context
- **Inspect (HO):** Story screens: intro, concept
- **Sub-checks:**

#### C56a: Opener Repetition
- **Inspect:** First word of each body text block on the screen (case-insensitive)
- **Pass:** No two consecutive body blocks start with the same word
- **Fail message:** "C56a WARN: Screen {N} has consecutive blocks both starting with '{word}' — vary openers (Principle 28D)."
- **Fix tier:** Tier 1 (auto-fix) — rewrite opener of second block
- **Auto-fix:** Restructure the second block's opening to use a different word

#### C56b: Rhythm Monotony
- **Inspect:** Word counts for all body text blocks on the screen. Calculate standard deviation if 4+ body blocks
- **Pass:** Standard deviation > 8 across body block word counts
- **Fail message:** "C56b WARN: Screen {N} body blocks are uniformly {avg}±{stddev} words — vary between punch (5-15w), medium (20-40w), and detail (40-60w) (Principle 28B)."
- **Fix tier:** Tier 2 (user approval) — requires creative rewriting for rhythm variation

#### C56c: Punch Block Presence
- **Inspect:** For screens with 4+ body blocks, check if any body block is ≤15 words
- **Pass:** At least one body block is ≤15 words (a dramatic beat, not just a heading)
- **Fail message:** "C56c WARN: Screen {N} has {count} body blocks but no punch block (≤15 words) — add a dramatic beat (Principle 28C)."
- **Fix tier:** Tier 2 (user approval) — requires identifying the right dramatic moment to compress

### C57: Narrative Proportion
- **Severity:** SOFT WARN
- **Archetype:** Both (screen types vary)
- **Inspect:** Count screens by type. Story types: orient, story_bridge, framework, resolution, advanced_move, terms_in_context, deepen — any screen where the primary content block is narrative prose. Non-story types: glossary, practice (MCQ-only), interview
- **Pass:** Story-type screens ≥ 55% of total screens (excluding cover)
- **Fail message:** "C57 WARN: Course has {X}% narrative proportion (target ≥55%). Consider reducing glossary/practice screens or combining glossary terms."
- **Fix tier:** Tier 2 (user approval) — requires editorial judgment on which exercise screens to merge or cut
- **Note:** Courses at 50-55% may pass with justification. This is a SOFT warning — not blocking

### C58: Midpoint Story Card
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Identify the screen at position ceil(total_screens / 2) (excluding cover). Check its type
- **Pass:** The midpoint screen is a story-type card (orient, story_bridge, framework, resolution, advanced_move, deepen, terms_in_context). A glossary, practice, or interview card at the midpoint position is a HARD FAIL
- **Fail message:** "C58 HARD GATE: Midpoint screen (Screen {N}) is type '{type}' — must be a story card. Engagement follows a U-curve; the midpoint is the attention trough and must deliver narrative payoff, not mechanical testing."
- **Fix tier:** Tier 2 (user approval) — requires reordering screens to place a story card at the midpoint
- **Note:** Rationale: engagement follows a U-curve; the midpoint is the attention trough and must deliver narrative payoff, not mechanical testing

### C59: Genre Consistency
- **Severity:** SOFT WARN
- **Archetype:** Both (Concept Sprint primarily; Hands-On if genre field present)
- **Inspect:** If the spec contains `## Genre Direction`, verify the generated course content matches the declared genre's opening template and pacing expectations. Specifically: (1) Screen 1 follows the genre's opening template, (2) framework placement matches the genre's expected position (Literary Journalism = after midpoint, Behavioral Science = by Screen 2), (3) no genre DO NOT violations. If spec has no genre field (legacy), SKIP this check. See `generation-guide/genre-system.md` for genre definitions and templates.
- **Pass:** Screen 1 matches the genre opening template AND framework placement matches genre expectations AND no genre DO NOT violations
- **Fail message:** "C59 WARN: Genre consistency issue — {specific violation}. See genre-system.md for {genre} requirements."
- **Fix tier:** Tier 2 (user approval) — genre compliance requires editorial judgment on narrative structure
- **Note:** Legacy courses without a `## Genre Direction` section in the spec are EXEMPT — this check is silently skipped

**Investigative Journalism sub-check:** If genre is Investigative Journalism, grep Screen 1 (the orient screen) for the spec's "hidden finding" — the core contradiction or buried data from the Research Summary's Counterintuitive Finding section. SOFT WARN if found: `"C59 IJ sub-check: Screen 1 contains the hidden finding '{phrase}'. Investigative Journalism requires progressive disclosure — the surface must be plausible before the crack appears. Move the revelation to Screen 3+."` Also grep Screen 1 for the framework/methodology name from the spec. SOFT WARN if found: `"C59 IJ sub-check: Framework '{name}' named on Screen 1. IJ delays structural patterns until evidence converges (Screen 5+)."`

### C60: Image Filename Uniqueness (v7.4.0)

**Severity:** HARD GATE
**Archetype:** Both
**Category:** Visual Integrity

Scan all `media[].src` values across all non-cover screens in the JSON. Build a frequency map: `{filename → [screen indices]}`.

**Pass:** Every image filename appears on AT MOST 1 non-cover screen. Cover images (`visual-0-cover.png`, `visual-0-cover-mobile.png`) are exempt — they belong to `screens[0]` only.

**Fail:** `"C60 HARD GATE: Image '{filename}' is used on screens {list}. Each screen must reference a unique image — reusing the same visual defeats the spatial memory principle. Assign distinct images per screen or generate additional visuals."`

**Fix tier:** Tier 2 (user approval) — requires deciding which screens keep the image and which need new visuals.

**Related:** Art Direction Correction #9 (spatial memory principle), visual-philosophy.md VS4.


### C61: MCQ Correct-Answer Position Distribution (v10.0.0)
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** For each MCQ block in the JSON, record the `correct` index (0-3). Count how many MCQs have each position as correct.
- **Pass:** No single correct-answer position (0-3) may exceed 40% of all MCQs in the course. Example: if a course has 6 MCQs total (3 standalone + 3 glossary practice), no more than 2 can have the correct answer at the same position index.
- **Fail message:** "C61 HARD GATE: Correct-answer position {pos} is used {count}/{total} times ({pct}%) — exceeds 40% cap. Redistribute correct answers across positions."
- **Fix tier:** Tier 1 (auto-fix) — swap option order on affected MCQs, moving the correct answer to an underrepresented position, and adjust the `correct` index accordingly. See inline validation V-ST2.

### C62: Protagonist Presence (v10.0.0)
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Identify the protagonist company or person from the spec (Primary Company or Central Figure). Grep for protagonist keyword across all non-cover screen text blocks in the JSON.
- **Pass:** The protagonist company or person must be mentioned in 90%+ of non-cover screens. Theory enters as context for protagonist decisions, never standalone.
- **Fail message:** "C62 HARD GATE: Protagonist '{name}' appears on {count}/{total} screens ({pct}%) — must be >=90%. Screens missing protagonist: {list}. Every story screen must anchor to the protagonist."
- **Fix tier:** Tier 2 (user approval) — requires editorial judgment on how to weave protagonist back into screens where absent

### C63: No Self-Created Framework Labels (v10.0.0)
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** Grep all screen text blocks and headings for invented framework patterns: "Gate [0-9]", "Step [0-9]" as framework labels (not narrative), all-caps branded acronyms (e.g., "COVER framework", "PROVE method", "STRETCH model"), and branded checklists with invented names.
- **Pass:** No screen may contain invented framework names. Real-world frameworks (GAAR, Basel Accords, SEBI regulations, Porter's Five Forces, etc.) are exempt.
- **Fail message:** "C63 HARD GATE: Screen {N} contains invented framework label '{label}'. Self-created frameworks are banned — teach through the protagonist's story, not branded checklists. Real-world frameworks are permitted."
- **Fix tier:** Tier 1 (auto-fix) — remove the invented framework label and rewrite the content as narrative prose anchored to the protagonist's experience

### C64: Resolution Post-Climax Content (v10.0.0)
- **Severity:** SOFT WARN
- **Archetype:** Both
- **Inspect:** Identify the last story screen before practice/interview screens. Grep for dates (year patterns like 20XX, month+year) or event markers that occur chronologically AFTER the story's climax.
- **Pass:** The last story screen (before practice/interview) should contain at least one date or event that occurred AFTER the story's climax. This ensures the resolution shows aftermath, not summary.
- **Fail message:** "C64 WARN: Resolution screen (Screen {N}) contains no post-climax dates or events. Resolution should show aftermath (new hires, strategic pivots, market response, long-term consequences), not a restatement of lessons."
- **Fix tier:** Tier 2 (user approval) — requires research to add post-climax aftermath content

### C65: Glossary Context Dependency (v10.2.0)
- **Severity:** HARD GATE
- **Archetype:** Both
- **Inspect:** For each `terms_in_context` (glossary) screen, extract all company names and institution names referenced in the glossary narrative text (the paragraphs above the blockquote definition). For each company/institution found, search ALL preceding story screens (screens with lower index) for that name. Count the number of narrative sentences about that company on preceding screens.
- **Pass:** Every company or institution used as a PRIMARY example in a glossary screen's narrative (3+ sentences about it on the glossary screen) must have ≥3 sentences of narrative context on a preceding story screen. A single passing mention on a prior screen (e.g., "borrowed from Grameen Bank") does NOT satisfy this requirement — the reader needs substantive context before the glossary screen treats the company as familiar.
- **Fail message:** "C65 HARD GATE: Glossary screen {N} ('{term}') uses {company} as primary example ({count} sentences) but {company} has only {prior_count} sentence(s) of context on preceding screens. The reader encounters detailed {company} methodology before the story establishes it. Swap this glossary screen to AFTER the story screen that introduces {company}."
- **Fix tier:** Tier 2 (user approval) — requires reordering screens, which affects narrative flow. The typical fix is swapping the glossary screen with the next story screen so the deep company introduction precedes the glossary that depends on it.
- **Why this exists:** On 2026-03-24, a glossary card for "Social Collateral" opened with "In Grameen's original architecture..." on Screen 3, but the Grameen deep-dive was on Screen 4. The term was technically story-earned (bold in narrative), but the company context the definition depended on hadn't been established. The reader was learning Grameen's methodology in a glossary card before the story explained who Grameen was.

### C66: Glossary Term Verifiability (v10.7.0)

**Severity:** HARD GATE
**Archetype:** Both

**Inspect:** For each glossary term in the course:

1. **SPEC MATCH:** Verify the term appears in the spec's Research Summary or Glossary appendix. If the generated term does not match any term in the spec's approved glossary list, FAIL.

2. **SUBSTITUTION CHECK:** Compare the term against the spec's approved glossary list. If the generated term differs from the spec term (e.g., spec says "Functional Fixedness" but course uses "Convention Blindness"), FAIL with message showing both terms.

3. **COMPOUND FABRICATION SCAN:** Flag terms matching these patterns as requiring verification:
   - 3+ word terms not found in any research source
   - Hyphenated compounds (X-to-Y, X-of-Y) not in standard domain use
   - Terms where the definition is clear but the label is novel (descriptive phrases promoted to proper nouns)

**Pass:** All glossary terms match the spec's approved list AND appear in at least one research source.

**Fail message:** "C66 HARD GATE: Glossary term '{term}' on screen {N} not found in spec's Research Summary. This may be a fabricated compound noun. Replace with the established domain term or remove glossary card and teach the concept in narrative prose."

**Fix tier:** Tier 1 (auto-fix) — replace with the spec's approved term if a match exists. Tier 2 (user approval) if no spec term matches.

### C67: Research Selectivity (v10.8.0)

**Severity:** SOFT WARN
**Archetype:** Both

**Inspect:** If the spec contains a Research Curation Map:
1. Extract company names from the "Primary companies" list (max 3).
2. Scan all course screens for company name mentions.
3. Flag any company mentioned in the course that is NOT in the Primary companies list.

If no Research Curation Map exists in spec, skip this check.

**Pass:** All companies mentioned in the course appear in the spec's Primary companies list.

**Warn message:** "C67 SOFT WARN: Company '{name}' on screen {N} is not in the spec's Primary companies list. This may be research overflow — verify this company is narratively necessary."

### C68: MCQ Consolidation — One `apply`, Pre-Interview (v10.9.0)

**Severity:** HARD GATE
**Archetype:** Concept Sprint (primary). Hands-On uses `try_it` cadence; C68 does not apply.

**Inspect:** Count `apply` screens and list their positions. Also scan for screens with `type: "first_apply"` or `"harder_apply"` (deprecated types).

**Pass:** Exactly 1 `apply` screen. Position = `N−1` where N is total screen count (i.e., the `apply` screen is the penultimate screen, immediately before the interview screen). `first_apply` and `harder_apply` types are banned; any occurrence = FAIL.

**Fail message:** "C68 HARD GATE: Found {count} `apply` screens at positions {positions}. Concept Sprint courses must have exactly 1 `apply` screen at position N−1 (before the interview). Deprecated types `first_apply`/`harder_apply` are banned — consolidate into a single final `apply`."

**Fix tier:** Tier 2 (user approval) — MCQ consolidation requires picking the strongest stem and merging the weaker ones into prose.

**Why this exists:** 2026-04-14 humanization audit of 20 CMS-edited courses found that 18/20 required collapsing 3–4 sprinkled MCQs (`first_apply` + `harder_apply` + `apply` interleaved) into a single final `apply`. This accounted for ~30% of all screen cuts in the humanization pass. One pre-interview stem forces sharper writing and clean practice-before-stakes cadence.

### C69: Screen-Count Cap — 14 Max, 13 Sweet-Spot (v10.9.0)

**Severity:** HARD GATE
**Archetype:** Concept Sprint. Hands-On allows 8–18 — see Appendix B.

**Inspect:** Count total screens (including cover + interview). Read the spec's declared screen count.

**Pass:** Concept Sprint total screen count ∈ [12, 14]. Sweet spot = 13. Values outside this range must be corrected before `:audit` can succeed.

**Fail message:** "C69 HARD GATE: Course has {count} screens; Concept Sprint cap is 14 (sweet spot 13). Spec QG2 must restart with a reduced screen plan. Candidate cuts: filler-title screens flagged by S-NR15, duplicate apply screens (see C68), and recap/comparison screens that restate prior material."

**Fix tier:** Tier 2 (user approval) — screen deletion reshapes narrative; user must choose which screens fold into adjacent beats.

**Why this exists:** 2026-04-14 humanization audit — 16/20 CMS-edited Concept Sprint courses were shrunk to ≤14 screens, with an average cut of −3.5 screens. Pipeline was shipping 16–25 screen courses that readers never saw at full length. Rule restates CLAUDE.md's 12–14 range with an HARD enforcement point at `:plan` QG2.

### C70: Glossary Must Be Industry-Canonical Vocabulary (v10.9.0)

**Severity:** HARD GATE
**Archetype:** Both

**Inspect:** For each glossary term in the final course JSON:
1. **Live web verification** — Agent 5 (Factual) runs up to 2 web searches: `"{term}" {skill domain}` via `mcp__perplexity__perplexity_search` or `WebSearch`. A "canonical source" is HBR, McKinsey Quarterly / BCG Henderson / Bain Insights, Harvard Business School Press / other university press, a named practitioner book (Drucker, Porter, Christensen, etc.), trade press (WSJ, FT, The Economist, domain-specific journals), or an industry standard body (CFA Institute, AICPA, PMI, etc.).
2. **Invented-term pattern scan** — flag terms matching these heuristics as high-risk: portmanteau coinages (e.g., "Skill Rarity Premium"), adjective+noun inventions (e.g., "Adjacency Mapping", "Trust Architecture"), aestheticized labels ("The Keeper Test" if no attribution found).

**Pass:** Every glossary term returns ≥1 canonical source within 2 searches. Budget: 3–5 glossary terms per course, all web-verifiable. Zero invented/AI-coined terms. This check is complementary to C66 (spec-match): C66 catches terms that don't match the spec; C70 catches spec-approved terms that are themselves fabricated.

**Fail message:** "C70 HARD GATE: Glossary term '{term}' on screen {N} returned no canonical industry source in 2 web searches. The glossary is the course's learning outcome — students must be able to carry these terms into practitioner conversations. Replace with a verifiable industry term or remove the glossary card and fold the concept into narrative prose."

**Fix tier:** Tier 2 (user approval) — term replacement requires domain research and may affect downstream MCQ/interview screens that reference the term.

**Why this exists:** 2026-04-14 humanization audit — 14/20 CMS-edited courses had named-concept inflation: invented labels ("Skill Rarity Premium", "Capability Portfolio", "Adjacency Mapping") that students cannot use in real conversations. The rule reframes the glossary: terms are not branding devices, they are the load-bearing learning outcome. Also reinforces CLAUDE.md's mandatory web-verification discipline by extending it from factual claims to vocabulary.

### C71: Interview Template Purity (v10.9.0)

**Severity:** HARD GATE
**Archetype:** Concept Sprint (primary). Hands-On interview screens follow the same rule.

**Inspect:** Parse the interview screen's motivational text blocks. Regex-scan for these banned phrases (case-insensitive, allowing small variations):
- `you(?:\s+have|'ve)?\s+absorbed\s+the\s+\w+`
- `you(?:\s+have|'ve)?\s+(?:done\s+the\s+work|understood|understand)`
- `now\s+(?:record|step\s+up|prove\s+it|do|it'?s\s+your\s+turn)`
- The triplet pattern: three short imperative/declarative sentences where at least two begin with "You" or "Now".

**Pass:** No banned-phrase hit. Motivational block is either (a) a single imperative ("Prove it!"), (b) a one-line callback to screen N−2's protagonist decision, or (c) a single question the learner must answer aloud. Multi-sentence scaffolding ("You've X. You Y. Now Z.") is banned outright.

**Fail message:** "C71 HARD GATE: Interview screen {N} motivational block contains the banned 'you've absorbed / you understand / now record' triplet (or a near-variant). This is a generator tell observed in 20/20 pipeline outputs. Replace with a single imperative, a story-callback to screen N−2, or a single question."

**Fix tier:** Tier 1 (auto-fix) — replace the motivational block with a one-line alternative drawn from approved templates in `shared/spec-template.md` §Interview.

**Why this exists:** 2026-04-14 humanization audit — the "you've absorbed the framework / you understand the diagnostic / now record your perspective" triplet appeared in all 20 pipeline-generated courses and was cut from all 20 CMS-edited versions. It is the single most reliable AI fingerprint in the current generator.

### C72: Novice-First Unpacking (v10.18.0)

**Severity:** HARD GATE (senior-title audience + specialized stack) / SOFT WARN (otherwise)
**Archetype:** Both

**Applies when:** spec `Audience Posture` is `novice-on-stack` OR (audience title ∈ {Founder, CXO, Senior Leader, Product Leader, Managing Director, Partner} AND course topic involves specialized vocabulary < 5 years old — GenAI, agent-web, DeFi, emerging regulatory). Does NOT override for domain-native audiences (Tax Consultant / Section 10AA; Credit Manager / NPA).

**Inspect:** For each specialized noun in the specialized-vocab list (see `generation-guide/audience-posture.md` § Auditor Cheat Sheet — acronyms like `MCP`, `ACP`, `Ed25519`, `HTTP 402`, `LLM`, `LoRA`, `RAG`, `RLHF`; emerging terms like `llms.txt`, `agent`, `crawl-to-referral ratio`, `passage citability`, `zero-click`, `GEO`), locate the FIRST mention in the course MD. Verify one of:
- (a) In-text unpack in the same sentence or the immediately adjacent sentence — e.g., `MCP (Model Context Protocol — the spec Anthropic published in Nov 2024 that lets AI agents call tools)`.
- (b) A glossary card for this term appears within ≤1 screen of the first mention.
- (c) Show-before-tell: the mechanism is painted with a concrete analogy in the 1-2 sentences preceding the technical name.

**Pass:** Every specialized noun on the checklist has one of (a), (b), or (c) on first mention. Screen 1 contains no specialized noun without treatment.

**Fail message:** "C72 HARD GATE: Specialized term `{term}` first appears on Screen {N} without in-text unpack, adjacent glossary card, or preceding show-before-tell analogy. Audience is novice-on-stack per spec. Suggested unpack: `{short analogy from audience-posture.md examples}`."

**Fix tier:** Tier 1 (auto-fix) — insert a ≤20-word parenthetical unpack at the first mention. Tier 2 only if the unpack requires restructuring adjacent sentences for rhythm.

**Why this exists:** 2026-04-20 directive from course owner during the `:plan` session for the first Post-Human series course: "Henceforth remember that you are writing for novices. Even if the user is a leader they are a novice about the technology aspects and so on." Pre-existing S-NR13 (Novice Accessibility) covered reading-level but did not enforce domain-vocabulary unpacks on first mention. This check closes that gap.

---

**Why this exists (C66):** On 2026-04-02, audit of 160+ glossary terms across 32 courses found ~18 fabricated terms — professional-sounding compound nouns that don't exist in any domain literature. Examples: "Competence-to-Compatibility Shift" (not in HR), "Strategic Refusal" (not in PM), "Opacity Premium" (not in marketing). Learners Google these terms, find zero results, and lose trust in the course.

---

## Category 4: Hands-On Checks (C-HO1 to C-HO5) — Hands-On Archetype Only

Premium Tutorial structural checks. Run for Hands-On archetype ONLY.

### C-HO1: Technique Density
- **Severity:** HARD GATE (min 5) + SOFT WARN (<7)
- **Archetype:** Hands-On ONLY
- **Inspect:** Count named, discrete, verifiable techniques across all `concept` and `demo` screens. A "technique" has a name, a trigger condition, and a specific outcome
- **Pass:** Min 5 named techniques (HARD GATE). WARN if fewer than 7. The `recap` screen should list all techniques by number
- **Fail message:** "C-HO1 HARD GATE: Only {count} named techniques found — minimum 5 required." / "C-HO1 WARN: Only {count} techniques — target 7+."
- **Fix tier:** Tier 2 (user approval) — adding techniques requires domain knowledge

### C-HO2: Tool Citation
- **Severity:** HARD GATE
- **Archetype:** Hands-On ONLY
- **Inspect:** Every `demo` screen — check for at least one specific tool, extension, command, or URL name
- **Pass:** Each demo screen names a specific tool. Generic tool references ("use a validation tool") without naming the specific tool = FAIL
- **Fail message:** "C-HO2 HARD GATE: demo Screen {N} has no specific tool citation — name the exact tool, extension, command, or URL."
- **Fix tier:** Tier 2 (user approval) — requires domain knowledge to identify correct tools

### C-HO3: Expert Citation Count
- **Severity:** HARD GATE
- **Archetype:** Hands-On ONLY
- **Inspect:** Count named expert/data citations across the course (format: "[Source name] found/showed/reported [finding]")
- **Pass:** Minimum 3 named citations. "Studies show" or "Research suggests" without naming the source does NOT count
- **Fail message:** "C-HO3 HARD GATE: Only {count} named expert citations — minimum 3 required. 'Studies show' without a source name does not count."
- **Fix tier:** Tier 2 (user approval) — requires research to find named sources

### C-HO4: Before/After Evidence
- **Severity:** SOFT WARN
- **Archetype:** Hands-On ONLY
- **Inspect:** Count screens containing before/after comparison content (comparison tables, side-by-side text, or explicit "wrong approach → right approach" narratives)
- **Pass:** Minimum 2 screens with before/after content
- **Fail message:** "C-HO4 WARN: Only {count} before/after comparisons found — target minimum 2."
- **Fix tier:** None (warning only)

### C-HO5: Action Timeline Recap
- **Severity:** HARD GATE
- **Archetype:** Hands-On ONLY
- **Inspect:** The `recap` screen — grep for time-horizon language (e.g., "This week", "This month", "In 3 months")
- **Pass:** Recap screen contains time-bound action items with at least 3 time horizons
- **Fail message:** "C-HO5 HARD GATE: Recap screen missing time-bound action items — need at least 3 time horizons (e.g., 'This week', 'This month', 'In 3 months')."
- **Fix tier:** Tier 1 (auto-fix) — add time-horizon structure to recap
- **Auto-fix:** Restructure recap action items into time-horizon format using content from the course

---

## Appendix A: Pre-Numbered Checks (Concept Sprint)

These checks run at the top of Step 6 before the C-numbered checks. They are archetype-specific structural validations that verify the course meets basic requirements.

| Check | Description | Severity |
|-------|-------------|----------|
| Screen count | 12-18 (matches spec, counting from screens[1]). Sweet spot: 14-16 | HARD GATE |
| MCQ count | Exactly 3 standalone (1 retention + 1 behavioral + 1 aptitude). Glossary practice questions add 2-5 more | HARD GATE |
| Glossary count | 5-7 terms, max 5 glossary cards. Each card has 1 term (default) or 2 terms (shared story beat exception) | HARD GATE |
| Answer distribution | No correct-answer position (0-3) exceeds 40% of all MCQs (C61). No letter (A/B/C/D) used more than 4 times | HARD GATE |
| MCQ answer-length balance | Correct answer is NOT the longest in >50% of MCQs | HARD GATE (auto-rebalance) |
| Required screen types | All required types present (ORIENT, BRIDGE, FRAMEWORK, APPLY, INTERVIEW) | HARD GATE |
| Spec decisions honored | Spot-check framework type, contrast approach, interview framing | HARD GATE |
| Description quality | `course_metadata.description` exists, 80-120 chars, Opener x Stickiness taxonomy | HARD GATE |
| MCQ Proximity | Every MCQ tests preceding 1-2 screens only | HARD GATE |
| Story-Earned Glossary | Term appears **bold** in narrative above blockquote | HARD GATE |
| Punchy Bottom Line | Every story/bridge screen ends bold, short closing line | HARD GATE |
| Bridge Paragraphs | 2-3 sentence narrative before every MCQ/interview/activity block | HARD GATE |
| No Fabricated Names | MCQs use "you/your" framing, no third-person character names | HARD GATE |
| Glossary Blockquote Format | `> **Term** — Category` format, zero GLOSSARY CARD headers | HARD GATE |
| Company Focus | Primary (3+ screens) ≤ 3 companies (HARD GATE, except Industry Epic). Primary + Secondary ≤ 5 (SOFT WARN). See C12 | Tiered |
| No Fabricated Company Scenarios | Zero invented companies outside spec Research Summary | HARD GATE |
| Image Uniqueness | Each image file referenced on at most 1 non-cover screen (C60) | HARD GATE |
| MCQ Position Distribution | No correct-answer position exceeds 40% (C61) | HARD GATE |
| Protagonist Presence | Protagonist mentioned on 90%+ of non-cover screens (C62) | HARD GATE |
| No Self-Created Frameworks | No invented framework labels — real-world frameworks exempt (C63) | HARD GATE |
| Resolution Aftermath | Last story screen has post-climax date/event (C64) | SOFT WARN |

## Appendix B: Pre-Numbered Checks (Hands-On)

| Check | Description | Severity |
|-------|-------------|----------|
| Screen count | 8-18 (matches spec). Sweet spot: 10-14 | HARD GATE |
| MCQ count | 4-12 (matches spec) | HARD GATE |
| `intro` is screens[1] | First content screen after cover | HARD GATE |
| `recap` is last screen | Last screen in sequence | HARD GATE |
| Min 2 `demo` screens | At least 2 demo screens | HARD GATE |
| Min 2 `try_it` screens | At least 2 try_it screens | HARD GATE |
| Early `try_it` | At least 1 try_it before midpoint | HARD GATE |
| No 3+ consecutive same-type | No 3+ consecutive screens of the same type | HARD GATE |
| Answer distribution | No letter (A/B/C/D) used more than 4 times across all MCQs | HARD GATE |
| MCQ answer-length balance | Correct answer is NOT the longest in >50% of MCQs | HARD GATE (auto-rebalance) |
| Spec decisions honored | Spot-check screen plan types, artifact count, video count | HARD GATE |
| Description quality | `course_metadata.description` exists, 80-120 chars, Opener x Stickiness taxonomy | HARD GATE |
| MCQ Proximity (HO) | Every try_it MCQ tests preceding 1-2 demo/concept screens | HARD GATE |
| Story-Earned Glossary | Term appears **bold** in narrative above blockquote | HARD GATE |
| Punchy Bottom Line (HO) | concept, demo, recap screens end bold. try_it with MCQ explanations exempt | HARD GATE |
| Bridge Paragraphs (HO) | 2-3 sentence bridge before MCQ/activity on try_it. References preceding demo action | HARD GATE |
| No Fabricated Names | MCQs use "you/your" framing | HARD GATE |
| Glossary Blockquote Format | `> **Term** — Category` format | HARD GATE |
| Company Focus | Primary (3+ screens) ≤ 3 companies (HARD GATE, except Industry Epic). Primary + Secondary ≤ 5 (SOFT WARN). See C12 | Tiered |
| No Fabricated Company Scenarios | Zero invented companies | HARD GATE |
| Image Uniqueness | Each image file referenced on at most 1 non-cover screen (C60) | HARD GATE |
| MCQ Position Distribution | No correct-answer position exceeds 40% (C61) | HARD GATE |
| Protagonist Presence | Protagonist mentioned on 90%+ of non-cover screens (C62) | HARD GATE |
| No Self-Created Frameworks | No invented framework labels — real-world frameworks exempt (C63) | HARD GATE |
| Resolution Aftermath | Last story screen has post-climax date/event (C64) | SOFT WARN |

---

## Appendix C: Check Index

Quick-reference sorted by severity.

### HARD GATES (must pass before proceeding)

C1, C2, C3, C4, C5, C6, C7, C8, C9 (CS only), C10, C11, C12 (primary ≤3), C15, C16, C17, C18, C19, C22, C23, C24 (HO only), C25 (HO only), C26, C27, C28, C29, C30, C31, C32, C34, C35-C43 (blueprint only), C44, C45, C46 (>2 terms), C47, C48, C49, C50, C51, C52, C53, C54 (>75w), C58, C60, C61, C62, C63, C65, C66, C68 (CS only), C69 (CS only), C70, C71, C-HO1 (min 5), C-HO2, C-HO3, C-HO5

### SOFT WARNS (flagged, not blocking)

C12 (secondary ≤5), C13, C20, C33 (avg >180), C46 (2 terms without shared beat), C54 (60-75w), C55, C56a, C56b, C56c, C57, C59, C64, C-HO1 (<7), C-HO4

### DEPRECATED

C14 (superseded by C46)

### Tier 1 Auto-Fixable

C2, C3, C5, C6, C7, C8, C9, C10, C11, C15, C16, C17, C18, C19, C23, C24, C26, C27, C29, C30, C34, C37, C46, C47, C48, C49, C50, C51, C54, C56a, C61, C63, C71, C-HO5

### Tier 2 User-Approval

C4, C12, C22, C25, C28, C32, C35, C36, C38, C39, C40, C41, C42, C43, C44, C45, C46 (2 without shared beat), C53, C55, C56b, C56c, C57, C58, C59, C60, C62, C64, C68, C69, C70, C-HO1, C-HO2, C-HO3

### Detection Only (no auto-fix)

C52
