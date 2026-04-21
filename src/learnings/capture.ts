import { promises as fs } from "node:fs";
import path from "node:path";
import { projectDir, pathExists } from "../lib/project-paths.js";

// Self-evolution system port.
// Reads/writes `.opencode/atom-creator-learnings.jsonl` (one Learning per line).

export interface Learning {
  timestamp: string;
  sessionId?: string;
  category: string;
  rule: string;
  occurrences: number;
}

function learningsPath(): string {
  return path.join(projectDir(), ".opencode", "atom-creator-learnings.jsonl");
}

export async function loadLearnings(sessionId?: string): Promise<Learning[]> {
  const file = learningsPath();
  if (!(await pathExists(file))) return [];
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return [];
  }
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  const out: Learning[] = [];
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as Learning;
      if (sessionId && parsed.sessionId && parsed.sessionId !== sessionId) continue;
      out.push(parsed);
    } catch {
      // skip malformed lines
    }
  }
  return out;
}

export async function appendLearning(learning: Learning): Promise<void> {
  const file = learningsPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, JSON.stringify(learning) + "\n", "utf-8");
}

export async function summariseLearnings(): Promise<string> {
  const all = await loadLearnings();
  if (all.length === 0) return "";
  const byCategory = new Map<string, number>();
  for (const l of all) {
    byCategory.set(l.category, (byCategory.get(l.category) ?? 0) + l.occurrences);
  }
  const parts = [`[atom-creator learnings loaded: ${all.length} entries]`];
  for (const [cat, count] of byCategory) {
    parts.push(`  · ${cat}: ${count} occurrences`);
  }
  return parts.join("\n");
}
