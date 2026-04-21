import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { projectDir, pathExists } from "../lib/project-paths.js";

// Port of check-docs-freshness.sh — soft-warn only.
// Warns if the plugin help page is older than the modified file.

interface PluginEntry {
  matchTerms: string[];
  name: string;
  learningsRelative: string;
}

const PLUGINS: PluginEntry[] = [
  { matchTerms: ["atom-creator"], name: "atom-creator", learningsRelative: ".claude/atom-creator-learnings.md" },
  { matchTerms: ["taste"], name: "rehearsal-taste", learningsRelative: ".claude/taste-learnings.md" },
  { matchTerms: ["podcast"], name: "rehearsal-podcast", learningsRelative: ".claude/podcast-learnings.md" },
];

function isRelevantPath(filePath: string): boolean {
  return (
    filePath.includes("learnings") ||
    filePath.includes("/shared/") ||
    (filePath.includes("/commands/") && filePath.endsWith(".md")) ||
    filePath.includes("/hooks/")
  );
}

async function findHelpPage(pluginName: string): Promise<string | null> {
  const home = os.homedir();
  const searchDirs = [
    path.join(home, ".claude", "plugins", "cache", "rehearsal-dev", pluginName),
    path.join(home, ".claude", "plugins", "marketplaces", "rehearsal-dev", pluginName),
  ];
  for (const dir of searchDirs) {
    try {
      // Shallow recursive search limited to one level, since help-page.html is
      // typically at the package root.
      const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name === "help-page.html") {
          // recursive readdir returns names without the parent path; we need a walk.
          // Fall back to a simple find.
          const full = path.join((entry as unknown as { path: string }).path ?? dir, entry.name);
          if (await pathExists(full)) return full;
        }
      }
    } catch {
      // not present
    }
  }
  return null;
}

async function mtime(p: string): Promise<number> {
  try {
    const stat = await fs.stat(p);
    return stat.mtimeMs;
  } catch {
    return 0;
  }
}

export async function checkDocsFreshnessHook(filePath: string): Promise<void> {
  if (!isRelevantPath(filePath)) return;

  const plugin = PLUGINS.find((p) => p.matchTerms.some((term) => filePath.includes(term)));
  if (!plugin) return;

  const helpPage = await findHelpPage(plugin.name);
  if (!helpPage) {
    console.warn(`[atom-creator] DOCS: ${plugin.name} help-page.html not found — consider creating one.`);
    return;
  }

  const helpMtime = await mtime(helpPage);
  const fileMtime = await mtime(filePath);
  if (fileMtime > helpMtime) {
    const learningsPath = path.join(projectDir(), plugin.learningsRelative);
    let suffix = "";
    try {
      const raw = await fs.readFile(learningsPath, "utf-8");
      const count = (raw.match(/^###\s/gm) ?? []).length;
      if (count > 0) suffix = ` (${count} learnings captured)`;
    } catch {
      // no learnings file, skip the count
    }
    console.warn(
      `[atom-creator] DOCS STALE: ${plugin.name} help-page.html is older than recently modified files${suffix}. Run /${plugin.name}:help and regenerate if needed.`,
    );
  }
}
