---
name: atom-creator-plan
description: Research a skill topic, extract an atomic skill, apply god-mode creative decisions, and produce an APPROVED course spec — the blueprint for all downstream stages. Invoke when the user says /plan {input} or "plan a course on {topic}". Accepts structured input (Role / Industry / Level), URLs, file paths, or free topic. Returns: courses/specs/{slug}-spec.md with Status=APPROVED.
license: MIT
recommendedAgent: course-researcher
---

# Atom Creator — Plan a Course (Stage 1)

> Pipeline: `:plan` (you are here) → `:create` → `:audit` → `:assets` → `:db-insert` → `:final-audit`

**Purpose:** Research a topic, select a course archetype (Concept Sprint or Hands-On Guide), extract an atomic skill, apply creative decisions, and produce an approved Course Spec. The spec is the persistent contract between all downstream stages.

**Input formats:**
```
/plan Territory Sales Manager / FMCG / Mid-level   (structured)
/plan https://economist.com/some-article            (URL)
/plan /path/to/report.pdf                           (file)
/plan "US-Iran tensions and market turbulence"       (free topic)
```

**Output:** `courses/specs/{slug}-spec.md` (approved spec with all decisions + research appendix)

**Next step:** `/create {slug}`

---

## Note on decisions

This skill was originally designed around 14 interactive AskUserQuestion panels. In OpenCode, those panels are replaced by **god-mode defaults** (see decision table below). **The user can override any default by replying inline in chat before the spec writes to disk** — e.g. "use Behavioral Science genre", "swap voice to Narrator", "make this Hands-On not Concept Sprint".

For the full interactive experience, wait for the v1.1 custom `askUser` tool. For now, the defaults are tuned for sensible output on the typical Indian-business-skill topic this pipeline serves.

---

## Pipeline

### Phase 0: Input Detection + Content Extraction

**0.0 — Detect input type.** Precedence: (1) `http(s)://...` → URL; (2) starts with `/`, `~/`, `./` AND ends with `.pdf/.txt/.md/.doc/.docx` → File path; (3) exactly two `/` delimiters with non-empty segments → Structured; (4) else → Free text. Structured inputs skip to 0.5.

**0.1 — Extract content (unstructured only):**
- URL: WebFetch to extract main topic, industries, roles, skills. Store as `seed_content`.
- File path: Read tool. For PDFs >10 pages, read pages 1-5 + executive summary.
- Free text: raw input IS `seed_content`. Normalise whitespace.

**0.2 — Map content to Role / Industry / Level:** Analyse `seed_content` to infer Role (most specific common title), Industry (standard sector abbreviation), Level (default Mid-level unless content implies executive). This is a hypothesis — Phase 1's 6-gate process makes the final call.

**0.3 — Confirm inferred mapping (skippable):** Print the inferred mapping. God-mode default: proceed. User can override with "correct to: Role X / Industry Y / Level Z".

**0.5 — Parse structured input:** Parse three slash-delimited fields. Normalise.

**0.6 — Check existing courses:** Scan `courses/*.md` for the role slug. If a course exists, note it and exclude its skill from candidates to ensure variety.

**0.7 — Archetype Selection.**

**God-mode default:**
- If input/content mentions "tutorial", "software", "step-by-step", "workflow", "how to configure" → **Hands-On Guide**
- Otherwise → **Concept Sprint** (more versatile format)

Record the archetype. This determines which files load for all subsequent phases.

### Phase 0.8: Environment Check

If `.atom-creator-config.json` is missing, run `atom-creator-setup` first.

---

### Phase 1: Research + Skill Extraction

**1.1 — Multi-source research (parallel).**

Apply the **Structural Contrarian Lens** (from `agents/course-researcher.md`):
- Seek thinkers who treat conventional wisdom as testable hypothesis, structural explanatory models, multiple-futures thinkers
- Prefer regulatory filings, implementation post-mortems, earnings transcripts, long-form practitioner podcasts, primary-source data
- Avoid mainstream Indian influencers, LinkedIn motivational posters, TEDx recyclers
- Filter: does this give a structural mechanism, a concrete teachable image, or an emotional stake? If none, cut.

**Research Focus Auto-Detection:**
- Indian context signals (Indian company names, SEBI / RBI / CBDT / GST / IRDAI, kirana / mandi / Jio, roles like "CA" / "Territory Sales Manager / FMCG") → `research_focus: india_first`
- Explicit India-centric industry → `research_focus: india_first`
- Otherwise → `research_focus: global`

`india_first` inversion: min 3 Indian + max 2 international cases (default is min 2 Indian + 1 international).

Dispatch 2-3 sub-agents in parallel via OpenCode's Task tool (course-researcher agent):

- **Agent A — Perplexity Research:** Use the Perplexity MCP server (`mcp__perplexity__perplexity_research` for deep investigation; `mcp__perplexity__perplexity_search` for specific facts). Fall back to WebSearch if unavailable. Focus: company examples with metrics, counterintuitive data points, domain metrics, failure cases, expert practices.
- **Agent B — YouTube Research:** Use the YouTube MCP when registered — search for lectures, case studies, expert talks. Extract quotes, frameworks, teaching metaphors. Never sole source.
- **Agent C — Lateral Connection Search (optional):** Only when the skill sounds abstract. Search non-business domains (military, sports, architecture, biology, film, criminal justice) that solve the same structural problem. Return 1-2 lateral candidates.

**Merging:** After all agents return, synthesise. YouTube often surfaces teaching metaphors, expert frameworks not yet indexed, narrative anecdotes. Perplexity prefers metrics. Deduplicate. Cut anything failing the Structural Contrarian filter.

**Narrative Thread Test:** After merging, verify the research forms a coherent throughline: "[Primary company] did X because of Y. But [counterintuitive finding] shows Z. The expert practice of W explains the gap. The learner who understands this will [personal payoff]." If this doesn't flow, run a targeted follow-up.

#### 1.1b — Genre Signal Extraction

After research merges, score each genre 0-3 using signal tests in `shared/genre-system.md`:

| Genre | Signal Test |
|-------|------------|
| Literary Journalism | Named protagonist with chronological 4-beat arc? |
| Investigative Journalism | Hidden data contradicting surface narrative? |
| Industry Epic | 3+ companies across decade+ across geographies? |
| Corporate Biography | Deep internal decision-making at one company? |
| Geopolitical Analysis | Structural mechanism as primary explanation? |
| Behavioral Science | Named bias/experiment with quantified effect? |
| Legal/Regulatory Thriller | Specific regulation/case as catalyst? |
| Practitioner Memoir | Operational field texture? |

Top 2-3 genres become recommendations. **God-mode default: pick the highest-scoring genre.**

**Audience:** The course is for INTERESTED NOVICES — people curious but with zero domain knowledge. Stories must intrigue a non-expert (Delhi Dinner Table Test applies).

**Concept Sprint research targets** (all findings must be real + verifiable):
- 3-5 company examples (2 Indian + 1 international minimum; invert for `india_first`). For EACH company: metric, pressure, human moment, structural insight.
- For the PRIMARY company (carries the Decode screens): capture a 4-beat arc (Setup → Pressure → Insight → Outcome) rich enough for 2-3 screens.
- 1 counterintuitive data point (number-backed)
- 5-8 domain metrics with definitions + benchmarks
- 1 documented failure case
- 1 expert practice differentiating top performers
- Emotional stakes: one concrete "what it feels like to fail at this" anecdote (practitioner quote, Reddit confession, podcast moment)

**Extract during research:**
- 7 glossary terms with Category + Meaning (60-80 words each). **LEGITIMACY RULE (C66):** every term MUST be sourced from research findings and appear in at least one source as an established domain concept. Never coin compound nouns.
- Course Generation Brief: Hook (3 contrasting companies), Decode (primary company deep dive + structural reveal), Plot twist (counterintuitive insight + data), Expert move, Payoff ("you now see differently" moment).

**Hands-On research targets:**
- Tool capabilities, key features, common pain points, step-by-step workflows, version-specific behaviors, common errors + fixes.
- 5-7 glossary terms (tool-specific).
- Key features list with difficulty ranking.

**Story Compellingness Gate (Phase 1.2):** 5-signal test:
1. Irony or paradox present?
2. Named protagonist making a decision?
3. Stakes with numbers?
4. Contrast pair (two entities, same question, different choice)?
5. "So what" for a novice?

Score: 5/5 PROCEED. 3-4/5 PROCEED WITH CAUTION (note Narrative Risk). 1-2/5 RECOMMEND ALTERNATIVE. God-mode: proceed at 3+/5, flag for user at 1-2/5.

**Research Curation Map (required in spec):** Assign each artifact to a narrative beat. Research NOT in this map should NOT appear in the generated course.
- Primary companies (max 3)
- Background companies (researched but not included)
- Active glossary terms (max 5)
- Reserve glossary terms (no card unless narrative earns them)
- Key metrics (max 6)

#### 1.2 — Skill extraction

From research, identify 2-3 candidate skills. Apply the **6-gate validation**:

| Gate | Test | Pass |
|---|---|---|
| 1 — Sentence | "The skill of ___ so that ___" | Completes naturally, no "and" composites |
| 2 — Interview | 4 progressively harder MCQs? | Clear difficulty gradient |
| 3 — Screen Fill | Can fill target screen count without repetition? | Each screen adds new value |
| 4 — Cross-Industry | Matters at 3+ companies? | Transferable |
| 5 — Zero-Familiarity | Non-expert can learn from course alone? | No prerequisite |
| 6 — Periphery | YES recognition + NO training = IDEAL sweet spot |

Score each: **Signal × Differentiation × Urgency** (max 125).

**Naming constraint:** Skill name uses recognisable academic/professional vocabulary. Max 2 words. NOT invented compound nouns. Test: "Would a professor list this as a module name?"

#### 1.2b — Academic Grounding

For each 6-gate-passed candidate, identify: the professional exam / academic course covering it (CA Final Paper 7, CFA Level II, MBA-Finance elective, SHRM-SCP competency), the formal doctrine (GAAR Chapter X-A, Porter's Five Forces), the textbook chapter name.

#### 1.2c — Claim Extraction (Research Registry)

Decompose each company example, counterintuitive finding, domain metric, failure case, expert practice into discrete numbered R-claims.

One claim = one verifiable assertion. Format:
```
R{N}: {claim text} | Source: {URL or publication} | Type: [metric|attribution|causal|biographical|temporal]
```

Generate 8-20 R-claims depending on research density.

### Phase 1.5 — Research Verification (HARD GATE)

For each R-claim, run 3-step verification:

**Step A — Source URL extraction.** From Phase 1.1, extract URL. If Perplexity didn't provide one, search for it.

**Step B — Primary source reading.** Use the Parallel Web MCP `web_fetch` (when registered, preferred because it batches URLs) or the built-in WebFetch tool. Pass the claim as `search_objective`. Extract the supporting paragraph.

**Parallelisation:** Batch up to 5 URLs per call. Group by source URL. Target all verification in 1-2 batches.

**Step C — Match:**
- Exact match → VERIFIED
- Directional match → VERIFIED with precision note
- Absent → PLAUSIBLE (downgrade)
- Contradicts → HIGH RISK (flag with contradicting text)
- Inaccessible → PLAUSIBLE (Perplexity fallback)

Store verification result + source paragraph (first 200 chars) as evidence.

**Hedging rules (aligns with P37):**
- VERIFIED: no hedging. Can be precise in prose.
- PLAUSIBLE: hedge with "roughly", "approximately", "around", "more than"
- HIGH RISK: replace with verified alternative OR state with explicit uncertainty ("reportedly", "according to unverified sources"). God-mode: attempt one replacement search; if none found, apply maximum hedging; never present to user.
- ZERO sources: REMOVE (HARD GATE).

Write Registry to spec `## Research Summary (Appendix)` as `### Research Registry`.

**God-mode:** Auto-accept VERIFIED + PLAUSIBLE. Auto-remove zero-source. Auto-hedge PLAUSIBLE. For HIGH RISK: one replacement search, else max hedging. 90-second hard cap on total web_fetch calls.

### Phase 1.3 — Quality Gate 1 (soft)

Present top 1-2 skill candidates with score and 6-gate pass/fail. **God-mode default: proceed with highest-scoring candidate.**

### Phase 1.4 — Story Readiness Check (soft)

3 narrative tests:
1. **Dinner Party Test:** Describe the main story in 3 sentences — does someone say "wait, really?"
2. **Deep Company Test:** Primary company has 4-beat arc (Setup → Pressure → Insight → Outcome)?
3. **Stakes Test:** Complete "If you don't learn this, you will ___" with a concrete personal consequence?

Any fail → flag as Narrative Risk in spec. God-mode: proceed; note risk.

---

### Phase 2: Batch Context Load

**2.0 — Learnings checkpoint.** Read `atom-creator-learnings.md` and `atom-creator-learnings.jsonl`. Apply new learnings. Count entries with `recurrence ≥ 2` and `status: "NEW"` — propose promotions.

**2.1 — Read batch diversity log.** `courses/batch-diversity-log.md` — Creative Decisions table + Visual & Game Assets table. Bootstrap if missing (scan `courses/*.md` and `courses/specs/*.md`).

**2.2 — Build variety map.** Extract LAST 4 rows. Summarise used: archetype, voice, framework type, artifact type, contrast approach, etc. Phase 3 prefers less-used options.

**2.3 — Genre distribution check (Concept Sprint only).** Count each genre used across ALL courses. Flag any genre at 3+ uses (batch cap: 3 per 8). Ban consecutive same-genre courses.

---

### Phase 2.5: Course Blueprint (Concept Sprint only)

**God-mode default:** Skip this phase entirely — use Default mode (single game, single interview). Standard screen architecture.

If user explicitly opts in ("multi-artifact mode"), read `shared/blueprint-system.md` and generate an ASCII flow diagram with 0-3 games and multiple interview types. Loop for tweaks until approved. The approved blueprint is written to the spec as `## Course Blueprint` and will constrain `:create` row-by-row.

---

### Phase 3: Spec Generation

#### Concept Sprint (most common)

Read `shared/decision-tables.md`. Read `shared/genre-system.md`.

**Pre-Decision: Genre (Phase 3.0).** Use the top-scoring genre from Phase 1.1b. God-mode default: accept the top recommendation.

**Screen Count.** God-mode default: 13 (Concept Sprint sweet spot per batch-diversity patterns). Range 12-14.

Make decisions in dependency order (genre cascades into decisions 6-10 and 12):
1. Voice (4 rotating voices)
2. Two-Layer Naming (Layer 1 emotional hook + Layer 2 technical skill)
3. Framework type
4. Artifact type
5. Artifact intro
6. Contrast (if plan includes)
7. Twist (if plan includes)
8. Human Problem (if plan includes)
9. Expert Tip (if plan includes)
10. Synthesis (if plan includes)
11. Interview (Framing 5 default)
12. Scene-entry
13. Game concept (mechanic family + aesthetic family per Decision 15a)
14. Tool concept (subtype — default Self-Audit)

Each decision uses research findings + variety constraints + voice affinity rules from the decision tables. **God-mode default per decision: pick the variety-maximising option from the diversity log.**

**Description Generation:** Use the Opener × Stickiness taxonomy (see `shared/description-taxonomy.md` or `create.md` Step 5.5). God-mode default: "How [subject]" opener + Unexpected stickiness. Description must reference research findings (companies, stats, stories) that will appear in the course.

**Story Arc Summary:** 3 acts, 3-5 sentences each, following the selected genre's narrative arc.

#### Hands-On

Read `shared/hands-on-decisions.md`. Make 9 decisions in dependency order:
1. Two-Layer Naming
2. Voice (Fixed: The Instructor)
3. Screen Count (8-20, LLM proposes with justification)
4. Screen Plan (full screen-by-screen table)
5. Artifact Decisions (0-5)
6. MCQ Count (4-12 on `try_it` screens)
7. Video Count (0-3 on `demo` screens)
8. Opening Hook style
9. Game (Include / Replace with artifacts / Neither)

Description + Story Arc as above.

---

### Phase 4: User Review

**Step 1:** Print the complete Course Spec as a single scannable document. Include `**Archetype:**` in header. Include Research Summary appendix (Phase 1 findings) + Research Registry.

**Step 2:** Print a summary of god-mode-applied decisions:
```
Auto-applied decisions (reply inline to override):
  Archetype: Concept Sprint
  Genre: {genre} (from signal extraction)
  Voice: {voice}
  Framework: {type # + name}
  Artifact: {type # + name}
  Accent color: {color} ({hex})
  Background: {color}
  Game mechanic: {mechanic}
  Tool subtype: {subtype}

Override example: "swap voice to Narrator" or "use Behavioral Science genre"
```

**QG2 (HARD GATE):** Wait for explicit `approve` / `go` / `ship it` reply, or `override: ...` instructions. Do NOT write the spec until approval received.

God-mode caller default: auto-approve after printing — this is what god-mode exists for.

---

### Save Approved Spec

After QG2 approval:

0. **Spec versioning:** Read `shared/spec-versioning.md`. If spec file already exists (re-plan case), snapshot pre-overwrite state.
1. Update `**Status:**` from `DRAFT` to `APPROVED`
2. Derive slug: `{role-slug}-{skill-slug}` (e.g., `territory-sales-manager-beat-planning`)
3. Ensure `courses/specs/` exists
4. Write approved spec to `courses/specs/{slug}-spec.md`
5. Snapshot APPROVED state (protects against `:create` modifications)
6. Update `courses/batch-diversity-log.md`:
   - Creative Decisions table: insert or overwrite row
   - Visual & Game Assets table: create row with `--` placeholders (populated by `:visuals`)
   - Description Taxonomy table: record Opener + Stickiness types

---

### Next Steps

Print:
```
✅ Spec approved and saved to courses/specs/{slug}-spec.md

Next steps (reply with your choice):
  create — /create {slug}   (generate course MD + JSON)
  edit   — open the spec in your editor first
  later  — I'll run :create later
```

**Capture learnings:** If the user corrected your approach during this session (skill selection feedback, genre preference, creative decision overrides, research methodology corrections), append each to `atom-creator-learnings.md` under **Spec Generation**. Format: `### {date} | :plan | {slug}` + Correction/Rule/Applies-to/Status=NEW.

---

## Troubleshooting

**Perplexity MCP unavailable:** Fall back to WebSearch. Research quality degrades — consider running more searches.

**Skill extraction finds no strong candidates:** Broaden scope. Try adjacent roles or industries. If still blocked, ask the user to refine input.

**Auto-detect archetype unclear:** Default to Concept Sprint (more versatile format; can incorporate tool-focused content within narrative structure).

**QG2 timeout in non-god-mode:** Re-prompt. QG2 is HARD — do NOT proceed without explicit approval.

---

## Gotchas

- **Verify person = documented actor (Andrew Chen precedent):** Attribution swap to more famous colleagues is the #1 factual error. Always verify THIS person did THIS action.
- **Revenue ≠ profit ≠ valuation ≠ GMV (Meesho precedent):** Use exact financial term. "Hit profitability" requires positive PAT.
- **Never merge statistics from different sources (Pendo/Userpilot precedent).** Each stat traces to its own named source.
- **Ghost citations are a credibility risk (Deloitte precedent).** Named publications must exist.
- **Verify DIRECTION of comparisons (LinkedIn precedent).** LinkedIn lateral-move data was INVERTED. Inversions are the hardest errors to catch.
- **Biographical accuracy (Nooyi precedent).** Wrong role category (engineer vs strategist) = HIGH risk. Primary sources only (LinkedIn, company pages) — not Wikipedia.
