#!/usr/bin/env bash
# Hook parity test — runs the 5 most critical bash hooks and their TS ports
# against the same fixtures, then diffs exit codes.
#
# Critical hooks covered:
#   1. validate-json
#   2. validate-sql
#   3. protect-approved-specs
#   4. guard-ship-ready
#   5. enforce-pipeline-order
#
# Other hooks (check-triple-sync, check-mcq-balance, check-docs-freshness,
# check-game-patterns, check-aspect-ratio, check-storytelling-signals,
# guard-game-generation) are TODO — the 5 here cover the HARD-BLOCK paths,
# which are the ones whose semantics must never drift.
#
# Usage: bash tests/hook-parity.sh

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURES="$REPO_ROOT/tests/fixtures"
SCRIPTS="$REPO_ROOT/scripts"
RUN_TS="$REPO_ROOT/tests/run-ts-hook.js"

# Ensure TS build is present
if [[ ! -d "$REPO_ROOT/dist" ]]; then
  echo "dist/ missing — run: npm run build" >&2
  exit 1
fi

PASS=0
FAIL=0
RESULTS=()

record() {
  local name="$1" ok="$2" detail="$3"
  if [[ "$ok" == "PASS" ]]; then
    PASS=$((PASS + 1))
    RESULTS+=("  ✓ $name — $detail")
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("  ✗ $name — $detail")
  fi
}

# -----------------------------------------------------------------------------
# bash hook driver — sends Claude-Code-style JSON on stdin, captures exit code
# -----------------------------------------------------------------------------
run_bash_hook() {
  local hook="$1" file_path="$2" content_file="$3"
  local content=""
  if [[ -n "$content_file" && -f "$content_file" ]]; then
    content=$(cat "$content_file")
  fi

  python3 -c "
import json, sys
print(json.dumps({
  'tool_input': { 'file_path': '''$file_path''', 'content': '''$content''' }
}))
" | bash "$SCRIPTS/$hook" >/dev/null 2>&1
  echo "$?"
}

run_ts_hook() {
  local hook="$1" file_path="$2" content_file="$3"
  if [[ -n "$content_file" ]]; then
    node "$RUN_TS" "$hook" "$file_path" --content "$content_file" >/dev/null 2>&1
  else
    node "$RUN_TS" "$hook" "$file_path" >/dev/null 2>&1
  fi
  echo "$?"
}

compare() {
  local name="$1" bash_rc="$2" ts_rc="$3"
  # Normalize: bash hooks use 0=ok, 2=block; TS uses 0=ok, 2=block.
  # A perfect match is bash==ts. A near-match (e.g., bash 0-warn vs TS 0) is
  # still PASS — exit-code semantic equality.
  if [[ "$bash_rc" == "$ts_rc" ]]; then
    record "$name" PASS "both returned $bash_rc"
  else
    record "$name" FAIL "bash=$bash_rc, ts=$ts_rc"
  fi
}

# -----------------------------------------------------------------------------
# 1. validate-json — invalid JSON should block
# -----------------------------------------------------------------------------
# The bash hook only triggers for files under courses/JSONS/. We stage the
# fixture into a temp workspace mirroring that layout.
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

mkdir -p "$TMPDIR/courses/JSONS"

# 1a. invalid JSON
# NOTE: The original bash hook silently falls through on JSON parse errors
# (python3 -c "..." || echo "0" swallows the ValueError and returns exit 0).
# The TS port throws correctly and exits 2. This is a semantic improvement,
# not a regression — we assert the TS hook blocks while the bash one does not.
cp "$FIXTURES/invalid.json" "$TMPDIR/courses/JSONS/invalid.json"
B1=$(run_bash_hook "validate-json-on-save.sh" "$TMPDIR/courses/JSONS/invalid.json" "")
T1=$(run_ts_hook "validate-json" "$TMPDIR/courses/JSONS/invalid.json" "")
if [[ "$B1" == "0" && "$T1" == "2" ]]; then
  record "validate-json: invalid JSON (TS improves on bash)" PASS "bash=0 (original bug), ts=2 (correct)"
else
  compare "validate-json: invalid JSON blocks" "$B1" "$T1"
fi

# 1b. deprecated value key blocks
cp "$FIXTURES/deprecated-value-key.json" "$TMPDIR/courses/JSONS/deprecated.json"
B2=$(run_bash_hook "validate-json-on-save.sh" "$TMPDIR/courses/JSONS/deprecated.json" "")
T2=$(run_ts_hook "validate-json" "$TMPDIR/courses/JSONS/deprecated.json" "")
compare "validate-json: deprecated value key blocks" "$B2" "$T2"

# 1c. valid JSON passes
cp "$FIXTURES/valid-course.json" "$TMPDIR/courses/JSONS/valid.json"
B3=$(run_bash_hook "validate-json-on-save.sh" "$TMPDIR/courses/JSONS/valid.json" "")
T3=$(run_ts_hook "validate-json" "$TMPDIR/courses/JSONS/valid.json" "")
compare "validate-json: valid JSON passes" "$B3" "$T3"

# -----------------------------------------------------------------------------
# 2. validate-sql — description column blocks
# -----------------------------------------------------------------------------
mkdir -p "$TMPDIR/courses/sql"
cp "$FIXTURES/sql-with-description-column.sql" "$TMPDIR/courses/sql/bad-insert.sql"
B4=$(run_bash_hook "validate-sql-on-save.sh" "$TMPDIR/courses/sql/bad-insert.sql" "")
T4=$(run_ts_hook "validate-sql" "$TMPDIR/courses/sql/bad-insert.sql" "")
compare "validate-sql: description column blocks" "$B4" "$T4"

# Valid SQL passes
cp "$FIXTURES/sql-valid.sql" "$TMPDIR/courses/sql/ok-insert.sql"
B5=$(run_bash_hook "validate-sql-on-save.sh" "$TMPDIR/courses/sql/ok-insert.sql" "")
T5=$(run_ts_hook "validate-sql" "$TMPDIR/courses/sql/ok-insert.sql" "")
compare "validate-sql: valid SQL passes" "$B5" "$T5"

# -----------------------------------------------------------------------------
# 3. protect-approved-specs — APPROVED spec write warns, doesn't block
# -----------------------------------------------------------------------------
# bash hook exits 0 with warning (PreToolUse "ask"), ts hook exits 0 with warn.
mkdir -p "$TMPDIR/courses/specs"
cp "$FIXTURES/approved-spec/courses/specs/test-slug-spec.md" \
   "$TMPDIR/courses/specs/test-slug-spec.md"
B6=$(run_bash_hook "protect-approved-specs.sh" "$TMPDIR/courses/specs/test-slug-spec.md" "")
T6=$(run_ts_hook "protect-approved-specs" "$TMPDIR/courses/specs/test-slug-spec.md" "")
compare "protect-approved-specs: APPROVED warns, doesn't block" "$B6" "$T6"

# -----------------------------------------------------------------------------
# 4. guard-ship-ready — SHIP-READY without external audit is BLOCKED
# -----------------------------------------------------------------------------
# bash hook uses CLAUDE_PROJECT_DIR to locate docs/. TS uses ATOM_CREATOR_PROJECT_DIR.
BLOCKED_ROOT="$FIXTURES/ship-ready-blocked"
BLOCKED_SPEC="$BLOCKED_ROOT/courses/specs/blocked-slug-spec.md"
BLOCKED_CONTENT="$BLOCKED_ROOT/ship-ready-content.md"

B7=$(CLAUDE_PROJECT_DIR="$BLOCKED_ROOT" run_bash_hook "guard-ship-ready.sh" "$BLOCKED_SPEC" "$BLOCKED_CONTENT")
T7=$(ATOM_CREATOR_PROJECT_DIR="$BLOCKED_ROOT" run_ts_hook "guard-ship-ready" "$BLOCKED_SPEC" "$BLOCKED_CONTENT")
compare "guard-ship-ready: no audit report HARD BLOCKS" "$B7" "$T7"

# With audit report + all 3 course files → both pass
OK_ROOT="$FIXTURES/ship-ready-ok"
OK_SPEC="$OK_ROOT/courses/specs/ok-slug-spec.md"
OK_CONTENT="$OK_ROOT/ship-ready-content.md"
B8=$(CLAUDE_PROJECT_DIR="$OK_ROOT" run_bash_hook "guard-ship-ready.sh" "$OK_SPEC" "$OK_CONTENT")
T8=$(ATOM_CREATOR_PROJECT_DIR="$OK_ROOT" run_ts_hook "guard-ship-ready" "$OK_SPEC" "$OK_CONTENT")
compare "guard-ship-ready: valid SHIP-READY passes" "$B8" "$T8"

# -----------------------------------------------------------------------------
# 5. enforce-pipeline-order — CREATED status triggers soft warn (exit 0 in both)
# -----------------------------------------------------------------------------
CREATED_SPEC="$TMPDIR/courses/specs/created-spec.md"
cat > "$CREATED_SPEC" <<'EOF'
# Spec: created

Status: CREATED
EOF
B9=$(CLAUDE_PROJECT_DIR="$TMPDIR" run_bash_hook "enforce-pipeline-order.sh" "$CREATED_SPEC" "")
T9=$(ATOM_CREATOR_PROJECT_DIR="$TMPDIR" run_ts_hook "enforce-pipeline-order" "$CREATED_SPEC" "")
compare "enforce-pipeline-order: CREATED status → soft warn" "$B9" "$T9"

# -----------------------------------------------------------------------------
# Report
# -----------------------------------------------------------------------------
echo ""
echo "Hook parity results:"
for r in "${RESULTS[@]}"; do
  echo "$r"
done
echo ""
echo "Passed: $PASS | Failed: $FAIL | Total: $((PASS + FAIL))"
echo ""
echo "Coverage notes:"
echo "  Covered (5): validate-json, validate-sql, protect-approved-specs,"
echo "               guard-ship-ready, enforce-pipeline-order"
echo "  TODO: check-triple-sync, check-mcq-balance, check-docs-freshness,"
echo "        check-game-patterns, check-aspect-ratio, check-storytelling-signals,"
echo "        guard-game-generation"

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
exit 0
