import { promises as fs } from "node:fs";
import path from "node:path";
import {
  projectDir,
  pathExists,
  readFileSafe,
  slugFromCourseMdPath,
  slugFromJsonPath,
  slugFromSqlPath,
} from "../lib/project-paths.js";

// Port of check-triple-sync.sh
// When MD, JSON, or SQL is modified, compare companion files for drift.
// Throws on title or screen-count mismatch. Silently passes when <2 files exist.

interface CourseJsonMeta {
  metadata?: { title?: string; description?: string };
  screens?: unknown[];
}

function detectFileType(filePath: string): "md" | "json" | "sql" | null {
  if (filePath.includes("courses/JSONS/") && filePath.endsWith(".json")) return "json";
  if (filePath.includes("courses/sql/") && filePath.endsWith(".sql")) return "sql";
  if (filePath.includes("courses/") && filePath.endsWith(".md")) {
    if (
      filePath.includes("/specs/") ||
      filePath.includes("/audit-") ||
      filePath.includes("/batch-") ||
      path.basename(filePath).startsWith("COURSE-")
    ) {
      return null;
    }
    return "md";
  }
  return null;
}

async function findCourseMd(root: string, slug: string): Promise<string | null> {
  const dir = path.join(root, "courses");
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return null;
  }
  const match = entries.find(
    (name) =>
      name.startsWith(slug) &&
      name.endsWith(".md") &&
      !name.startsWith("batch-") &&
      !name.startsWith("COURSE-"),
  );
  return match ? path.join(dir, match) : null;
}

export async function checkTripleSyncHook(filePath: string): Promise<void> {
  const fileType = detectFileType(filePath);
  if (!fileType) return;

  const slug =
    fileType === "md"
      ? slugFromCourseMdPath(filePath)
      : fileType === "json"
        ? slugFromJsonPath(filePath)
        : slugFromSqlPath(filePath);

  if (!slug) return;

  const root = projectDir();
  const mdFile = await findCourseMd(root, slug);
  const jsonFile = path.join(root, "courses", "JSONS", `${slug}.json`);
  const sqlFile = path.join(root, "courses", "sql", `${slug}-insert.sql`);

  const mdExists = mdFile ? await pathExists(mdFile) : false;
  const jsonExists = await pathExists(jsonFile);
  const sqlExists = await pathExists(sqlFile);

  const existing = [mdExists, jsonExists, sqlExists].filter(Boolean).length;
  if (existing < 2) return;

  const errors: string[] = [];

  let mdTitle = "";
  let jsonTitle = "";
  let mdScreens = 0;
  let jsonScreens = 0;

  if (mdExists && mdFile) {
    const md = (await readFileSafe(mdFile)) ?? "";
    const h1 = md.match(/^#\s+(.+)$/m);
    mdTitle = h1 ? h1[1].trim() : "";
    mdScreens = (md.match(/^##\s+Screen\s+/gm) ?? []).length;
  }

  if (jsonExists) {
    const raw = await readFileSafe(jsonFile);
    if (raw) {
      try {
        const data = JSON.parse(raw) as CourseJsonMeta;
        jsonTitle = data.metadata?.title ?? "";
        jsonScreens = (data.screens ?? []).length;
      } catch {
        // validate-json will surface parse errors
      }
    }
  }

  if (mdTitle && jsonTitle && mdTitle !== jsonTitle) {
    errors.push(
      `TRIPLE-SYNC DRIFT: Title mismatch — MD: '${mdTitle}' vs JSON: '${jsonTitle}'. Update JSON to match MD (source of truth).`,
    );
  }

  if (mdScreens > 0 && jsonScreens > 0 && mdScreens !== jsonScreens) {
    errors.push(
      `TRIPLE-SYNC DRIFT: Screen count mismatch — MD has ${mdScreens} screens vs JSON has ${jsonScreens} screens. Investigate which is correct.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
