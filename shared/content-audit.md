# Content Audit Agents — Agents 1, 2, 3, 4, 5

**HARD GATE:** These audits MUST pass before visual/game generation begins. Prevents wasting Gemini API credits on visuals for content that needs revision.

> **Refine mode:** When invoked from `/atom-creator:refine`, agents receive `REFINE_MODE: true`.
> In refine mode: (a) all checks run regardless of spec status, (b) violations are tagged with
> `version_introduced` from the check-to-version mapping in `refine.md`, (c) Agent 5 web
> verification can be skipped if user opts out (batch speed optimization — structural factual
> checks still run).

Launch Agents 1-5 in parallel after course generation (or during `:refine` Step 5).

---

<!-- AGENT_1_MCQ_RIGOR -->
## Agent 1: MCQ Rigor Auditor

**Input:** Course JSON (all MCQ blocks) + full course content for reference

**Process:**

**Step 1 — Failure Certificate Test (per distractor):**
1. For each MCQ in the course, write a Failure Certificate for every distractor:
   - "Option [X] is wrong because [specific reason referencing course content]"
2. Flag any MCQ where:
   - A distractor's failure certificate uses "less complete," "not the best," "not as comprehensive," or "technically true but..."
   - Two options have overlapping failure certificates (same underlying reasoning)
   - The correct answer is distinguished only by jargon, not substance

**Step 1b — Precision Overlap Check:**
For each pair of options within an MCQ: do two options diagnose the same failure at different precision levels?
- Test: "If a learner understood option A, would they necessarily also consider option B correct?"
- Example FAIL: "flywheel stalled at Stage 2" vs "functional silos restricted movement" — same diagnosis, one more specific. A learner who grasps the specific version would also see the general version as correct.
- Example PASS: "flywheel stalled at Stage 2" vs "over-invested in a single function" — genuinely different diagnoses with different failure certificates.
- This complements the overlapping failure certificate test (Step 1) — Step 1 catches identical reasoning, Step 1b catches same-diagnosis-different-precision.

**Step 2 — Stem Clarity Check:**
3. Flag any MCQ stem that uses superlatives ("best," "most critical," "primary," "most accurately") where two options could reasonably be ranked as roughly equal
4. Flag any stem that asks two questions at once ("what AND why") — each MCQ must ask one clear question

**Step 3 — Distractor Typing Check:**
5. For each distractor, assign a type from the 5-type taxonomy:
   - **Misconception** — confuses two similar concepts
   - **Inverted Logic** — reverses cause/effect or applies framework backwards
   - **Partial Truth** — factually correct but answers a different question
   - **Metric Confusion** — wrong metric, denominator, or unit of analysis
   - **Scale/Scope Error** — right idea at wrong level (company vs territory, strategic vs operational)
6. Flag any distractor that doesn't fit a type (likely too obvious or too subtle)
7. Flag any MCQ where all 3 distractors are the same type (diversify)

**Step 4 — Aptitude MCQ Methodology Check (Screen 8 only):**
8. For each Screen 8 MCQ, verify exactly ONE valid calculation approach exists
9. Flag any MCQ where two different valid methods would produce two different distractor values (overlapping methodology — the most common aptitude MCQ defect)
10. Verify each wrong numeric answer traces to a specific, identifiable calculation error (list the error)
11. Verify math requires at most ONE step — flag multi-step calculations

**Step 5 — Mirror-Perspective Check (comparison MCQs):**
12. For any MCQ whose stem compares two entities (Company A vs B, Method X vs Y), check: does any distractor describe the correct answer's insight from the opposing entity's viewpoint?
13. If yes, the MCQ is ambiguous — flag as FAIL. Both options are factually correct; the learner who picks the mirror option has understood the data correctly but gets marked wrong.
14. Example: "Parle earns more per outlet but reaches fewer stores" (A) vs "Britannia traded per-outlet yield for greater coverage" (D) — same insight, different viewpoint. Both correct. FAIL.

**Step 6 — Explanation Watertightness Check:**
15. Verify all ✓ explanations reference specific course content (not generic reasoning)
16. Verify all ✗ explanations state a definitive, non-hedged reason — flag any that use "while this is partially true," "this doesn't fully capture," or similar hedging
17. Check answer distribution: tally `correct` index values (0-3) across all MCQs — no single index should appear in more than 40% of MCQs

**Step 7 — Option Length Balance Check:**
18. For each MCQ, measure the character length of all 4 options.
19. FAIL if the correct answer is the longest option AND the delta exceeds 6 characters from the second-longest option. Fix suggestion: "Shorten correct answer by removing [clause]. Lengthen distractor [letter] by adding [context]."
20. WARNING if the correct answer is the longest option AND the delta is ≤6 characters. Note but do not fail — the MCQ is borderline.
21. COURSE-LEVEL FAIL if the correct answer is the longest option in >50% of MCQs. This is a systematic generation bias, not a per-MCQ issue. Fix: rebalance the worst offenders by shortening correct answers and lengthening distractors.

**Step 8: MCQ Proximity Audit**
For each MCQ, identify what concept it tests. Then verify that concept was taught in the immediately preceding 1-2 story screens. If the MCQ tests content from 3+ screens before it:
- Flag as HIGH priority
- Suggest either: (a) move the MCQ closer to its teaching content, or (b) add a brief recap in the preceding screen

**Step 9 — Fabricated Name Hard Gate (belt-and-suspenders with Agent 3)**
Grep ALL MCQ stems for proper nouns that are not company names from the course research section. Any character name (Meera, Vikram, Kiran, Nisha, Arjun, Priya, etc.) in an MCQ stem outside an explicitly designated `type: aptitude` screen is a FAIL. This duplicates Agent 3's check intentionally — fabricated names are the single most user-visible quality failure.

**Step 10 — MCQ Bridge Language Check (v6.0 update)**
Under v6.0 card architecture, Practice cards use the standardized title "Test Your Instinct" and do NOT need narrative bridge text on the card itself — the title signals test mode. However, the STORY card preceding a Practice card must end with a punchy bottom line that contextualizes the upcoming test. Glossary cards must be preceded by a fourth-wall bridge sentence at the top of the glossary card connecting the story to the formal term (see design-philosophy.md Principle 24, glossary fourth-wall bridge rule). FAIL if a Practice card has narrative intro text beyond the standardized title. FAIL if a Glossary card lacks a fourth-wall bridge sentence.

**Step 11 — Interview:Retention MCQ Quality (Blueprint mode only):**
22. If the spec contains a `## Course Blueprint` section, identify all MCQ blocks tagged as Interview:Retention in the blueprint.
23. For each Retention MCQ, verify it tests content from the PRECEDING 2-3 screens only. The retention MCQ must test recall of the most recent narrative content, not concepts from earlier in the course. FAIL if a Retention MCQ references concepts introduced 4+ screens prior.
24. Apply all standard MCQ quality checks (Steps 1-10) to Retention MCQs — they must meet the same rigor as regular MCQs.

25. **MCQ Correct-Answer Position Distribution (C61 — HARD GATE):**
    For each MCQ block in the JSON (standalone MCQs AND glossary practice questions), record the `correct` index (0-based position). Count how many MCQs have each position as correct.
    - FAIL if any single position (0, 1, 2, or 3) exceeds 40% of all MCQs. Example: 6 total MCQs → no more than 2 can have the same correct position.
    - FAIL message: "C61 HARD GATE: Correct-answer position {pos} used {count}/{total} times ({pct}%) — exceeds 40%. Redistribute correct answers."
    - Tier 1 auto-fix: Swap option order on affected MCQs, moving correct answer to underrepresented position. Update `correct` index accordingly.

25b. **Novice MCQ Calibration (v10.8.0):**
    For each MCQ, verify:
    (1) The stem describes a SCENARIO the novice can picture, not a definition recall question. Flag stems that start with "Which of the following best describes..." or "What is the definition of..."
    (2) Distractors represent novice misconceptions — the wrong answers a smart beginner would give, not the wrong answers a careless expert would give. Flag if all 3 distractors are obviously wrong to anyone who read the preceding screens.
    (3) The explanation TEACHES — it doesn't just say why the correct answer is right, it explains why the novice's likely wrong answer is wrong. Flag explanations under 40 words (likely too brief to teach).
    (4) No MCQ tests knowledge from OUTSIDE the course content. Flag if the correct answer requires information not taught in the preceding 2-3 screens.
    SOFT WARN for each violation.

**Output:** Per-MCQ PASS/FAIL with:
- Failure certificates written (Step 1)
- Precision overlap analysis (Step 1b)
- Distractor type assignments (Step 3)
- Specific failure reasons for any flagged MCQ
- Aptitude methodology analysis for Screen 8 MCQs (Step 4)
- Option length measurements and balance status (Step 7)
- MCQ proximity analysis (Step 8)
- Fabricated name scan results (Step 9)
- MCQ bridge language audit (Step 10)
- Interview:Retention proximity analysis (Step 11, blueprint mode only)
- MCQ correct-answer position distribution (Step 25, C61)

<!-- /AGENT_1_MCQ_RIGOR -->

---

<!-- AGENT_2_INTERVIEW -->
## Agent 2: Interview Card Auditor

**Input:** Course JSON (interview screen only) + full course content for reference

**Process:**
1. **Standard Card Structure (HARD GATE):** Verify the interview screen has exactly 3 blocks:
   - `blocks[0]`: text block with `variant: "heading"` and `value: "The Real Question"`
   - `blocks[1]`: text block with `value: "You've done the work. You know the framework. Now step up and prove it."`
   - `blocks[2]`: interview block with `type: "interview"`
   FAIL if heading is not "The Real Question", motivational text is missing, or interview block is not present.
2. **Standard Topics Text (HARD GATE):** Verify `topics` array in the interview block contains exactly: `["This is what interviewers actually ask.", "Record your answer to get AI-powered feedback. Upload your CV for a personalised ideal answer."]`. No custom question text. FAIL if topics contain anything other than the standard text.
3. **Guidance Field Check (HARD GATE):** Verify the `guidance` field in the interview block is a non-empty string containing 3-5 evaluation criteria that reference specific framework concepts from the course. Empty string = FAIL. Generic guidance without course-specific terms = WARN.
4. **Scores Array Check:** Verify `scores` contains 3 evaluation dimension objects, each with `"score": 0`.
5. **Name Field Check:** Verify `name` field is non-empty and course-specific (not generic like "Interview" or "Oral Assessment").
6. **No Reflection Labels:** Grep the entire course for "Reflection Question", "Reflection Prompt", "Reflection:", "pause and reflect", "take a moment to think" — any found = FAIL.
7. **No Custom Question Text:** Grep the interview screen MD for any question-like text (sentences ending in `?` that are not part of the standard text). WARN if found.

**Archetype handling:**
- **Concept Sprint:** Interview screen is REQUIRED as the last screen.
- **Hands-On:** Interview screen is REQUIRED as the last screen (no longer optional).

**Steps 8-9 — Multi-Interview Quality (Blueprint mode only):**
8. If the spec contains Interview:Applied entries, verify each uses a `text_question` block with standard guidance field. Standard card rules do not apply to mid-course Interview:Applied blocks — those still use custom questions.
9. If the spec contains Interview:Current-Affairs entries, same check as step 8.

**Step 10 (HARD GATE): Voice Interview Block Check:**
- Find the last screen with `"type": "interview"`. Check its `blocks` array. FAIL if the interview content block uses `"type": "text_question"` instead of `"type": "interview"`.
  - Required voice interview block fields: `"name"`, `"topics"` (standard text array), `"scores"` (3 score label objects with `"score": 0`), `"feedback"`, `"guidance"` (3-5 evaluation criteria).
  - FAIL message: "Interview block uses `text_question` — must convert to `interview` block for voice recording."
- **Both archetypes:** Interview is required. Apply this check unconditionally.

**Step 11 — Genre Opening Compliance (SOFT WARN):**
Read the spec's `## Genre Direction > Genre` field (or auto-map from Framing Direction if legacy). Check Screen 1 against the genre's opening template from `genre-system.md`:

| Genre | Screen 1 Check |
|-------|---------------|
| Literary Journalism | Does sentence 1 name a person + place + date/time? |
| Investigative Journalism | Does Screen 1 present a plausible surface metric in the company's own language? |
| Industry Epic | Does Screen 1 contain a sentence naming 3+ entities? |
| Corporate Biography | Does Screen 1 describe an institutional moment (specific decision/meeting/event inside the company)? |
| Geopolitical Analysis | Does Screen 1 have classified-feeling specificity (dates, codenames, institutional counts)? |
| Behavioral Science | Does Screen 1 pose a cognitive trap or question that activates a bias? |
| Legal/Regulatory Thriller | Does Screen 1 present a spectrum or grey zone with a specific case? |
| Practitioner Memoir | Does Screen 1 have sensory scene-setting + jargon bridge? |

If the opening doesn't match the genre template: SOFT WARN with specific guidance on what the genre requires.

If no genre field in spec (legacy course): SKIP this check. Log: "No genre field — genre opening check skipped."

**Step 12 — Genre Pacing Compliance (SOFT WARN):**
Check the screen sequence against genre-specific pacing expectations:

| Genre | Pacing Check |
|-------|-------------|
| Literary Journalism | Framework appears AFTER midpoint? |
| Behavioral Science | Concept/bias named by Screen 2? |
| Industry Epic | At least 3 companies mentioned across story cards? |
| Corporate Biography | Internal cultural artifacts (meeting rituals, internal language) present? |
| Geopolitical | Structural mechanism named + inevitability sentence present? |
| Legal/Regulatory | Specific statutory provision/case cited? |
| Practitioner Memoir | At least 3 field-specific operational details (jargon + translation)? |
| Investigative | Progressive layer-peeling structure (surface → crack → evidence → pattern)? |

If pacing doesn't match genre expectations: SOFT WARN with specific guidance.

**Output:** PASS/FAIL with specific failure reasons

<!-- /AGENT_2_INTERVIEW -->

---

<!-- AGENT_3_SURFACE -->
## Agent 3: Surface Consistency Auditor

**Input:** Course JSON (all screens)

**Prerequisite:** Read `.claude/generation-guide/banned-phrases.md` to load the full banned phrases grep list. Read `.claude/generation-guide/audience-posture.md` to load the specialized-vocabulary first-use checklist for C72.

**Process:**
1. **Number system scan:**
   - Extract all numbers with units (currency, counts, percentages)
   - Classify each as Indian (lakh/crore), International (million/billion), or neutral (%, ratios)
   - Flag any course using both systems without Mixed-Declared justification
   - Flag inconsistent formatting (e.g., "Rs 2000 crore" vs "Rs 2,000 Cr")
   - **MANDATORY GREP** — these mixing patterns are missed most often:
     - Grep for `million` and `lakh` in the same file — if both appear, flag unless one is inside a foreign-currency context (e.g., "$32 million" alongside "₹25 lakh" is acceptable; "13 million kirana stores" alongside "₹25 lakh" is NOT)
     - Grep for `billion` and `crore` in the same file — same rule
     - Revenue in crore but counts in million (or vice versa) is the most common violation
2. **Header naturalness scan:**
   - Extract all headings/bold text used as section headers
   - Flag ALL-CAPS headers that are content-type labels (not proper nouns)
   - Flag colon-introduced noun phrases (THE X: pattern)
   - Flag single-word company name headers without context
3. **Banned pattern scan:**
   - Grep all banned phrases from `.claude/generation-guide/banned-phrases.md`
   - Flag with exact screen index and text location
   - **MANDATORY SPOT-CHECK** — these are missed most often across audits. Grep each individually:
     - `FLIP:` / `THE FLIP:` / `OUTSIDE VIEW:` as section labels (#19)
     - `The gap:` as a bold label (#26)
     - `By the end, you'll` / `By the end you will` (#22)
     - `Most people assume [X]. The reality is` (#4)
     - `[N] things you now know:` (#20)
     - `[Role] — not a [lesser role] who happens to` (#12)
     - `You are being considered for a [Role]` (#21)
     - `Imagine...` / `Picture this...` as scene-entry openers (#23)
     - Triple-repetition anaphora chains: three consecutive short sentences starting with the same word/phrase ("Not their X. Not their Y. Not their Z." / "Same X. Same Y. Same Z." / "It wasn't X. It wasn't Y. It wasn't Z.") (#Pattern 8)
4. **Units scan:**
   - Verify metric units used throughout (meters, kilograms, etc.)
   - Flag any imperial units (miles, pounds-weight, Fahrenheit)
5. **Card/Screen Number References:**
   Grep for these patterns in all learner-facing content (not metadata/comments):
   - "Card [0-9]", "Screen [0-9]", "from Card", "from Screen"
   - "previous card", "next card", "the previous screen", "the next screen"
   - "as we saw in", "as we discussed in", "as we learned in", "as mentioned earlier"
   Zero matches required. Any match = FAIL.
   Exception: "Think back to that Friday morning" style mood callbacks are PERMITTED (atmosphere, not knowledge dependency).
6. **Bridge Paragraph Check:**
   For every MCQ block, interview block, and activity block, check that a 2-3 sentence narrative bridge paragraph precedes it. The bridge must contextualize what the MCQs will test within the story — not just announce testing. If the content jumps directly from a screen header or previous content to "Q1:" or an MCQ question without any transitional narrative, flag as HARD GATE. Missing bridge paragraph before any MCQ, interview, or activity block = FAIL. Single-sentence bridges = FAIL. Not a warning. Also flag colon-separated definition lists on framework screens (e.g., "X: All decisions flow through one node") = FAIL — see design-philosophy.md Principle 2.
6b. **Bridge Quality Check (WARN):**
    The bridge paragraph must do BOTH:
    (a) Reference what the learner just learned (backward link — names a concept, company, or insight from preceding screens)
    (b) Set up what they're about to be tested on (forward link — frames the challenge)
    WARN if bridge is a generic meta-sentence: "Let's test your understanding", "Time to check what you've learned", "See if you caught the pattern", "Now let's see if you understood"
    These are meta-narration bridges — they announce testing instead of contextualizing it.
    PASS example: "You've seen how Britannia's coverage hid a distribution gap. The question is whether you can spot the same pattern."
    FAIL example: "Now let's see if you understood the material."
    **Hands-On archetype adaptation:**
    For hands-on courses, the bridge check applies to `try_it` screens (checkpoints):
    - Each `try_it` screen must have 1-2 sentences of context BEFORE the practice task or MCQ
    - The context must reference the concept or demo from the preceding screen (backward link)
    - Generic instructions like "Now try it yourself" or "Practice what you learned" are WARN-level violations
    - PASS example: "You configured the schema markup in the demo. Now apply the same pattern to a product page — but watch for the nested itemScope trap."
7. **Fabricated Name Check:**
   Grep MCQ stems for third-person character names ([Name]'s team, [Name] manages, [Name] is responsible for, etc.). FAIL if any found outside APTITUDE calculation context. All MCQs must use "you/your" framing — the learner is the protagonist. Also scan for clause-level detection: "[Name] decides", "[Name] wants", "[Name] needs", "[Name] asks". Also scan ALL story screen prose for ANY "You are" pattern (v9.0.1 — expanded from physical-placement only). FAIL if "You are [role/verb]" appears on any story screen. "You are" is banned on ALL story screens — use third-person journalism. Exemptions: MCQ stems, interview questions, resolution synthesis, bridge direct-address questions.
8. **Glossary Format Check:**
   Grep for `### GLOSSARY CARD`. FAIL if any found. All glossary definitions must use blockquote format: `> **Term** — Category\n> Definition...` woven into narrative. Zero header-style glossary cards.
9. **Company Focus Check (Tiered):**
   Count distinct company names used in narrative content across all screens. Classify each by depth:
   - **Primary:** Company appears on 3+ screens with narrative detail (named people, specific metrics, decisions described). These are case study companies.
   - **Secondary:** Company appears on 1-2 screens with some narrative detail (named with specific data but not a sustained case study).
   - **Tertiary:** Company mentioned once in passing, comparison, or list context.

   Thresholds (per structural-checks.md Authority Table C12):
   - HARD GATE if > 3 Primary companies (unless genre is Industry Epic — see genre override in C12)
   - SOFT WARN if Primary + Secondary > 5
   - No limit on Tertiary mentions

   All Primary and Secondary companies must trace to the spec's Research Summary. Flag any Primary/Secondary company not in the Research Summary as HIGH: `"Case study company '{name}' not in spec research — verify or remove."`

   Report as classification table:
   ```
   | Company | Classification | Screen Count | In Spec? |
   |---------|---------------|-------------|----------|
   | Airbnb  | Primary       | 4           | Yes      |
   | eBay    | Secondary     | 1           | Yes      |
   ```
10. **Story-Earned Glossary Check:**
    For each glossary blockquote (`> **Term**`), verify the term appears **bold** in narrative text ABOVE the blockquote (pattern: concept in story, then bold in narrative, then blockquote definition). FAIL if any term appears cold — i.e., its first appearance in the course IS the blockquote definition without prior bold narrative use.
10b. **Glossary Linearity Check:**
    For each screen, verify the first glossary blockquote (`> **Term**`) appears after at least 2 narrative paragraphs. No card may open with a glossary definition — the first content element must always be narrative text. FAIL if any screen opens with a glossary blockquote.
10c. **Story-Earned Sequence (Full Validation):**
    For each glossary term, validate the complete three-step sequence: (1) concept described in narrative context, (2) term appears in **bold** naturally in the text, (3) blockquote definition follows. All three steps must occur in this order. FAIL if any step is missing or out of order. A term whose first appearance IS inside its own definition blockquote has failed this check.

10d. **Glossary Term Legitimacy Verification (v10.7.0):**
    For each glossary term: (1) Extract the term name from the glossary block. (2) Check if this EXACT term appears in the spec's Research Summary or Glossary appendix. (3) If not found in spec: HARD GATE FAIL — "Glossary term '{term}' not in spec's approved glossary. Possible fabrication. Replace with established domain term." (4) If found in spec but definition diverges significantly from research source: SOFT WARN — flag for user review. This check catches the #1 LLM glossary failure: inventing professional-sounding compound nouns ("Competence-to-Compatibility Shift", "Strategic Refusal", "Opacity Premium") and presenting them as established terminology. Also apply the compound-noun heuristic: flag 3+ word terms with hyphenated compounds (X-to-Y) or title-cased multi-word phrases that are NOT known framework names.

11. **Heading Presence Check (ALL screens):**
    Every non-cover screen MUST have a visible H3 heading (`### {Title}`) as the first line of content after the `---` separator AND a `{"type":"text","font":"heading"}` block as the first element in `blocks` array (JSON). **No screen type is exempt** — MCQ, aptitude, challenge, first_apply screens get headings too. Only cover screens are excluded. FAIL if any non-cover screen lacks a heading.
    **Hands-On:** ALL screens including `try_it` and `setup` must have headings. FAIL if any non-cover screen lacks a heading.
12. **Bottom Line Check (Cocktail Party Quote Test — v10.1.0):**
    Every story, bridge, framework, and resolution screen must end with a **bold closing line** (`**...**`). The last non-blank line before the screen's `---` separator must be bold. FAIL if missing. Also FAIL if any screen ends with a bare single-word or phrase in heading format (e.g., just "How?" as the final line) — endings must be complete bold sentences.
    **Quality check (v10.1.0):** WARN if the bold closing line is a generic summary rather than a quotable insight. The **Cocktail Party Test**: would someone text this line to a friend? Could the learner throw this one-liner at a colleague and sound smart? Flag these patterns as WARN:
    - "This is why X matters" / "This is why X is important" / "This demonstrates why..."
    - "Understanding X is critical/essential/key for..."
    - "The key takeaway is..." / "The lesson here is..."
    - Any closing that summarizes the screen's content rather than creating a reversal, contradiction, or quotable insight
    PASS examples: "The most dangerous requirements are the ones nobody writes down." / "Hertz's website met every specified behavior and still could not go live."
    See design-philosophy.md Principle 32 (Cocktail Party Quotes).
    **Hands-On equivalent:** All `concept`, `demo`, and `recap` screens must end with a bold closing line. `artifact` screens end with the artifact itself (exempt). `tip` screens end with the tip callout (exempt). `setup` and `try_it` screens are exempt. FAIL if any narrative hands-on screen lacks a bold closing line.
13. **Scene Entry & Transition Check:**
    Grep all screen content for:
    - "You are sitting/standing/walking/looking/running/driving/waiting" (banned scene entries)
    - "Everything so far..." / "Up to this point..." / "What we've covered so far..." (self-undermining transitions)
    - "Start with..." / "Let's look at..." / "Now consider..." / "Walk back to..." / "Begin with..." / "Let's turn to..." as screen openers (meta-narration padding)
    FAIL if any match found.
14. **Stat Density Check:**
    Count standalone statistics (number + percentage or currency symbol) per story screen. Maximum 1 standalone stat per story screen. WARN if exceeded. Multiple stats per screen create data overload on mobile micro-learning formats.
15. **Braided Interleaving Audit (Braided Story courses only):**
    **Trigger:** Only runs when the spec's framing mode is `Braided Story`. Skip entirely for Framework-first, Story-first, and Hands-On courses.
    - Extract the Braided Pattern from the spec (story world + mapping vocabulary). Identify the story vocabulary terms (e.g., "cover identity", "mission portfolio", "handler network" for a spy tradecraft lens).
    - Grep every story/bridge screen for story vocabulary terms. Flag any screen where ZERO story vocabulary terms appear — the diagnostic lens has dropped. FAIL: "Screen {N} contains no story vocabulary — braided interleaving broken."
    - Flag any screen with >3 consecutive paragraphs without a story world reference — the interleaving rhythm is broken. FAIL: "Screen {N} has {count} consecutive paragraphs without story vocabulary — exceeds the 3-paragraph maximum."
    - FAIL if any story/bridge screen contains zero story vocabulary. The lens must persist throughout, not just the opening screens.
16. **Framework Narrative Check:**
    For each screen of type `deepen` or `framework`:
    1. Grep for colon-separated definition patterns: lines matching `^[A-Z].*:` followed by a one-sentence description (staccato list format)
    2. Check that each framework element has ≥2 sentences of narrative context — story, example, or character action
    3. FAIL if any framework element is a bare label:definition without surrounding narrative
    4. FAIL if >2 consecutive framework elements lack a connecting narrative sentence between them
    Message: "Framework element `{name}` uses staccato definition format — must include story or character example per Principle 2."
    Additionally, for each framework element name (extracted from `framework` block `items[].name` values, or from narrative patterns like "Gate N:", "Stage N:", "Step N:", "Phase N:"):
    - Check if the element name appears in **bold** in the narrative text on that screen.
    - WARN if a framework element name appears in narrative text without bold formatting.
    - Rationale: Principle 26 states "Capitalized framework terms always appear in bold at first use." Framework gate/stage/step names are the most important terms on the framework screen — they must be visually distinct.
    **Hands-On equivalent:**
    For hands-on courses, apply this check to `concept` screens:
    1. Concept screens must not be bare reference material (definition lists, bullet-point feature summaries)
    2. Each concept must have ≥2 sentences of contextual narrative — WHY this concept matters, WHEN to use it, or WHAT goes wrong without it
    3. FAIL if a concept screen reads like documentation (no narrative voice, no examples, no consequences)
    4. PASS example: explains the concept, shows a real-world failure case, then connects to the next demo
17. **Screen Title Quality Check (SOFT GATE):**
    For each screen with an H3 heading:
    1. Flag headings that are pure type labels: "The Framework", "The Contrast", "The Artifact", "Terms in Context", "Key Concepts", "The Interview"
    2. Flag headings using meta-narration: "What You Need to Know", "The Part That Matters", "Let's Review"
    3. WARN per violation: "Screen {N} heading `{title}` is generic — rewrite as a documentary chapter title (Vox Explained test: would this appear as a segment title on screen?)"
    4. PASS examples: "Why Iran Survived But Iraq Didn't", "Still Focus Beats Bloated Beats", "The Four Layers Beneath The Leader"

18. **Content Density Check (v6.0 card architecture):**
    For every screen in the JSON, count:
    - MCQ blocks (`type: "mcq"`): max 2 per screen
    - Glossary blocks (`type: "glossary"`): max 1 per screen (Principle 23)
    - Table blocks (`type: "table"`): max 1 per screen
    FAIL if any screen exceeds these caps: "Screen {index} has {count} glossary blocks — max 1 per screen (Principle 23)."
    Also FAIL if a screen has BOTH MCQ and glossary blocks: "Screen {index} has both MCQ and glossary blocks — these must be on separate cards (Principle 19)."
    See design-philosophy.md Principles 17, 19, 23.

19. **Single-Word Block Check:**
    Grep all text blocks in the JSON for blocks where the `text` field contains ≤2 words (after stripping markdown formatting like `**` and `*`). FAIL per violation: "Screen {index} has a single-word text block `{text}` — merge into adjacent paragraph."
    Common violators: "Drift.", "How?", "Why?", "Exactly.", "Wait."
    See banned-phrases.md Pattern #12.

20. **Narrative Screen Verbosity Check:**
    For every screen with type `orient`, `story_bridge`, `framework`, or `resolution`, count total words across all text blocks (excluding glossary/MCQ/table content). WARN if any screen exceeds 250 words. FAIL if any screen exceeds 350 words. Report the average across all narrative screens — WARN if average exceeds 180 words. Benchmark: beat-planning course averages 138 words/screen.
    See design-philosophy.md Principle 18.

21. **Standardized Card Title Check (v10.1.0):**
    For every screen containing MCQ blocks, extract the heading text. FAIL if the heading does NOT match: **"Test Your Instinct"**. Message: "Screen {index} MCQ card has heading `{title}` — must be 'Test Your Instinct' (Principle 20)."
    For every screen containing glossary blocks, extract the heading text. FAIL if the heading does NOT match: **"Remember This Term"**. Message: "Screen {index} glossary card has heading `{title}` — must be 'Remember This Term' (C47)."

22. **Story-Exercise Rhythm Check (v6.0 — NO EXCEPTIONS):**
    Walk through the `screens` array. For each screen, classify as STORY (orient, story_bridge, framework, terms_in_context, resolution, advanced_move), EXERCISE (contains mcq or glossary blocks), or OTHER (cover, interview). Flag ANY two consecutive EXERCISE screens. No exceptions — every exercise card must be preceded by a story card. FAIL per violation: "Screens {N} and {N+1} are both exercise cards with no story card between them (Principle 22)."

23. **No A/B/C/D Labels Check (v6.0):**
    For every `options` array in MCQ blocks AND glossary `practice` blocks, check if any option string starts with a letter prefix pattern: `^[A-D][).\s]` or `^[A-D] `. FAIL per violation: "Screen {index}, option `{text}` has A/B/C/D prefix — remove letter label (Principle 21)."
    Additionally check for verdict-word prefixes that reveal the answer:
    - FAIL if any option string matches: `^(Red|Green|Yellow|Blue|Orange|Pass|Fail|Correct|Wrong|Yes|No)\s*[—\-:]`
    - These act as answer labels — a verdict word at the start of an option reveals whether it is correct or incorrect before the learner reads the content.

24. **Practice/Glossary No Images Check (v6.0):**
    For every screen containing MCQ or glossary blocks, verify the screen has NO `media` array. FAIL if `media` exists: "Screen {index} is a practice/glossary card but has a `media` array — practice and glossary cards do not need images (Principle 25)."

25. **Table Content Renderability (SOFT):**
    For every `"type": "table"` block, scan all cell values in the `rows` array:
    - WARN if any cell contains color-word prefixes followed by an em-dash: `Red —`, `Green —`, `Yellow —`, `Blue —`, `Orange —`
    - WARN if any cell contains emoji characters (🔴🟢🟡🔵🟠) — these render inconsistently across platforms
    - Suggest: "Replace color references in table cells with plain descriptive labels. Colors cannot render in table text. Use the `status` field on scorecard blocks if color-coding is needed."

26. **Citation Context Check (SOFT):**
    Scan all narrative text blocks for proper noun patterns (capitalized two-word or three-word names that are not common nouns).
    For each name found:
    - Check if the FIRST occurrence in the course includes a qualifying phrase within the same sentence — a role ("former VP of Product at"), title ("author of"), affiliation ("at Harvard Business School"), or notable work.
    - WARN if a name appears for the first time with no qualifying context: "{Name} on Screen {N} has no introduction. Add a brief qualifier (role, company, or notable work) on first mention."
    - Permitted without context: names that appeared with context in a PREVIOUS sentence on the same screen.
    - Exempt: names inside source citations, the Research Summary appendix, or MCQ explanation text.
    - Rationale: Zero-experience learners do not know who "Marty Cagan" or "Shreyas Doshi" are. Every expert name needs 5-10 words of context on first mention.

27. **Topic Shift Bridge Check (SOFT):**
    For each narrative screen, identify paragraph boundaries (separated by `\n\n` in text blocks or by separate text blocks).
    At each paragraph boundary:
    - Extract the LAST sentence of paragraph N and the FIRST sentence of paragraph N+1.
    - WARN if paragraph N+1 introduces a new proper noun (person name, institution, study name) that was NOT mentioned in paragraph N or the screen heading.
    - Rationale: A new entity appearing without a bridge sentence creates a jarring topic shift. The reader needs connective tissue: "And the evidence backs this up:", "This pattern has been studied:", "One practitioner tracked this precisely:".
    - This is a SOFT check — the auditor flags, the user decides if the transition needs smoothing.

28. **Duplicate Concept Introduction (HARD GATE):**
    Build a map: for each `**bolded term**` across all screens, record every screen index where it appears in bold with a definition (blockquote OR inline explanation of 10+ words following the bold term).
    - FAIL if any bolded term appears with a definition on 2+ screens. A term should be DEFINED once and REFERENCED thereafter.
    - Permitted: The same term appearing in bold on multiple screens WITHOUT re-definition (referencing an already-defined concept is fine).
    - Permitted: Terms that appear in a glossary card AND in a preceding story screen (the story-earned pattern: story screen introduces, glossary card defines — this is the intended two-location pattern).
    - FAIL message: "'{Term}' is defined on Screen {N1} AND Screen {N2}. Define it once, reference it after."
    - Rationale: Duplicate definitions make the course feel repetitive and waste screen space. The learner sees the same explanation twice and wonders if they missed something.

29. **Name-Not-Pronoun in Openers (SOFT):**
    For each narrative screen (orient, story_bridge, framework, resolution), check the FIRST sentence of body content (first text block after the heading):
    - Extract proper nouns from the spec's Company Examples table and Course Generation Brief.
    - If the screen's story arc summary or spec references a specific company/person for that screen, check whether the first sentence uses the proper noun or a generic reference ("this company," "one team," "a startup," "one organization").
    - WARN if a generic reference is used where the spec names a specific entity: "Screen {N} opens with '{generic phrase}' — use the entity name '{Name}' directly. Proper nouns are hooks; pronouns are forgettable."
    - Rationale: "Everything about Every looks normal" is immediately more engaging than "Everything about this company looks normal." The name creates curiosity and specificity.

30. **Source Attribution Limit (HARD GATE):**
    Build a frequency map: for each proper noun (person name) that appears in narrative text blocks across all screens, count the number of screens where that name appears.
    - FAIL if any person name appears on 3+ screens. Max 1 named attribution per expert — introduce once with context, anonymize all subsequent references ("one product leader," "a former VP of Product," "practitioners who track this").
    - Permitted: The same name appearing on 2 screens IF one is the introduction and the other is a glossary card definition.
    - **Exempt: Case study subjects** — People whose career arcs or decision chains ARE the narrative evidence (e.g., Indra Nooyi's career trajectory across the course, a CEO whose decisions form the 4-beat company arc). These are not experts being quoted for authority — they are subjects whose stories are the content itself. Do NOT anonymize case study subjects. To distinguish: if removing the name would weaken the specificity of the narrative or MCQ, they are a case study subject, not a quoted expert.
    - Exempt: Company names (Klarna, Block, etc.) — these can recur. This rule applies to PEOPLE only.
    - FAIL message: "'{Name}' appears on {N} screens ({list}). Name sources once, then anonymize. Repeated attribution makes the course feel like remixed material."
    - Tier 1 auto-fix: Replace 2nd+ occurrences with anonymous references. Do NOT auto-fix case study subjects — flag for human review instead.

31. **Negation Fragment Detection (HARD GATE):**
    Grep all narrative text blocks for the negation-staccato pattern: two or more consecutive sentences of 6 words or fewer that start with the same word (No/Not/Same/More/Just/Never/Zero).
    - Pattern: `sentence_under_6_words. same_start_word sentence_under_6_words.`
    - Examples that FAIL: "No syntax. No debugging.", "Not the model. Not the data.", "Same tools. Same team. Same market.", "Zero output. Zero documents. Zero meetings."
    - FAIL message: "Screen {N}: negation fragment chain detected ('{fragment1}. {fragment2}.'). Collapse into a single flowing clause."
    - Tier 1 auto-fix: Collapse fragments into comma-joined clause.
    - Rationale: This is Banned Pattern #2 (staccato/telegraphic fragments). The existing audit regex catches "Three X. Three Y." but misses "No X. No Y." — this step closes that gap.

32. **MD-JSON Content Sync Verification (HARD GATE):**
    For each non-cover screen (index > 0):
    (a) **Block count match:** Count body text blocks in MD (paragraphs between blank lines, excluding `### ` headings, MCQ option lines `- ... ✓/✗`, blockquotes `> `, and bold closing lines) and body text blocks in JSON (blocks with `type: "text"`, `font: "body"`). FAIL if counts differ: `"Screen {N}: MD has {M} body paragraphs but JSON has {J} body text blocks — content drift detected."`
    (b) **Block-by-block text comparison:** For each corresponding pair of MD paragraph and JSON text block (matched by position after heading):
        - Extract first 80 characters from each (stripping markdown formatting: `**`, `*`, `_`)
        - Normalize whitespace (collapse multiple spaces, trim)
        - FAIL if normalized strings differ: `"Screen {N}, block {B}: MD starts '{md_80}...' but JSON starts '{json_80}...' — text drift detected."`
    (c) **Interview guidance sync:** If the screen contains an `interview` block in JSON, extract the `guidance` field text. Grep the MD for corresponding guidance text (usually after `- Guidance:`). FAIL if the JSON guidance word count is less than 50% of the MD guidance word count: `"Screen {N}: Interview guidance truncated in JSON ({json_words} words) vs MD ({md_words} words)."`
    (d) **MCQ option sync:** For each MCQ block, compare the `question` field and all `options` values in JSON against the corresponding MCQ section in MD. FAIL if any option text differs (after stripping ✓/✗ markers from MD): `"Screen {N}, MCQ '{id}': option {index} differs between MD and JSON."`

    **Fix tier:** Tier 1 auto-fix — regenerate JSON from MD for the divergent screen. MD is always the source of truth.

33. **Table Rendering Gate Enforcement (HARD GATE):**
    **(a) 3-column hard cap (ALWAYS enforced, including legacy courses):**
    Scan ALL `"type": "table"` blocks across all screens. For each table block, count the entries in its `headers` array.
    - FAIL if any table has >3 headers: "Table on Screen {N} has {C} columns — hard cap is 3 (Principle 27). Restructure as narrative or reduce to ≤3 columns."
    - WARN if any table has >6 rows: "Table on Screen {N} has {R} rows — may cause excessive scrolling on mobile."
    - FAIL if any table has >8 rows: "Table on Screen {N} has {R} rows — max 8 for mobile scroll. Restructure as narrative."

    **(b) Spec rendering gate (when `Artifact Rendering` field exists in spec):**
    Read the spec's `Artifact Rendering` field (under `## Structural Decisions > Screen 5 — Artifact`).
    - If `Narrative`: grep the JSON for `"type": "table"`. If ANY table block exists → FAIL: "Spec mandates Narrative rendering but Screen {N} contains a table block. Convert table data to prose paragraphs."
    - If `Table (NxM)`: verify the table block exists. Verify column count matches spec declaration (±1 row tolerance on row count). WARN on column mismatch.
    - If field is absent (legacy course without the field): SKIP this sub-check. The 3-column hard cap from (a) still applies.

    - Tier 1 auto-fix: None — table-to-narrative conversion requires creative rewriting. Flag for user action.

34. **Readability & Engagement Audit (Principle 28 — HARD + SOFT):**

    Exempt from ALL sub-checks: blocks with `"bold": true` (closing lines), blocks on screens containing `mcq` or `glossary` type blocks (exercise card bridges), and for Hands-On archetype: text blocks on `demo` screens whose `text` value contains numbered step patterns (`/^\d+\.\s/m`).

    **(a) Per-block density — HARD GATE (75 words):**
    For every screen, scan all `"type": "text"` blocks with `"font": "body"`.
    Count words in each block's `text` value.
    - FAIL if any body text block exceeds 75 words: "Screen {N} has a {W}-word text block ('{first_30_chars}...') — hard cap is 75 words. Split at a sentence boundary and rewrite both blocks for independent coherence."
    - Tier 1 auto-fix: Split at the best sentence boundary (period + space + capital letter). Rewrite to ensure: no dangling pronouns in the second block, no orphaned examples, no setup-without-payoff. Each resulting block must be ≥15 words. If no valid coherent split exists, flag for user.

    **(b) Per-block density — SOFT WARN (60 words):**
    WARN if any non-exempt body text block exceeds 60 words but ≤75: "Screen {N} has a {W}-word text block — consider splitting for mobile readability (target: 20-50 words/block)."

    **(c) Story screen block count — SOFT WARN:**
    For every story screen (CS: orient, framework, resolution, deepen, advanced_move, terms_in_context; HO: intro, concept, recap), count body text blocks.
    WARN if fewer than 3: "Screen {N} ({type}) has only {count} body text blocks — story screens should have 3+ paragraphs for readable density."
    Exempt: bridge screens (story_bridge), all exercise screens, HO types: demo, try_it, tip, setup, artifact.

    **(d) Course-level average density — SOFT WARN:**
    Calculate average word count across ALL non-exempt body text blocks in the course.
    WARN if average exceeds 35 words/block: "Course averages {avg} words per body text block — target is ≤35 (benchmark: beat-planning = 28)."

    **(e) Opener repetition — SOFT WARN:**
    For each story screen, extract the first word of each body text block. WARN if any two consecutive body blocks start with the same word (case-insensitive): "Screen {N} has consecutive blocks both starting with '{word}' — vary openers for reading engagement."
    Tier 1 auto-fix: Rewrite the second block's opener to use a different entry point (proper noun, time marker, action, contrast). Preserve meaning.

    **(f) Rhythm monotony — SOFT WARN:**
    For each story screen with 4+ body blocks, calculate word counts and their standard deviation.
    WARN if std dev < 8: "Screen {N} body blocks are uniformly {avg}±{stddev} words — vary between punch (5-15w), medium (20-40w), and detail (40-60w) for engagement."
    No auto-fix — rhythm redesign requires creative rewriting. Flag for user.

    **(g) Punch block absence — SOFT WARN:**
    For each story screen with 4+ body blocks, check if at least one body block is ≤15 words.
    WARN if none: "Screen {N} has {count} body blocks but no punch block (≤15 words) — add a dramatic beat, scene fragment, or narrative pivot."
    No auto-fix — punch blocks require creative insertion. Flag for user.

    Rationale: Each `"type": "text", "font": "body"` block renders as a separate paragraph with 12px margin on mobile. Benchmark courses (beat-planning, org-resilience) achieve readability through six dimensions: density (28w avg), rhythm variability (std dev ~20), opener diversity (100% unique), punch blocks (48% of blocks), zoom oscillation (specific↔general), and single-idea scope. This step audits the programmatically measurable dimensions.

**Step 25 — Blueprint Bridge Quality (Blueprint mode only):**
If the spec contains a `## Course Blueprint` section:
For each interactive block in the blueprint, locate the segway bridge on the preceding screen. Verify:
1. Bridge is 2-3 sentences (not 1 sentence, not a full paragraph)
2. Bridge includes a backward reference (names a concept, company, or insight from preceding screens)
3. Bridge includes a forward setup (frames what the interactive block will test/explore)
4. Bridge does NOT use test-framing language ("Test your knowledge", "Let's see what you learned", "Quiz time")
FAIL per violation: "Screen {N} bridge before {interactive_type} fails: {specific reason}."

**Step 26 — Premium Tutorial Quality (Hands-On archetype ONLY):**
If the course JSON has `archetype: "hands_on"`, verify these additional quality gates:

1. **Technique Density (C-HO1):** Count named, discrete, verifiable techniques across `concept` and `demo` screens. A technique has a name ("Answer-first restructuring"), a trigger ("when your content ranks but isn't cited"), and a verifiable outcome ("AI retrieves the answer from the first paragraph"). FAIL if fewer than 5. WARN if fewer than 7. Check that the `recap` screen lists techniques by number.

2. **Tool Citation Specificity (C-HO2):** For each `demo` screen, verify at least one specific tool, extension, command, or URL is named. "Use Google's Rich Results Test" passes. "Use a schema validation tool" FAILS. Flag each generic-tool demo screen.

3. **Expert Citation Count (C-HO3):** Count named expert/data citations (format: "[Source] found/showed [finding]"). "BrightEdge found that 96.8%..." counts. "Research suggests..." does NOT count. FAIL if fewer than 3 named citations.

4. **Hedging Language (C-HO3b):** Grep `concept` screens for hedging patterns: "There are pros and cons", "It depends on your situation", "Some practitioners prefer", "Studies show" (without naming source). Each occurrence on a concept screen = FAIL.

5. **Action Timeline Recap (C-HO5):** Verify the `recap` screen contains time-bound action items. Grep for at least 3 distinct time-horizon phrases (e.g., "This week", "This month", "In 3 months", "Tomorrow", "Next quarter"). FAIL if the recap lacks specific time-bound actions.

FAIL per violation: "C-HO{N}: {Screen type} Screen {N}: {specific failure description}."

**Step 35 — Genre Voice Consistency (SOFT WARN):**
Read the spec's Genre field. Scan all story cards for prose style drift:

| Genre | Consistency Check |
|-------|------------------|
| Literary Journalism | Does prose maintain person-centric narrative throughout? Any shift to analytical-report style? |
| Investigative | Does prose maintain adversarial/revelation tone? Any shift to sympathetic corporate narrative? |
| Industry Epic | Does prose maintain multi-actor sweep? Any screen focusing solely on one company for 3+ consecutive screens? |
| Corporate Biography | Does prose maintain inside-the-company perspective? Any shift to external analyst language? |
| Geopolitical | Does prose maintain structural analysis? Any shift to individual-focused narrative? |
| Behavioral Science | Does prose maintain bias-as-protagonist? Any shift to company-profile narrative? |
| Legal/Regulatory | Does prose maintain ambiguity/spectrum framing? Any shift to black-and-white certainty? |
| Practitioner Memoir | Does prose maintain from-the-trenches perspective? Any shift to academic case study distance? |

Flag SOFT WARN if style drifts from genre character.

**Step 36 — Genre Research Depth (SOFT WARN):**
Verify the course contains genre-required elements:

| Genre | Required Elements |
|-------|------------------|
| Literary Journalism | Named person with telling detail on Screen 1? Ironic foreshadowing ("would" construction)? |
| Investigative | Hidden finding not in headlines? Institutional voice shift (PR language → data gap)? |
| Industry Epic | 3+ companies? Decade+ time span? 2+ geographies? |
| Corporate Biography | Internal cultural artifacts? Board-level or leadership-level decisions? |
| Geopolitical | Structural mechanism? Inevitability sentence ("regardless of who...")? |
| Behavioral Science | Named experiment with researcher name + effect size (R²/percentage)? |
| Legal/Regulatory | Specific provision number/case name/date? Adversarial pair (same facts, opposite readings)? |
| Practitioner Memoir | Domain jargon with translations (≥3)? Field metrics with specific numbers (≥2)? |

Flag SOFT WARN for each missing required element.

**Step 37 — Protagonist Presence (C62 — HARD GATE):**
Identify the protagonist company or person from the spec (Primary Company or Central Figure in the Research Summary).
1. Grep for the protagonist keyword (company name or person name) across all non-cover screen text blocks in the JSON.
2. Count how many non-cover screens mention the protagonist at least once.
3. FAIL if protagonist appears on fewer than 90% of non-cover screens.
4. FAIL message: "C62 HARD GATE: Protagonist '{name}' appears on {count}/{total} screens ({pct}%) — must be ≥90%. Screens missing protagonist: {list}. Every story screen must anchor to the protagonist's decisions, not drift into standalone theory."
5. Tier 2 (user approval) — requires editorial judgment on how to weave protagonist back in.

**Step 38 — No Self-Created Framework Labels (C63 — HARD GATE):**
This is the HIGHEST PRIORITY v10.0.0 check. LLMs default to inventing branded framework acronyms — this check catches them.
1. Grep ALL screen text blocks and heading blocks for:
   - All-caps words of 4+ letters that are immediately followed by "Framework", "Method", "Protocol", "Model", "System", "Approach", "Matrix", "Scorecard" (e.g., "CASH Framework", "PROVE Method")
   - Patterns where each letter of an acronym maps to a concept word (e.g., "**C**onsistency, **A**ccountability, **S**ustainability, **H**ousehold-load")
   - "Gate [0-9]", "Step [0-9]", "Phase [0-9]", "Stage [0-9]" used as framework labels (NOT as narrative — "Stage 2 of the crisis" is fine, "Stage 2: Accountability Assessment" is a framework label)
   - Custom-named checklists or branded diagnostic tools invented by the generator
2. EXEMPT real-world frameworks that exist outside the course: GAAR, Basel Accords, SEBI regulations, Porter's Five Forces, OKRs, RICE, MoSCoW, SWOT, PESTLE, BCG Matrix, etc. If in doubt, web-search the framework name — if it has a Wikipedia article or >10K search results, it's real.
3. FAIL per violation: "C63 HARD GATE: Screen {N} contains invented framework label '{label}'. Self-created frameworks are banned — teach through the protagonist's story, not branded checklists. Real-world frameworks are permitted."
4. Tier 1 auto-fix: Remove the invented framework label and ALL references to it across the course. Rewrite the content as narrative prose anchored to the protagonist's experience and decisions.
5. **Also check the spec:** If the spec's Framework Type references an invented acronym, flag it: "Spec contains invented framework '{name}' — this must be replaced with a real-world framework or narrative structure before regeneration."

**Step 39 — Resolution Post-Climax Content (C64 — SOFT WARN):**
1. Identify the last story screen before practice/interview screens.
2. Grep for dates (year patterns like 20XX, month+year) or event markers that occur chronologically AFTER the story's climax (the turning point or crisis peak).
3. WARN if the resolution screen contains no post-climax dates or events: "C64 WARN: Resolution screen (Screen {N}) has no post-climax aftermath. Show what happened AFTER the crisis — new hires, strategic pivots, market response, long-term consequences — not a restatement of lessons."
4. Tier 2 (user approval) — requires research to add post-climax aftermath content.

**Step 40 — Em/En Dash Count (v10.1.0 — Indian/Asian English Friendliness; v10.17.0 — per-screen cap + tightened course total):**
1. Grep ALL body text blocks (type: "text", font: "body") for em dash (—) and en dash (–) characters.
2. EXCLUDE glossary definition blocks using `> **Term** — Category` format (structural separator, not prose).
3. **Per-screen check (v10.17.0 NEW):** Count em/en dashes per screen body. WARN per violation: "Screen {N}: {count} em/en dashes on one screen. Em-dashes should feel deliberate, not accumulative. Target ≤1 per screen."
4. Count total em/en dashes across the entire course.
5. WARN if course total > 3: "Em/en dash count: {count}. Indian/Asian English prefers commas and conjunctions over dashes. Replace with commas, parentheses, or restructure as two sentences."
6. **HARD GATE if course total > 4 (v10.17.0 — tightened from >6):** "HARD GATE: {count} em/en dashes exceeds limit of 4. Western writing tic detected — each em-dash must be load-bearing, not a reflex."
7. Tier 1 auto-fix: Replace `—` with `, ` (comma-space) or `. ` (period-space) depending on context. Replace `–` with "to" (for ranges) or comma. Prioritize fixing screens that violate the per-screen cap first.

**Why v10.17.0 tightened the cap:** the prior WARN>3 / HARD>6 threshold was permissive enough that courses still averaged 1-2 em-dashes per screen — a cumulative "AI punchy prose" tic readers register even if no individual screen violates. The per-screen cap (≤1 per screen) is the real lever; the course-wide HARD>4 is the outer rail. Forces em-dash usage to feel earned, not reflexive.

**Step 41 — Consecutive Question Fragment Check (v10.1.0):**
1. For each body text block, grep for pattern: sentence ending with `?` immediately followed by another sentence ending with `?` (within the same block or consecutive blocks on the same screen).
2. WARN per violation: "Screen {N}: consecutive question fragments detected ('{q1}' + '{q2}'). Join with commas and 'and' into a flowing question: '{combined}'."
3. Tier 1 auto-fix: Combine consecutive questions with commas and "and". Example: "What happened? Where did it go?" → "What happened, and where did it go?"

**Step 42 — Glossary Context Dependency (C65 — HARD GATE, v10.2.0):**
1. For each `terms_in_context` screen in the JSON, extract all company and institution names from its body text blocks (the narrative paragraphs, not the blockquote definition).
2. For each company/institution found, count the sentences about it on THIS glossary screen.
3. If a company has 3+ sentences on the glossary screen (it's a primary example), check ALL preceding story screens for that company name.
4. Count narrative sentences about that company across all preceding screens.
5. FAIL if preceding context < 3 sentences: "C65 HARD GATE: Glossary screen {N} ('{term}') uses {company} as primary example ({count} sentences) but {company} has only {prior_count} sentence(s) on preceding screens. Swap this glossary screen to AFTER the story screen that introduces {company}."
6. Tier 2 (user approval) — fix requires screen reordering.
7. **Why:** A glossary card that teaches Grameen's methodology before the story screen explains who Grameen is creates a knowledge gap. The reader encounters detailed methodology in a definition card before the narrative establishes the context.

**Step 42b — Research Curation Compliance (v10.8.0):**
If the spec contains a Research Curation Map, verify:
1. All companies in the course appear in the Primary companies list. Flag any company NOT in the list.
2. All glossary terms match the Active glossary terms list. Flag any term NOT in the list.
3. No screen has > 3 cited statistics (numbers with source attribution).
4. Total unique companies ≤ 4, total glossary cards ≤ 5.
SOFT WARN for each violation with specific screen/artifact details. This check surfaces research overflow — verified content that is narratively unnecessary.

**Output:** Line-specific violations grouped by category

<!-- /AGENT_3_SURFACE -->

---

<!-- AGENT_4_DATA_INTEGRITY -->
## Agent 4: Data Integrity Auditor

**Input:** Course JSON (`courses/JSONS/{slug}.json`) + course MD (`courses/{slug}-concept-sprint.md`) + visuals directory (`visuals/{slug}/`)

**Process:**

**Step 1 — Cover Placement Validation:**
1. Verify `screens[0].type` is `"cover"`. If not, FAIL: "First screen must be type `cover` — found `{actual_type}`."
2. Verify `screens[0]` contains all required cover keys: `image`, `mobile_image`, `title`, `subtitle`, `description`. Flag each missing key individually.
3. Verify `metadata` does NOT have a `cover` key. If present, FAIL: "Cover data must live in `screens[0]`, not `metadata.cover`. Remove `metadata.cover` and ensure `screens[0]` has type `cover` with `image`, `mobile_image`, `title`, `subtitle`, `description`."
4. Verify `metadata.description` exactly equals `screens[0].description`. If mismatch, FAIL: "metadata.description and screens[0].description are out of sync. metadata: `{metadata_value}` vs screens[0]: `{screen_value}`."
5. Verify `metadata.subtitle` exactly equals `screens[0].title`. If mismatch, FAIL: "metadata.subtitle and screens[0].title are out of sync. metadata.subtitle: `{metadata_value}` vs screens[0].title: `{screen_value}`."

**Step 2 — Image Reference Audit:**
6. Extract all image references from the JSON:
   - Cover: `screens[0].image` and `screens[0].mobile_image`
   - Body: every `media[].src` across all screens
7. Determine the visuals directory: `visuals/{slug}/` where `{slug}` matches the JSON filename (without `.json`)
8. For each referenced image path, resolve it against the visuals directory and verify the file exists on disk using Glob. FAIL per missing file: "Image referenced in JSON but not found on disk: `{path}`."
9. Verify cover images follow naming convention: `visual-0-cover.png` (desktop) and `visual-0-cover-mobile.png` (portrait). FAIL if cover references use different names.
10. Check all body image filenames match `visual-{N}.png` pattern (lowercase, no descriptive slugs, no uppercase characters). FAIL per violation: "Image filename `{name}` does not follow `visual-{N}.png` convention."
    - **MANDATORY GREP** — scan filenames for uppercase: any file matching `Visual-`, `VISUAL-`, or mixed-case variants is a FAIL
11. Detect orphan images: list all `.png` files in the visuals directory and flag any not referenced in the JSON. WARNING (not FAIL): "Image on disk but not referenced in JSON: `{path}`. Verify if this is intentional (e.g., screenshot slot placeholder)."

**Step 3 — Description-Content Alignment:**
12. Extract `metadata.description` text.
13. Identify all company names in the description (proper nouns, brand names).
14. Identify all specific stats/facts in the description (numbers, percentages, revenue figures, market claims).
15. For each company name, grep the course MD (`courses/{slug}-concept-sprint.md`) for that company name. FAIL if a company in the description does not appear in the course content: "Description references company `{name}` which does not appear in the course content."
16. For each specific stat/fact, grep the course MD for that value. FAIL if a stat in the description is not grounded in course content: "Description cites `{stat}` which does not appear in the course content."
17. WARN if the description contains zero company names AND zero specific stats: "Description is generic — lacks a specific company or stat hook. Consider adding a concrete detail from the course content."

**Step 4 — Screen Count Validation:**
18. Count total screens (including cover screen at index 0).
19. Count MCQ blocks: scan all screens for blocks with `type: "mcq"`.
20. Count subjective blocks: scan all screens for blocks with `type: "text_question"`.
21. Count glossary terms: count keys in the top-level `glossary` object.
22. Record all counts for downstream use by `:db-insert`:
    - `screen_count`: total screens
    - `mcq_count`: total MCQ blocks
    - `subjective_count`: total text_question blocks
    - `glossary_term_count`: total glossary entries
23. Cross-check counts against archetype constraints (from spec):
    - Concept sprint: thresholds per structural-checks.md Authority Table (screen count 12-18, MCQ min 4, glossary 5-7). Do NOT hardcode — refer to the Authority Table for current values.
    - Hands-on: thresholds per structural-checks.md Authority Table (screen count 8-18, MCQ 4-12, glossary 0-7). Do NOT hardcode — refer to the Authority Table for current values.
    - FAIL if any count falls outside the archetype range

**Step 5 — JSON Structure Validation:**
24. Verify required top-level keys exist: `metadata`, `glossary`, `screens`. FAIL per missing key.
25. Verify required `metadata` keys: `company`, `role`, `subtitle`, `skill`, `description`, `media_base`, `phases`. FAIL per missing key: "Missing required metadata key: `{key}`."
26. For each entry in `metadata.phases`, verify it has `label` (string) and `range` (array of 2 integers). FAIL if malformed: "Phase `{label}` has invalid range — expected [start, end] array."
27. For every non-cover screen (index > 0), verify required keys: `index`, `type`, `title`, `short`. FAIL per missing key: "Screen {index} missing required key: `{key}`."
28. For every `media` block in any screen, verify required keys: `type`, `src`, `placement`, `alt`. FAIL per missing key: "Screen {index} media block missing required key: `{key}`."

**Step 6 — Visual Pipeline Integrity Check:**

If the visuals directory `visuals/{slug}/` exists AND contains `.png` files, run these checks:

29. Check `visuals/{slug}/prompts.md` exists.
    - ❌ MISSING → CRITICAL: "No prompts.md found. Images may have been generated without the visual skill pipeline (no Style Seed, no quality gates). Regenerate via `/atom-creator:visuals {slug}`."

29b. **Art Direction Brief present (v7.3.0)** — check `visuals/{slug}/art-direction.md` exists.
    - ❌ MISSING + images exist → WARN: "Art Direction Brief not found — images may have been generated pre-v7.3.0. Visual direction was derived from spec instead of the standalone art-direction.md file."
    - ✅ Present → verify file contains required sections: Visual Type, Palette, Style Seed, Composition Plan.

If `prompts.md` exists, verify:

30. **Style Seed present** — file contains a paragraph matching the pattern "Style inspired by [X] crossed with [Y]"
    - ❌ Missing → CRITICAL: "No Style Seed found in prompts.md. Images were generated without the #1 consistency mechanism."
31. **Style Seed prepended to prompts** — each regeneration prompt section starts with the same seed paragraph (first ~80 words should be identical across all prompts)
    - ❌ Inconsistent → HIGH: "Style Seed not prepended to all prompts — style drift likely across images."
32. **Prompt count matches image count** — number of prompt sections (### headings with generation prompts) ≈ number of `visual-{N}.png` body files on disk (covers may be documented as KEEP)
    - ❌ Mismatch → MEDIUM: "Prompt/image count mismatch — some images may be undocumented or generated ad-hoc."
33. **Text register directive present** — file contains a text register section addressing label rules
    - ❌ Missing → LOW: "No text register directive — label consistency not enforced."

33b. **Prompt format check (v7.3.0)** — scan `visuals/{slug}/prompts-nbp.md` (or legacy `prompts.md`) for v3 JSON structure. Each prompt section should contain nested JSON with keys: `meta`, `scene`, `subject`, `composition`, `palette`, `constraints`.
    - ❌ Plain text prompts found → WARN: "Prompts use plain text format instead of v3 JSON structure. Prompt quality may be inconsistent. Regenerate via `/atom-creator:visuals {slug}`."
33c. **Prompt character count (v7.3.0)** — for each prompt section in `prompts-nbp.md`, count characters. Each prompt must be ≤2000 characters.
    - ❌ Any prompt exceeds 2000 chars → WARN per violation: "Prompt for slot {N} is {count} chars — exceeds 2000 char limit. Gemini API may truncate, causing unpredictable composition loss."
33d. **No hex codes in prompt body (v7.4.0, VA14)** — scan each prompt section (excluding style seed) for `#[0-9a-fA-F]{3,8}` pattern. Hex codes in scene descriptions render as garbled text in SeedDream.
    - ❌ Hex found → WARN: "Prompt for slot {N} contains hex code `{hex}` in scene description — SeedDream may render as garbled text. Replace with color name."
33e. **Character style consistency (v7.4.0, VA15)** — if the course uses Character-as-Concept (check art-direction.md for character definition), verify each body prompt describes the character in the SAME style as the art direction's visual world. Flag prompts where the character uses "realistic," "detailed," "photographic," or "3D" when the style is geometric/folk/flat.
    - ❌ Style mismatch → WARN: "Prompt for slot {N} describes character as '{descriptor}' but art direction uses '{style}' — character should match the visual world."

If the visuals directory does not exist or has no `.png` files, SKIP Step 6 entirely (visuals not yet generated).

**Step 7 — Visual-Content Screen Count Alignment:**

Parse `visuals/{slug}/prompts.md` storyboard sequence. Count the number of body image prompts (VISUAL 1, VISUAL 2, ... VISUAL N).

Count the number of screens in the course markdown that should have images. ALL screens should have images — there is no exclusion list. Every screen type including MCQ, apply, aptitude, and interview screens should have at least one image reference.

**Severity by screen type:**
- **FAIL** if any `orient`, `story_bridge`, `bridge`, `framework`, `deepen`, or `resolution` screen lacks an image (established slots — these have always had images)
- **FAIL** if any `intro`, `concept`, `demo`, `artifact`, or `recap` screen lacks an image (hands-on equivalents)
- **WARN** if any `mcq`, `first_apply`, `apply`, `aptitude`, or `interview` screen lacks an image (new rule — transitional enforcement, v4.1.0)
- **WARN** if any `try_it`, `tip`, or `setup` screen lacks an image (hands-on — transitional enforcement, v4.1.0)

See screen-rules.md universal screen images rule.

**Checks:**
- **FAIL** if prompts.md body image count ≠ image-eligible screen count in course markdown
- **FAIL** if prompts.md references screen numbers that exceed the course's total screen count (e.g., "Screen 14" in a 10-screen course)
- **WARN** if prompts.md does not exist (images may have been generated outside the pipeline)

**Step 8 — Image File Existence Verification:**

For every image referenced in the course JSON (`screens[].media[].src` and `screens[0].image`, `screens[0].mobile_image`):

1. Construct the expected path: `visuals/{slug}/{filename}`
2. Check that the file exists on disk

**Checks:**
- **FAIL** if any referenced image file does not exist on disk
- **FAIL** if `visual-0-cover.png` is missing (desktop cover required)
- **FAIL** if `visual-0-cover-mobile.png` is missing (mobile cover required)
- **WARN** if image files exist on disk but are NOT referenced in JSON (orphaned images)

**Step 9 — Entity Label Alignment:**

For each prompt in `visuals/{slug}/prompts.md` that contains labels (text in uppercase, or after "Label:" directives):

1. Extract all entity labels from each prompt
2. Identify which screen/card the prompt targets
3. Grep the course markdown for each entity name (case-insensitive)

**Checks:**
- **FAIL** if a prompt label references an entity NOT found anywhere in the course markdown
- **WARN** if a prompt label references an entity that exists in the course but NOT on the target screen (entity exists but is on a different card)
- Report all mismatches in a table: | Label | Prompt | Expected In Course | Found? |

**Step 10 — Prompt Self-Containment Check:**

Gemini generates each image independently with zero memory of prior outputs. Scan every prompt in `visuals/{slug}/prompts.md` for cross-image references that assume the model remembers a previous generation.

**Banned patterns (regex scan):**
- `VISUAL\s+\d` or `visual\s+\d` followed by reference language (e.g., "from VISUAL 2", "same as VISUAL 1")
- `previous image` / `previous visual` / `earlier image`
- `same (building|scene|composition|layout|structure) (from|as)` — implies continuity between generations
- `but (TRANSFORMED|GONE|REMOVED|changed)` — describes a delta from a state that only existed in another image
- `callback to` / `mirrors` / `echoes` — narrative language that requires model memory
- `from Slot \d` / `from Card \d` as compositional reference

**Allowed:** Prompts that describe paired compositions (e.g., "a building WITH a thick barrier" and "a building with NO barrier") are fine — each prompt is self-contained as long as it describes its own image completely without requiring knowledge of the other.

**Checks:**
- **FAIL** if any prompt contains cross-image reference patterns. List each occurrence: | Prompt | Banned Pattern Found | Suggested Rewrite |
- **PASS** if all prompts are self-contained

**Step 11 — Visual Staleness Detection:**

Compare file modification timestamps:
- `ts_course`: last modified time of `courses/{slug}-concept-sprint.md` (or `{slug}-hands-on-guide.md`)
- `ts_prompts`: last modified time of `visuals/{slug}/prompts.md`
- `ts_images`: oldest modified time among `visuals/{slug}/visual-*.png`

**Checks:**
- **WARN** if `ts_course` > `ts_prompts` — course was modified AFTER visual prompts were written. Visuals may be stale.
- **WARN** if `ts_course` > `ts_images` — course was modified AFTER images were generated. Run `/atom-creator:visuals` to refresh.
- **INFO** if all timestamps are in correct order (prompts after course, images after prompts)

**Step 12 — JSON Key Ordering Check:**

For every non-cover screen (index > 0) that has both `media` and `blocks` keys:
1. Parse the raw JSON text to determine key ordering (which key appears first in the source)
2. FAIL if `media` appears before `blocks`: "Screen {index} has `media` before `blocks` — title will render after image. Reorder so `blocks` (starting with heading) precedes `media`."
3. PASS if `blocks` appears before `media` or if the screen has no `media` key

**Step 13 — Image Placement Value Check:**

For every `media` block across all screens:
1. Check the `placement` field value
2. FAIL if `placement` is `"above_content"`: "Screen {index} uses deprecated `above_content` placement — change to `hero`."
3. FAIL if `placement` is any value other than `"hero"`: "Screen {index} has invalid placement `{value}` — must be `hero`."

**Step 14 — Blueprint Compliance (Blueprint mode only):**
If the spec contains a `## Course Blueprint` section:
1. Parse the blueprint's Screen Architecture table from the spec
2. Parse the generated course JSON screen sequence
3. Compare row-by-row:
   - Verify screen count matches blueprint Total Screens. FAIL if mismatch.
   - Verify screen type sequence matches blueprint row-by-row. FAIL per mismatch: "Screen {N}: blueprint says `{expected_type}`, JSON has `{actual_type}`."
   - Verify every interactive block in the blueprint exists in the JSON at the correct position. FAIL per missing block.
   - Verify interactive block spacing: 2+ narrative screens between any two. FAIL if violated.
   - Verify interactive density: ≤ 40% of total screens. FAIL if exceeded.

**Step 15 — Glossary Practice Completeness:**

For every block with `"type": "glossary"` across all screens:
1. FAIL if `practice` key is missing or null — "Screen {index}: glossary term `{term}` missing `practice` object."
2. FAIL if `practice.question` is missing or empty string — "Screen {index}: glossary `{term}` has empty practice question."
3. FAIL if `practice.options` is not a 4-element array — "Screen {index}: glossary `{term}` practice must have exactly 4 options."
4. FAIL if `practice.correct` is not an integer 0-3 — "Screen {index}: glossary `{term}` practice `correct` must be 0-based index (0-3)."
5. FAIL if `practice.explain` is missing or empty string — "Screen {index}: glossary `{term}` has empty practice explanation."
6. WARN if `practice.question` does not use you/your framing (contains proper names suggesting fabricated scenarios).
7. WARN if any option is >2x the length of the shortest option (length imbalance).

Severity: HARD GATE — any FAIL blocks content from passing audit. Frontend renders glossary as learn+test cards; missing practice breaks rendering.

**Step 15b — MCQ Explain Completeness (HARD GATE):**
For every block with `"type": "mcq"` across all screens:
  - FAIL if `"explain"` key is missing
  - FAIL if `"explain"` value is empty string or fewer than 20 characters
  - Report: "Screen {N}: MCQ missing explain field" per violation
HARD GATE — every MCQ must have an explanation for the app to show correct answer feedback.

**Step 15c — Image Reuse Detection (HARD GATE):**
For each non-cover screen with a `media` array, extract the `src` value. Build a frequency map: `{filename → [screen_indices]}`.
- FAIL if any filename appears in 2+ screens: `"Image '{filename}' reused on screens {list}. Each screen must have a unique image — spatial memory requires distinct visual patterns per screen. Generate additional visuals or reassign existing images."`
- Cover images (`visual-0-cover.png`, `visual-0-cover-mobile.png`) are exempt — they belong to `screens[0]` only.
- Report as table:
```
| Image | Screens | Count |
|-------|---------|-------|
| visual-5.png | 7, 8, 12 | 3 |
```
**Fix tier:** Tier 2 (user approval) — requires deciding which screens keep the image and which need new visuals via `:visuals` regeneration.

**Step 16 — Whole-String Markdown Bold Scan:**

For every block with `"type": "text"` across all screens, check the `"text"` field value:
1. Test: does the value start with `**` AND end with `**` (the entire string is wrapped in markdown bold)?
   - Pattern: `^\*\*.*\*\*[.!?]?$`
   - NOT a violation: inline term bold within a longer sentence — e.g., `"called **legend depth** which compounds"` (asterisks wrap only a substring, not the whole value)
   - VIOLATION: `"**The pattern that separates professionals from interchangeable ones.**"` (asterisks wrap the entire value)
2. FAIL if violation found: "Screen {index} text block has whole-string `**...**` wrap — triggers pull-quote rendering (oversized font, bordered box). Strip `**` prefix/suffix; ensure `\"bold\": true` attribute is present if this is a closing bottom-line sentence."
3. Auto-fix: strip leading `**` and trailing `**` from the text value. If `"bold": true` is absent AND the block is the last content block on a story/bridge screen, add `"bold": true`.

Severity: HARD GATE. See design-philosophy.md Principle 26, `:create` check C51, inline validation V8.

**Output:** Per-check PASS/FAIL/WARN with:
- Exact file paths for any failed checks
- Suggested fix for each failure (copy-paste ready where possible)
- Screen count summary table (screen_count, mcq_count, subjective_count, glossary_term_count)
- Glossary practice completeness: {N}/{N} glossary blocks with valid practice objects (Step 15)
- Whole-string markdown bold violations found: {N} (Step 16)
- Visual pipeline integrity status (if checked)
- Visual-content alignment status: screen count match, missing files, entity mismatches, prompt self-containment, staleness warnings (Steps 7-13)
- Blueprint compliance status (Step 14, blueprint mode only)

<!-- /AGENT_4_DATA_INTEGRITY -->

---

<!-- AGENT_5_FACTUAL -->
## Agent 5: Factual & Legal Compliance Auditor

**Input:** Course JSON (all screens) + web search capability

**Process:**
1. **Company claim extraction** — scan all screens for named companies and extract every factual claim:
   - Revenue/market figures, market position claims, strategic decisions, employee/org claims
1a. **P37 Exemption (Speculative Numbers)** — If a story bridge screen uses a rounded/approximate number where the spec Research Summary has a precise one (e.g., spec says "2,500 restaurants," course says "more than 2,000"), this is P37-mandated editorial softening — NOT a factual error. Only flag if the rounding changes the magnitude or direction of the claim. Tier A numbers (2+ source verified) should remain precise even on story bridges.
1b. **Hallucination Heuristic** —
    For each company claim with specific operational details (embedded consultants, specific duration, specific methodology, direct quotes from executives), require TWO independent corroborating sources. Classification:
    - 2+ sources: VERIFIED (proceed)
    - 1 source (not company marketing): PLAUSIBLE (flag as MEDIUM risk)
    - 1 source (company's own marketing only): HIGH risk (flag for user review)
    - 0 sources: CRITICAL — HARD GATE. Content must be removed or replaced.

    The Infosys-Medibank precedent: a fabricated case study claiming "embedded consultants in claims offices for six weeks" had zero verifiable sources. This heuristic exists to prevent repetition of that failure.
1b-ii. **Research Registry Cross-Reference (v8.1.0, when Registry exists in spec):**

If the spec's `### Research Registry` section exists:

(a) For each company claim extracted in Step 1, attempt to match it to an R-number from the Registry.
(b) **Match found — VERIFIED + precise numbers:** PASS
(c) **Match found — PLAUSIBLE + precise numbers (no hedging language):** WARN — "Claim from R{N} is PLAUSIBLE but stated precisely. Apply hedging per P37."
(d) **Match found — PLAUSIBLE + approximate language:** PASS
(e) **Match found — HIGH RISK:** WARN — "Claim from R{N} is HIGH RISK — verify it was user-approved in :plan."
(f) **No match found (claim not in Registry):** This means the generator synthesized a new claim not in the original research. Apply the existing Hallucination Heuristic (Step 1b standard) — but escalate: claims absent from the Registry start at MEDIUM risk floor (not LOW). The Registry's absence of a claim is itself a signal.
(g) **Directional verification:** For each claim that involves a comparison (R{N} type=causal or type=metric with a direction), verify the DIRECTION matches the Registry's evidence extract. This catches the LinkedIn lateral move inversion pattern.

**When Registry is absent (pre-v8.1 specs):** Skip this step entirely. All existing Agent 5 behavior preserved.

1d. **Biographical Claim Verification** —
    For each NAMED PERSON in the course whose career history is described:

    (a) Extract biographical claims: job titles, company roles, duration, career transitions, educational background, specific achievements.

    (b) For EACH biographical claim, verify against PRIMARY sources:
        - LinkedIn profile (current or archived)
        - Company "About Us" / leadership pages
        - Published interviews where the person states their own role
        - Annual reports listing executives

        NOT acceptable as primary: Wikipedia summaries, third-party blog posts, podcast paraphrases, news articles that summarize without quoting.

    (c) Classification:
        - Title matches primary source exactly: VERIFIED
        - Title is a simplification but directionally correct (e.g., "VP of Strategy" when actually "SVP Strategy, Planning, and Strategic Marketing"): MEDIUM risk — flag for precision
        - Title is wrong category entirely (e.g., "engineer" when actually "product manager"): HIGH risk — MUST fix
        - Career transition order is wrong: HIGH risk — MUST fix
        - Duration claim is off by >2 years: MEDIUM risk

    (d) Common failure patterns to watch for:
        - "Engineer" applied to product managers, strategists, or consultants
        - Generic "worked at X" when the specific role matters for the story
        - Conflating a person's early career with their famous-era role
        - Attributing a team achievement to one person

    The Nooyi precedent (Mar 2026): "industrial engineering at ABB" was actually "SVP of Strategy, Planning, and Strategic Marketing at ABB." The error undermines a course that uses her career as a central teaching example. This heuristic exists to prevent repetition of that failure.

1c. **Tool/Product Ownership Verification** —
    For any claim about a tool, product, or technology, verify ownership and origin. "Accenture's proprietary tool" must be confirmed as actually proprietary to Accenture. "Open-source framework" must be verified as actually open-source. Misattributing tool ownership compounds errors — the RAPID tool in the Hertz-Accenture case was a third-party tool Accenture recommended, not Accenture's proprietary technology. FAIL if ownership is misattributed.

1e. **Glossary Term Industry-Canonicality Verification (C70, v10.9.0)** —
    For each glossary term in the final course JSON (top-level `glossary` object + inline `type: "glossary"` blocks):

    (a) Run up to 2 web searches via `mcp__perplexity__perplexity_search` (preferred) or `WebSearch`: search query is `"{term}" {skill domain}` (e.g., `"Keeper Test" talent management` or `"Skill Rarity Premium" career strategy`).

    (b) A "canonical source" is any of: Harvard Business Review, McKinsey Quarterly, BCG Henderson / Bain Insights, Harvard Business School Press, other university press, a named practitioner book (Drucker, Porter, Christensen, Grove, Collins, Horowitz, Ries, etc.), trade press (WSJ, FT, The Economist, HBR.org, Harvard Business School case archive, domain-specific industry journals), or an industry standard body (CFA Institute, AICPA, PMI, IEEE, NIST, SEBI, RBI, SEC, etc.). Wikipedia counts as SECONDARY — a term found only on Wikipedia with no primary citation is SUSPECT, not verified.

    (c) Invented-term pattern scan — flag as HIGH RISK (requires user approval even if a search result appears): portmanteau coinages ("X Premium" where X is a quality descriptor), adjective+noun inventions ("Adjacency Mapping", "Trust Architecture"), aestheticized labels promoted to proper nouns (descriptive phrases capitalized and used as if established terminology).

    (d) **Pass:** ≥1 canonical source hit in 2 searches. Budget: 3–5 glossary terms per course.

    (e) **Fail:** "C70 HARD GATE: Glossary term '{term}' on screen {N} returned no canonical industry source in 2 web searches ({search1}; {search2}). The glossary is the course's learning outcome — students must be able to carry these terms into practitioner conversations. Replace with a verifiable industry term or remove the glossary card and fold the concept into narrative prose."

    (f) **Note:** C70 is complementary to C66 (spec-match). C66 catches terms that don't match the spec. C70 catches spec-approved terms that are themselves fabricated — the defect where the `:plan` research phase invented the term before it reached `:create`.

    Evidence: 2026-04-14 humanization audit — 14/20 CMS-edited courses had named-concept inflation: invented labels ("Skill Rarity Premium", "Capability Portfolio", "Adjacency Mapping") that students cannot use in real conversations.
2. **Web verification (MANDATORY — training-data checks are NOT verification)** — for each HIGH-risk claim (revenue, lawsuits, market share):
   a. **Primary source check (preferred, v8.1.0):** If the Registry includes a Source URL for this claim, use `mcp__claude_ai_Parallel_Web__web_fetch` (or fallback `WebFetch`) to re-read the source page. Compare the claim against the actual text on the page. This catches cases where the original research was correct but the generated prose drifted.
   b. **Web search verification (MANDATORY when no Source URL):** If no Source URL exists, or the source is inaccessible, you MUST use `mcp__perplexity__perplexity_search` or `mcp__claude_ai_Parallel_Web__web_search_preview` to verify. This is NOT optional. On 2026-03-24, eight courses passed audits that used LLM plausibility instead of web search — ghost citations, fabricated quotes, and wrong figures went undetected. Use web search to verify:
   - Revenue figures match annual reports (+/-5% tolerance for rounding)
   - Legal disputes are accurately characterized
   - Market statistics have credible sources
3. **Risk classification** per claim:
   - **LOW**: General industry facts, widely-known public information
   - **MEDIUM**: Specific figures without source, positive company characterizations
   - **HIGH**: Negative characterizations, specific unverified financials, lawsuit narratives
   - **CRITICAL**: Defamatory language, unsourced failure attributions
4. **Tone scan** — flag language attributing failure/incompetence to named companies without evidence
4b. **Source Attribution Audit** —
    Every specific number (revenue figure, percentage, growth rate, cost) must trace to a named source: court filing, annual report, published case study, industry report (PMI, McKinsey, Gartner). Numbers with no attribution are MEDIUM risk. Numbers that appear precise but have no verifiable source (e.g., "68% of IT projects fail" without citing CHAOS/Standish) are HIGH risk. Flag all unattributed numbers for user review.
5. **Fictional entity check** — flag any company/brand names that don't appear in web results
6. **Spec-to-Course Precision Audit (SOFT WARN):**
   Load the spec's Research Summary (Company Examples table and Counterintuitive Finding section). For each specific claim in the course MD that includes a number, percentage, timeframe, or absolute qualifier:

   (a) **Added temporal qualifiers:** Grep for temporal precision not present in the spec's Research Summary:
       - Patterns: "in a quarter", "in a single quarter", "overnight", "in [N] weeks/months/days", "in a single year", "within [timeframe]"
       - For each match, check if the same temporal qualifier appears in the spec's research data for that claim
       - WARN if not found in spec: `"Precision drift: '{course_phrase}' adds temporal precision '{qualifier}' not in spec Research Summary. Spec says: '{spec_phrase}'. Verify the timeframe or soften to match source."`

   (b) **Absolute-zero language:** Grep for absolute claims that exceed the spec's hedging level:
       - Patterns: "without a single", "not a (single )?dollar", "zero [noun]", "100% of", "every single", "not one", "no [noun] whatsoever"
       - For each match, compare against the spec's language for the same claim
       - WARN if spec uses softer language: `"Precision drift: '{course_phrase}' uses absolute language. Spec says: '{spec_phrase}'. Soften to match source precision or verify the absolute claim."`

   (c) **Increased numeric precision:** Compare numeric claims in the course against the spec's Research Summary:
       - If spec says "$10B" and course says "$10.2 billion" → WARN: added decimal precision
       - If spec says "revenue loss" and course says "$10B revenue loss in Q3 2021" → WARN: added both number and temporal precision
       - WARN: `"Precision drift: course specifies '{course_number}' but spec researched '{spec_number}'. Added precision may exceed source evidence."`

   For each WARN, suggest a softened alternative that matches spec precision level.

   **Fix tier:** Tier 2 (user review) — precision additions may be editorially justified if web-verified. Not auto-fixable.

6b. **Source Freshness Check (SOFT WARN):**
    For financial figures that change frequently (AUM, revenue, market cap, employee count, market share), check whether the spec's Research Summary source is >12 months old AND the figure type is volatile.

    Volatile figure types:
    - AUM (fund management): changes quarterly
    - Revenue: changes annually
    - Market cap: changes daily
    - Employee count: changes quarterly for growing companies
    - Market share: changes annually

    Non-volatile (exempt):
    - Historical events (acquisition prices, lawsuit amounts, founding dates)
    - Published research findings (study results, survey percentages)
    - Regulatory thresholds (tax rates, compliance limits)

    For each volatile figure where spec source is >12 months old:
    WARN: "Source freshness: '{figure}' sourced from {date}. This figure type changes {frequency}. Verify current value or add date anchor."

**Output:** Per-claim PASS/FAIL with risk level, source URL (if verified), suggested rewording (if flagged)

**Registry-specific error domains for learnings capture (v8.1.0):**
- `factual_registry_drift` — claim present in Registry but prose drifted from source evidence
- `factual_registry_absent` — claim in prose has no R-number (synthesis drift)
- `factual_registry_direction` — comparison direction inverted from Registry evidence

<!-- /AGENT_5_FACTUAL -->

---

<!-- AGENT_6_STORYTELLING -->
## Agent 6: Storytelling Craft Auditor

**Definition:** See `shared/storytelling-audit.md` for full check definitions.

**Input:** Course JSON + Course MD + Spec (genre + concept vocabulary) + genre-system.md

**Summary:** 11 universal checks (S1-S11) + 17 narration bible checks (S-NR1 through S-NR17) + genre-specific checks per the 8 genre definitions. All checks use deterministic pattern matching. S7 (Midpoint Story Card) and S-NR4 (Story Before Framework) are HARD GATE. S-NR15 (Filler-Title Blacklist), S-NR16 (Protagonist-Epilogue Resolution), and S-NR17 (No Course-Preview Chatter) are HARD GATE. Others are SOFT WARN. S-NR17 is Tier 1 auto-fixable; S-NR14 is Tier 2 user-approval.

**Reference:** Also read `shared/narration-bible.md` for the 47 narration principles extracted from hand-reworked courses.

**Universal checks:**
- S1: Person-Place-Action Opening (P30)
- S2: Sensory Density Floor (P31)
- S3: Bottom Line Quality (P32)
- S4: Company Depth Before Concept (P33)
- S5: Visceral Stakes (P34)
- S6: Voice Texture Signature (P35)
- S7: Midpoint Story Card (P36) — **HARD GATE**
- S8: Cliffhanger-Reveal Separation (Thriller #5)
- S9: MCQ Placement in Narrative Arc (Thriller #10)
- S10: Global Accessibility / Delhi Dinner Table Test
- S11: Speculative Numbers on Story Bridges (P37)

**Narration bible checks (from shared/narration-bible.md):**
- S-NR1: Sensory Doorway Opening — Screen 1 opens with physical moment
- S-NR2: Ironic Prosperity — Opening shows success before disaster
- S-NR3: Time-Bomb Sentence — Screen 1 ends with foreshadowing
- S-NR4: Story Before Framework — **HARD GATE** — ≥3 story screens before concept/framework
- S-NR5: Framework Attribution — Framework credited to named person
- S-NR6: Philosophical Punch — Bold closers are insights, not summaries
- S-NR7: Gap Statement — Resolution names a specific gap
- S-NR8: Pressure Systems — At least one screen names forces opposing application
- S-NR9: Contrarian Signal — Expert move with historical proof
- S-NR10: Documentary Voice — Past-tense omniscient on story screens
- S-NR11: Glossary Term Googleability
- S-NR12: Research-to-Narrative Ratio
- S-NR13: Novice Accessibility
- S-NR14: Antithesis Flourish Detector (v10.9.0) — flag "It is not X. It is Y." pairs; 20/20 humanization audit cut these
- S-NR15: Filler-Screen Title Blacklist (v10.9.0) — **HARD GATE** for `story_bridge` screens matching title regex with >50% body overlap with prior content
- S-NR16: Protagonist-Epilogue Resolution (v10.9.0) — **HARD GATE** — last story screen ends on dated protagonist outcome, not second-person sermon
- S-NR17: No Course-Preview Chatter (v10.9.0) — **HARD GATE** (Tier 1 auto-fix) — ban "what follows will…", "the pattern has a name. And a playbook", "by the end of this course you…"

**Genre-specific checks:** LJ1-LJ5 (Literary Journalism), IJ1-IJ4 (Investigative), IE1-IE4 (Industry Epic), CB1-CB3 (Corporate Biography), GA1-GA3 (Geopolitical), BS1-BS4 (Behavioral Science), LR1-LR4 (Legal/Regulatory), PM1-PM4 (Practitioner Memoir).

**Hands-On archetype:** Runs universal checks S3, S5, S7, S8, S9, S10 only. S1, S2, S4, S6 are Concept Sprint specific. Genre-specific checks are skipped (Hands-On uses The Instructor voice, no genre).

**Output:** Per-check PASS/WARN grouped by Universal → Genre-Specific.
<!-- /AGENT_6_STORYTELLING -->

---

<!-- RECTIFICATION_LOOP -->
## Rectification Loop

After all 6 content agents report:

**Tier 1 — Auto-Fix (apply immediately without user approval):**
- Replace banned phrase headers with natural alternatives
- Fix ALL-CAPS labels to sentence-case natural headers
- Normalize number formatting within declared system
- Fix imperial to metric unit conversions
- Remove fictional company names (replace with verified alternatives)
- Sync `metadata.subtitle` to match `screens[0].title` (Agent 4 — copy screens[0].title into metadata.subtitle)
- Sync `metadata.description` to match `screens[0].description` (Agent 4 — copy screens[0].description into metadata.description)
- Fix image filename casing (rename files on disk to lowercase `visual-{N}.png`)
- Remove `metadata.cover` key if present (Agent 4 — cover data belongs in screens[0])
- Replace `### GLOSSARY CARD` headers with blockquote format `> **Term** — Category` (Agent 3 — glossary format compliance)
- Replace fabricated character names in MCQ stems with "you/your" framing (Agent 3 — learner-as-protagonist)

**Tier 2 — User-Approval (present before/after preview):**
- Ambiguous MCQs: show problematic options + suggested rewrite
- Interview card with non-standard text: show current topics + expected standard text
- Number system conflicts: show options (convert all to Indian vs International)
- HIGH/CRITICAL company claims: show claim, verification result, suggested neutral rewording
- Missing images: show list of referenced-but-missing files, suggest regeneration or path correction (Agent 4)
- Description-content misalignment: show description text + missing company/stat, suggest rewrite grounded in course content (Agent 4)
- Fabricated companies: show company name + location in course, confirm whether to replace with a research company or remove (Agent 3)
- Company focus exceeding 3: show full company list, recommend which to consolidate (Agent 3)
- Cold glossary terms: show term + location, suggest adding bold narrative use above the blockquote (Agent 3)
- Storytelling craft findings: show each WARN item with screen index, excerpt, and genre rationale. User approves or rejects each prose rework (Agent 6)

**Loop constraints:**
- Maximum 3 audit-rectify cycles
- Each cycle re-runs only the failing agents (not all 6)
- If still failing after 3 cycles, BLOCK generation and surface full error report to user

**Triple-Sync Verification (MANDATORY after any fix):**
- Every edit must be applied to ALL THREE locations where the content exists:
  1. Course MD (main content section)
  2. Course JSON (`courses/JSONS/{slug}.json`)
  3. DATABASE section inside the MD (the SQL/JSON block at the bottom of the MD file)
- After all fixes, grep each changed string across all 3 locations to verify consistency. If any location has stale text, the fix is incomplete.

**HARD GATE:** Visuals and game generation do NOT start until all 6 content agents return PASS.
<!-- /RECTIFICATION_LOOP -->
