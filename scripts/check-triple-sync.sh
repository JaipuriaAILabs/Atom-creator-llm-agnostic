#!/usr/bin/env bash
# Hook G: PostToolUse Write|Edit — MD-JSON-SQL triple-sync drift detector
# When any of the 3 course files is modified, checks the others for drift
# Does NOT auto-fix — reports drift and points to MD as source of truth
# Smart skip: if only 1 of 3 exists, passes silently

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Determine which type of file was modified and extract slug
SLUG=""
FILE_TYPE=""

if [[ "$FILE_PATH" == *"courses/JSONS/"* ]] && [[ "$FILE_PATH" == *.json ]]; then
  FILE_TYPE="json"
  SLUG=$(basename "$FILE_PATH" .json)
elif [[ "$FILE_PATH" == *"courses/sql/"* ]] && [[ "$FILE_PATH" == *.sql ]]; then
  FILE_TYPE="sql"
  SLUG=$(basename "$FILE_PATH" .sql | sed 's/-insert$//')
elif [[ "$FILE_PATH" == *"courses/"* ]] && [[ "$FILE_PATH" == *".md" ]]; then
  # Course markdown files — extract slug from filename
  BASENAME=$(basename "$FILE_PATH" .md)
  # Remove archetype suffix
  SLUG=$(echo "$BASENAME" | sed 's/-concept-sprint$//' | sed 's/-hands-on-guide$//')
  FILE_TYPE="md"
else
  exit 0
fi

if [[ -z "$SLUG" ]]; then
  exit 0
fi

# Find the companion files
MD_FILE=$(find "$PROJECT_DIR/courses" -maxdepth 1 -name "${SLUG}*.md" ! -path "*/specs/*" ! -path "*/sql/*" ! -name "batch-*" ! -name "COURSE-*" 2>/dev/null | head -1)
JSON_FILE="$PROJECT_DIR/courses/JSONS/${SLUG}.json"
SQL_FILE="$PROJECT_DIR/courses/sql/${SLUG}-insert.sql"

# Count how many files exist
EXISTING=0
[[ -f "$MD_FILE" ]] && EXISTING=$((EXISTING + 1))
[[ -f "$JSON_FILE" ]] && EXISTING=$((EXISTING + 1))
[[ -f "$SQL_FILE" ]] && EXISTING=$((EXISTING + 1))

# Smart skip: only check sync when 2+ files exist
if [[ "$EXISTING" -lt 2 ]]; then
  exit 0
fi

sleep 0.5

ERRORS=""

# Extract titles from each format
MD_TITLE=""
JSON_TITLE=""

if [[ -f "$MD_FILE" ]]; then
  MD_TITLE=$(grep -m1 "^# " "$MD_FILE" 2>/dev/null | sed 's/^# //' | xargs)
fi

if [[ -f "$JSON_FILE" ]]; then
  JSON_TITLE=$(python3 -c "
import json
with open('$JSON_FILE') as f:
    data = json.load(f)
print(data.get('metadata', {}).get('title', ''))
" 2>/dev/null || echo "")
fi

# Compare titles
if [[ -n "$MD_TITLE" ]] && [[ -n "$JSON_TITLE" ]] && [[ "$MD_TITLE" != "$JSON_TITLE" ]]; then
  ERRORS="${ERRORS}TRIPLE-SYNC DRIFT: Title mismatch — MD: '$MD_TITLE' vs JSON: '$JSON_TITLE'. Update JSON to match MD (source of truth).\n"
fi

# Compare screen counts
if [[ -f "$MD_FILE" ]] && [[ -f "$JSON_FILE" ]]; then
  MD_SCREENS=$(grep -c "^## Screen " "$MD_FILE" 2>/dev/null || echo "0")
  JSON_SCREENS=$(python3 -c "
import json
with open('$JSON_FILE') as f:
    data = json.load(f)
print(len(data.get('screens', [])))
" 2>/dev/null || echo "0")

  if [[ "$MD_SCREENS" -gt 0 ]] && [[ "$JSON_SCREENS" -gt 0 ]] && [[ "$MD_SCREENS" -ne "$JSON_SCREENS" ]]; then
    ERRORS="${ERRORS}TRIPLE-SYNC DRIFT: Screen count mismatch — MD has $MD_SCREENS screens vs JSON has $JSON_SCREENS screens. Investigate which is correct.\n"
  fi
fi

# Compare descriptions
if [[ -f "$MD_FILE" ]] && [[ -f "$JSON_FILE" ]]; then
  JSON_DESC=$(python3 -c "
import json
with open('$JSON_FILE') as f:
    data = json.load(f)
desc = data.get('metadata', {}).get('description', '')
print(desc[:80] if desc else '')
" 2>/dev/null || echo "")

  if [[ -n "$JSON_DESC" ]]; then
    # Check if MD contains this description somewhere
    MD_HAS_DESC=$(grep -c "$JSON_DESC" "$MD_FILE" 2>/dev/null || echo "0")
    # This is a soft check — descriptions may be formatted differently
  fi
fi

if [[ -n "$ERRORS" ]]; then
  echo -e "$ERRORS" >&2
  exit 2
fi

exit 0
