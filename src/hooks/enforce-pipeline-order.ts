import path from "node:path";
import { promises as fs } from "node:fs";
import { projectDir, readFileSafe } from "../lib/project-paths.js";

// Port of enforce-pipeline-order.sh
// Soft-warn only: prints the required next step after a spec status transition.

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

export async function enforcePipelineOrderHook(filePath: string): Promise<void> {
  if (!filePath.includes("courses/specs/") || !filePath.endsWith("-spec.md")) return;

  const content = await readFileSafe(filePath);
  if (!content) return;

  const statusMatch = content.match(/Status:\s*([A-Z][^\n|]*)/);
  if (!statusMatch) return;
  const status = statusMatch[1].trim();

  const slug = path.basename(filePath, "-spec.md");
  const root = projectDir();

  if (status === "CREATED") {
    console.warn(
      `[atom-creator] PIPELINE ENFORCEMENT: Course '${slug}' is now CREATED.\n` +
        `REQUIRED NEXT STEP: Run /atom-creator:audit ${slug} (internal 6-agent audit).\n` +
        `Do NOT generate assets, SQL, or mark as complete until the internal audit passes.`,
    );
    return;
  }

  if (status.startsWith("GENERATED")) {
    const report = await findExternalAuditReport(root, slug);
    if (!report) {
      console.warn(
        `[atom-creator] PIPELINE ENFORCEMENT: Course '${slug}' internal audit passed (GENERATED).\n` +
          `REQUIRED NEXT STEP: Run /atom-creator:final-audit ${slug} (external audit via /external-atom-audit skill).\n` +
          `Ad-hoc review agents do NOT satisfy this requirement. After external audit: rectify findings → update MD + JSON + SQL.`,
      );
    }
  }
  // SHIP-READY: no-op (pipeline complete).
}
