# Visual Polish Standards — Generation Reference

> Loaded during game generation (Step 4) only. NOT loaded during audit.
> Audit uses the compact checklist in `games/GAME-DESIGN.md` → "Visual Polish Compliance".

---

## Perpetual Micro-Animations

CSS keyframe recipes for MOTION_INTENSITY level 6:

- **`breathe`** — CTA buttons: `scale` transitions `1 → 1.012` over `3s ease-in-out infinite`
- **`dotPulse`** — Active progress dots: `scale` + `opacity` pulse, `1.5s ease-in-out infinite`
- **`slotGlow`** — Empty slots: `box-shadow` with accent color at 12% opacity, `2s ease-in-out infinite`

**Rules:**
- Kill all animations on `:disabled` and `:active` states
- GPU-safe properties ONLY: `transform`, `opacity`, `box-shadow` — never `top`/`left`/`width`/`height`

## Active Press States

CSS class recipes — MUST be in `<style>` block (`:active` pseudo-class cannot be applied inline):

- `.card-game:active { transform: scale(0.97) !important; }`
- `.btn-game:active:not(:disabled) { animation: none !important; transform: scale(0.97) !important; }`

Every tappable element must have a visible press response. The `!important` ensures specificity over inline GSAP transforms.

## Selection State Contrast

Dark inversion pattern for selected cards:

- **Selected:** dark background + light text + elevated shadow (`0 6px 16px rgba(0,0,0,0.15)`)
- **Non-selected:** surface color + minimal shadow
- **Letter badges:** invert to accent background color on selection
- **No `#000000`** — use course dark token (e.g., `#3D2B1F` for warm courses, `#1a1a2e` for cool)
- **Transition:** `0.15s ease` on `background-color`, `color`, `box-shadow`

## Outcome Emotional Hierarchy

Three distinct visual temperatures for result states:

- **Good outcome:** `radial-gradient(circle, rgba(accent, 0.10) 0%, transparent 70%)` wash behind score number — subtle halo, not glow
- **Bad outcome:** `border-left: 3px solid #EF4444` accent on quality warning panel
- **Zero/neutral:** no accent treatment — gray muted state

Never use traffic-light (red + green) simultaneously. Good = accent color presence. Bad = accent absence + left-border warning.

## Score Ceremony

GSAP animation sequence for final score reveal:

1. **Container entrance:** `back.out(1.5)` spring easing
2. **Score number:** animate from 0 → final via `cntTo()` helper, `1.0s` duration
3. **Breakdown bars:** `scaleX` from 0 → width, `0.15s` stagger per bar (waterfall reveal)
4. **Stars:** `elastic.out(1, 0.5)` easing, `0.15s` individual stagger
5. **Confetti:** trigger `600ms` after star sequence completes

Each step waits for the previous to land. No simultaneous reveals.

## SVG Over Unicode

Icon precision rules:

- **Prohibited:** `✓`, `✗`, `★` Unicode characters — inconsistent rendering across devices
- **Required:** inline `<svg>` elements with:
  - `viewBox="0 0 12 12"`
  - `strokeWidth="2"`
  - `strokeLinecap="round"` + `strokeLinejoin="round"`
  - Colors from palette tokens (never hardcoded hex)

### Flex Container Safety

Rules for preventing layout overflow on mobile:

- `flexWrap:'wrap'` on any flex row with variable-width children (badges, tags, slots)
- `maxWidth:'100%'` on all content containers inside the Shell pattern
- Gap values: ≤ 8px for compact layouts, ≤ 12px for spacious layouts
- Never rely on `flex:1` without `minWidth:0` — flex items can overflow their container
- Mid component MUST include `minHeight:0` — prevents flex item from exceeding allocated space on small screens
- Mid component MUST include `overflowY:'auto'` — scrolls excess content instead of clipping or overlapping with Bot buttons

### Font Size Floor

Hard minimum font sizes for mobile readability:

| Token | Size | Usage |
|-------|------|-------|
| `--fs-body` | 14px | Body text, descriptions |
| `--fs-secondary` | 12px | Labels, captions, helper text |
| `--fs-interactive` | 14px | Button text, card titles |
| `--fs-data` | 12px | Metrics, round indicators (monospace) |
| `--fs-min` | 11px | Absolute floor — nothing below this |

**Rationale:** 8px text = ~2mm physical height at 375px viewport. Below readable threshold. Any `fontSize` declaration below 11 is a generation bug.

### SVG Chevron Patterns

Inline SVG templates for directional indicators (replacing Unicode escape sequences like `\u2192`):

```html
<!-- Up chevron (for reordering) -->
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3 9L7 5L11 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

<!-- Down chevron -->
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

<!-- Right arrow (for flow/sequence indicators) -->
<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
```

Never use Unicode escape sequences (`\u2192`, `\u25B2`) for **display symbols** in JSX — they may render as literal text. Use actual characters (`→`, `▲`) or inline SVG.

**EXCEPTION — apostrophes in English text:** Inside single-quoted JS strings, contractions like `doesn't` MUST use escaped `\'` (i.e., `doesn\'t`) or curly apostrophe `'` (U+2019). Never replace `\u2019` with straight ASCII `'` — it terminates the string.

---

**Reference implementation:** `games/prompt-gates/prompt-gates-game.html`

---

## Quick-Reply Chip Pattern (Dialogue / Decision chips) — v10.16.0

**When to use:** every game where the player picks from 2-4 response options per turn (Dialogue Tree, Multi-Round Strategy, Matrix Placement, most decision mechanics).

**Earned by:** TalentGrid 2026-04-19. User feedback: *"the options need to be more clear"* after a first-pass compression that stripped chips to bare ≤3-word labels. The answer was not more words — it was a three-layer structure that separates visual verb, decision name, and mechanic preview.

### The three-layer structure

Each chip renders three elements:

1. **Icon (Lucide SVG, 18-20px, stroke 1.75)** — carries the VERB of the action
2. **Bold short label (≤3 words, 14px IBM Plex Sans 600)** — names the decision
3. **Subtitle (≤8 words, 11.5px bone-dim)** — describes the MECHANIC, not strategy
4. *(Optional)* **Right-aligned keyboard letter (A/B/C, 11px JetBrains Mono)** — accessibility secondary

```jsx
<button class="chip" onClick=${()=>onPick(option)}>
  <span class="chip-icon">${LI('chevron-down', 18, 1.75)}</span>
  <div class="chip-label-wrap">
    <div class="chip-label">${option.label}</div>
    <div class="chip-sublabel">${option.sublabel}</div>
  </div>
  <span class="chip-letter">A</span>
</button>
```

### Icon-to-verb mapping (consistent across games)

| Intent | Lucide icon | Example labels |
|---|---|---|
| Accept / yield / defer | `chevron-down` OR `check-check` | Accept, Back down, Defer, Pick another |
| Ask / inquire / probe | `search` OR `help-circle` | Ask evidence, What's the concern? |
| Push back with data | `bar-chart-2` OR `trending-up` | Show data, Challenge, Hold firm |
| Escalate | `chevrons-up` OR `zap` | Escalate, Take to CHRO |
| Compromise / hedge | `split` OR `arrow-left-right` | Split the diff, Hedge |
| Name structural issue | `alert-octagon` OR `git-branch` | Name artifact, Challenge curve |
| Document / dissent | `file-text` OR `bookmark` | Document objection, Hold position |
| Commit / finalize | `check` | Submit, Commit, Confirm |
| Design choice (R4 / setup) | `settings-2` OR `sliders-horizontal` | Any configuration chip |

Pick ONE icon per intent category and stay consistent across all rounds of the game.

### Subtitle writing rules (critical — prevents strategy leak)

Subtitles describe MECHANIC (what happens on screen, in the data, to the round state) — NOT strategy or pedagogical consequence.

**GOOD (mechanic-focused):**
- "Priya → bottom. Session wraps."
- "Rakesh names his reasoning."
- "Pulls up delivery data side-by-side."
- "Takes it above Rakesh to CHRO."
- "Splits across top and middle tiers."

**BAD (strategy leak):**
- "Right call — preserves capital." → leaks correctness
- "Rakesh will remember this." → leaks pedagogical consequence
- "The smart move — saves R3 budget." → tells the player the hedged strategy
- "Avoid this — it backfires." → obvious leak

**Leak test:** read all 3 subtitles for a turn end-to-end. If a novice unfamiliar with the course content could reliably pick the "correct" answer from subtitles alone, you've leaked. Rewrite.

### CSS baseline

```css
.chip {
  display: flex; align-items: center; gap: 10px;
  min-height: 56px;              /* 44px floor at max-height: 680px */
  padding: 10px 14px;
  background: var(--panel);
  border: 1px solid var(--hairline);
  border-left: 3px solid var(--accent);
  border-radius: 2px;
  color: var(--bone);
  text-align: left;
  font-family: var(--body);
  cursor: pointer;
  touch-action: manipulation;
  transition: all 0.15s ease;
}
.chip:hover { border-left-width: 6px; background: var(--panel-hover); }
.chip-icon { color: var(--accent); flex-shrink: 0; }
.chip-label-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.chip-label { font-size: 14px; font-weight: 600; color: var(--bone); line-height: 1.2; }
.chip-sublabel { font-size: 11.5px; font-weight: 400; color: var(--bone-dim); line-height: 1.3; }
.chip-letter { font-family: var(--mono); font-size: 11px; color: var(--bone-dim); opacity: 0.6; flex-shrink: 0; }
```

### Tap target rule

Chip `min-height: 56px` at normal viewport, `min-height: 48px` at `@media (max-height: 780px)`, `min-height: 44px` at `@media (max-height: 680px)` — the 44px floor is iOS HIG absolute minimum. Never go below.

### Agent 4 audit check

Flag as HARD FAIL if any chip label exceeds 3 words OR any subtitle exceeds 8 words OR any subtitle leaks strategy (grep for keywords: right, wrong, correct, smart, mistake, trap, best, worst, save, spend wisely, avoid, preserve capital, remember).
