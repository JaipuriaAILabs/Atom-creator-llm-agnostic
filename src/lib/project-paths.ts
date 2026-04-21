import path from "node:path";
import { promises as fs } from "node:fs";

// Resolve the atom-creator workspace root.
// Priority: ATOM_CREATOR_PROJECT_DIR env > opencode/CC env var > cwd.
export function projectDir(): string {
  return (
    process.env.ATOM_CREATOR_PROJECT_DIR ??
    process.env.CLAUDE_PROJECT_DIR ??
    process.env.OPENCODE_PROJECT_DIR ??
    process.cwd()
  );
}

export async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function readFileSafe(p: string): Promise<string | null> {
  try {
    return await fs.readFile(p, "utf-8");
  } catch {
    return null;
  }
}

export function slugFromSqlPath(filePath: string): string {
  const base = path.basename(filePath, ".sql");
  return base.replace(/-insert$/, "");
}

export function slugFromJsonPath(filePath: string): string {
  return path.basename(filePath, ".json");
}

// Strip known archetype suffixes from a course MD filename.
export function slugFromCourseMdPath(filePath: string): string {
  const base = path.basename(filePath, ".md");
  return base.replace(/-concept-sprint$/, "").replace(/-hands-on-guide$/, "");
}
