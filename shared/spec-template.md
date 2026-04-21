# Course Spec Document Template

## Table of Contents
- [The Two Names](#the-two-names)
- [Creative Decisions](#creative-decisions)
- [Structural Decisions](#structural-decisions)
- [Visual Direction](#visual-direction)
- [Game Concept](#game-concept)
- [Story Arc Summary](#story-arc-summary)
- [Course Blueprint](#course-blueprint)
- [Batch Variety Notes](#batch-variety-notes)
- [Research Summary (Appendix)](#research-summary-appendix)

Use this template format when generating the Course Spec in Phase 4 Step 1. Fill every field from the 12 decisions made in Phase 3. Fill the Research Summary from Phase 1 findings.

---

```markdown
# Course Spec: [Layer 1 Title]

**Role:** [Role] | **Industry:** [Industry] | **Level:** [Level]
**Audience Posture:** [domain-native | novice-on-stack] — see `generation-guide/audience-posture.md`. `novice-on-stack` triggers C72 HARD GATE: every specialized noun needs in-text unpacking on first mention. Default `novice-on-stack` when Role ∈ {Founder, CXO, Senior Leader, Product Leader, Managing Director, Partner} AND course topic involves vocabulary <5 years old (GenAI, agent-web, DeFi, emerging regulatory).
**Skill (Layer 2):** [Technical skill name]
**Date:** [date] | **Batch position:** Course #[N] | **Status:** DRAFT
**Archetype:** Concept Sprint | Hands-On
**Genre:** [Genre name] | **Braided:** No/Yes | **Provocation:** Professional/Contemporary/Provocative

---

## The Two Names

**Layer 1 — Course Title:** [Emotional title, 5-7 words]
> Veritasium test: [Pass/note] | Learner's-parent test: [Pass/note]

**Layer 2 — Technical Skill:** [Skill name]
> "The skill of [___] so that [___]"

**Course Description:** [Single-line description following Opener x Stickiness taxonomy]
> Opener: [How subject / Learn how to / How to / Why subject / Imperative] | Stickiness: [Simple / Unexpected / Concrete / Credible / Emotional / Stories]

---

## Genre Direction

**Genre:** [One of: Literary Journalism, Investigative Journalism, Industry Epic, Corporate Biography, Geopolitical Analysis, Behavioral Science, Legal/Regulatory Thriller, Practitioner Memoir]
> [1-line: why this genre fits this research — which signal test scored highest?]

**Braided Technique:** [No / Yes: {lateral story world} — {diagnostic lens mapping}]
> [If Yes: 1-line explaining the vocabulary mapping + the diagnostic lens test result]

**Provocation Level:** [Professional / Contemporary / Provocative]
> [1-line: what story world or analogy wraps the concept]

**Genre Prose Mechanisms (from genre-system.md):**
1. [Core mechanism name] — [1-line description]
2. [Mechanism 2]
3. [Mechanism 3]
4. [Mechanism 4]

**Genre DO NOTs (from genre-system.md):**
- [DO NOT 1]
- [DO NOT 2]
- [DO NOT 3]

---

## Creative Decisions

### Voice
**Voice [A/B/C/D] — [Name]**
> [1-line: why this voice fits this skill and batch position]

### Screen 4 — Contrast
**[Approach name]** (#[N])
> [1-line: which entities are contrasted, why this structure fits]

### Screen 7 — Twist
**[Mechanism name]** (#[N])
> [1-line: what the counterintuitive finding is, how it's delivered]

### Screen 9 — Human Problem
**[Approach name]** (#[N])
> [1-line: what behavioral tension is surfaced]

### Screen 12 — Expert Tip
**[Format name]** (#[N])
> [1-line: what the expert move is, why this format fits]

### Screen 14 — Synthesis
**[Framing name]** (#[N])
> [1-line: what the synthesis lands on]

### Last Screen — Interview: The Real Question
> Standard interview card (heading + motivational text + standard topics). No custom question — AI delivers the question at runtime.
>
> **Motivational block — C71 HARD GATE (v10.9.0):** The motivational text block must NOT use the banned triplet pattern "You've absorbed / You understand / Now record your perspective." Observed in 20/20 pipeline outputs; cut in 20/20 humanization-audited CMS versions. Approved alternatives, choose one:
> 1. **Single imperative:** `"Prove it."` or `"Now say it out loud."`
> 2. **Story callback (preferred):** one sentence referencing a specific moment from screen N−2, e.g., `"Sarin had eight minutes. You have as long as you need."`
> 3. **Single question the learner answers aloud:** `"What would you have said to the board?"` (distinct from the AI-delivered interview question — this is a framing primer.)
>
> No multi-sentence scaffolding. No "you've X. You Y. Now Z." structure. No meta-instructions ("record your answer", "upload your CV") — those live in the standard `topics` array, not the motivational block.

### Scene-Entry Plan
**Screen 1:** [Approach name] — [Family]
**Distribution:** [Family A] x N, [Family B] x N, [Family C] x N

### Emotional Arc Notes (optional)
**Emotional Arc Notes (optional):** Annotate where tension peaks and MCQ valleys should fall. Example: "Hook peaks on screen 2, first valley for MCQ on screen 3, framework resolution on screen 5, emotional peak on screen 7, final MCQ valley on screen 8."

---

## Structural Decisions

### Screen 5 — Artifact
**[Artifact Type]** — [Brief description of what the artifact shows]
**Rendering:** [Narrative / Table (2×2 matrix) / Table (2-col, N rows) / Table (3-col, N rows)]
**Rendering rationale:** [1-line: why this format fits the data shape + story]
**Intro:** "[Artifact intro approach sentence]"
> [1-line: why this type fits the skill]

### Screen 6 — Framework
**[Framework Type name]** (#[N])
**Name:** [Framework name or "TBD — custom acronym to be created during generation"]
> [1-line: why this type fits; if established, cite source]

---

## Visual Direction

> Visual philosophy is determined after course content is written. Run `/atom-creator:visuals {slug}` after `:audit`. Brief stored in `visuals/{slug}/art-direction.md`, not in spec.

---

## Game Concept

> **Optional section.** Omit for content-only courses (no game). If omitted, `:assets` and `:game` skip game generation.
>
> **All six fields below are REQUIRED (v10.13.0).** `:game` hard-blocks on missing fields. The previous version allowed silent defaults — sessions shipped quizzes dressed as games because the aesthetic and mechanic were inferred post-hoc.

**Mechanic family:** [ONE of the 10 canonical families from `shared/decision-tables.md` Decision 15 — Allocation, Matrix Placement, Multi-Round Strategy, Progressive Reveal, Signal Detection, Dialogue Tree, Portfolio Builder, Slider Balance, Contradiction Hunt, Rapid Classify Swipe. Plus Build-and-Watch Execution and Tool Simulation as extensions. Use the canonical name verbatim — informal terms like "Classification/sorting" or "strategy game" FAIL hook Gate 5.]
**Rounds:** [N] — [what changes per round, gesture-by-gesture. E.g., "R1: drag satellite on 2D field; R2: slider from same-brand to spun-out; R3: rapid-classify 8 swipe cards". Same tap target with different copy per round ≠ "what changes".]
**Learning arc:** [1 sentence: what the player discovers]
**Embeds after:** Screen [N]
**Aesthetic family:** [ONE of `Arcade Pop`, `Sci-Fi Matrix`, `Editorial Mono` per Decision 15a. Use exact capitalization. Reference games: Arcade Pop → decomposer.html; Sci-Fi Matrix → routine.html; Editorial Mono → manager-organizational-resilience-design-game.html (THE GEM).]
**Performance tailoring signal:** [The variable that drives the Reflect-phase tailored line. E.g., `misses` (Contradiction Hunt), `catches` (Rapid Classify), `streak` (multi-round), `correctCount` (classification). Specify which 3 buckets (high/mid/low) trigger which copy.]
**Scoring substrate:** [`evergreen logic` OR `AI-capability classification`. Evergreen = pure logic (math, sequence, contradiction). AI-capability = claims about what AI can do (requires annual recalibration per Agent 4 Check 23).]
**Sketch:**
> [2-3 sentences: what the player does (named gesture — drag, slide, place, swipe), what goes wrong in Round 1, what the framework reveals by the final round. If the sketch reads as "player picks one of N options," the mechanic family is wrong — revisit.]
**Naive first move:**
> [1 sentence naming what the player instinctively reaches for, AND which round punishes it. Required by Gate 2 of the 7-gate checklist.]

---

## Tool Concept

> **Optional section.** Omit when no tool is appropriate. If omitted, `:assets` and `:tool` skip tool generation.

**Subtype:** [Self-Audit / Calculator / Matcher-Picker / Builder / Analyzer]
**Course vocabulary used:** [4-6 terms from the course that become UI labels]
**User input:** [What the user enters — e.g., "names 5 key roles, rates each across 4 dimensions"]
**Output:** [What they get — e.g., "dimension scores, vulnerability ranking, 4 prioritized actions, share card"]
**Time estimate:** [2-5 minutes]
**Shareability:** [Copy-to-clipboard format — e.g., "[Score]/5 on [Tool Name] — [interpretation]. Built from Rehearsal's [Course Title]."]
**Sketch:**
> [2-3 sentences: what the user does, what the tool reveals, how it applies course concepts to their real situation]

---

## Story Arc Summary

### Act 1 — Foundation (Screens 1-5)
[3-5 sentences]

### Act 2 — Build (Screens 6-9)
[3-5 sentences]

### Act 3 — Resolution (Screens 10-15)
[3-5 sentences]

---

## Course Blueprint

> **Optional section.** Present only in Multi-artifact mode courses. Absent = Default mode (standard single-game, single-interview structure).

**Blueprint Mode:** Multi-artifact
**Total Screens:** [N]
**Games:** [0-3] | **Retention Interviews:** [0-2] | **Applied Interviews:** [0-2] | **Current-Affairs Interview:** [0-1]

### Screen Architecture

| # | Type | Interactive Block | Justification |
|---|------|-------------------|---------------|
| 1 | orient | | |
| 2 | story_bridge | | |
| 3 | first_apply | Retention #1 | Tests orient + first bridge comprehension |
| ... | ... | ... | ... |
| N | interview | Current-Affairs | Capstone — real-world event + skill application |

### Game Placements

| Game # | Position After Screen | Mechanic | Design Doc |
|--------|----------------------|----------|------------|
| 1 | [N] | [mechanic type] | `{slug}-game-1.html` |
| 2 | [N] | [mechanic type] | `{slug}-game-2.html` |

### Interview Subtype Framings

| Subtype | Screen # | Framing | Block Type |
|---------|----------|---------|------------|
| Retention #1 | [N] | [framing choice] | mcq |
| Applied #1 | [N] | [framing choice] | text_question |
| Current-Affairs | [N] | Framing 5 (fixed) | text_question |

---

## Batch Variety Notes

| Dimension | This course | Last 4 courses | Variety |
|-----------|------------|----------------|---------|
| Genre | [X] | [used] | [OK / cap check — max 3 same genre per 8 courses, no consecutive] |
| Provocation | [X] | [used] | [OK / REPEATED — reason] |
| Voice | [X] | [used] | [OK / REPEATED — reason] |
| Framework | [X] | [used] | [OK / REPEATED — reason] |
| Artifact | [X] | [used] | [OK / REPEATED — reason] |
| Twist mechanism | [X] | [used] | [OK / REPEATED — reason] |

---

## Research Summary (Appendix)

### Skill Card
**Skill:** [name]
**Definition:** [one-line]
**Why this role needs it:** [3-4 sentences]
**Score:** Signal [N] x Differentiation [N] x Urgency [N] = [total]/125

### Company Examples
| Company | Country | Key Metric | Data Point | Source | Verification |
|---------|---------|-----------|-----------|--------|-------------|
| [name]  | [IN/INT] | [metric]  | [figure]  | [URL]  | [VERIFIED/PLAUSIBLE/HIGH risk] |
| [name]  | [IN/INT] | [metric]  | [figure]  | [URL]  | [VERIFIED/PLAUSIBLE/HIGH risk] |
| [name]  | [IN/INT] | [metric]  | [figure]  | [URL]  | [VERIFIED/PLAUSIBLE/HIGH risk] |
| [name]  | [IN/INT] | [metric]  | [figure]  | [URL]  | [VERIFIED/PLAUSIBLE/HIGH risk] |

> Verification status required for every company entry. VERIFIED = 2+ independent sources. PLAUSIBLE = 1 non-marketing source. REMOVED entries must not appear.
> Each Company Example row should cross-reference its R-numbers from the Research Registry: e.g., "R1, R2, R5" to show which specific claims support this company's narrative.

### Research Registry

> Per-claim verification registry. Each R-number is a discrete, verifiable assertion extracted from research findings. `:create` must trace every factual statement to an R-number. `:audit` Agent 5 cross-references claims against this registry. Registry is optional for backward compatibility — specs without it use the Company Examples Verification column as fallback.

| R# | Claim | Type | Source URL | Evidence (first 200 chars) | Verification | Hedging? |
|----|-------|------|-----------|---------------------------|-------------|----------|
| R1 | [claim text] | [metric/attribution/causal/biographical/temporal] | [URL] | [extracted paragraph excerpt] | [VERIFIED/PLAUSIBLE/HIGH RISK] | [No/Yes: approximate language] |
| R2 | [claim text] | [type] | [URL] | [excerpt] | [status] | [No/Yes] |
| ... | | | | | | |

> **Claim types:** metric (specific number/percentage), attribution (who did what), causal (why something happened), biographical (career title/role/tenure), temporal (when/duration/sequence).
> **Verification:** VERIFIED = source paragraph confirms claim. PLAUSIBLE = 1 non-marketing source, no contradiction. HIGH RISK = marketing only or source contradicts. 0 sources = REMOVED (do not appear).
> **Hedging:** PLAUSIBLE claims require approximate language ("roughly", "approximately", "around", "more than") — never state precise numbers from single sources without qualification. Aligns with P37 (Speculative Numbers on Story Bridges). VERIFIED claims: no hedging, precision earned by verification.

### Counterintuitive Finding
[The specific insight, the data, and the source URL]

### Domain Metrics
| Metric | Definition | Benchmark Range | Source |
|--------|-----------|----------------|--------|
| [metric] | [definition] | [range] | [URL] |
| [metric] | [definition] | [range] | [URL] |

### Failure Case
[Company, what happened, quantified impact, source]

### Expert Practice
[What top performers do differently, with evidence]

### Glossary Terms (5-7)
| # | Term | Category | Meaning (60-80 words) | Dedicated Card? |
|---|------|----------|----------------------|-----------------|
| 1 | [term] | [category] | [meaning] | Yes |
| 2 | [term] | [category] | [meaning] | Yes |
| 3 | [term] | [category] | [meaning] | Yes |
| 4 | [term] | [category] | [meaning] | Yes |
| 5 | [term] | [category] | [meaning] | Yes |
| 6 | [term] | [category] | [meaning] | Yes / JSON-only |
| 7 | [term] | [category] | [meaning] | Yes / JSON-only |

> 5 terms minimum get dedicated glossary cards. Terms 6-7 (if researched) are JSON-only reference entries — domain-standard terms that don't need a teaching screen. Selection criteria: only terms that appear **bolded** in the narrative earn a dedicated card. Domain-standard terms (e.g., "Network Effect") go to JSON-only.

### Research Curation Map (v10.8.0)

| Narrative Beat | Company | Metric/Data | Glossary Term |
|----------------|---------|-------------|---------------|
| Hook (Screen 1) | | | |
| Decode (Screen 2-3) | | | |
| Tension (Screen 4-5) | | | |
| Framework (Screen 7-8) | | | |
| Expert Move (Screen 10-11) | | | |
| Resolution (Screen 12) | | | |

#### Inclusion Budget
- **Primary companies (max 3):** [names] — these appear in narrative
- **Background companies:** [names] — researched but NOT included unless a primary company's data fails verification
- **Active glossary terms (max 5):** [terms] — these get glossary cards
- **Reserve glossary terms:** [terms] — researched but no card unless narrative earns them
- **Key metrics (max 6):** [specific numbers with sources]

> The generator must treat this map as the inclusion gate. Research NOT in this map is available as backup but should NOT appear in the generated course.

### Course Generation Brief
Write as connected narrative, not bullet points. Each beat should flow into the next.

- **Hook:** [Which company or observation opens the course? What question does it plant in the learner's mind? The hook is NOT "3 companies listed" — it's ONE arresting observation that makes the learner think "wait, how is that possible?" Other companies are supporting context, not co-leads.]

- **Decode:** [Which company's STORY do we go deep on? Write the 4-beat arc: What were they before? What pressure hit? What did they realize? What happened? This must read as a mini-story, not a metric summary.]

- **Tension:** [What makes this skill HARD? Not technically hard — emotionally hard. What does the learner's instinct tell them to do that's wrong? What does the conventional wisdom get backwards?]

- **Twist:** [What specific data point INVERTS the assumption from the Hook? This must directly contradict something the learner believed on Screen 1. State what they believed AND what's actually true.]

- **Expert Move:** [What do top performers do that looks counterintuitive or wasteful to everyone else? This must be a specific BEHAVIOR, not a principle.]

- **Payoff:** [Complete: "You now see ___ differently. Before this course, you thought ___. Now you know ___." The payoff must reference the Hook's opening question and close it.]
```

---

## Hands-On Variant

When `**Archetype:** Hands-On`, replace the Creative Decisions and Structural Decisions sections with:

### Voice
**The Instructor** (fixed — no user gate)

### Screen Plan

| # | Type | Topic | MCQs | Artifacts | Videos |
|---|------|-------|------|-----------|--------|
| 1 | intro | [Hook + why this matters] | 0 | 0 | 0 |
| 2 | ... | ... | ... | ... | ... |
| N | recap | [Summary + next steps] | 0 | 0 | 0 |

**Screen Count:** [N] screens | **Justification:** [Why this count]
**MCQ Total:** [N] | **Artifact Total:** [N] | **Video Total:** [N]

### Course Description
**[Single-line description following Opener x Stickiness taxonomy]**
> Opener: [Type] | Stickiness: [Type]

### Opening Hook
**[Style name]** — [Opening line]

### Depth Level
**[Beginner / Intermediate / Advanced]**

### Artifact Details
[For each artifact: type, block type, content description, placement]

### Video Details
[For each video: demo screen, duration estimate, what it shows]

### Visual Direction

> Visual philosophy is determined after course content is written. Run `/atom-creator:visuals {slug}` after `:audit`. Brief stored in `visuals/{slug}/art-direction.md`, not in spec.


### Game
**[Include / Replace with extra artifacts / Neither]**
[If include: mechanic type + 2-sentence sketch]

The following concept sprint sections are OMITTED for hands-on:
- Screen 4 — Contrast
- Screen 7 — Twist
- Screen 9 — Human Problem
- Screen 12 — Expert Tip
- Screen 14 — Synthesis
- Screen 15 — Interview (the `:interview` screen type, not the skill of interviewing)

---

After displaying the spec, tell the user: "Review the spec above. Next, I'll walk you through each decision group so you can confirm or override choices."
