#!/usr/bin/env bash
# Hook: PostToolUse Write|Edit — Check if help-page.html is stale after plugin file changes
# Fires when shared/, commands/, hooks/, or learnings files are modified
# Warns to regenerate help page if it's older than the changed file

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-}"

# Detect which plugin's files were modified
PLUGIN_NAME=""
LEARNINGS_FILE=""

if [[ "$FILE_PATH" == *"atom-creator"* ]] || [[ "$FILE_PATH" == *"atom-creator-learnings"* ]]; then
  PLUGIN_NAME="atom-creator"
  LEARNINGS_FILE="$PROJECT_DIR/.claude/atom-creator-learnings.md"
elif [[ "$FILE_PATH" == *"taste"* ]] || [[ "$FILE_PATH" == *"taste-learnings"* ]]; then
  PLUGIN_NAME="rehearsal-taste"
  LEARNINGS_FILE="$PROJECT_DIR/.claude/taste-learnings.md"
elif [[ "$FILE_PATH" == *"podcast"* ]] || [[ "$FILE_PATH" == *"podcast-learnings"* ]]; then
  PLUGIN_NAME="rehearsal-podcast"
  LEARNINGS_FILE="$PROJECT_DIR/.claude/podcast-learnings.md"
else
  exit 0
fi

# Only trigger for learnings files, shared/ files, or command files
IS_RELEVANT=false
if [[ "$FILE_PATH" == *"learnings"* ]]; then
  IS_RELEVANT=true
elif [[ "$FILE_PATH" == *"/shared/"* ]]; then
  IS_RELEVANT=true
elif [[ "$FILE_PATH" == *"/commands/"* ]] && [[ "$FILE_PATH" == *.md ]]; then
  IS_RELEVANT=true
elif [[ "$FILE_PATH" == *"/hooks/"* ]]; then
  IS_RELEVANT=true
fi

if [[ "$IS_RELEVANT" != "true" ]]; then
  exit 0
fi

# Find the help page for this plugin
HELP_PAGE=""
for SEARCH_DIR in \
  "$HOME/.claude/plugins/cache/rehearsal-dev/$PLUGIN_NAME" \
  "$HOME/.claude/plugins/marketplaces/rehearsal-dev/$PLUGIN_NAME"; do
  FOUND=$(find "$SEARCH_DIR" -name "help-page.html" 2>/dev/null | head -1)
  if [[ -n "$FOUND" ]]; then
    HELP_PAGE="$FOUND"
    break
  fi
done

if [[ -z "$HELP_PAGE" ]] || [[ ! -f "$HELP_PAGE" ]]; then
  echo "DOCS: $PLUGIN_NAME help-page.html not found — consider creating one." >&2
  exit 0
fi

# Compare modification times
HELP_MTIME=$(stat -f %m "$HELP_PAGE" 2>/dev/null || echo "0")
FILE_MTIME=$(stat -f %m "$FILE_PATH" 2>/dev/null || echo "0")

if [[ "$FILE_MTIME" -gt "$HELP_MTIME" ]]; then
  # Count learnings if file exists
  LEARNINGS_COUNT=""
  if [[ -n "$LEARNINGS_FILE" ]] && [[ -f "$LEARNINGS_FILE" ]]; then
    COUNT=$(grep -c "^### " "$LEARNINGS_FILE" 2>/dev/null || echo "0")
    LEARNINGS_COUNT=" ($COUNT learnings captured)"
  fi
  echo "DOCS STALE: $PLUGIN_NAME help-page.html is older than recently modified files${LEARNINGS_COUNT}. Run /$(echo $PLUGIN_NAME):help to check, and regenerate if needed."
fi

exit 0
