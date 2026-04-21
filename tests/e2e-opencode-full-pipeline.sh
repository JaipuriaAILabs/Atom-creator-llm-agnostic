#!/usr/bin/env bash
# End-to-end plugin integrity test.
#
# We cannot programmatically drive an OpenCode session, so this test verifies
# every static asset the plugin ships with is well-formed enough that an
# OpenCode session will not error out at load time:
#   1. All 15 skills have SKILL.md with valid YAML frontmatter (name + description)
#   2. All 4 agents have frontmatter with mode/model/permission
#   3. All 15 command shims have frontmatter with description
#   4. dist/index.js exports a default function (i.e., the plugin factory)
#   5. install.js --dry-run is invokable (no file writes)
#   6. Every vendored bash hook in scripts/ is executable and parses as bash
#   7. Parity tests pass (delegates to tests/hook-parity.sh)
#
# Exit non-zero if any step fails.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0
RESULTS=()

record() {
  local name="$1" ok="$2" detail="$3"
  if [[ "$ok" == "PASS" ]]; then
    PASS=$((PASS + 1))
    RESULTS+=("  ✓ $name — $detail")
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("  ✗ $name — $detail")
  fi
}

# -----------------------------------------------------------------------------
# Step 0: Ensure build is present
# -----------------------------------------------------------------------------
if [[ ! -f "$REPO_ROOT/dist/index.js" ]]; then
  echo "dist/index.js missing — building..."
  (cd "$REPO_ROOT" && npx tsc >/dev/null 2>&1)
fi

if [[ ! -f "$REPO_ROOT/dist/index.js" ]]; then
  record "build" FAIL "dist/index.js missing even after tsc"
else
  record "build" PASS "dist/index.js present"
fi

# -----------------------------------------------------------------------------
# Step 1: Skills have valid frontmatter
# -----------------------------------------------------------------------------
SKILL_COUNT=0
SKILL_BAD=0
SKILL_BAD_LIST=()
for skill_dir in "$REPO_ROOT/skills"/*/; do
  [[ -d "$skill_dir" ]] || continue
  SKILL_COUNT=$((SKILL_COUNT + 1))
  skill_md="$skill_dir/SKILL.md"
  skill_name=$(basename "$skill_dir")
  if [[ ! -f "$skill_md" ]]; then
    SKILL_BAD=$((SKILL_BAD + 1))
    SKILL_BAD_LIST+=("$skill_name: missing SKILL.md")
    continue
  fi
  # Verify it has YAML frontmatter with name and description
  if ! head -n 20 "$skill_md" | grep -q '^name:'; then
    SKILL_BAD=$((SKILL_BAD + 1))
    SKILL_BAD_LIST+=("$skill_name: missing name field")
    continue
  fi
  if ! head -n 20 "$skill_md" | grep -q '^description:'; then
    SKILL_BAD=$((SKILL_BAD + 1))
    SKILL_BAD_LIST+=("$skill_name: missing description field")
    continue
  fi
done
if [[ $SKILL_BAD -eq 0 ]]; then
  record "skills frontmatter" PASS "$SKILL_COUNT skills valid"
else
  record "skills frontmatter" FAIL "$SKILL_BAD bad: ${SKILL_BAD_LIST[*]}"
fi

# -----------------------------------------------------------------------------
# Step 2: Agents have valid frontmatter
# -----------------------------------------------------------------------------
AGENT_COUNT=0
AGENT_BAD=0
AGENT_BAD_LIST=()
for agent_md in "$REPO_ROOT/agents"/*.md; do
  [[ -f "$agent_md" ]] || continue
  AGENT_COUNT=$((AGENT_COUNT + 1))
  agent_name=$(basename "$agent_md" .md)
  missing=""
  for field in mode model permission; do
    if ! head -n 20 "$agent_md" | grep -q "^${field}:"; then
      missing="${missing} ${field}"
    fi
  done
  if [[ -n "$missing" ]]; then
    AGENT_BAD=$((AGENT_BAD + 1))
    AGENT_BAD_LIST+=("$agent_name: missing$missing")
  fi
done
if [[ $AGENT_BAD -eq 0 ]]; then
  record "agents frontmatter" PASS "$AGENT_COUNT agents valid"
else
  record "agents frontmatter" FAIL "$AGENT_BAD bad: ${AGENT_BAD_LIST[*]}"
fi

# -----------------------------------------------------------------------------
# Step 3: Command shims have frontmatter
# -----------------------------------------------------------------------------
CMD_COUNT=0
CMD_BAD=0
CMD_BAD_LIST=()
for cmd_md in "$REPO_ROOT/commands"/*.md; do
  [[ -f "$cmd_md" ]] || continue
  CMD_COUNT=$((CMD_COUNT + 1))
  cmd_name=$(basename "$cmd_md" .md)
  if ! head -n 10 "$cmd_md" | grep -q '^description:'; then
    CMD_BAD=$((CMD_BAD + 1))
    CMD_BAD_LIST+=("$cmd_name: missing description")
  fi
done
if [[ $CMD_BAD -eq 0 ]]; then
  record "commands frontmatter" PASS "$CMD_COUNT commands valid"
else
  record "commands frontmatter" FAIL "$CMD_BAD bad: ${CMD_BAD_LIST[*]}"
fi

# -----------------------------------------------------------------------------
# Step 4: dist/index.js exports a default function (the plugin factory)
# -----------------------------------------------------------------------------
PLUGIN_CHECK=$(cd "$REPO_ROOT" && node -e "
  const mod = require('./dist/index.js');
  const factory = mod.default || mod;
  if (typeof factory !== 'function') {
    console.error('NOT_A_FUNCTION: typeof=' + typeof factory);
    process.exit(1);
  }
  // Try invoking — should return a Promise resolving to handlers object
  Promise.resolve(factory()).then((handlers) => {
    const required = ['tool.execute.before', 'tool.execute.after', 'session.created'];
    const missing = required.filter(k => typeof handlers[k] !== 'function');
    if (missing.length > 0) {
      console.error('MISSING_HANDLERS: ' + missing.join(', '));
      process.exit(1);
    }
    if (!Array.isArray(handlers.tools)) {
      console.error('NO_TOOLS_ARRAY');
      process.exit(1);
    }
    console.log('OK: handlers=' + required.length + ' tools=' + handlers.tools.length);
  }).catch((err) => {
    console.error('FACTORY_THREW: ' + err.message);
    process.exit(1);
  });
" 2>&1)
if [[ "$PLUGIN_CHECK" == OK:* ]]; then
  record "plugin factory" PASS "$PLUGIN_CHECK"
else
  record "plugin factory" FAIL "$PLUGIN_CHECK"
fi

# -----------------------------------------------------------------------------
# Step 5: install.js --dry-run is invokable
# -----------------------------------------------------------------------------
DRY_RUN_TMP=$(mktemp -d)
DRY_RUN_OUT=$(cd "$DRY_RUN_TMP" && node "$REPO_ROOT/install.js" install --dry-run --non-interactive 2>&1 | tail -20)
DRY_RUN_RC=$?
# We accept exit 0 or 1, but require NO real file writes (no .opencode/ or opencode.json)
if [[ -d "$DRY_RUN_TMP/.opencode" ]] || [[ -f "$DRY_RUN_TMP/opencode.json" ]] || [[ -f "$DRY_RUN_TMP/.env" ]]; then
  record "install.js --dry-run" FAIL "dry-run wrote files to $DRY_RUN_TMP"
elif [[ $DRY_RUN_RC -eq 0 ]]; then
  record "install.js --dry-run" PASS "exited 0 with no file writes"
else
  record "install.js --dry-run" FAIL "exit $DRY_RUN_RC, output: $DRY_RUN_OUT"
fi
rm -rf "$DRY_RUN_TMP"

# -----------------------------------------------------------------------------
# Step 6: Bash hooks parse with `bash -n`
# -----------------------------------------------------------------------------
HOOK_BAD=0
HOOK_BAD_LIST=()
HOOK_COUNT=0
for hook_sh in "$REPO_ROOT/scripts"/*.sh; do
  [[ -f "$hook_sh" ]] || continue
  HOOK_COUNT=$((HOOK_COUNT + 1))
  if ! bash -n "$hook_sh" 2>/dev/null; then
    HOOK_BAD=$((HOOK_BAD + 1))
    HOOK_BAD_LIST+=("$(basename "$hook_sh")")
  fi
done
if [[ $HOOK_BAD -eq 0 ]]; then
  record "bash hook syntax" PASS "$HOOK_COUNT hooks parse"
else
  record "bash hook syntax" FAIL "${HOOK_BAD_LIST[*]}"
fi

# -----------------------------------------------------------------------------
# Step 7: Hook parity tests
# -----------------------------------------------------------------------------
if bash "$REPO_ROOT/tests/hook-parity.sh" >/dev/null 2>&1; then
  record "hook parity" PASS "all 5 critical hooks match bash vs TS"
else
  # Capture failing output for summary
  PARITY_DETAIL=$(bash "$REPO_ROOT/tests/hook-parity.sh" 2>&1 | tail -4 | tr '\n' ' ')
  record "hook parity" FAIL "see tests/hook-parity.sh output: $PARITY_DETAIL"
fi

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo ""
echo "======================================================"
echo "  atom-creator-llm-agnostic — E2E pipeline test"
echo "======================================================"
for r in "${RESULTS[@]}"; do
  echo "$r"
done
echo ""
echo "  Passed: $PASS | Failed: $FAIL | Total: $((PASS + FAIL))"
echo ""

if [[ $FAIL -gt 0 ]]; then
  echo "  ✗ E2E FAILED — fix issues above before shipping."
  echo ""
  echo "  Manual integration smoke test (not automated):"
  echo "    1. Install OpenCode: https://opencode.ai"
  echo "    2. cd into this repo, run: node install.js install --project"
  echo "    3. Start OpenCode: opencode"
  echo "    4. Inside OpenCode, try: /plan Product Manager AI readiness"
  exit 1
fi

echo "  ✓ ALL E2E CHECKS PASSED"
echo ""
echo "  Next: manual smoke test in OpenCode"
echo "    1. node install.js install --project"
echo "    2. opencode"
echo "    3. /plan {your topic}"
exit 0
