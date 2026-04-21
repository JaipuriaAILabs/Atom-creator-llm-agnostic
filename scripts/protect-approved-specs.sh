#!/usr/bin/env bash
# Hook D: PreToolUse Write — protect approved/generated/ship-ready specs from accidental overwrite
# Exit code 2 = block write + warn Claude about status reset

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# Only check spec files
if [[ ! "$FILE_PATH" == *"courses/specs/"* ]] || [[ ! "$FILE_PATH" == *"-spec.md" ]]; then
  exit 0
fi

# Check if the file already exists with a protected status
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

CURRENT_STATUS=$(grep -oE "Status: (APPROVED|GENERATED|SHIP-READY)[^|]*" "$FILE_PATH" 2>/dev/null | head -1 || echo "")

if [[ -n "$CURRENT_STATUS" ]]; then
  echo "WARNING: Spec file has '$CURRENT_STATUS'. Writing to this file will reset the pipeline state. If you are re-running :create, the status will reset to CREATED (forcing re-audit). If you are re-running :plan, the status will reset to DRAFT. Proceed only if this is intentional." >&2
  # Use exit 0 with JSON to show warning but NOT block
  # (PreToolUse exit 2 would block entirely — we want to warn, not prevent)
  python3 -c "
import json
output = {
    'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'permissionDecision': 'ask',
        'permissionDecisionReason': 'This spec has $CURRENT_STATUS. Writing will reset pipeline state. Are you sure?'
    }
}
print(json.dumps(output))
"
  exit 0
fi

exit 0
