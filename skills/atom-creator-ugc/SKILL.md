---
name: atom-creator-ugc
description: Generate a Correspondent UGC video clip for a course — photorealistic still via nano-banana-pro, then image-to-video with native dialogue + ambient audio via fal.ai Kling v3 Pro. Invoke when the spec has a ## UGC Concept or ## Song Score section, or when the user says /ugc {slug}. Returns: PNG still + MP4 video clip in visuals/correspondent/{slug}/.
license: MIT
recommendedAgent: visual-director
---

# Atom Creator — UGC Correspondent Video

> The Correspondent is a recurring character who appears mid-course as an immersive UGC-style video element. This skill generates a single clip for a single course.

**Purpose:** Generate a photorealistic still frame of The Correspondent via Nano Banana Pro (Gemini Pro), then animate it into a short video clip with native dialogue and ambient audio via fal.ai Kling v3 Pro. The clip is placed mid-course at a narratively meaningful point to create a pattern interrupt.

**Prerequisites:**
1. Course markdown: `courses/{slug}-concept-sprint.md` or `courses/{slug}-hands-on-guide.md`
2. `FAL_KEY` set in `.env`
3. `visuals/generate_video_fal.py` script exists
4. nano-banana-pro skill installed (photorealistic still generation)
5. Reference images in `visuals/correspondent/leaner/` (min 5 PNGs for face-consistency anchoring)

**Input:** `{slug}`
**Output:**
- Still frame: `visuals/correspondent/{slug}/{slug}-ugc-{appearance}.png`
- Video clip: `visuals/correspondent/{slug}/{slug}-ugc-{appearance}-video.mp4`

**Interaction:** 7 interactive panels. In god-mode invocation, panels 1-2 (script) and panel 5 (video direction) use defaults; panels 3 (still direction), 4 (photo review), 6 (video review) still require approval — these are creative-judgment checkpoints.

---

## Pipeline Overview

| Step | What | Gate? |
|---|---|---|
| 0 | Context Load + Environment Check | No |
| 1 | Song Score — Placement + Script | YES (Panels 1 + 2) |
| 2 | Still Frame Art Direction | YES (Panel 3) |
| 3 | Still Frame Generation (iterative, max 5 iterations) | YES (Panel 4) |
| 4 | Video Prompt Assembly | YES (Panel 5) |
| 5 | Video Generation (iterative, max 3 iterations) | YES (Panel 6) |
| 6 | Review + Learning Capture | YES (Panel 7) |

---

## Step 0: Context Load + Environment Check

### 0.1 — Environment Check
If `.atom-creator-config.json` missing, run `atom-creator-setup` first.

### 0.2 — Load Shared Files
Read in parallel:
1. `shared/ugc-correspondent-system.md` — character design bible (face, hair, outfit variants, appearance arc, outfit HARD RULES)
2. `shared/ugc-kling-prompting.md` — Kling 3.0 prompt engineering (Master Formula, Speaker syntax, Sound syntax, camera vocabulary)
3. `shared/ugc-photo-rules.md` — NBP photo generation rules (reference selection, iteration limits, photorealistic requirements)
4. `shared/ugc-learnings-protocol.md` — self-learning lifecycle (domain prefixes, JSONL schema, promotion routing)

### 0.3 — Load Session Learnings
Read if present:
- `ugc-learnings.jsonl` — machine-readable staged learnings
- `ugc-learnings.md` — human-readable log

### 0.4 — Verify Dependencies

```bash
grep -q "FAL_KEY" .env && echo "SET" || echo "MISSING"
ls visuals/generate_video_fal.py 2>/dev/null
ls visuals/correspondent/leaner/*.png 2>/dev/null | wc -l
```

If `FAL_KEY` missing: abort with "FAL_KEY not found in .env. Get a key at https://fal.ai/dashboard/keys".
If video script missing: abort.
If reference image count <5: abort with "Need at least 5 reference images in visuals/correspondent/leaner/. Found {N}. Run `/setup` to auto-provision."

Verify nano-banana-pro skill is available (check skill list).

### 0.5 — Course Context

Read course MD (whichever path exists). Extract: total screen count, screen titles, screen types, key narrative beats, company names, framework name, emotional arc.

---

## Step 1: Song Score — Placement + Script

Determine WHERE the Correspondent appears, WHAT she says, and HOW she says it.

### 1.1 — Panel 1: Placement & Appearance

Analyze the course structure. Identify natural placement points:
- **The Hook (after Screen 1-2):** Orient/bridge gap — learner has setup, not payoff. Lean-in pose, eyes engaged.
- **The Midpoint (Screen 6-8):** Theory saturation — pattern interrupt. Close-up, reframe the concept viscerally.
- **The Whisper (after Screen 11-13):** Intimate, personal. Says what the learner is thinking. Half-smile.
- **The Close (last screen):** Calm knowing smirk. Course thesis in one sentence. Lean-back, arms relaxed.

Print Panel 1 with auto-calculated suggestions:

```
Q1: Which appearance type for this course?
  1. The Hook (after Screen 1-2)
  2. The Whisper (after Screen 11-13)
  3. The Close (last screen)
  4. Other (specify placement)

Q2: After which screen should the clip appear?
Suggested:
  After Screen 2  "{screen 2 title}" — orient-to-bridge gap
  After Screen 7  "{screen 7 title}" — midpoint, theory saturation
  After Screen 12 "{screen 12 title}" — penultimate, before resolution

Q3: What is the emotional beat?
  1. Learner just absorbed something heavy — needs confrontation
  2. Learner is mid-theory — needs a pattern interrupt
  3. Learner finished the journey — needs the thesis
  4. Other (describe mood)
```

**God-mode default:** Q1=The Whisper, Q2=after midpoint screen, Q3=option 1 (post-revelation confrontation).

### 1.2 — Generate Dialogue Options

Read the 2 screens BEFORE and 1 screen AFTER the chosen placement point.

Write 3 dialogue options, each ≤25 words. Each must:
- Bridge the narrative gap between preceding and following screens
- Match the emotional beat from Panel 1 Q3
- Sound natural spoken aloud by a young Indian woman, early twenties (NDTV international correspondent register)
- End with a statement (unless appearance type is The Hook — then a question is allowed)

### 1.3 — Panel 2: Script & Delivery

```
Q1: Which dialogue option?
  1. "{option 1}"
  2. "{option 2}"
  3. "{option 3}"
  4. Write my own

Q2: Delivery register?
  - Conversational (default)
  - Intimate whisper
  - Knowing smirk
  - Urgent / breaking-news energy
```

**God-mode default:** Option 1, Conversational.

---

## Step 2: Still Frame Art Direction (Panel 3)

Compose outfit, backdrop, pose, palette, exposure.

**HARD RULES (non-negotiable):**
- AC/DC tee + black sports bra are constants (from `ugc-correspondent-system.md`)
- NO tattoos on the model
- Face anchoring via reference images — pass 2-3 from `visuals/correspondent/leaner/` to NBP

Present Panel 3 for approval (even in god-mode — this is a creative checkpoint):
```
Outfit: AC/DC tee + black sports bra + {jacket/scarf based on appearance type}
Backdrop: {location that matches emotional beat}
Palette: {3-color accent + neutrals}
Pose: {pose concept — lean-in / close-up / lean-back per appearance type}
Exposure: {natural / dramatic / moody}
Camera angle: {eye-level / slight low / slight high}
```

User approves or edits.

---

## Step 3: Still Frame Generation (Panel 4)

Delegate to the nano-banana-pro skill. Pass reference images + art direction + model: `gemini-3-pro-image-preview`.

Iterate up to 5 times. After each iteration, verify aspect ratio with `sips -g pixelWidth -g pixelHeight` — Gemini silently drops portrait config and outputs 16:9 often. Regenerate if wrong.

User approves final still via Panel 4. God-mode: auto-accept after 3 attempts if no obvious face mismatch.

Write final PNG to `visuals/correspondent/{slug}/{slug}-ugc-{appearance}.png`.

---

## Step 4: Video Prompt Assembly (Panel 5)

Load `ugc-kling-prompting.md`. Assemble the Kling v3 Pro prompt using the Master Formula:

```
Subject: [subject description — short]
Action: [specific motion — walks, turns, gestures, looks]
Scene: [environment + lighting]
Camera: [angle + movement — static / slow push / orbit]
Audio: [Speaker: dialogue line] [Sound: ambient layer]
Style: [photorealistic, natural, un-cinematic]
Silent tail: [0.5s static at the end for clean edit]
Duration: [5s by default]
```

**HARD RULES:**
- Self-contained prompt — no references to other clips ("clip 3", "same outfit as earlier")
- Dialogue in `Speaker:` line ≤25 words
- Ambient sound in `Sound:` line (one layer only)
- Silent tail required for clean editing

Panel 5 presents the assembled prompt for user approval. God-mode: auto-accept if no HARD rule violations.

---

## Step 5: Video Generation (Panel 6)

Run `python3 visuals/generate_video_fal.py` with:
- Input image: the approved still from Step 3
- Prompt: the approved prompt from Step 4
- Model: `kling-video/v3/pro/image-to-video`
- Duration: 5s (default)

Iterate up to 3 times. After each: user reviews the MP4 via Panel 6. Approve / regenerate with adjustments / abort.

Write final MP4 to `visuals/correspondent/{slug}/{slug}-ugc-{appearance}-video.mp4`.

---

## Step 6: Review + Learning Capture (Panel 7)

Print a review panel:
```
Clip: visuals/correspondent/{slug}/{slug}-ugc-{appearance}-video.mp4
Duration: 5s
Size: {MB}
Placement: after Screen {N}
Dialogue: "{line}"

Questions:
- Did the face match the reference? (yes / close / off)
- Did dialogue delivery match the register? (yes / too flat / too intense)
- Any ambient sound issues? (none / background noise / wrong layer)
```

For any "close" / "off" / issues, capture learning:

```json
{
  "id": "{date}-{seq}",
  "date": "{YYYY-MM-DD}",
  "command": ":ugc",
  "slug": "{slug}",
  "domain": "ugc-face | ugc-audio | ugc-composition | ugc-prompt-structure",
  "severity": "MEDIUM",
  "finding": "{what was off}",
  "rule": "{what to do differently}",
  "applies_to": ":ugc Step {N}",
  "status": "NEW",
  "recurrence": 1
}
```

Append to `ugc-learnings.jsonl` AND `ugc-learnings.md`.

---

## Output Summary

```
## UGC Clip Generated

### Still
  PNG: visuals/correspondent/{slug}/{slug}-ugc-{appearance}.png ✓
  Iterations: {N}

### Video
  MP4: visuals/correspondent/{slug}/{slug}-ugc-{appearance}-video.mp4 ✓
  Duration: 5s
  Iterations: {N}
  Placement: after Screen {N}

### Dialogue
  "{line}"

### Cost
  Still (NBP Pro): ~$0.134
  Video (Kling v3 Pro): ~$0.15-0.20
  Total: ~$0.28-0.35

Learnings captured: {N} entries to ugc-learnings.jsonl
```

---

## Gotchas

- **Outfit constants are HARD rules** — AC/DC tee + black sports bra every time. Deviation breaks character continuity across the course library.
- **No tattoos ever** on the Correspondent model — this has been a recurring violation.
- **Kling prompts must be self-contained** — no "same as clip 3" or "wearing outfit from earlier". Each prompt stands alone.
- **Silent tail at end** — 0.5s static finish makes editing into the course clean. Without it, clips feel cut mid-motion.
- **Aspect ratio verification** — Gemini Pro silently drops portrait config. Verify with `sips` after every generation.
- **Auto-provisioning reference images** — if `visuals/correspondent/leaner/` has <5 images, the setup skill copies from plugin assets. Manual placement into this directory also works.
