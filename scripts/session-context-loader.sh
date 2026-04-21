#!/usr/bin/env bash
# Hook C: SessionStart — inject learnings and batch diversity context
# stdout from SessionStart hooks is added to Claude's context

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LEARNINGS_FILE="$PROJECT_DIR/.claude/atom-creator-learnings.md"
DIVERSITY_LOG="$PROJECT_DIR/courses/batch-diversity-log.md"

OUTPUT=""

# Load learnings if they exist
if [[ -f "$LEARNINGS_FILE" ]]; then
  LEARNINGS_SIZE=$(wc -l < "$LEARNINGS_FILE" | tr -d ' ')
  if [[ "$LEARNINGS_SIZE" -gt 0 ]]; then
    OUTPUT="${OUTPUT}[atom-creator learnings loaded: $LEARNINGS_SIZE lines of accumulated corrections]\n"
    # Include just the section headers and key rules (not full file to save context)
    OUTPUT="${OUTPUT}$(grep -E '^### |^\*\*Rule:\*\*|^\*\*Correction:\*\*' "$LEARNINGS_FILE" 2>/dev/null | head -30)\n"
  fi
fi

# Load diversity log summary if it exists
if [[ -f "$DIVERSITY_LOG" ]]; then
  # Extract just the genre distribution summary
  GENRE_COUNTS=$(grep -A 20 "Creative Decisions" "$DIVERSITY_LOG" 2>/dev/null | grep -E "^\|" | head -15)
  if [[ -n "$GENRE_COUNTS" ]]; then
    OUTPUT="${OUTPUT}\n[batch diversity context loaded — recent genre/role distribution available in courses/batch-diversity-log.md]\n"
  fi
fi

if [[ -n "$OUTPUT" ]]; then
  echo -e "$OUTPUT"
fi

exit 0
