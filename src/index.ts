// atom-creator-llm-agnostic — OpenCode plugin entry point.
//
// SDK note: the `@opencode-ai/plugin` package's published TypeScript surface is
// thin (the runtime is more documented than the types). We type our handler
// signatures structurally and cast at the module default-export boundary. If
// the SDK later exports a richer `Plugin` type, swap the local shims below for
// the real import.

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

import {
  generateImage,
  generateImageInputSchema,
} from "./tools/generate-image.js";
import {
  runAuditParallel,
  runAuditInputSchema,
} from "./tools/run-audit-parallel.js";

import {
  appendLearning,
  loadLearnings,
  summariseLearnings,
  type Learning,
} from "./learnings/capture.js";

// ─── Local type shims for the OpenCode plugin surface ────────────────────────
// Intentionally structural (no `any`). Update when @opencode-ai/plugin exports
// a canonical `Plugin` type.
interface ToolBeforeEvent {
  tool: string;
  args: {
    path?: string;
    file_path?: string;
    content?: string;
    command?: string;
    [key: string]: unknown;
  };
}

interface ToolAfterEvent extends ToolBeforeEvent {
  result?: {
    success?: boolean;
    output?: string;
    stdout?: string;
    stderr?: string;
    [key: string]: unknown;
  };
}

interface SessionEvent {
  session: { id?: string };
}

interface CustomTool<TInput, TOutput> {
  name: string;
  description: string;
  inputSchema: unknown; // Zod schema, but kept opaque at the type level
  execute: (input: TInput) => Promise<TOutput>;
}

interface PluginHandlers {
  "tool.execute.before"?: (event: ToolBeforeEvent) => Promise<void> | void;
  "tool.execute.after"?: (event: ToolAfterEvent) => Promise<void> | void;
  "session.created"?: (event: SessionEvent) => Promise<void> | void;
  "session.idle"?: (event: SessionEvent) => Promise<void> | void;
  tools?: Array<CustomTool<unknown, unknown>>;
}

type PluginFactory = () => Promise<PluginHandlers>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTargetPath(args: ToolBeforeEvent["args"]): string {
  return (args.path as string) ?? (args.file_path as string) ?? "";
}

const WRITE_TOOLS = new Set(["write", "edit", "Write", "Edit"]);
const BASH_TOOLS = new Set(["bash", "Bash"]);

// ─── Plugin factory ──────────────────────────────────────────────────────────

const factory: PluginFactory = async () => {
  return {
    "tool.execute.before": async ({ tool, args }) => {
      try {
        const filePath = getTargetPath(args);
        if (!filePath) return;

        if (WRITE_TOOLS.has(tool)) {
          // Specs
          if (filePath.includes("/specs/") && filePath.endsWith("-spec.md")) {
            await protectApprovedSpecsHook(filePath);
            await guardShipReadyHook(filePath, args.content as string | undefined);
          }

          // Course markdown (storytelling signals)
          if (
            filePath.includes("courses/") &&
            filePath.endsWith(".md") &&
            !filePath.includes("/specs/") &&
            !filePath.includes("audit-") &&
            !filePath.includes("batch-")
          ) {
            await checkStorytellingSignalsHook(
              filePath,
              args.content as string | undefined,
            );
          }

          // Game HTML
          if (filePath.endsWith("-game.html") && filePath.includes("/games/")) {
            await guardGameGenerationHook(filePath);
          }
        }
      } catch (err) {
        // Hard-block hooks throw; rethrow so OpenCode surfaces the error.
        throw err;
      }
    },

    "tool.execute.after": async ({ tool, args, result }) => {
      try {
        const filePath = getTargetPath(args);

        if (WRITE_TOOLS.has(tool)) {
          if (filePath.endsWith(".json") && filePath.includes("courses/JSONS/")) {
            await validateJsonHook(filePath);
            await checkMcqBalanceHook(filePath);
          }
          if (filePath.endsWith(".sql") && filePath.includes("courses/sql/")) {
            await validateSqlHook(filePath);
          }
          if (
            (filePath.endsWith(".json") && filePath.includes("courses/JSONS/")) ||
            (filePath.endsWith(".sql") && filePath.includes("courses/sql/")) ||
            (filePath.endsWith(".md") && filePath.includes("courses/"))
          ) {
            await checkTripleSyncHook(filePath);
          }
          if (filePath.includes("courses/specs/") && filePath.endsWith("-spec.md")) {
            await enforcePipelineOrderHook(filePath);
          }
          await checkDocsFreshnessHook(filePath);
          if (filePath.endsWith(".html") && filePath.includes("/games/")) {
            await checkGamePatternsHook(filePath);
          }
        }

        if (BASH_TOOLS.has(tool)) {
          await checkAspectRatioHook({
            command: args.command as string | undefined,
            toolResponse:
              (result?.output as string | undefined) ??
              (result?.stdout as string | undefined) ??
              "",
          });
        }
      } catch (err) {
        // tool.execute.after failures surface after the tool already ran;
        // re-throwing still feeds the error back to the model.
        throw err;
      }
    },

    "session.created": async ({ session }) => {
      try {
        const summary = await summariseLearnings();
        if (summary) {
          console.log(summary);
        }
        // Touch load to populate cache and prove path resolution works.
        await loadLearnings(session.id);
      } catch (err) {
        console.warn(
          `[atom-creator] session.created: failed to load learnings — ${(err as Error).message}`,
        );
      }
    },

    "session.idle": async ({ session }) => {
      // Placeholder for per-session learning capture. Consumers append via
      // `appendLearning()` directly during the session. If no entries were
      // added for this session, this is a no-op.
      try {
        const existing = await loadLearnings(session.id);
        if (existing.length === 0) return;
        // Consolidation logic (recurrence-based promotion proposals) lives
        // server-side in the atom-creator-learnings workflow; leave it to the
        // dedicated skill so plugin-layer idle stays cheap.
      } catch {
        // swallow — idle hook must never throw
      }
    },

    tools: [
      {
        name: "generate-image",
        description:
          "Generate a course visual via fal.ai SeedDream 4.5. Requires visuals/generate_fal.py in the workspace.",
        inputSchema: generateImageInputSchema,
        execute: (input) => generateImage(input as Parameters<typeof generateImage>[0]),
      },
      {
        name: "run-audit-parallel",
        description:
          "Prepare the 6-agent content audit for a course slug. Returns structural pre-flight findings and a work list for the audit agent.",
        inputSchema: runAuditInputSchema,
        execute: (input) =>
          runAuditParallel(input as Parameters<typeof runAuditParallel>[0]),
      },
    ] as Array<CustomTool<unknown, unknown>>,
  };
};

export default factory;

// Re-exports for package consumers and Wave 2 tests.
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
  generateImage,
  runAuditParallel,
  appendLearning,
  loadLearnings,
  summariseLearnings,
};
export type { Learning };
