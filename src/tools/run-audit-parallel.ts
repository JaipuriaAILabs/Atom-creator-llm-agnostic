import path from "node:path";
import { z } from "zod";
import { projectDir, pathExists, readFileSafe } from "../lib/project-paths.js";

// Sequential port of the 6-agent audit. OpenCode doesn't expose per-agent
// model overrides the way Claude Code does, so we run the audit steps as a
// single coordinated prompt rather than forking sub-agents in parallel.
//
// This tool's job is to PREPARE the audit context. The orchestrator (typically
// the audit skill) consumes the returned `findings` array. Actual LLM calls
// happen inside the skill via the configured audit agent.

export const runAuditInputSchema = z.object({
  slug: z.string().min(1),
});

export type RunAuditInput = z.infer<typeof runAuditInputSchema>;

export type AuditSeverity = "hard" | "soft";

export interface AuditFinding {
  agent: string;
  severity: AuditSeverity;
  message: string;
}

export interface RunAuditResult {
  findings: AuditFinding[];
  courseMdPath: string | null;
  courseJsonPath: string | null;
  readiness: "ready" | "missing-files";
}

const AGENTS = [
  "MCQ Rigor",
  "Interview",
  "Surface",
  "Data Integrity",
  "Factual",
  "Storytelling Craft",
] as const;

async function resolveCourseFiles(
  slug: string,
): Promise<{ mdPath: string | null; jsonPath: string }> {
  const root = projectDir();
  const jsonPath = path.join(root, "courses", "JSONS", `${slug}.json`);
  const coursesDir = path.join(root, "courses");
  const candidates = [
    path.join(coursesDir, `${slug}-concept-sprint.md`),
    path.join(coursesDir, `${slug}-hands-on-guide.md`),
    path.join(coursesDir, `${slug}.md`),
  ];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return { mdPath: candidate, jsonPath };
    }
  }
  return { mdPath: null, jsonPath };
}

export async function runAuditParallel(input: RunAuditInput): Promise<RunAuditResult> {
  const parsed = runAuditInputSchema.parse(input);
  const { mdPath, jsonPath } = await resolveCourseFiles(parsed.slug);

  const findings: AuditFinding[] = [];

  if (!mdPath || !(await pathExists(jsonPath))) {
    findings.push({
      agent: "pre-flight",
      severity: "hard",
      message: `Missing course files for slug '${parsed.slug}'. Expected MD at courses/${parsed.slug}-concept-sprint.md (or -hands-on-guide.md) and JSON at courses/JSONS/${parsed.slug}.json.`,
    });
    return {
      findings,
      courseMdPath: mdPath,
      courseJsonPath: (await pathExists(jsonPath)) ? jsonPath : null,
      readiness: "missing-files",
    };
  }

  // Surface agent runs synchronously on loaded content — we can do a few cheap
  // structural checks here without invoking an LLM.
  const mdContent = (await readFileSafe(mdPath)) ?? "";
  const jsonContent = (await readFileSafe(jsonPath)) ?? "";

  const screenCount = (mdContent.match(/^##\s+Screen\s+/gm) ?? []).length;
  if (screenCount < 8 || screenCount > 18) {
    findings.push({
      agent: "Surface",
      severity: "soft",
      message: `Screen count is ${screenCount}; expected 8-18 (sweet spot 13 for concept sprint).`,
    });
  }

  try {
    const parsedJson = JSON.parse(jsonContent) as {
      screens?: Array<{ blocks?: Array<{ type: string }> }>;
    };
    const jsonScreens = parsedJson.screens?.length ?? 0;
    if (jsonScreens > 0 && jsonScreens !== screenCount && screenCount > 0) {
      findings.push({
        agent: "Surface",
        severity: "hard",
        message: `MD has ${screenCount} screens but JSON has ${jsonScreens}. Triple-sync drift detected.`,
      });
    }
  } catch {
    findings.push({
      agent: "Surface",
      severity: "hard",
      message: `courses/JSONS/${parsed.slug}.json is not valid JSON. Fix JSON syntax before running the full audit.`,
    });
  }

  // Emit placeholder entries for each downstream agent so the caller knows
  // which prompt chunks to run next.
  for (const agent of AGENTS) {
    if (agent === "Surface") continue; // already processed above
    findings.push({
      agent,
      severity: "soft",
      message: `Pending LLM audit pass — invoke the audit agent with the ${agent} section of shared/content-audit.md against courses/${parsed.slug}-*.md.`,
    });
  }

  return {
    findings,
    courseMdPath: mdPath,
    courseJsonPath: jsonPath,
    readiness: "ready",
  };
}
