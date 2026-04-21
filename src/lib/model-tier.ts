import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

export interface TierMap {
  high: string;
  mid: string;
}

export const DEFAULT_TIERS: TierMap = {
  high: "moonshot/kimi-k2.6-max",
  mid: "moonshot/kimi-k2.6",
};

interface OpencodeConfig {
  model?: string;
  tier?: Partial<TierMap>;
  agent?: Record<string, { model?: string }>;
}

async function readJsonIfExists(p: string): Promise<OpencodeConfig | null> {
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as OpencodeConfig;
  } catch {
    return null;
  }
}

export async function resolveTiers(): Promise<TierMap> {
  const cwd = process.cwd();
  const home = os.homedir();

  const project = await readJsonIfExists(path.join(cwd, "opencode.json"));
  const global = await readJsonIfExists(
    path.join(home, ".config", "opencode", "opencode.json"),
  );

  const merged: Partial<TierMap> = {
    ...DEFAULT_TIERS,
    ...(global?.tier ?? {}),
    ...(project?.tier ?? {}),
  };

  return {
    high: merged.high ?? DEFAULT_TIERS.high,
    mid: merged.mid ?? DEFAULT_TIERS.mid,
  };
}

export function substituteTierPlaceholders(
  text: string,
  tiers: TierMap,
): string {
  return text
    .replace(/\{\{\s*tier\.high\s*\}\}/g, tiers.high)
    .replace(/\{\{\s*tier\.mid\s*\}\}/g, tiers.mid);
}
