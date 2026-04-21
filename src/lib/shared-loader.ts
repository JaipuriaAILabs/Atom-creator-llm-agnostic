import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

// Candidate roots where the vendored `shared/` directory may live after install.
// Order matters: project-local install wins over global, bundled fallback last.
function candidateRoots(): string[] {
  const cwd = process.cwd();
  const home = os.homedir();
  return [
    path.join(cwd, ".opencode", "shared"),
    path.join(home, ".config", "opencode", "shared"),
    // When running from the plugin package itself (development)
    path.resolve(__dirname, "..", "..", "shared"),
  ];
}

export async function resolveSharedRoot(): Promise<string> {
  for (const root of candidateRoots()) {
    try {
      const stat = await fs.stat(root);
      if (stat.isDirectory()) return root;
    } catch {
      // not present, try next
    }
  }
  throw new Error(
    `atom-creator-llm-agnostic: could not locate shared/ directory. Tried: ${candidateRoots().join(
      ", ",
    )}`,
  );
}

export async function loadSharedFile(filename: string): Promise<string> {
  const root = await resolveSharedRoot();
  const full = path.join(root, filename);
  return fs.readFile(full, "utf-8");
}
