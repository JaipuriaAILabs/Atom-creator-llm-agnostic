# UGC Kling Prompting — Video Generation Rules for Correspondent (v1.0.0)

> Loaded by `:ugc` Step 4. Kling 3.0 prompt engineering rules for Correspondent video generation.

---

## Generation Stack

| Component | Value |
|-----------|-------|
| **Engine** | fal.ai Kling v3 Pro via `visuals/generate_video_fal.py` |
| **Mode** | Image-to-video (still frame uploaded, animated by prompt) |
| **Audio** | Native — dialogue + ambient sound in single generation pass |
| **Aspect** | 9:16 portrait (vertical/mobile) |
| **Duration** | 5s (loops, social hooks) or 10s (narrative clips) |
| **Cost** | ~$0.10-0.15/generation via fal.ai |

```bash
python3 visuals/generate_video_fal.py \
    --image <still-frame.png> \
    --prompt "full scene prompt" \
    --output <output.mp4> \
    --duration 10s \
    --aspect 9:16
```

---

## Master Formula

Every prompt follows this six-part structure:

```
[Scene/Environment] + [Subject & Appearance] + [Action Timeline] + [Camera Movement] + [Audio & Atmosphere] + [Technical Specs]
```

| Section | Guidance |
|---------|----------|
| **Scene/Environment** | Specific location with texture: "dimly-lit newsroom, blue monitor glow on walls, coffee steam rising from desk." NOT "a room." |
| **Subject & Appearance** | Full character description every time. Kling has zero memory between generations — shorthand like "same woman" produces inconsistent results. |
| **Action Timeline** | Temporal flow: first/then/finally. Describe what CHANGES over the clip duration. One main action per shot. |
| **Camera Movement** | Explicit cinematic verb from the vocabulary table below. Without camera direction, Kling improvises unpredictably. |
| **Audio & Atmosphere** | Speaker attribution, voice tone, ambient sound. See Speaker & Audio Syntax section. |
| **Technical Specs** | Duration, aspect ratio, motion endpoints. Always include a motion endpoint ("then settles still") to prevent generation hangs. |

**Writing rules:**
- Cinematic motion verbs: dolly, tracking, whip-pan, crash zoom, rack focus — NOT "moves" or "goes"
- Name real light sources: neon signs, candlelight, golden hour, LED panels — NOT "dramatic lighting"
- Include texture: grain, lens flares, condensation, fabric sheen, smoke
- 1-3 rich sentences per shot (specificity > length)
- Every prompt is a complete world — no clip numbers, no cross-references to other generations

---

## Image-to-Video Rules

The still frame IS the scene. Kling preserves identity, layout, and composition from the uploaded image.

| Rule | Rationale |
|------|-----------|
| **Don't re-describe static elements** | The image already shows the environment, clothing, and composition. Prompt the CHANGES. |
| **BUT use full scene descriptions** | For our Correspondent talking-head use case, user tested both minimal and full prompts. Full won — Kling produces more natural motion and better lip-sync when given complete scene context. |
| **Focus on motion and action** | Describe what moves: hair, eyes, lips, gestures, camera. Not what exists. |
| **Match aspect ratio to source image** | 9:16 source frame = 9:16 generation. Mismatched ratios cause cropping artifacts. |
| **Set an explicit end state** | "Settles still, holds gaze steady on camera" — prevents the model from inventing motion in the final frames. |

---

## Speaker & Audio Syntax

```
[Speaker: Correspondent] "dialogue text" in a [tone] [accent] voice.
Add [sound: description] synchronized with [action].
Background ambient: [environment description].
```

### Voice Direction

The Correspondent's voice signature:

```
Indian English accent, educated, cosmopolitan — NDTV international correspondent, not regional newsreader.
```

This exact phrase (or close variant) goes in EVERY prompt. Without it, Kling defaults to American English.

### Delivery Modes

| Mode | When to use | Phrase |
|------|-------------|--------|
| **Provocative tease** | DEFAULT/PREFERRED. Hook lines, opening clips. | `low and direct, as if sharing a secret only you should hear` |
| Cold matter-of-fact | Data reveals, stat drops | `flat and clinical, no emotion, pure information delivery` |
| Urgent breaking news | Crisis/stakes moments | `quick pace, slight breathlessness, controlled urgency` |
| Quiet confession | Vulnerability beats, personal reflection | `soft, almost a whisper, intimate and confessional` |

### Audio Levels

- Ambient NEVER overpowers dialogue. Ambient is atmospheric texture, not competition.
- Ambient RISES after dialogue stops — fills the silence in the tail seconds.
- Sound effects synchronize with specific actions: `Add [sound: papers shuffling] synchronized with [hand gesture].`

---

## Camera Movement Vocabulary

Merged reference from both Kling skills. Use these exact phrases in prompts.

| Movement | Effect | Example phrase |
|----------|--------|---------------|
| **Static camera** / locked-off shot | Composed, observational. DEFAULT for talking head. | `static camera, locked off, medium close-up` |
| **Slow push-in** / dolly in | Builds intimacy, creates emphasis on punchline | `gentle push-in begins as she says 'Now ask yourself'` |
| **Pull back** / dolly out | Creates distance, reveals context | `slow pull back revealing the full newsroom` |
| **Dolly zoom** | Vertigo/dramatic reveal | `dolly zoom creating disorienting depth shift` |
| **Tracking shot** | Follows subject laterally | `camera tracks alongside as she walks` |
| **Whip-pan** | Energy, surprise, scene transition | `whip-pan to reveal the door` |
| **Crash zoom** | Shock, emphasis on a single detail | `sudden crash zoom on the object in her hand` |
| **Rack focus** | Shifts attention between planes | `rack focus from foreground hand to background figure` |
| **Handheld / shoulder-cam** | Raw, documentary feel | `handheld shoulder-cam with subtle sway` |
| **Pan left / right** | Horizontal rotation, lateral reveal | `slow pan right across the desk` |
| **Tilt up / down** | Vertical reveal | `slow tilt up from hands to face` |
| **Orbit / arc shot** | Circular movement around subject | `camera orbits slowly around subject` |
| **Crane up / down** | Vertical camera elevation change | `crane up revealing the cityscape below` |
| **Low-angle tracking** | Heroic, imposing presence | `low-angle tracking shot, subject towers above` |

### Movement Modifiers

| Modifier | Effect |
|----------|--------|
| `slow` / `gentle` / `subtle` | Reduced speed — DEFAULT for Correspondent clips |
| `smooth` / `fluid` | No jerky motion |
| `gradual` | Progressive change over duration |
| `snap` / `whip` | Fast, abrupt (use sparingly) |

---

## The Silent Tail Pattern

After dialogue ends, leave 1-2 seconds of just ambient sound + character holding gaze.

```
She finishes speaking, settles still, holds gaze steady on camera.
Ambient [environment sound] rises gently to fill the silence.
```

**Why this matters:**
- Prevents abrupt cutoff at the end of the clip
- Creates a natural "beat" for editing — the tail is the cut point
- The phrase "settles still, holds gaze steady on camera" is also a **motion endpoint** that prevents generation hangs (Kling 3.0 gets stuck when it can't find a resting state)
- Gives the viewer a moment to absorb the dialogue before the next clip

---

## Static-Then-Push Camera (DEFAULT)

The standard camera pattern for Correspondent talking-head clips:

```
Timeline:
  0%–60%  → Static medium close-up. Camera locked off. No movement.
  60%–85% → Gentle push-in begins on the pivot/punchline line.
  85%–100% → Settles to tight close-up. Camera holds static for final silent seconds.
```

**Why this works:** The push-in creates emphasis through CONTRAST with the preceding stillness. If the camera moves from the start, the push-in has no impact. The static opening establishes baseline, the push breaks it at the punchline, and the static tail lets it land.

**Example prompt fragment:**
```
Camera: static medium close-up for first 6 seconds. Gentle push-in begins
as she says "[pivot line]" and settles to tight close-up. Camera holds
static for final 2 seconds as ambient sound rises.
```

For 5s clips: static for 3s, push-in for 1.5s, static tail for 0.5s.
For 10s clips: static for 6s, push-in for 2.5s, static tail for 1.5s.

---

## Negative Prompt Template

Add to every generation. Customize by removing items that conflict with intent.

```
smiling broadly, laughing, cartoonish, bright saturated colors, morphing, blurry,
disfigured hands, extra fingers, frozen expression, stock photo aesthetic, text overlays,
tattoos, shouting, dramatic gestures, over-acting, news anchor energy, jerky motion,
face distortion, abrupt ending
```

**Correspondent-specific additions:**
- `news anchor energy` — prevents default broadcast persona (we want intimate, not performative)
- `over-acting` / `dramatic gestures` — the Correspondent is restrained, not theatrical
- `abrupt ending` — reinforces the silent tail pattern

---

## Weak to Strong Examples

| Element | Weak | Strong |
|---------|------|--------|
| **Dialogue delivery** | "She speaks into camera" | "She speaks low and direct into camera as if sharing a secret only you should hear" |
| **Camera movement** | "Camera moves closer" | "Gentle push-in begins as she says 'Now ask yourself' and settles to tight close-up" |
| **Camera (general)** | "Camera follows person" | "Handheld shoulder-cam drifts behind subject with subtle sway" |
| **Subject** | "A woman walking" | "Woman in faded black AC/DC t-shirt, heels clicking wet cobblestone" |
| **Environment** | "In a city" | "Narrow alley, steam from grates, warm amber light from a single street lamp" |
| **Lighting** | "Dramatic lighting" | "Flickering neon casting magenta/cyan across wet pavement" |
| **Texture** | "It looks realistic" | "Rain beading on leather jacket, condensation on glass, visible breath in cold air" |
| **Motion** | "She walks away" | "She turns slowly, hair catches light, disappears around corner" |
| **Audio** | "Background noise" | "Background ambient: distant traffic hum, occasional horn, wind through open window" |
| **Ending** | (no ending specified) | "She settles still, holds gaze steady on camera. Ambient cafe sounds rise gently." |

---

## Iteration Patterns

| Rule | Detail |
|------|--------|
| **Max 3 iterations per clip** | Beyond 3, the prompt is fundamentally wrong — rethink the scene, don't micro-adjust |
| **Learning capture** | Each rejection captures a learning with `ugc_video_*` domain prefix in learnings system |
| **Common fix: simplify action** | Remove gestures, reduce to face + eyes + mouth. Kling handles 1-2 actions well, 3+ poorly |
| **Common fix: adjust tone** | Switch delivery mode (provocative to matter-of-fact) if energy is wrong |
| **Common fix: change ambient** | Ambient sound type drives mood more than lighting description |
| **Common fix: camera timing** | Push-in too early = no contrast. Push-in too late = truncated. Adjust the 60% split point |
| **Never retry same prompt** | If generation fails or looks wrong, change at least one structural element before retrying |

---

## Model Selection

| Model | Use case | Notes |
|-------|----------|-------|
| **V3** | All prompt-driven work | Our default. Best multi-shot, native audio, 15s max |
| **O3** | Voice cloning, 4K delivery, reference-based consistency | Future upgrade path if we need cloned Correspondent voice |
| **2.5 Turbo** | Rapid drafts before committing to V3 generation | No audio — text/visual only, useful for framing tests |

V3 is the default for all Correspondent video work. O3 is the upgrade path when voice cloning or 4K output becomes a requirement. 2.5 Turbo is for rapid visual tests when audio doesn't matter.

---

## Correspondent Character Constants

Every Correspondent prompt must include these exact strings for character consistency:

| Element | Exact string | Notes |
|---------|-------------|-------|
| **Tee** | `faded black AC/DC t-shirt with red AC/DC lightning bolt logo` | NEVER varies |
| **Under-layer** | `black sports bra visible underneath` | Or `black crop top` for harness outfit |
| **Voice** | `Indian English accent, educated, cosmopolitan` | NDTV international correspondent energy |

Poses, angles, expressions, hair, and location change between clips. The tee and under-layer do NOT.

---

## Self-Contained Prompt Rule (HARD)

Kling 3.0 sees exactly ONE text box and TWO uploaded images per generation. It has zero awareness of:
- Clip numbers ("Clip 2" is meaningless)
- Previous generations ("same outfit as before" doesn't work)
- External descriptions ("three-quarter profile" must be shown in the frame, not just described)
- Character sheets or reference documents

**Every prompt is a complete world.** Describe the character, movement, environment, dialogue, timing, and camera as if nothing else exists. Visualize the full sequence before writing individual prompts to ensure consistency across clips without relying on cross-references.

---

## Gotchas

<!-- Promoted learnings from ugc-learnings.jsonl land here. See shared/ugc-learnings-protocol.md for the promotion lifecycle. -->

### G1: Situational framing over mood adjectives for subdued clips (promoted 2026-03-29)

Abstract mood words (`calm`, `contemplative`, `measured`) produce **energetic** output from Kling v3 — even combined with stillness directions. Kling responds to narrative situation, not adjective lists.

**For subdued/contemplative delivery, use situational framing:**
- "end of a very long shift"
- "murmured, almost to herself"
- "as if she has said this a hundred times and it never stops being true"
- "like an afterthought spoken at the end of a long day"

**Do NOT rely on:** `calm`, `quiet`, `contemplative`, `measured`, `restrained` — these produce broadcast-quality "composed" energy, not genuine low-energy delivery.

### G2: Anti-energy negative prompt terms for subdued clips (promoted 2026-03-29)

The default negative prompt template suppresses morphing/distortion but does NOT suppress high energy. For subdued clips, **extend** the negative prompt with:

```
energetic, fast talking, nodding, head bobbing, animated, expressive, loud, confident, performative, presenting
```

These terms are not in the default template and must be added explicitly whenever the target delivery is subdued, contemplative, or casual.
