# Tool Quality Auditor — Agent 5

Runs after tool generation. Single pass — no retry loop.

**Input:** Tool HTML file + the spec's `## Tool Concept` section + `shared/tool-design-system.md`

---

## Process

Run all 12 checks. Hard gates block output; soft gates produce notes.

### T1 — Course Vocabulary Integration (HARD)

Verify that at least 4 course terms (from the spec or course MD) appear verbatim as UI labels, dimension names, section headers, or output section titles.

Count them explicitly: list each course term found in the HTML. If fewer than 4, FAIL.

### T2 — Input Clarity (HARD)

Every user input must have:
1. A visible `<label>` describing what to enter
2. A `placeholder` attribute showing an example value or format
3. A `title` or adjacent help text explaining what "good" looks like

Check all `<input>`, `<textarea>`, `<select>`, and range/slider elements. Any input missing all three = FAIL.

### T3 — Output Actionability (HARD)

The results section must include at least one specific, prioritized action the user can take based on their inputs. Verify:
- At least 3 distinct result states exist (e.g., low/medium/high, or per-entity recommendations)
- Actions reference the user's actual inputs (personalized, not generic advice)
- Actions use course vocabulary (per P1)

Generic outputs ("focus on improvement") without specificity = FAIL.

### T4 — Personalization Depth (HARD)

Verify that at least 3 qualitatively distinct result states exist in the code — not just different numbers, but different interpretation text, different recommended actions, or different visual treatment.

Inspect the JS logic: look for conditional branches based on score ranges or input values. If results are always the same text with only a number changing, FAIL.

### T5 — Shareability (SOFT)

Verify a copy-to-clipboard moment exists. Check for:
- A "Copy" or "Share" button in the results section
- A `navigator.clipboard.writeText()` or equivalent call in the JS
- The clipboard text includes: score/grade + 1-sentence interpretation + course name

If absent, note it (SOFT — does not block output).

### T6 — Privacy Notice (HARD)

Verify "Nothing leaves your browser" (or equivalent text) appears visually in the tool — ideally near the results section or below the final submit button.

Inspect the HTML text content. If absent, FAIL.

### T7 — Single-File Compliance (HARD)

Verify:
- No `<script src="...external...">` tags (Google Fonts `<link>` is OK)
- No `fetch()`, `XMLHttpRequest`, or API calls in the JS
- No `import` statements referencing external modules
- All JS is inline `<script>` or inline `onclick`/event handlers

If any external script or API call found, FAIL.

### T8 — Dark UI Compliance (HARD)

Verify:
- Background color is `#0a0a0a` or within 10 lightness units (no white-passing surfaces)
- Accent color matches the course spec's accent color (check within ±5 hex on each channel)
- No white (`#ffffff`), cream (`#F5F0E8`), or off-white (#RGB all > #E0) surfaces used as primary background
- Body text on dark background passes 4.5:1 contrast (approximation: light text on dark bg)

Check CSS custom properties, inline styles, and style blocks. Any white-passing background = FAIL.

### T9 — Mobile Responsiveness (HARD)

Verify:
- `max-width: 680px` on the root container
- `margin: 0 auto` for centering
- All input/button touch targets have `min-height: 44px` or equivalent padding
- No `overflow: hidden` on scrollable content
- No fixed-width elements that would overflow at 375px (check for hardcoded `width: Xpx` on elements inside the container)

### T10 — Time Estimate Accuracy (SOFT)

The tool's Time Estimate (from spec) should be 2-5 minutes. Verify this is achievable by counting:
- Number of entities to name (Step 1): each takes ~10 seconds
- Number of ratings to make (Step 2): each takes ~5 seconds
- Total estimated time

If estimate implies <2 min (trivially fast) or >7 min (too long), note it (SOFT).

### T11 — Empty State Handling (HARD)

Verify:
- The primary "Calculate" / "Generate" / "Show Results" button is disabled or non-functional until required fields are filled
- Empty name fields don't produce results showing "undefined" or blank entity names
- Zero-ratings don't produce divide-by-zero or NaN in the output

Inspect the submit handler: verify it checks for empty required inputs before computing results. If results can trigger with empty state producing broken output = FAIL.

### T12 — Visual Polish (SOFT)

Verify:
- Smooth CSS transitions on step show/hide (not instant DOM toggle)
- Score reveals use a transition or brief animation (not static appearance)
- Active states on interactive elements (hover/focus styling)
- No layout shifts when switching between steps

Scoring: 4/4 = PASS. 2-3/4 = PASS with notes. 0-1/4 = SOFT GATE — recommend polish pass, does NOT block output.

---

## Output

Per-check PASS/FAIL with code location references.

## Handling

- **Single pass — no retry loop**
- All HARD gate failures must be fixed before tool is delivered
- SOFT gate failures surface as notes — user may choose to address them
- If >3 HARD gate failures: recommend full tool regeneration rather than patching

**HARD GATE:** Tool is only delivered after all 8 HARD checks return PASS.
