# Agent 6: Storytelling Craft Auditor

> **What this file covers:** Genre-aware narrative quality checks for Rehearsal courses. 11 universal checks (S1-S11) covering Principles 30-36, thriller narrative rules, and global accessibility. Plus genre-specific checks for each of the 8 nonfiction genres.
>
> **When to load:** During `:audit` (Step 3, alongside Agents 1-5), `:refine` (Step 5), and `:audit-story` (Step 4).
>
> **Archetype applicability:** Full checks for Concept Sprint. Hands-On runs S3, S5, S7, S8, S9, S10 only (S1, S2, S4, S6 are CS-specific). Genre-specific checks are Concept Sprint only.
>
> **Key constraint:** ALL checks use deterministic pattern matching (grep, count, negative-pattern detection). No subjective prose quality judgments. No auto-fixes that generate content. No fictitious findings.

---

**Input:** Course JSON + Course MD + Spec (for genre + concept vocabulary) + `genre-system.md`

**Prerequisite:** Read `generation-guide/genre-system.md` for genre-specific check definitions.

---

## Universal Checks (all genres)

<!-- S1_PERSON_PLACE_ACTION -->
### S1 — Person-Place-Action Opening (P30) — SOFT WARN

**Archetype:** Concept Sprint only. Hands-On EXEMPT.

**What it checks:** Screen 1's first body text block must lead with a PERSON (named individual), PLACE (specific location), or ACTION (something happening) — never a metric, methodology, or abstract concept.

**Detection method:**
1. Extract the first sentence of Screen 1's first `"type": "text", "font": "body"` block
2. Check for FAIL patterns (concept/metric openers):
   - Starts with a number, percentage, or currency symbol: `^\d`, `^₹`, `^\$`, `^Rs`
   - Starts with a concept term extracted from the spec's glossary, framework, or Layer 2 skill name
   - Starts with an abstract category phrase: `^(The concept of|The importance of|The role of|The process of|The challenge of)`
3. Check for PASS indicators:
   - Contains a proper noun (capitalized multi-word name) in the first clause
   - Contains a date/year reference (`\b\d{4}\b` in temporal context, or month names) in the first clause
   - Contains an action verb in past tense in the first clause

**Exemptions:**
- Behavioral Science genre (concept IS the hook by design — P33 exemption)
- Hands-On courses (tool introductions, not character narratives)

**Output:** SOFT WARN if fail patterns detected. Include: screen index, first sentence text, which fail pattern matched.

<!-- /S1_PERSON_PLACE_ACTION -->

---

<!-- S2_SENSORY_DENSITY -->
### S2 — Sensory Density Floor (P31) — SOFT WARN

**Archetype:** Concept Sprint only. Hands-On EXEMPT.

**What it checks:** Screens 1-3 must collectively contain ≥12 concrete sensory anchors.

**Detection method:**
1. Scan all body text blocks on Screens 1-3 (excluding headings, MCQ options, blockquotes)
2. Count 5 anchor types:
   - **Dates:** Specific temporal references with year. Pattern: `\b(in|by|during|before|after|since)\s+(January|February|March|April|May|June|July|August|September|October|November|December|the (summer|winter|spring|fall|autumn) of|early|late|mid-)\s*\d{4}\b` or standalone `\b(19|20)\d{2}\b` in temporal context. Generic references ("recently," "over time") do NOT count.
   - **Places:** Named locations — capitalized multi-word place names, street names, building names, city names in descriptive context. Pattern: proper nouns followed by location indicators (Street, Road, office, floor, building, headquarters). Generic places ("the office," "the market") do NOT count.
   - **People:** Named individuals — capitalized two-word or three-word names matching person-name patterns, excluding company names already identified in the spec. Generic references ("the CEO," "analysts") do NOT count.
   - **Amounts:** Specific numbers with currency or units. Pattern: `(₹|\$|Rs\.?|USD|EUR)\s*[\d,.]+\s*(billion|million|crore|lakh|thousand)?` or `\b\d[\d,.]*\s+(billion|million|crore|lakh|partners|employees|stores|outlets|users|customers|percent|%)`. Bare percentages without entity context do NOT count.
   - **Physical details:** Concrete nouns in descriptive context — tangible objects or sensory descriptions. Pattern: look for concrete nouns (paper, phone, desk, floor, glass, door, chair, wall, screen, keyboard, envelope, briefcase) within sentences that describe a scene. Must be specific and descriptive, not metaphorical.
3. Sum unique anchors across all 3 screens. Each distinct anchor counts once even if repeated.

**Thresholds:**
- ≥12: PASS (silent)
- 8-11: SOFT WARN — "Opening has {N} sensory anchors across Screens 1-3 — target is ≥12. Consider adding specific dates, places, or amounts."
- <8: SOFT WARN (strong) — "Opening has only {N} sensory anchors across Screens 1-3 — significantly below the ≥12 target. The opening lacks sensory grounding. Benchmark: LTCM and Vodafone courses achieve 15+ anchors."

**Output:** Anchor count, breakdown by screen, breakdown by type.

<!-- /S2_SENSORY_DENSITY -->

---

<!-- S3_BOTTOM_LINE_QUALITY -->
### S3 — Bottom Line Quality (P32) — SOFT WARN

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** Bold closing lines must create forward momentum — through reversal, contradiction, ambiguity, or reframing. They must NOT summarize or conclude.

**Detection method:**
1. Scan every text block with `"bold": true` across all screens
2. Grep each bold block's text against banned summary patterns:

```
BANNED CLOSER PATTERNS:
- /This is why .* matters/i
- /The key takeaway is/i
- /Understanding .* is essential/i
- /The lesson (is|here is) clear/i
- /^In summary/i
- /The bottom line is/i
- /What this means is that/i
- /The important thing to remember/i
- /This is what makes .* important/i
- /And that'?s (why|how|what)/i
- /Which is exactly why .* need/i
- /It all comes down to/i
- /The (real |true )?lesson here/i
- /What .* teaches us is/i
- /This is the (core|central|fundamental) (insight|lesson|principle)/i
- /In (short|brief|essence)/i
```

3. Flag each match with screen index + full bold text + which pattern matched

**What it does NOT do:** Does not attempt to judge whether a non-matching bold line creates "good enough" forward momentum. Only catches known-bad summary closers.

**Output:** Per-screen SOFT WARN for each banned pattern match. Message: "Screen {N}: Bold closer uses summary pattern '{matched_pattern}' — rewrite as reversal, contradiction, or question that creates forward momentum."

<!-- /S3_BOTTOM_LINE_QUALITY -->

---

<!-- S4_COMPANY_BEFORE_CONCEPT -->
### S4 — Company Depth Before Concept (P33) — SOFT WARN

**Archetype:** Concept Sprint only. Hands-On EXEMPT.

**What it checks:** No framework, methodology, or glossary vocabulary appears in the first 6 sentences of Screen 1. The company's story must establish stakes BEFORE the concept is named.

**Detection method:**
1. Build concept vocabulary from spec:
   - Layer 2 technical skill name and variants
   - All glossary term names
   - Framework names (from spec's Framework section)
   - Methodology terms (any named process, model, or analytical approach)
2. Extract the first 6 complete sentences of Screen 1's body text (sentences = text ending in `.`, `?`, or `!`)
3. Grep each sentence for concept vocabulary matches (case-insensitive)
4. Allow exceptions:
   - Company names that happen to contain concept words (e.g., "Long-Term Capital Management" — "Capital" and "Management" are concept-adjacent but this is a company name)
   - Words used in everyday sense, not technical sense (e.g., "manage" in "he managed a team" is fine; "management framework" is not)

**Exemptions:**
- Behavioral Science genre (concept IS the opening — the bias/finding enters by Screen 1-2)
- Hands-On courses (tool/technique introductions by design)
- Braided Story courses (concept interleaving is intentional)

**Output:** SOFT WARN per match. Message: "Screen 1, sentence {N}: Concept term '{term}' appears before 6 sentences of company narrative. Move conceptual language to sentence 7+ — establish the company/event story first."

<!-- /S4_COMPANY_BEFORE_CONCEPT -->

---

<!-- S5_VISCERAL_STAKES -->
### S5 — Visceral Stakes (P34) — SOFT WARN

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** Tension/stakes must be anchored in named people and specific amounts — not abstract metrics alone.

**Detection method:**
1. Identify all story screens (CS: orient, story_bridge, framework, resolution, advanced_move, deepen; HO: intro, concept, recap)
2. For each story screen, check for co-occurrence of BOTH:
   - A named person (proper noun matching person-name pattern — two+ capitalized words, not matching known company names from the spec)
   - A specific amount (currency symbol + number, or number + unit: `(₹|\$|Rs)\s*[\d,.]+` or `\b\d[\d,.]*\s*(billion|million|crore|lakh|percent|%)`)
3. Count how many story screens have this co-occurrence

**Thresholds:**
- ≥3 screens with person + amount: PASS
- 1-2 screens: SOFT WARN — "Only {N} story screens anchor stakes in named people + specific amounts. Target: ≥3. Visceral tension requires named people facing specific consequences."
- 0 screens: SOFT WARN (strong) — "No story screen anchors stakes in named people + specific amounts. Stakes are entirely abstract. Add named individuals with specific financial, operational, or career consequences."

**Output:** Count, list of qualifying screens, list of screens with abstract-only tension.

<!-- /S5_VISCERAL_STAKES -->

---

<!-- S6_VOICE_SIGNATURE -->
### S6 — Voice Texture Signature (P35) — SOFT WARN

**Archetype:** Concept Sprint only. Hands-On EXEMPT.

**What it checks:** Has the course established a distinctive prose voice by sentence 3 of Screen 1? Uses negative-pattern detection — flags GENERIC openers, does NOT attempt to assess prose "quality."

**Detection method:**
1. Extract sentences 1-3 of Screen 1's body text
2. Grep against banned generic opener patterns:

```
BANNED GENERIC OPENERS:
- /^In today'?s (fast-paced|competitive|dynamic|digital|evolving|modern|complex)/i
- /^Have you ever wondered/i
- /^When it comes to/i
- /^In the world of/i
- /^Every (manager|leader|professional|marketer|product manager|engineer|analyst) knows/i
- /^It'?s no secret that/i
- /^The importance of .* cannot be overstated/i
- /is one of the most (important|critical|essential|valuable|powerful)/i
- /^In an era of/i
- /^As (businesses|organizations|companies|teams) (grow|scale|evolve|transform|adapt)/i
- /^In the (rapidly|constantly|ever-) (changing|evolving|shifting)/i
- /^The (art|science|practice) of/i
- /^Whether you'?re a/i
```

3. Flag each match with the offending sentence and which pattern matched

**What it does NOT do:** Does not assess whether the prose is "distinctive enough." Only catches obviously generic, template-quality openers that signal undifferentiated generation.

**Output:** SOFT WARN per match. Message: "Screen 1, sentence {N}: Generic opener '{matched_text}' — lacks distinctive voice texture. Rewrite with a specific person, ironic detail, or scene-setting action."

<!-- /S6_VOICE_SIGNATURE -->

---

<!-- S7_MIDPOINT_STORY -->
### S7 — Midpoint Story Card (P36) — HARD GATE

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** The screen at the exact midpoint of the course must be a story-type card.

**Detection method:**
1. Count total screens in the `screens` array (including cover at index 0)
2. Calculate midpoint index: `Math.ceil((total_screens - 1) / 2)` (exclude cover from count, then find midpoint)
3. Check the `type` field of the screen at the midpoint index
4. Classify:
   - **Story types (PASS):** `orient`, `story_bridge`, `framework`, `resolution`, `advanced_move`, `deepen` (CS); `intro`, `concept`, `demo`, `artifact`, `recap` (HO)
   - **Non-story types (FAIL):** `terms_in_context`, any screen containing `mcq` blocks, any screen containing `glossary` blocks, `interview`

**Output:** HARD GATE FAIL if midpoint is non-story. Message: "S7 HARD GATE: Midpoint screen (index {N}) is type '{type}' — must be a story card. The midpoint is where attention is most fragile; it must deliver narrative payoff, not mechanical testing. Swap with an adjacent story screen."

<!-- /S7_MIDPOINT_STORY -->

---

<!-- S8_CLIFFHANGER_SEPARATION -->
### S8 — Cliffhanger-Reveal Separation (Thriller #5) — SOFT WARN

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** Tension planted in a bold bottom line should be resolved within 2 screens. Unresolved tension threads indicate narrative gaps.

**Detection method:**
1. Identify bold bottom lines (`"bold": true` text blocks) that plant tension:
   - Lines ending with `?` (explicit questions)
   - Lines containing "would" + future event: `/\bwould\b.*\b(later|eventually|soon|come to|turn out|discover|realize|learn|find|collapse|fail|lose|reveal)/i`
   - Lines containing unresolved contrast: `/\b(but|except|what .* didn'?t know|the (catch|problem|twist|irony) (was|is))\b/i`
2. For each tension-planting line on screen N:
   - Extract the primary entity name (most-mentioned proper noun on screen N)
   - Check screens N+1 and N+2 for the SAME entity name appearing alongside a resolution indicator (verbs: discovered, revealed, collapsed, realized, found, showed, proved, confirmed, resulted, failed, lost, turned out)
3. Flag unresolved tension: a tension line whose primary entity does not appear in screens N+1 or N+2

**What it does NOT do:** Does not judge whether the resolution is "satisfying." Only checks that the narrative thread continues within 2 screens. Some deliberately slow-burn tension across 3+ screens is acceptable — this is SOFT WARN, not HARD.

**Output:** SOFT WARN per unresolved thread. Message: "Screen {N}: Bold closer plants tension about '{entity}' but the thread is not resolved in Screens {N+1}-{N+2}. Consider adding a resolution beat or moving the tension closer to its payoff."

<!-- /S8_CLIFFHANGER_SEPARATION -->

---

<!-- S9_MCQ_ARC_PLACEMENT -->
### S9 — MCQ Placement in Narrative Arc (Thriller #10) — SOFT WARN

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** MCQs should not interrupt a rising-action narrative sequence. An MCQ between two story screens about the same company/entity breaks narrative continuity.

**Detection method:**
1. Identify all MCQ screens (screens containing `"type": "mcq"` blocks)
2. For each MCQ screen at index N:
   - Identify screen N-1 (must be a story screen — if not, skip this check)
   - Identify screen N+1 (must be a story screen — if not, skip this check)
   - Extract the PRIMARY entity from screen N-1: the proper noun (company/person name) mentioned most frequently in that screen's text blocks
   - Extract the PRIMARY entity from screen N+1: same method
3. If N-1 and N+1 share the SAME primary entity, the MCQ interrupts a narrative arc
4. Exception: If the MCQ at N explicitly tests content about that entity (the entity name appears in the MCQ stem), this is intentional pacing, not an interruption — SKIP

**Output:** SOFT WARN per interruption. Message: "Screen {N}: MCQ splits the '{entity}' narrative between Screens {N-1} and {N+1}. Consider moving this MCQ after the narrative arc completes, or ensure the MCQ tests the preceding story content."

<!-- /S9_MCQ_ARC_PLACEMENT -->

---

<!-- S10_DELHI_DINNER_TABLE -->
### S10 — Global Accessibility / Delhi Dinner Table Test — SOFT WARN

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** Every proper noun on Screen 1 must carry a contextual qualifier — who they are, what they did, why the reader should care. Non-Western audiences may not know Western figures (Phil Knight, Tim Draper). Western audiences may not know Indian figures (Mukesh Ambani, N.R. Narayana Murthy). The qualifier makes the course accessible to ANY reader regardless of cultural background.

**Detection method:**
1. Scan Screen 1 body text, sentences 1-6
2. Identify all proper nouns: capitalized multi-word phrases not at sentence start, or single capitalized words matching person/institution patterns (not common nouns like "The" or "He")
3. For each proper noun, check if a contextual qualifier exists in the SAME sentence or the NEXT sentence:
   - **Qualifier types:** role/title ("a bond trader," "the CEO of"), company affiliation ("at Salomon Brothers," "of Nike"), achievement/context ("whose employer paid him $60M," "who would later build"), geographic/temporal context ("from Portland," "in 1962")
   - **Pattern:** Proper noun followed within 50 characters by an em dash + clause, a parenthetical, an appositive, a relative clause ("who"), or a prepositional phrase ("at/of/from")
4. FAIL if any proper noun lacks a qualifier within the same or next sentence

**Exemptions:**
- Tier-1 global brands that need no introduction: Google, Apple, Amazon, Tesla, Microsoft, Netflix, Coca-Cola, Samsung, Toyota, McDonald's, Facebook/Meta, IBM, Intel, Nike, Adidas, Disney
- Country names, well-known city names (New York, London, Tokyo, Mumbai, Delhi, Beijing, Paris)
- Entities previously introduced with context in an earlier sentence on the same screen
- Hands-On courses with tool names as proper nouns (these are introduced by function, not biography)

**Output:** SOFT WARN per unqualified proper noun. Message: "Screen 1, sentence {N}: '{Name}' lacks contextual qualifier. Non-Western/Western audiences may not know this figure. Add a qualifying clause — role, company, achievement, or geographic context."

<!-- /S10_DELHI_DINNER_TABLE -->

---

<!-- S11_SPECULATIVE_NUMBERS -->
### S11 — Speculative Numbers on Story Bridges (P37) — SOFT WARN

**Archetype:** Both (Concept Sprint and Hands-On).

**What it checks:** Story bridge screens (orient, story_bridge, contrast, twist, expert_move, resolution) should not contain Tier B numbers in precise format. Tier B = single-source, internal, or contested numbers (see P37 in design-philosophy.md).

**Detection method:**
1. Identify all story-type screens (exclude cover, terms_in_context, first_apply, harder_apply, interview)
2. For each story screen, scan body text blocks for precise number patterns:
   - Comma-separated thousands: `\b\d{1,3},\d{3}\b` (e.g., "2,500", "6,500")
   - Decimal percentages: `\b\d+\.\d+%` (e.g., "16.5%", "27.3%")
   - Multi-digit precise currency: `(₹|\$)\s*\d{3,}` without rounding qualifiers within 3 words before (e.g., "₹205 million" but NOT "more than ₹200 million")
3. For each match, check if the number appears in the spec's Research Summary with 2+ named sources (Tier A). If yes, precision is justified — skip.
4. If the number is Tier B (1 source, PLAUSIBLE, or absent from spec research), WARN.

**Thresholds:**
- Non-contrast/twist story screen with ANY Tier B precise number: SOFT WARN
- Contrast/twist screen with >3 Tier B precise numbers: SOFT WARN
- Non-contrast/twist screen with 4+ numbers of any tier: SOFT WARN (even Tier A numbers in bulk create data-report tone)

**Output:** SOFT WARN per occurrence. Include: screen index, the precise number found, whether Tier A or B, and a suggested speculative alternative (e.g., "2,500 → 'more than 2,000'").

<!-- /S11_SPECULATIVE_NUMBERS -->

---

## Genre-Specific Checks

After universal checks complete, extract the genre from the spec and run genre-specific checks. Each genre has 3-5 checks based on its 4 prose mechanisms + DO NOTs from `genre-system.md`.

**If no genre field in spec (legacy course):** Skip all genre-specific checks. Log: "No genre field — genre-specific checks skipped."

**If Hands-On archetype:** Skip all genre-specific checks. Log: "Hands-On archetype — genre-specific checks skipped."

---

<!-- GENRE_LITERARY_JOURNALISM -->
### Literary Journalism Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **LJ1: Compressed characterization** | Screen 1 contains a named person with a telling detail (ironic, behavioral, or physical) within the first 2 sentences. Grep for: proper noun + descriptive clause (em dash, appositive, or relative clause) within 100 characters. WARN if Screen 1 sentence 1-2 has no named person with characterization. | SOFT WARN |
| **LJ2: Ironic foreshadowing** | Grep screens 1-3 for "would" + future event construction: `/\bwould\b\s+\w+\s+(later|eventually|come to|turn out)/i`. Also check for ironic constructions: present-tense success described in past tense (signaling the narrator knows the ending). WARN if no foreshadowing found in screens 1-3. | SOFT WARN |
| **LJ3: Slow zoom structure** | Screen 1 should focus on one person/entity (tight). Screens 7+ should reference industry/pattern/multiple entities (wide). Count distinct entity names on Screen 1 vs screens in the second half. WARN if Screen 1 mentions ≥3 entities (too wide for Literary Journalism opening) OR if second-half screens mention only the same single entity as Screen 1 (no zoom-out). | SOFT WARN |
| **LJ4: Concept timing** | Grep spec's concept vocabulary (skill name, framework names, methodology terms) in screens 1-4. WARN if any concept term appears before Screen 5: "Concept term '{term}' appears on Screen {N} — Literary Journalism delays concept naming until after the story establishes stakes." | SOFT WARN |
| **LJ5: Genre DO NOTs** | Grep screens 1-5 for: `/(you'?ll learn|by the end|this course (will|covers|teaches)|what you'?ll (discover|understand|master))/i`. WARN per match: "Literary Journalism never tells the reader what they'll learn — the story pulls them forward." | SOFT WARN |

<!-- /GENRE_LITERARY_JOURNALISM -->

---

<!-- GENRE_INVESTIGATIVE -->
### Investigative Journalism Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **IJ1: Surface metric** | Screen 1 should present a plausible, positive-seeming metric in the company's own language — the "everything looks normal" setup. Check if Screen 1 contains a number/metric presented without negative framing (no "but," "however," "failed," "missed" in the same sentence as the first metric). WARN if Screen 1's first metric appears with negative framing (reveals the problem too early). | SOFT WARN |
| **IJ2: Progressive layer-peeling** | Count "crack" moments across story screens — sentences where a negative revelation follows a positive setup. Pattern: grep for contrast markers (`but`, `however`, `except`, `what .* didn't`, `the reality`, `in fact`, `turned out`) on story screens. WARN if fewer than 3 distinct crack moments across the course. | SOFT WARN |
| **IJ3: Institutional voice shift** | Check if early screens (1-4) contain PR/marketing language (`announced`, `committed to`, `vision`, `innovation`, `industry-leading`, `pioneering`) AND later screens (7+) contain data-gap language (`but the data showed`, `internal documents`, `actual numbers`, `investigation found`). WARN if no voice shift detected. | SOFT WARN |
| **IJ4: Genre DO NOTs** | Grep Screen 1 for sympathy-first framing: `/^(The (tragic|sad|unfortunate)|Unfortunately|Sadly|It'?s a shame)/i`. Investigative Journalism opens with surface credibility, not sympathy. WARN per match. | SOFT WARN |
| **IJ5: Reveal timing (v7.4.0)** | Screen 1 must present the PLAUSIBLE SURFACE, not the hidden finding. Extract the spec's "Counterintuitive Finding" from the Research Summary — this is the core contradiction the investigation reveals. Grep Screen 1 body text (all `type: "text"` blocks) for the hidden finding's key claim phrase. WARN if found: `"IJ5: Screen 1 contains the hidden finding — '{phrase}'. Investigative Journalism requires progressive disclosure: Screen 1 presents plausible certainty, the crack widens card by card. Move the core revelation to Screen 3+."` Also grep Screen 1 for the framework/methodology NAME from the spec's Framework section. WARN if found: `"IJ5: Framework '{name}' named on Screen 1. IJ delays structural patterns until evidence converges (typically Screen 5+)."` | SOFT WARN |

<!-- /GENRE_INVESTIGATIVE -->

---

<!-- GENRE_INDUSTRY_EPIC -->
### Industry Epic Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **IE1: Company count** | Count distinct company proper nouns across all story screens (exclude MCQ/glossary screens). Company names = proper nouns from the spec's Research Summary company list. WARN if <3 companies: "Industry Epic requires ≥3 companies across the narrative sweep." | SOFT WARN |
| **IE2: Single-company dominance** | Walk through consecutive story screens. If any single company is the primary entity (most-mentioned proper noun) for 3+ consecutive story screens, WARN: "'{Company}' dominates Screens {N}-{N+2} — Industry Epic should alternate between entities to maintain sweep." | SOFT WARN |
| **IE3: Time span** | Extract all 4-digit year numbers from story screens. Calculate max - min. WARN if span <10 years: "Industry Epic time span is only {N} years — target is a decade+ sweep." | SOFT WARN |
| **IE4: Geographic diversity** | Grep story screens for country names, continent names, and city names from different regions. WARN if <2 distinct geographies: "Industry Epic references only {N} geography — target is ≥2 for global sweep." | SOFT WARN |

<!-- /GENRE_INDUSTRY_EPIC -->

---

<!-- GENRE_CORPORATE_BIOGRAPHY -->
### Corporate Biography Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **CB1: Internal cultural artifact** | Grep story screens for internal-perspective markers: meeting names, internal jargon in quotes, office/building descriptions, internal process names, rituals. Pattern: text in quotation marks that reads as internal language, or phrases like `(internal|internally|inside the company|behind closed doors|in the boardroom|at headquarters)`. WARN if no internal artifact found: "Corporate Biography needs at least one internal cultural artifact — a meeting ritual, internal term, or physical space description." | SOFT WARN |
| **CB2: Leadership decision** | Grep for board/leadership decision language: `(board|CEO|founder|chairman|leadership team|executive committee)\s+\w+\s+(decided|chose|approved|rejected|overruled|announced|signed|authorized)`. WARN if no leadership-level decision found across story screens. | SOFT WARN |
| **CB3: Genre DO NOTs** | Grep story screens for external analyst language: `/(market analysts|industry observers|experts (say|believe|note|suggest)|according to analysts|Wall Street (expects|believes))/i`. Count screens with matches. WARN if >2 screens contain external analyst language: "Corporate Biography uses inside-the-company perspective — external analyst language on {N} screens breaks the internal view." | SOFT WARN |

<!-- /GENRE_CORPORATE_BIOGRAPHY -->

---

<!-- GENRE_GEOPOLITICAL -->
### Geopolitical Analysis Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **GA1: Structural mechanism** | Grep story screens for structural/systemic terms: `(geography|demographics|resource (constraint|scarcity|abundance)|institutional (design|structure|inertia)|structural (force|mechanism|constraint|advantage)|systemic|regardless of (who|which|what)|any (leader|government|administration) would)`. WARN if no structural mechanism language found. | SOFT WARN |
| **GA2: Inevitability sentence** | Grep for inevitability constructions: `/(regardless of who|no matter (who|which|what)|any (leader|president|prime minister|CEO) would|the (geography|structure|institution) (demands|requires|forces|constrains|ensures)|this would have happened (regardless|anyway|no matter))/i`. WARN if not found: "Geopolitical Analysis requires an inevitability sentence — the structural force operates regardless of individual actors." | SOFT WARN |
| **GA3: Genre DO NOTs** | Check if the course focuses on a single individual as a hero/villain without connecting their actions to structural forces. Count screens where a single person's name is the most-mentioned proper noun AND no structural mechanism term appears on that screen. WARN if >3 such screens: "Geopolitical Analysis has {N} screens focused on individual agency without structural mechanism — connect individual actions to systemic forces." | SOFT WARN |

<!-- /GENRE_GEOPOLITICAL -->

---

<!-- GENRE_BEHAVIORAL_SCIENCE -->
### Behavioral Science Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **BS1: Cognitive trap opening** | Check Screen 1 for a question, puzzle, or scenario that activates a bias. Grep for: question marks in body text, numerical puzzles (e.g., "costs $X more than"), counterintuitive claims (`most people (think|assume|believe)`, `you probably (thought|assumed|guessed)`). WARN if Screen 1 has no question or trap mechanism: "Behavioral Science must open with a cognitive trap — a question or puzzle that activates the bias before naming it." | SOFT WARN |
| **BS2: Early concept naming** | Grep Screens 1-2 for the spec's bias/concept name (from glossary or framework). PASS if concept is named by Screen 2. WARN if concept doesn't appear until Screen 3+: "Behavioral Science names the bias/concept by Screen 2 — the reader must EXPERIENCE the trap, then immediately learn its name." | SOFT WARN |
| **BS3: Named experiment** | Grep story screens for named experiments/studies. Pattern: researcher name (proper noun) + research verb (`(found|showed|demonstrated|discovered|published|conducted|ran|designed)\s+(a |an |the )?(study|experiment|research|trial|test)`) OR study name + finding (`(study|experiment|research)\s+(found|showed|demonstrated|revealed)\s+that`). WARN if no named experiment found: "Behavioral Science needs at least one named experiment with researcher name + effect size." | SOFT WARN |
| **BS4: Genre DO NOTs** | Check whether the bias/concept is the narrative protagonist or merely a label. Count screens where the bias name appears. If the bias name appears on <50% of story screens, WARN: "Behavioral Science uses the bias as protagonist — it should recur on most story screens as the analytical lens, not just be named once." | SOFT WARN |

<!-- /GENRE_BEHAVIORAL_SCIENCE -->

---

<!-- GENRE_LEGAL_REGULATORY -->
### Legal/Regulatory Thriller Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **LR1: Spectrum framing** | Grep screens 1-3 for spectrum/ambiguity language: `/(was it .* or|technically (legal|compliant|permissible)|the (line|boundary|distinction) between|grey (zone|area)|depends on (how|who|which|whether))/i`. WARN if no spectrum framing found in first 3 screens: "Legal/Regulatory Thriller must establish a grey zone or spectrum early." | SOFT WARN |
| **LR2: Adversarial pair** | Check for two opposing interpretations of the same facts. Grep for adversarial markers: `/(prosecutors?|regulators?|the (court|judge|tribunal)|defense|argued|contended|claimed|countered|maintained)/i` appearing across 2+ screens. WARN if no adversarial pair found: "Legal/Regulatory Thriller needs an adversarial pair — same facts, opposite readings." | SOFT WARN |
| **LR3: Legal specificity** | Grep for specific legal references: statutory provision numbers (`Section \d+`, `Article \d+`, `Rule \d+`), case names (proper noun + `v\.?` or `vs\.?` + proper noun), specific dates of rulings/filings. WARN if no specific legal reference found: "Legal/Regulatory Thriller should cite at least one specific provision, case name, or ruling date." | SOFT WARN |
| **LR4: Genre DO NOTs** | Grep for black-and-white certainty language: `/(clearly (illegal|wrong|fraudulent|criminal)|obviously (wrong|illegal)|without question|unambiguously|there'?s no (doubt|question|ambiguity))/i`. WARN per match: "Legal/Regulatory Thriller maintains ambiguity — '{matched_text}' removes the grey zone that drives the genre." | SOFT WARN |

<!-- /GENRE_LEGAL_REGULATORY -->

---

<!-- GENRE_PRACTITIONER_MEMOIR -->
### Practitioner Memoir Checks

| Check | What it greps for | Severity |
|-------|------------------|----------|
| **PM1: Domain jargon with translation** | Grep for field-specific terms followed by explanation. Pattern: `**term**` in bold followed within 2 sentences by a plain-English explanation, OR term in quotes followed by `(—|–|:|\()` + explanation. Count distinct jargon-with-translation instances. WARN if <3: "Practitioner Memoir needs ≥3 field-specific terms with plain-English translation — this is what creates 'from the trenches' authenticity." | SOFT WARN |
| **PM2: Field metrics** | Grep for operational metrics with specific numbers — patterns where a metric name is followed by a number: `(₹|\$|Rs)\s*[\d,.]+\s+per\s+(day|outlet|beat|route|visit|call)` or `\d+\s+(outlets|stores|calls|visits|routes|beats|clients)\s+per\s+(day|week|month)`. WARN if <2: "Practitioner Memoir needs ≥2 field metrics with specific numbers — operational details that only a practitioner would know." | SOFT WARN |
| **PM3: Field perspective** | Grep for practitioner-voice markers: first-person indicators or field-level language. Pattern: `/(from the (field|ground|front lines|shop floor|trading floor)|in (practice|reality|the field)|when you'?re (actually|on the ground|in the room|at the store)|the (trick|secret|reality|truth) (is|that) most .* don'?t)/i`. WARN if no field perspective found across story screens: "Practitioner Memoir needs practitioner voice — 'from the trenches' language, not academic case-study distance." | SOFT WARN |
| **PM4: Genre DO NOTs** | Grep for academic case-study distance: `/(the organization (implemented|adopted|deployed|launched)|a (comprehensive|systematic|holistic) (approach|strategy|framework) was|the (company|firm|organization) (undertook|embarked on|initiated))/i`. WARN per match: "Practitioner Memoir uses '{matched_text}' — this reads like an academic case study, not a field practitioner's account." | SOFT WARN |

<!-- /GENRE_PRACTITIONER_MEMOIR -->

---

## Output Format

```
STORYTELLING CRAFT AUDIT — {slug}
Genre: {genre} (from spec) | Archetype: {archetype}
════════════════════════════════════════════════

UNIVERSAL CHECKS (S1-S10)
─────────────────────────
S1  Person-Place-Action Opening    {PASS|WARN}  {detail if WARN}
S2  Sensory Density Floor          {PASS|WARN}  {count}/12 anchors
S3  Bottom Line Quality            {PASS|WARN}  {N} banned patterns found
S4  Company Before Concept         {PASS|WARN}  {detail if WARN}
S5  Visceral Stakes                {PASS|WARN}  {N}/≥3 screens with person+amount
S6  Voice Texture Signature        {PASS|WARN}  {detail if WARN}
S7  Midpoint Story Card            {PASS|FAIL}  Screen {N} type: {type}
S8  Cliffhanger-Reveal Separation  {PASS|WARN}  {N} unresolved threads
S9  MCQ Placement in Arc           {PASS|WARN}  {N} narrative interruptions
S10 Delhi Dinner Table Test        {PASS|WARN}  {N} unqualified proper nouns

GENRE-SPECIFIC CHECKS ({genre})
─────────────────────────────────
{XX}1  {check name}               {PASS|WARN}  {detail}
{XX}2  {check name}               {PASS|WARN}  {detail}
...

SUMMARY
───────
Universal:      {N}/10 passed
Genre-specific: {N}/{total} passed
HARD GATE:      {PASS|FAIL} (S7 only)
Overall:        {PASS|WARN — {N} items flagged}
```

**No auto-fix suggestions that generate content.** Each WARN includes the screen index, the specific text that triggered it, and the rationale from the genre definition — but no proposed rewrite. Storytelling fixes require editorial judgment.

---

## Narration Bible Checks (S-NR1 through S-NR10)

> Source: `shared/narration-bible.md` — 47 principles extracted from 4 hand-reworked courses (Thesis Construction, Corporate Governance, Crisis Investing, Attrition Diagnostics). These checks validate the narration quality that separates documentary-grade courses from AI-generated content.

### S-NR1: Sensory Doorway Opening (Principle 1.1)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

Screen 1, sentence 1 must place the reader in a PHYSICAL MOMENT — a room, a screen, a photograph, a building, a specific date — not a concept or abstraction.

**Detection:** Scan Screen 1's first sentence (first text block, first sentence). Flag if it:
- Opens with a generic concept ("Thesis construction is...", "Corporate governance involves...")
- Opens with "In today's..." or "In recent years..."
- Lacks any of: named person, named place, specific date, specific amount, physical detail

**Pass criteria:** First sentence contains ≥2 of: DATE (year/month/day), PLACE (named city/building/event), PERSON (named individual), AMOUNT (specific number with unit), PHYSICAL DETAIL (tactile/visual element).

### S-NR2: Ironic Prosperity Before Disaster (Principle 1.2)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

If the course's primary story involves failure, crisis, or collapse, the opening should depict SUCCESS or confidence before revealing the disaster.

**Detection:** If cover description or spec contains failure/crisis keywords (collapse, failure, crisis, mistake, loss, resigned, fired), check whether Screen 1 depicts prosperity, confidence, or success BEFORE the first negative event. Flag if Screen 1 opens with the crisis directly.

### S-NR3: Time-Bomb Sentence (Principle 1.3)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

Screen 1 must end with a sentence that foreshadows coming disaster/tension — a narrative pull that makes Screen 2 mandatory.

**Detection:** Check the last bold block or last sentence of Screen 1. Flag if it:
- Summarizes the course's topic ("This course explores...")
- States a learning objective
- Lacks foreshadowing language (past-conditional "would", stark contradiction, time-jump)

**Pass criteria:** Last statement contains foreshadowing constructions: "would later...", "had already...", "X months later...", or a stark factual statement contradicting the opening's tone.

### S-NR4: Story Before Framework (Principle 2.1)

**Scope:** Both archetypes. **Severity:** HARD GATE.

Framework or glossary screens must appear AFTER ≥3 narrative story screens have established the need.

**Detection:** Count screens from index 1 to the first `terms_in_context`, `framework`, or `deepen` screen. If fewer than 3 story screens (orient + story_bridge) precede the first concept/framework screen, FAIL.

**Pass criteria:** First non-story screen type (terms_in_context, framework, deepen, first_apply) has index ≥ 4 (cover=0, plus ≥3 story screens).

### S-NR5: Framework Attribution (Principle 4.2)

**Scope:** Both archetypes. **Severity:** SOFT WARN.

Framework screens should credit a NAMED PERSON with institutional affiliation, not present frameworks as floating intellectual property.

**Detection:** For each `framework` type screen, scan text blocks for proper nouns followed by institutional qualifiers ("at Stanford", "at Harvard", "CEO of", "founder of"). Flag if the framework screen has no named person attribution.

### S-NR6: Philosophical Punch (Principle 5.1)

**Scope:** Both archetypes. **Severity:** SOFT WARN.

Bold closing lines must be INSIGHTS (reversal, contradiction, analogy), not summaries.

**Detection:** For each bold block at the end of story/framework/resolution screens, flag if it:
- Starts with "This is why..." or "This shows that..." or "This demonstrates..."
- Contains "is important" or "is essential" or "is crucial"
- Restates the screen's content without adding insight
- Lacks negation/reversal patterns ("is not X. It is Y." / "The real X is not Y.")

**Pass criteria:** Bold closer contains at least one: negation construction, contradiction, analogy, or quotable reframing.

### S-NR7: Gap Statement in Resolution (Principle 9.3)

**Scope:** Both archetypes. **Severity:** SOFT WARN.

The resolution screen's final statement must name a SPECIFIC GAP — not a summary or motivational closing.

**Detection:** Check the last bold block on the `resolution` screen. Flag if it:
- Is a motivational call to action ("You're now ready to...")
- Is a generic summary ("This is why X matters...")
- Lacks a gap/contrast construction ("The gap between...", "The difference between...", "X is not Y, it is Z")

### S-NR8: Pressure Systems Screen (Principle 10.2)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

At least one screen should name the FORCES that will push the learner AWAY from applying the concept.

**Detection:** Scan all story_bridge screens for language about obstacles, forces, pressure, resistance, traps, reasons for failure. Flag if no screen addresses WHY applying the concept is HARD (media pressure, organizational politics, cognitive bias, social pressure, biological impulses).

### S-NR9: Contrarian Signal (Principle 15.1)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

An `advanced_move` or late-course screen should present a contrarian or expert-level insight that adds nuance beyond the main framework.

**Detection:** Check for existence of `advanced_move` screen type OR a late-course story_bridge (index ≥ 10) that introduces counterintuitive content. Flag if neither exists and course has ≥12 screens.

### S-NR10: Documentary Voice (Principle 11.2)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

Story screens should use past-tense omniscient narration, not present-tense reporter voice.

**Detection:** On orient and story_bridge screens, count present-tense active verbs ("markets respond", "the company decides", "investors sell") vs past-tense narration ("markets responded", "the company decided", "investors sold"). Flag if >30% of main verbs are present-tense on story screens (framework/resolution screens may use present tense).

---

## Updated Output Format

```
NARRATION BIBLE CHECKS
─────────────────────────────────
S-NR1  Sensory Doorway Opening     {PASS|WARN}  {detail if WARN}
S-NR2  Ironic Prosperity           {PASS|WARN|N/A}  {detail}
S-NR3  Time-Bomb Sentence          {PASS|WARN}  {detail}
S-NR4  Story Before Framework      {PASS|FAIL}  First concept at screen {N}
S-NR5  Framework Attribution       {PASS|WARN}  {N} unattributed frameworks
S-NR6  Philosophical Punch         {PASS|WARN}  {N} summary closers
S-NR7  Gap Statement               {PASS|WARN}  {detail}
S-NR8  Pressure Systems            {PASS|WARN}  {detail}
S-NR9  Contrarian Signal           {PASS|WARN}  {detail}
S-NR10 Documentary Voice           {PASS|WARN}  {N}% present-tense on story screens
S-NR11 Glossary Googleability      {PASS|WARN}  {N} terms not verifiable
```

### S-NR11: Glossary Term Googleability (Principle 3.1 corollary)

**Scope:** Both archetypes. **Severity:** SOFT WARN.

Every glossary term should be "Googleable" — a learner who searches for the term should find results from legitimate domain sources (textbooks, industry publications, practitioner blogs, academic papers).

**Detection:** For each glossary term, apply the Googleability heuristic:
- Is the term used in the spec's research sources? (PASS)
- Is the term a standard domain abbreviation or acronym? (PASS)
- Is the term a 3+ word compound that doesn't appear in any research source? (WARN — likely fabricated)
- Is the term a well-known concept given a novel label? (WARN — use the established name instead)

**Pass criteria:** All glossary terms would return relevant results if a learner searched for them. If a term only exists because the LLM coined it during research or generation, it fails this check.

**Why this exists:** "Competence-to-Compatibility Shift" sounds like an established HR concept. It is not. A learner who Googles it finds zero results and loses trust in the entire course. This check ensures every glossary term has real-world grounding.

### S-NR12: Research-to-Narrative Ratio (v10.8.0)

**Scope:** Concept Sprint only. **Severity:** SOFT WARN.

Every company mentioned should have a NARRATIVE ROLE — protagonist, contrast entity, or proof case. Flag companies that appear as drive-by mentions ("Company X also experienced..." or "Similarly, at Company Y...") without serving the story arc.

**Detection:** For each company name, count sentences about it across the entire course. If a company has ≤ 1 sentence, it's a drive-by mention with no narrative role.

**Pass criteria:** Every company mentioned has ≥ 3 sentences of narrative context (protagonist treatment) OR is used as a single-sentence proof point in a framework/resolution screen (supporting evidence — max 2 such companies per course).

### S-NR13: Novice Accessibility (v10.8.0)

**Scope:** Both archetypes. **Severity:** SOFT WARN.

The course must be accessible to someone with ZERO domain knowledge.

**Detection:**
- Jargon density: Count domain-specific terms introduced per screen. WARN if any screen introduces > 2 new terms without analogy bridges.
- First-screen accessibility: Screen 1 must not assume domain knowledge. Flag if Screen 1 uses unexplained jargon in its first 3 sentences.
- MCQ calibration: Check MCQ explanations. WARN if explanations assume knowledge not taught in the preceding screens.
- Glossary definitions: WARN if any glossary definition uses domain terms not previously introduced in the course.

**Pass criteria:** A motivated 22-year-old with a general education but no domain expertise could follow the entire course without external research.

### S-NR14: Antithesis Flourish Detector (v10.9.0)

**Scope:** Both archetypes. **Severity:** SOFT WARN (flag for user review; do not auto-delete — ~1% are earned punchlines).

Pipeline reflex is to close paragraphs with contrastive antithesis ("It is not X. It is Y." / "Not X. But Y." / "The metric everyone tracked was measuring two different diseases with the same thermometer."). These constructions are pure rhetorical swing with no information gain and were cut in 20/20 CMS-edited courses.

**Detection (regex patterns, apply case-insensitively):**
- `(It|This|That|They|We)\s+(is|are|was|were|did|do)\s+not\s+[^.]{3,80}\.\s+(It|This|That|They|We|Instead)\s+[^.]{3,80}\.`
- `(?:^|[.!?]\s+)Not\s+[^.]{3,60}\.\s+But\s+[^.]{3,80}\.`
- `The\s+(?:real|actual|true)\s+\w+\s+is\s+not\s+[^.]{3,60}\.\s+It\s+is\s+[^.]{3,80}\.`

**Pass:** Zero flagged antithesis pairs per screen, OR flagged pair has explicit user approval (marked in course metadata as an earned punchline).

**Fail message:** "S-NR14 WARN: Screen {N} contains antithesis flourish '{quote}'. This pattern was cut in 20/20 humanization-audited courses. Review: either delete (default) or mark as earned punchline if the contrast carries unique information."

**Fix tier:** Tier 2 (user approval). Default fix = delete the second sentence of the pair and keep the first.

### S-NR15: Filler-Screen Title Blacklist (v10.9.0)

**Scope:** Concept Sprint. **Severity:** HARD GATE (for `story_bridge` screens that duplicate prior content); SOFT WARN (for all other matches).

Certain screen-title patterns signal preamble/recap/restatement screens whose entire job is to restate prior material in different form. These screens were deleted wholesale in 16/20 humanization-audited courses.

**Detection (title regex, case-insensitive):**
- `^The\s+(Crime\s+Scene|Chain\s+of\s+\w+|Behavioral\s+Gap|Outsider'?s?\s+Observation|Exception\s+That\s+Proves\s+\w+|Structural\s+Explanation|Three[- ]\w+\s+Comparison)$`
- `^What\s+(Shifted|Changed|Broke|Happened)$` (when not a story-outcome screen)
- `^[A-Z]\w+\s+in\s+the\s+Field$` (e.g., "COVER in the Field")

**Pass:** No screen title matches. If a match exists, the screen must justify its presence by carrying ≥1 new named entity, date, or numeric fact not present on any prior screen.

**Fail message:** "S-NR15 GATE: Screen {N} title '{title}' matches filler-screen blacklist. Screen type is `story_bridge` and body content duplicates prior material (overlap = {overlap_pct}%). Delete this screen and redistribute its best sentence into the adjacent story screen."

**Fix tier:** Tier 2 (user approval) — deletion shifts screen indexing and may affect C58 midpoint check.

### S-NR16: Resolution = Protagonist Epilogue, Not Coach Sermon (v10.9.0)

**Scope:** Both archetypes. **Severity:** HARD GATE.

The final story screen (before `apply` and `interview`) must close on dated protagonist outcome, not second-person moralizing. This extends C64 (post-climax aftermath) with a specific banlist on sermon templates observed in 15/20 pipeline outputs.

**Detection (terminal-sentence regex on the last story screen's last text block):**
- `^(?:The|Your)\s+\w+\s+was\s+never\s+the\s+problem\.` (sermon close)
- `^Before\s+this\s+course\s+you\s+thought` (meta-reflection close)
- `^(?:You\s+are|You'?re)\s+not\s+a\s+\w+[.,]` (identity-aphorism close)
- Any second-person closing sentence on a resolution screen where no date or numeric outcome appears in the preceding three sentences.

**Pass:** Final story screen closes with protagonist's dated post-decision fact (e.g., "Berry resigned in November 2025", "Sarin left Vodafone for Telkomsel in 2008", "Maggi recovered to 60% market share by 2018").

**Fail message:** "S-NR16 GATE: Resolution screen {N} ends with coach sermon '{quote}'. Humanization audit found 15/20 courses needed this rewritten to a dated protagonist outcome. Replace the closing sentence with a specific date + event from the protagonist's post-decision record."

**Fix tier:** Tier 2 (user approval) — requires research to find the dated outcome.

### S-NR17: No Course-Preview Chatter (v10.9.0)

**Scope:** Both archetypes. **Severity:** HARD GATE.

Course-meta self-reference is a generator tell. Sentences that describe what the course will do next (or in later screens) were cut from 12/20 humanization-audited courses.

**Detection (regex, case-insensitive, per screen body):**
- `What\s+follows\s+will\s+(?:invert|challenge|reveal|expose)`
- `The\s+pattern\s+has\s+a\s+name\.?\s+And\s+a\s+playbook\.`
- `In\s+the\s+next\s+(?:few\s+)?(?:minutes|screens|sections)\s+you\s+will`
- `You\s+are\s+about\s+to\s+(?:see|discover|learn)`
- `By\s+the\s+end\s+of\s+this\s+course,?\s+you`

**Pass:** Zero course-preview sentences. Claims about the story's surprise or the protagonist's decision are fine; claims about what the *course* will show are banned.

**Fail message:** "S-NR17 GATE: Screen {N} contains course-preview chatter '{quote}'. Remove meta-narrative self-reference. The reader is inside the story, not being tour-guided through the LMS."

**Fix tier:** Tier 1 (auto-fix) — delete the offending sentence.

### S-NR18: Documentary Voice Compliance (v10.17.0)

**Scope:** Both archetypes. **Severity:** SOFT WARN (4 pattern families — all require judgment, not auto-fixable).

Narrative-voice-layer patterns that V-NR8 can't catch because they need content understanding (e.g., "vague attribution" requires knowing whether a source is named; "false ranges" require knowing whether X and Y are on the same scale).

**Pattern families (4):**

| # | Family | Detection | Fail message template |
|---|---|---|---|
| 1 | Undue Emphasis on Significance/Legacy | Grep for: `pivotal moment`, `evolving landscape`, `indelible mark`, `key turning point`, `represents a shift`, `marks a shift`, `deeply rooted in`, `setting the stage for` | "S-NR18.1 WARN: Screen {N} uses abstract-significance phrase '{match}'. Replace with a concrete stake — what specifically changed, for whom, with what measurable consequence?" |
| 2 | Vague attributions (no named source) | Grep for: `experts argue`, `industry reports suggest`, `observers have cited`, `some critics argue`, `several sources indicate`, `many believe`. For each hit, check the same screen body for a named source (proper noun + institution/publication). If no named source within 100 chars of the match, flag. | "S-NR18.2 WARN: Screen {N} uses vague attribution '{match}' without a named source. Either cite a specific expert/publication/study within this screen or delete the attribution." |
| 3 | False ranges (X and Y not on same scale) | Grep for: `from .{1,60} to .{1,60}` patterns. Flag for human review when the two endpoints are clearly different categories (e.g., "from the Big Bang to dark matter" — astronomy events vs phenomena). Heuristic: if both endpoints are proper nouns from different domains, warn. | "S-NR18.3 WARN: Screen {N} may contain a false range '{match}'. Verify X and Y are on the same meaningful scale; otherwise restructure as a list or separate sentences." |
| 4 | Generic positive conclusions (recap/synthesis screens) | On screens where `screen_type` is `recap`, `synthesis`, or `resolution`: grep for `future looks bright`, `exciting times ahead`, `step in the right direction`, `significant step forward`, `bright future`, `path forward`, `journey continues` | "S-NR18.4 WARN: Screen {N} (recap/synthesis) ends with generic positive framing '{match}'. Replace with a concrete outcome — a specific number, a dated event, or the named stakeholder affected. Documentary voice lands on facts, not inspiration." |

**Pass criterion:** zero Family 1/2/4 violations on a SHIP-READY course. Family 3 (false ranges) may have ≤1 flagged instance IF an Agent-6 human reviewer confirms the range is valid (e.g., an actual numeric range). Document justification in audit report.

**Fix tier:** Tier 2 (user approval) — all families require content-level rewriting. No auto-fix; surface in audit report for human triage.

**Why this exists:** v10.16.0 and earlier had no narrative-voice scanner for these 4 families. Prior courses slipped past audit with phrases like "represents a pivotal moment in the evolving landscape" or "experts argue this will reshape the industry" — technically legal under banned-phrases but tonally AI-generated. The humanizer skill's audit of 24 patterns identified these 4 as the highest-priority narrative-voice gaps.

**Reference:** Wikipedia "Signs of AI writing" patterns 1, 5, 12, 24 (via `/humanizer` skill). Consolidated here because all 4 need Agent-6 storytelling context (the storytelling auditor already reads full course + spec, so these checks piggyback on existing context load).
