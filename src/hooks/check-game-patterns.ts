import { promises as fs } from "node:fs";
import path from "node:path";

// Port of check-game-patterns.sh — advisory only (console.warn).
// Scans games/**/*.html for known bug patterns.

const RE_USE_EFFECT_KEYED =
  /useEffect\([^)]*,\s*\[(pos|round|idx|scenarioIdx|roundIdx)\]/;
const RE_GSAP_FROMTO_REF = /gsap\.fromTo\([a-zA-Z]+Ref|gsap\.fromTo\(cardRef/;
const RE_GSAP_SET_REF = /gsap\.set\([a-zA-Z]+Ref/;
const RE_CONTAINER_ONCLICK =
  /<div class="(reflect|intro|win|overlay|stage|panel|container)"[^>]*onClick=/;
const RE_REFLECT_PHASE = /phase\s*===\s*['"]reflect['"]/;

function isGameHtml(filePath: string): boolean {
  return (
    filePath.endsWith(".html") &&
    (filePath.includes("/games/") || filePath.includes(`${path.sep}games${path.sep}`))
  );
}

export async function checkGamePatternsHook(filePath: string): Promise<void> {
  if (!isGameHtml(filePath)) return;

  let content: string;
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    return;
  }

  const warnings: string[] = [];

  // Rule 1: bare gsap.from(
  if (/gsap\.from\(/.test(content)) {
    if (!/gsap\.fromTo\(/.test(content)) {
      warnings.push(
        "gsap.from( detected — rule 7.1: use gsap.fromTo() instead (Preact re-render leaves opacity:0).",
      );
    } else if (/gsap\.from\([^T]/.test(content)) {
      warnings.push(
        "gsap.from( (non-fromTo) detected — prefer gsap.fromTo() exclusively per rule 7.1.",
      );
    }
  }

  // Rule 2: keyed useEffect with fromTo but no set reset
  if (
    RE_USE_EFFECT_KEYED.test(content) &&
    RE_GSAP_FROMTO_REF.test(content) &&
    !RE_GSAP_SET_REF.test(content)
  ) {
    warnings.push(
      "keyed useEffect uses gsap.fromTo on a ref but no gsap.set reset — Preact reuses DOM, exit-anim transforms will bleed. Add gsap.set(ref.current, {x:0, opacity:1, rotation:0}) before gsap.fromTo.",
    );
  }

  // Rule 3: container-level onClick
  if (RE_CONTAINER_ONCLICK.test(content)) {
    warnings.push(
      "container-level div has onClick= handler — phantom-click bug risk. Attach onClick to specific interactive children.",
    );
  }

  // Rule 4: Reflect-phase recommendation
  if (!RE_REFLECT_PHASE.test(content)) {
    const deckCount = (content.match(/^\s*\{ico:/gm) ?? []).length;
    if (deckCount > 10) {
      warnings.push(
        `${deckCount} deck entries but no phase==='reflect' — consider adding a Reflect phase between play and win.`,
      );
    }
  }

  if (warnings.length > 0) {
    const header = `[atom-creator] check-game-patterns advisory (${path.basename(filePath)}):`;
    console.warn(
      `${header}\n${warnings.map((w) => `   · ${w}`).join("\n")}\n   (non-blocking — Agent 4 enforces these at audit time)`,
    );
  }
}
