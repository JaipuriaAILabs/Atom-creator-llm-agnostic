#!/usr/bin/env bash
# Hook: PostToolUse Write|Edit — Enforce pipeline order after status transitions
# When a spec file status changes, warn about the REQUIRED next step
# Exit 0 = pass with stdout message, Exit 2 = warn

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# Only check spec files
if [[ ! "$FILE_PATH" == *"courses/specs/"* ]] || [[ ! "$FILE_PATH" == *"-spec.md" ]]; then
  exit 0
fi

# File must exist after write
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Extract current status from spec
STATUS=$(grep -oE "Status: [A-Z][^|]*" "$FILE_PATH" 2>/dev/null | head -1 | sed 's/Status: //' | xargs)

# Extract slug from filename
SLUG=$(basename "$FILE_PATH" -spec.md)

case "$STATUS" in
  "CREATED")
    echo "PIPELINE ENFORCEMENT: Course '$SLUG' is now CREATED."
    echo "REQUIRED NEXT STEP: Run /atom-creator:audit $SLUG (internal 6-agent audit)."
    echo "Do NOT generate assets, SQL, or mark as complete until the internal audit passes."
    exit 0
    ;;
  GENERATED*)
    # Check if external audit report already exists
    REPORT=$(find "$PROJECT_DIR/docs" -name "*${SLUG}*external*audit*" -o -name "*external*audit*${SLUG}*" 2>/dev/null | head -1)
    if [[ -z "$REPORT" ]]; then
      echo "PIPELINE ENFORCEMENT: Course '$SLUG' internal audit passed (GENERATED)."
      echo "REQUIRED NEXT STEP: Run /atom-creator:final-audit $SLUG (external audit via /external-atom-audit skill)."
      echo "The external audit MUST use the /external-atom-audit skill — ad-hoc agents do NOT count."
      echo "After external audit: rectify findings → update MD + JSON + SQL (triple-sync)."
      exit 0
    fi
    ;;
  SHIP-READY*)
    # All good — pipeline complete
    exit 0
    ;;
esac

exit 0
