import { readFileSafe } from "../lib/project-paths.js";

// Port of protect-approved-specs.sh
// Warns (does not hard-block) when writing over a spec with protected status.
// The original hook requested a user permission prompt — OpenCode doesn't expose
// `permissionDecision: 'ask'` directly, so we log a prominent warning. If the
// plugin owner wants a real block, swap console.warn for `throw new Error(...)`.

const PROTECTED_STATUS = /Status:\s*(APPROVED|GENERATED|SHIP-READY)([^\n|]*)/;

export async function protectApprovedSpecsHook(filePath: string): Promise<void> {
  if (!filePath.includes("courses/specs/") || !filePath.endsWith("-spec.md")) return;

  const existing = await readFileSafe(filePath);
  if (!existing) return;

  const match = existing.match(PROTECTED_STATUS);
  if (!match) return;

  const currentStatus = (match[1] + (match[2] ?? "")).trim();
  console.warn(
    `[atom-creator] WARNING: Spec '${filePath}' currently has '${currentStatus}'. Writing resets pipeline state. If re-running :create, status resets to CREATED (forcing re-audit). If re-running :plan, status resets to DRAFT. Proceed only if intentional.`,
  );
}
