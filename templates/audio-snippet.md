# Audio — Reusable Template

**Purpose:** Web Audio helpers that work reliably across browsers without libraries. Covers: tap/correct/wrong/win sound effects + a procedural ambient music loop + user-gesture unlock.

**Earned by:** AUDIT + CODIFY both ship with this pattern. Under 100 lines of code, zero external libs.

---

## Core pattern: ensureAC + ping + snd

```js
let _ac=null, _master=null, _musicG=null, _musicOn=true, _musicStarted=false, _musicNodes=[];

function ensureAC(){
  if(!_ac){
    try{
      _ac = new (window.AudioContext || window.webkitAudioContext)();
      _master = _ac.createGain(); _master.gain.value = .85; _master.connect(_ac.destination);
      _musicG = _ac.createGain(); _musicG.gain.value = .06; _musicG.connect(_master);
    }catch(e){}
  }
  // CRITICAL: browsers suspend AudioContext until user gesture. resume() on every touch-path.
  if(_ac && _ac.state === 'suspended') _ac.resume();
}

function ping(freq, dur, type='sine', vol=.08){
  if(!_ac) return;
  const tC = _ac.currentTime;
  const o = _ac.createOscillator(), g = _ac.createGain();
  o.type = type; o.frequency.value = freq;
  o.connect(g); g.connect(_master);
  g.gain.setValueAtTime(vol, tC);
  // NEVER ramp to 0 — use 0.001 (silent but mathematically valid)
  g.gain.exponentialRampToValueAtTime(.001, tC + dur);
  o.start(tC); o.stop(tC + dur);
}

function snd(t){
  if(!_ac) return;
  if(t === 'tap') ping(700, .06, 'sine', .04);
  else if(t === 'good'){
    // ascending major third — skill rec for "success"
    [523, 659, 784].forEach((f,i) => setTimeout(() => ping(f, .16, 'sine', .1), i*70));
  }
  else if(t === 'wrong'){
    // descending buzzy — skill rec for "error"
    const tC = _ac.currentTime;
    const o = _ac.createOscillator(), g = _ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(320, tC);
    o.frequency.exponentialRampToValueAtTime(140, tC+.2);
    o.connect(g); g.connect(_master);
    g.gain.setValueAtTime(.07, tC);
    g.gain.exponentialRampToValueAtTime(.001, tC+.22);
    o.start(tC); o.stop(tC+.25);
  }
  else if(t === 'combo'){
    ping(1400, .08, 'square', .05);
    setTimeout(() => ping(1760, .1, 'square', .05), 50);
  }
  else if(t === 'win'){
    // bell-like — notification recipe
    [523, 659, 784, 1047, 1319].forEach((f,i) => setTimeout(() => ping(f, .4, 'sine', .1), i*80));
  }
}

function vb(p){ try { navigator.vibrate && navigator.vibrate(p); } catch(e){} }
```

---

## Procedural ambient music loop

Two flavors — pick one per aesthetic family.

### Sci-Fi Matrix (CODIFY) — synth arpeggio

```js
function startMusic(){
  if(!_ac || _musicStarted || !_musicOn) return;
  _musicStarted = true;
  const arp = [196, 261, 311, 392, 311, 261]; // G-C-Eb-G-Eb-C (minor arp)
  let i = 0;
  (function play(){
    if(!_musicStarted) return;
    const tC = _ac.currentTime, f = arp[i % arp.length];
    const o = _ac.createOscillator(), g = _ac.createGain(), hp = _ac.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = f * 2;
    hp.type = 'highpass'; hp.frequency.value = 400;
    o.connect(hp); hp.connect(g); g.connect(_musicG);
    g.gain.setValueAtTime(0, tC);
    g.gain.linearRampToValueAtTime(.25, tC+.04);
    g.gain.exponentialRampToValueAtTime(.001, tC+.5);
    o.start(tC); o.stop(tC+.55);
    _musicNodes.push(o);
    // occasional bass note
    if(i % 6 === 0){
      const b = _ac.createOscillator(), bg = _ac.createGain();
      b.type = 'sine'; b.frequency.value = f/2;
      b.connect(bg); bg.connect(_musicG);
      bg.gain.setValueAtTime(0, tC);
      bg.gain.linearRampToValueAtTime(.4, tC+.1);
      bg.gain.exponentialRampToValueAtTime(.001, tC+1.8);
      b.start(tC); b.stop(tC+2);
      _musicNodes.push(b);
    }
    i++;
    setTimeout(play, 340);
  })();
}
```

### Arcade Pop (AUDIT) — ambient pad

```js
function startMusic(){
  if(!_ac || _musicStarted || !_musicOn) return;
  _musicStarted = true;
  const chords = [ [196,246,293], [174,220,261], [164,207,246], [220,261,329] ]; // Gm-Fm-Em-Am
  let i = 0;
  (function playChord(){
    if(!_musicStarted) return;
    const tC = _ac.currentTime;
    chords[i % chords.length].forEach(f => {
      const o = _ac.createOscillator(), g = _ac.createGain(), lp = _ac.createBiquadFilter();
      o.type = 'sine'; o.frequency.value = f;
      lp.type = 'lowpass'; lp.frequency.value = 900 + Math.random()*400; lp.Q.value = 1;
      o.connect(lp); lp.connect(g); g.connect(_musicG);
      g.gain.setValueAtTime(0, tC);
      g.gain.linearRampToValueAtTime(.35, tC+1);
      g.gain.linearRampToValueAtTime(.001, tC+3.8);
      o.start(tC); o.stop(tC+4);
      _musicNodes.push(o);
    });
    i++;
    setTimeout(playChord, 4000);
  })();
}
```

### Stop + toggle (shared)

```js
function stopMusic(){
  _musicStarted = false;
  _musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
  _musicNodes = [];
}

function toggleMusic(){
  _musicOn = !_musicOn;
  if(_musicOn){ ensureAC(); setTimeout(startMusic, 50); }
  else stopMusic();
  return _musicOn;
}
```

---

## Hard rules (critical)

1. **Never ramp `gain` to exactly 0.** Use `0.001` — `exponentialRampToValueAtTime(0, ...)` throws an error. This applies to every sound, no exceptions.
2. **Always call `ensureAC()` inside an event handler.** The very first call must happen on a user click/tap — browsers block audio until user gesture. Put it in the Start button's onClick.
3. **Also `resume()` on every ensureAC() call.** Audio context goes into `suspended` state when tab loses focus; `resume()` on every touch recovers it.
4. **OscillatorNodes auto-disconnect after `stop()`** — no manual cleanup needed. Don't try to `disconnect()` them.
5. **BufferSourceNodes are one-shot** — create a new one for every play. Reuse throws.
6. **Wrap all calls in `try/catch`** — browser quirks vary (Safari ≠ Chrome ≠ Firefox).

## Tone vocabulary (consistent across games)

| Event | Waveform | Frequency | Duration | Gain |
|---|---|---|---|---|
| Tap | sine | 700 Hz | 60 ms | .04 |
| Correct | sine (ascending third) | 523 → 659 → 784 Hz | 480 ms | .10 |
| Wrong | sawtooth (descending) | 320 → 140 Hz | 220 ms | .07 |
| Combo | square | 1400 → 1760 Hz | 160 ms | .05 |
| Win | sine (5-note arpeggio) | C-E-G-C-E | 2 s | .10 |

Keep these consistent across games so returning players' muscle memory transfers.

## Music UI

Add a sound toggle in the top-right corner of every game:

```jsx
<div class="audio-tog ${musicOn?'on':''}" onClick=${toggleM}>
  ${LI(musicOn ? 'volumeOn' : 'volumeOff', 20)}
</div>
```

```css
.audio-tog{position:absolute;top:14px;right:16px;z-index:30;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation;color:var(--mt);transition:color .15s}
.audio-tog.on{color:var(--ac)} /* active state uses the aesthetic family's accent */
```

---

## Mute persistence (v10.19.0 — mandatory for all games with audio)

Mute state MUST persist across page reloads via localStorage. Key: `{slug}-game-muted`. Value: `'0'` (unmuted) or `'1'` (muted).

```javascript
let MUTED = false;
try {
  const saved = localStorage.getItem('{slug}-game-muted');
  if (saved === '1') MUTED = true;
} catch(e) {}

function persistMute(v) {
  MUTED = v;
  try { localStorage.setItem('{slug}-game-muted', v ? '1' : '0'); } catch(e) {}
  if (v) stopMusic();
}
```

**Why mandatory:** users who replay a game shouldn't have to re-mute. Memory-of-preference is table stakes. Canonical implementation in `games/founder-agent-readiness/founder-agent-readiness-game.html` (2026-04-20).

---

## Chiptune-arcade soundtrack (v10.19.0 — Web Audio API only)

For Arcade Pop aesthetic games with chiptune soundtrack, use Web Audio API's `OscillatorNode` + `BiquadFilterNode` directly. Tone.js is NOT needed — its scheduling engine is for polyphonic music; chiptune is single-voice melody + bass octave + kick.

**Stack recommendation:**
- **<10 sounds + one loop:** Web Audio API alone (~30 lines).
- **Complex polyphonic music:** Tone.js (rare for educational mini-games).

**Canonical chiptune pattern:**

```javascript
const MELODY = [
  261.63, 0, 311.13, 349.23, 392.00, 0, 392.00, 466.16,
  523.25, 466.16, 392.00, 349.23, 311.13, 0, 261.63, 0
  // C minor pentatonic — retro-arcade feel.
];

function chip(freq, duration, opts = {}) {
  if (MUTED || !freq) return;
  const ac = ensureAC(); if (!ac) return;
  const { type = 'square', vol = 0.08, filterHz = 2000 } = opts;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = type; osc.frequency.setValueAtTime(freq, now);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  const flt = ac.createBiquadFilter();
  flt.type = 'lowpass'; flt.frequency.setValueAtTime(filterHz, now);
  osc.connect(flt); flt.connect(gain); gain.connect(ac.destination);
  osc.start(now); osc.stop(now + duration + 0.02);
}
```

### Tempo escalation for pedagogical ramp (v10.19.0)

For games with >3 rounds where the final round is a difficulty spike (transfer test, removed budget, unfamiliar scenario): **escalate tempo on that round.**

- R1-R(N-1): 140 BPM square-wave melody.
- R(N — final): 170 BPM + sine-wave kick drum on downbeats.

```javascript
function playKick() {
  if (MUTED) return;
  const ac = ensureAC(); if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.15, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(g); g.connect(ac.destination);
  osc.start(now); osc.stop(now + 0.14);
}

function startMusic(bpm) {
  if (MUTED || MUSIC_TIMER) return;
  const stepMs = (60 / bpm) * 1000 / 4;
  let step = 0;
  MUSIC_TIMER = setInterval(() => {
    const note = MELODY[step % MELODY.length];
    if (note) chip(note, 0.18, { type: 'square', vol: 0.05, filterHz: 2600 });
    if (bpm >= 165 && step % 4 === 0) playKick();
    step++;
  }, stepMs);
}
```

On round change: call `stopMusic()` then `startMusic(roundIdx === finalRound ? 170 : 140)`.

**Why:** most Rehearsal games use static audio. Tempo shifts signal "rules changed — apply the framework to something new." `founder-agent-readiness` R5 (webhook endpoint transfer test — NOT named in the course) shifts 140 → 170 BPM with kick. Reference implementation: `games/founder-agent-readiness/founder-agent-readiness-game.html`.
