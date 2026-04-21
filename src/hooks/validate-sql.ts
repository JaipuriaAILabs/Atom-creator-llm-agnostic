import { promises as fs } from "node:fs";
import path from "node:path";
import { projectDir, readFileSafe, slugFromSqlPath } from "../lib/project-paths.js";

// Port of validate-sql-on-save.sh
// Blocks SQL INSERTs that reference a non-existent `description` column or
// carry forward deprecated JSON "value" keys.

interface CourseJson {
  screens?: Array<{ blocks?: Array<{ type: string; value?: unknown; text?: unknown }> }>;
}

export async function validateSqlHook(filePath: string): Promise<void> {
  if (!filePath.includes("courses/sql/") || !filePath.endsWith(".sql")) return;

  let sql: string;
  try {
    sql = await fs.readFile(filePath, "utf-8");
  } catch {
    return;
  }

  const errors: string[] = [];

  const descAsColumn = /^\s*("?description"?)\s*,/im.test(sql);
  const descInInsert = /INSERT\s+INTO[^(]*\([^)]*description[^)]*\)/i.test(sql);
  if (descAsColumn || descInInsert) {
    errors.push(
      `SQL ERROR: Found 'description' as a standalone column. The course_content table has NO description column — it lives inside course_metadata JSONB. Remove the column; embed the value inside course_metadata.`,
    );
  }

  if (!/ON\s+CONFLICT/i.test(sql)) {
    errors.push(
      `SQL WARNING: No ON CONFLICT clause found. Every course INSERT should use ON CONFLICT upsert to handle re-runs safely.`,
    );
  }

  // Pre-flight JSON validation of the source JSON file.
  const slug = slugFromSqlPath(filePath);
  const jsonPath = path.join(projectDir(), "courses", "JSONS", `${slug}.json`);
  const jsonRaw = await readFileSafe(jsonPath);
  if (jsonRaw) {
    try {
      const data = JSON.parse(jsonRaw) as CourseJson;
      let count = 0;
      for (const screen of data.screens ?? []) {
        for (const block of screen.blocks ?? []) {
          if (block.type === "text" && "value" in block && !("text" in block)) {
            count++;
          }
        }
      }
      if (count > 0) {
        errors.push(
          `SQL ERROR: Source JSON (${jsonPath}) has ${count} text blocks using deprecated 'value' key. Fix the JSON first — SQL embeds it verbatim, propagating the rendering failure to the database.`,
        );
      }
    } catch {
      // JSON invalid; validate-json will report it separately.
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
