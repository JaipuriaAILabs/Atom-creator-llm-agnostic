# Interactive Decision Panels — Phase 4 Step 2

Walk through **4 grouped panels** using `AskUserQuestion`. Each panel shows 2-4 decisions as multiple-choice questions. The recommended option (from the spec) is listed first with "(Recommended)" label. Every option includes enough description for the user to visualize impact on the course.

---

## Panel 0 — Genre Gate (Concept Sprint only, 3 questions — USER GATE HARD)

Present this panel FIRST. Genre shapes everything downstream — voice affinity, opening structure, narrative pacing, framework integration, visual direction.

**Pre-panel display:** Show the top 2-3 genre recommendations from Step 1.1b with evidence:
"Based on your research findings, here are the recommended genres:"
| Rank | Genre | Signal Score | Evidence |
|------|-------|-------------|----------|
| 1 | [Genre] (Recommended) | [N]/3 | [1-line from research] |
| 2 | [Genre] | [N]/3 | [1-line from research] |
| 3 | [Genre] | [N]/3 | [1-line from research] |

```
Q1: "What storytelling genre should drive this course?" (USER GATE — HARD)
  [Show top 3 genres with descriptions from genre-system.md]
  - [Genre A] (Recommended): [Exemplar feel — 1 sentence]. Core mechanism: [name].
  - [Genre B]: [Exemplar feel]. Core mechanism: [name].
  - [Genre C]: [Exemplar feel]. Core mechanism: [name].

Q2: "Should this course use a braided lateral analogy?"
  - No (Recommended for most courses): The genre's narrative structure drives the course alone.
  - Yes: A lateral story vocabulary is woven into every screen as a diagnostic lens.
    [If Yes, show: the diagnostic lens test questions]

Q3: "What world should the stories come from?"
  - Professional (Recommended): Business case studies from the skill's domain.
  - Contemporary: Trending companies and culture.
  - Provocative: Non-business domains with shock value.
```

**Nudge after Q1 (genre selected):**
"[Genre] courses use [core mechanism]. The opening will follow this template: [Screen 1 template from genre-system.md]. Voice recommendation: [Primary voice] — [1-line rationale]."

**Nudge after Q2 (if Braided = Yes):**
"Braided technique adds vocabulary interleaving to the [genre] narrative structure. Quick check: can you map 5+ course concepts to story-world terms that ILLUMINATE (not just relabel)? If the mapping feels forced, drop the braided technique."

**Downstream adjustments (replaces the old framing-mode adjustments):**
- Panel 1 Q1 (Voice): First option is the genre's Primary voice with "(Recommended for [genre])"
- Panel 2 Q1-Q2 (Contrast, Twist): Show genre-specific versions from genre-system.md Screen Function Specifications
- Panel 3 Q3 (Scene-Entry): For Screen 1, show the genre's opening template instead of the generic scene-entry taxonomy

---

## Blueprint Summary (Multi-artifact mode only)

When multi-artifact mode is active (Phase 2.5 completed), display the locked blueprint between Panel 0 and Panel 1:

```
"Here's the approved course blueprint:"
[Display the ASCII flow diagram from the locked blueprint]

"This structure is locked. The following decision panels apply only to screen types present in this blueprint."
```

**Panel adjustments for blueprint-constrained courses:**

- **Panel 1** remains unchanged (identity + structure decisions still apply)
- **Panel 2** (Storytelling Mechanics): Show only decisions for screen types present in the blueprint. If the blueprint has no Contrast screen, skip Q1. If no Twist screen, skip Q2. Etc.
- **Panel 3** (Interview): Expand for multiple interviews when blueprint has them. Present one framing question per Interview:Applied subtype. Interview:Retention uses standard MCQ rules (no framing choice). Interview:Current-Affairs uses Framing 5 (no choice — display as locked).
- **Panel 4 Q1** (Interactive content): Game presence is LOCKED by blueprint. If the blueprint specifies games, "Tool only" and "Content-only" options are hidden — the user must include the game. Tool is NOT blueprint-locked — the user can always add or remove the tool regardless of blueprint.
- **Panel 4 Q2** (Details): Game mechanic question expands for multiple games per the rules below. Tool subtype is always a single question regardless of blueprint.

**Example expanded Panel 3 Q2 (2 interviews + current-affairs):**
```
Q2a: "What scenario should Interview:Applied #1 use?"
  - [Framing 1] (Recommended): [scenario]
  - [Framing 2]: [scenario]
  - [Framing 3]: [scenario]

Q2b: "Interview:Current-Affairs uses Framing 5 (Current Affairs + Technical) — locked."
  [Display: "In [month/year], [event]. Using what you've learned about [skill]..."]
  No user choice needed.
```

**Example expanded Panel 4 Q2 (2 games, blueprint-constrained):**
```
Q3a: "What mechanic for Game #1 (after Screen [N])?"
  - [Mechanic A] (Recommended): [sketch]
  - [Mechanic B]: [sketch]

Q3b: "What mechanic for Game #2 (after Screen [N])?"
  Must differ from Game #1's mechanic.
  - [Mechanic C] (Recommended): [sketch]
  - [Mechanic D]: [sketch]
```

---

## Panel 1 — Identity & Structure (5 questions)

```
Q1: "What should this course be called?"
  Present 3-4 options from at least 3 different naming archetypes (see Decision 2 taxonomy).
  Label each with its archetype name. Check which archetypes the last 4 courses used —
  prefer underused archetypes as tiebreaker.

  - [Archetype #N — Name] (Recommended): "[Title option]"
    [1-line rationale: why this archetype fits + Veritasium/parent test status]
  - [Archetype #N — Name]: "[Title option]"
    [1-line rationale]
  - [Archetype #N — Name]: "[Title option]"
    [1-line rationale]
  - [Archetype #N — Name] (optional 4th): "[Title option]"
    [1-line rationale]

  Variety note: "Recent courses used: [list archetype names from last 4 courses].
  Options above prioritize underused archetypes."

Q2: "Which narration voice should drive this course?"
  - Voice [X] — [Name] (Recommended): [2-line description of voice style + why it fits this skill]
  - Voice [Y] — [Name]: [2-line description + when this is better]
  - Voice [Z] — [Name]: [2-line description + when this is better]

Q3: "How should the core framework be structured?"
  - [Recommended type] (Recommended): [1-line + why it fits this skill specifically]
  - [Alternative 1]: [1-line description]
  - [Alternative 2]: [1-line description]

Q4: "What real-world document should the learner analyze?"
  - [Recommended type] (Recommended): [description + example of what THIS course's artifact would show]
  - [Alternative 1]: [description + what it would show]
  - [Alternative 2]: [description + what it would show]

Q4b (conditional — show ONLY when Q4 selection involves tabular data or could be rendered as a table):
  "How should this artifact data be rendered?"

  The system analyzes the artifact's data shape (columns × rows) and story fit,
  then presents a recommendation:

  "Based on the artifact data ([N] dimensions × [M] entries), I recommend:
  **[Format]**. Rationale: [why this format fits the data shape + story]."

  - [Recommended format] (Recommended): [description + mobile fit]
  - [Alternative format]: [description + trade-off]
  - Narrative: "Data woven into prose — each comparison becomes a sentence,
    each metric a narrative beat. Mobile-native, no scrolling concerns."

  If user requests >3 columns:
  "Tables are hard-capped at 3 columns for mobile readability (Principle 27).
  Would you like to: (1) Restructure to 3 columns by focusing on the most
  insightful dimensions, or (2) Switch to Narrative?"

  Recommendation logic: ≤2 cols × ≤6 rows → 2-col/2×2 matrix | 3 cols × ≤6 rows
  → 3-col table | ≤3 cols × 7+ rows → narrative | 4+ cols → narrative/reshape.
  Override: scannable data (matrix, audit) reshaped to ≤3×6 → compact table.
  Sequential story data → narrative even if it fits in 3 cols.

Q5: "How should this course be described in one line?"
  Generate 3-5 options. Each uses a different Opener x Stickiness combination from the
  taxonomy (see create.md). Label each with its types. Check batch-diversity-log.md
  Description Taxonomy table — prefer Opener types not used by the last 2 courses and
  Stickiness types used fewer than 2x in the current batch.

  - [Opener: X | Stickiness: Y] (Recommended): "[Description option]"
    [1-line rationale: why this combination fits + batch variety status]
  - [Opener: X | Stickiness: Y]: "[Description option]"
    [1-line rationale]
  - [Opener: X | Stickiness: Y]: "[Description option]"
    [1-line rationale]
  - (optional 4th-5th options with different Opener x Stickiness pairings)

  Rules: Single line, plain human language, skill-focused (not case study).
  No em/en dashes. No domain jargon. No course-catalog pivot verbs.
  Must NOT repeat the title (Layer 1) or skill name (Layer 2).

  Variety note: "Recent descriptions used: [list Opener types from last 2 courses].
  Batch stickiness counts: [list types with current counts]."
```

## Panel 2 — Storytelling Mechanics (4 questions)

```
Q1: "How should the two contrasting companies be presented?"
  - [Recommended] (Recommended): [Approach description + which entities would be compared]
  - [Alternative]: [description]

Q2: "How should the 'plot twist' moment land?"
  - [Recommended] (Recommended): [Mechanism + what specific finding it would reveal]
  - [Alternative]: [description]

Q3: "What human struggle makes this skill hard to apply?"
  - [Recommended] (Recommended): [Framing + specific tension for this skill]
  - [Alternative]: [description]

Q4: "What form should the insider expert move take?"
  - [Recommended] (Recommended): [Format + what the expert move is]
  - [Alternative]: [description]
```

## Panel 3 — Resolution & Opening (3 questions)

```
Q1: "How should the course wrap up what the learner now knows?"
  - [Recommended] (Recommended): [Framing + what it lands on]
  - [Alternative 1]: [description]
  - [Alternative 2]: [description]

Q2: "What scenario should the final interview rehearsal use?"
  - [Recommended] (Recommended): [Framing + specific scenario description]
  - [Alternative]: [description]

Q3: "How should the very first line pull the learner in?"
  - [Recommended approach] (Recommended): [Family] — [example opening line for THIS course]
  - [Alternative approach]: [Family] — [example opening line]
  - [Alternative approach]: [Family] — [example opening line]
```

## Panel 4 — Interactive Content (2 questions)

```
Q1: "What companion interactive content should this course include?"

  Auto-derive recommendation using this logic:
  - Game + Tool (default for most courses): Game reinforces through play; tool applies
    course concepts to the learner's own context.
  - Game only: Framework is too abstract for a tool (no ratable dimensions, no
    quantitative inputs). Rare.
  - Tool only: The skill is deeply personal/contextual (career planning, compensation
    analysis). A game would feel forced.
  - Content-only: This course's narrative stands alone — no interactive companion needed.
    The story IS the pedagogy.

  **When to recommend Content-only:** If the selected genre is narrative-heavy (Literary Journalism, Corporate Biography, or Legal/Regulatory Thriller) AND the Course Generation Brief has a 4-beat arc with strong emotional stakes, recommend Content-only with positive framing. Present it as the 2nd option (after Game+Tool), not the last option.

  Present recommendation with a 1-sentence rationale referencing the specific course.

  Options:
  - Game + Tool (Recommended): "Game ([mechanic sketch in 4-6 words]) teaches through play.
    Tool ([subtype]: [sketch in 4-6 words]) applies course concepts to the learner's real
    situation. Both ship as standalone HTML files."
  - Game only: "[Mechanic sketch in one sentence]. No companion tool — [1-sentence rationale
    for why a tool wouldn't add value for this specific course]."
  - Tool only: "[Tool subtype + sketch in one sentence]. No game — [1-sentence rationale
    for why the skill is best served by direct application]."
  - Content-only: "No interactive companion content. This course's narrative stands alone — the story IS the pedagogy."

Q2: Conditional detail question(s) — show only for content types selected in Q1.

  IF Game is included (Game+Tool or Game only):
  "What mechanic should the game use?"
    - [Recommended mechanic] (Recommended): [2-sentence sketch of what player does and learns]
    - [Alternative mechanic]: [2-sentence sketch]
    - [Alternative mechanic]: [2-sentence sketch]

  IF Tool is included (Game+Tool or Tool only):
  "What tool subtype should be built?"
    - [Recommended subtype] (Recommended): [Subtype name + 2-sentence sketch of
      what the tool calculates or surfaces] + [4 vocabulary terms from spec the
      tool will use]
    - [Alternative subtype]: [2-sentence sketch]
    - [Alternative subtype]: [2-sentence sketch]

  IF Game+Tool selected: present BOTH detail questions sequentially (Game first, Tool second).
  IF Content-only selected: skip Q3 entirely.
```

Every question allows "Other" for custom input.

---

## After All Panels (5 for Concept Sprint, 3 for Hands-On)

If any choices differ from the spec's original recommendations:
1. Update the affected spec sections
2. **Re-render the Story Arc Summary** to reflect the actual selections
3. Display the updated story arc

**Interactive content spec propagation** — if Panel 4/3 Q1 selection differs from spec:
- **Game removed** → delete the `## Game Concept` section from the spec entirely. `:assets` and `:game` will skip game generation (no Game Concept = no game).
- **Tool removed** → delete the `## Tool Concept` section from the spec entirely. `:assets` and `:tool` will skip tool generation (no Tool Concept = no tool).
- **Tool added** (was not in spec) → generate a new `## Tool Concept` section using Decision 16 auto-selection logic, populated with subtype, vocabulary, and sketch from Q3.
- **Tool subtype changed** → update `## Tool Concept` with the new subtype, vocabulary terms, and sketch from Q3.
- **Game mechanic changed** → update `## Game Concept` with the new mechanic and sketch from Q3 (existing behavior).

## QG2: Final Confirmation (HARD GATE)

After the panels (and updated story arc if applicable), present the final confirmation:

"All decisions confirmed. The story arc [has been updated to reflect your changes / remains as shown]. Ready to start generation?"

Use `AskUserQuestion` with:
- "Approve and generate" — proceeds to Phase 5
- "I want to change something" — re-enter specific panel
- "Start over" — re-run Phase 3 with different constraints

**HARD GATE:** Generation does NOT start until the user selects "Approve and generate."

---

## Hands-On Course Panels (3 panels)

When archetype is `hands_on`, use these 3 panels instead of the 4 concept sprint panels above.

### Panel 1 — Structure (4 questions)

```
Q1: "How many screens should this course have?"
  - [LLM's proposed count] (Recommended): [Justification based on topic complexity]
  - [Alternative count]: [When this might work better]

Q2: "How many practice checkpoints (MCQs) should be included?"
  - [Recommended count + placement]: [Why this spacing works]
  - [Alternative]: [Different spacing rationale]

Q3: "How many data artifacts (reference tables, scorecards, checklists) should the course include?"
  - [Recommended count + types]: [Why these types fit]
  - [Alternative]: [Different approach]

Q4: "Should the course include video walkthroughs?"
  - [Recommended count + placement]: [Which demos benefit from video]
  - "No videos — screenshots only": Screenshots sufficient for this topic
```

### Panel 2 — Content (4 questions)

```
Q1: "Here's the proposed screen-by-screen plan. Would you like to approve or modify it?"
  - "Approve this plan" (Recommended): [Show the full screen plan table]
  - "I want to modify it": [Re-enter screen plan editing]

Q2: "How should the course open?"
  - Frustration (Recommended): "You've been using [tool] daily but [common frustration]..."
  - Curiosity: "What if [tool] could [surprising capability]..."
  - Accomplishment: "By the end of this course, you'll have built [concrete deliverable]..."

Q3: "What depth level should this course target?"
  - Beginner: No prior experience with the tool assumed
  - Intermediate (Recommended): Familiar with basics, learning advanced features
  - Advanced: Power users learning expert-level workflows

Q4: "How should this course be described in one line?"
  Generate 3-5 options using different Opener x Stickiness combinations.
  Same rules as Concept Sprint Panel 1 Q5 — label each with types, check batch
  diversity, prefer underused Openers and Stickiness types.

  - [Opener: X | Stickiness: Y] (Recommended): "[Description option]"
    [1-line rationale]
  - [Opener: X | Stickiness: Y]: "[Description option]"
    [1-line rationale]
  - [Opener: X | Stickiness: Y]: "[Description option]"
    [1-line rationale]
```

### Panel 3 — Interactive Content (2 questions)

```
Q1: "What companion interactive content should this course include?"

  Auto-derive recommendation using the same logic as Concept Sprint Panel 4 Q1.
  Present recommendation with a 1-sentence rationale referencing the specific course.

  Options:
  - Game + Tool (Recommended): "Game ([mechanic sketch in 4-6 words]) teaches through play.
    Tool ([subtype]: [sketch in 4-6 words]) applies course concepts to the learner's real
    situation. Both ship as standalone HTML files."
  - Game only: "[Mechanic sketch in one sentence]. No companion tool — [1-sentence rationale]."
  - Tool only: "[Tool subtype + sketch in one sentence]. No game — [1-sentence rationale]."
  - Replace with extra artifacts: Add additional reference materials (checklists, scorecards,
    reference tables) instead of interactive companion content.
  - Content-only: No interactive companion content. This course's narrative stands alone — the story IS the pedagogy.

Q2: Conditional detail question(s) — show only for content types selected in Q1.

  IF Game is included (Game+Tool or Game only):
  "What mechanic should the game use?"
    - [Recommended mechanic] (Recommended): [2-sentence sketch of what player does and learns]
    - [Alternative mechanic]: [2-sentence sketch]
    - [Alternative mechanic]: [2-sentence sketch]

  IF Tool is included (Game+Tool or Tool only):
  "What tool subtype should be built?"
    - [Recommended subtype] (Recommended): [Subtype name + 2-sentence sketch of
      what the tool calculates or surfaces] + [4 vocabulary terms from spec the
      tool will use]
    - [Alternative subtype]: [2-sentence sketch]
    - [Alternative subtype]: [2-sentence sketch]

  IF Game+Tool selected: present BOTH detail questions sequentially (Game first, Tool second).
  IF Replace with extra artifacts or Content-only selected: skip Q2 entirely.
```

Every question allows "Other" for custom input.

### After All 3 Panels (Hands-On)

Same QG2 hard gate as concept sprint:
"All decisions confirmed. Ready to start generation?"
- "Approve and generate"
- "I want to change something"
- "Start over"
