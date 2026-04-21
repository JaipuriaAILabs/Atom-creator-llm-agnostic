import { promises as fs } from "node:fs";

// Port of check-mcq-balance.sh
// Detects systematic MCQ length bias, over-long options, and position clustering.
// Throws on systematic bias; otherwise logs warnings.

interface McqBlock {
  type: "mcq";
  options?: string[];
  correct?: number;
}

interface Block {
  type: string;
}

interface Screen {
  blocks?: Block[];
}

interface CourseJson {
  screens?: Screen[];
}

interface McqRecord {
  screen: number;
  options: string[];
  correctIdx: number;
}

export async function checkMcqBalanceHook(filePath: string): Promise<void> {
  if (!filePath.includes("courses/JSONS/") || !filePath.endsWith(".json")) return;

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return;
  }

  let data: CourseJson;
  try {
    data = JSON.parse(raw) as CourseJson;
  } catch {
    return; // validate-json will surface this
  }

  const mcqs: McqRecord[] = [];
  const screens = data.screens ?? [];
  for (let i = 0; i < screens.length; i++) {
    for (const block of screens[i].blocks ?? []) {
      if (block.type === "mcq") {
        const m = block as McqBlock;
        const options = m.options ?? [];
        const correctIdx = m.correct ?? 0;
        if (options.length >= 2) {
          mcqs.push({ screen: i, options, correctIdx });
        }
      }
    }
  }

  if (mcqs.length === 0) return;

  const errors: string[] = [];
  let correctLongestCount = 0;

  for (const mcq of mcqs) {
    const lengths = mcq.options.map((o) => o.length);
    const correctLen = lengths[mcq.correctIdx] ?? 0;
    const maxOther =
      lengths.length > 1
        ? Math.max(
            ...lengths.filter((_, idx) => idx !== mcq.correctIdx),
          )
        : 0;

    if (correctLen > maxOther) {
      correctLongestCount++;
      const delta = correctLen - maxOther;
      if (delta > 6) {
        errors.push(
          `MCQ BALANCE WARNING: Screen ${mcq.screen} — correct answer is ${delta} chars longer than next longest option. Consider shortening correct or lengthening distractors.`,
        );
      }
    }

    for (let j = 0; j < mcq.options.length; j++) {
      if (mcq.options[j].length > 80) {
        errors.push(
          `MCQ LENGTH: Screen ${mcq.screen}, option ${j + 1} is ${mcq.options[j].length} chars (>80 char limit). Long options signal the correct answer.`,
        );
      }
    }
  }

  let systematicBias = false;
  if (mcqs.length >= 3 && correctLongestCount > mcqs.length * 0.5) {
    systematicBias = true;
    const pct = Math.round((correctLongestCount / mcqs.length) * 100);
    errors.push(
      `MCQ SYSTEMATIC BIAS: Correct answer is the longest option in ${correctLongestCount}/${mcqs.length} MCQs (${pct}%). Learners can guess by picking the longest. Rebalance the worst offenders.`,
    );
  }

  if (mcqs.length >= 3) {
    const positions = new Map<number, number>();
    for (const mcq of mcqs) {
      positions.set(mcq.correctIdx, (positions.get(mcq.correctIdx) ?? 0) + 1);
    }
    for (const [pos, count] of positions) {
      const pct = (count / mcqs.length) * 100;
      if (pct > 40) {
        errors.push(
          `MCQ POSITION CLUSTERING: Position ${pos} is correct ${count}/${mcqs.length} times (${pct.toFixed(0)}%). Max allowed is 40%. Shuffle options.`,
        );
      }
    }
  }

  const standalonePositions: number[] = [];
  for (const screen of screens) {
    for (const block of screen.blocks ?? []) {
      if (block.type === "mcq") {
        standalonePositions.push((block as McqBlock).correct ?? 0);
      }
    }
  }
  if (
    standalonePositions.length === 3 &&
    new Set(standalonePositions).size < 3
  ) {
    errors.push(
      `MCQ POSITION CLUSTERING: 3 standalone MCQs have correct positions [${standalonePositions.join(
        ", ",
      )}] — all 3 must be at different positions (0-3). Shuffle options on duplicates.`,
    );
  }

  if (errors.length === 0) return;

  // Source hook always exited 2 on any errors — port that behaviour.
  if (systematicBias) {
    throw new Error(errors.join("\n"));
  }
  // Soft-warn: surface to stderr but don't block.
  console.warn(`[atom-creator] MCQ balance warnings for ${filePath}:\n${errors.join("\n")}`);
}
