# UGC Correspondent System

> Loaded by `:ugc` Step 0. Character design bible for The Correspondent UGC video system.

---

## Character Identity

**Internal Name:** The Correspondent
**Role:** Recurring mid-course character who appears 2-3 times per course to deliver key narrative beats via AI-generated video clips
**Design Principle:** Hook with the looks, make them stay with what we have to offer

### Face

- Female, early 20s (reads 21-22, never older)
- Ethnically ambiguous — fair warm-toned skin with golden undertone (North Indian/Parsi fair, NOT pink/European fair)
- Very large round dark brown doe eyes with long dark lashes (dominant facial feature)
- Cute button nose with small thin silver hoop on left nostril
- Pouty full lips with natural mauve-rose tint
- Soft jawline with slight roundness at chin, high cheekbones
- Thick dark eyebrows with natural arch, groomed but not pencil-thin
- Small beauty mark on cheek

**The Ambiguity Test:** An Indian should say "she looks like us." A European should say "she could be from anywhere." Nobody's wrong. Nobody's sure.

### Hair

- Dark brown almost black with subtle warm chestnut highlights (visible only where light hits)
- High messy ponytail with face-framing pieces and baby hairs at temples
- Indian hair thickness and texture — voluminous, not fine
- One strand falling across forehead

### Accessories (ALL generations)

- 3 thin layered silver chain necklaces at different lengths (shortest at throat, longest with triangle pendant)
- 4-5 small silver studs climbing up one ear (helix, lobe, tragus)
- Thin leather wrap bracelet on one wrist
- Rings on 4 fingers (thin stacking bands + one small signet)
- Black minimal field watch (optional)

---

## Outfit Variants Catalog

Three locked outfit configurations. Every generation must use one of these exactly.

### Variant 1: Standard Studio

- **Top:** Solid black opaque ribbed crop top (standalone garment, no visible bra/bralette)
- **Harness:** Matte black leather chest harness with thin straps and small silver buckles, X-pattern across upper chest, wrapping around shoulders — worn OVER the crop top like tactical equipment (signature piece)
- **Bottom:** High-waisted black cargo pants with thin silver chain clipped from belt loop to pocket
- **Backdrop:** Exposed brick wall with deep teal neon ambient glow
- **Lighting:** Warm amber key light from left + cool teal fill from right edge
- **Props:** Studio condenser microphone on chrome boom arm (always present in wider shots), small monstera/pothos leaf in soft-focus background, atmospheric haze catching backlight

### Variant 2: Tactical

- **Top:** Black crop top as under-layer
- **Over-layer:** Tactical vest (any color appropriate to location/story context)
- **Bottom:** High-waisted black cargo pants
- **Backdrop:** Location-adaptive (field reporting context — varies by course)
- **Props:** Earpiece, location-specific environmental details

### Variant 3: Band Tee

- **Top:** Faded black AC/DC t-shirt with red AC/DC lightning bolt logo
- **Under-layer:** Black sports bra visible underneath
- **Bottom:** High-waisted black cargo pants
- **Energy:** Casual, off-duty, approachable

---

## HARD RULES

Enforced silently on every generation. Never presented as user options.

| # | Rule | Rationale |
|---|------|-----------|
| H1 | **NO TATTOOS** in any generation, any angle, any outfit. EVER | User directive 2026-03-29. Sacred geometry forearm tattoo from original design is retired |
| H2 | AC/DC tee is ALWAYS `"faded black AC/DC t-shirt with red AC/DC lightning bolt logo"` | Never Iron Maiden, Def Leppard, or generic band tee |
| H3 | Under-layer is ALWAYS `"black sports bra"` (Band Tee) or `"black crop top"` (Tactical/Studio) | Same garment, same neckline, every time |
| H4 | Silver jewelry present in ALL generations: 3 layered chains, ear studs, nose hoop, leather bracelet | Character recognition anchors |
| H5 | Always photorealistic/cinematic rendering. NEVER flat editorial illustration | The Correspondent is video-native, not course-visual-native |
| H6 | Every prompt ends with `"No text, no titles, no labels, no letters, no numbers anywhere"` | Prevents garbled text artifacts |
| H7 | Always attach 2 reference images from leaner set for face consistency: `01-front.png` + one pose-specific image | Soul ID anchor + pose guidance |
| H8 | Every video prompt must be fully self-contained — no clip numbers, no cross-references to other prompts | Kling/Higgsfield only sees ONE prompt + TWO images per generation |

### Kling/Higgsfield Prompting Protocol

Each video generation prompt must describe a complete world:
1. **Full character description** — face, hair, outfit, jewelry (repeat every prompt, never abbreviate)
2. **Movement** — from frame A to frame B
3. **Environment details** — backdrop, lighting, props
4. **Dialogue/audio** — the line being delivered
5. **Timing cues** — duration, pacing
6. **Camera behavior** — angle, movement, focal length

Never reference "same outfit as Clip 1" or "three-quarter profile" without showing it in the uploaded frames. Visualize the full sequence before writing individual prompts to ensure consistency without cross-references.

---

## The Dhurandhar Principle

Songs in good Hindi cinema don't interrupt the film — they ARE the story in a different register. Mid-course elements follow the same principle: each one advances the narrative through a medium the text cannot match.

| Medium | When It's Natural | Learning Mechanism |
|--------|-------------------|-------------------|
| **Text** | When the learner needs to THINK | Analytical processing, frameworks, data |
| **Audio** | When they need to FEEL | Emotional state transfer, atmosphere |
| **A Face** | When they need to be CONFRONTED | Parasocial recognition, personal challenge |
| **Motion** | When they need to SEE a transformation | Before/after encoding, visual memory |
| **Silence** | When they need to SIT with what they learned | Absence as emphasis |

**The Test:** If you remove the element and the learning works just as well, it was decoration. If you remove it and the next screen lands weaker, it was structural.

---

## Seven Song Types

Each maps to a specific learning mechanism. Types 1-5 are audio/interaction. Type 6 is The Correspondent video. Type 7 is silence.

| Type | Name | Duration | Stack | Learning Mechanism | Placement | Cost |
|------|------|----------|-------|--------------------|-----------|------|
| 1 | The Hot Take Drop | 5 sec | 11Labs TTS v3, different voice, no SFX | Pattern interrupt — breaks scrolling rhythm | Between two story cards, contrarian perspective | ~$0.02 |
| 2 | The Before/After Reveal | 5 sec | No audio — pure tap interaction | Prediction error — commitment before revelation | Between two contrasting case studies | $0.00 |
| 3 | The One-Stat Punch | 8 sec | 11Labs TTS v3 (one sentence) + SFX API (impact sound) | Isolation — one devastating number pulled from prose | Before the screen that contextualizes the stat. Max 1/course | ~$0.10 |
| 4 | The Myth/Fact Flip | 5 sec | 11Labs TTS v3, one sentence stating WRONG explanation | Manufactured prediction error — voice plants wrong model, text corrects | Before any screen with counterintuitive explanation | ~$0.02 |
| 5 | The Curiosity Gap | 8 sec | 11Labs TTS v3, 2-3 sentences asking a question | Open loop — cognitive itch that next screen closes | Before key screens in final third of course | ~$0.03 |
| 6 | The Correspondent | 5-8 sec | Higgsfield Soul ID + Motion Control + Lipsync synced to 11Labs TTS v3 | Parasocial confrontation — a face says what learner is thinking | See Appearance Arc below | ~$1-3/course |
| 7 | The Silence | 3 sec | Nothing | Absence as emphasis — if you've layered audio, silence is the loudest sound | One per course, always on the final insight line | $0.00 |

---

## Appearance Arc

Three appearances per course. Each has a distinct frame, emotional register, and voice.

| Appearance | Placement | Leaner Pose Reference | Expression | Voice Register | Line Structure |
|-----------|-----------|----------------------|------------|---------------|---------------|
| **The Hook** | After Screen 1-2 | `08-leanin-anticipation.png` + `01-front.png` | Alert, anticipatory | Confident, measured | Promises what course reveals |
| **The Whisper** | After Screen 11-13 | `04-closeup-whisper.png` + `01-front.png` | Intense, direct | Intimate, `[whispers]` tag | Says what learner is thinking |
| **The Close** | Last screen | `05-leanback-closing.png` + `01-front.png` | Satisfied, knowing smirk | Calm, final | Course thesis in one sentence |

### Appearance Details

**The Hook** — Hand on mic, leaning forward. Slightly above conversational volume. The promise.
Example: *"What you're about to learn is how one country designed itself to survive what just happened. Pay attention — this is the part your company never builds."*

**The Whisper** — Tight face, one shoulder, intimate framing. 11Labs `[whispers]` tag drops to intimate register. The mirror.
Example: *"You're thinking about someone right now. Someone whose exit would break something nobody else understands."*

**The Close** — Coffee in hand, chair reclined, mic pushed aside. No urgency — the work is done. Followed by 3 seconds of silence (Type 7). The thesis.
Example: *"Your org chart is your bunker plan."*

### Line Writing Rules

- Max 15 words per Correspondent line (3 lines per course total)
- Each line must be structurally necessary (passes the Dhurandhar Test)
- The Hook promises. The Whisper mirrors. The Close distills.

---

## Song Score Template

A "Song Score" is the placement map of all mid-course elements for a specific course. Each course gets one.

### Variable Spacing Rule

Elements must NEVER appear at predictable intervals. The Instagram slot-machine principle — uncertainty IS the engagement.

- **Bad rhythm:** Audio every 3 screens (predictable, brain tunes out)
- **Good rhythm:** Screens 1-4 text, Screen 5 AUDIO, Screens 6-8 text, Screen 9 VIDEO, Screens 10-12 text, Screen 13 WHISPER, Screen 14 text, Screen 15 SILENCE

### Song Score Structure

```
| Position | Type | Element | Duration |
|----------|------|---------|----------|
| After Screen N | Type 6 | Correspondent Appearance 1 — "..." | 8 sec video |
| Before Screen N | Type 3 | One-Stat Punch — "stat" | 8 sec audio |
| Before Screen N | Type 4 | Myth/Fact Flip — Voice: "myth" / Text: "fact" | 5 sec audio |
| Screen N opening | Type 5 | Curiosity Gap — "question" | 8 sec audio |
| Between N and M | Type 1 | Hot Take — "contrarian line" | 5 sec audio |
| After Screen N | Type 6 | Correspondent Appearance 2 (whisper) — "..." | 8 sec video |
| Screen N last line | Type 6+7 | Correspondent Appearance 3 — "..." + Silence | 8 sec + 3 sec |
```

### Budget

- Target: ~53 seconds total added time across a full course
- Cost: $2-4 per course (one-time generation, served to all learners)
- Compare: Real presenter = Rs 15,000-50,000 minimum. The Correspondent costs Rs 250.

---

## Reference Image Set

All reference images live in `visuals/correspondent/leaner/`. Two are attached to every generation for face consistency.

| File | Purpose | Used In |
|------|---------|---------|
| `01-front.png` | **Primary face anchor** — used in ALL generations as reference image #1 | Hook, Whisper, Close |
| `02-quarter-left-tattoo.png` | Left-side angle reference. **DEPRECATED for tattoo visibility** — use only for angle, never for skin detail | Angle reference only |
| `03-quarter-right.png` | Right-side profile reference | Right-facing angles |
| `04-closeup-whisper.png` | Whisper appearance frame — tight face, intimate | Appearance 2 (The Whisper) |
| `05-leanback-closing.png` | Close appearance frame — reclined, satisfied | Appearance 3 (The Close) |
| `06-midspeech-lipsync.png` | Lipsync reference (mouth open, mid-speech) | Video lipsync calibration |
| `07-profile-back-muscles.png` | Back/shoulder angle reference | Over-shoulder compositions |
| `08-leanin-anticipation.png` | Hook appearance frame — leaning forward, alert | Appearance 1 (The Hook) |
| `09-hot-shoulder-lookback.png` | Over-shoulder glance, looking back at camera | Transition/reveal moments |
| `10-hot-desk-fullbody.png` | Full body reference — proportions, outfit, posture | Full-body compositions |
| `11-hot-wetlook-closeup.png` | Close-up face reference — alternative lighting | Supplementary face anchor |
| `12-hot-strap-candid.png` | Candid harness detail — strap/buckle reference | Studio outfit detail |
| `13-hot-alt-bandtee.png` | Band Tee variant reference — AC/DC tee + sports bra | Band Tee outfit generation |

### Selection Protocol

Every generation attaches exactly 2 images:
1. **Always** `01-front.png` (face anchor)
2. **Pose-specific** image matching the target appearance (see Appearance Arc table)

For Band Tee generations, also reference `13-hot-alt-bandtee.png` for outfit consistency.

---

## Gotchas

<!-- Promoted learnings from ugc-learnings.jsonl land here. See shared/ugc-learnings-protocol.md for the promotion lifecycle. -->
