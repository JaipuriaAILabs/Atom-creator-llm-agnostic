#!/usr/bin/env bash
# Hook: PreToolUse Write — BLOCK SHIP-READY stamp unless external audit report exists
# This prevents stamping SHIP-READY without running the actual /external-atom-audit skill
# Exit 2 = block the write

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")
CONTENT=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('content',''))" 2>/dev/null || echo "")

# Only check spec files being written
if [[ ! "$FILE_PATH" == *"courses/specs/"* ]] || [[ ! "$FILE_PATH" == *"-spec.md" ]]; then
  exit 0
fi

# Only fire if the new content contains SHIP-READY
if ! echo "$CONTENT" | grep -q "SHIP-READY"; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
SLUG=$(basename "$FILE_PATH" -spec.md)

# Check 1: External audit report must exist
REPORT=$(find "$PROJECT_DIR/docs" -name "*${SLUG}*external*audit*" -o -name "*external*audit*${SLUG}*" 2>/dev/null | head -1)

if [[ -z "$REPORT" ]]; then
  echo "BLOCKED: Cannot stamp SHIP-READY for '$SLUG' — no external audit report found in docs/." >&2
  echo "REQUIRED: Run /atom-creator:final-audit $SLUG which invokes /external-atom-audit." >&2
  echo "The /external-atom-audit skill must generate a report at docs/external-audit-${SLUG}.md." >&2
  echo "Ad-hoc review agents do NOT satisfy this requirement." >&2
  exit 2
fi

# Check 2: Report must contain structured findings (basic format validation)
if ! grep -q "Finding\|VERIFIED\|PASS\|FAIL\|Severity\|Rectif" "$REPORT" 2>/dev/null; then
  echo "BLOCKED: External audit report exists but appears incomplete or malformed: $REPORT" >&2
  echo "REQUIRED: The report must contain structured findings from /external-atom-audit." >&2
  echo "Re-run /atom-creator:final-audit $SLUG to generate a proper audit report." >&2
  exit 2
fi

# Check 3: Course files must be in sync (all 3 exist)
MD_FILE=$(find "$PROJECT_DIR/courses" -maxdepth 1 -name "${SLUG}*.md" ! -path "*/specs/*" ! -path "*/sql/*" ! -name "batch-*" ! -name "COURSE-*" 2>/dev/null | head -1)
JSON_FILE="$PROJECT_DIR/courses/JSONS/${SLUG}.json"
SQL_FILE="$PROJECT_DIR/courses/sql/${SLUG}-insert.sql"

MISSING=""
[[ ! -f "$MD_FILE" ]] && MISSING="${MISSING} MD"
[[ ! -f "$JSON_FILE" ]] && MISSING="${MISSING} JSON"
[[ ! -f "$SQL_FILE" ]] && MISSING="${MISSING} SQL"

if [[ -n "$MISSING" ]]; then
  echo "BLOCKED: Cannot stamp SHIP-READY — missing course files:${MISSING}" >&2
  echo "All three (MD + JSON + SQL) must exist and be synced before shipping." >&2
  echo "Run /atom-creator:db-insert $SLUG if SQL is missing." >&2
  exit 2
fi

exit 0
