# Spec Versioning Protocol

Automatic spec snapshots after every status transition. Called by `:plan`, `:create`, `:audit`, `:refine`
before writing status updates. Provides rollback via `--restore` flag on `:create`.

---

## Snapshot Protocol

Called before every spec status write. Preserves the current state before overwriting.

### Steps

1. **Derive slug** from spec filename: `{slug}-spec.md` → `{slug}`
2. **Ensure history directory** exists:
   ```
   courses/specs/history/{slug}/
   ```
   Create with `mkdir -p` via Bash if absent. Do NOT error if it already exists.
3. **Copy current spec** to history with status + timestamp suffix:
   ```
   courses/specs/history/{slug}/{slug}-spec_{STATUS}_{YYYY-MM-DDTHH-MM-SS}.md
   ```
   - `STATUS` = the NEW status being written (DRAFT, APPROVED, CREATED, GENERATED, REFINED)
   - For REFINED status, use `REFINED-v{X.Y.Z}` as the status suffix (no spaces, filesystem-safe)
   - Timestamp = current time in filesystem-safe ISO format (hyphens, not colons)
   - Use Bash `cp` to copy the file
4. **Write the updated spec** to the main location: `courses/specs/{slug}-spec.md`
5. **Cleanup:** Count snapshots for this slug with the same `STATUS` prefix pattern:
   ```
   courses/specs/history/{slug}/{slug}-spec_{STATUS}_*.md
   ```
   If more than 3 exist for that status level, delete the oldest ones (keep most recent 3).
   Sort by filename — the timestamp suffix ensures chronological ordering.

### Partial regen variant

When called from `:create --screens`, use a compound suffix instead of plain `_CREATED_`:
```
_CREATED_PARTIAL-{screen-list}_
```
Example: `{slug}-spec_CREATED_PARTIAL-5-8-12_2026-03-14T10-50-00.md`

This distinguishes partial-regen snapshots from full-regen snapshots in the history directory.

---

## Restore Protocol

Triggered by `/atom-creator:create {slug} --restore {STATUS}`.

Reverts the spec file to the most recent snapshot of the specified status.

### Steps

1. **Glob** for matching snapshots:
   ```
   courses/specs/history/{slug}/{slug}-spec_{STATUS}_*.md
   ```
2. **Sort by filename** (timestamp suffix = chronological). Pick the LAST entry (most recent).
3. **If not found:** Error with available snapshots:
   ```
   No {STATUS} snapshot found for {slug}.
   Available snapshots:
   [list all files in courses/specs/history/{slug}/]
   ```
4. **Copy** the snapshot to the main spec location:
   ```
   cp courses/specs/history/{slug}/{slug}-spec_{STATUS}_*.md → courses/specs/{slug}-spec.md
   ```
5. **Output:**
   ```
   Spec restored to {STATUS} from {timestamp}.
   Current spec status is now {STATUS}.
   ```
6. **STOP** — do not proceed with any further `:create` steps. The restore is a standalone operation.

---

## Example

After a full pipeline run (`plan` → `create` → `audit`), the history directory contains:

```
courses/specs/history/brand-manager-downward-brand-extension/
  brand-manager-downward-brand-extension-spec_APPROVED_2026-03-14T10-35-00.md
  brand-manager-downward-brand-extension-spec_CREATED_2026-03-14T10-50-00.md
  brand-manager-downward-brand-extension-spec_GENERATED_2026-03-14T11-05-00.md
```

After a partial regen of screens 5, 8, 12:
```
  brand-manager-downward-brand-extension-spec_CREATED_PARTIAL-5-8-12_2026-03-14T11-20-00.md
```
