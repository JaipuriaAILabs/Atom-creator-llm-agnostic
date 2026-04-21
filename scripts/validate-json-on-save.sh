#!/usr/bin/env bash
# Hook A: Validate course JSON schema on every Write/Edit
# Catches deprecated "value" keys, missing glossary practice, >3 column tables, etc.
# Exit code 2 = block + feed error to Claude

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# Only check course JSON files
if [[ ! "$FILE_PATH" == *"courses/JSONS/"* ]] || [[ ! "$FILE_PATH" == *.json ]]; then
  exit 0
fi

# Wait briefly for file to be written
sleep 0.5

if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

ERRORS=""

# Check 1: Deprecated "value" key instead of "text"
VALUE_COUNT=$(python3 -c "
import json, sys
with open('$FILE_PATH') as f:
    data = json.load(f)
count = 0
for screen in data.get('screens', []):
    for block in screen.get('blocks', []):
        if block.get('type') == 'text' and 'value' in block and 'text' not in block:
            count += 1
print(count)
" 2>/dev/null || echo "0")

if [[ "$VALUE_COUNT" -gt 0 ]]; then
  ERRORS="${ERRORS}SCHEMA ERROR: $VALUE_COUNT text block(s) use deprecated 'value' key instead of 'text'. Frontend renders these as blank. Fix: replace 'value' with 'text' in all text blocks.\n"
fi

# Check 2: Glossary blocks missing practice object
GLOSSARY_NO_PRACTICE=$(python3 -c "
import json, sys
with open('$FILE_PATH') as f:
    data = json.load(f)
count = 0
for screen in data.get('screens', []):
    for block in screen.get('blocks', []):
        if block.get('type') == 'glossary' and 'practice' not in block:
            count += 1
print(count)
" 2>/dev/null || echo "0")

if [[ "$GLOSSARY_NO_PRACTICE" -gt 0 ]]; then
  ERRORS="${ERRORS}SCHEMA ERROR: $GLOSSARY_NO_PRACTICE glossary block(s) missing 'practice' object. Frontend renders glossary as learn+test cards — missing practice breaks rendering (C34 HARD GATE).\n"
fi

# Check 3: Tables with >3 columns
WIDE_TABLES=$(python3 -c "
import json, sys
with open('$FILE_PATH') as f:
    data = json.load(f)
count = 0
for screen in data.get('screens', []):
    for block in screen.get('blocks', []):
        if block.get('type') == 'table':
            headers = block.get('headers', [])
            if len(headers) > 3:
                count += 1
print(count)
" 2>/dev/null || echo "0")

if [[ "$WIDE_TABLES" -gt 0 ]]; then
  ERRORS="${ERRORS}SCHEMA ERROR: $WIDE_TABLES table(s) have >3 columns. Narrative-first artifact rendering requires max 3 columns (C53 HARD GATE).\n"
fi

# Check 4: Text blocks missing font field
MISSING_FONT=$(python3 -c "
import json, sys
with open('$FILE_PATH') as f:
    data = json.load(f)
count = 0
for screen in data.get('screens', []):
    for block in screen.get('blocks', []):
        if block.get('type') == 'text' and 'font' not in block:
            count += 1
print(count)
" 2>/dev/null || echo "0")

if [[ "$MISSING_FONT" -gt 0 ]]; then
  ERRORS="${ERRORS}SCHEMA ERROR: $MISSING_FONT text block(s) missing 'font' field. Required: 'font': 'body' or 'font': 'heading'.\n"
fi

# Check 5: Deprecated "above_content" placement
DEPRECATED_PLACEMENT=$(grep -c '"above_content"' "$FILE_PATH" 2>/dev/null || echo "0")

if [[ "$DEPRECATED_PLACEMENT" -gt 0 ]]; then
  ERRORS="${ERRORS}SCHEMA ERROR: Found deprecated 'above_content' placement. Use 'hero' only.\n"
fi

if [[ -n "$ERRORS" ]]; then
  echo -e "$ERRORS" >&2
  exit 2
fi

exit 0
