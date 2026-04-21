# Concept Sprint — Generation Rules

> **What this file covers:** All generation rules specific to the Concept Sprint archetype. Loaded by `:create` Step 4 when the spec's archetype is Concept Sprint.
>
> **When to load:** During Step 4 of `:create` when archetype = Concept Sprint.
>
> **Companion files:**
> - `generation-guide/generation-constraints.md` — banned phrases + DO NOT rules (loaded in Step 3)
> - `shared/structural-checks.md` — C1-C64 check definitions (loaded in Step 6)
> - `shared/inline-validation.md` — V1-V17 post-generation checks (loaded in Step 4.5)

---

## Step 3: Files to Load (Concept Sprint)

1. `.claude/generation-guide/design-philosophy.md` — 36 design principles, MCQ rules, naming conventions
2. `.claude/generation-guide/screen-rules.md` — Screen architecture, required/optional types, constraint checklist
3. `.claude/generation-guide/voice-{X}.md` — Voice directives matching spec's chosen voice (replace `{X}` with the actual voice letter: `a`, `b`, `c`, or `d`)
4. `.claude/generation-guide/generation-constraints.md` — All banned phrases, patterns, and DO NOT rules
5. `.claude/generation-guide/genre-system.md` — Genre definitions, opening templates, screen function specs, prose mechanisms, DO NOTs per genre
6. If blueprint mode detected (Step 2.7): `.claude/generation-guide/multi-artifact-rules.md` — Bridge requirements, density constraints, interview subtype specs

Do NOT load `hands-on-screen-rules.md` — it is irrelevant for concept sprints.

---

## Step 4: Generate Course Markdown (Concept Sprint)

Generate the course markdown from the screen plan in the spec (or the classic 15-screen reference if no explicit plan), injecting the constraint block at the top of the generation context. Screen count: as specified in spec (12-18, per structural-checks.md Authority Table). The spec removes creative uncertainty but does NOT relax quality — all rules from the generation guide still apply.

## Genre-Aware Generation Rules

> **Load `generation-guide/genre-system.md` alongside this file.** The genre system provides opening templates, screen function specifications, prose mechanisms, and DO NOTs per genre.

### Genre Loading

Read the constraint block's `Genre:` field. Load the corresponding genre definition from `genre-system.md`.

**What genre controls during generation:**

1. **Screen 1 (Hook):** Use the genre's Screen 1 Template as the structural guide. The opening must follow the genre's pattern (person-place-date for Literary Journalism, plausible surface for Investigative, etc.)

2. **Framework placement:** Follow the Genre x Screen Type Affinity table. Literary Journalism = framework after midpoint. Behavioral Science = concept enters by Screen 2. Practitioner Memoir = framework earned from war stories.

3. **Screen function specifications:** For each story card being generated, check the genre's Screen Function Specifications table. The Artifact for Literary Journalism is a "timeline of failure." The Artifact for Investigative is "the evidence." The Framework for Corporate Biography is "the company's own logic." Generate content matching these genre-specific characterizations.

4. **Prose mechanisms:** Apply all 4 of the genre's prose mechanisms throughout generation. For Literary Journalism: compressed characterization, ironic foreshadowing, slow zoom, "narrator knows more." These aren't suggestions — they're the genre's DNA.

5. **Genre DO NOTs:** Add the genre's DO NOTs to the generation constraints alongside the universal banned phrases and generation-time DO NOTs. Genre DO NOTs are HARD — violating them means the content doesn't match the genre.

6. **Mid-course momentum:** Follow the genre's mid-course momentum pattern. Literary Journalism = crisis escalates. Investigative = layers peel. Industry Epic = threads weave. This replaces the generic "maintain narrative proportion" guidance with genre-specific pacing.

### Braided Technique (if active)

If the constraint block contains `Braided Technique: Yes`:
- The base genre's narrative structure still governs
- Additionally, weave the lateral story vocabulary into each screen
- The vocabulary mapping table from the spec drives the interleaving
- Each story card must contain at least one bridge between story vocabulary and business concept

### Genre Exemptions

- **Behavioral Science:** P33 (Company Depth Before Concept) is EXEMPT. Concept/bias enters by Screen 1-2. V14 (Concept-Before-Story check) skipped.
- **Behavioral Science:** C57 (Narrative Proportion) threshold relaxed from >=55% to >=50%.

### Quality Rules (Concept Sprint)

All quality rules apply unchanged:
- MCQs with failure-certificate-quality distractors (minimum 4, count as specified in screen plan)
- Glossary terms (use the terms from the spec's Research Summary)
- **Glossary Term Legitimacy (HARD RULE):** Every glossary term MUST exist in the domain's established literature — textbooks, practitioner frameworks, academic papers, or industry-standard vocabulary. NEVER coin compound nouns that sound professional but don't exist. The test: "Would a domain practitioner recognize this term without this course?" What IS allowed: standard domain terms (Sharpe Ratio, Goodhart's Law, Board Capture), named frameworks from practitioners (Keeper Test, MEDDPICC), regulatory terms (GAAR, SMA), industry jargon used by practitioners (Beat Plan, Evergreening). What is BANNED: invented compound nouns (Competence-to-Compatibility Shift, Strategic Refusal), real concepts given a coined label (Convention Blindness → use "Functional Fixedness"), descriptive phrases promoted to proper nouns (Assumption Breakdown, Ethical Dilemma Trap), marketing-style rebranding (Opacity Premium → use "Information Asymmetry"). If the concept is real but has no established term: teach it in narrative prose on a story_bridge screen, do NOT create a glossary card. If the term only appears in the spec because the LLM wrote it there, it is fabricated.
- **CRITICAL — 1 glossary block per screen:** Each `terms_in_context` screen must contain exactly 1 `type: "glossary"` block. Never place 2 glossary terms on the same screen even if they are conceptually related. Related terms should be placed on CONSECUTIVE separate screens instead (for Hands-On) or with a story card between them (for Concept Sprint, per C45). The frontend renderer cannot handle multiple glossary blocks per screen — the second term is silently dropped.
- Screen independence (every screen self-contained)
- Bus test for cognitive load
- All generation constraints from `generation-constraints.md` — pay special attention to these frequently-generated violations:
  - **Invented framework acronyms** (CASH, COVER, PROVE, STRETCH, etc.) — the #1 most common LLM generation failure. If you create an acronym where each letter maps to a concept, STOP. Teach through story. (C63 HARD GATE)
  - **Screens without protagonist** — every screen must mention the primary company/person. Theory without protagonist = textbook mode. (C62 HARD GATE)
  - `FLIP:` / `THE FLIP:` / `OUTSIDE VIEW:` as section labels
  - `The gap:` as a bold label
  - `By the end, you'll` / `By the end you will` closing formula
  - `Most people assume [X]. The reality is [simpler/more structural].`
  - `[N] things you now know:` synthesis label
  - `[Role] — not a [lesser role] who happens to [verb]`
  - `You are being considered for a [Role] role` interview opener
- Documentary narration voice
- **Cocktail party quotes** — every bold closing line must pass Principle 32's test: "Would someone text this line to a friend?" Generic summaries ("This is why X matters") are banned. Write quotable insights ("The most dangerous requirements are the ones nobody writes down").
- **Standardized card headings** — MCQ cards: "Test Your Instinct". Glossary cards: "Remember This Term". No other headings permitted on exercise cards (C47).
- **No Fabricated Names in MCQs** — MCQ stems must use "you/your" framing. Never invent characters like "Kiran's team", "Meera manages". The learner IS the protagonist. (APTITUDE screens may use first names for calculation context only)
- **No Fabricated Company Scenarios** — Never invent fake business scenarios in MCQs or narrative. Use real companies from the spec's Research Summary or "you/your team" framing
- Narrative screens: anonymous archetypes only (no Mrs. Mehta, no Fund Manager A)
- Indian + Global interleaving (50-50)
- All required screen types present (per screen plan or classic: ORIENT, BRIDGE, FRAMEWORK, APPLY, INTERVIEW)

### Claim-Tracing Generation (Research Registry) — v8.1.0

When the constraint block includes a `Research Registry` (not "none"):

1. **Every factual statement in course prose must trace to an R-number.** This is not a visible annotation — it is a generation constraint. When writing "Hertz sued Accenture for $32M", the generator must confirm R1 exists with verification VERIFIED or PLAUSIBLE before including the number.

2. **Hedging rules for PLAUSIBLE claims:**
   - Replace precise numbers with approximate language: "2,500 restaurants" → "more than 2,000 restaurants"
   - Replace precise percentages with ranges: "16.5%" → "roughly 15-17%"
   - Replace precise timelines with qualifiers: "in six weeks" → "within weeks"
   - Hedging language options (pick the most natural for context): "roughly", "approximately", "around", "more than", "nearly", "close to", "in the range of"
   - DO NOT hedge VERIFIED claims — precision is earned by verification

3. **HIGH RISK claims:** Do not include in course prose unless the spec explicitly notes user approval. If a HIGH RISK claim is the only evidence for a narrative beat, rewrite the beat around verified alternatives or use hedging language with explicit attribution ("according to the company's own reporting").

4. **Claims absent from Registry:** Any factual statement the generator wants to include that does NOT have an R-number must use Tier B language (P37 rules): approximate, qualified, no false precision. This catches synthesis drift — the AI's tendency to generate plausible-sounding specifics that were never in the research.

5. **No claim merging:** Each R-number represents one source. Do not combine R3 ("Pendo found 6.4% of features drive 80% of clicks") with R4 ("Userpilot surveyed 181 companies") into a single sentence or attribution. This is the Pendo/Userpilot precedent from the learnings file.

**When Research Registry is absent (pre-v8.1 specs):** Fall back to existing behavior — use the Company Examples table Verification column. Apply P37 rules for any claims with PLAUSIBLE or HIGH RISK status. The generation constraint is informational, not structural — it does not create new structural checks.

### Interview Block Type (Standard Card)

- The LAST screen MUST use `type: "interview"` block with the standard 3-block structure:
  1. Heading block: `{"type": "text", "variant": "heading", "value": "The Real Question"}`
  2. Text block: `{"type": "text", "value": "You've done the work. You know the framework. Now step up and prove it."}`
  3. Interview block: `topics` = `["This is what interviewers actually ask.", "Record your answer to get AI-powered feedback. Upload your CV for a personalised ideal answer."]`
- Do NOT write a custom interview question. The `name`, `scores`, `guidance`, `feedback` fields are still course-specific.
- This is enforced by C50 and C52.

### Blueprint-Constrained Generation (when blueprint exists in spec)

When Step 2.7 detected a blueprint, generate screens row-by-row matching the Screen Architecture table:

1. Each row in the blueprint table → one screen in the output
2. Screen type column → screen type in the JSON
3. Interactive Block column → specific block type on that screen:
   - Interview:Retention → `mcq` block (4 options, recall-focused, tests preceding 2-3 screens)
   - Interview:Applied → `text_question` block (you/your framing, ≤60 words, guidance with 3-5 criteria)
   - Interview:Current-Affairs → `text_question` block (Framing 5, ≤50 words, real event)
   - Game → no JSON block; game HTML files generated separately by `:game` command
4. Every screen with an interactive block must be preceded by a narrative segway bridge following the bridge requirements in `multi-artifact-rules.md`
5. All existing quality rules still apply (design-philosophy, generation-constraints, voice directives, MCQ rigor)

---

## Step 6: Structural Checks (Concept Sprint)

Load `${CLAUDE_PLUGIN_ROOT}/shared/structural-checks.md` for full check definitions.

**Checks to run for Concept Sprint:**
- C1-C34 (universal checks, with CS-specific variants for C7, C9, C21, C22-C25, C31, C33)
- C44-C56 (v6.0 card architecture)
- C57-C58 (narrative proportion + midpoint story card)
- C59 (genre consistency)
- C60 (image filename uniqueness)
- C61-C65 (v10.0.0-10.2.0 scrollytelling: MCQ position distribution, protagonist presence, no self-created frameworks, resolution post-climax, glossary context dependency)
- C35-C43 (blueprint checks — ONLY when blueprint exists in spec)

### Concept Sprint Check Summary (quick reference)

- [ ] MD file exists at `courses/{slug}-concept-sprint.md`
- [ ] JSON file exists at `courses/JSONS/{slug}.json`
- [ ] JSON parses without errors
- [ ] **Cover placement:** `screens[0].type` is `"cover"` — cover is a screen, not metadata
- [ ] **Cover completeness:** `screens[0]` has `image`, `mobile_image`, `title`, `subtitle`, `description`
- [ ] **No metadata.cover:** the `metadata` object does NOT contain a `cover` key
- [ ] **Description sync:** `metadata.description` === `screens[0].description`
- [ ] Screen count: 12-18 (matches spec's screen count, counting from screens[1] onward for content screens) (per structural-checks.md Authority Table)
- [ ] MCQ count: minimum 4 (matches spec's screen plan)
- [ ] Glossary: 5-7 terms, max 5 glossary cards, with at least 3 practice questions (per structural-checks.md Authority Table)
- [ ] Answer distribution: no letter (A/B/C/D) used more than 4 times across all MCQs
- [ ] MCQ answer-length balance: correct answer is NOT the longest in >50% of MCQs. If violated, auto-rebalance before proceeding.
- [ ] All required screen types present (per screen plan or classic: ORIENT, BRIDGE, FRAMEWORK, APPLY, INTERVIEW)
- [ ] All spec decisions honored (spot-check framework type, contrast approach, interview framing where applicable)
- [ ] `course_metadata.description` exists, is 80-120 characters, follows Opener x Stickiness taxonomy (no jargon, no case-study pivot, no course-catalog verbs)
- [ ] C7-C34 universal checks (see structural-checks.md for full definitions)
- [ ] C44-C56 card architecture checks (see structural-checks.md)
- [ ] C57 narrative proportion ≥55% story screens
- [ ] C58 midpoint screen is a story card (HARD GATE)
- [ ] C59 genre consistency (opening template + framework placement match genre)
- [ ] C60 image filename uniqueness (no image reused across screens)
- [ ] C61 MCQ correct-answer position — no position exceeds 40% (HARD GATE)
- [ ] C62 protagonist mentioned on 90%+ of non-cover screens (HARD GATE)
- [ ] C63 no self-created framework labels — CASH, COVER, PROVE, STRETCH etc. are banned. Real-world frameworks exempt (HARD GATE)
- [ ] C64 resolution screen shows post-climax aftermath, not lesson summary
- [ ] C65 glossary context dependency — companies used as primary examples in glossary definitions must have ≥3 sentences of context on PRECEDING story screens (HARD GATE)
- [ ] C35-C43 blueprint checks (if applicable — see structural-checks.md)

Always defer to `shared/structural-checks.md` for exact pass/fail conditions, severity levels, and error messages.

---

## Narration Bible Rules (from shared/narration-bible.md)

> These rules guide generation BEFORE writing. They are GENERATIVE, not corrective. Apply them during markdown creation to avoid post-generation rewrites.

### Opening (Screens 1-2)
- Screen 1, sentence 1: PHYSICAL MOMENT — a room, a screen, a date, a building. Never a concept.
- If course involves failure: open with the moment of peak confidence/success BEFORE disaster (ironic prosperity).
- Screen 1 must end with a TIME-BOMB sentence — foreshadowing using "would" or a stark fact that contradicts the opening's tone.
- Opening must contain ≥3 sensory anchors: DATE, PLACE, PERSON, AMOUNT, PHYSICAL DETAIL.

### Story Structure (Screens 1-7)
- Story BEFORE framework — ≥3 full story screens before any framework or glossary is named.
- Every story screen anchored to a NAMED PERSON making a decision. No "the company decided..." — people decide.
- Course must have a CONTRAST PAIR — two entities facing same question, different outcomes. Introduce early, resolve at end.
- Mechanisms shown as TRANSMISSION CHAINS (arrows/links/numbered steps), not buried in paragraphs.
- At least one PROOF PARALLEL — second historical instance with specific before/after numbers.

### Concept Introduction
- Glossary terms introduced IN story context, at the moment the reader NEEDS them. Never as standalone definitions.
- Every technical concept gets an ANALOGY BRIDGE — everyday comparison FIRST, then technical explanation.
- Every number/term followed by a TRANSLATION PARENTHETICAL ("correlations spiked toward 1.0 — the mathematical way of saying everything moves together").

### Framework Positioning (Screens 7-10)
- Framework arrives as ANSWER to the story's question, not as course agenda.
- Framework attributed to NAMED PERSON with institutional affiliation ("Jeffrey Pfeffer at Stanford's Graduate School of Business").
- Use GATES/LAYERS/PROTOCOLS language, not "steps" (unless genuinely sequential).
- Framework APPLIED to the course's primary story on the VERY NEXT screen after introduction.

### Bold Closers (Every Story Screen)
- Closers are INSIGHTS (reversal, contradiction, analogy), never summaries.
- Prefer 2-3 sentence setup-turn-landing rhythm ("The board had the vote. But Altman had the gravity. In the end, gravity won.").
- Use NEGATION construction: "X is not Y. It is Z."
- Cocktail Party Test: would someone text this line to a friend? If no, rewrite.

### Resolution (Final Screens)
- Resolution connects to PRESENT MOMENT — most recent development in the ongoing story (a deal, a valuation, a product launch).
- Cover Echo: final bold line contains keyword/phrase from cover title.
- Gap Statement: names the SPECIFIC GAP the course illuminated ("The gap between LTCM and BlackRock is not talent or data. It is whether infrastructure forces assumptions into daylight.").

### Emotional Architecture
- Identifiable CLIMAX between screens 6-10 (story moment, never MCQ/framework).
- One PRESSURE SYSTEMS screen naming forces preventing application (media, social pressure, organizational politics, cognitive bias).
- One COUNTEREXAMPLE INVERSION — entity that succeeded doing the opposite of conventional wisdom (Zappos paying people to quit, VIX>29 as buy signal).
- One EXPERT MOVE with contrarian signal backed by historical proof.

### Language Rules
- Sentence length INVERSELY correlates with emotional intensity. At peak tension: "Neither smiled." At explanation: longer flowing sentences.
- Documentary voice: past-tense omniscient. Narrator knows the ending and uses that knowledge for irony. "What they did not know was..."
- Named sources with PERSON + TITLE + VENUE + DATE attribution. Never "research shows" or "experts agree."
- Use "Nobody asked" construction for introducing core insight ("Nobody asked the question that would have changed everything").

### Research Curation (HARD RULE)

The Research Summary is a SOURCE LIBRARY, not an inclusion requirement. Not everything researched belongs in the course. Include only what the narrative needs.

**Company Examples:**
- The Course Generation Brief names which companies serve Hook, Decode, Tension, Twist, and Expert Move. Use ONLY those companies.
- Maximum 2-3 companies as narrative anchors (the contrast pair + 1 supporting).
- Other researched companies are ALTERNATIVES — use them only if a named company's data proves unverifiable during generation.
- Every company mentioned must have a NARRATIVE ROLE (protagonist, contrast, or proof). "Also, Company X experienced similar challenges..." is filler — cut it.

**Glossary Terms:**
- Create glossary cards ONLY for terms that the narrative EARNS — the term must appear bolded in story prose before becoming a glossary card.
- If the spec lists 7 terms but only 4-5 arise naturally in the story, create 4-5 glossary cards. Do NOT force remaining terms into the narrative.
- Target: 4-5 glossary cards per course (not the spec's maximum of 7).

**Domain Metrics:**
- Include ONLY metrics that illustrate a specific story point.
- Each metric must be a "character" — it proves something in the narrative, not decorates a paragraph.
- Maximum 2-3 metrics per screen. If a screen has 4+ metrics, it's a data table, not a story.

**The Curation Test:** For every research artifact you're about to include, ask: "If I remove this, does the narrative break?" If YES → include it. If NO → cut it.

### Novice-First Audience (HARD RULE)

The target reader is an INTERESTED NOVICE — someone curious about this topic but with ZERO domain knowledge. They clicked on the course because the cover title intrigued them, not because they work in this field.

**Writing:** Every domain term needs context on FIRST use — a one-sentence explanation woven into narrative ("LTCM leveraged to 25 times its equity — meaning every dollar of real money supported $25 of bets."). Jargon density: maximum 2 new domain terms per screen. Analogies are mandatory for abstract concepts. The opening must hook someone who has NEVER heard of this topic.

**Glossary:** Terms should be terms the novice NEEDS, not terms they should already know. Definitions must assume zero background — not "a measure of risk-adjusted return" but "a score that tells you whether a fund's returns came from skill or from taking bigger risks." The glossary card is the novice's reward for reading the story.

**MCQs:** Test UNDERSTANDING via scenarios, not recall via definitions. Stems must describe situations the novice can picture. Distractors represent NOVICE MISCONCEPTIONS — the wrong answers a smart beginner would give. Explanations must teach, not just adjudicate.

**Hook:** The cover title must make a NON-EXPERT curious. Screen 1 must make the novice feel "I need to know what happened next" — not "I should learn this for my career." The story must be INTRINSICALLY interesting, not professionally relevant. Curiosity is the requirement.

### What Is BANNED During Generation
- Learning objectives ("By the end, you'll learn...")
- Meta-commentary ("Now let's look at...", "Having explored X, we turn to Y...")
- Motivational closings ("You're now ready to...", "Armed with these tools...")
- Hedged authority ("It's important to note...", "It should be mentioned...")
- Invented framework acronyms (CASH, PROVE, STRETCH — #1 LLM failure)
- Generic adjectives without evidence ("crucial", "essential", "key", "significant")
- "You'll learn" / "You'll discover" promise hooks
- Present-tense reporter voice for story beats ("the company faces challenges" → "the company faced challenges")
- Solo numbers without contrast pairs (always pair: model vs reality, before vs after)
- Tables that summarize instead of argue (tables must present NEW data/arguments)
