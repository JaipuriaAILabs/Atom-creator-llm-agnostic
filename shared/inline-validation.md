# Inline Validation Protocol

Post-generation validation pass. Parses completed MD into screens, runs 18 deterministic checks,
auto-fixes what it can. Called by `:create` between Step 4 (generation) and Step 5 (JSON conversion).

Also called by partial regen (`shared/partial-regen.md`) on individual regenerated screens in single-screen mode.

---

## Parsing

Split the generated MD by `---` separators (lines containing only `---`).
Each section = one screen. Screen 0 = cover metadata section.
Count the resulting sections — should match the spec's screen count + 1 (for cover).

---

## Checks (run on each non-cover screen)

### V1: Banned Phrase Scan

Grep each screen's text against all 33 banned phrases + 12 patterns from `banned-phrases.md` (already loaded in Step 3 context).

**If found:**
- Log: screen number, check name `V1`, offending phrase, surrounding sentence
- Auto-fix: rewrite the offending sentence to remove the banned phrase while preserving meaning and narrative flow
- Max 2 rewrite attempts per screen

**Priority spot-checks** (most frequently missed — check these first):
- `FLIP:` / `THE FLIP:` / `OUTSIDE VIEW:` as section labels
- `By the end, you'll` / `By the end you will`
- `Most people assume [X]. The reality is`
- Triple-repetition anaphora (`Not X. Not Y. Not Z.` or `Same X, same Y, same Z`)

### V2: MCQ Option Length Balance

If screen contains an MCQ (identified by `### Q` heading or `**Q` pattern):
- Extract all 4 option texts (lines starting with `- ` under an MCQ heading — options are plain text with no letter prefix)
- Calculate character length of each option
- If any option differs by >20% from the average length of all 4 options:
  - Log: screen number, check name `V2`, option lengths, which options are imbalanced
  - Auto-fix: rewrite the outlier options to bring them within 20% of the average
  - Do NOT change the correct answer's meaning or the distractor's failure certificate

### V3: Number System Consistency

Scan each screen for:
- **Indian units:** lakh, crore, Rs, INR, ₹
- **International units:** million, billion, $, USD

If BOTH systems appear on the SAME screen without an explicit conversion note (e.g., "Rs 100 crore (~$12M)"):
- Log: screen number, check name `V3`, both unit types found with excerpts
- Auto-fix: normalize to whichever system dominates the course. Check the spec's Research Summary for the convention used in company data. Default to Indian for Indian companies, International for global companies.

### V4: Sentence Fragment Scan

Scan body text (excluding MCQ options, headings `###`, glossary blockquotes `>`, and bold closers `**...**`) for:
- Lines ending without a full stop `.`, question mark `?`, or exclamation mark `!`
- Standalone text lines under 5 words that are not headings or bold closing lines

**FLAG ONLY — do NOT auto-fix.** These may be intentional stylistic choices. Include in validation summary with screen numbers.

### V5: Western Slang / Contractions

Grep for these patterns in non-quoted context (exclude text within quotation marks):
- Contractions: `n't`, `'re`, `'ve`, `'ll`, `'d`
- Slang: `gonna`, `gotta`, `wanna`, `folks`, `guys`

**If found:**
- Log: screen number, check name `V5`, offending term, surrounding sentence
- Auto-fix: expand contractions (`don't` → `do not`, `can't` → `cannot`, `won't` → `will not`, `it's` → `it is`). Replace slang with formal equivalents (`folks` → `people`, `guys` → `people`).

### V6: Stale Cross-References

Grep for inter-screen references that break screen independence:
- `as we saw`, `as mentioned`, `as discussed`
- `earlier`, `in the previous`, `from earlier`
- `Card [0-9]`, `Screen [0-9]`, `from Card`, `from Screen`
- `previous card`, `next card`, `previous screen`

**If found:**
- Log: screen number, check name `V6`, offending reference, surrounding sentence
- Auto-fix: replace with self-contained statements that do not reference other screens. Each screen must stand alone.

### V7: A/B/C/D Label Removal

Grep MCQ options (lines starting with `- `) for letter prefixes:
- Pattern: `^- [A-D][).\s]` or `^- [A-D]\s` (e.g., `- A) Option text`, `- A. Option text`, `- A Option text`)

**If found:**
- Log: screen number, check name `V7`, offending option, original text
- Auto-fix: remove the letter prefix, keeping only the option text (e.g., `- A) Every critical role had...` → `- Every critical role had...`)
- Also check glossary practice question options for the same pattern

### V8: Whole-String Markdown Bold Detection

Scan all body text lines (excluding headings `### `, MCQ options `- `, and blockquotes `> `) for lines where the ENTIRE text is wrapped in `**...**`:
- Pattern: line matches `^\*\*.*\*\*[.!?]?$` (starts with `**` and ends with `**` optionally followed by punctuation)
- NOT flagged: inline term bold mid-sentence — e.g., `called **legend depth** which compounds` is fine
- FLAGGED: entire line — e.g., `**The pattern that separates professionals from interchangeable ones.**` (full string is bold markdown)

**Why this matters:** The frontend detects whole-string `**...**` and renders it as a pull-quote/highlight card (large font, bordered box). This is NOT the intended behavior for closing bottom-line sentences. Those should use the `"bold": true` JSON attribute on a plain-text block.

**If found:**
- Log: screen number, check name `V8`, offending line text
- Auto-fix: strip the `**` prefix and suffix from the text. Verify the corresponding JSON block has `"bold": true` attribute — add it if missing.
- Only the full-string wrap is removed. Any mid-sentence `**term**` patterns within the same screen are left untouched.

### V9 — Text Block Density Split

Scan all body text paragraphs in each screen's markdown. A paragraph = text between blank lines, EXCLUDING: headings (`### `), MCQ option lines (`- `), blockquotes (`> `), and bold closing lines (entire line wrapped in `**...**`).

**Step 1 — Count and classify:**
For each paragraph, count words.

**Step 2 — Auto-split (>75 words only):**
If a paragraph exceeds 75 words:
1. Find the best split point using this priority:
   (a) Period followed by a contrast word: "But", "However", "Yet", "Instead", "Meanwhile"
   (b) Period followed by a new proper noun or company name not in the first half
   (c) Period closest to the midpoint of the paragraph
2. Each resulting block must be ≥15 words (no fragments).
3. **Semantic coherence check:** After splitting:
   - If the second block starts with a pronoun whose referent is only in the first block ("This meant...", "It showed...", "That approach..."), rewrite the opener to restate the referent explicitly.
   - If the first block ends with a setup that requires the second block's payoff (e.g., "For example..." orphaned from its claim), restructure: move the claim into the second block's opener, or add a self-contained closing to the first block.
   - If the split would break a cause-and-effect chain, a before/after comparison, or a list being enumerated — FLAG instead of splitting. These structures are better left long than broken.
4. If no valid split produces two semantically coherent blocks of ≥15 words each → FLAG only, do not force a bad split.

**Step 3 — Flag (>60 words, ≤75 words):**
FLAG only — do not auto-fix. Log: screen number, check name `V9`, word count, first 40 characters. These are candidates for manual review.

**Exemptions (do NOT scan):**
- Lines that are entirely bold (`**...**`) — closing bottom lines
- Lines on screens that contain MCQ (`### Q` pattern) or glossary (`> **Term**`) — exercise card bridges
- Lines containing numbered step patterns (`1. `, `2. `, `3. `) — hands-on demo instructions

**Trigger:** Same pass as V1-V8 (after MD generation, before JSON conversion).

### V7b — Verdict-Prefix MCQ Options
Scan all MCQ option strings in the JSON. FAIL if any option starts with a verdict or color word followed by a dash, colon, or em-dash: `Red —`, `Green —`, `Yellow —`, `Pass —`, `Fail —`, `Correct —`, `Wrong —`.

**Auto-fix:** Strip the prefix (including the dash/colon and any trailing space) and capitalize the first letter of the remaining text.

**Trigger:** Same pass as V7 (after MD generation, before JSON conversion).

### V10 — MCQ Explain Completeness
Scan all MCQ blocks in the JSON. Every `"type": "mcq"` block must have an `"explain"` key with a non-empty string value (minimum 20 characters).

**Auto-fix:** Extract the explanation from the course MD — look for the `**Explanation:**` paragraph following each MCQ's ✓/✗ options block. Copy the explanation text (without the `**Explanation:**` prefix) into the MCQ block's `"explain"` field.

**Trigger:** After JSON conversion (Step 5), before structural checks (Step 6).

### V11 — Staccato Fragment Check

Scan all story screens (EXCLUDING exercise cards — screens with `mcq`, `glossary`, or `text_question` blocks). For each screen, examine consecutive body text blocks (paragraphs between blank lines, excluding headings `### `, MCQ option lines `- `, blockquotes `> `, and bold closing lines `**...**`).

**Check:** Flag if 3+ consecutive text blocks on the same screen are each ≤5 words.

**Why this matters:** Staccato patterns ("January 2012. Five judges. One question.") look stylish in film but feel choppy on mobile cards. They create a screenplay aesthetic that clashes with the conversational Bus-Commuter Archetype (Principle 29). Hook energy should come from the CONTENT of the revelation, not the FORMATTING of the text.

**If found:**
- Log: screen number, check name `V11`, the consecutive short blocks with word counts
- **FLAG ONLY — do NOT auto-fix.** These may be intentional dramatic beats. Include in validation summary with the suggestion: "Consider merging into flowing narrative prose."

**Distinction from Principle 28C (punch blocks):** A single punch block (one block ≤15 words per screen) is good rhythm. Three or more consecutive ≤5-word blocks is screenplay formatting. V11 does not conflict with P28C.

**Exemptions (do NOT scan):**
- Screens containing MCQ (`### Q` pattern), glossary (`> **Term**`), or `text_question` blocks
- Headings (`### `)
- Bold closing lines (entire line wrapped in `**...**`)
- Lines containing numbered step patterns (`1. `, `2. `, `3. `) — hands-on demo instructions

### V12 — Global Accessibility Check

Scan Screens 1-2 only (first two content screens after cover). Identify all proper nouns — capitalized multi-word phrases not at sentence start, or single capitalized words matching company/person/institution patterns — that appear WITHOUT a contextual introduction.

**Pattern that PASSES:** "John Meriwether — a bond trader whose employer paid him $60M in a single year" (proper noun + contextual clause explaining who/what/why)

**Pattern that FAILS:** "John Meriwether walked into the trading floor" (proper noun introduced cold — no context for non-Western audiences)

**Pattern that FAILS:** "the legendary Salomon Brothers trader" (assumes the reader knows what Salomon Brothers is)

**Check:** For each proper noun on Screens 1-2, verify it is followed within the same sentence or the next sentence by a contextual clause (who/what/why). Contextual clause = any dependent clause, appositive, or parenthetical that identifies the entity and explains why the reader should care.

**If found (missing context):**
- Log: screen number, check name `V12`, the proper noun, surrounding sentence
- **FLAG ONLY — do NOT auto-fix.** Context requires editorial judgment about what the reader needs to know.
- Suggestion: "Introduce [name] with a contextual clause — e.g., '[Name] — [one detail explaining why they matter]'."

**Exemptions:**
- Tier-1 global brands that need no introduction (India, Google, Apple, Amazon, Tesla, Microsoft, Netflix, Coca-Cola)
- Country names, city names, well-known geographic landmarks
- Entities previously introduced with context in an earlier sentence on the same screen
- Hands-On courses (these open with tool names, not character introductions)

**Especially relevant for:** Story-first: Historical Novella, which introduces people and institutions by name from Screen 1.

### V13 — Sensory Anchor Density (Screens 1-3)

Scan Screens 1-3 (first three content screens after cover). Count all concrete sensory anchors:

**Anchor types to count:**
- **Dates:** Specific dates or time references with year ("In 1993," "By February 1998," "summer of 2007"). Generic time references ("recently," "over time") do NOT count.
- **Places:** Named locations ("Greenwich, Connecticut," "Dalal Street," "the trading floor at Salomon Brothers"). Generic places ("the office," "the market") do NOT count.
- **People:** Named individuals ("John Meriwether," "Arun Sarin"). Generic references ("the CEO," "analysts") do NOT count.
- **Amounts:** Specific numbers with units ("$4.6 billion," "₹200 crore," "17 partners"). Percentages without context ("30%") do NOT count unless attached to a specific entity ("Swiggy's 30% budget increase").
- **Physical details:** Tangible objects or sensory descriptions ("a single sheet of paper," "the phone that wouldn't stop ringing," "the glass-walled corner office"). Must be specific and concrete.

**Step 1 — Count:**
For each of Screens 1, 2, and 3, scan all body text (excluding headings, MCQ options, blockquotes). Count each unique anchor. Sum across all 3 screens.

**Step 2 — Evaluate:**
If total anchors across screens 1-3 is < 12:
- Log: check name `V13`, total anchor count, breakdown by screen, anchor types found
- **Auto-fix:** For each screen below 4 anchors, identify abstract statements that could be grounded with specifics. Rewrite to add concrete details:
  - Replace "recently" → specific year
  - Replace "the company" → company name
  - Replace generic amounts → specific figures from spec research
  - Add place names where scenes are set
  - Add physical details where actions occur
- Target: bring total to ≥12 across the 3 screens (average ≥4 per screen)
- Max 2 rewrite attempts per screen

If total anchors ≥ 12: PASS silently.

**Exemptions:**
- Hands-On courses (these open with tool descriptions, not character introductions)
- Screens containing only MCQ or glossary blocks

### V14 — Concept-Before-Story Check (Screen 1)

Scan Screen 1's body text (excluding headings, MCQ options, blockquotes, bold closing lines). Identify the first 6 complete sentences.

**Step 1 — Build concept vocabulary:**
From the spec's Research Summary, extract:
- The Layer 2 technical skill name and its variants
- All glossary terms
- Framework names
- Methodology terms (any term that names a process, model, or analytical approach)

**Step 2 — Scan first 6 sentences:**
Check if any of the concept vocabulary words appear in sentences 1-6 of Screen 1.

**Allowed exceptions:**
- Company names that happen to contain concept words (e.g., "Long-Term Capital Management" is a company name, not a concept)
- Words used in their everyday sense, not their technical sense (e.g., "manage" in "he managed a team" is fine; "management framework" is not)

**Step 3 — Evaluate:**
If concept vocabulary appears in sentences 1-6:
- Log: check name `V14`, the offending term, which sentence it appears in, the sentence text
- **FLAG ONLY — do NOT auto-fix.** Concept placement requires editorial judgment about narrative structure.
- Suggestion: "Move conceptual language to sentence 7+ — establish the company/event story first. The concept should feel like a revelation, not a topic label."

If no concept vocabulary in sentences 1-6: PASS silently.

**Exemptions:**
- Hands-On courses (which open with tool/technique introductions by design)
- Courses using Framework-first framing mode (concept introduction IS the opening approach)
- Screen 1 of courses with Braided Story framing (concept interleaving is intentional)
- **Behavioral Science genre courses** (the bias/concept IS the hook — concept-first is the correct approach for this genre)

### V15 — Single Glossary Block Per Screen

Scan all screens in the JSON output. For each screen with `type: "terms_in_context"`:
- Count the number of blocks with `type: "glossary"`
- If count > 1: HARD FAIL

**Why this matters:** The frontend renderer expects exactly 1 glossary block per `terms_in_context` screen. Multiple glossary blocks cause the second term to be silently dropped or break the card layout.

**If found (count > 1):**
- Log: screen index, check name `V15`, number of glossary blocks found, term names
- **Auto-fix:** Split the screen into N separate `terms_in_context` screens, one per glossary block. Each new screen gets: heading block ("Remember This Term"), bridge text block, and the single glossary block (with its practice object). Renumber all subsequent screen indices.

**Trigger:** After JSON conversion (Step 5), alongside V10.

### V16 — MD-JSON Paragraph Count Parity (v7.4.0)

**Trigger:** After JSON conversion (Step 5), runs alongside V10-V15.

For each non-cover screen (index > 0):
1. Count body paragraphs in the MD section for that screen (text between blank lines, excluding `### ` headings, MCQ option lines `- ... ✓/✗`, blockquotes `> `, bold closing lines `**...**`, and verification tables)
2. Count body text blocks in the JSON for that screen (`type: "text"`, `font: "body"`)
3. FAIL if counts differ by more than 1

**If found:**
- Log: `"V16: Screen {index} — MD has {md_count} body paragraphs, JSON has {json_count} body text blocks. Difference: {diff}."`
- **Auto-fix:** Re-derive JSON body text blocks from the MD section for that screen. MD is the source of truth — regenerate the JSON blocks array for the divergent screen while preserving heading, MCQ, glossary, framework, and media blocks.

**Rationale:** The `:create` stage generates MD and JSON in the same session, but edits, partial regeneration, or LLM inconsistency can cause paragraph-level drift. This check catches missing paragraphs, duplicated blocks, and content that exists in MD but was lost during JSON conversion.

**Exempt:** Cover screen (index 0). Practice/glossary/interview screens where MD paragraph structure differs from JSON block structure by design (MCQ options, blockquote glossary).

**Severity:** HARD GATE — paragraph count mismatch means the learner sees different content in the app (JSON) than what was authored (MD).

### V17 — Story Bridge Number Density (P37)

**Trigger:** After MD generation (Step 4.5), runs alongside V1-V16.

For each story-type screen (orient, story_bridge, contrast, twist, expert_move, resolution):
1. Count precise numeric patterns in body text:
   - Comma-separated thousands: `\b\d{1,3},\d{3}\b`
   - Decimal percentages: `\b\d+\.\d+%`
   - Multi-digit currency without rounding qualifier: `(₹|\$)\s*\d{3,}` NOT preceded within 3 words by "more than|nearly|close to|roughly|barely|well over|just under"
2. For non-contrast/non-twist story screens: WARN if >1 precise number found
3. For contrast/twist screens: WARN if >3 precise numbers found
4. For all story screens: WARN if >4 numbers of any type (even approximate) found — data-report tone

**If found:**
- Log: `"V17: Screen {index} ({type}) has {count} precise numbers. P37 recommends speculative language for Tier B numbers on story bridges. Consider: '{precise}' → '{suggested_speculative}'."`
- **NOT auto-fixable** — flag only. Number softening requires editorial judgment on which tier each number belongs to.

**Rationale:** Story screens that read like data tables break narrative flow. Precise numbers trigger fact-checking mode; approximate language reads as confident journalism.

**Severity:** SOFT WARN (flag-only, no auto-fix).

### V18 — Financial Figure Date Anchoring (v7.4.1)

**Trigger:** After MD generation (Step 4.5), runs alongside V1-V17.

**What it catches:** Financial claims (revenue, AUM, market cap, growth rates, employee counts) without temporal context. Numbers change — a figure stated as fact today may be stale in 6 months.

**Scan pattern:** Regex for currency amounts and financial terms:
- Currency: `(Rs|₹|\\$|€|£)\s*[\d,.]+`
- Financial terms + numbers: `(revenue|AUM|market cap|valuation|employees|growth)\b.*?\d`

**Check:** For each match, scan ±50 characters for a date anchor:
- Year: `(19|20)\d{2}|FY\d{2}|FY20\d{2}`
- Quarter: `Q[1-4]|H[12]`
- Temporal: `at the time|as of|by year-end|when \w+`

**If missing:**
- Log: `"V18: Financial figure '{amount}' on Screen {index} has no date anchor. Add 'as of FY24', 'at the time', or equivalent."`
- **NOT auto-fixable** — date anchors require knowing which year the figure is from.

**Exempt:**
- Generic ranges ("typically 5-15%")
- Historical facts with built-in dates ("In 2019, revenue was...")
- Course-coined framework terms ("Rs 12 LPA" as a worked example)

**Severity:** SOFT WARN (flag-only, no auto-fix).

### V-ST1 — Fourth-Wall Break Detection (v10.0.0)

**Trigger:** After MD generation (Step 4.5), runs alongside V1-V18.

Grep all story screen text blocks (excluding MCQ options, headings, blockquotes) for banned fourth-wall patterns:

**Patterns to match (case-insensitive):**
- `Here is the number`
- `Here's the number`
- `Here is the`
- `What you just read`
- `Before this course`
- `You've done the work`
- `should change how you think`
- `The only test that matters`
- `Now step up and prove it`
- `The question is whether you will recognize it`
- `As we saw earlier`
- `As mentioned earlier`

**If found:**
- Log: `"V-ST1: Screen {index} contains fourth-wall break '{pattern}' in: '{sentence}'. Rewrite to maintain journalistic/storytelling voice."`
- **Auto-fix:** Rewrite the offending sentence to remove the fourth-wall address while preserving the narrative meaning. Replace reader-addressing patterns with third-person journalism or factual statements. Example: "Here is the number that should change how you think" → state the number directly as a factual observation.
- Max 2 rewrite attempts per screen.

**Rationale:** Fourth-wall breaks pull the learner out of the story and into "I'm taking a course" mode. Scrollytelling requires unbroken narrative immersion — the learner should feel like reading longform journalism, not being lectured.

**Severity:** HARD GATE (auto-fix). Cross-referenced with `banned-phrases.md` items 34-44.

### V-ST2 — MCQ Correct-Answer Position Redistribution (v10.0.0)

**Trigger:** After JSON conversion (Step 5), runs alongside V10-V16.

After all MCQs are generated (both standalone and glossary practice), count correct-answer positions across the entire course.

**Step 1 — Count:**
For each MCQ block (`"type": "mcq"`), record the `correct` index (0-3). Build a frequency map: `{position → count}`.

**Step 1b — Standalone MCQ sub-count:**
Separately count standalone MCQ blocks only (NOT glossary practice MCQs). A standalone MCQ is a block with `"type": "mcq"` that is NOT inside a glossary `practice` object. Record their correct positions in a separate list.

**Step 2 — Evaluate:**
**Rule A (all MCQs):** Calculate the total number of MCQs. For each position, calculate `count / total`. If any position exceeds 40%: FAIL.
**Rule B (exactly 3 standalone MCQs):** If there are exactly 3 standalone MCQs, all three MUST have `correct` at DIFFERENT positions. Even if each position is only 33% (passing Rule A), repeating a position among the 3 standalone MCQs is a FAIL. This is the standard course format and the most common clustering pattern.

If Rule A or Rule B fails:

**Step 3 — Auto-redistribute:**
1. Identify the overrepresented position(s) and underrepresented position(s).
2. For each MCQ that has its correct answer at an overrepresented position (starting from the last MCQ in the course, working backward):
   a. Select the most underrepresented position as the new correct-answer position.
   b. Swap the option at the current correct position with the option at the target position.
   c. Update the `correct` index to the new position.
   d. Re-count. If all positions are now ≤40%, stop.
3. Verify: after redistribution, no position exceeds 40%.

**If redistributed:**
- Log: `"V-ST2: Redistributed correct-answer positions. Before: {old_distribution}. After: {new_distribution}. {count} MCQs had options swapped."`

**If already balanced:**
- PASS silently.

**Important:** Only swap option ORDER within the MCQ — never change option TEXT or the correct answer's content. The `explain` field remains unchanged (it explains why the correct answer is correct, regardless of position).

**Severity:** HARD GATE (auto-fix). Cross-referenced with structural check C61.

### V-ST3 — MCQ Correct-as-Longest Bias (v10.4.0)

**Trigger:** After JSON conversion (Step 5), runs alongside V-ST2.

LLMs systematically over-explain correct answers, making them the longest option. This is the single most common MCQ quality failure — caught in 7/8 courses during the scrollytelling rework and 3/5 courses during GenAI Leadership batch production.

**Step 1 — Per-MCQ check:**
For each MCQ block (standalone `"type": "mcq"` AND glossary `practice` objects):
1. Compute character length of each option
2. Identify if the correct option (at index `correct`) is the SOLE longest (no ties with other options)
3. Calculate delta: `correct_length - next_longest_length`
4. If sole longest AND delta > 5 chars: FLAG this MCQ

**Step 2 — Systematic bias check:**
Count how many MCQs have the correct answer as sole longest (any delta). If this count exceeds 50% of all MCQs in the course: HARD FAIL.

**Auto-fix:**
For each flagged MCQ (delta > 5):
1. First attempt: shorten the correct answer by removing trailing qualifiers, parenthetical examples, or redundant phrases. Target: within 5 chars of next longest.
2. If shortening would lose meaning: lengthen the next-longest distractor by adding plausible qualifying detail.
3. Verify: after fix, correct answer is NOT the sole longest, or delta ≤ 5 chars.

**If fixed:**
- Log: `"V-ST3: Screen {N} MCQ — correct option was {delta} chars longer than next longest. Rebalanced to {new_delta} char delta."`

**If systematic bias fixed:**
- Log: `"V-ST3: Systematic bias — correct was longest in {count}/{total} MCQs ({pct}%). Rebalanced to {new_count}/{total}."`

**Important:** Never change the MEANING of the correct answer. Trim verbosity, not substance. The `explain` field covers the "why" — the option itself should be concise.

**Severity:** HARD GATE (auto-fix). Cross-referenced with hook script `check-mcq-balance.sh`.

### V19 — Description Length Enforcement (v10.4.0)

**Trigger:** After JSON conversion (Step 5), runs alongside V10-V18.

Course descriptions propagate to 4+ locations (JSON metadata, cover screen, MD header, SQL INSERT). Catching length violations at creation time prevents expensive triple-sync fixes during audit.

**Check:**
Read `metadata.description` from the JSON output. Count characters.

**Pass:** 80-120 characters (inclusive).

**Fail (>120 chars):**
- Log: `"V19: Description is {len} chars (max 120). Trimming at last complete clause."`
- **Auto-fix:** Find the last sentence boundary (`. `) or clause boundary (` — `, `, `) before the 120-char mark. Trim there. If the result is still >120, hard-cut at 120 and append `.` Sync the trimmed description to `screens[0].description` (per C6).

**Fail (<80 chars):**
- Log: `"V19: Description is {len} chars (min 80). Flagging for manual extension."`
- **NOT auto-fixable** — cannot safely generate marketing copy. Flag for user review.

**Sync after fix:**
1. Update `metadata.description` in JSON
2. Update `screens[0].description` in JSON (C6 sync)
3. Update the description line in the MD cover section

**Severity:** HARD GATE for >120 (auto-fix). SOFT WARN for <80 (flag only).

---

## Retry Logic

After auto-fixes are applied (V1, V2, V3, V5, V6, V7, V7b, V8, V9, V10, V13, V15, V16, V19, V-ST1, V-ST2, V-ST3):
1. Re-validate ONLY the fixed screens against ONLY the checks that failed
2. Maximum 2 total validation cycles (initial + 1 retry)
3. If a screen still fails after 2 cycles: flag it in the summary but continue to Step 5

Do NOT retry V4 (sentence fragments), V11 (staccato fragments), V12 (global accessibility), or V14 (concept-before-story) — they are flag-only with no auto-fix.
V15 (glossary block count) is retried after auto-fix to verify the split produced exactly 1 glossary block per screen.
Do NOT retry V9 for >60 warnings — those are flag-only with no auto-fix. Only V9 >75 auto-splits are retried.

---

## Output Format

After validation completes, output a summary visible to the user:

```
INLINE VALIDATION SUMMARY
─────────────────────────
Screens parsed: {N}
Clean on first pass: {N}
Auto-fixed: {N} (screens {list with check names})
Flagged for review: {N} ({details})
```

If ALL checks pass on first attempt, output a single line instead:
```
Inline validation: all {N} screens clean ✓
```

---

---

## Narration Bible Checks (V-NR1 through V-NR5)

> Source: `shared/narration-bible.md`. These checks enforce narration quality patterns extracted from hand-reworked courses.

### V-NR1: Sensory Opening Anchor (Principle 1.1)

**Scope:** Screen 1 only (orient screen). Concept Sprint only.

Screen 1, sentence 1 must contain ≥2 of 5 sensory anchor types: DATE (year/month/day), PLACE (named city/building/event), PERSON (named individual with qualifier), AMOUNT (specific number with unit), PHYSICAL DETAIL (tactile/visual element like "carpet", "photograph", "terminal").

**If fewer than 2 found:**
- Log: `V-NR1`, screen 1, first sentence, list of anchor types found
- SOFT WARN — flag for editorial review, no auto-fix (opening voice is editorial judgment)

### V-NR2: Time-Bomb Sentence (Principle 1.3)

**Scope:** Screen 1 only (orient screen). Concept Sprint only.

Screen 1's final bold block or final sentence must contain foreshadowing language.

**Detection:** Check for past-conditional ("would later", "would soon", "would convene"), time-jump ("X months later", "X years later", "by [future date]"), or stark factual contradiction (sudden negative after positive opening).

**If not found:**
- Log: `V-NR2`, screen 1, last sentence/bold
- SOFT WARN — flag only

### V-NR3: Named Protagonist Presence (Principle 2.2)

**Scope:** All story screens (orient, story_bridge, framework, resolution). Both archetypes.

Every story screen must have a named person (proper noun identifying an individual) OR use "you/your" framing as protagonist.

**Detection:** For each story screen, scan all text blocks for proper nouns (capitalized multi-word sequences excluding company names already tagged in spec) or second-person pronouns (you, your, you're).

**If neither found on a story screen:**
- Log: `V-NR3`, screen index, "No named protagonist or you/your framing"
- SOFT WARN — flag only

### V-NR4: Bold Closer Quality — Cocktail Party Test (Principle 5.1)

**Scope:** All screens with bold closing blocks (story_bridge, framework, resolution). Both archetypes.

Bold closers must be quotable insights (reversal, contradiction, analogy), not summaries.

**Detection:** Flag bold closers that match summary patterns:
- Starts with "This is why..." or "This shows..." or "This demonstrates..." or "This illustrates..."
- Contains "is important" or "is essential" or "is crucial" or "is key"
- Contains "In conclusion" or "To summarize" or "In summary"

**If found:**
- Log: `V-NR4`, screen index, offending bold text
- Auto-fix: Rewrite the bold closer as a negation/reversal construction ("X is not Y. It is Z.") while preserving the screen's core insight. Max 2 rewrite attempts.

### V-NR5: No Invented Acronym Frameworks (Principle 12.5)

**Scope:** All screens. Both archetypes. **Severity:** HARD GATE.

Invented framework acronyms where each letter maps to a word (CASH = Confirm-Analyze-Stress test-Hedge, PROVE, STRETCH, COVER, etc.) are the #1 LLM generation failure. Real-world acronyms (SWOT, PESTEL, VRIO) are exempt.

**Detection:** Scan for uppercase sequences ≥4 letters followed by a colon or dash, then a list where each item starts with the corresponding letter. Also scan for bold uppercase words that appear as framework names but don't match any real-world framework in the spec's research summary.

**Known exemptions:** SWOT, PESTEL, VRIO, CAPM, BCG, GE, CAGE, AAA, OLI, STP, 4P, 5C, and any framework explicitly named in the spec's Research Summary.

**If found:**
- Log: `V-NR5`, screen index, acronym found, "Invented framework acronym — convert to numbered list"
- Auto-fix: Replace acronym label with descriptive name, convert to numbered list format. HARD GATE — must not proceed with acronym intact.

---

### V-NR7: Research Density Check (v10.8.0)

**Scope:** All story screens. Both archetypes. **Severity:** SOFT WARN.

Count unique company names, domain metrics (numbers with cited sources), and glossary terms across the entire course.

**Thresholds:**
- Companies mentioned: WARN if > 4 unique companies across all screens
- Metrics cited: WARN if > 8 unique statistics across all screens
- Glossary cards: WARN if > 5 glossary cards total
- Metrics per screen: WARN if any single screen has > 3 cited statistics

**If exceeded:**
- Log: `V-NR7`, total counts, "Research density exceeds curation thresholds — review whether all artifacts are narratively necessary"
- SOFT WARN — flag for review, do not auto-fix

---

### V-NR6: Glossary Term Legitimacy Check (v10.7.0)

**Scope:** All `terms_in_context` screens. Both archetypes. **Severity:** HARD GATE.

For each glossary term (extracted from the `term` field in the glossary block):

1. **Spec cross-reference:** Check if the term appears in the spec's Research Summary or Glossary appendix. If the term does NOT appear in any research source, FLAG as potentially fabricated.

2. **Compound-noun heuristic:** If the term is 3+ words AND contains a hyphenated compound or title-cased multi-word phrase that is NOT a known framework name, FLAG as potentially fabricated. Known compound patterns that are REAL: "Cost to Company", "Portfolio at Risk", "Joint Liability Group", "Effective Tax Rate". Suspect patterns: "[Adjective]-to-[Noun] [Noun]", "[Noun] [Noun] [Noun]" where the combination is novel.

3. **Substitution check:** Cross-reference against the spec's glossary appendix. If the term in the generated course does NOT match any term in the spec's approved glossary list, HARD GATE FAIL — the generator substituted or invented a term.

**If flagged:**
- Log: `V-NR6`, screen index, term name, "Term not found in research sources — verify this is established domain terminology"
- HARD GATE — do not proceed until term is verified or replaced with a real term

**Why this exists:** Audit of 160+ glossary terms across 32 courses found ~18 fabricated terms — compound nouns like "Competence-to-Compatibility Shift", "Strategic Refusal", "Opacity Premium" that don't exist in any domain literature. The LLM understands real concepts but coins professional-sounding labels that learners cannot Google.

---

### V-NR8: AI Style Pattern Scanner (v10.17.0)

**Scope:** All body text blocks, both archetypes. **Severity:** Mixed — Tier 1 auto-fix for deterministic cases, SOFT WARN for judgment cases.

Consolidates 9 pattern families from the humanizer skill's "Signs of AI writing" audit. Runs cross-screen (file-level, not per-screen) because these patterns accumulate rather than cluster.

**Pattern families (9):**

| # | Family | Detection regex (case-insensitive) | Action |
|---|---|---|---|
| 1 | Superficial -ing endings | `\b(highlighting\|underscoring\|emphasizing\|showcasing\|reflecting (?!on)\|symbolizing\|encompassing\|fostering\|cultivating)\s\w+ing\b` (flags only when the -ing word is followed by another participial phrase) | **SOFT WARN** — flag for rewrite to concrete subject-verb |
| 2 | Copula avoidance | `\b(serves as\|stands as\|marks a\|represents a\|boasts a\|features a\|offers a)\b` | **Tier 1 auto-fix**: `serves as` → `is`; `stands as` → `is`; `marks a` → `is a`; `represents a` → `is a`; `boasts/features/offers a` → `has a` |
| 3 | Negative parallelisms | `\bnot only\b[^.]{1,80}\bbut\b` OR `\bit'?s not just\b[^.]{1,60}\bit'?s\b` OR `\bnot merely\b[^.]{1,60}\bbut\b` | **SOFT WARN** — flag for direct-statement rewrite |
| 4 | Collaborative chatbot artifacts | `\b(I hope this helps\|Certainly!\|You'?re absolutely right\|Would you like me to\|let me know if\|hope this is helpful)\b` | **Tier 1 auto-delete** — NEVER in course prose |
| 5 | Sycophantic tone | `\b(Great question!\|That'?s an excellent point\|Excellent insight\|Wonderful observation\|You make a great point)\b` | **Tier 1 auto-delete** |
| 6 | Filler phrases | Table-driven substitution: `in order to`→`to`; `due to the fact that`→`because`; `at this point in time`→`now`; `in the event that`→`if`; `has the ability to`→`can`; `it is important to note that`→(delete + capitalize next word); `for the purpose of`→`to` | **Tier 1 auto-fix** (deterministic substitutions) |
| 7 | Excessive hedging | `\b(could potentially\|possibly might\|may possibly\|might potentially\|perhaps possibly)\b` | **Tier 1 auto-fix**: drop the redundant hedge (`could potentially` → `could`; `possibly might` → `might`) |
| 8 | Curly quotation marks | `[\u2018\u2019\u201C\u201D]` (U+2018 ‘, U+2019 ’, U+201C “, U+201D ”) | **Tier 1 auto-fix**: replace with ASCII `'` or `"`. EXCEPTION: inside single-quoted JS strings the curly apostrophe ’ is intentional (existing V-NR rule for string safety). Apply only to prose contexts (MD body text), not to code blocks or JSON fields. |
| 9 | AI-puffery keywords (v10.17.0 additions — absorbs 14 humanizer keywords) | `\b(indelible mark\|broader movement\|evolving landscape\|active social media presence\|leading expert\|renowned for\|must-visit\|nestled in\|journey toward\|in the heart of\|stands testament\|exciting times ahead\|future looks bright\|step in the right direction)\b` | **SOFT WARN** — promotional/AI-slop phrasing; flag for rewrite with concrete specifics |

**Pass criterion:** zero Tier-1 violations remaining after auto-fix pass; ≤3 SOFT WARNs across the course (triage remaining manually).

**Fail message template:** `V-NR8: Screen {N} family {family} — pattern '{match}' detected. {action}: {suggested_fix}`

**Fix tier logic:**
- Auto-fix runs FIRST (families 2, 4, 5, 6, 7, 8) — deterministic, safe, no judgment required
- Re-grep after auto-fix to confirm clean
- SOFT WARN remaining violations (families 1, 3, 9) go into the audit report for human triage
- Never auto-fix SOFT WARN families — they require rewriting to concrete alternatives, which needs content-level judgment

**Why this exists:** the humanizer skill identifies 24 signs of AI writing. Atom-creator already covered 7 patterns (AI vocabulary, boldface discipline, emojis, em-dashes, etc.). V-NR8 closes 9 more gaps in a single scanner rather than 9 separate checks. Prior to v10.17.0, course prose passed V1 banned-phrases but still contained "serves as a testament to," "it's not just X, it's Y," and "in order to achieve this" — all subtle AI-tells bypassing the scanner.

**Reference:** Wikipedia "Signs of AI writing" via `/humanizer` skill. The 14 AI-puffery keywords (family 9) were specifically flagged by the 2026-04-19 humanizer audit as not present in the existing banned-phrases list.

---

## Single-Screen Mode

When called from partial regen (`shared/partial-regen.md`) with a single screen:
- Run all checks (V1-V19, V-ST1, V-ST2, V-ST3, V-NR1 through V-NR8) on just that screen's text
- Auto-fix as normal (max 2 cycles)
- Return pass/fail status + list of fixes applied
- Do NOT output the full summary block — partial regen outputs its own summary
