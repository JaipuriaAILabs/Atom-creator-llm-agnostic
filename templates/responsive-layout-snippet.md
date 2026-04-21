# Responsive Layout — Reusable Template

**Purpose:** Make a single-file game fit all modern mobile portrait viewports from 360×640 up to 430×932 — iPhone SE, Galaxy S24, iPhone 14/15/16, iPhone Pro Max, Galaxy S24/S26 Ultra. A game that works at 430px max-width but breaks at 360×640 is considered broken.

**Earned by:** TalentGrid, THE GEM, AUDIT, CODIFY, brand-extension, Forward Deployed — all six games on 2026-04-19 after browser-preview verification caught reply chips clipping off-screen at iPhone SE.

**When to use:** every game. This is not optional.

---

## Target device matrix

| Device | Viewport |
|---|---|
| Galaxy S24 (narrow Android) | 360 × 780 |
| iPhone SE 3rd gen | 375 × 667 |
| iPhone 14 / 15 / 16 | 390 × 844 |
| iPhone 15 / 16 / 17 Pro | 393 × 852 |
| Galaxy S24 Ultra | 412 × 915 |
| iPhone 15 / 16 / 17 Pro Max | 430 × 932 |
| Galaxy S26 Ultra (rumored) | ~420 × 930 |

**Absolute floor:** 360×640 (covers older Androids). Never target less than that.

---

## Fixed vs flexible budget

Calculate non-negotiable heights first, then let the rest flex:

| Region | Typical height |
|---|---|
| Status bar (game HUD top strip) | 28px |
| Distribution / round / progress bar | 56-62px |
| Chat header OR panel title | 22-36px |
| Sender label or round label | 18-20px |
| Reply chip area (3 chips × 56-62px) | 168-186px |
| Safe bottom padding / inset | 8-12px |
| **Fixed total** | **~330px chrome** |

**Remaining budget** for the playfield + chat (flexible):
- 360×640: 640 − 330 = **310px** (tightest)
- 375×667: 667 − 330 = **337px**
- 390×844: 844 − 330 = **514px**
- 430×932: 932 − 330 = **602px**

At 310px, a 9-box grid compresses to rows of ~60-80px each with 28-32px employee chips — still readable with 11-12px labels. Verify by testing 360×640 in browser preview.

---

## The flex pattern (copy-paste)

```css
html, body {
  margin: 0; padding: 0; overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
body { height: 100dvh; display: flex; flex-direction: column; }

#root {
  flex: 1 1 auto; min-height: 0;
  max-width: 430px; margin: 0 auto;
  display: flex; flex-direction: column;
  overflow: hidden;
}

/* Fixed chrome — size themselves, never flex-grow */
.hud, .distribution-bar, .chat-header, .reply-label, .bottom-cta {
  flex: 0 0 auto;
}

/* Primary playfield — takes remaining space */
.playfield {
  flex: 1 1 auto;
  min-height: 180px;
  overflow: hidden;
  display: flex; flex-direction: column;
}

/* Chat panel (when present) — bounded, internally scrollable */
.chat-panel {
  flex: 0 1 auto;
  min-height: 80px; max-height: 220px;
  overflow-y: auto;
}

/* Reply chips — always visible, never flex-grow */
.reply-area {
  flex: 0 0 auto;
  padding: 8px 10px;
}
```

**Key principles:**
- Root has `min-height: 0` (critical for Safari flex children)
- Playfield has `flex: 1 1 auto` AND `min-height` so it shrinks gracefully but never collapses
- Chat panel allowed to scroll internally — this is the documented exception to "no scroll" (chat surfaces ≠ gameplay)
- Reply chips at `flex: 0 0 auto` at the bottom — they must never be pushed off-screen

---

## Three media query tiers (copy-paste)

Apply these progressively. The 360×640 floor has all three active simultaneously.

```css
/* Tier 1: iPhone 14/SE height range + Galaxy S24 */
@media (max-height: 780px) {
  .hud { padding: 4px 10px; min-height: 28px; }
  .distribution-bar { padding: 4px 10px; }
  .chat-bubble { font-size: 13.5px; }
  .reply-chip { min-height: 52px; }
  .display-title { font-size: 22px; }
}

/* Tier 2: iPhone SE + 360×640 floor */
@media (max-height: 680px) {
  .chat-panel { max-height: 150px; }
  .reply-chip { min-height: 48px; }
  .emp-chip { width: 28px; height: 28px; font-size: 10px; }
  .chat-bubble { font-size: 13px; }
  .display-title { font-size: 18px; }
  .hud-label { font-size: 10px; }  /* floor for mono decorative — data stays ≥11px */
}

/* Tier 3: Narrow Androids (Galaxy S24 360w) */
@media (max-width: 380px) {
  .reply-chip { padding: 10px 12px; }
  .chat-panel { padding: 6px 8px; }  /* was 8-10px */
  .hud { padding: 4px 8px; }
  .emp-chip-label { max-width: 60px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
}
```

**Test matrix:** verify behavior at 360×640, 375×667, 390×844, 430×932. If a chip is clipped at ANY of these, you have a bug.

---

## Tap target invariant (HARD RULE)

Every tappable element ≥ 44×44px hit area at every viewport — per iOS HIG. Visual size can be smaller, but hit area must extend.

```css
/* When visual element is <44px but must be tappable */
.small-chip {
  position: relative;
  width: 32px; height: 32px;
  /* visual */
}
.small-chip::before {
  content: '';
  position: absolute;
  inset: -6px;  /* extends hit area to 44×44 */
}
```

**Never drop below 44px.** If a design requires chips < 44px visual, USE THE INFLATOR. Never make `.small-chip` itself 32×32 with no hit-area extension — that's unreachable on accessibility devices.

---

## Font floors (HARD RULES)

| Text role | Minimum |
|---|---|
| Body text (chat bubbles, descriptions) | **12px** |
| Interactive labels (chip text, button text) | **13px** |
| Data / informational (scores, counters, percentages) | **11px** |
| Mono decorative labels (HUD eyebrow, status tags) | **10px** |

Never go below 10px on anything the eye reads. Never go below 11px on anything the eye READS FOR MEANING (vs glances at as decoration).

---

## SVG playfields

If the game uses an SVG graph, map, or matrix as the playfield, use `viewBox` + `preserveAspectRatio` so the SVG scales with its flex parent:

```html
<svg class="graph-svg"
     viewBox="0 0 440 440"
     preserveAspectRatio="xMidYMid meet"
     style="width: 100%; height: 100%;">
  <!-- fixed-coordinate nodes here — they scale automatically -->
</svg>
```

Then in CSS:
```css
.graph-svg-container {
  flex: 1 1 auto;
  min-height: 200px;
  max-height: 420px;
  display: flex; justify-content: center; align-items: center;
}
```

Node positions inside the SVG stay at fixed viewBox coordinates; the ENTIRE SVG scales. No layout thrash.

---

## Verification protocol

Before declaring a game ship-ready, browser-test at 4 key viewports:

```js
// In preview/devtools:
[
  [360, 640],  // worst case
  [375, 667],  // iPhone SE
  [390, 844],  // iPhone 14
  [430, 932]   // iPhone Pro Max
].forEach(([w, h]) => {
  // Resize viewport to w × h
  // Navigate to first-round screen
  // Run:
  const lastChip = document.querySelectorAll('.reply-chip, .cta-chip, .action-btn');
  const last = lastChip[lastChip.length - 1];
  const r = last.getBoundingClientRect();
  console.log(`${w}×${h}: last chip top=${r.top.toFixed(0)} bottom=${r.bottom.toFixed(0)} vh=${h} visible=${r.bottom <= h && r.top < h}`);
  // ALL must report `visible: true` with bottom < h
});
```

If ANY viewport shows a chip with `bottom > vh`, you have a layout bug. Fix before proceeding.

---

## Reference: the 2026-04-19 TalentGrid session

Before the responsive refactor, TalentGrid had fixed 80-100px per 9-box cell AND fixed chat min-height 140px. Total: ~390px of playfield claiming height before reply area. At 375×667: chip 1 at y=661 (barely visible), chips 2-3 at y=723 / 785 (clipped, unreachable due to `overflow: hidden`).

After refactor using this template: all 3 chips visible at all 4 test viewports, 8-10px safety gap below last chip at tightest (360×640).

The `overflow: hidden` means clipped content is NOT scrollable. If a chip goes off-screen, it's unreachable. Responsive patterns are non-negotiable.

---

## Authority references

- Tap target 44×44 minimum — iOS Human Interface Guidelines
- Font floors — `shared/structural-checks.md` Authority Table (where applicable)
- Flex patterns — `/game-design` skill §1.3 (Mobile-First, Desktop-Tolerant)
- Chat panel internal scroll allowed — `/game-design` skill §1.3 (documented exception)
