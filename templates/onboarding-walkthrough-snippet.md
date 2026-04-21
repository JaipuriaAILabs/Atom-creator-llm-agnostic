# Onboarding Walkthrough — Reusable Template

**Purpose:** Bridge the gap between the intro screen and the first round of play with a 3-frame visual orientation. Novice players dropped into a multi-part playfield (grid + chat + evidence drawer + budget counter) get overwhelmed; an on-ramp that shows each region before play begins raises approachability without teaching strategy.

**Earned by:** TalentGrid (2026-04-19) — user flagged *"There is no segway for the user to understand what to do...its a little overwhelming for a novice user."* Three-screen orient pattern resolved it.

---

## When to use

**Required** for games with any of:
- 4+ rounds
- Multiple playfield regions (grid + chat + drawer, or map + inventory + timer)
- Novel mechanic the player hasn't seen before (Dialogue Tree, Multi-Round Strategy, Matrix Placement)

**Optional** for simple 3-round arcade mechanics (Swipe Classify, single-tap Contradiction Hunt) where the playfield is one region and the interaction is one gesture.

---

## Structure — 3 screens between `intro` and first round

State machine: `intro → orient1 → orient2 → orient3 → r1 → r2 → …`

Each orient frame answers ONE question:
1. **Orient 1 — "The playfield"** → *what am I looking at?*
2. **Orient 2 — "The interaction"** → *what do I do?*
3. **Orient 3 — "The resource / stakes"** → *what's at risk?*

Example mapping per mechanic:

| Mechanic | Orient 1 | Orient 2 | Orient 3 |
|---|---|---|---|
| Dialogue Tree | Mock chat bubble + sender avatar | Three sample chips with icon+label+subtitle | Pushback capital counter + round timer |
| Matrix Placement | Mini 2×2 matrix with sample chips | Drag-to-quadrant with commit button | Cue chips + scoring meters |
| Multi-Round Strategy | SVG graph mock with nodes | Action buttons with cost chips | Budget counter + remaining actions |
| Contradiction Hunt | Row list mock | Tap-to-flag with sample flag state | Misses counter + streak |

---

## Each screen template

```jsx
<div class="orient" ref=${rootRef}>
  <div class="orient-step or-anim">Orientation ${step} of 3</div>
  <div class="orient-dots or-anim">
    ${[1,2,3].map(i => html`<span class=${i < step ? 'done' : i === step ? 'active' : ''}></span>`)}
  </div>
  <div class="orient-title or-anim">${title}</div>
  <div class="orient-body or-anim">${body}</div>
  <div class="orient-mock or-anim">
    <!-- Mock visual using ACTUAL game aesthetic tokens -->
  </div>
  <button class="orient-cta or-anim" onClick=${onNext}>
    ${step < 3 ? 'Next →' : 'Begin calibration →'}
  </button>
  ${step < 3 && html`<div class="orient-skip" onClick=${onSkip}>Skip orientation</div>`}
</div>
```

**Required elements:**
- **Eyebrow** — "ORIENTATION 1 OF 3" mono uppercase, 11px, +1.5px tracking, accent color
- **Progress dots** — 3 dots visualizing position; filled = done, accent-filled = active, outline = pending
- **Display title** — ≤5 words, same typography as game's hero titles
- **Body line** — ≤15 words, describes WHAT this region is (not how to play strategically)
- **Mock visual** — uses actual game aesthetic tokens; NOT abstract diagrams. If the game has a 9-box grid, show a mini 3×3 grid with real-looking chips. If it has a chat, show a real-looking bubble.
- **CTA button** — "Next →" on orient 1-2, "Begin calibration →" (or equivalent domain verb) on orient 3; rust/accent pill
- **Skip affordance** — "Skip orientation" chip on orient 1-2 (not orient 3); small, bone-dim, mono; gives repeat players a way out

---

## Copy rules (critical — prevents strategy leak)

Every orient body line describes MECHANIC or STRUCTURE, never STRATEGY.

**GOOD** (mechanic-focused):
- "Ten employees, placed across three performance tiers. Tap any chip to see their delivery data."
- "Managers push their rankings in chat. You pick how to push back — every chip tells you what it does."
- "Three pushback units. Spend them where the evidence is strongest."

**BAD** (strategy leak):
- "The real fight is in round 3." *(leaks the pedagogical trap — R3 shouldn't be pre-announced)*
- "Save your capital for when it matters most." *(tells the player the hedged strategy)*
- "The naive choice is to accept — don't." *(leaks the weaponized-common-sense trap)*

**Test**: if the orient body lines, read end-to-end, would let a novice reliably pick the "correct" answers in round 1 without playing, the copy leaks. Rewrite.

---

## State machine rules

```js
const [phase, setPhase] = useState('intro');  // intro | orient1 | orient2 | orient3 | r1 | …

function resetAll() {
  setPhase('intro');  // ALWAYS return to intro so replay re-orients
  // ... reset all other state
}
```

- **`resetAll()` returns to `intro`** — first-time players go through orient flow; repeat players can tap Skip.
- **Meeting / game timer MUST NOT start during orient phases.** Gate with `['r1','r2','r3','r4'].includes(phase)`. If a timer fires during orient, you're burning the player's budget on reading.
- **Music / ambient audio CAN play during orient** — sets the mood without burning game budget.

---

## Animation — use the safety finalizer pattern

Entry animations for orient screens MUST use `templates/entry-anim-snippet.md` Rule 7.2 pattern (killTweensOf + overwrite:'auto' + setTimeout finalizer). Staggered `gsap.fromTo` on 5-7 elements is prone to interruption when parent re-renders, leaving orient elements stuck at opacity:0.

Verified failure mode from 2026-04-19: orient1 title + body + mock + CTA were stuck invisible; only the eyebrow and dots reached full opacity. Fix: finalizer at ~1300ms force-sets end state if animation interrupted.

```js
useEffect(() => {
  if (!rootRef.current) return;
  const els = rootRef.current.querySelectorAll('.or-anim');
  gsap.killTweensOf(els);
  gsap.set(els, { y: 0, opacity: 1 });
  gsap.fromTo(els, { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: .45, stagger: .07, ease: 'power2.out', overwrite: 'auto' });
  const safetyId = setTimeout(
    () => { try { gsap.set(els, { y: 0, opacity: 1 }); } catch(e){} }, 1300
  );
  return () => clearTimeout(safetyId);
}, [step]);
```

---

## Agent 4 audit check

Games with ≥ 4 rounds OR novel mechanics MUST implement this walkthrough. If missing, Agent 4 flags as SOFT WARN with recommendation:

> **Onboarding walkthrough missing (soft warn).** This game has {N} rounds / mechanic {X}. Novice players need a 3-screen orient flow per `templates/onboarding-walkthrough-snippet.md`. Implement before ship or document exception in design.md.

Agent 4 verifies:
1. `phase === 'orient1' | 'orient2' | 'orient3'` states exist in the state machine
2. Timer gating: no setInterval/setTimeout starts during orient phases
3. Copy check: orient body lines don't contain strategy keywords (spend, save, trap, catch, real fight, etc.)

---

## Skip affordance psychology

The skip chip serves three functions:
1. Respects repeat players who don't need orientation
2. Signals to first-time players that this is "optional pre-reading" (low cognitive load)
3. Lets audit verify orient is non-blocking — if the skip path breaks the state machine, that's a bug

Always offer skip on orient 1 + 2. Make orient 3 require a commit click ("Begin calibration →") because the transition from learning mode to play mode should be intentional.

---

## Reference files loaded by this template

- `templates/entry-anim-snippet.md` — Rule 7.2 animation safety pattern (MANDATORY for orient screens)
- `templates/aesthetic-design-principles.md` — typography and palette tokens for mock visuals
- `templates/responsive-layout-snippet.md` — orient mock sizing at 360×640 floor

## When NOT to use this template

- Games with 3 rounds AND simple tap-to-commit interactions (Rapid Classify Swipe, Contradiction Hunt on a single row list) — the mechanic is self-evident.
- Arcade games with ≤30 seconds total duration — orient flow eats too much of the experience budget.
- Re-plays of the same game — user has already oriented; trust the Skip chip.
