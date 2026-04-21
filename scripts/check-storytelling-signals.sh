#!/usr/bin/env bash
# Hook E: PreToolUse Write — lightweight storytelling anti-pattern detection
# Catches known prose failures BEFORE they're written to disk
# NOT a replacement for Agent 6 storytelling audit — this is a real-time guardrail

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")
CONTENT=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('content',''))" 2>/dev/null || echo "")

# Only check course markdown files
if [[ ! "$FILE_PATH" == *"courses/"* ]] || [[ ! "$FILE_PATH" == *".md" ]]; then
  exit 0
fi

# Skip spec files, audit reports, logs
if [[ "$FILE_PATH" == *"specs/"* ]] || [[ "$FILE_PATH" == *"audit-"* ]] || [[ "$FILE_PATH" == *"batch-"* ]]; then
  exit 0
fi

if [[ -z "$CONTENT" ]]; then
  exit 0
fi

ERRORS=""

# Check 1: ALL "You are [role/action]" on story screens (banned-phrases #31, v9.0.1)
# Banned: "You are sitting/reporting/managing/leading/the new/an IRGC/a product manager" etc.
# Allowed: MCQ stems, interview questions, resolution synthesis — but those are in JSON, not MD story prose
YOU_ARE_COUNT=$(echo "$CONTENT" | grep -ciE "^you are |[.!?] you are | — you are " || echo "0")
if [[ "$YOU_ARE_COUNT" -gt 0 ]]; then
  YOU_ARE_EXAMPLES=$(echo "$CONTENT" | grep -iE "^you are |[.!?] you are | — you are " | head -3 | sed 's/^/  → /')
  ERRORS="${ERRORS}STORYTELLING: Found $YOU_ARE_COUNT instance(s) of 'You are' on story screens. ALL second-person role-play framing is banned on story/narrative screens (banned-phrases #31). Use third-person journalism instead. Exemptions: MCQ stems, interview questions, resolution synthesis.\nExamples found:\n${YOU_ARE_EXAMPLES}\n"
fi

# Check 2: Triple-repetition pattern (feedback_no_triple_repetition)
# Detect "X. Y. Z." same-structure enumeration patterns
TRIPLE_PATTERN=$(echo "$CONTENT" | python3 -c "
import sys, re
text = sys.stdin.read()
# Find sequences of 3+ sentences starting with the same word
sentences = re.split(r'[.!?]\s+', text)
for i in range(len(sentences) - 2):
    words = [s.split()[0].lower() if s.split() else '' for s in sentences[i:i+3]]
    if words[0] and words[0] == words[1] == words[2] and words[0] not in ('the', 'a', 'in', 'on', 'at', 'to'):
        print(f'Triple repetition starting with \"{words[0]}\" near: {sentences[i][:50]}...')
        break
" 2>/dev/null || echo "")

if [[ -n "$TRIPLE_PATTERN" ]]; then
  ERRORS="${ERRORS}STORYTELLING: $TRIPLE_PATTERN. Vary sentence openings for better prose rhythm.\n"
fi

# Check 3: Screen 1 must name company on first line (P33 / feedback_company_named_first_line)
# Only check if this looks like a full course file with Screen 1
SCREEN_1=$(echo "$CONTENT" | sed -n '/## Screen 1/,/## Screen 2/p' | head -5)
if [[ -n "$SCREEN_1" ]]; then
  FIRST_PROSE_LINE=$(echo "$SCREEN_1" | grep -v "^##" | grep -v "^$" | grep -v "^\*\*" | head -1)
  if [[ -n "$FIRST_PROSE_LINE" ]]; then
    # Check if first line contains a company name (capitalized proper noun) or specific data
    HAS_PROPER_NOUN=$(echo "$FIRST_PROSE_LINE" | grep -cE '[A-Z][a-z]+[A-Z]|[A-Z]{2,}|[$₹€£¥]|[0-9]+%|[0-9]+\.[0-9]' || echo "0")
    if [[ "$HAS_PROPER_NOUN" -eq 0 ]]; then
      # Relaxed check — only warn if first line is generic "You" framing
      if echo "$FIRST_PROSE_LINE" | grep -qiE "^(you |imagine |picture |consider )"; then
        ERRORS="${ERRORS}STORYTELLING: Screen 1 opens with generic framing instead of company + data on the first line (P33). Company name + metric = journalism. Generic 'you' = training simulation.\n"
      fi
    fi
  fi
fi

# Check 4: Staccato screenplay openings (feedback_no_staccato_openings)
STACCATO=$(echo "$CONTENT" | head -20 | python3 -c "
import sys
lines = sys.stdin.readlines()
short_lines = 0
for line in lines[:10]:
    stripped = line.strip()
    if stripped and len(stripped.split()) <= 4 and not stripped.startswith('#') and not stripped.startswith('*'):
        short_lines += 1
if short_lines >= 3:
    print(f'{short_lines} very short lines in opening — looks like staccato screenplay framing')
" 2>/dev/null || echo "")

if [[ -n "$STACCATO" ]]; then
  ERRORS="${ERRORS}STORYTELLING: $STACCATO. Use flowing narrative prose, not fragmented dramatic beats. 'Slow Build' pattern: principle → context → specific case.\n"
fi

if [[ -n "$ERRORS" ]]; then
  echo -e "$ERRORS" >&2
  exit 2
fi

exit 0
