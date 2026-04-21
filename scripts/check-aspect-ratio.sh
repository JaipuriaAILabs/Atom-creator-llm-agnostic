#!/usr/bin/env bash
# Hook B: Auto-verify image aspect ratio after Gemini generation
# Detects if a Bash command generated an image in visuals/, checks dimensions
# Exit code 2 if square (1024x1024) when landscape was expected

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")
TOOL_RESPONSE=$(echo "$INPUT" | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin).get('tool_response',{})))" 2>/dev/null || echo "{}")

# Only check if the command involved image generation in visuals/
if [[ ! "$COMMAND" == *"visuals/"* ]] && [[ ! "$TOOL_RESPONSE" == *"visuals/"* ]]; then
  exit 0
fi

# Find recently created/modified PNG files in visuals dirs
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
RECENT_IMAGES=$(find "$PROJECT_DIR/visuals" -name "*.png" -newer "$PROJECT_DIR/visuals" -mmin -1 2>/dev/null || true)

if [[ -z "$RECENT_IMAGES" ]]; then
  exit 0
fi

ERRORS=""
while IFS= read -r img; do
  if [[ -f "$img" ]]; then
    WIDTH=$(sips -g pixelWidth "$img" 2>/dev/null | tail -1 | awk '{print $2}')
    HEIGHT=$(sips -g pixelHeight "$img" 2>/dev/null | tail -1 | awk '{print $2}')

    FILENAME=$(basename "$img")

    # Mobile covers should be 3:4 (portrait)
    if [[ "$FILENAME" == *"cover-mobile"* ]]; then
      if [[ -n "$WIDTH" && -n "$HEIGHT" && "$WIDTH" -ge "$HEIGHT" ]]; then
        ERRORS="${ERRORS}ASPECT RATIO ERROR: $FILENAME is ${WIDTH}x${HEIGHT} (landscape/square) but should be 3:4 portrait for mobile cover. Regenerate with --ratio 3:4.\n"
      fi
    # Body images and desktop covers should be 4:3 (landscape)
    elif [[ "$FILENAME" == *"visual-"* ]]; then
      if [[ -n "$WIDTH" && -n "$HEIGHT" && "$WIDTH" -eq "$HEIGHT" ]]; then
        ERRORS="${ERRORS}ASPECT RATIO ERROR: $FILENAME is ${WIDTH}x${HEIGHT} (square). Gemini silently ignored aspect ratio config. Expected 4:3 landscape. Regenerate with --ratio 4:3.\n"
      fi
    fi
  fi
done <<< "$RECENT_IMAGES"

if [[ -n "$ERRORS" ]]; then
  echo -e "$ERRORS" >&2
  exit 2
fi

exit 0
