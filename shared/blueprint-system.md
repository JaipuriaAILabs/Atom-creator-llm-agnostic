# Course Blueprint System

## Interactive Block Taxonomy

| Block Type | Count | JSON Mapping | Delivery | Notes |
|------------|-------|--------------|----------|-------|
| Game | 0-3 | No JSON block type | Standalone HTML file | Positioned via `position_after_screen` in spec. Does not count as a screen in JSON |
| Tool | 0-1 | No JSON block type | Standalone HTML file | Positioned via `tool_position_after_screen` in spec (default: after last screen). Does not count as a screen. See `shared/tool-design-system.md` |
| Interview:Retention | 0-2 | `mcq` block | Embedded in screen | Tests recall of preceding 2-3 screens |
| Interview:Applied | 0-2 | `text_question` block | Embedded in screen | Tests transfer/application. ≤60 words. Guidance with 3-5 evaluation criteria |
| Interview:Current-Affairs | 0-1 | `text_question` block | Embedded in screen | Framing 5 capstone. Real verifiable events required. ≤50 words |

**Terminology:**
- "Interactive block" = any Game, Tool, Retention, Applied, or Current-Affairs element
- "Segway bridge" = narrative transition screen (2-3 sentences) before any interactive block. Backward reference + forward setup
- "Narrative screen" = any screen that is NOT primarily an interactive block

---

## Placement Rules

1. Every interactive block requires a narrative segway bridge immediately before it (2-3 sentences, backward reference + forward setup)
2. Never place back-to-back interactive blocks (min 1 narrative screen between)
3. Min 2 narrative screens between any two interactive blocks
4. First interactive block not before screen 3
5. Max 3 interactive blocks in any 5-screen window
6. Max 40% interactive screens overall (e.g., 14 screens → max 5 interactive)
7. Interview:Current-Affairs must be the last interview (capstone position)
8. Games do not count as screens in the JSON — they are HTML files positioned between screens via `position_after_screen`
9. Interview:Retention blocks must only test content from the preceding 2-3 screens
10. Interview:Applied blocks must appear after the framework screen (tests transfer)

---

## Blueprint Generation Algorithm

### Step 1 — Map Narrative Arc

Read the Course Generation Brief from the research output. Identify:
- Emotional peaks (hook, twist, resolution)
- Natural valleys (post-explanation, post-framework)
- Content density clusters

### Step 2 — Place Required Screens

| Screen | Position Constraint |
|--------|-------------------|
| ORIENT | First (screen 1) |
| FRAMEWORK | Before midpoint |
| INTERVIEW | Last screen |

Fill remaining slots with story_bridge, apply, first_apply, resolution, and other screen types per `screen-rules.md`.

### Step 3 — Place Interactive Blocks

Insert interactive blocks at narrative valleys where justified:
1. Retention blocks → after content-dense sequences (test recall)
2. Applied blocks → after framework or resolution (test transfer)
3. Current-Affairs → last interview position (capstone)
4. Games → after framework introduction or at major arc transitions (reinforce through play)

Each block requires a 1-line justification linking it to the preceding narrative content.

### Step 4 — Validate

Run all validation rules (see [Validation Rules](#validation-rules) below). Fix any violations before proceeding.

### Step 5 — Generate ASCII Blueprint

Render the blueprint as an ASCII flow diagram with:
- Screen number, type, and interactive block columns
- Game placements listed separately (they are between screens, not screens themselves)
- 1-line justification per interactive block

---

## ASCII Blueprint Format

Present the blueprint in this exact table format:

```
┌─────────────────────────────────────┐
│ SCREEN ARCHITECTURE (14 screens)    │
├─────┬──────────────┬────────────────┤
│  #  │ Type         │ Interactive    │
├─────┼──────────────┼────────────────┤
│  1  │ orient       │                │
│  2  │ story_bridge │                │
│  3  │ first_apply  │ Retention #1   │
│  4  │ story_bridge │                │
│  5  │ framework    │                │
│  6  │ story_bridge │                │
│     │              │ → Game #1      │
│  7  │ apply        │                │
│  8  │ story_bridge │                │
│  9  │ apply        │ Retention #2   │
│ 10  │ story_bridge │                │
│ 11  │ resolution   │                │
│ 12  │ apply        │ Applied #1     │
│ 13  │ story_bridge │                │
│ 14  │ interview    │ Current-Affairs│
└─────┴──────────────┴────────────────┘

Game Placements: After Screen 6
Justifications:
- Retention #1 (Scr 3): Tests orient + first bridge comprehension
- Game #1 (after Scr 6): Framework just introduced — game reinforces
- Retention #2 (Scr 9): Tests framework application screens
- Applied #1 (Scr 12): Transfer test after resolution
- Current-Affairs (Scr 14): Capstone — real-world event + skill
```

**Format rules:**
- Game rows have no screen number (they are between screens)
- Game rows use `→` prefix in the Interactive column
- Screen count in header excludes games
- Justifications section follows the table

---

## User Tweaking Protocol

After presenting the ASCII blueprint, use AskUserQuestion to offer these options:

### Initial Prompt

Present the ASCII diagram, then ask:

> "Blueprint ready. Choose an action:"
> 1. Approve this blueprint
> 2. Move a block
> 3. Add an interactive block
> 4. Remove an interactive block

### Option Handling

| Choice | Follow-up |
|--------|-----------|
| **Approve** | Lock blueprint. Write to spec. Proceed to next phase |
| **Move a block** | Ask: "Which block?" → "New position (screen number or 'after screen N' for games)?" → Re-validate → Re-render |
| **Add a block** | Ask: "Block type? (Game / Retention / Applied / Current-Affairs)" → "Position?" → Re-validate → Re-render |
| **Remove a block** | Ask: "Which block?" → Re-validate → Re-render |

### Loop Behavior

1. After every tweak, run full validation
2. If validation fails, display the violation and ask the user to choose a different position
3. Re-render the ASCII blueprint after every successful tweak
4. Loop until user selects "Approve"

### After Approval

- Blueprint is LOCKED — no further modifications
- Write the blueprint section to the spec file under `## Course Blueprint`
- Blueprint becomes a binding contract for `:create`

---

## Validation Rules

Run after every tweak and before final approval.

| # | Rule | Check |
|---|------|-------|
| V1 | Screen count | Total screens (excluding games) must be 8-20 |
| V2 | Placement rules | All 10 placement rules above must hold |
| V3 | ORIENT position | ORIENT must be screen 1 |
| V4 | INTERVIEW position | INTERVIEW must be the last screen |
| V5 | FRAMEWORK position | FRAMEWORK must appear before the midpoint (screen N/2) |
| V6 | Narrative separation | At least 2 narrative screens between every pair of interactive blocks |
| V7 | Interactive ratio | Interactive screens ≤ 40% of total screens |
| V8 | Current-Affairs position | If present, must be the last interview (no other interview after it) |
| V9 | Segway bridges | Every screen with an interactive block must be preceded by a narrative screen |
| V10 | No back-to-back | No two consecutive screens both have interactive blocks |

### Validation Error Format

When a validation fails, report:

```
VALIDATION FAIL — V[N]: [rule name]
  Violation: [what specifically is wrong]
  Fix: [suggested correction]
```

---

## Blueprint-to-Create Handoff

When `:create` reads a spec with `## Course Blueprint`:

1. **Screen order is binding** — generate screens in the exact order specified in the blueprint table
2. **Interactive blocks are binding** — place the specified block type on the specified screen
3. **Game positions are binding** — note game placement for `:game` command (no JSON block generated)
4. **Justifications inform content** — use justifications to shape segway bridge content
5. **Screen types are advisory** — `:create` may adjust screen types (e.g., story_bridge → bridge) to match `screen-rules.md` vocabulary, but must preserve the interactive block placement

### Structural Checks (C34-C42)

`:create` must verify these checks when a blueprint is present:

| Check | Rule |
|-------|------|
| C34 | Screen count matches blueprint `Total Screens` |
| C35 | Screen type sequence matches blueprint row-by-row |
| C36 | Every interactive block has a narrative segway bridge before it |
| C37 | 2+ narrative screens between any two interactive blocks |
| C38 | Max 3 interactive blocks in any 5-screen window |
| C39 | Interview:Retention proximity — tests preceding 2-3 screens only |
| C40 | Interview:Applied guidance non-empty with framework references |
| C41 | Interview:Current-Affairs event verifiable |
| C42 | Interactive blocks ≤ 40% of total screens |

All checks are HARD GATE — fail any and the content must be corrected before proceeding.

---

## Default Mode Behavior

When a spec does NOT contain `## Course Blueprint`:
- Standard single-game, single-interview structure applies
- No blueprint validation checks (C34-C42) run
- `:create` follows existing screen-rules.md ordering constraints
- `:game` generates a single game file
- No interactive block taxonomy applies
