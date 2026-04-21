---
name: atom-creator-final-audit
description: Run the external-evaluator-style audit as the final quality gate before shipping a course. Invoke when all prior stages pass and the user says "run final audit on {slug}" or /final-audit. Skeptical outsider perspective that catches issues internal audits may have normalized. Returns: docs/{slug}-external-audit-report.md plus fixes to MD/JSON/SQL.
license: MIT
recommendedAgent: content-auditor
---

# Atom Creator — Final Audit (Stage 6)

> Full pipeline: `:plan` → `:create` → `:audit` → `:assets` → `:db-insert` → `:final-audit` (you are here)

**Purpose:** Final quality gate before deployment. This is NOT the same as the internal `:audit` — it takes a skeptical, outsider perspective using the `external-atom-audit` skill (if installed) or an equivalent one-pass review. Catches issues that internal pipeline audits may have normalized through repeated exposure.

**Prerequisites (all prior stages should be complete):**
1. Spec: `courses/specs/{slug}-spec.md` (status `GENERATED — audit passed`)
2. Course MD: `courses/{slug}-concept-sprint.md` or `courses/{slug}-hands-on-guide.md`
3. Course JSON: `courses/JSONS/{slug}.json`
4. Visuals: `visuals/{slug}/` directory with generated images
5. SQL: `courses/sql/{slug}-insert.sql`

**Input:** `{slug}`
**Output:**
- External audit report at `docs/{slug}-external-audit-report.md`
- Fixed course files (MD + JSON + SQL) if HIGH findings exist
- Spec status updated to `SHIP-READY — final audit passed` on success

---

## Pipeline

### Step 0: Environment Check

If `.atom-creator-config.json` is missing, run `atom-creator-setup` first. Ensure Perplexity MCP is registered — the final audit relies on live web verification.

### Step 1: Validate Prerequisites

1. Load `shared/status-definitions.md` for the status acceptance table.
2. Locate spec at `courses/specs/{slug}-spec.md`. If absent, list available specs and suggest the closest match.
3. Verify spec status using Protocol F (Final Audit):
   - **Accepts:** `GENERATED — audit passed`, `REFINED — v{any}`, `SHIP-READY — final audit passed` (for re-audit)
   - **Soft gate:** `CREATED` → warn: "Internal audit hasn't passed yet. The final audit on unaudited content may produce many findings. Run `/audit {slug}` first, or proceed at your own risk."
   - **Rejects:** `DRAFT` (must run `/plan` first), `APPROVED` (must run `/create` first)
4. Verify course MD and JSON exist.
5. Check visuals and SQL — warn if missing but proceed.

### Step 2: Read Learnings

If `atom-creator-learnings.md` exists, read the factual verification, biographical claims, and structural integrity sections.

### Step 3: Run External Audit

Dispatch to the `external-atom-audit` skill (if installed as a sibling skill) via OpenCode's skill composition. Otherwise run the audit inline using the content-auditor agent with this mandate:

> **You are an external evaluator seeing this course for the first time. Apply 4-pass methodology:**
>
> **Pass 1 — Factual verification (web-required).** For every named person, company, stat, and date: web-search or perplexity-search to confirm. Classify each finding as VERIFIED (with source URL), FABRICATED (searched, not found), or UNVERIFIABLE (marked for editorial review). "Directionally verified" and "flagged as suspicious" are NOT acceptable.
>
> **Pass 2 — Narrative craft.** Apply P30-P36 (Person-Place-Action opening, sensory density, forward-momentum bottom lines, company depth before concept, midpoint story card). Dinner-table test on laterals.
>
> **Pass 3 — Structural integrity.** Run C1-C72 mechanical checks via the structural-validator agent. Verify triple-sync (MD ↔ JSON ↔ SQL).
>
> **Pass 4 — Reputational risk.** Named persons used as POSITIVE examples → check for post-research legal / reputational issues (Dan Price precedent).
>
> **Output:** a structured report at `docs/{slug}-external-audit-report.md` with findings classified HIGH / MEDIUM / LOW. Each finding lists: location, quoted text, source URL (or FABRICATED marker), prescriptive fix.

Wait for the report to be written to disk.

### Step 4: Process Findings

Read `docs/{slug}-external-audit-report.md`. For each finding:

**HIGH (fix required):**
1. Fix in MD — locate the passage and apply the correction
2. Fix in JSON — locate the corresponding block, sync the fix (triple-sync)
3. Auto-capture to `atom-creator-learnings.jsonl` using `shared/learnings-protocol.md` schema:
   ```json
   {
     "id": "{date}-{seq}",
     "date": "{YYYY-MM-DD}",
     "command": ":final-audit",
     "slug": "{slug}",
     "domain": "{classified domain prefix}",
     "severity": "HIGH",
     "finding": "{what went wrong}",
     "rule": "{corrective rule}",
     "applies_to": "{target skill + step}",
     "status": "NEW",
     "recurrence": 1,
     "related_ids": []
   }
   ```
4. **Recurrence check:** before writing, scan existing entries for matching `domain` + fuzzy match on `finding`. If match found, increment `recurrence` instead of creating a duplicate.

**MEDIUM (user review):**
- Present to user inline: "Finding X: [description]. Fix? (yes/no/defer)"
- Fix if approved. Do not auto-capture (not generalisable enough).

**LOW (informational):**
- Include in summary. No fixes.

### Step 5: Regenerate SQL (if content changed)

If any HIGH fixes modified MD or JSON:
1. Re-run the `atom-creator-db-insert` skill inline to regenerate `courses/sql/{slug}-insert.sql`.

### Step 6: Update Spec Status

If all HIGH findings are resolved (or none existed):
1. Update spec `**Status:**` to `SHIP-READY — final audit passed`
2. Append `**Final Audit Date:** {YYYY-MM-DD}` to the spec header

If HIGH findings remain unresolved: keep current status, note in summary.

### Step 7: Summary

```
## Final Audit Complete  [Stage 6/6]

  Report:   docs/{slug}-external-audit-report.md
  Findings: {N} HIGH, {N} MEDIUM, {N} LOW
  HIGH fixes applied: {N}/{total HIGH}
  Learnings captured: {N} new entries to .jsonl

  Status: SHIP-READY — final audit passed

  Course is ready for deployment.
  → Paste courses/sql/{slug}-insert.sql into Supabase SQL Editor
```

---

## Gotchas

- **Biographical claims (Nooyi precedent):** External audit catches person biography errors internal audit missed. Wrong job category (engineer vs strategist) is HIGH severity. Verify against LinkedIn + company pages — NOT Wikipedia.
- **Financial date anchoring:** Every revenue, AUM, market cap figure needs a date anchor ("as of FY24"). Stale figures from sources >12 months old must be reverified.
- **Reputational risk (Dan Price precedent):** Named persons in POSITIVE examples must be checked for post-research legal / reputational issues. Depersonalize to company when story works without the individual.
- **Guard hook:** SHIP-READY status is protected by a TS hook (`guard-ship-ready.ts`). The hook HARD BLOCKS the status update unless `docs/{slug}-external-audit-report.md` exists AND contains structured findings (HIGH / MEDIUM / LOW headers) AND all 3 course files (MD + JSON + SQL) exist on disk.
- **External audit still needs live web access.** Plan phase on cheap local models is fine; final audit MUST have Perplexity MCP + WebFetch. If neither is registered, this skill refuses to run.
