#!/usr/bin/env bash
# Hook F: PostToolUse Write — validate SQL INSERT files for course_content table
# Catches: description column (doesn't exist), missing ON CONFLICT, pre-flight JSON check
# Exit code 2 = block + feed error to Claude

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# Only check SQL files in courses/sql/
if [[ ! "$FILE_PATH" == *"courses/sql/"* ]] || [[ ! "$FILE_PATH" == *.sql ]]; then
  exit 0
fi

sleep 0.5

if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

ERRORS=""
SQL_CONTENT=$(cat "$FILE_PATH")

# Check 1: No standalone 'description' column reference
# The course_content table has NO description column — it lives inside course_metadata JSONB
# Pattern: look for 'description' as a column name in INSERT (col1, col2, description, ...)
DESC_AS_COLUMN=$(echo "$SQL_CONTENT" | grep -ciE '^\s*(description|"description")\s*,' || echo "0")
DESC_IN_INSERT=$(echo "$SQL_CONTENT" | grep -ciE 'INSERT\s+INTO.*\(.*description.*\)' || echo "0")

if [[ "$DESC_AS_COLUMN" -gt 0 ]] || [[ "$DESC_IN_INSERT" -gt 0 ]]; then
  ERRORS="${ERRORS}SQL ERROR: Found 'description' as a standalone column. The course_content table has NO description column — description lives inside course_metadata JSONB. Including it causes INSERT failure. Remove the description column and put the value inside course_metadata.\n"
fi

# Check 2: ON CONFLICT upsert present
HAS_UPSERT=$(echo "$SQL_CONTENT" | grep -ci "ON CONFLICT" || echo "0")

if [[ "$HAS_UPSERT" -eq 0 ]]; then
  ERRORS="${ERRORS}SQL WARNING: No ON CONFLICT clause found. Every course INSERT should use ON CONFLICT upsert to handle re-runs safely.\n"
fi

# Check 3: Pre-flight JSON validation — check if the source JSON uses deprecated "value" keys
# Derive slug from SQL filename
SLUG=$(basename "$FILE_PATH" .sql | sed 's/-insert$//')
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
JSON_FILE="$PROJECT_DIR/courses/JSONS/${SLUG}.json"

if [[ -f "$JSON_FILE" ]]; then
  VALUE_COUNT=$(python3 -c "
import json
with open('$JSON_FILE') as f:
    data = json.load(f)
count = 0
for screen in data.get('screens', []):
    for block in screen.get('blocks', []):
        if block.get('type') == 'text' and 'value' in block and 'text' not in block:
            count += 1
print(count)
" 2>/dev/null || echo "0")

  if [[ "$VALUE_COUNT" -gt 0 ]]; then
    ERRORS="${ERRORS}SQL ERROR: Source JSON ($JSON_FILE) has $VALUE_COUNT text blocks using deprecated 'value' key. Fix the JSON first before generating SQL — SQL embeds the JSON verbatim, propagating the rendering failure to the database.\n"
  fi
fi

if [[ -n "$ERRORS" ]]; then
  echo -e "$ERRORS" >&2
  exit 2
fi

exit 0
