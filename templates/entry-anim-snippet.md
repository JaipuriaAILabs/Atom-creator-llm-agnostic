# Entry Animation — Reusable Template (DOM-reuse-safe)

**Purpose:** The boilerplate for animating a component in AFTER its previous instance animated out — without the exit transforms bleeding through. This is the pattern that fixes the "blank card between turns" bug.

**Earned by:** CODIFY — debugged through 2 cycles before the root cause surfaced. Documented here so no future game re-hits it.

---

## The bug this prevents

**Symptom:** After swiping / dismissing the current card (or round, or panel), the next one mounts but appears invisible — or slightly off-position, or with residual rotation.

**Root cause:** Preact/React reuse DOM nodes when JSX shape stays the same. If your exit animation was:

```js
gsap.to(cardRef.current, { x: 600, opacity: 0, rotation: 20, duration: .3, onComplete: advance });
```

…those inline styles (`transform: translate(600px, 0) rotate(20deg); opacity: 0`) **persist on the element** after the component re-renders with new props. Your entrance animation only animates the NEW properties (usually scale + y), not the old ones. So the new card appears at `x: 600, opacity: 0` and you see nothing.

---

## The fix: `gsap.set` BEFORE `gsap.fromTo`

```js
useEffect(() => {
  if (!cardRef.current) return;

  // 1. FULL RESET — clobber any inline styles left by the exit animation.
  //    Include EVERY property the exit animation touched.
  gsap.set(cardRef.current, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });

  // 2. Also reset classes that might have been toggled during drag/swipe
  cardRef.current.classList.remove('tilt-a', 'tilt-h', 'correct', 'wrong');

  // 3. Now animate from your entrance state. Short duration, no opacity fade
  //    (opacity is already 1 from step 1 — fading from 0 here would be a bug).
  gsap.fromTo(cardRef.current,
    { scale: .92, y: 20 },
    { scale: 1, y: 0, duration: .25, ease: 'back.out(1.6)' }
  );

  // 4. Reset any mid-transition state guards
  state.current.busy = false;

}, [pos]); // keyed to whatever variable triggers component re-mount
```

---

## Hard rules

1. **ALWAYS use `gsap.fromTo` — NEVER bare `gsap.from`.** Rule 7.1 in the `/game-design` skill. `gsap.from()` can leave elements permanently invisible if React re-renders during the animation.
2. **Every property the exit animation touches must be in the `gsap.set` reset.** If you animate `x, y, rotation, opacity` on exit, you must reset all four. Missing one = bleed-through.
3. **The reset goes inside the useEffect keyed to the state change**, not in a separate useEffect. Must run synchronously before the entrance fromTo.
4. **Classes toggled during interaction must be removed too** — drag-direction classes (`tilt-a`, `tilt-h`), feedback classes (`correct`, `wrong`, `found`), selection classes (`selected`, `active-yes`). Anything added with `classList.add()` at some point needs a `classList.remove()` companion on reset.
5. **State refs (`busy`, `dragging`) reset here too** — not just visual state. Otherwise taps queue during the transition and leak into the next card.

---

## When you need it

Any component that:
- Has an entry animation
- Can be re-mounted with different props (keyed `useEffect`)
- Had an exit animation on the previous instance

Typical candidates:
- Swipe-deck cards (CODIFY)
- Carousel slides between rounds
- Modal dialogs that reappear with different content
- Any "flying in / flying out" UI pattern

## When you don't need it

- First-time mount only (no prior instance to bleed from)
- Components with no exit animation (if it just unmounts cleanly, there are no stale transforms)
- Static components whose DOM doesn't get reused

## Heuristic for detecting the bug

If you ever see a working interaction that then produces a blank or misplaced UI after re-mount:

1. Open devtools → inspect the "invisible" element
2. Look at its inline `style` attribute
3. If you see `transform: translate(…) rotate(…)` or `opacity: 0` lingering — this bug
4. Add the `gsap.set` reset at the top of the component's mount useEffect

## Agent 4 enforcement

Game-audit.md Check 20 flags this as HARD FAIL if missing. The auditor looks for:
- Any `useEffect(..., [stateVar])` containing `gsap.fromTo` on a ref
- Absence of `gsap.set(ref.current, {...})` BEFORE the fromTo in that same useEffect

Fix before submitting for audit.

---

## Rule 7.2 — Stagger interruption safety (supplements Rule 7.1)

**Symptom:** A screen renders correctly in the DOM (accessibility snapshot shows all content) but VISUALLY appears blank or partially populated. Elements 3+ of a stagger are stuck at `opacity: 0`, while elements 1-2 are mid-fade at fractional opacity.

**Root cause:** `gsap.fromTo(els, { opacity:0, … }, { opacity:1, … stagger: .07 })` on 5+ elements often gets interrupted by a Preact re-render triggered by parent state updates, child mounts, or phase transitions. The tween INTERRUPTION leaves the FROM values (`opacity: 0`) applied as inline styles, and the animation never completes to the TO values. Elements 3-N never reach visible state.

**Why Rule 7.1 isn't sufficient:** Rule 7.1 (always `fromTo`, never `from`) is necessary but not enough. `gsap.fromTo` can STILL strand elements if interrupted — the FROM state gets applied as inline styles before the tween completes, and CSS baseline doesn't override inline styles.

**The 5-line safety finalizer pattern:**

```js
useEffect(() => {
  if (!rootRef.current) return;
  const els = rootRef.current.querySelectorAll('.my-anim-class');
  gsap.killTweensOf(els);                                        // 1. kill in-flight tweens
  gsap.set(els, { x:0, y:0, opacity:1, scale:1 });               // 2. reset inline styles
  gsap.fromTo(els,
    { y:20, opacity:0 },
    { y:0, opacity:1, duration:.5, stagger:.08, ease:'power2.out', overwrite:'auto' }  // 3. add overwrite:'auto'
  );
  const safetyId = setTimeout(                                   // 4. force end-state if interrupted
    () => { try { gsap.set(els, { x:0, y:0, opacity:1, scale:1 }); } catch(e){} },
    1300
  );
  return () => clearTimeout(safetyId);                           // 5. cleanup on unmount
}, [depsArray]);
```

**Three key ingredients:**
- `gsap.killTweensOf(els)` before starting — prevents stale tween ghosting from prior renders
- `overwrite: 'auto'` on the fromTo — lets GSAP handle conflicting tween resolution
- `setTimeout` safety finalizer — forces end-state even if animation interrupted; cheap (no-op when animation completes normally)

**Timeout calibration formula:**
`(duration + stagger × elementCount) × 2`, clamped ≥1200ms.

Examples:
- 6 elements × stagger .08 + duration .5 = .98s → safety at 1300ms
- 5 elements × stagger .1 + duration .55 = 1.05s → safety at 1400ms
- 3 elements × stagger .15 + duration .6 = 1.05s + star delay .3s → safety at 1600ms

**Detection heuristic (same as Rule 7.1 but stagger-specific):**
1. Screen LOOKS blank but DOM snapshot (via accessibility tree or Preact DevTools) shows content → stuck-opacity
2. DevTools Elements panel: elements have inline `style="opacity: 0; transform: translate(0px, 18px)"` → confirms it
3. Screen mostly renders but last 1-2 elements of a stagger missing → Rule 7.2 interruption

**When to apply this pattern:**
- Any `useEffect` with `gsap.fromTo` on a staggered set of 3+ elements
- Any screen that re-mounts via `key={changingValue}` (intro, orient, brief, reveal, reflect, win)
- Any animation that runs during a potential parent re-render window

**When Rule 7.1 alone is sufficient (stagger finalizer NOT needed):**
- Single-element entrance animations
- Animations on persistent elements that never unmount during their lifecycle
- Static screens with no state transitions during animation

**Agent 4 enforcement:** Check 20 extended — auditor greps for staggered `gsap.fromTo` without matching `killTweensOf` and `setTimeout` finalizer. SOFT WARN if missing; HARD FAIL if game history shows stuck-opacity symptom.

**Reference:** 2026-04-19 TalentGrid session. Rule 7.1 was followed correctly (all gsap.fromTo, no bare gsap.from). Orient screens still rendered blank because stagger interruption left elements 2-5 of 6 stuck at opacity:0. Safety finalizer pattern resolved all 5 affected screens (intro, orient × 3, brief, result, win).
