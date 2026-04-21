#!/usr/bin/env node
/**
 * Small harness to invoke a single TypeScript-compiled hook by name.
 *
 * Usage:
 *   node tests/run-ts-hook.js <hook-name> <file-path> [--content <path-to-content-file>]
 *
 * Hook name maps to the exported function in dist/hooks/<hook>.js.
 * Exit 0 = pass, Exit 2 = hard-block (hook threw).
 *
 * This lets tests/hook-parity.sh drive the TS hooks the same way the bash
 * hooks are driven (one invocation per fixture, compare exit code).
 */

const path = require("path");
const fs = require("fs");

async function main() {
  const [, , hookName, filePath, ...rest] = process.argv;
  if (!hookName || !filePath) {
    console.error("Usage: run-ts-hook.js <hook> <file-path> [--content <path>]");
    process.exit(64);
  }

  let content;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "--content" && rest[i + 1]) {
      content = fs.readFileSync(rest[i + 1], "utf8");
      i++;
    }
  }

  const distRoot = path.join(__dirname, "..", "dist", "hooks");

  const hookMap = {
    "validate-json": ["validate-json.js", "validateJsonHook", (fp) => [fp]],
    "validate-sql": ["validate-sql.js", "validateSqlHook", (fp) => [fp]],
    "protect-approved-specs": [
      "protect-approved-specs.js",
      "protectApprovedSpecsHook",
      (fp) => [fp],
    ],
    "guard-ship-ready": [
      "guard-ship-ready.js",
      "guardShipReadyHook",
      (fp, c) => [fp, c],
    ],
    "enforce-pipeline-order": [
      "enforce-pipeline-order.js",
      "enforcePipelineOrderHook",
      (fp) => [fp],
    ],
  };

  const entry = hookMap[hookName];
  if (!entry) {
    console.error(`Unknown hook: ${hookName}`);
    process.exit(64);
  }

  const [file, exportName, buildArgs] = entry;
  const mod = require(path.join(distRoot, file));
  const fn = mod[exportName];
  if (typeof fn !== "function") {
    console.error(`Hook ${hookName} exports are not a function`);
    process.exit(64);
  }

  try {
    await fn(...buildArgs(filePath, content));
    process.exit(0);
  } catch (err) {
    process.stderr.write((err && err.message ? err.message : String(err)) + "\n");
    process.exit(2);
  }
}

main().catch((err) => {
  process.stderr.write(String(err && err.stack ? err.stack : err) + "\n");
  process.exit(2);
});
