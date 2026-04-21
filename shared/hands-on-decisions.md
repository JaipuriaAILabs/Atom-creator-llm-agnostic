# Hands-On Decision Tables — 9 Creative & Structural Decisions

Reference for Phase 3: Spec Generation when archetype is `hands_on`. These decisions replace the concept sprint's 14-decision system. Loaded instead of (not in addition to) `decision-tables.md`.

> Visual direction is determined after course content is written, during `/atom-creator:visuals`. See `shared/visual-philosophy.md`.

---

## Decision 1: Two-Layer Naming

Same rules as concept sprint — see `decision-tables.md` Decision 2 for the full 7 naming archetypes (Question Hook, Imperative, Paradox, Stakes Frame, Reveal, Familiar Villain, Historical Paradox).

Generate 3-4 options from at least 3 different archetypes. Label each with its archetype name.

Must pass: (1) 5-7 words, (2) Veritasium Test, (3) Learner's-Parent Test, (4) Practicability Test.

**Layer 2 — Technical Skill** (internal metadata):
- Must complete "The skill of ___ so that ___"
- Discrete, transferable, interview-testable
- **Recognizable** — use established academic/professional terms (MBA syllabus, JD vocabulary), not invented compound nouns
- No acronyms unless universally known

---

## Decision 2: Voice

**Fixed: "The Instructor"** — No user gate needed.

The Instructor is a knowledgeable peer who has done this work, has opinions backed by evidence, and tells you exactly what to do. Think: the best technical writer on Medium -- direct, opinionated, citation-rich, and occasionally personal.

**Core traits:**
- **Direct:** "Click Settings, then Hooks." Not "You might want to consider exploring the settings menu."
- **Encouraging:** "You've just built your first hook. Let's make it smarter." Not "This basic example barely scratches the surface."
- **Step-oriented:** Uses numbered steps, explicit actions, expected outcomes
- **Error-aware:** "If you see [error], that means [cause]. Fix it by [action]."
- **Zero jargon without definition:** Every technical term is explained on first use

**Premium tutorial traits (v2.0):**
- **Opinionated:** States recommendations as conclusions, not options. "Don't keyword-stuff. Research shows it performs 10% worse than zero optimization." Never hedges on concept screens.
- **Citation-rich:** Names sources by name. "According to BrightEdge, 96.8% of cited domains see zero citation change week-to-week." Never "Research suggests..."
- **Conversational authority** (sparingly): 2-3 first-person moments per course. "I've seen teams spend weeks on X when Y would have done more." Never on MCQ/artifact screens.

---

## Decision 3: Screen Count

LLM proposes a count between 8-20 based on topic complexity:

| Complexity | Typical Count | Examples |
|-----------|--------------|---------|
| Simple feature/tool | 8-12 | "Set up ChatGPT Custom Instructions", single feature walkthrough |
| Moderate tool with multiple features | 13-17 | "Master Claude Code Hooks", tool with 3-5 features |
| Complex platform with workflows | 18-22 | "Build with n8n Workflows", multi-step integration |

**Principle:** Always aim for the lowest necessary count without compromising learning quality. A 10-screen course that teaches well beats a 16-screen course with padding.

Present to user with justification. User confirms or adjusts.

---

## Decision 4: Screen Plan

Build the screen-by-screen plan using the hands-on screen type taxonomy:

| Screen Type | Purpose | Required? | Repeatable? |
|-------------|---------|-----------|-------------|
| `intro` | Hook + why this matters + what you'll build | Yes, first | No |
| `setup` | Prerequisites, environment, install context | Optional | No |
| `concept` | Teach a named technique with trigger, action, outcome. Must contain opinionated recommendation + data point. | Optional | Yes (max 4) |
| `demo` | Step-by-step walkthrough naming specific tools/URLs. Ends with inline micro-checklist. | Yes (min 2) | Yes |
| `try_it` | MCQ checkpoint testing tool comprehension. Standardized title: "Test Your Instinct" | Yes (min 2) | Yes |
| `artifact` | Reference checklist, command table, comparison matrix | Optional | Yes |
| `tip` | Anti-Pattern Spotlight (3-5 anti-patterns) OR Pro Tip (with evidence). At least 1 must be anti-patterns. | Optional | Yes (max 3) |
| `interview` | Open-ended application question (≤50 words). Guidance in JSON only. | Optional | No |
| `recap` | Summary + time-bound action plan: "This week / This month / In 3 months" | Yes, last | No |

**Ordering constraints:**
- `intro` must be Screen 1, `recap` must be the last screen
- `interview` (if present) immediately precedes `recap`
- At least one `try_it` before the midpoint of the course
- Never 3+ consecutive `demo` or 3+ consecutive `try_it` screens
- `concept` must precede its related `demo`
- Story-Exercise-Story rhythm: no two exercise cards (Practice/Glossary) back-to-back without a story card
- One glossary term per card (standalone Glossary cards, not embedded in concept screens)
- Standardized MCQ card titles only — no descriptive/narrative titles on Practice cards

**Screen Plan Format** (presented to user for approval):

| # | Type | Topic | MCQs | Artifacts | Videos |
|---|------|-------|------|-----------|--------|
| 1 | intro | [Hook + why this matters] | 0 | 0 | 0 |
| 2 | concept | [Key concept explanation] | 0 | 0 | 0 |
| 3 | demo | [First feature walkthrough] | 0 | 0 | 0-1 |
| ... | ... | ... | ... | ... | ... |

---

## Decision 5: Artifact Decisions

How many data artifacts (0-5) and which types:

| # | Artifact Type | JSON Block Type | Best when... |
|---|--------------|----------------|-------------|
| 1 | Performance Dashboard | `scorecard` | Tool has metrics/stats to display |
| 2 | Comparison Matrix | `comparison` | Comparing tool features/approaches |
| 3 | Decision Checklist | `checklist` | When-to-use decision criteria |
| 4 | Process Timeline | `timeline` | Multi-step workflow visualization |
| 5 | Command Reference | `table` | Quick-reference for commands/shortcuts |
| 6 | Config Reference | `table` | Configuration options/settings |

Artifacts can appear on any `artifact` screen. Multiple artifacts per course allowed (unlike concept sprint's single artifact).

---

## Decision 6: MCQ Count & Placement

Minimum 4, maximum 12 MCQs distributed across `try_it` screens.

Rules:
- At least 1 MCQ per `try_it` screen
- At least 1 MCQ before the midpoint
- At least 1 MCQ in the final third
- MCQs test tool comprehension, not strategic judgment
- Options should be concrete tool actions/outputs, not abstract concepts

---

## Decision 7: Video Count & Placement

0-3 videos placed on `demo` screens.

Guidelines:
- Use video when the demo involves complex UI interaction that's hard to show in screenshots
- Use screenshots when the demo is simple click → result
- Video aspect ratio: 16:9 (landscape)
- Each video: 30-90 seconds max
- If no videos: user provides screenshots only

---

## Decision 8: Opening Hook

3 opener styles for hands-on courses:

| Style | Formula | Example |
|-------|---------|---------|
| Frustration | "You've been using [tool] daily but [common frustration]..." | "You've been using ChatGPT daily but every conversation starts from scratch..." |
| Curiosity | "What if [tool] could [surprising capability]..." | "What if Claude Code could automatically lint your code before every commit?" |
| Accomplishment | "By the end of this course, you'll have built [concrete deliverable]..." | "By the end of this course, you'll have 3 working hooks that save you 30 minutes daily." |

**Batch variety:** Track which hook style was used by the last 2 hands-on courses in `courses/batch-diversity-log.md`. If 2 consecutive courses used the same style (e.g., both Frustration), use a different style for the current course. Frustration is the most intuitive default — deliberately vary away from it.

---

## Decision 9: Game

Optional for hands-on courses. Choose one path:

| Option | When to choose |
|--------|---------------|
| Include game | Topic has enough conceptual depth for a game mechanic |
| Replace with extra artifacts | Topic is more reference-heavy; learners benefit from cheat sheets |
| Neither | Course is self-contained; adding either would feel forced |

**Mechanic selection for hands-on games:**

| Mechanic | Best when... |
|----------|-------------|
| **Tool Simulation** (preferred for hands-on) | Skill is operating a specific tool — player interacts with a simplified replica of the tool's interface. Rounds present increasingly complex scenarios (basic operation → multi-step workflow → troubleshooting). See `GAME-DESIGN.md` mechanic #8. |
| Allocation/Slider | Skill involves resource distribution or configuration trade-offs |
| Progressive Disclosure | Skill involves sequential decision-making with incomplete info |
| Classification/Sorting | Skill involves categorizing entities along dimensions |
| Scenario Branching | Skill involves trade-off navigation with stakeholder consequences |
| Pattern Matching | Skill involves signal detection in noisy data |

**Default for tool-operational courses:** Use Tool Simulation when the skill is operating a specific tool (IDE plugins, dashboard configuration, CI/CD pipeline setup). Fall back to Classification or Build-and-Watch when the hands-on skill is conceptual rather than tool-operational (like GEO optimization where the "tool" is content strategy).

---

## Decision 11: Technique Count

How many named, discrete, verifiable techniques the course teaches. A "technique" has a name, a trigger condition ("when you see X"), and a specific outcome ("you'll get Y").

- **Minimum:** 5 techniques (HARD GATE)
- **Target:** 7-10 techniques
- **Maximum:** 12 techniques (beyond this, the course is trying to cover too much)

Examples of good techniques: "Answer-first restructuring", "FAQ schema implementation", "Content chunking audit", "Manual prompt testing across 3 platforms"
Examples of bad techniques (too vague): "Think about structure", "Consider your audience", "Be strategic"

The `recap` screen lists all techniques by number as a takeaway reference.

---

## Decision 12: Citation Sources

Which expert sources, research studies, or data points the course will cite. Minimum 3 named citations.

| Citation Type | Example | When to use |
|--------------|---------|-------------|
| Named research firm | "BrightEdge found that 96.8% of domains..." | Quantitative claims about industry trends |
| Named tool/platform | "Google's Rich Results Test validates..." | Tool-specific implementation steps |
| Named practitioner/expert | "According to Rand Fishkin at SparkToro..." | Expert opinions or methodology references |
| Named company case study | "SeerInteractive's analysis of 10,000 queries showed..." | Real-world evidence for recommendations |

Present the planned citations to the user during spec review. The Instructor must cite these sources by name in the course content, never as "research shows" or "studies suggest."

---

## Story Arc Summary Construction (Hands-On)

After all decisions, construct a brief story arc summary:

**Opening:** [Hook style] — [Opening line]
**Journey:** [Screen count] screens covering [feature list]
**Checkpoints:** [MCQ count] practice checks at [placement]
**Artifacts:** [Count] reference materials ([types])
**Videos:** [Count] walkthroughs at [placement]
**Techniques:** [Count] named techniques ([list them])
**Citations:** [Count] named sources ([list them])
**Interview:** [Included/Not included] — [question topic if included]
**Closing:** [Recap approach with time-bound action plan]
**Game:** [Included/Replaced/Neither] — [brief description if included]
**Tool:** [Subtype] — [brief description]

---

## Decision 13: Tool Concept

Same as Decision 16 in the concept sprint decision tables. Hands-on courses get a tool too.

Auto-select subtype based on the course's operational nature:

| Hands-On Course Type | Natural Subtype | Why |
|---------------------|-----------------|-----|
| Tool-operational (operating specific software) | Analyzer | User pastes their output; tool scores it against best practices |
| Workflow/process | Builder | Steps become a checklist to fill in |
| Strategy/framework | Matcher/Picker | Decision tree maps to qualifying questions |
| Quantitative/data | Calculator | Parameters produce computed recommendations |

**Specify:** subtype, 4-6 course vocabulary terms used as UI labels, what the user inputs, what output they receive, estimated time (2-5 min), shareability format, and a 2-3 sentence sketch.

**Diversity cap:** Max 4 uses per subtype across all courses (check `batch-diversity-log.md` Table 3 — Tool Subtype column).

See `shared/tool-design-system.md` for the full 8 design principles and technical constraints.
