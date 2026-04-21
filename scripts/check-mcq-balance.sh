#!/usr/bin/env bash
# Hook H: PostToolUse Write — MCQ option length balance check
# Catches systematic bias where correct answer is always the longest option
# Also flags individual options that are too long (>80 chars = giveaway)
# Exit code 2 = block + feed error to Claude

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# Only check course JSON files
if [[ ! "$FILE_PATH" == *"courses/JSONS/"* ]] || [[ ! "$FILE_PATH" == *.json ]]; then
  exit 0
fi

sleep 0.5

if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

RESULT=$(python3 -c "
import json, sys

with open('$FILE_PATH') as f:
    data = json.load(f)

mcqs = []
for i, screen in enumerate(data.get('screens', [])):
    for block in screen.get('blocks', []):
        if block.get('type') == 'mcq':
            options = block.get('options', [])
            correct_idx = block.get('correct', 0)
            if len(options) >= 2:
                mcqs.append({
                    'screen': i,
                    'options': options,
                    'correct_idx': correct_idx,
                    'correct_text': options[correct_idx] if correct_idx < len(options) else ''
                })

if not mcqs:
    sys.exit(0)

errors = []

# Check 1: Per-MCQ — correct answer longest with >6 char delta
correct_longest_count = 0
for mcq in mcqs:
    lengths = [len(opt) for opt in mcq['options']]
    correct_len = lengths[mcq['correct_idx']] if mcq['correct_idx'] < len(lengths) else 0
    max_other = max(l for i, l in enumerate(lengths) if i != mcq['correct_idx']) if len(lengths) > 1 else 0

    if correct_len > max_other:
        correct_longest_count += 1
        delta = correct_len - max_other
        if delta > 6:
            errors.append(f'MCQ BALANCE WARNING: Screen {mcq[\"screen\"]} — correct answer is {delta} chars longer than next longest option. Consider shortening correct answer or lengthening distractors.')

# Check 2: Systematic bias — correct is longest in >50% of MCQs
if len(mcqs) >= 3 and correct_longest_count > len(mcqs) * 0.5:
    pct = round(correct_longest_count / len(mcqs) * 100)
    errors.append(f'MCQ SYSTEMATIC BIAS: Correct answer is the longest option in {correct_longest_count}/{len(mcqs)} MCQs ({pct}%). This is a generation bias — learners can guess correct by picking the longest. Rebalance the worst offenders.')

# Check 3: Any option >80 characters (too long = giveaway signal)
for mcq in mcqs:
    for j, opt in enumerate(mcq['options']):
        if len(opt) > 80:
            errors.append(f'MCQ LENGTH: Screen {mcq[\"screen\"]}, option {j+1} is {len(opt)} chars (>80 char limit). Long options signal the correct answer. Trim to ≤80 chars.')

# Check 4: Position clustering (C61 mirror, v10.4.0)
from collections import Counter
if len(mcqs) >= 3:
    positions = Counter(mcq['correct_idx'] for mcq in mcqs)
    for pos, count in positions.items():
        pct = count / len(mcqs) * 100
        if pct > 40:
            errors.append(f'MCQ POSITION CLUSTERING: Position {pos} is correct {count}/{len(mcqs)} times ({pct:.0f}%). Max allowed is 40%. Shuffle options to redistribute.')

# Check 5: Exactly 3 standalone MCQs must all have different positions (v10.4.0)
# Standalone = type "mcq" blocks NOT inside glossary practice
standalone_positions = []
for i, screen in enumerate(data.get('screens', [])):
    for block in screen.get('blocks', []):
        if block.get('type') == 'mcq':
            standalone_positions.append(block.get('correct', 0))
if len(standalone_positions) == 3 and len(set(standalone_positions)) < 3:
    errors.append(f'MCQ POSITION CLUSTERING: 3 standalone MCQs have correct positions {standalone_positions} — all 3 must be at different positions (0-3). Shuffle options on duplicates.')

if errors:
    for e in errors:
        print(e, file=sys.stderr)
    # Exit 2 only for systematic bias (>50% longest correct)
    # Individual warnings don't block but Claude sees them
    if correct_longest_count > len(mcqs) * 0.5 and len(mcqs) >= 3:
        sys.exit(2)
    else:
        # Non-blocking warnings via stderr with exit 1 (shown to user, not Claude)
        # Actually: use exit 2 for all warnings so Claude sees and can fix
        sys.exit(2)
else:
    print(f'MCQ balance OK: {len(mcqs)} MCQs checked, no bias detected.', file=sys.stdout)
" 2>&1)

RC=$?
if [[ $RC -eq 2 ]]; then
  echo "$RESULT" >&2
  exit 2
fi

exit 0
