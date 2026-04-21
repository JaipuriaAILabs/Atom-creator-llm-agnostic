# UGC Photo Generation Rules — Nano Banana Pro (Gemini Pro)

> Loaded by :ugc Step 2-3. Photo generation rules for Correspondent still frames via Nano Banana Pro.

---

## Generation Command

```bash
uv run "${SKILL_DIR}/scripts/image.py" \
  --prompt "..." \
  --output "visuals/correspondent/{slug}/{slug}-ugc-{appearance}.png" \
  --reference "visuals/correspondent/leaner/{pose-ref}.png" \
  --reference "visuals/correspondent/leaner/01-front.png" \
  --model pro --size 2K --aspect portrait
```

Where `SKILL_DIR` = Nano Banana Pro skill directory. Always `--model pro`, always `--aspect portrait`, always `--size 2K`.

---

## Reference Image Selection

| Appearance | Primary Reference | Face Anchor |
|-----------|------------------|-------------|
| Hook | `08-leanin-anticipation.png` | `01-front.png` |
| Whisper | `04-closeup-whisper.png` | `01-front.png` |
| Close | `05-leanback-closing.png` | `01-front.png` |

**Rules:**
- Always pass exactly 2 `--reference` flags
- First reference = pose/energy match for the appearance type
- Second reference = `01-front.png` ALWAYS (face anchor — ensures facial consistency)
- Never omit the face anchor — Gemini drifts on face without it

---

## Prompt Structure (Photorealistic Mode)

```
Cinematic photorealistic portrait, shot on 35mm film with shallow depth of field.
[Character description — face, hair, expression]
[Outfit description — variant-specific]
[Backdrop/environment description]
[Pose and gesture]
[Lighting — warm amber key from left, cool fill from behind]
No text, no titles, no labels, no letters, no numbers anywhere.
```

**CRITICAL:** This is PHOTOREALISTIC mode, NOT flat editorial. The following keywords are BANNED in UGC prompts:
- `risograph` / `riso grain`
- `vector edges` / `crisp vector`
- `hard geometric shadows`
- `flat editorial illustration`
- Chinese style keywords (`扁平插画`, `Riso印刷`, etc.)
- `no photorealism` / `no gradients`

These belong to SeedDream editorial style and will produce wrong output from Gemini Pro.

---

## HARD RULES

1. **No tattoos** — EVER, in any prompt. Gemini adds tattoos to exposed skin unless explicitly prohibited. Include "no tattoos" in every prompt.

2. **Always photorealistic/cinematic** — Never editorial illustration. Gemini Pro is used specifically for photorealistic character work.

3. **Silver jewelry always present** — chains, ear studs, nose hoop, bracelet. These are character constants. Mention them in every prompt or Gemini drops them.

4. **Text removal line MANDATORY** — Every prompt MUST end with: `No text, no titles, no labels, no letters, no numbers anywhere.`

5. **Triple-negative for unwanted elements** — If asking for no patches/logos/badges, repeat the negative 3 times in different phrasings. Gemini sometimes ignores single negatives:
   ```
   No patches, no logos, no badges. The vest has no emblems or insignia.
   Clean fabric with no printed text, no sewn-on patches, no decorative badges.
   ```

6. **Full character descriptors every prompt** — Never abbreviate. Shortening "South Asian woman in her late twenties with short cropped dark hair" to "a woman" causes face drift and age rendering loss.

---

## Iteration Protocol

- **Max 5 iterations per still frame** (hard budget)
- After each rejection, capture what went wrong as a `ugc_photo_*` learning entry
- Iteration 6 only if iteration 5 was 90%+ correct and needs a minor fix

### Common Iteration Patterns (from session learnings)

| Iteration | Common Issue | Fix Direction |
|-----------|-------------|---------------|
| v1 | Too covered / not fashion-forward enough | Expose more — sleeveless, crop silhouettes |
| v2 | Overcorrected — too exposed or wrong direction | Pull back — tactical vest over crop top |
| v3 | Too military / face drift from references | Fashion-forward color (burgundy, sage) + reduce coverage area |
| v4 | Text/badges/patches appeared on clothing | Stronger negative prompts — be explicit about clean fabric |
| v5 | Patches still appearing despite negatives | Triple-negative phrasing (see HARD RULE 5) |
| v6 | Clean result | Lock and move on |

---

## SeedDream Learnings That Apply to NBP

These patterns were discovered in SeedDream editorial work but apply equally to Gemini Pro photorealistic:

- **No hex color codes** — Use descriptive color names: "warm amber," "deep midnight navy," "burgundy," "sage green." Hex codes render as visible text artifacts
- **Single-character compositions** — One person per frame. Multi-character scenes cause face blending and identity loss
- **Full character descriptors every prompt** — Don't abbreviate between iterations. Repeat age, ethnicity, hair style, build in every prompt
- **Comprehensive "No text" negative** — Don't limit to "no labels." Use the full line: "No text, no titles, no labels, no letters, no numbers anywhere"
- **Environmental descriptions over object lists** — "Warm amber light spilling across exposed brick" works better than "a room with a lamp and a brick wall and a table"

---

## Gotchas

<!-- Promoted learnings land here. Do not edit manually — managed by ugc-learnings-protocol.md lifecycle. -->

### G1: Use course-specific approved images as face anchors (promoted 2026-03-29)

Generic leaner pose references (e.g. `05-leanback-closing.png`) cause face drift when combined with environments that differ from the studio setting in the reference set. When generating additional appearances for a course that already has an approved Correspondent image, use **that approved image** as one of the two `--reference` flags instead of a generic leaner pose reference.

**Why:** The approved image carries rendering-specific details (skin tone response to specific lighting, feature proportions at a specific angle) that the generic leaner set cannot anchor. Gemini Pro blends reference context with prompt context — divergent environments cause the face to "reinterpret."

**Apply when:** Generating Hook → Whisper → Close sequence for the same course. The first appearance uses leaner refs. Subsequent appearances use the approved first appearance as face anchor + `01-front.png`.
