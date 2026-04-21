#!/usr/bin/env bash
# check-game-patterns.sh — non-blocking advisory hook
# Triggered on PostToolUse Write|Edit. Scans games/**/*.html for known patterns that
# have caused bugs in past sessions. Emits warnings to stderr only; never blocks.
#
# Rules enforced (all WARN, none BLOCK):
#   1. gsap.from(  — should be gsap.fromTo (rule 7.1 in /game-design skill)
#   2. useEffect with [pos]/[round]/[idx] keyed state + gsap.fromTo but no gsap.set before — DOM-reuse bleed bug
#   3. <div class="...">...${.*}... with onClick=${...} AND 2+ child elements — phantom-click bug heuristic
#   4. >3 rounds declared in ROUNDS/DECK array but no phase==='reflect' in code — missing Reflect phase

set -u
# Read hook input (JSON on stdin per Claude Code hook contract)
INPUT="${1:-$(cat 2>/dev/null || echo '{}')}"

# Extract file path from hook input (tolerant of JSON or raw path)
FILE_PATH=""
if command -v jq >/dev/null 2>&1; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")
fi
if [ -z "$FILE_PATH" ] && [ -n "${INPUT:-}" ]; then
  FILE_PATH="$INPUT"
fi

# Only audit HTML files inside games/
case "$FILE_PATH" in
  *games/*.html|*games/*/*.html) : ;;
  *) exit 0 ;;
esac

[ -f "$FILE_PATH" ] || exit 0

WARNINGS=()

# Rule 1: bare gsap.from(
if grep -qE 'gsap\.from\(' "$FILE_PATH" 2>/dev/null; then
  if ! grep -qE 'gsap\.fromTo\(' "$FILE_PATH" 2>/dev/null; then
    WARNINGS+=("gsap.from( detected — rule 7.1: use gsap.fromTo() instead (see /game-design skill, bug class: Preact re-render leaves opacity:0)")
  else
    # has both — check if plain gsap.from is really being used vs just being a substring of fromTo
    if grep -qE 'gsap\.from\([^T]' "$FILE_PATH" 2>/dev/null; then
      WARNINGS+=("gsap.from( (non-fromTo) detected — prefer gsap.fromTo() exclusively per rule 7.1")
    fi
  fi
fi

# Rule 2: gsap.fromTo inside a useEffect with keyed deps but no gsap.set reset
# Heuristic: look for useEffect(...,[<varname>]) blocks containing gsap.fromTo but not gsap.set
if grep -qE 'useEffect\(.*,\[(pos|round|idx|scenarioIdx|roundIdx)\]' "$FILE_PATH" 2>/dev/null; then
  if grep -qE 'gsap\.fromTo\(cardRef|gsap\.fromTo\([a-zA-Z]+Ref' "$FILE_PATH" 2>/dev/null; then
    if ! grep -qE 'gsap\.set\([a-zA-Z]+Ref' "$FILE_PATH" 2>/dev/null; then
      WARNINGS+=("keyed useEffect uses gsap.fromTo on a ref but no gsap.set reset — Preact reuses DOM, exit-anim transforms will bleed. Add gsap.set(ref.current, {x:0, opacity:1, rotation:0}) before gsap.fromTo")
    fi
  fi
fi

# Rule 3: container-level onClick on elements with multiple children (phantom-click risk)
# Heuristic: <div class="X"  onClick=${...}> where X is a known container-class pattern
if grep -qE '<div class="(reflect|intro|win|overlay|stage|panel|container)"[^>]*onClick=' "$FILE_PATH" 2>/dev/null; then
  WARNINGS+=("container-level div has onClick= handler — phantom-click bug risk. Attach onClick to specific interactive children (buttons, chips, cards), not the wrapping panel")
fi

# Rule 4: Reflect-phase presence recommendation for games with >3 rounds
# Heuristic: if ROUNDS array has >3 entries or DECK has >5 entries and no phase=='reflect'
if grep -qE "phase==='reflect'|phase === 'reflect'" "$FILE_PATH" 2>/dev/null; then
  : # Reflect is present, all good
else
  # Count ROUNDS entries heuristically
  ROUND_COUNT=$(grep -cE "^\s*\{.*title:.*rounds" "$FILE_PATH" 2>/dev/null || echo 0)
  DECK_COUNT=$(grep -cE "^\s*\{ico:" "$FILE_PATH" 2>/dev/null || echo 0)
  if [ "$DECK_COUNT" -gt 10 ] 2>/dev/null; then
    WARNINGS+=("${DECK_COUNT} deck/data entries but no phase==='reflect' found — consider adding a Reflect phase between play and win (templates/reflect-snippet.md)")
  fi
fi

# Emit warnings (never block)
if [ "${#WARNINGS[@]}" -gt 0 ]; then
  echo "" >&2
  echo "⚠️  check-game-patterns advisory ($(basename "$FILE_PATH")):" >&2
  for w in "${WARNINGS[@]}"; do
    echo "   · $w" >&2
  done
  echo "   (non-blocking — Agent 4 enforces these at audit time)" >&2
fi

exit 0
