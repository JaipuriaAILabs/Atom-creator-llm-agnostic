# Hands-On — Generation Rules

> **What this file covers:** All generation rules specific to the Hands-On (Premium Tutorial) archetype. Loaded by `:create` Step 4 when the spec's archetype is Hands-On.
>
> **When to load:** During Step 4 of `:create` when archetype = Hands-On.
>
> **Companion files:**
> - `generation-guide/generation-constraints.md` — banned phrases + DO NOT rules (loaded in Step 3)
> - `shared/structural-checks.md` — C1-C59 + C-HO1-C-HO5 check definitions (loaded in Step 6)
> - `shared/inline-validation.md` — V1-V16 post-generation checks (loaded in Step 4.5)

---

## Step 3: Files to Load (Hands-On)

1. `.claude/generation-guide/design-philosophy.md` — 36 design principles, MCQ rules, naming conventions
2. `.claude/generation-guide/hands-on-screen-rules.md` — Hands-on screen types, Instructor voice definition
3. `.claude/generation-guide/generation-constraints.md` — All banned phrases, patterns, and DO NOT rules
4. If blueprint mode detected (Step 2.7): `.claude/generation-guide/multi-artifact-rules.md` — Bridge requirements, density constraints, interview subtype specs

Do NOT load `screen-rules.md` or any `voice-{X}.md` file — The Instructor voice is defined in `hands-on-screen-rules.md`.

---

## Step 4: Generate Course Markdown (Hands-On)

Generate the course markdown from the Screen Plan table in the spec. Screen count: as specified (8-20 for hands-on). Follow the Instructor voice throughout. The spec removes creative uncertainty but does NOT relax quality — all rules from the generation guide still apply:
- MCQs on `try_it` screens (count as specified in spec, 4-12 range)
- Glossary terms (use the terms from the spec's Research Summary)
- **Glossary Term Legitimacy (HARD RULE):** Every glossary term MUST exist in the domain's established literature — real tool names, technique names, or standard terminology that a practitioner would recognize. Never coin compound nouns to label concepts. If the concept is real but has no established name, teach it in narrative prose — do NOT create a glossary card. The test: "Would a practitioner recognize this term without this course?" See `create-rules-cs.md` for full legitimacy rules and examples of banned vs allowed patterns.
- Screen independence (every screen self-contained)
- Bus test for cognitive load
- All generation constraints from `generation-constraints.md` — zero tolerance
- The Instructor voice: direct, encouraging, step-oriented, error-aware, zero jargon without definition
- **No Fabricated Names in MCQs** — same rules as concept sprint: "you/your" framing, no invented characters
- **No Fabricated Company Scenarios** — same rules as concept sprint: real companies from research or "you/your team"
- Screenshots referenced via `media` field — use placeholder paths like `screenshot-1.png`
- Videos referenced via `video` blocks — use placeholder `src` paths
- `intro` is first screen, `recap` is last screen
- Concept screens must precede their related demo screens

### Interview Block Type (Standard Card — REQUIRED for Hands-On)

- The LAST screen MUST use `type: "interview"` block with the standard 3-block structure:
  1. Heading block: `{"type": "text", "variant": "heading", "value": "The Real Question"}`
  2. Text block: `{"type": "text", "value": "You've done the work. You know the framework. Now step up and prove it."}`
  3. Interview block: `topics` = `["This is what interviewers actually ask.", "Record your answer to get AI-powered feedback. Upload your CV for a personalised ideal answer."]`
- Interview is REQUIRED for hands-on courses (not optional). Do NOT write a custom question.
- The `name`, `scores`, `guidance`, `feedback` fields are still course-specific.
- This is enforced by C50 and C52.

---

## Step 6: Structural Checks (Hands-On)

Load `${CLAUDE_PLUGIN_ROOT}/shared/structural-checks.md` for full check definitions.

**Checks to run for Hands-On:**
- C1-C34 (universal checks, with HO-specific variants for C7, C9, C11, C21, C22-C25, C31, C33)
- C-HO1 through C-HO5 (Premium Tutorial checks)
- C44-C56 (v6.0 card architecture)
- C57-C58 (narrative proportion + midpoint story card)
- C59 (genre consistency — if genre field exists)
- C60 (image filename uniqueness)
- C61-C64 (v10.0.0 scrollytelling: MCQ position distribution, protagonist presence, no self-created frameworks, resolution post-climax)
- C35-C43 (blueprint checks — ONLY when blueprint exists in spec)

### Hands-On Check Summary (quick reference)

- [ ] MD file exists at `courses/{slug}-hands-on-guide.md`
- [ ] JSON file exists at `courses/JSONS/{slug}.json`
- [ ] JSON parses without errors
- [ ] **Cover placement:** `screens[0].type` is `"cover"` — cover is a screen, not metadata
- [ ] **Cover completeness:** `screens[0]` has `image`, `mobile_image`, `title`, `subtitle`, `description`
- [ ] **No metadata.cover:** the `metadata` object does NOT contain a `cover` key
- [ ] **Description sync:** `metadata.description` === `screens[0].description`
- [ ] Screen count: 8-20 (matches spec's screen count, counting from screens[1] onward for content screens)
- [ ] MCQ count: 4-12 (matches spec's MCQ count)
- [ ] `intro` is screens[1] (first content screen after cover)
- [ ] `recap` is the last screen
- [ ] At least 2 `demo` screens
- [ ] At least 2 `try_it` screens
- [ ] At least 1 `try_it` before the midpoint
- [ ] No 3+ consecutive same-type screens
- [ ] Answer distribution: no letter (A/B/C/D) used more than 4 times across all MCQs
- [ ] MCQ answer-length balance: correct answer is NOT the longest in >50% of MCQs. If violated, auto-rebalance before proceeding.
- [ ] All spec decisions honored (spot-check screen plan types, artifact count, video count)
- [ ] `course_metadata.description` exists, is 80-120 characters, follows Opener x Stickiness taxonomy

### Universal checks with HO-specific variants

- [ ] **C7: Screen Bottom Lines (Hands-On)** — Every `concept`, `demo`, and `recap` screen must end with a `**bold closing line**` (1-2 sentences). `try_it` screens ending with MCQ explanations are exempt. `tip` and `artifact` screens are exempt. HARD GATE.
- [ ] **C9: Scene Entry Ban** — *Skip for Hands-On.* (Hands-on courses use the Instructor voice with direct address, not scene-setting entries.)
- [ ] **C11: Meta-Narration Padding** — **Exception for Hands-On:** "Let's" is permitted in the Instructor voice when followed by a concrete action (e.g., "Let's configure the webhook" is OK; "Let's look at the concept of webhooks" is NOT). HARD GATE.
- [ ] **C21: Screen Images (Hands-On)** — `demo` screens have screenshot references (`media` field). AI-generated images on `intro`, `recap`, and optionally one mid-course screen. `try_it` screens with MCQs do NOT have images (Principle 25). `tip` and `artifact` screens may omit images. WARN if `demo` screen lacks a media reference.
- [ ] **C22: Interview Isolation** — Interview screen REQUIRED (last screen). Standard 3-block structure ("The Real Question"). No guidance/hints/criteria visible on card. HARD GATE.
- [ ] **C23: Narrative Framework Quality (Hands-On)** — No colon-definition lists on `concept` screens. No bare single-word endings. No reflection questions (use MCQs on `try_it` screens). HARD GATE.
- [ ] **C24: Try-It Context Quality (Hands-On only)** — Every `try_it` screen must reference the specific tool action from the preceding `demo` by name. Generic checkpoint language = FAIL. HARD GATE.
- [ ] **C25: Demo Step Clarity (Hands-On only)** — Every `demo` screen must contain numbered steps (1. 2. 3.) with explicit tool actions. Vague instructions = FAIL. HARD GATE.
- [ ] **C31: Narrative Screen Verbosity (Hands-On)** — No `concept` or `intro` screen exceeds 350 words. WARN if average exceeds 180.

### Premium Tutorial checks (C-HO1 through C-HO5)

- [ ] **C-HO1: Technique Density** — Count named, discrete, verifiable techniques across all `concept` and `demo` screens. Min 5 HARD GATE. WARN if fewer than 7. The `recap` screen should list all techniques by number.
- [ ] **C-HO2: Tool Citation** — Every `demo` screen must name at least one specific tool, extension, command, or URL. Generic tool references = FAIL. HARD GATE.
- [ ] **C-HO3: Expert Citation Count** — Count named expert/data citations across the course. Minimum 3 named citations. "Studies show" without source does NOT count. HARD GATE.
- [ ] **C-HO4: Before/After Evidence** — Count screens with before/after comparison content. Minimum 2. WARN if fewer.
- [ ] **C-HO5: Action Timeline Recap** — The `recap` screen must contain time-bound action items with at least 3 time horizons. HARD GATE.

### Remaining checks

- [ ] C8, C10, C12, C13, C15-C20, C26-C30, C34 — universal checks (see structural-checks.md)
- [ ] C44-C56 card architecture checks (see structural-checks.md). Note HO-specific exemptions in C54 (demo numbered steps) and C55/C56 (different story screen type lists).
- [ ] C57 narrative proportion ≥55% story screens (≥50% for Behavioral Science)
- [ ] C58 midpoint screen is a story card (HARD GATE)
- [ ] C60 image filename uniqueness
- [ ] C61 MCQ correct-answer position — no position exceeds 40% (HARD GATE)
- [ ] C62 protagonist mentioned on 90%+ of non-cover screens (HARD GATE)
- [ ] C63 no self-created framework labels — invented acronyms are banned, real-world frameworks exempt (HARD GATE)
- [ ] C64 resolution post-climax aftermath content
- [ ] C35-C43 blueprint checks (if applicable — see structural-checks.md)

Always defer to `shared/structural-checks.md` for exact pass/fail conditions, severity levels, and error messages.

---

## Narration Bible Rules — Hands-On Adaptation (from shared/narration-bible.md)

> Adapted subset of the 47 narration principles for Hands-On (Premium Tutorial) archetype. HO courses teach techniques through demo/try_it screens, so framework positioning and story arc rules are adapted.

### Opening (Intro Screen)
- Intro screen should open with a PHYSICAL MOMENT or PRACTITIONER IN ACTION — not a concept definition.
- Name the expert/practitioner whose technique is being taught. Anchor to a real person.
- Bold closer on intro screen: use the NEGATION construction ("This isn't about X. It's about Y.").

### Protagonist
- Every concept and demo screen must reference a NAMED practitioner, tool creator, or expert.
- "The industry standard" or "best practices suggest" are banned — name the person who discovered/popularized the technique.

### Bold Closers
- Concept and recap screens must have bold closers that pass the Cocktail Party Test.
- Closers are INSIGHTS, not summaries ("This is why X matters" = banned).
- Prefer negation/reversal constructions.

### Resolution (Recap Screen)
- Recap connects to PRESENT MOMENT — how the technique is being used NOW, by whom.
- Gap Statement: names what separates those who use the technique from those who don't.

### Research Curation (Hands-On Adaptation)
The Research Summary is a source library, not a checklist. Include only research that supports the technique being taught. Maximum 2-3 expert citations as technique anchors. Tool features: demonstrate only what the tutorial covers, not everything the tool can do. Metrics: only metrics showing before/after improvement. The Curation Test: "If I remove this, does the tutorial break?"

### Novice-First Audience (Hands-On Adaptation)
The learner is a BEGINNER with zero prior experience. Every tool feature must be introduced as if the learner has never seen the interface. Demo steps must be granular enough for a complete beginner. MCQs test whether the novice understood WHY a technique works, not whether they memorized steps. Glossary terms are the tool's vocabulary — defined for someone who installed the tool today.

### What Is BANNED During Generation (same as Concept Sprint)
- Learning objectives, meta-commentary, motivational closings
- Hedged authority, invented framework acronyms, generic adjectives
- "You'll learn" / "You'll discover" promise hooks
- Solo numbers without contrast pairs
- Tables that summarize instead of argue
