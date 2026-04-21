import { spawn } from "node:child_process";
import path from "node:path";
import { z } from "zod";
import { projectDir, pathExists } from "../lib/project-paths.js";

// OpenCode custom tool: wraps visuals/generate_fal.py.
// Cost: ~$0.04 per image via fal.ai SeedDream 4.5.

export const generateImageInputSchema = z.object({
  slug: z.string().min(1),
  screen: z.number().int().nonnegative(),
  aspectRatio: z.enum(["landscape", "portrait"]).optional(),
});

export type GenerateImageInput = z.infer<typeof generateImageInputSchema>;

export interface GenerateImageResult {
  imagePath: string;
  cost: number;
}

interface SpawnResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runPython(args: string[], cwd: string): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (c) => (stdout += String(c)));
    proc.stderr.on("data", (c) => (stderr += String(c)));
    proc.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(
          new Error(
            "python3 not found on PATH. Install Python 3 to use the generate-image tool.",
          ),
        );
      } else {
        reject(err);
      }
    });
    proc.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

export async function generateImage(
  input: GenerateImageInput,
): Promise<GenerateImageResult> {
  const parsed = generateImageInputSchema.parse(input);
  const root = projectDir();
  const script = path.join(root, "visuals", "generate_fal.py");
  if (!(await pathExists(script))) {
    throw new Error(
      `generate-image tool: script not found at ${script}. The tool expects the atom-creator workspace layout with visuals/generate_fal.py. Set ATOM_CREATOR_PROJECT_DIR if running from a different cwd.`,
    );
  }

  const args = [script, parsed.slug, "--screen", String(parsed.screen)];
  if (parsed.aspectRatio) {
    args.push("--aspect", parsed.aspectRatio);
  }

  const result = await runPython(args, root);
  if (result.code !== 0) {
    throw new Error(
      `generate-image tool failed (exit ${result.code}). stderr:\n${result.stderr.trim()}`,
    );
  }

  // Try to parse a final JSON line from stdout (generate_fal.py prints one).
  const lines = result.stdout.trim().split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line.startsWith("{")) continue;
    try {
      const parsedJson = JSON.parse(line) as { image_path?: string; cost?: number };
      return {
        imagePath: parsedJson.image_path ?? "",
        cost: parsedJson.cost ?? 0.04,
      };
    } catch {
      // keep looking
    }
  }

  // Fallback: assume success with default cost, path inferred from convention.
  const inferredPath = path.join(
    root,
    "visuals",
    parsed.slug,
    parsed.screen === 0 ? "visual-0-cover.png" : `visual-${parsed.screen}.png`,
  );
  return { imagePath: inferredPath, cost: 0.04 };
}
