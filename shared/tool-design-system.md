# Course Tool Design System

A **Tool** serves the user. A **Game** challenges the user. These are complementary, not competing.

---

## 5 Tool Subtypes

| # | Subtype | User action | Output | Best when the course teaches... |
|---|---------|-------------|--------|---------------------------------|
| 1 | **Self-Audit** | Rate entities across course dimensions | Score + grade + prioritized actions | A diagnostic framework with ratable dimensions |
| 2 | **Calculator** | Input quantitative parameters | Computed result + visual breakdown + benchmarks | Quantitative tradeoffs or threshold-based decisions |
| 3 | **Matcher/Picker** | Answer qualifying questions | Best-fit recommendation + rationale + alternatives | A decision framework where the right answer depends on context |
| 4 | **Builder** | Fill structured fields | Exportable deliverable (matrix, checklist, template) | A methodology that produces a concrete work product |
| 5 | **Analyzer** | Paste/input existing work | Dimension scores + improvement suggestions | Quality criteria applicable to the user's own output |

**Diversity cap:** Max 4 uses per subtype across all courses (tracked in `batch-diversity-log.md` Table 3).

---

## Subtype → Framework Type Mapping

Auto-select subtype based on the course's framework type (from Decision 3):

| Framework Type | Natural Tool Subtype | Why |
|---------------|----------------------|-----|
| Type 1 (Custom Acronym) | Builder | Each acronym stage becomes a field to fill |
| Type 2 (Established Academic) | Self-Audit | Rate the organization against each dimension |
| Type 3 (Step-by-Step) | Builder | Steps become checklist sections |
| Type 4 (Decision Matrix) | Matcher/Picker | Decision tree maps directly to qualifying questions |
| Type 5 (Threshold/Gate) | Analyzer | User pastes their work; tool scores it against thresholds |
| Type 6 (Comparative) | Self-Audit | Rate entity against comparative dimensions |
| Type 7 (Cycle) | Self-Audit | Rate each cycle phase for current state |

This is a starting recommendation. Override if the course's specific use case calls for a different subtype. The subtype should feel like the natural next question after learning the framework.

---

## 8 Design Principles

### P1 — Course Vocabulary IS the UI Vocabulary
At least 4 terms from the course must appear verbatim as input labels, dimension names, or output sections. The user should recognize these as course concepts, not generic software labels.

**Good:** "Rate your Succession Depth" (course term) → score shown on "Succession Risk" axis (course term)
**Bad:** "Rate team backup coverage" → score shown on "Risk Level"

### P2 — Personalization, Not Assessment
The tool helps the user understand THEIR situation. It does not grade them on how well they learned. There is no "correct" answer to the self-audit — only a more informed picture of the user's reality.

Never say "You scored X/10 — that's Bad." Say "Your lowest-priority area is [dimension] — here's where to start."

### P3 — Output Over Input
High ratio of output value to input effort. If the user spends 2 minutes inputting, the output should feel like 20 minutes of analysis. The tool does the interpretation — the user just provides the raw material.

- Input: rate 5 roles across 4 dimensions (2 min)
- Output: weighted score per dimension, ranked vulnerability list, 4 prioritized actions, copy-to-clipboard card (feels like a consultant's summary)

### P4 — Progressive Reveal
Multi-step flow: name/configure → rate/input → see results. Never dump all inputs on one screen.

- Step 1: Context setting (name the entities, describe the situation)
- Step 2: Rating or data entry (the work)
- Step 3: Results with interpretation and actions (the payoff)

The step count should feel like a natural conversation, not a form.

### P5 — No Server, No Secrets
Everything runs client-side. No API calls, no local storage of sensitive data, no external dependencies. The tool must work completely offline after the HTML file loads.

Display "Nothing leaves your browser" near the results section. This is a trust signal that unlocks honest input.

### P6 — Shareable Atomic Output
One moment of copy-to-clipboard shareability. The share card format:

```
[Score or grade] on [Tool Name] — [1-sentence interpretation].
Built from Rehearsal's [Layer 1 Course Title].
```

Examples:
- "3.1/5 on the Org Resilience Audit — my succession planning is my biggest vulnerability. Built from Rehearsal's The Org Chart That Survives a Bomb."
- "Attribution Calculator: Rule-Based recommended — 2 channels, medium data maturity. Built from Rehearsal's What the Last Click is Hiding."

### P7 — Dark UI, Course Accent
- Background: `#0a0a0a` (Rehearsal black)
- Surface cards: `#141414` or `#1a1a1a`
- Body text: `#e5e5e5`
- Labels: `#999999`
- Accent: course's accent color from the spec's Visual Direction section
- Inputs: dark surface, accent border on focus
- No white-passing surfaces anywhere

The tool must feel like it belongs in the same visual world as the course's game and images.

### P8 — Scrollable, Not Viewport-Locked
Tools are forms, not games. They scroll naturally.
- `max-width: 680px`, `margin: 0 auto`
- No `100dvh` constraint (that's for games)
- Each step is a full section on the page (shown/hidden via JS), not a fixed viewport section
- Mobile: comfortable reading width, large touch targets (min 44px)

---

## Technical Constraints

| Constraint | Rule |
|------------|------|
| Delivery | Single HTML file — no npm, no build step, no external API |
| Dependencies | Vanilla JS only. No React, no Vue, no GSAP (tools don't need animation sequences) |
| Fonts | System font stack or single Google Font loaded via `<link>`. No self-hosted |
| Max-width | 680px |
| Layout | Scrollable — no `100dvh` constraint |
| Mobile target | 375px minimum, comfortable at 430px |
| Privacy | No `localStorage` of sensitive data. Nothing transmitted. |
| Output | Self-contained — results fully rendered in-page + copy-to-clipboard |

---

## Output File Location

```
games/{slug}/{slug}-tool.html
```

Note: stored in `games/` directory alongside the game, but with `-tool.html` suffix to distinguish. Both are standalone HTML companion assets.

---

## Positioning

- **Default:** Tool appears after the final course screen ("now apply it" post-course)
- **Blueprint exception:** Tool may be positioned mid-course via `tool_position_after_screen` field in spec
- Tools do NOT count as screens in the JSON (same rule as games)
- If a course has BOTH a game and a tool: game comes first (learn through play), tool after (apply to your context)

---

## Reference Implementation

`games/manager-organizational-resilience-design/org-resilience-audit.html`

Self-Audit subtype. Study this file for:
- Step 1: role name inputs with placeholder text
- Step 2: per-entity rating grid across 4 course dimensions
- Step 3: live score bar, donut ring, per-dimension breakdown, round-robin priority actions
- Copy-to-clipboard share card
- Dark UI (#0a0a0a bg, #ff4859 accent)
- "Nothing leaves your browser" privacy notice
