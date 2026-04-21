# Decision Tables — 12 Creative & Structural Decisions

## Table of Contents
- [Decision 1: Narration Voice](#decision-1-narration-voice)
- [Decision 2: Two-Layer Naming](#decision-2-two-layer-naming)
- [Decision 3: Framework Type](#decision-3-framework-type)
- [Decision 4: Artifact Type (Screen 5)](#decision-4-artifact-type-screen-5)
- [Decision 5: Artifact Intro Approach](#decision-5-artifact-intro-approach)
- [Decision 6: Screen 4 Contrast Approach](#decision-6-screen-4-contrast-approach)
- [Decision 7: Screen 7 Twist-Delivery Mechanism](#decision-7-screen-7-twist-delivery-mechanism)
- [Decision 8: Screen 9 Framing Approach](#decision-8-screen-9-framing-approach)
- [Decision 9: Screen 12 Expert-Tip Format](#decision-9-screen-12-expert-tip-format)
- [Decision 10: Screen 14 Synthesis Framing](#decision-10-screen-14-synthesis-framing)
- [Decision 12: Scene-Entry Distribution](#decision-12-scene-entry-distribution)
- [Decision 15: Game Concept](#decision-15-game-concept)
- [Decision 16: Tool Concept](#decision-16-tool-concept)
- [Story Arc Summary Construction](#story-arc-summary-construction)
- [Decision Logic Cheatsheet](#decision-logic-cheatsheet)
- [Batch Variety Rules Summary](#batch-variety-rules-summary)

Reference for Phase 3: Spec Generation. Each decision uses research findings (Phase 1), variety constraints (Phase 2), and voice affinity rules.

> **Visual direction** is determined after course content is written, during `/atom-creator:visuals`. See `shared/visual-philosophy.md`.

---

## Pre-Decision: Genre Selection (Concept Sprint only)

> **Genre is the FIRST creative decision.** It is a USER GATE (HARD) — no creative decisions proceed until the user confirms genre. See `generation-guide/genre-system.md` for full genre definitions, prose mechanisms, screen function specifications, and selection logic.

Before making ANY creative decisions, establish the course's storytelling genre:

1. **Genre Signal Extraction (automated):** After research completes, score each genre 0-3 using the signal tests in `genre-system.md`. Present top 2-3 recommendations with research evidence.
2. **Genre Gate (Panel 0 — USER GATE HARD):** User selects from recommended genres. No creative decisions proceed until confirmed.
3. **Braided Technique (optional):** If research surfaced a strong lateral connection, offer the Braided Technique modifier on top of the selected genre.
4. **Provocation Level:** Professional (default), Contemporary, or Provocative. Orthogonal to genre.

**How genre cascades into decisions below:**
- **Voice (Decision 1):** Genre provides ranked affinity (Primary/Secondary/Avoid). Present Primary as "(Recommended)" with rationale.
- **Title (Decision 2):** Genre influences archetype selection. Literary Journalism → Historical Paradox. Investigative → Stakes Frame. Etc.
- **Decisions 6-10:** Genre-specific guidance. Each genre defines how Contrast, Twist, Human Problem, Expert Tip, and Synthesis function within its narrative structure. See Genre × Screen Function Specifications in `genre-system.md`.
- **Scene-Entry (Decision 12):** Genre provides the Screen 1 opening template, which OVERRIDES the generic scene-entry taxonomy for Screen 1 specifically.

**Batch variety:** Add Genre to the variety tracking dimensions. Max 3 courses of the same genre in any batch of 8. No two CONSECUTIVE courses may share a genre.

### Provocation Level

| Level | Source of analogies/stories | Examples | Best for | Risk |
|-------|---------------------------|----------|----------|------|
| **Professional** (default) | Business case studies from the skill's own domain | Jio, Tata, McKinsey, HUL, Amul, Infosys | Corporate L&D audiences; learner expects business content | Low |
| **Contemporary** | Trending companies, startup culture, tech/AI, pop culture | Zepto, OpenAI, Shark Tank India, IPL franchise management, Instagram growth hacks | MBA students, early-career professionals; feels current | Low-Medium |
| **Provocative** | Geopolitics, military strategy, survival, non-business domains with shock value | Iran's governance surviving US strikes (org resilience), Drug cartel supply chains (logistics), Game of Thrones politics (stakeholder management), Antarctic expeditions (crisis leadership) | Maximum engagement and shareability; the "wait, this is about WHAT?!" factor | Medium — requires careful execution |

---

## Decision 1: Narration Voice

Choose the voice most underrepresented in the recent batch. Use voice affinity as tiebreaker:

| Voice | Name | Best when... |
|-------|------|-------------|
| A | The Diagnostician | Skill involves diagnosing broken systems, root-cause analysis |
| B | The Contrarian | Research found strong counterintuitive data, assumption inversion |
| C | The Narrator | Skill has a natural crisis/system/resolution story arc |
| D | The Analyst | Skill involves quantitative comparison, metric decomposition |

## Decision 2: Two-Layer Naming

**Layer 1 — Course Title** (public-facing, 5-7 words):

| # | Archetype | SUCCESS Principle | Formula | Examples | When to use | When NOT to use |
|---|-----------|-------------------|---------|----------|-------------|-----------------|
| 1 | The Question Hook | Unexpected + Concrete | "Why [counterintuitive observation]?" | "Why Your Snack's Always In Stock" | Strong counterintuitive finding the learner has experienced | Answer is obvious or clickbait-y; 2+ recent courses used this |
| 2 | The Imperative | Simple + Emotional | "[Action verb] [mistake they're making]" | "Stop Building What Nobody Asked" | Skill corrects a widespread bad habit | Mistake isn't obvious enough for self-recognition |
| 3 | The Paradox | Unexpected + Credible | "[Positive] of [negative-sounding action]" | "The Profit in Going Cheaper", "Sell Less, Earn More Per Store" | Non-obvious tradeoff or inversion | Paradox feels forced or too clever |
| 4 | The Stakes Frame | Emotional + Stories | "What Happens When [system] [fails]" / "Before Your [asset] [crisis]" | "What Happens When Markets Panic", "When Your Client Says 'That's Not What I Asked'" | Skill prevents high-stakes failure | Failure scenario too niche or too dramatic |
| 5 | The Reveal | Unexpected + Stories | "The [hidden thing] Behind [familiar thing]" | "The System Behind Every Full Shelf", "What Brand Managers Actually Protect" | Skill exposes a hidden system/mechanism | "Reveal" is already common knowledge |
| 6 | The Familiar Villain | Emotional + Unexpected | "Your [trusted thing] Is [doing harm]" | "Your Best Store Is Costing You", "Your Longest Prompt Is Your Worst" | Default behavior/trusted process is causing harm | Villain requires too much domain context |
| 7 | The Historical Paradox | Unexpected + Stories | "[Subject] Who [Paradoxical Outcome]" | "The Economists Who Lost to the Economy", "The Fund That Outsmarted Everyone" | Strong historical case where outcome contradicts actors' predictions | Story has no paradoxical resolution |

- Must pass: (1) 5-7 words, (2) Veritasium Test ("Would this work as a video title?"), (3) Learner's-Parent Test (non-domain parent understands the hook)

**Variety enforcement rule:** Generate 3-4 Layer 1 options spanning at least 3 different archetypes. Check which archetypes the last 4 courses used; use archetype variety as tiebreaker. Label each option with its archetype name. Never present 3+ options from the same archetype. There are 7 different archetypes — use the full range.

**Layer 2 — Technical Skill** (internal metadata):
- **Maximum 2 words** (e.g., "Beat Planning", "Succession Planning", "Brand Extension", "Governance Design", "Risk Assessment", "Continuity Planning")
- **Recognizable vocabulary** — use terms a professor would put on a syllabus or a hiring manager would write in a JD. NOT invented compound nouns. Test: "Would this appear as a module name in an MBA course or a bullet point in a job description?" If no, find the established term.
- Must complete "The skill of ___ so that ___"
- Discrete (no composites), transferable, interview-testable

Generate 3-4 Layer 1 options from different archetypes (see taxonomy above). Layer 2 follows from the approved skill in Phase 1.

## Decision 3: Framework Type

| # | Type | What it is | When to use |
|---|------|-----------|-------------|
| 1 | Custom Acronym | Original mnemonic (4-6 stages) | When no established framework fits; cap at 50% of batch |
| 2 | Established Academic | Real research framework, cited | When a credible model exists (Porter's, BCG, etc.) |
| 3 | Industry Practitioner | Known methodology | When practitioners already use it (MEDDIC, RICE, OKRs) |
| 4 | Decision Matrix | Two-axis, 4 quadrants | When skill involves classifying scenarios by two dimensions |
| 5 | Threshold/Gate | Sequential gates, failure changes path | When skill involves sequential validation steps |
| 6 | Comparative | Side-by-side of 2-3 approaches | When skill involves choosing between competing approaches |

**Voice affinity:** A → Type 5/2, B → Type 4/6, C → Type 1/3, D → Type 4/2

**Rule:** Research-first — prefer established (Types 2/3) over inventing (Type 1) when a credible framework exists.

## Decision 4: Artifact Type (Screen 5)

| # | Artifact Type | JSON Block Type | Best when... |
|---|--------------|----------------|-------------|
| 1 | Performance Dashboard | `scorecard` | Skill involves operational metrics, KPIs |
| 2 | Comparison Matrix | `comparison` | Skill involves comparing approaches/entities across dimensions |
| 3 | Decision Checklist | `checklist` | Skill involves go/no-go criteria, decision gates |
| 4 | Process Timeline | `timeline` | Skill has sequential steps, process flow |
| 5 | Scorecard | `scorecard` | Skill involves evaluation, assessment, grading |
| 6 | Audit Trail | `timeline` | Failure is a chain of missed signals over time |

**Rule:** No two consecutive courses in a batch use the same type.

### Decision 4b: Artifact Rendering Format (HARD GATE)

**When this fires:** After Decision 4, whenever the selected artifact type involves tabular data OR the artifact concept naturally maps to rows and columns. Fires for Types 1-6 if the artifact content could be presented as a table vs. narrative.

**The system recommends** the best rendering format based on the data's shape and the course story:

| Format | JSON Block | Recommend when... |
|--------|-----------|-------------------|
| **Narrative** | `text` blocks only | Data tells a story through contrast/progression/cause-and-effect. Raw data has 4+ columns or 7+ rows. |
| **2×2 Matrix** | `table` (2 cols, 2-3 rows) | Two dimensions, two states — classic quadrant/trade-off |
| **2-Column Table** | `table` (2 cols, 3-6 rows) | Before/after, old/new, wrong/right — insight is in the contrast |
| **3-Column Table** | `table` (3 cols, 3-6 rows) | Entity + dimension + outcome — learner must scan all three for the pattern |

**Recommendation logic:**
```
IF cols ≤ 2 AND rows ≤ 6 → RECOMMEND: 2-col table or 2×2 matrix
IF cols = 3 AND rows ≤ 6 → RECOMMEND: 3-col table
IF cols ≤ 3 AND rows > 6 → RECOMMEND: narrative (too many rows for mobile)
IF cols ≥ 4 → RECOMMEND: narrative (reshape to 2-3 key dimensions as prose)
```

**Override:** If data is inherently scannable (decision matrix, score audit) AND can be reshaped to ≤3 cols × ≤6 rows, recommend compact table. If data tells a sequential story (case studies, progressions), recommend narrative even if it fits in 3 cols.

**HARD CAP: 3 columns maximum.** No `"type": "table"` block may exceed 3 headers. If user requests >3 columns: "Tables are hard-capped at 3 columns for mobile readability. Restructure to 3 columns by focusing on the most insightful dimensions, or switch to Narrative."

**Present to user as:** "Based on the artifact data ([N] dimensions × [M] entries), I recommend: **[format]**. Rationale: [why]. Do you accept this recommendation?"

**Spec recording:** `Artifact Rendering: Narrative` or `Artifact Rendering: Table (NxM)` with format description (e.g., "Table (3-col, 4 rows) — Scenario + Equity Action + Hedge Action").

## Decision 5: Artifact Intro Approach

| # | Pattern |
|---|---------|
| 1 | "This is what a [role] reviews every [time period]. Focus on [one pattern]." |
| 2 | "Below is a simplified version of the [document] you'd encounter. One row tells the whole story." |
| 3 | "If you were sitting across from your [senior role], this is the data on the screen between you." |
| 4 | "Real [artifacts] are messier than this. But the pattern is the same. Find it." |
| 5 | "You're two weeks in. This lands in your inbox. What do you notice first?" |

Vary from the most recently used.

## Decision 6: Screen 4 Contrast Approach

**Conditional:** This decision applies only when the course includes a Contrast screen. For flexible-length courses that omit this screen type, skip this decision.

| # | Approach | Transition device | Best when... |
|---|----------|------------------|-------------|
| 1 | Stacked Narrative | Blank line; two bold-headed sections | Two distinct companies to compare |
| 2 | Interleaved Dimensions | Alternating paragraphs by dimension | Pattern repeated across multiple dimensions |
| 3 | Before/After at One Entity | Single company, two time periods | Same entity, structural change over time |
| 4 | The Outsider's Observation | Surface similarity → structural difference | Two things that look identical but aren't |

## Decision 7: Screen 7 Twist-Delivery Mechanism

**Conditional:** This decision applies only when the course includes a Twist screen. For flexible-length courses that omit this screen type, skip this decision.

| # | Mechanism | Best when... |
|---|-----------|-------------|
| 1 | The Data Reversal | Research found an accepted number that's wrong |
| 2 | The Historical Parallel | Different industry/era solved this first, contradicts current practice |
| 3 | The Edge Case That Became the Norm | What everyone treats as exception is actually the majority |
| 4 | The Measurement Artifact | The "truth" everyone cites is an artifact of how the metric is calculated |

**Voice affinity:** A → Historical parallel/cross-industry, B → Scale inversion/counterintuitive data, C → Unexpected systemic perspective, D → Second-order effects/quantitative surprise

## Decision 8: Screen 9 Framing Approach

**Conditional:** This decision applies only when the course includes a Human Problem screen. For flexible-length courses that omit this screen type, skip this decision.

| # | Approach | Best when... |
|---|----------|-------------|
| 1 | The System Pressure | Avoidance behavior, structural barriers |
| 2 | The Practitioner's Dilemma | Organizational politics, competing priorities |
| 3 | The Blind Spot | Cognitive bias, systematic misjudgment |
| 4 | The Second-Order Effect | Decision points with tempting shortcuts |

## Decision 9: Screen 12 Expert-Tip Format

**Conditional:** This decision applies only when the course includes an Expert Move screen. For flexible-length courses that omit this screen type, skip this decision.

| # | Format | Opening pattern |
|---|--------|----------------|
| 1 | The Protocol | "Before every [X], run this 3-step check: ..." |
| 2 | The Heuristic | "If [condition], always [action]. If not, [alternative]." |
| 3 | The Counter-Signal | "The best [roles] deliberately [counterintuitive action] because..." |
| 4 | The Timing Rule | "[Action] on [timing] produces 3x the effect of [action] on [other timing]." |
| 5 | The Measurement Trick | "Track [surprising metric]. When it crosses [threshold], it predicts [outcome]." |

## Decision 10: Screen 14 Synthesis Framing

**Conditional:** This decision applies only when the course includes a Synthesis screen. For flexible-length courses that omit this screen type, skip this decision.

| # | Framing | Structure |
|---|---------|-----------|
| 1 | Numbered Insights | Numbered paragraphs (2-4) with bold insight statements |
| 2 | What Shifted | Changed assumptions: what learner believed before vs. after |
| 3 | The Key Moves | Actions (2-4), not knowledge — what learner will DO differently |
| 4 | Woven Narrative | Insights woven into payoff narrative, no synthesis block |
| 5 | Single Distillation | "If you remember nothing else:" — single core insight paragraph |

## Decision 12: Scene-Entry Distribution

Assign approaches from the 11-approach taxonomy to the 6 story/bridge screens (1, 2, 4, 7, 9, 12):

**Sensory Family:**
1. Visual-first — "The dashboard is showing a color you've never seen..."
2. Time-anchored — "It's 6:47 AM on a Tuesday..."
3. Place-anchored — "The conference room smells like cold coffee..."

**Data Family:**
4. Number-first — "Thirty-seven percent. That's the number your manager circled..."
5. Comparison-first — "Last quarter it was 12. This quarter it's 4..."
6. Metric anomaly — "Everything on the report looks normal except one line..."
7. Trend break — "For eleven months the line went up. Month twelve, it didn't..."

**Action Family:**
8. Mid-action — "You're halfway through the presentation when the CFO interrupts..."
9. Aftermath — "The meeting ended twenty minutes ago. You're still sitting there..."
10. Observation — "You notice something the others missed..."

**Conceptual Family:**
11. Principle-first — "Every [domain concept] sits somewhere on a spectrum. At one end, [extreme A]..." Opens with a general principle, narrows to a specific case, drops the cliffhanger. Best for conceptual/academic skills where the principle scaffolding helps the case land.

**Style Modifier — Novella Opener (applicable to Sensory entries #1-3):**
Transforms any Sensory entry into a full literary paragraph opening. Requirements:
- Specific date or season ("In the summer of 1997...", "On a cold morning in February 1994...")
- Full name with ONE contextual detail that earns the reader's attention — explains WHY this person matters, not just WHO they are ("John Meriwether — a bond trader whose employer paid him $60M in a single year")
- Physical setting that establishes world ("Greenwich, Connecticut office")
- Closing sentence with ironic foreshadowing ("Fourteen months later, the Federal Reserve would convene an emergency meeting...")
- **Global accessibility rule:** Every institution or person introduced must have a contextual clause. "The legendary Salomon Brothers trader" FAILS (assumes Western financial knowledge). "A bond trader whose employer paid him $60M" PASSES.
Default for Literary Journalism and Corporate Biography genres.

**Rules:**
- No two screens in the same course use the same family consecutively
- No two consecutive courses open Screen 1 with the same approach
- Distribute across all four families

For the spec: specify the **Screen 1 approach** explicitly and the **family distribution plan** (e.g., "Sensory x 2, Data x 2, Action x 2"). Specific per-screen assignments are made during generation.

## Decision 15: Game Concept

Pick a **mechanic family** from the 10-family catalog below. Match the family to the skill's cognitive mode.

| # | Family | Core verb | Best for concepts that require... | Input | Reference game |
|---|---|---|---|---|---|
| 1 | Allocation | Pick under scarcity | Prioritization, resource distribution | Tap | Beat Blitz |
| 2 | Matrix Placement | Drag into 2×2 grid | Classification along two axes | Drag | Brand Architect |
| 3 | Multi-Round Strategy | Decide with state carry-over | Path-dependent compounding decisions | Tap | The Rotation Game |
| 4 | Progressive Reveal | Predict → see → update | Intuition vs evidence calibration | Tap | Prompt Gates |
| 5 | Signal Detection | Sort signal from noise | Pattern recognition, attention hygiene | Tap/Swipe | Signal Sort |
| 6 | Dialogue Tree | Multi-turn buyer/stakeholder conversation with branching replies | Stakeholder discovery, persuasion, sales, crisis comms | Tap | **Forward Deployed** (enterprise-growth-lead-techno-commercial-selling — WhatsApp mockup, 5 rounds × 2-4 turns each, cross-round state compounding, R5 transfer test) |
| 7 | Portfolio Builder | Compound selections into a set | Judgment that compounds over picks | Tap | Operative Portfolio |
| 8 | Slider Balance | Adjust competing dials | Trade-off optimization under constraint | Drag | (to be built) |
| 9 | **Contradiction Hunt** | Spot mismatches in output | Verification before trust (audit skill) | Tap | **AUDIT (decomposer)** |
| 10 | **Rapid Classify Swipe** | Bucket tasks fast | Codifiability sensing, reflex judgment | Swipe | **CODIFY (routine)** |

Specify: **mechanic family**, number of rounds (typically 3-5; swipe decks run 10-15), what changes per round (learning arc), and embed position (`position_after_screen` field — typically after Screen 8 or 10).

**Scoring fairness rules (mandatory for all games):**
- Reasonable-but-suboptimal options get partial credit (1pt), not 0pt
- At least one round should include an "over-application" trap (e.g., over-decomposition, over-diversification)
- Option labels must be neutral — no label should signal "lazy" or "obviously wrong"
- Hints describe mechanics, not strategy; never give away the answer
- Non-monotonic difficulty: not every round rewards the same strategy direction

**Performance tailoring signal (for Reflect phase):** Every game must declare ONE performance signal that drives the tailored line in the Reflect phase. Typical signals: `misses`, `invCatches`/`catches`, `streak`, `timeElapsed`, `correctCount`. This drives a 3-bucket copy branch (high / mid / low) on the reveal beat.

**Scoring substrate declaration:** In design.md, declare one:
- `Scoring substrate: evergreen logic` — pure logic (contradictions, math, sequence). No recalibration needed.
- `Scoring substrate: AI-capability classification` — depends on claims about what AI can do. Requires annual re-audit against Check 23.

**Visual identity:** Game inherits accent color, background, and style concept from the visual direction + the chosen **aesthetic family** (see Decision 15a). The game palette should feel like the same world as the course images.

## Decision 15a: Aesthetic Family

Every game picks one of FIVE documented aesthetic families OR declares `NOVEL: {native-UI-context}` when the mechanic maps to a real-world software UI (v10.15.0 native-UI-first rule).

**Native-UI-First Rule (v10.15.0, HARD PRIORITY):** Before picking a documented family, verify the mechanic has no real-world software UI analog. If it does (Dialogue Tree → WhatsApp/Slack/email thread; Classification → filing cabinet/library card catalog; Allocation → bank transfer/portfolio rebalancer; Progressive Reveal → notebook pages/CCTV scrubber; Strategy → chess/battle-map), the NATIVE-UI MOCKUP is the preferred choice — declare as `NOVEL: {context-name}`. Documented families are the FALLBACK when the mechanic is abstract enough that no native UI fits. This rule exists because "differentiate within the documented-family neighborhood via 5 palette dimensions" produced games that read as reskins of each other; native-UI-frame differentiation is structural, not cosmetic.

| Family | Palette signature | Display font | Body font | Shadow style | Use for |
|---|---|---|---|---|---|
| **Arcade Pop** | Cream bg (#FFF4D6) + hot-pink accent (#FF3A7C) + mint (#1ABC9C) + thick black borders | Bungee (chunky caps) | Archivo 600-800 | Hard 4px/4px offset solid | First-time learners, consumer topics, novice-friendly, light tone. Reference: AUDIT (knowledge-worker-prompt-decomposition). |
| **Sci-Fi Matrix** | Dark bg (#0A0E1A) + matrix green (#00FF9D) + hot coral (#FF3366) + grid overlay | Orbitron 900 (sci-fi caps) | IBM Plex Mono/Sans | Glow box-shadow (neon halos) | Senior/technical audiences, AI/data/automation topics, reflex mechanics. Reference: CODIFY (senior-leader-task-anatomy). |
| **Editorial Mono** | Near-white bg + single rust accent (#B54A2E) + black borders | Source Serif 4 (editorial serif) | Archivo | Subtle 1-2px shadow, muted | Strategic/advisory contexts, senior judgment topics, premium/deliberate feel. Reference: THE GEM (manager-organizational-resilience-design). |
| **Keynote Vitrine** (v10.14.0, DEPRECATED as default — retained for documentation) | Stage black (#0A0A0C) + indigo rim-light (#4e44fd) + radial spotlight vignette | Manrope 800 | JetBrains Mono for HUD | 1px hairline + inner glow, soft indigo drop-shadow | Boardroom-stage decisions, enterprise sales keynote feel. **No current reference game** (was planned for Forward Deployed but pivoted to WhatsApp Mockup after user feedback that stage-black + bold-display feels too adjacent to Editorial Mono). Prefer WhatsApp Mockup for Dialogue Tree mechanics. |
| **WhatsApp Mockup** (v10.15.0) | Cream chat bg (#ECE5DD) + green bubble (#DCF8C6) + WhatsApp green accent (#25D366) + delivery blue (#34B7F1) + doodle wallpaper | System-ui stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Helvetica Neue`, `Arial`) — NO custom display font | Same system-ui stack, 13-15px | 1px #E5E5E5 borders on bubbles, subtle `0 1px 0.5px rgba(0,0,0,0.08)` drop | Dialogue Tree mechanics with Indian B2B buyer personas (CFO/Procurement/VP). Loss = fading presence (`last seen X mins ago`), never coral/red. Reference: **Forward Deployed** (enterprise-growth-lead-techno-commercial-selling). |

### Auto-suggestion heuristic

**Run Native-UI-First test first:**

| Mechanic family (from Decision 15) | Native-UI candidate | Preferred aesthetic |
|---|---|---|
| Dialogue Tree (multi-turn) | WhatsApp thread, Slack DM, email inbox | **WhatsApp Mockup** (default) or `NOVEL: Slack/email` |
| Classification / sorting (drag-to-category) | Filing cabinet, library card catalog, Notion database rows | `NOVEL: filing cabinet` (prefer over Arcade Pop for classification mechanics) |
| Allocation (slider/budget) | Bank transfer UI, portfolio rebalancer, 401(k) slider page | `NOVEL: bank-transfer UI` or Arcade Pop (fallback) |
| Progressive Reveal | Notebook pages, CCTV feed scrubber, x-ray viewer | `NOVEL: notebook` or Sci-Fi Matrix (technical contexts) |
| Any other Decision 15 mechanic with no obvious native-UI analog | — | Use course-signal heuristic below |

**If no Native-UI candidate fits, fall back to course-signal heuristic:**

| Course signal | Suggested family | Why |
|---|---|---|
| Role contains "Senior Leader", "CTO", "Data", "AI", "Engineer"; or skill mentions codification/classification/automation/machine-learning | **Sci-Fi Matrix** | Matches audience's technical self-image; reflex mechanics feel native |
| Genre = Behavioral Science or Practitioner Memoir; role contains "Associate", "Novice", "Student", or "Junior"; or consumer/everyday topic | **Arcade Pop** | Warm, accessible, lowest cognitive tax; novice-first |
| Genre = Corporate Biography, Industry Epic, or Legal/Regulatory Thriller; role contains "Strategist", "Advisor", "Partner", or "Director" | **Editorial Mono** | Premium deliberate feel matches strategic judgment contexts |
| Anything else | **Arcade Pop** (default) | Safest broad-audience choice |

**Batch diversity check:** Same aesthetic family should not appear in 3 consecutive courses within a batch. If auto-suggestion would cause a 3-in-a-row, flag and prefer the next-best fit (including NOVEL native-UI if applicable).

User override logged to `courses/batch-diversity-log.md` under the "Style Identity" column in Table 3 (Visual & Game Assets).

#### Multi-Game Expansion (Blueprint Mode)

When the blueprint specifies 2-3 games, each game must have:

| Requirement | Rule |
|-------------|------|
| Distinct mechanics | No two games in the same course use the same primary mechanic type |
| Escalating complexity | Game 1 tests recognition, Game 2 tests application, Game 3 tests synthesis |
| Separate design docs | Each game produces its own `design-{N}.md` and `{slug}-game-{N}.html` |
| Independent quality gate | Each game runs the 5-point experiential quality test independently |
| Position justification | Each game position must be narratively justified in the blueprint |

**File naming for multi-game:**
- Single game (default): `{slug}-game.html`
- Multi-game: `{slug}-game-1.html`, `{slug}-game-2.html`, `{slug}-game-3.html`
- Design docs: `design.md` (single) or `design-1.md`, `design-2.md`, `design-3.md` (multi)

**Mechanic escalation examples:**
| Game # | Mechanic Level | Example Mechanic |
|--------|---------------|------------------|
| Game 1 | Recognition | Classification/sorting — identify which category |
| Game 2 | Application | Allocation/slider — distribute resources using the framework |
| Game 3 | Synthesis | Scenario branching — navigate trade-offs using full framework |

---

## Decision 16: Tool Concept

Propose a tool subtype based on the skill and framework type. Read `shared/tool-design-system.md` for the full subtype spec and design principles.

| Subtype | Best when... |
|---------|-------------|
| Self-Audit | Course teaches a diagnostic framework with ratable dimensions (Type 2, 6, or 7 frameworks) |
| Calculator | Course teaches quantitative tradeoffs or threshold-based decisions (Type 5 or 6 frameworks). Best for quantitative skills with numerical inputs/outputs — e.g., unit economics, pricing models, ROI calculations. |
| Matcher/Picker | Course teaches a decision framework where the right answer depends on context (Type 4 frameworks) |
| Builder | Course teaches a methodology that produces a concrete work product (Type 1 or 3 frameworks). Best for skills where the learner constructs something step-by-step — e.g., strategic plans, org structures, project roadmaps. |
| Analyzer | Course teaches quality criteria the user can apply to their own existing work (Type 5 frameworks) |

**Auto-select from framework type (Decision 3):**

| Framework Type | Natural Subtype |
|---------------|-----------------|
| Type 1 (Custom Acronym) | Builder |
| Type 2 (Established Academic) | Self-Audit |
| Type 3 (Step-by-Step) | Builder |
| Type 4 (Decision Matrix) | Matcher/Picker |
| Type 5 (Threshold/Gate) | Analyzer |
| Type 6 (Comparative) | Self-Audit |
| Type 7 (Cycle) | Self-Audit |

**Diversity cap:** Max 4 uses per subtype across all courses (check `batch-diversity-log.md` Table 3).

**Specify:** subtype, 4-6 course vocabulary terms used as UI labels, what the user inputs, what output they receive, estimated time (2-5 min), shareability format (copy-to-clipboard string), and a 2-3 sentence sketch of the tool.

**Key distinctions from Game:**
- Tool = serves the learner's real situation (applies course concepts to their context)
- Game = challenges the learner with scenarios (tests/reinforces course concepts through play)
- A course can have BOTH — game comes first, tool after
- Tool is vanilla JS, scrollable, 680px max-width (NOT the 430px game viewport)

---

## Story Arc Summary Construction

After all 12 decisions, construct the story arc. This is the most important section — it shows how decisions combine into a specific, recognizable course.

**Story arc in three acts (matching the course phases):**

**Act 1 — Foundation (Screens 1-5):**
How the hook is set, which company story opens it, what the contrast reveals about the skill gap, and what artifact grounds the learner in the role's reality.
→ 3-5 specific sentences. Name the companies, the metric, the contrast.

**Act 2 — Build (Screens 6-9):**
How the framework enters the narrative, what the plot twist inverts (with the specific counterintuitive finding), and what human dilemma makes it personal.
→ 3-5 specific sentences. Name the framework, the twist data point, the dilemma.

**Act 3 — Resolution (Screens 10-15):**
What judgment calls the behavioral screens test, what the expert move reveals, how synthesis closes the loop back to Screen 1's opening tension.
→ 3-5 specific sentences. Reference the opening hook and show closure.

**Quality check:** A person reading the story arc should be able to mentally picture the course from start to finish. If any act sounds generic ("the framework provides structure"), make it specific ("the PROVE framework's five-stage process maps directly to the quarterly beat planning cycle").

---

## Decision Logic Cheatsheet

Quick reference for how each decision is made during Phase 3.

| Decision | Primary signal | Tiebreaker | Variety rule |
|----------|---------------|------------|-------------|
| Genre | Genre signal extraction scores from research (see `genre-system.md`) | Tiebreaker: Literary Journalism > Investigative > Corporate Biography > Legal > Industry Epic > Geopolitical > Practitioner Memoir > Behavioral Science | Max 3 same genre per 8 courses; no consecutive same genre |
| Provocation Level | Audience type + lateral analogy strength | — | Vary across batch |
| Voice | Least used in batch | Voice affinity to skill type | Rotate A→B→C→D |
| Framework type | Research-first (prefer established) | Voice affinity | Max 50% Type 1 in batch |
| Artifact type | Skill fit | — | No consecutive same type |
| Contrast (Scr 4) | Research data shape | — | Vary across batch |
| Twist (Scr 7) | Counterintuitive finding type | Voice affinity | Vary across batch |
| Framing (Scr 9) | Behavioral dimension of skill | — | Vary across batch |
| Expert tip (Scr 12) | Expert practice type | — | Vary across batch |
| Synthesis (Scr 14) | Voice style preference | — | Vary across batch |
| Scene-entry (Scr 1) | — | — | No same opener in consecutive courses |
| Game mechanic | Skill + framework type | — | — |
| Tool subtype | Framework type (auto-map) | Course vocabulary fit | Max 4 uses per subtype |

---

## Batch Variety Rules Summary

These rules prevent courses from feeling identical when generated in sequence:

1. **Genre variety:** Max 3 courses of the same genre in any batch of 8. No two CONSECUTIVE courses may share a genre.
2. **Provocation variety:** No two consecutive courses at the same provocation level.
3. **Voice rotation:** A → B → C → D → A... across batches of 5 courses
4. **Framework type cap:** Max 50% Custom Acronym (Type 1) in any batch of 4+
5. **Artifact type:** No two consecutive courses use the same type
6. **Screen 1 scene-entry:** No two consecutive courses use the same approach
7. **Scene-entry families:** No family used on consecutive screens within one course
8. **All other taxonomies:** Track usage counts, prefer underrepresented options
9. **Blueprint mode:** Track Default vs Multi-artifact in batch — no explicit variety cap (multi-artifact is opt-in)
10. **Game count:** Multi-artifact courses with 2-3 games: distinct mechanics required per course
11. **Tool subtype:** Max 4 uses per subtype across batch (tracked in Table 3 of batch-diversity-log.md)

---

## Humanization Constraints (v10.9.0)

Derived from the 2026-04-14 humanization audit of 20 CMS-edited courses. 16/20 courses were shrunk, net −69 screens (~20% cut). These constraints move the cut-rate to the `:plan` stage rather than the `:audit` stage.

### Screen Count (C69 HARD GATE)

**Concept Sprint:** 12–14 screens total (including cover and interview). **Sweet spot: 13.**

- **Rationale:** Hand-edited courses clustered at 13 (mean 13.2, median 13). Pipeline-generated courses averaged 16.8. The 4-screen difference is pure filler.
- **Enforcement:** `:plan` QG2 must reject any spec with a declared screen count > 14. `:audit` C69 HARD-fails courses exceeding 14 screens after generation.
- **Candidate cuts** when a spec proposes >14: filler-title screens (S-NR15), multiple `apply` screens (C68), recap/comparison screens that restate prior material.

**Hands-On:** unchanged, 8–18 per Appendix B.

### MCQ Placement (C68 HARD GATE)

**Concept Sprint:** Exactly **1 `apply` screen**, placed at position `N−1` (immediately before the interview screen). `first_apply` and `harder_apply` screen types are **banned outright**.

- **Rationale:** 18/20 CMS-edited courses collapsed 3–4 sprinkled MCQs into a single pre-interview apply. This accounts for ~30% of total screen cuts in the humanization pass.
- **Glossary `practice` objects are separate** and are not counted as `apply` screens. The `apply` screen is a standalone test-your-instinct screen with a named MCQ and no glossary block.

### Interview Motivational Block (C71 HARD GATE)

Banned triplet pattern: "You've absorbed / You understand / Now record your perspective" (and close variants). See `shared/spec-template.md` §Last Screen — Interview for the three approved alternatives: single imperative, story callback, or single question.

### Glossary Vocabulary (C70 HARD GATE)

Every glossary term must be a verifiable industry-canonical term (HBR, textbook, trade press, industry body). Agent 5 web-searches each term on first run. Zero invented/AI-coined terms. Budget: 3–5 terms per course. See `shared/structural-checks.md` §C70 and `shared/content-audit.md` §Agent 5 step 1e for full enforcement.

### Storytelling Craft (S-NR14 through S-NR17)

Agent 6 runs four new checks — antithesis flourish detector, filler-screen title blacklist, protagonist-epilogue resolution, and no course-preview chatter. See `shared/storytelling-audit.md` for full definitions.
