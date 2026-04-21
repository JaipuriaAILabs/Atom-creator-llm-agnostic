#!/usr/bin/env bash
# guard-game-generation.sh
# PreToolUse hook — HARD BLOCKS Write of *-game.html unless the session has:
#   Gate 1: Invoked the /game-design skill (Rehearsal mechanical correctness)
#   Gate 2: Invoked the /game-design-theory skill (MDA framework + 7-gate design checklist)
#           AND the skill file actually exists on disk (a failed Skill call was previously accepted)
#   Gate 3: Read at least one of the three WHITELISTED reference games (exact filename match only,
#           no catch-all "any prior game file" fallback)
#   Gate 4: design.md exists in the target directory AND contains a "## 7-Gate Zero-Shot Checklist"
#           section with non-trivial content (not boilerplate)
#   Gate 5: The Mechanic declared in design.md matches the Mechanic in the corresponding spec file
#           (verbatim or canonical mapping via 10-family vocabulary)
#
# v10.13.0 hardening (2026-04-17):
#   - v10.11.0 and v10.12.0 added soft prose about these gates without enforcement.
#   - This version turns all five gates into real blocks.
#   - Gate 2 previously passed on a failed Skill invocation because the transcript logged the JSON
#     even when the skill didn't exist. Now verifies SKILL.md presence on disk.
#   - Gate 3 previously allowed ANY prior *-game.html Read (catch-all). Now restricted to the three
#     whitelisted reference filenames.
#   - Gate 4 and 5 are new — force the design doc to be written and aligned with the spec BEFORE
#     any HTML is produced.
#
# Exit codes:
#   0 = pass-through (not a game file, or checks passed)
#   2 = hard block (Claude Code shows stderr to the model)

set -u

# Read hook JSON from stdin
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | /usr/bin/python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('tool_name',''))" 2>/dev/null || echo "")
FILE_PATH=$(echo "$INPUT" | /usr/bin/python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")
TRANSCRIPT=$(echo "$INPUT" | /usr/bin/python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('transcript_path',''))" 2>/dev/null || echo "")

# Only guard Write of *-game.html inside games/
if [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

case "$FILE_PATH" in
  */games/*-game.html|*/games/*/*-game.html)
    ;;
  *)
    exit 0
    ;;
esac

# From here on, this IS a game-file write. Enforce preconditions.

if [ -z "$TRANSCRIPT" ] || [ ! -f "$TRANSCRIPT" ]; then
  echo "guard-game-generation: no transcript available, allowing write" >&2
  exit 0
fi

# Resolve the game directory + slug from the target path.
# Example: /foo/bar/games/my-slug/my-slug-game.html → GAME_DIR=/foo/bar/games/my-slug, SLUG=my-slug
GAME_DIR=$(dirname "$FILE_PATH")
GAME_BASENAME=$(basename "$FILE_PATH" -game.html)
GAME_DIR_NAME=$(basename "$GAME_DIR")
# Attempt to find the matching spec. Three strategies, in order:
#   1. courses/specs/{game-basename}-spec.md          (exact match)
#   2. courses/specs/{dir-name}-spec.md               (dir-based match)
#   3. any spec whose slug is a suffix of game-basename (handles role-prefixed games)
#        e.g. game "brand-manager-downward-brand-extension" → spec "downward-brand-extension-spec.md"
WORKSPACE_ROOT=$(echo "$FILE_PATH" | /usr/bin/sed -E 's|/games/.*||')
SPEC_FILE=""
for candidate in \
  "$WORKSPACE_ROOT/courses/specs/$GAME_BASENAME-spec.md" \
  "$WORKSPACE_ROOT/courses/specs/$GAME_DIR_NAME-spec.md"; do
  if [ -f "$candidate" ]; then
    SPEC_FILE="$candidate"
    break
  fi
done
# Strategy 3: suffix-match against all spec files if strategies 1-2 failed
if [ -z "$SPEC_FILE" ] && [ -d "$WORKSPACE_ROOT/courses/specs" ]; then
  for spec in "$WORKSPACE_ROOT"/courses/specs/*-spec.md; do
    [ -f "$spec" ] || continue
    spec_slug=$(basename "$spec" -spec.md)
    case "$GAME_BASENAME" in
      *"$spec_slug")
        SPEC_FILE="$spec"
        break
        ;;
    esac
  done
fi

# ─── GATE 1: /game-design skill invoked ────────────────────────────────────────
SKILL_INVOKED=0
if /usr/bin/grep -E '"skill":"[^"]*game-design"' "$TRANSCRIPT" | /usr/bin/grep -v 'game-design-theory' >/dev/null 2>&1; then
  SKILL_INVOKED=1
fi
if [ $SKILL_INVOKED -eq 0 ]; then
  if /usr/bin/grep -E 'Launching skill: game-design$|/\.claude/skills/game-design/' "$TRANSCRIPT" >/dev/null 2>&1; then
    SKILL_INVOKED=1
  fi
fi

# ─── GATE 2: /game-design-theory skill invoked AND exists on disk ──────────────
THEORY_INVOKED=0
THEORY_SKILL_PATH="$HOME/.claude/skills/game-design-theory/SKILL.md"
if /usr/bin/grep -E '"skill":"[^"]*game-design-theory"' "$TRANSCRIPT" >/dev/null 2>&1; then
  THEORY_INVOKED=1
fi
if [ $THEORY_INVOKED -eq 0 ]; then
  if /usr/bin/grep -E 'Launching skill: game-design-theory|/\.claude/skills/game-design-theory' "$TRANSCRIPT" >/dev/null 2>&1; then
    THEORY_INVOKED=1
  fi
fi
# Hard requirement: the skill file must exist on disk. A failed Skill() call logs
# invocation JSON but doesn't load the skill — the old gate accepted that.
THEORY_SKILL_EXISTS=0
if [ -f "$THEORY_SKILL_PATH" ]; then
  THEORY_SKILL_EXISTS=1
fi
THEORY_OK=0
if [ $THEORY_INVOKED -eq 1 ] && [ $THEORY_SKILL_EXISTS -eq 1 ]; then
  THEORY_OK=1
fi

# ─── GATE 3: reference game Read (whitelist only, no catch-all) ────────────────
# Whitelisted references (exact filename match):
#   - routine.html                              (CODIFY — Sci-Fi Matrix)
#   - decomposer.html                           (AUDIT — Arcade Pop)
#   - beat-plan-game.html                       (Beat Blitz — legacy Editorial Mono, may be absent)
#   - manager-organizational-resilience-design-game.html  (THE GEM — current Editorial Mono reference)
REFERENCE_READ=0
if /usr/bin/grep -E '"name":"Read"' "$TRANSCRIPT" 2>/dev/null \
  | /usr/bin/grep -E '(routine\.html|decomposer\.html|beat-plan-game\.html|manager-organizational-resilience-design-game\.html)' >/dev/null 2>&1; then
  REFERENCE_READ=1
fi
# NOTE: no more catch-all fallback. Previously, any prior *-game.html Read satisfied this gate.

# ─── GATE 4: design.md exists and contains 7-gate checklist ────────────────────
DESIGN_MD="$GAME_DIR/design.md"
DESIGN_OK=0
DESIGN_GATE_CONTENT_OK=0
if [ -f "$DESIGN_MD" ]; then
  DESIGN_OK=1
  # Look for the required section header. Acceptable variants:
  #   ## 7-Gate Zero-Shot Checklist
  #   ## 7-Gate Design Checklist
  #   ## Seven-Gate Checklist
  # v10.16.0: allow optional "N." or "N.N." numeric prefix before the 7-Gate heading
  # (e.g., "## 3. 7-Gate Zero-Shot Checklist" should pass).
  if /usr/bin/grep -iE '^##+[[:space:]]+([0-9]+(\.[0-9]+)?\.?[[:space:]]+)?(7[- ]?Gate|Seven[- ]?Gate)' "$DESIGN_MD" >/dev/null 2>&1; then
    # Measure content under the header via a Python script (single-quoted here-doc
    # so bash won't try to expand $(...) inside the regex).
    CONTENT_LEN=$(/usr/bin/python3 - "$DESIGN_MD" <<'PYEOF' 2>/dev/null || echo 0
import re, sys
try:
    with open(sys.argv[1]) as f:
        t = f.read()
except Exception:
    print(0); sys.exit()
# Match the 7-gate header, then capture until the NEXT top-level `## ` header
# (i.e., 2 hashes + space + non-#). This includes `### Gate 1` subsections in the capture.
m = re.search(
    # v10.16.0: allow optional "N." or "N.N." numeric prefix before the 7-Gate heading
    r'^#{2,}[ \t]+(?:[0-9]+(?:\.[0-9]+)?\.?[ \t]+)?(?:7[- ]?Gate|Seven[- ]?Gate)[^\n]*\n([\s\S]*?)(?=^## [^#]|\Z)',
    t, re.MULTILINE | re.IGNORECASE
)
print(len(m.group(1).strip()) if m else 0)
PYEOF
)
    if [ "${CONTENT_LEN:-0}" -ge 600 ] 2>/dev/null; then
      DESIGN_GATE_CONTENT_OK=1
    fi
  fi
fi

# ─── GATE 5: mechanic in design.md matches mechanic in spec ────────────────────
MECHANIC_MATCH=0
MECHANIC_SPEC=""
MECHANIC_DESIGN=""
if [ -f "$DESIGN_MD" ] && [ -n "$SPEC_FILE" ] && [ -f "$SPEC_FILE" ]; then
  MECHANIC_SPEC=$(/usr/bin/python3 - "$SPEC_FILE" <<'PYEOF' 2>/dev/null
import re, sys
try:
    t = open(sys.argv[1]).read()
except Exception:
    print(''); raise SystemExit
m = re.search(r'##\s*Game Concept.*?(?=\n##\s|\Z)', t, re.DOTALL | re.IGNORECASE)
# v10.16.0: if `## Game Concept` section missing, fall back to scanning the whole spec.
# Prior behavior required mechanic declaration inside that section; this is a soft fallback.
sec = m.group(0) if m else t
ml = re.search(r'\*\*?Mechanic(?:\s+family)?:\*\*?\s*([^\n]+)', sec, re.IGNORECASE)
if not ml:
    ml = re.search(r'^Mechanic(?:\s+family)?:\s*([^\n]+)', sec, re.IGNORECASE | re.MULTILINE)
print((ml.group(1).strip() if ml else '').lower())
PYEOF
)
  MECHANIC_DESIGN=$(/usr/bin/python3 - "$DESIGN_MD" <<'PYEOF' 2>/dev/null
import re, sys
try:
    t = open(sys.argv[1]).read()
except Exception:
    print(''); raise SystemExit
ml = re.search(r'\*\*?Mechanic(?:\s+family)?:\*\*?\s*([^\n]+)', t, re.IGNORECASE)
if not ml:
    ml = re.search(r'^Mechanic(?:\s+family)?:\s*([^\n]+)', t, re.IGNORECASE | re.MULTILINE)
print((ml.group(1).strip() if ml else '').lower())
PYEOF
)
  if [ -n "$MECHANIC_SPEC" ] && [ -n "$MECHANIC_DESIGN" ]; then
    MATCH=$(/usr/bin/python3 - "$MECHANIC_SPEC" "$MECHANIC_DESIGN" <<'PYEOF' 2>/dev/null
import sys
s = sys.argv[1].strip().lower()
d = sys.argv[2].strip().lower()
FAMILIES = {
  'allocation': ['allocation','budget','portfolio allocation','portfolio builder'],
  'matrix placement': ['matrix placement','classification','classification/sorting','quadrant','2x2','2d placement','spatial placement','spatial placement on a canvas'],
  'multi-round strategy': ['multi-round strategy','multi round strategy','round strategy'],
  'progressive reveal': ['progressive reveal','timed reveal','reveal sequence'],
  'signal detection': ['signal detection','detection'],
  'dialogue tree': ['dialogue tree','dialogue','branching dialogue'],
  'slider balance': ['slider balance','slider','stretch the thread'],
  'contradiction hunt': ['contradiction hunt','contradiction'],
  'rapid classify swipe': ['rapid classify swipe','swipe','rapid classify'],
  'build-and-watch execution': ['build-and-watch execution','build and watch','build-and-watch'],
  'tool simulation': ['tool simulation','tool sim'],
}
def family_of(x):
    for fam, aliases in FAMILIES.items():
        for a in aliases:
            if a in x:
                return fam
    return None
fs = family_of(s); fd = family_of(d)
print('1' if (fs and fd and fs == fd) or (s == d) else '0')
PYEOF
)
    if [ "$MATCH" = "1" ]; then
      MECHANIC_MATCH=1
    fi
  fi
fi

# ─── ALL FIVE GATES MUST PASS ──────────────────────────────────────────────────
if [ $SKILL_INVOKED -eq 1 ] \
  && [ $THEORY_OK -eq 1 ] \
  && [ $REFERENCE_READ -eq 1 ] \
  && [ $DESIGN_OK -eq 1 ] \
  && [ $DESIGN_GATE_CONTENT_OK -eq 1 ] \
  && [ $MECHANIC_MATCH -eq 1 ]; then
  exit 0
fi

# Build blocking message
MISSING=""
if [ $SKILL_INVOKED -eq 0 ]; then
  MISSING+="
  ✗ Gate 1 — /game-design skill NOT invoked. Provides stack, Rule 7.1, DOM-reuse reset, audio vocabulary, scoring fairness, 18 known bug classes."
fi
if [ $THEORY_INVOKED -eq 0 ]; then
  MISSING+="
  ✗ Gate 2 — /game-design-theory skill NOT invoked. Provides MDA framework, dominant-strategy prevention, weaponized-common-sense pedagogy, Flow Channel, fair-failure, 7-gate zero-shot design checklist."
elif [ $THEORY_SKILL_EXISTS -eq 0 ]; then
  MISSING+="
  ✗ Gate 2 — /game-design-theory invocation logged but SKILL FILE MISSING AT:
      $THEORY_SKILL_PATH
    The previous hook version accepted failed invocations. Create the skill or fix the path."
fi
if [ $REFERENCE_READ -eq 0 ]; then
  MISSING+="
  ✗ Gate 3 — No whitelisted reference game Read this session. Read at least ONE of:
      - games/senior-leader-task-anatomy/routine.html    (CODIFY — Sci-Fi Matrix)
      - games/knowledge-worker-prompt-decomposition/decomposer.html    (AUDIT — Arcade Pop)
      - games/manager-organizational-resilience-design/manager-organizational-resilience-design-game.html    (THE GEM — Editorial Mono)
    Reading an unrelated prior game no longer satisfies this gate."
fi
if [ $DESIGN_OK -eq 0 ]; then
  MISSING+="
  ✗ Gate 4 — design.md MISSING at:
      $DESIGN_MD
    Write the design doc BEFORE the HTML. The doc is the source of truth."
elif [ $DESIGN_GATE_CONTENT_OK -eq 0 ]; then
  MISSING+="
  ✗ Gate 4 — design.md missing '## 7-Gate Zero-Shot Checklist' section with substantive content (≥600 chars).
    Required gates (answer each with ≥2 sentences of specific content):
      1. No dominant strategy (enumerate pure strategies)
      2. Weaponized common sense (name the naive move + the round that punishes it)
      3. Clear causation on failure
      4. Win condition binary and honest (first-word lead, binary visual collapse, LOST prefix)
      5. Uncertainty forces hedging
      6. Replay reveals strategy space (randomised final round)
      7. MDA chain integrity"
fi
if [ -z "$SPEC_FILE" ]; then
  MISSING+="
  ✗ Gate 5 — No matching spec file found for this game. Expected one of:
      $WORKSPACE_ROOT/courses/specs/$GAME_BASENAME-spec.md
      $WORKSPACE_ROOT/courses/specs/$(basename "$GAME_DIR")-spec.md"
elif [ $MECHANIC_MATCH -eq 0 ]; then
  MISSING+="
  ✗ Gate 5 — Mechanic mismatch between spec and design.md.
      Spec ($SPEC_FILE): '$MECHANIC_SPEC'
      Design.md ($DESIGN_MD): '$MECHANIC_DESIGN'
    Either update design.md to match the spec's declared mechanic,
    or run /atom-creator:plan --refine {slug} to change the spec mechanic.
    Silently deviating is how CODIFY-reskin slop gets shipped."
fi

cat >&2 <<EOF
╔══════════════════════════════════════════════════════════════════╗
║  GAME GENERATION BLOCKED (v10.13.0)                                ║
║  File: $(basename "$FILE_PATH")
╚══════════════════════════════════════════════════════════════════╝

The atom-creator pipeline requires FIVE preconditions before writing
any *-game.html. Missing this session:
$MISSING

Why this hook exists:
  2026-04-17 session #1 shipped CODIFY reskin (references described from memory).
  2026-04-17 session #2 shipped a logically-incoherent game (dishonest diagnosis,
    predictable strikes eliminating strategy).
  2026-04-17 session #3 shipped a three-radio-button quiz dressed as Editorial Mono
    (spec declared Classification/sorting → generator silently swapped to
    Multi-Round Strategy with no enforcement).
  All three would have been caught by gates 4 and 5 if they had existed.

What to do now:
  1. Invoke  /game-design         via Skill tool.
  2. Invoke  /game-design-theory  via Skill tool.
  3. Read the closest-aesthetic WHITELISTED reference game end-to-end.
  4. Write design.md including the '## 7-Gate Zero-Shot Checklist' section.
     Each of the 7 gates needs ≥2 sentences of specific content.
  5. Verify design.md's Mechanic: field matches the spec's Game Concept Mechanic.
  6. Then retry the Write.

See: atom-creator/commands/game.md (Step 3.5 + Step 3d).
EOF
exit 2
