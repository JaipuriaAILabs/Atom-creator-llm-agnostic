// Port of check-storytelling-signals.sh
// Runs on tool.execute.before for Write/Edit of course markdown files.
// Throws when the proposed content contains known storytelling anti-patterns.

function countYouAre(content: string): { count: number; examples: string[] } {
  const lines = content.split(/\r?\n/);
  const matches: string[] = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      /^you are /.test(lower) ||
      /[.!?]\s+you are /.test(lower) ||
      / — you are /.test(lower)
    ) {
      matches.push(line.trim());
    }
  }
  return { count: matches.length, examples: matches.slice(0, 3) };
}

function detectTripleRepetition(content: string): string | null {
  const sentences = content.split(/[.!?]\s+/);
  const skipWords = new Set(["the", "a", "in", "on", "at", "to", ""]);
  for (let i = 0; i < sentences.length - 2; i++) {
    const firsts = [
      sentences[i].split(/\s+/)[0]?.toLowerCase() ?? "",
      sentences[i + 1].split(/\s+/)[0]?.toLowerCase() ?? "",
      sentences[i + 2].split(/\s+/)[0]?.toLowerCase() ?? "",
    ];
    if (
      firsts[0] &&
      firsts[0] === firsts[1] &&
      firsts[1] === firsts[2] &&
      !skipWords.has(firsts[0])
    ) {
      return `Triple repetition starting with "${firsts[0]}" near: ${sentences[i].slice(0, 50)}...`;
    }
  }
  return null;
}

function detectScreen1GenericOpening(content: string): boolean {
  const screen1Match = content.match(/##\s+Screen\s+1[\s\S]*?(?=##\s+Screen\s+2|$)/);
  if (!screen1Match) return false;
  const section = screen1Match[0];
  const lines = section.split(/\r?\n/).slice(0, 20);
  const firstProse = lines.find(
    (l) =>
      l.trim() &&
      !l.startsWith("##") &&
      !l.startsWith("**") &&
      !/^[-*]\s/.test(l),
  );
  if (!firstProse) return false;
  const hasProperNoun =
    /[A-Z][a-z]+[A-Z]|[A-Z]{2,}|[$₹€£¥]|\d+%|\d+\.\d/.test(firstProse);
  if (hasProperNoun) return false;
  return /^(you |imagine |picture |consider )/i.test(firstProse.trim());
}

function detectStaccatoOpening(content: string): number {
  const firstTen = content.split(/\r?\n/).slice(0, 20);
  let short = 0;
  for (const line of firstTen.slice(0, 10)) {
    const stripped = line.trim();
    if (
      stripped &&
      stripped.split(/\s+/).length <= 4 &&
      !stripped.startsWith("#") &&
      !stripped.startsWith("*")
    ) {
      short++;
    }
  }
  return short;
}

export async function checkStorytellingSignalsHook(
  filePath: string,
  content: string | undefined,
): Promise<void> {
  if (!filePath.includes("courses/") || !filePath.endsWith(".md")) return;
  if (
    filePath.includes("specs/") ||
    filePath.includes("audit-") ||
    filePath.includes("batch-")
  ) {
    return;
  }
  if (!content) return;

  const errors: string[] = [];

  const youAre = countYouAre(content);
  if (youAre.count > 0) {
    const examples = youAre.examples.map((e) => `  → ${e}`).join("\n");
    errors.push(
      `STORYTELLING: Found ${youAre.count} instance(s) of 'You are' on story screens. All second-person role-play framing is banned on story/narrative screens. Use third-person journalism instead.\nExamples:\n${examples}`,
    );
  }

  const triple = detectTripleRepetition(content);
  if (triple) {
    errors.push(
      `STORYTELLING: ${triple}. Vary sentence openings for better prose rhythm.`,
    );
  }

  if (detectScreen1GenericOpening(content)) {
    errors.push(
      `STORYTELLING: Screen 1 opens with generic framing instead of company + data on the first line (P33). Company name + metric = journalism; generic 'you' = training simulation.`,
    );
  }

  const shortLines = detectStaccatoOpening(content);
  if (shortLines >= 3) {
    errors.push(
      `STORYTELLING: ${shortLines} very short lines in opening — looks like staccato screenplay framing. Use flowing narrative prose.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
