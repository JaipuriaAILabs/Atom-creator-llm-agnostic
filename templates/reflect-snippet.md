# Reflect Phase — Reusable Template

**Purpose:** Between Play and Win, a quiet synthesis beat that names the skill the player just practiced. Not a score reveal (that's Win). Not celebration (no confetti). Just a terminal-style typewriter of 4–6 short lines with ONE line tailored to the player's actual performance.

**Earned by:** AUDIT (`decomposer.html`) and CODIFY (`routine.html`) — both ship with this pattern.

**When to use:**
- Games with ≥ 4 rounds or deck size ≥ 10 — Reflect is strongly recommended
- Short arcade games (<30s, <4 rounds) — can skip Reflect; flow straight to Win
- `phase='reflect'` sits between `phase='play'` and `phase='win'`

---

## CSS (palette swap per aesthetic family)

### Sci-Fi Matrix variant (from CODIFY)
```css
.reflect{flex:1;display:flex;flex-direction:column;justify-content:center;padding:36px 28px;gap:18px;position:relative;z-index:1}
.reflect-prompt{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--auto);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;opacity:.7}
.reflect-line{font-family:'Orbitron',sans-serif;font-size:22px;font-weight:700;line-height:1.25;letter-spacing:.5px;color:var(--tx);min-height:28px}
.reflect-line.ac{color:var(--auto);text-shadow:var(--glow-a)}
.reflect-line.small{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:500;letter-spacing:.3px;color:var(--dm);line-height:1.5}
.reflect-cursor{display:inline-block;width:10px;height:18px;background:var(--auto);margin-left:3px;vertical-align:-2px;animation:blink 1s steps(2) infinite;box-shadow:0 0 10px var(--auto)}
@keyframes blink{50%{opacity:0}}
.reflect-tap{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:2px;color:var(--mt);text-transform:uppercase;margin-top:auto;text-align:center;padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:4px;cursor:pointer;touch-action:manipulation}
```

### Arcade Pop variant (from AUDIT)
```css
.reflect{flex:1;display:flex;flex-direction:column;justify-content:center;padding:34px 26px;gap:10px;cursor:pointer}
.reflect-prompt{font-family:'Space Mono',monospace;font-size:11px;color:var(--ac);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;font-weight:700;display:flex;align-items:center}
.reflect-cursor{display:inline-block;width:9px;height:16px;background:var(--ac);margin-left:4px;animation:reflect-blink 1s steps(2) infinite}
@keyframes reflect-blink{50%{opacity:0}}
.reflect-line{font-family:'Bungee',system-ui,sans-serif;font-size:22px;font-weight:400;line-height:1.2;color:var(--tx);letter-spacing:-.3px}
.reflect-line.ac{color:var(--ac);text-shadow:3px 3px 0 var(--bd)}
.reflect-line.small{font-family:'Archivo',sans-serif;font-size:15px;font-weight:700;line-height:1.4;letter-spacing:.2px}
.reflect-tap{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--mt);text-transform:uppercase;margin-top:auto;text-align:center;padding:12px;border:2px dashed var(--bd);border-radius:10px;background:var(--sf);font-weight:700}
```

### Editorial Mono variant
```css
.reflect{flex:1;display:flex;flex-direction:column;justify-content:center;padding:36px 28px;gap:14px}
.reflect-prompt{font-family:'Space Mono',monospace;font-size:11px;color:var(--ac);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;font-weight:700}
.reflect-cursor{display:inline-block;width:8px;height:14px;background:var(--ac);margin-left:3px;animation:reflect-blink 1s steps(2) infinite;vertical-align:-1px}
.reflect-line{font-family:'Source Serif 4',Georgia,serif;font-size:22px;font-weight:800;line-height:1.3;color:var(--tx);letter-spacing:-.3px}
.reflect-line.ac{color:var(--ac)}
.reflect-line.small{font-family:'Archivo',sans-serif;font-size:14px;font-weight:600;color:var(--dm);line-height:1.5}
.reflect-tap{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;color:var(--mt);text-transform:uppercase;margin-top:auto;text-align:center;padding:12px;border:1px solid var(--bd);border-radius:6px;cursor:pointer}
```

---

## JSX (Preact + HTM)

```jsx
/* ═══ REFLECT — terminal-style lesson beat ═══ */
function Reflect({signalValue, total, onContinue}){
  const[showPrompt,setShowPrompt]=useState(false);

  // Tailor the middle line based on the performance signal
  // Replace with your game's actual signal + thresholds
  const tailored = signalValue >= 3
    ? `You caught ${signalValue} of them. That's the read most miss.`
    : signalValue >= 1
    ? `${signalValue} catch${signalValue>1?'es':''}. The tricky ones fool most.`
    : `The tricky ones got you all. That's where the skill lives.`;

  useEffect(()=>{
    // Staggered fade-in of lines (gsap.fromTo, NEVER gsap.from — rule 7.1)
    gsap.fromTo('.reflect-line',{y:12,opacity:0},{y:0,opacity:1,duration:.5,stagger:.4,ease:'power2.out'});
    // "tap to continue" chip appears at 2.8s (after typewriter completes)
    const pt = setTimeout(()=>setShowPrompt(true), 2800);
    // Auto-advance at 8s if player doesn't tap
    const aa = setTimeout(onContinue, 8000);
    return ()=>{ clearTimeout(pt); clearTimeout(aa); };
  },[]);

  return html`<div class="reflect">
    <div class="reflect-prompt">${'>'} deck.audited<span class="reflect-cursor"></span></div>
    <div class="reflect-line">You just classified ${total} tasks.</div>
    <div class="reflect-line">"Routine" is not the dull ones.</div>
    <div class="reflect-line ac">Routine = codifiable.</div>
    <div class="reflect-line small">${tailored}</div>
    <div class="reflect-line">Every role is a bundle.</div>
    <div class="reflect-line">Your job is to see the split first.</div>
    <div
      class="reflect-tap"
      onClick=${onContinue}
      style=${showPrompt?'opacity:1;transition:opacity .4s;pointer-events:auto':'opacity:0;pointer-events:none'}>
      tap ▸ auto-advance 8s
    </div>
  </div>`;
}
```

---

## Wiring into the state machine

```jsx
// In App():
const [phase, setPhase] = useState('intro'); // intro | play | reflect | win

// When the last round/card resolves (in your resolve/endRound function):
function endGame(){
  // ... record final score ...
  snd('good'); // small chime, NOT win chime
  // brief celebratory puff (not full confetti — save that for Win)
  setTimeout(() => setPhase('reflect'), 500);
}

// reflectDone advances from Reflect to Win
function reflectDone(){
  snd('win');
  confet(24);  // BIG confetti here, not on endGame
  setPhase('win');
}

// Render:
if(phase === 'reflect') return html`<${Reflect}
  signalValue=${invCatches /* or misses, streak, etc. */}
  total=${deck.length}
  onContinue=${reflectDone}
/>`;
```

---

## Hard rules

1. **Only the `.reflect-tap` chip is clickable.** Never put `onClick` on the outer `.reflect` div — phantom-click bug.
2. **`pointer-events:none` on the tap chip until the typewriter completes** (≥2.8s). Prevents accidental clicks during reveal.
3. **No confetti on Reflect.** Save the celebration for Win. Reflect is quiet synthesis.
4. **No score number on Reflect.** Score belongs to Win. Reflect mentions the *count* of catches/misses/finds, not points.
5. **Tailored line MUST reference gameplay outcome, not the score.** "You caught 3 inversions" good. "You scored 450 points" bad.
6. **Auto-advance at 8s is mandatory.** Players who leave the tab or get distracted should eventually reach Win.
7. **Line count: 4–6 total.** Fewer feels terse; more feels like reading homework.

## Tailoring signal patterns

| Mechanic family | Default signal | Bucket thresholds |
|---|---|---|
| Contradiction Hunt (AUDIT) | `misses` | 0 / 1–2 / 3+ |
| Rapid Classify Swipe (CODIFY) | `invCatches` / `catches` | 0 / 1–2 / 3+ |
| Allocation | `starRating` | 3★ / 2★ / 1★ |
| Progressive Reveal | `correctCount` | high / mid / low |
| Multi-Round Strategy | `finalState` (e.g., alive/dead metric) | survived / damaged / failed |

Pick the signal that makes the player's *judgment quality* visible, not their speed or quantity.
