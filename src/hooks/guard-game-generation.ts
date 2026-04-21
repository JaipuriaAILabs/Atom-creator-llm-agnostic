import path from "node:path";
import { promises as fs } from "node:fs";
import { pathExists, readFileSafe } from "../lib/project-paths.js";

// Port of guard-game-generation.sh
// HARD BLOCKS Write of *-game.html unless:
//   Gate 4: design.md exists next to the target and contains a "## 7-Gate Zero-Shot Checklist" section with ≥600 chars of content
//   Gate 5: Mechanic in design.md matches the mechanic declared in the matching spec file
//
// NOTE: The original hook also enforced skill/transcript gates (Gates 1-3) by
// parsing the Claude Code transcript. OpenCode has no equivalent transcript
// API exposed to plugins (as of 0.5 SDK). We keep the strongest gates (4 and 5)
// which verify on-disk artifacts; the skill/reference gates are expected to
// be enforced inside the game skill prompt itself.

const FAMILIES: Record<string, string[]> = {
  allocation: ["allocation", "budget", "portfolio allocation", "portfolio builder"],
  "matrix placement": [
    "matrix placement",
    "classification",
    "classification/sorting",
    "quadrant",
    "2x2",
    "2d placement",
    "spatial placement",
    "spatial placement on a canvas",
  ],
  "multi-round strategy": [
    "multi-round strategy",
    "multi round strategy",
    "round strategy",
  ],
  "progressive reveal": ["progressive reveal", "timed reveal", "reveal sequence"],
  "signal detection": ["signal detection", "detection"],
  "dialogue tree": ["dialogue tree", "dialogue", "branching dialogue"],
  "slider balance": ["slider balance", "slider", "stretch the thread"],
  "contradiction hunt": ["contradiction hunt", "contradiction"],
  "rapid classify swipe": ["rapid classify swipe", "swipe", "rapid classify"],
  "build-and-watch execution": [
    "build-and-watch execution",
    "build and watch",
    "build-and-watch",
  ],
  "tool simulation": ["tool simulation", "tool sim"],
};

function familyOf(raw: string): string | null {
  const lower = raw.toLowerCase();
  for (const [family, aliases] of Object.entries(FAMILIES)) {
    for (const alias of aliases) {
      if (lower.includes(alias)) return family;
    }
  }
  return null;
}

async function findMatchingSpec(
  workspaceRoot: string,
  gameBasename: string,
  gameDirName: string,
): Promise<string | null> {
  const specsDir = path.join(workspaceRoot, "courses", "specs");
  const candidates = [
    path.join(specsDir, `${gameBasename}-spec.md`),
    path.join(specsDir, `${gameDirName}-spec.md`),
  ];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  // Strategy 3: suffix match against any spec slug
  let entries: string[];
  try {
    entries = await fs.readdir(specsDir);
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (!entry.endsWith("-spec.md")) continue;
    const specSlug = entry.replace(/-spec\.md$/, "");
    if (gameBasename.endsWith(specSlug)) {
      return path.join(specsDir, entry);
    }
  }
  return null;
}

function extractMechanic(text: string): string {
  // Try bolded form: **Mechanic:** or **Mechanic family:**
  const bold = text.match(/\*\*?Mechanic(?:\s+family)?:\*\*?\s*([^\n]+)/i);
  if (bold) return bold[1].trim().toLowerCase();
  const plain = text.match(/^Mechanic(?:\s+family)?:\s*([^\n]+)/im);
  if (plain) return plain[1].trim().toLowerCase();
  return "";
}

function extractGameConceptSection(spec: string): string {
  const match = spec.match(/##\s*Game Concept[\s\S]*?(?=\n##\s|$)/i);
  return match ? match[0] : spec; // fallback: whole spec
}

function measure7GateContentLength(design: string): number {
  // v10.16.0 regex: optional numeric prefix "N." or "N.N."
  const re =
    /^#{2,}[ \t]+(?:\d+(?:\.\d+)?\.?[ \t]+)?(?:7[- ]?Gate|Seven[- ]?Gate)[^\n]*\n([\s\S]*?)(?=^##\s[^#]|$)/im;
  const match = design.match(re);
  if (!match) return 0;
  return match[1].trim().length;
}

export async function guardGameGenerationHook(filePath: string): Promise<void> {
  const isGame =
    filePath.includes("/games/") &&
    filePath.endsWith("-game.html") &&
    path.basename(filePath).endsWith("-game.html");
  if (!isGame) return;

  const gameDir = path.dirname(filePath);
  const gameBasename = path.basename(filePath, "-game.html");
  const gameDirName = path.basename(gameDir);
  const workspaceRoot = filePath.replace(/\/games\/.*/, "");

  // Gate 4: design.md
  const designPath = path.join(gameDir, "design.md");
  const design = await readFileSafe(designPath);
  if (!design) {
    throw new Error(
      `GAME BLOCKED: Gate 4 — design.md MISSING at ${designPath}. Write the design doc BEFORE the HTML; the doc is the source of truth.`,
    );
  }
  const hasHeader =
    /^#{2,}\s+(?:\d+(?:\.\d+)?\.?\s+)?(?:7[- ]?Gate|Seven[- ]?Gate)/im.test(design);
  const contentLen = measure7GateContentLength(design);
  if (!hasHeader || contentLen < 600) {
    throw new Error(
      `GAME BLOCKED: Gate 4 — design.md (${designPath}) missing '## 7-Gate Zero-Shot Checklist' section with substantive content (≥600 chars). Required gates: ` +
        `(1) No dominant strategy, (2) Weaponized common sense, (3) Clear causation on failure, (4) Win condition binary/honest, (5) Uncertainty forces hedging, (6) Replay reveals strategy space, (7) MDA chain integrity. ` +
        `Each gate needs ≥2 sentences of specific content.`,
    );
  }

  // Gate 5: mechanic match
  const specFile = await findMatchingSpec(workspaceRoot, gameBasename, gameDirName);
  if (!specFile) {
    throw new Error(
      `GAME BLOCKED: Gate 5 — no matching spec file found for this game. Expected one of:\n` +
        `  ${path.join(workspaceRoot, "courses", "specs", `${gameBasename}-spec.md`)}\n` +
        `  ${path.join(workspaceRoot, "courses", "specs", `${gameDirName}-spec.md`)}`,
    );
  }
  const specContent = (await readFileSafe(specFile)) ?? "";
  const specMechanic = extractMechanic(extractGameConceptSection(specContent));
  const designMechanic = extractMechanic(design);
  if (!specMechanic || !designMechanic) {
    throw new Error(
      `GAME BLOCKED: Gate 5 — mechanic declaration missing. Spec '${specFile}' mechanic: '${specMechanic}'. Design '${designPath}' mechanic: '${designMechanic}'. Both files must declare the mechanic explicitly.`,
    );
  }
  const specFamily = familyOf(specMechanic);
  const designFamily = familyOf(designMechanic);
  const matches =
    specMechanic === designMechanic ||
    (specFamily !== null && specFamily === designFamily);
  if (!matches) {
    throw new Error(
      `GAME BLOCKED: Gate 5 — mechanic mismatch between spec and design.md.\n` +
        `  Spec (${specFile}): '${specMechanic}'\n` +
        `  Design (${designPath}): '${designMechanic}'\n` +
        `Either update design.md to match the spec's declared mechanic, or run /atom-creator:plan --refine {slug} to change the spec mechanic. Silently deviating is how CODIFY-reskin slop gets shipped.`,
    );
  }
}
