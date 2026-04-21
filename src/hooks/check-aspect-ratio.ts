import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { projectDir } from "../lib/project-paths.js";

// Port of check-aspect-ratio.sh
// Scans visuals/ for PNG files modified in the last minute, reads dimensions via sips,
// and throws if mobile cover is landscape/square or body image is square.

interface BashHookPayload {
  command?: string;
  toolResponse?: string;
}

function runSips(filePath: string, flag: "-g" | "--get"): Promise<string> {
  return new Promise((resolve) => {
    const proc = spawn("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    proc.stdout.on("data", (chunk) => (out += String(chunk)));
    proc.on("error", () => resolve(""));
    proc.on("close", () => resolve(out));
    // silence unused-var warning on `flag`
    void flag;
  });
}

function parseSipsOutput(raw: string): { width: number; height: number } {
  const widthMatch = raw.match(/pixelWidth:\s*(\d+)/);
  const heightMatch = raw.match(/pixelHeight:\s*(\d+)/);
  return {
    width: widthMatch ? Number(widthMatch[1]) : 0,
    height: heightMatch ? Number(heightMatch[1]) : 0,
  };
}

async function findRecentPngs(root: string): Promise<string[]> {
  const visualsDir = path.join(root, "visuals");
  const results: string[] = [];
  const cutoff = Date.now() - 60_000;

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".png")) {
        try {
          const stat = await fs.stat(full);
          if (stat.mtimeMs >= cutoff) results.push(full);
        } catch {
          // ignore
        }
      }
    }
  }
  await walk(visualsDir);
  return results;
}

export async function checkAspectRatioHook(payload: BashHookPayload): Promise<void> {
  const command = payload.command ?? "";
  const toolResponse = payload.toolResponse ?? "";
  if (!command.includes("visuals/") && !toolResponse.includes("visuals/")) return;

  const root = projectDir();
  const recent = await findRecentPngs(root);
  if (recent.length === 0) return;

  const errors: string[] = [];
  for (const img of recent) {
    const filename = path.basename(img);
    const raw = await runSips(img, "-g");
    const { width, height } = parseSipsOutput(raw);
    if (!width || !height) continue;

    if (filename.includes("cover-mobile")) {
      if (width >= height) {
        errors.push(
          `ASPECT RATIO ERROR: ${filename} is ${width}x${height} (landscape/square) but should be 3:4 portrait for mobile cover. Regenerate with --ratio 3:4.`,
        );
      }
    } else if (filename.includes("visual-")) {
      if (width === height) {
        errors.push(
          `ASPECT RATIO ERROR: ${filename} is ${width}x${height} (square). Gemini silently ignored aspect ratio config. Expected 4:3 landscape. Regenerate with --ratio 4:3.`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
