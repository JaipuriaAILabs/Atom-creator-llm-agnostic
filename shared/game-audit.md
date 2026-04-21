# Game Mechanics Auditor — Agent 4

Runs after game generation, NOT with content audit agents.

**Input:** Game HTML file + corresponding `design.md` + `games/GAME-DESIGN.md`

---

## Process

1. **Edge case compliance** — read the game's `design.md` and verify each mechanic-specific edge case is handled in the HTML. Common patterns to check (as applicable to the game's mechanic):
   - Budget/slider games: total < budget (helper text + disabled confirm), total > budget (red indicator + disabled), total = budget (green + enabled), all zeros (disabled), one slider at 100%, rapid slider dragging uses `allocRef` mutable ref pattern
   - Selection games: only one card selectable at a time, confirm disabled until selection, tap to deselect
   - Chain/builder games: max block count enforced, tap to add/remove, correct ordering scored with partial credit, right-blocks-wrong-order earns partial credit (not zero)
   - All games: scoring engagement gate (prevents click-through stars), state reset completeness
2. **Scoring fairness** — verify the scoring system is fair and pedagogically sound:
   - **Partial credit:** Reasonable-but-suboptimal options must award partial credit (typically 1pt). Only clearly lazy/uninformed options score 0pt. Check each option: "Could a domain professional reasonably pick this?" If yes, it needs `partial: true`.
   - **Non-monotonic curve:** Not every round should reward the same strategy direction. At least one round should include a trap where "more of the obvious strategy" backfires (e.g., over-decomposition, over-diversification).
   - **Star thresholds:** Calculate the scoring floor (worst possible score with partial credit active) and verify the 2★ threshold sits above it. The "always same strategy" archetype (player who picks consistently in one direction) should land at 2★, not 1★.
   - **Chain scoring edge cases:** If the game has ordering mechanics, verify that selecting all correct items in wrong order earns partial credit (content match) rather than zero (position match only).
2b. **Scoring achievability** — verify the game's star thresholds are achievable:
   - **All-paths enumeration:** For games with discrete choices, enumerate all possible paths through the game. Calculate the score for each path. Identify the maximum achievable score.
   - **Star reachability:** Verify that: (a) 3★ threshold ≤ maximum achievable score, (b) at least 2 distinct paths reach 3★, (c) random play scores 1★, (d) `maxPts` display matches actual maximum.
   - **Adjacency/connection verification:** If the game uses skill overlap, attribute matching, or any computed relationship: manually verify at least 3 critical pairs by checking the code's matching function against the data. Design doc adjacency claims are NOT trustworthy — the code is the source of truth.
   - **Design-code mismatch:** If the design.md claims "X is adjacent to Y" but the code's adjacency function says otherwise, flag as HARD FAIL. The design and code must agree on all game-mechanical relationships.
3. **Option naming & hint quality** — verify options and hints don't leak the answer:
   - **Neutral labels:** Read all option labels without descriptions. If you can guess which is correct from names alone, they're not neutral. Bad: "One Prompt", "Quick Pass". Good: "Direct Brief", "Full Sweep".
   - **Card metadata badges (CRITICAL):** Inspect ALL text displayed on interactive cards before selection — not just the option name. Any badges, tags, indicators, or supplementary labels that reveal answer-relevant information (e.g., "2x ADJACENT", "ISOLATED", "REPEAT", "OPTIMAL", connection counts, score previews) are a HARD FAIL. The only allowed pre-selection text: assignment/option name, role description, and flavor text unrelated to scoring logic. Answer-relevant information (adjacency, scoring, optimality) belongs ONLY on reveal screens AFTER the player has committed their choice.
   - **Hint content:** Per-round hints must describe the mechanic ("Each approach structures the work at a different granularity") not the strategy ("More structure is not always better"). Hints must not reveal the pedagogical lesson.
   - **Choice-specific feedback:** Every non-optimal outcome must have a `quality` field explaining WHY that specific choice was suboptimal. Reveal screens should show the per-choice quality note, not just a generic insight.
4. **Progressive disclosure** — verify round structure matches the spec's Game Concept section:
   - Standard 3-round: Gut (scenario only) → History (data layer added) → Playbook (framework revealed)
   - 4+ round games: verify each round adds exactly one complexity layer AND that the spec-defined learning arc is preserved (e.g., a Round 4 discrimination test where the "obvious" strategy fails)
   - Core rule: each round must feel meaningfully different — avoid "same mechanic, fewer picks"
   - **Design-vs-implementation check:** Compare the design.md's described UI (e.g., "connection lines on the portfolio board") against the actual HTML rendering. If the design says information appears on an element (board, sidebar) but the implementation puts it on the interactive cards instead, flag as spec-implementation mismatch
   - **Design-vs-principles meta-check:** Even if the design.md explicitly specifies a UI element, verify it doesn't violate game design principles #1 ("Don't explain upfront") or #4 ("Teach through play"). A flawed design doc can pass through to implementation — the audit must catch it at this level too
5. **Design principle compliance** — check against 5 shared principles from `GAME-DESIGN.md`:
   - Elegance through restraint (color earned, not decorative)
   - Teach through play (gap before label)
   - Progressive disclosure (one layer per round)
   - Strategic not frantic (no timers)
   - Don't explain lesson upfront
6. **Visual identity compliance** — verify game palette matches the course's visual direction:
   - Game accent color must match the course spec's accent color
   - Background color family must align with course visuals. White-passing backgrounds (cream, off-white, hex where R,G,B all exceed #E0) are allowed **only** when the game's shell has visible boundaries (border, box-shadow, max-width container) that separate it from parent page context. Arcade Pop aesthetic family uses cream #FFF4D6 with 2px dark borders + box-shadow — ACCEPTABLE. Bare white games with no shell = FAIL (they blend into the website).
   - Typography should feel cohesive with the course visual identity
   - No ungrounded glows or gradients — glows must serve a declared aesthetic family (Sci-Fi Matrix: matrix-green neon glows are the signature). Glows WITHOUT a declared family rationale = FAIL ("AI purple glow for no reason" anti-pattern still banned). Taste-skill anti-cliché rules apply to purely decorative gradients.
   - Declared aesthetic family must be specified in `design.md` metadata header. Valid values: `Arcade Pop`, `Sci-Fi Matrix`, `Editorial Mono`, `Keynote Vitrine`, `WhatsApp Mockup`, or `NOVEL: {context}` (for native-UI-mockup pattern per v10.15.0 rule — `{context}` names the real-world UI being mocked, e.g., `NOVEL: email inbox`, `NOVEL: Slack DM`, `NOVEL: filing cabinet`). Missing declaration = FAIL.
   - WhatsApp Mockup family: verify message bubble colors (incoming #FFFFFF with 1px #E5E5E5 border, outgoing #DCF8C6), typing indicator present, loss states render as fading presence/last-seen timestamps (never coral/red alarm colors). Chat background must be doodle wallpaper on #ECE5DD cream, not pure white. Font stack must be system-ui (`-apple-system`, `Segoe UI`, `Helvetica Neue`, etc.) — Manrope/Orbitron/Archivo Black in a WhatsApp Mockup game is a hard FAIL (wrong aesthetic neighborhood).
7. **Viewport-fit compliance** — every screen must fit within `100dvh` without scrolling:
   - Shell Pattern: 3-part flex column (Hdr flexShrink:0, Mid flex:1, Bot flexShrink:0)
   - `minHeight:0` on all Mid/flex:1 content containers (REQUIRED — flex items default to `min-height: auto`, preventing shrink below content height)
   - `overflowY:'auto'` on Mid content area (REQUIRED — safety net that scrolls excess content instead of clipping or overlapping Bot)
   - `overflow:'hidden'` on Mid is a VIOLATION — clips content silently on small screens, causing button superimposition
   - Progressive Content Compression: R1 full cards, R2 compact banners, R3 ultra-compact inline
   - No same component height across all rounds — R3 must be more compact than R1
   - No horizontal overflow at 375px. Inspect all `display:'flex'` rows — if children can exceed container width, `flexWrap:'wrap'` must be present.
8. **Color discipline** — monochrome base + exactly one accent color:
   - No traffic-light UX (never red + green + blue simultaneously)
   - Correct = accent color, wrong = absence of color (muted gray)
   - Sliders: gray track, dark thumb, never colored gradients
   - Result cards: same white/gray treatment; score badge is the only differentiator
9. **Classification/matrix compliance** (if applicable) — for tap-to-select grid games:
   - Tap-to-select, not drag-and-drop
   - Grid cells monochrome until selected, accent fill on selection
   - Compact grid: max 240px wide, 8-10px padding per cell
   - Results: correct cell = accent, wrong cell = dashed gray border
10. **Mobile playability** — verify **430px** design viewport (primary target; iPhone SE at 375px still works via flexible shell). Touch-primary interaction, no hover-dependent mechanics. All text ≥ 11px. Scan all `fontSize` declarations — any value below 11 is a FAIL.
11. **Desktop containment** — verify `max-width: 430px; margin: 0 auto` on body or root element. Content must not stretch across wide screens.
12. **Text density** — verify minimal text approach:
   - No "Next: ..." teasers on reveal screens (the Continue button is sufficient navigation)
   - No paragraph-length explanations on game screens
   - Result quality notes max 1 sentence
   - Hint text on plan screens max 1 sentence or absent
   - No "how scoring works" blocks on result screens
   - No **unintentional** dead space that pushes content off-viewport. Interaction screens typically use `justifyContent:'flex-start'`. Deliberate vertical centering is allowed when (a) content comfortably fits within viewport AND (b) the design.md explicitly calls it out (e.g., single-card centered stage in Rapid Classify Swipe games). Unjustified `justifyContent:'center'` that causes button clipping on 568px viewports = FAIL.
13. **Review checklist** — run through the Game Review Checklist in `GAME-DESIGN.md`
14. **Experiential quality (HARD GATE)** — verify the game feels like a game, not a quiz:
    - **Continuous visual response:** At least one interaction type beyond tap-to-select exists in the game (slider, drag-to-rank, spatial placement, sequence building). If every round is "tap one of N options," this FAILS.
    - **Triple tap feedback:** Every tappable element produces: (a) GSAP scale animation (elastic or back easing), (b) Web Audio tone, (c) visual state change beyond border color (shadow, fill, floating text). Inspect the tap/click handlers — all three must be present.
    - **Animated reveal sequences:** Result/reveal screens use staggered animations (gsap.fromTo with stagger parameter, or sequential timeline). If results appear as a single static render, this FAILS.
    - **State accumulation:** At least one visual element persists from a previous round into the current round (ghost markers, running score bar, annotated items, accumulated artifacts). If each round renders from scratch with no trace of prior rounds, this FAILS.
    - **Resource constraint OR round mechanical variety:** The game has EITHER a resource constraint (limited picks, budget, slots forcing trade-offs) OR at least one round that uses a physically different interaction from the others (different gesture — drag vs tap, slide vs select — not just different text on the same tap-to-select cards). A different visual layout of the same tap-to-select pattern does NOT count. Drag-to-rank in single-file HTML counts as FAIL unless using document-level event handlers. Tap-based reordering with animated swaps is the preferred alternative.

    **Tool Simulation variant (mechanic #8):** For Tool Simulation games, the 5 checks adapt as follows:
    - Check 1 (Continuous visual response): PASS if the tool interface responds in real-time to configuration changes (settings toggle, parameter slides)
    - Check 2 (Triple feedback): Same — every tap on a setting must produce scale + sound + visual state change
    - Check 3 (Animated consequence): PASS if the tool "runs" with animated output showing the player's configuration in action (the execution phase IS the reveal)
    - Check 4 (State accumulation): PASS if configuration state carries across rounds (Round 2 starts with Round 1's settings visible)
    - Check 5 (Resource constraint / variety): PASS if Round 3 uses a different interaction (troubleshooting/diagnosis vs configuration)

    **6th sub-check (SOFT — recommend, don't block): Reflect phase present.** Between play and win, a `phase='reflect'` screen exists that: (a) shows a terminal-style typewriter of 4–6 lines, (b) includes one *tailored* line based on a performance signal (misses / catches / streak / etc.), (c) allows tap-to-advance AND auto-advances at 8s if untapped, (d) has NO confetti or score number (those belong to Win — Reflect is quiet synthesis). Games < 30s or with < 4 rounds may skip Reflect; flag as "consider adding" but don't block.

    **Scoring:** Must pass ≥ 3 of the first 5 checks. If < 3 pass: HARD GATE FAILURE — recommend full game redesign using the Reusable Game Mechanics in GAME-DESIGN.md. Do not attempt to patch a quiz into a game.

15. **Visual polish compliance (SOFT GATE)** — verify premium feel per GAME-DESIGN.md "Visual Polish Compliance" checklist:
    - Perpetual micro-animations (buttons breathe, dots pulse, slots glow)
    - Active press states on all interactives (scale 0.97)
    - Dark-inversion selection contrast (not border-only)
    - Outcome emotional hierarchy (good wash vs bad left-border)
    - Score ceremony (count-up, staggered bars, elastic stars)
    - SVG precision (no Unicode marks or stars)

    **Scoring:** 6/6 PASS. 4-5/6 PASS with notes. 0-3/6 SOFT GATE — recommend polish pass, do NOT block output.

16. **Flex row containment audit** — inspect every `display:'flex', flexDirection:'row'` container. If children have dynamic content (text, badges, tags), verify `flexWrap:'wrap'` is present. FAIL if any row can overflow at 375px viewport width.
18. **Text-shape containment & label readability** — inspect all text placed inside SVG shapes (circles, rectangles) or constrained HTML containers (pills, badges):
   - **Containment math:** For each label+container pair, calculate `maxChars = (containerWidth - 12) / charWidth`. At Space Mono fontSize 8, charWidth ≈ 4.8px. Any label exceeding maxChars = FAIL.
   - **No non-word truncations:** Every displayed label must be a real English word or standard abbreviation. ACADEM, STRTGY, SECUR, FLD = FAIL. RESEARCH, STRATEGY, SECURITY, COORD = PASS.
   - **Context-appropriate labels:** If a `short` label is used inside a badge or breakdown (where space allows full words), flag it. Circle labels may be abbreviated; badges and breakdown rows should use readable names.
   - **Padding floor:** Minimum 6px between text edge and shape edge. Text touching the boundary = FAIL.
17. **String safety audit** — scan all single-quoted string literals for unescaped ASCII apostrophes in English contractions (`doesn't`, `can't`, `wasn't`). Each must use `\'` or curly apostrophe `'` (U+2019). Unescaped `'` inside `'...'` = syntax error = blank screen. FAIL if any found.
19. **`gsap.fromTo` compliance (HARD)** — scan the HTML for any `gsap.from(` call. Rule 7.1 from the `/game-design` skill: `gsap.from()` with opacity leaves elements permanently invisible if the component re-renders during the animation. Every entry animation must use `gsap.fromTo(el, {startState}, {endState})`. FAIL if any bare `gsap.from(` exists.
20. **DOM-reuse transform reset (HARD)** — for any component that is keyed to a changing state value (e.g., `useEffect(()=>{...},[pos])` firing on card advance) AND uses GSAP for entry animations, verify that `gsap.set(ref.current, {x:0, opacity:1, rotation:0, ...})` (or equivalent reset) is called BEFORE the entry `gsap.fromTo`. Preact/React reuse DOM nodes across state changes — exit-animation transforms (`x:600, opacity:0, rotation:20`) persist onto the next card unless explicitly reset. Missing reset = blank card between turns = FAIL.
21. **Surgical click targets (HARD)** — every `onClick` / `onPointerUp` handler must be attached to a specific interactive affordance (button, chip, distinct tappable card), NOT to a container div that holds multiple visual children. Full-div `onClick` on a screen/panel container that has text + other elements = phantom-click bug (stray events leak in during transitions). FAIL if any screen-level or panel-level div has `onClick=${...}` handler that calls a state-advancing function. Acceptable: `<div class="reflect">` has no onClick; `<div class="reflect-tap" onClick=${onContinue}>` does.
22. **Reflect phase present (SOFT — recommend)** — see Check 14 sub-check 6. Pattern: terminal-style `> prompt.name` with blinking cursor + 4-6 lines staggered fade-in + one tailored line driven by a performance signal + `tap ▸ auto-advance 8s` chip that appears at ~2.8s + auto-advance at 8s. NO confetti/score-number on Reflect (those belong to Win).
23. **AI honest calibration (HARD, classification games only)** — applies to games where the scoring rubric classifies data points along an AI-capability axis (machine-vs-human, good-vs-bad AI output, routine-vs-judgment, etc.). Every data row must pass the audit question: *"Would a frontier AI (Claude 3.7, GPT-4 class) actually struggle with this task as worded, under the current legal/ethical frame?"* If the honest answer is "no, AI can do this" but the data marks it as HUMAN, flag as an over-claim. Bias trigger: if >80% of rows within a single job category are marked HUMAN, review that category for emotional over-claiming. Over-claiming HUMAN teaches overconfidence — the game's whole inversion lesson depends on the data being honest about what AI can do. FAIL if any data point cites "human judgment" for a task that is actually codifiable (e.g., "grade multiple-choice tests = human", "keyword CV screen = human"). Hedge-words ("novel", "ambiguous", "contextual") are fine if they reflect genuine task variance, not cover for over-claiming.
24. **Scoring substrate declaration (SOFT)** — in the game's `design.md`, verify there is a line declaring one of:
    - `Scoring substrate: evergreen logic` — scoring relies on pure logic (e.g., internal contradictions, math correctness, sequence correctness). No recalibration needed as AI capabilities advance.
    - `Scoring substrate: AI-capability classification` — scoring depends on claims about what AI can do. Flag in design.md as "requires annual recalibration" and re-audit Check 23 each year.
    Missing declaration = WARN; does not block.

25. **Mechanic alignment (HARD, v10.13.0)** — verify the built game's mechanic matches the declared mechanic in both `design.md` AND the source spec at `courses/specs/{slug}-spec.md`.
    - **Step 1:** grep `design.md` for `Mechanic:` or `**Mechanic family:**` — extract the value.
    - **Step 2:** grep the spec for `## Game Concept` section's `Mechanic:` or `**Mechanic:**` field — extract the value.
    - **Step 3:** verify both values map to the same canonical family via the 10-family vocabulary in `shared/decision-tables.md` Decision 15 (Allocation, Matrix Placement, Multi-Round Strategy, Progressive Reveal, Signal Detection, Dialogue Tree, Portfolio Builder, Slider Balance, Contradiction Hunt, Rapid Classify Swipe — plus Build-and-Watch Execution and Tool Simulation as extensions).
    - **Step 4:** inspect the HTML. Does the built game actually implement the declared mechanic? Reference clues:
      - Allocation / Portfolio Builder / Slider Balance → continuous `<input type="range">` elements, each scoring-relevant, with budget guard.
      - Matrix Placement → 2x2 grid with tap-to-select or drag-to-place, with selection state visible mid-round.
      - Multi-Round Strategy → DISTINCT interaction gestures per round, NOT three labeled radio-buttons repeated with different copy.
      - Progressive Reveal → sequential card-flip mechanic with information-cost tension.
      - Rapid Classify Swipe → single-gesture-per-card swipe with decision latency tracking.
      - Dialogue Tree → branching choice with state propagation across nodes.
      - Contradiction Hunt → highlight-evidence interaction over a corpus.
    - **FAIL if:** spec and design.md disagree on mechanic, OR the HTML implements a different mechanic than the one declared. A "Multi-Round Strategy" label attached to three radio buttons per round is a disguised quiz and FAILS.
    - **Why this check exists:** the 2026-04-17 brand-extension session shipped a three-radio-button-per-round game while the spec declared Matrix Placement (quadrant sort). Nothing caught the mismatch because the pipeline trusted the generator's self-declaration. This check triangulates across spec, design.md, and HTML.

26. **Course-content replay prevention (HARD, v10.14.0)** — verify the game's round data does NOT reuse brand/company/case names from the course MD.
    - **Step 1:** Extract proper-noun brand/company names from the course MD's case sections (Screens 1-5 for CS; Concept/Demo screens for HO). Heuristic: match capitalised multi-word phrases preceded by narrative framing ("Toyota...", "the Apple case...", "Mercedes launched...").
    - **Step 2:** Extract brand/company names from the game HTML's round data (typically in CASES object / ROUNDS array / scenario cards).
    - **Step 3:** Compute intersection.
    - **FAIL if:** any overlap ≥1. The game is testing recall of the course, not transfer of the skill.
    - **Fix:** regenerate round data with fictional brand archetypes or real brands not mentioned in this course. Each case must exercise the same framework quadrant/decision but with names the player has not seen in the course content.
    - **Why this check exists:** 2026-04-17 brand-extension session shipped a game reusing all five course cases (Apple, Mercedes, Tata, Armani, Hyundai). Player feedback: *"the course content may not be repeated in the game. What's important is the idea and learning outcome."* This check operationalises that rule.

27. **Aesthetic differentiation from reference (SOFT WARN → HARD on close reskin, v10.14.0)** — if the game declares a documented aesthetic family (Arcade Pop / Sci-Fi Matrix / Editorial Mono / Keynote Vitrine), verify it changes ≥4 of 5 dimensions vs the family's reference game:
    - (1) Typography family (display font name)
    - (2) Shadow style (hard-offset vs soft-glow vs neon vs none)
    - (3) Texture overlay (diagonal hatch vs grid vs vignette vs noise vs none)
    - (4) Accent-color application (fill vs rim-light vs neon glow vs stroke-only)
    - (5) Border treatment (2px ink vs 1px hairline vs no-border)
    - **Procedure:** extract the game's CSS variables + background patterns + border rules + font-family declarations. Compare against the family reference game's CSS. Count changed dimensions.
    - **FAIL if:** <3 dimensions changed (clear reskin). Example failure: swapping only the accent hex while keeping all other visual treatments = 1 dimension changed = FAIL.
    - **WARN if:** exactly 3 dimensions changed (borderline).
    - **PASS if:** ≥4 dimensions changed (genuine variation within family).
    - **Why this check exists:** same 2026-04-17 session swapped THE GEM's coral for indigo while retaining constructivist shadows, hatch texture, and Archivo Black typography. User flagged immediately: *"each game should have its own aesthetic style."*

28. **Reflect-phase visual density (HARD, v10.14.0)** — if the game has a `phase='reflect'` screen between play and win, each per-round row MUST include a visual element alongside (or in place of) the text insight.
    - **Allowed visuals per row:** mini 2×2 or 3×3 matrix (showing player's pick vs correct pick spatially), dual-bar comparison (player vs optimal), sparkline/gauge, icon + level meter, color-coded outcome delta.
    - **Insight copy per row:** ≤6 words. Brand name + one emphasised noun is the target. Sentences are forbidden — if the copy exceeds 6 words, it's prose.
    - **Tailored synthesis line at bottom:** ≤8 words.
    - **FAIL if:** (a) any reflect row is prose-only with no visual element, (b) any row's insight copy exceeds 10 words, (c) the tailored line exceeds 12 words.
    - **Why this check exists:** 2026-04-17 brand-extension reflect screen used 3 prose rows with italic-emphasis sentences. User feedback: *"too text heavy and difficult to read."* Fix: mini-matrix per row + 3-5 word insight = visual spatial representation beats prose.

29. **7-gate checklist present and substantive (HARD, v10.13.0)** — verify `design.md` contains a section with the exact heading `## 7-Gate Zero-Shot Checklist` (or close variants: `## 7-Gate Design Checklist`, `## Seven-Gate Checklist`).
    - **Step 1:** grep for the heading. Missing = FAIL.
    - **Step 2:** extract content between this heading and the next `##` heading (or EOF). Count characters after stripping whitespace.
    - **Step 3:** verify ≥600 characters of content AND that all seven gates are addressed by name or number. Gates:
      1. No dominant strategy
      2. Weaponized common sense
      3. Clear causation on failure
      4. Win condition binary and honest
      5. Uncertainty forces hedging
      6. Replay reveals strategy space
      7. MDA chain integrity
    - **Step 4:** for each gate, verify content is not boilerplate (e.g., "N/A", "see above", or verbatim restatement of the gate name). ≥2 substantive sentences per gate.
    - **Step 5 (meta-check):** read gate 1's content. Does it enumerate the pure strategies and explain which scenarios each wins/loses? Read gate 2. Does it name the naive move AND the round that punishes it? Shallow answers fail even if word count is met.
    - **FAIL if:** heading missing, content <600 chars, any gate unaddressed, or content is boilerplate.
    - **Why this check exists:** the command file has said "write the 7 gates in design.md, auditors will check" since v10.12.0. No auditor actually checked. This turns the contract into enforcement and mirrors guard-game-generation.sh Gate 4.

30. **Pedagogical depth compliance (HARD, v10.15.0)** — verify the spec's declared depth actually landed in the HTML. Games with too few rounds / single-interaction rounds / no cross-round compounding / no transfer test produce shallow experiences that fail to teach.
    - **Round count ≥ 4:** count distinct `round` / `phase` state values (or equivalent scene markers) in the HTML. Fewer than 4 = FAIL. Standalone intro/reflect/win screens do not count as rounds.
    - **Turns per round 2–4:** for each round, count the number of DISTINCT decision points (buyer message + player reply = 1 turn; back-and-forth of 2 messages + 2 replies = 2 turns). If the average across rounds is < 2, FAIL (single-interaction rounds). If > 4 in any round, WARN (pacing risk).
    - **Cross-round state compounding:** grep the HTML for state references like `roundOutcomes[0]`, `prevRoundWon`, `previousRound.outcome`, or equivalent. At least ONE later round must read from an earlier round's outcome to shape its opening state (buyer temperature, resource budget, difficulty). If no cross-round reads exist, FAIL — the rounds are independent and the game lacks compounding.
    - **Weaponized common sense at strategic layer:** read the design.md's Round-by-Round Design section. Verify that the naive move (the option that feels obvious to the player on their first attempt) WINS Round 1 but LOSES in a later round (typically R2 or R3). If the naive move loses in Round 1, the game is teaching tactically, not strategically — FAIL.
    - **Transfer test in final round:** the last round must feature a buyer, scenario, or context NOT named or described in the course MD. Grep the HTML's final-round content against the course MD's named entities. If every entity in the final round also appears in the course, the final round is recall, not transfer — FAIL.
    - **Anticipation mechanics present:** the HTML must implement at least 2 of: typing indicators (setTimeout or GSAP tween showing buyer "typing…"), fading presence (`last seen X mins ago` status with time-based progression), missed-call or cross-thread notifications, group-chat spillover, unpredictable delay on buyer replies. Games without anticipation mechanics feel like multiple-choice quizzes regardless of aesthetic — FAIL.
    - **FAIL if:** round count < 4, OR avg turns/round < 2, OR no cross-round state reads, OR naive move loses in R1, OR final round uses only course-named entities, OR < 2 anticipation mechanics implemented.
    - **Why this check exists:** Forward Deployed v1 shipped as 3 rounds × 1 interaction each, with no cross-round state, no transfer test, and no anticipation. User verdict: *"The game is too short. There's no learning curve or discovery and anticipation that the user experiences. Its poor. did you check the game philosophy and design using /atom-creator:game"* (2026-04-19). Check 30 makes this failure pipeline-impossible.

31. **Forced-state disambiguation (HARD when budget/resource constraint exists — v10.19.0)** — when a game has a finite resource constraint (budget slots, currency, energy, picks), any round where the player's chosen move exhausts the constraint and the game silently substitutes a fallback action MUST render the fallback as visually distinct and label it explicitly.
    - **Applies when:** design.md declares a "budget" / "resource" / "limited picks" / "slots" mechanic that can be exhausted before the final round.
    - **Check 31a — visual disambiguation:** when budget hits 0 and the player picks the gated option, the UI must NOT silently convert to the default fallback. The fallback state must have a visually distinct treatment — e.g., dashed border instead of solid, different shadow color, "FORCED" prefix on the outcome title.
    - **Check 31b — first-word lead honesty:** the outcome text's first word must declare the forced state, not the result of the fallback. Pass: `"FORCED BLOCK — NO LICENSE SLOTS LEFT."` Fail: `"CORRECT."` (hides the forced state) OR `"BLOCK."` (treats it as a clean choice).
    - **Check 31c — score honesty:** the forced round must still count against the player's score (0 pts or partial per scoring rules). No "free pass" scoring for forced moves.
    - **FAIL if:** budget-constraint game lacks visual disambiguation for forced fallback OR the outcome text hides the forced state OR the scoring rewards the fallback as a clean choice.
    - **Why this check exists:** `founder-agent-readiness` Three-Door Game (2026-04-20) established this pattern. Budget = 2 license slots over 5 rounds. When player picks License on a round with 0 slots left, the round renders "FORCED BLOCK" with dashed coral-shadow box (not solid), and the reveal text leads with "FORCED BLOCK — NO LICENSE SLOTS LEFT". Without this treatment, the player sees a sanitized fallback and misses the pedagogical moment of "I ran out because I spent too early" — which IS the teaching. Preserves 7-gate Gate 4 (binary + honest).

32. **Persistent mute toggle (HARD when audio exists — v10.19.0)** — every game with a music loop or SFX must ship a mute toggle persisted to localStorage.
    - **Storage key convention:** `{slug}-game-muted` = `'0'` | `'1'`. Default unmuted.
    - **Toggle placement:** typically top-right of header, always accessible (not hidden in a settings menu).
    - **Persistence behavior:** on game load, read localStorage FIRST, apply to module-level `MUTED` flag BEFORE any audio initialization. On toggle, write localStorage AND update flag AND stop any active music.
    - **FAIL if:** game has audio but no toggle OR toggle exists but state does not persist across reloads OR state is stored in React/Preact state without localStorage sync.
    - **Why this check exists:** `founder-agent-readiness` Three-Door Game (2026-04-20) first implemented this pattern. Users who replay a game and don't want audio every time shouldn't have to re-mute. Memory-of-preference is table stakes for games, not a premium feature.

33. **Visual-game color continuity (HARD when course framework has color-coded states — v10.19.0)** — when a course framework screen renders its states in specific brand/semantic colors (e.g., Screen 8 of founder-agent-readiness shows three doors in Coral/Gold/Cloudflare-Orange for Block/License/Price), the game's state colors MUST mirror the same mapping exactly.
    - **Check 33a — color-state map matches:** if the course visual shows State X in Color A, the game must use Color A for State X's UI. No swapping.
    - **Check 33b — apply across all state surfaces:** status bar chips, outcome cards, door buttons, result chips — every surface that signals state must use the framework's color mapping.
    - **FAIL if:** visual-N.png shows the framework in one color map and the game uses a different color map for the same states.
    - **Why this check exists:** `founder-agent-readiness` shipped with Screen 8 = coral Block / gold License / orange Price AND the Three-Door Game using exact same mapping. The reader's mental model is unified: seeing "coral" = Block both times. If the game used coral for License instead, the player's recall of the framework would fragment. Rule: the game is an interactive extension of the visuals, not an independent design surface.

31. **Tonal register compliance (HARD, v10.15.0)** — verify game dialogue is parseable by a novice learner without a jargon glossary.
    - **Sample:** extract 5 random buyer messages (incoming bubbles), 5 random correct-answer chips (player options flagged `kind: "strong"` or `kind: "clean"`), all system messages, all reflect-phase copy, and the intro/win screen meta text. Exclude wrong-answer chips (`kind: "weak"`, `kind: "loss"`, `kind: "marginal"`) — they are exempt (see below).
    - **Layer A — Native-medium cadence:** the sampled dialogue must match the game's declared aesthetic family's communication medium. WhatsApp Mockup games must use contractions (`don't`, `can't`, `I'm`), em-dashes for asides, lowercase where natural, sentence-case capitalisation at most. Email-native games can be more formal. FAIL if buyer messages sound like formal memos in a WhatsApp mockup, or vice versa.
    - **Layer B — Jargon ban:** scan for banned corporate jargon with no novice translation: `leadership sync`, `sync up` (as verb), `circle back`, `vertical` (as industry synonym), `transfer argument`, `bootcamp intro`, `last-mile cold-chain`, `go-to-market`, `synergy`, `deep-dive` (as verb), `ideate`, `operationalize`. FAIL if any occur in buyer messages, correct-answer chips, or meta copy.
    - **Layer C — Real B2B vocabulary preserved:** verify that essential domain vocabulary (pilot, procurement, CFO, board, proposal, ROI, PO, scope, enterprise) still appears where course-relevant. These are words novices need to learn by exposure — stripping them for plainness over-simplifies. FAIL if the dialogue is so simple it reads as a children's book (no real B2B anchors at all).
    - **Layer D — Staccato ban:** check for 3-fragment chains like `"Five buyers. Sixteen turns. Deploy before they understand."` in meta copy. If any intro/subtitle/CTA uses ≥3 consecutive period-terminated fragments ≤6 words each, FAIL — that's ad-copy cadence, not conversational.
    - **Wrong-answer chips EXEMPT:** chips flagged `kind: "weak"` / `kind: "loss"` / `kind: "marginal"` / `kind: "roi"` / `kind: "framework"` etc. are the bad-selling pedagogical signal. Their corporate jargon IS the lesson surface. Do NOT flag jargon in these options — it's intentional.
    - **FAIL if:** any of Layer A/B/C/D failures occur in the non-exempt sample.
    - **Why this check exists:** Forward Deployed v3 pre-tonal-pass had buyer dialogue like *"Your approach came up in our leadership sync"* and *"We run last-mile cold-chain for 14 hospitals."* User feedback (2026-04-19): *"Not just jargon ...things like 'leadership sync'---> Too stoccato"* and *"last-mile cold-chain --> rather use something like pilot which is a real term in B2B and easy to follow."* 20 surgical edits fixed it. Check 31 makes this inspection automatic.

32. **Pure-strategy simulation — weaponized common sense verification (v10.16.0 HARD GATE)**
    - **Purpose:** verify that the naive first move the player would instinctively pick WINS in an early round and LOSES in a later round via compounding consequence. If pure-accept / pure-pushback / pure-hedge strategies all cap below 3★, the weaponized common sense is properly calibrated.
    - **Procedure:**
      1. Read the scoring logic in the game HTML — identify scoring deltas per chip per round.
      2. For each round, enumerate pure strategies:
         - **Pure-accept**: always pick the chip tagged `correct: false` with `kind: 'win'` or `kind: 'loss'` that defers to manager/NPC authority
         - **Pure-pushback**: always pick the chip that challenges / escalates / burns capital
         - **Pure-hedge**: always pick the compromise / middle-ground chip
      3. Simulate total score for each pure strategy across all rounds using the actual outcome deltas from the HTML.
      4. Compare totals to star thresholds (design.md §9 or equivalent):
         - 3★ threshold (e.g., 5/6 or higher)
         - 2★ threshold
         - 1★ threshold
    - **HARD FAIL if:**
      - Any pure strategy reaches 3★ (there IS a dominant strategy — weaponized common sense is broken)
      - Pure-accept reaches 2★ AND the design claims R1 accept should be a "feel-good win that traps in R2" (the compound trap doesn't actually punish — R2 consequences aren't biting)
    - **Example — 2026-04-19 TalentGrid first audit:**
      - Initial design claimed pure-accept → 1/6 points total. Agent 4 simulation found pure-accept → 4/6 points because R3 "Name the artifact" chip only gated on `pushbackBudget <= 0` (never depleted by accept chips). Pure-accept player reached R3 with full budget and scored 2pts there → 2★ total.
      - Fix: add `correctPushbacks < 1` gate on R3 artifact chip ("no standing to challenge system"). Pure-accept capped at 1★.
    - **Why this check exists:** catches the "weaponized common sense that isn't weaponized" failure mode (see `/game-design-theory` §12.4). Without this check, a designer can WRITE that the naive move loses, but the SCORING logic may still reward it. The simulation is the only objective verification.
    - **Auditor procedure:** read HTML scripts, extract `correctPushbacksDelta` / equivalent scoring fields per chip, run arithmetic simulation for the 3 pure paths. Report each path's total and the star tier it reaches. HARD FAIL if any path reaches 3★; SOFT WARN if pure-accept reaches 2★ in a game with compound-trap pedagogy.

## Output

Per-edge-case PASS/FAIL with code location references.

## Handling

- **Single pass — no retry loop**
- If >3 individual failures, recommend full game regeneration rather than patching
- All failures surface as a fix checklist for user review
- User approves before any game HTML modifications

**HARD GATE:** Output summary does NOT run until Agent 4 returns PASS.

Experiential quality gate (item 14) is a separate HARD GATE. Even if all structural checks pass, a game that fails experiential quality must be redesigned.
