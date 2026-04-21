import { promises as fs } from "node:fs";

// Port of validate-json-on-save.sh
// Runs on tool.execute.after for Write/Edit of files under courses/JSONS/*.json.
// Throws to hard-block when schema violations are detected.

interface TextBlock {
  type: string;
  value?: unknown;
  text?: unknown;
  font?: unknown;
}

interface GlossaryBlock {
  type: string;
  practice?: unknown;
}

interface TableBlock {
  type: string;
  headers?: unknown[];
}

type Block = TextBlock | GlossaryBlock | TableBlock | { type: string };

interface Screen {
  blocks?: Block[];
}

interface CourseJson {
  screens?: Screen[];
}

export async function validateJsonHook(filePath: string): Promise<void> {
  if (!filePath.includes("courses/JSONS/") || !filePath.endsWith(".json")) {
    return;
  }

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    // File may not have been flushed yet, or it was deleted. Non-fatal.
    return;
  }

  let data: CourseJson;
  try {
    data = JSON.parse(raw) as CourseJson;
  } catch (err) {
    throw new Error(
      `SCHEMA ERROR: ${filePath} is not valid JSON (${(err as Error).message}). Fix JSON syntax before saving.`,
    );
  }

  const screens = data.screens ?? [];
  const errors: string[] = [];

  let deprecatedValueCount = 0;
  let glossaryMissingPractice = 0;
  let wideTableCount = 0;
  let missingFontCount = 0;

  for (const screen of screens) {
    const blocks = screen.blocks ?? [];
    for (const block of blocks) {
      if (block.type === "text") {
        const t = block as TextBlock;
        if ("value" in t && !("text" in t)) deprecatedValueCount++;
        if (!("font" in t)) missingFontCount++;
      } else if (block.type === "glossary") {
        const g = block as GlossaryBlock;
        if (!("practice" in g)) glossaryMissingPractice++;
      } else if (block.type === "table") {
        const tbl = block as TableBlock;
        if ((tbl.headers?.length ?? 0) > 3) wideTableCount++;
      }
    }
  }

  if (deprecatedValueCount > 0) {
    errors.push(
      `SCHEMA ERROR: ${deprecatedValueCount} text block(s) use deprecated 'value' key instead of 'text'. Frontend renders these as blank. Fix: replace 'value' with 'text' in all text blocks.`,
    );
  }
  if (glossaryMissingPractice > 0) {
    errors.push(
      `SCHEMA ERROR: ${glossaryMissingPractice} glossary block(s) missing 'practice' object. Missing practice breaks rendering (C34 HARD GATE).`,
    );
  }
  if (wideTableCount > 0) {
    errors.push(
      `SCHEMA ERROR: ${wideTableCount} table(s) have >3 columns. Narrative-first artifact rendering requires max 3 columns (C53 HARD GATE).`,
    );
  }
  if (missingFontCount > 0) {
    errors.push(
      `SCHEMA ERROR: ${missingFontCount} text block(s) missing 'font' field. Required: 'font': 'body' or 'font': 'heading'.`,
    );
  }
  if (/"above_content"/.test(raw)) {
    errors.push(
      `SCHEMA ERROR: Found deprecated 'above_content' placement. Use 'hero' only.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
