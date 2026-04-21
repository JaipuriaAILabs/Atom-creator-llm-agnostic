import path from "node:path";
import { promises as fs } from "node:fs";
import {
  projectDir,
  pathExists,
  readFileSafe,
} from "../lib/project-paths.js";

// Port of guard-ship-ready.sh
// HARD BLOCKS writing a spec that stamps SHIP-READY unless:
//   1. An external audit report exists in docs/
//   2. That report contains structured findings
//   3. All three course files (MD + JSON + SQL) exist

async function findExternalAuditReport(
  root: string,
  slug: string,
): Promise<string | null> {
  const docsDir = path.join(root, "docs");
  let entries: string[];
  try {
    entries = await fs.readdir(docsDir);
  } catch {
    return null;
  }
  const match = entries.find(
    (name) =>
      (name.includes(slug) && name.includes("external") && name.includes("audit")) ||
      (name.includes("external") && name.includes("audit") && name.includes(slug)),
  );
  return match ? path.join(docsDir, match) : null;
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

export async function guardShipReadyHook(
  filePath: string,
  content: string | undefined,
): Promise<void> {
  if (!filePath.includes("courses/specs/") || !filePath.endsWith("-spec.md")) return;
  if (!content || !content.includes("SHIP-READY")) return;

  const root = projectDir();
  const slug = path.basename(filePath, "-spec.md");

  // Gate 1: external audit report must exist
  const report = await findExternalAuditReport(root, slug);
  if (!report) {
    throw new Error(
      `BLOCKED: Cannot stamp SHIP-READY for '${slug}' — no external audit report found in docs/.\n` +
        `REQUIRED: Run /atom-creator:final-audit ${slug} which invokes /external-atom-audit.\n` +
        `The /external-atom-audit skill must generate a report at docs/external-audit-${slug}.md.\n` +
        `Ad-hoc review agents do NOT satisfy this requirement.`,
    );
  }

  // Gate 2: report must contain structured findings
  const reportBody = (await readFileSafe(report)) ?? "";
  if (!/Finding|VERIFIED|PASS|FAIL|Severity|Rectif/.test(reportBody)) {
    throw new Error(
      `BLOCKED: External audit report exists but appears incomplete or malformed: ${report}\n` +
        `REQUIRED: The report must contain structured findings from /external-atom-audit.\n` +
        `Re-run /atom-creator:final-audit ${slug} to generate a proper audit report.`,
    );
  }

  // Gate 3: all 3 course files must exist
  const mdFile = await findCourseMd(root, slug);
  const jsonFile = path.join(root, "courses", "JSONS", `${slug}.json`);
  const sqlFile = path.join(root, "courses", "sql", `${slug}-insert.sql`);

  const missing: string[] = [];
  if (!mdFile || !(await pathExists(mdFile))) missing.push("MD");
  if (!(await pathExists(jsonFile))) missing.push("JSON");
  if (!(await pathExists(sqlFile))) missing.push("SQL");

  if (missing.length > 0) {
    throw new Error(
      `BLOCKED: Cannot stamp SHIP-READY — missing course files: ${missing.join(", ")}.\n` +
        `All three (MD + JSON + SQL) must exist and be synced before shipping.\n` +
        `Run /atom-creator:db-insert ${slug} if SQL is missing.`,
    );
  }
}
