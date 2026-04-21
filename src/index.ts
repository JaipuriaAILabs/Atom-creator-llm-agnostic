// atom-creator-llm-agnostic — OpenCode plugin entry point (v0.1.2).
//
// Matches @opencode-ai/plugin 0.5.29 runtime contract:
//   - Plugin: (input: PluginInput) => Promise<Hooks>
//   - Hooks:
//     * tool.execute.before: (input: {tool, sessionID, callID}, output: {args}) => Promise<void>
//     * tool.execute.after:  (input: {tool, sessionID, callID}, output: {title, output, metadata, args?}) => Promise<void>
//
// Session hooks (session.created / session.idle) and custom `tools` array are
// NOT in the 0.5.29 Hooks interface — removed here, can return in v0.2.0 when
// OpenCode exposes them.
//
// Types are intentionally structural (not imported from @opencode-ai/plugin)
// because the SDK is ESM-only and our output is CJS — the runtime loads fine
// but the tsc type resolver under `module: Node16` can't reach the .d.ts.
// Swap the shims for real imports once we move the package to ESM.

import { validateJsonHook } from "./hooks/validate-json.js";
import { validateSqlHook } from "./hooks/validate-sql.js";
import { checkTripleSyncHook } from "./hooks/check-triple-sync.js";
import { checkMcqBalanceHook } from "./hooks/check-mcq-balance.js";
import { enforcePipelineOrderHook } from "./hooks/enforce-pipeline-order.js";
import { checkDocsFreshnessHook } from "./hooks/check-docs-freshness.js";
import { checkGamePatternsHook } from "./hooks/check-game-patterns.js";
import { checkAspectRatioHook } from "./hooks/check-aspect-ratio.js";
import { protectApprovedSpecsHook } from "./hooks/protect-approved-specs.js";
import { checkStorytellingSignalsHook } from "./hooks/check-storytelling-signals.js";
import { guardShipReadyHook } from "./hooks/guard-ship-ready.js";
import { guardGameGenerationHook } from "./hooks/guard-game-generation.js";

// ─── Structural type shims for the OpenCode plugin surface ───────────────────

interface ToolBeforeInput {
  tool: string;
  sessionID: string;
  callID: string;
}

interface ToolBeforeOutput {
  args: Record<string, unknown>;
}

interface ToolAfterInput {
  tool: string;
  sessionID: string;
  callID: string;
}

interface ToolAfterOutput {
  title: string;
  output: string;
  metadata: unknown;
  args?: Record<string, unknown>;
}

interface Hooks {
  "tool.execute.before"?: (
    input: ToolBeforeInput,
    output: ToolBeforeOutput,
  ) => Promise<void>;
  "tool.execute.after"?: (
    input: ToolAfterInput,
    output: ToolAfterOutput,
  ) => Promise<void>;
}

type PluginInput = unknown;
type Plugin = (input: PluginInput) => Promise<Hooks>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractPath(args: Record<string, unknown> | undefined): string | undefined {
  if (!args) return undefined;
  const candidate = args.path ?? args.file_path ?? args.filePath;
  return typeof candidate === "string" ? candidate : undefined;
}

function extractContent(args: Record<string, unknown> | undefined): string | undefined {
  if (!args) return undefined;
  const candidate = args.content ?? args.new_string ?? args.text;
  return typeof candidate === "string" ? candidate : undefined;
}

function extractCommand(args: Record<string, unknown> | undefined): string | undefined {
  if (!args) return undefined;
  return typeof args.command === "string" ? args.command : undefined;
}

function warn(msg: string): void {
  // eslint-disable-next-line no-console
  console.warn(`[atom-creator] ${msg}`);
}

async function swallow<T>(fn: () => Promise<T>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    warn(err instanceof Error ? err.message : String(err));
  }
}

// ─── Plugin factory ──────────────────────────────────────────────────────────

const AtomCreatorPlugin: Plugin = async () => ({
  "tool.execute.before": async (input, output) => {
    const args = output.args ?? {};
    const filePath = extractPath(args);
    const content = extractContent(args);

    // HARD-BLOCK hooks (throw so OpenCode denies the tool call)
    if ((input.tool === "write" || input.tool === "edit") && filePath) {
      if (filePath.includes("/specs/") && filePath.endsWith("-spec.md")) {
        await protectApprovedSpecsHook(filePath);
      }

      if (filePath.includes("/courses/specs/") && filePath.endsWith("-spec.md")) {
        await guardShipReadyHook(filePath, content);
      }

      if (filePath.endsWith("-game.html")) {
        await guardGameGenerationHook(filePath);
      }

      if (
        filePath.includes("/specs/") ||
        filePath.includes("/courses/") ||
        filePath.includes("/JSONS/") ||
        filePath.includes("/sql/")
      ) {
        await enforcePipelineOrderHook(filePath);
      }

      // Soft-warn (don't throw): storytelling patterns
      if (filePath.includes("/courses/") && filePath.endsWith(".md")) {
        await swallow(() => checkStorytellingSignalsHook(filePath, content));
      }
    }
  },

  "tool.execute.after": async (input, output) => {
    const args = output.args ?? {};
    const filePath = extractPath(args);
    const command = extractCommand(args);

    // All after-hooks are soft — they don't block the already-executed tool.
    if ((input.tool === "write" || input.tool === "edit") && filePath) {
      if (filePath.endsWith(".json")) {
        await swallow(() => validateJsonHook(filePath));
      }
      if (filePath.endsWith(".sql")) {
        await swallow(() => validateSqlHook(filePath));
      }
      if (
        filePath.includes("/specs/") ||
        filePath.includes("/courses/") ||
        filePath.includes("/JSONS/") ||
        filePath.includes("/sql/")
      ) {
        await swallow(() => checkTripleSyncHook(filePath));
      }
      if (filePath.endsWith(".json") && filePath.includes("/JSONS/")) {
        await swallow(() => checkMcqBalanceHook(filePath));
      }
      if (filePath.endsWith("-game.html")) {
        await swallow(() => checkGamePatternsHook(filePath));
      }
      if (filePath.endsWith(".md")) {
        await swallow(() => checkDocsFreshnessHook(filePath));
      }
    }

    if (input.tool === "bash" && command && command.includes("sips")) {
      await swallow(() =>
        checkAspectRatioHook({ command, toolResponse: output.output }),
      );
    }
  },
});

export default AtomCreatorPlugin;

// Named re-exports for tests / direct invocation.
export {
  validateJsonHook,
  validateSqlHook,
  checkTripleSyncHook,
  checkMcqBalanceHook,
  enforcePipelineOrderHook,
  checkDocsFreshnessHook,
  checkGamePatternsHook,
  checkAspectRatioHook,
  protectApprovedSpecsHook,
  checkStorytellingSignalsHook,
  guardShipReadyHook,
  guardGameGenerationHook,
};
