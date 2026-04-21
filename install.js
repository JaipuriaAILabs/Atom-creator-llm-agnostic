#!/usr/bin/env node
/**
 * atom-creator-llm-agnostic — npx installer
 *
 * Bootstraps the plugin into an OpenCode project or global config.
 *
 * Usage:
 *   npx atom-creator-llm-agnostic install [--project | --global] [--force] [--non-interactive]
 */

const path = require("path");
const os = require("os");
const fs = require("fs-extra");
const { execSync } = require("child_process");
const { Command } = require("commander");
const prompts = require("prompts");
const chalk = require("chalk").default || require("chalk");

const PACKAGE_ROOT = __dirname;
const PKG_NAME = "atom-creator-llm-agnostic";
const PKG_VERSION = (() => {
  try {
    return require(path.join(PACKAGE_ROOT, "package.json")).version;
  } catch {
    return "0.1.0";
  }
})();

// -----------------------------------------------------------------------------
// utilities
// -----------------------------------------------------------------------------

function header(msg) {
  console.log("\n" + chalk.bold.cyan("▸ " + msg));
}

function ok(msg) {
  console.log(chalk.green("  ✓ ") + msg);
}

function warn(msg) {
  console.log(chalk.yellow("  ⚠ ") + msg);
}

function info(msg) {
  console.log(chalk.gray("  · ") + msg);
}

function fail(msg) {
  console.log(chalk.red("  ✗ ") + msg);
}

function detectOpenCode() {
  try {
    const output = execSync("which opencode", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (output) {
      try {
        const version = execSync("opencode --version", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
        return { installed: true, path: output, version };
      } catch {
        return { installed: true, path: output, version: "unknown" };
      }
    }
    return { installed: false };
  } catch {
    return { installed: false };
  }
}

function deepMergeOpencodeConfig(existing) {
  const base = existing && typeof existing === "object" ? existing : {};

  // plugin array — unique union
  const pluginArr = Array.isArray(base.plugin) ? base.plugin.slice() : [];
  if (!pluginArr.includes(PKG_NAME)) pluginArr.push(PKG_NAME);

  // agent map — only fill missing keys, never overwrite user-set values
  const agentMap = base.agent && typeof base.agent === "object" ? { ...base.agent } : {};
  const agentDefaults = {
    "course-researcher": { model: "moonshot/kimi-k2.6" },
    "content-auditor": { model: "moonshot/kimi-k2.6" },
    "structural-validator": { model: "moonshot/kimi-k2.6" },
    "visual-director": { model: "moonshot/kimi-k2.6" },
  };
  for (const [name, cfg] of Object.entries(agentDefaults)) {
    if (!agentMap[name]) agentMap[name] = cfg;
  }

  // mcp map — only add perplexity if absent
  const mcpMap = base.mcp && typeof base.mcp === "object" ? { ...base.mcp } : {};
  if (!mcpMap.perplexity) {
    mcpMap.perplexity = {
      command: "npx",
      args: ["-y", "@perplexity-ai/mcp-server"],
    };
  }

  return {
    ...base,
    plugin: pluginArr,
    agent: agentMap,
    mcp: mcpMap,
  };
}

async function copyPayload(packageRoot, targetDir, force) {
  const subdirs = ["skills", "agents", "commands"];
  for (const sub of subdirs) {
    const src = path.join(packageRoot, sub);
    const dst = path.join(targetDir, sub);
    if (!(await fs.pathExists(src))) {
      warn(`Skipping ${sub}/ — not present in package`);
      continue;
    }
    await fs.ensureDir(dst);
    await fs.copy(src, dst, {
      overwrite: force,
      errorOnExist: false,
    });
    const count = (await fs.readdir(dst)).length;
    ok(`Copied ${sub}/ → ${dst} (${count} entries)`);
  }

  // Also copy shared/, scripts/, templates/ — skills reference them at runtime
  const supportDirs = ["shared", "scripts", "templates"];
  for (const sub of supportDirs) {
    const src = path.join(packageRoot, sub);
    const dst = path.join(targetDir, sub);
    if (!(await fs.pathExists(src))) continue;
    await fs.ensureDir(dst);
    await fs.copy(src, dst, { overwrite: force, errorOnExist: false });
    const count = (await fs.readdir(dst)).length;
    ok(`Copied ${sub}/ → ${dst} (${count} entries)`);
  }
}

async function mergeOpencodeJson(projectDir) {
  const configPath = path.join(projectDir, "opencode.json");
  let existing = {};
  if (await fs.pathExists(configPath)) {
    try {
      existing = await fs.readJson(configPath);
      info(`Found existing opencode.json — merging`);
    } catch (err) {
      warn(`Existing opencode.json is invalid JSON — backing up to opencode.json.bak`);
      await fs.copy(configPath, configPath + ".bak");
      existing = {};
    }
  } else {
    info(`Creating new opencode.json`);
  }

  const merged = deepMergeOpencodeConfig(existing);
  await fs.writeJson(configPath, merged, { spaces: 2 });
  ok(`Wrote ${configPath}`);
  return configPath;
}

async function promptAndWriteEnv(projectDir, nonInteractive) {
  const envPath = path.join(projectDir, ".env");
  const existing = (await fs.pathExists(envPath)) ? await fs.readFile(envPath, "utf8") : "";
  const hasKey = (name) => new RegExp(`^${name}=`, "m").test(existing);

  const keysToAsk = [
    {
      name: "MOONSHOT_API_KEY",
      label: "Moonshot API key (for Kimi K2.6, get at platform.moonshot.ai)",
    },
    {
      name: "PERPLEXITY_API_KEY",
      label: "Perplexity API key (for factual verification, required for audits)",
    },
    {
      name: "FAL_KEY",
      label: "fal.ai API key (for SeedDream image generation)",
    },
  ];

  if (nonInteractive) {
    info("Non-interactive mode — skipping API key prompts. Edit .env manually.");
    const stub = keysToAsk
      .filter((k) => !hasKey(k.name))
      .map((k) => `# ${k.label}\n${k.name}=`)
      .join("\n\n");
    if (stub) {
      await fs.appendFile(envPath, (existing && !existing.endsWith("\n") ? "\n" : "") + stub + "\n");
      ok(`Appended empty key placeholders to .env`);
    }
    return;
  }

  const answers = {};
  for (const k of keysToAsk) {
    if (hasKey(k.name)) {
      info(`${k.name} already set in .env — keeping existing value`);
      continue;
    }
    const resp = await prompts(
      {
        type: "password",
        name: "value",
        message: `${k.label}\n  (leave empty to skip)`,
      },
      {
        onCancel: () => {
          warn("Key prompt cancelled. Continuing.");
          return false;
        },
      },
    );
    if (resp.value) answers[k.name] = resp.value;
  }

  if (Object.keys(answers).length === 0) {
    info("No new keys provided. .env unchanged.");
    return;
  }

  const appendLines = Object.entries(answers)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const prefix = existing && !existing.endsWith("\n") ? "\n" : "";
  await fs.appendFile(envPath, prefix + appendLines + "\n");
  ok(`Wrote ${Object.keys(answers).length} key(s) to .env`);
}

// -----------------------------------------------------------------------------
// install command
// -----------------------------------------------------------------------------

async function runInstall(opts) {
  header(`atom-creator-llm-agnostic v${PKG_VERSION} — installer`);

  const dryRun = !!opts.dryRun;
  if (dryRun) {
    info("DRY RUN — no files will be written.");
  }

  // 1. OpenCode detection
  const oc = detectOpenCode();
  if (oc.installed) {
    ok(`Found opencode at ${oc.path} (${oc.version})`);
  } else {
    warn(`opencode binary not found on PATH`);
    info(`Install it from https://opencode.ai or continue and install later.`);
  }

  // 2. Resolve install target
  let scope = opts.project ? "project" : opts.global ? "global" : null;
  if (!scope && !opts.nonInteractive) {
    const resp = await prompts({
      type: "select",
      name: "scope",
      message: "Install target",
      choices: [
        { title: "Project (./.opencode/) — recommended", value: "project" },
        { title: "Global (~/.config/opencode/)", value: "global" },
      ],
      initial: 0,
    });
    scope = resp.scope;
  }
  if (!scope) scope = "project";

  const cwd = process.cwd();
  const targetDir =
    scope === "global"
      ? path.join(os.homedir(), ".config", "opencode")
      : path.join(cwd, ".opencode");
  const configDir = scope === "global" ? path.join(os.homedir(), ".config", "opencode") : cwd;

  header(`Install scope: ${scope}`);
  info(`Payload target: ${targetDir}`);
  info(`opencode.json:   ${path.join(configDir, "opencode.json")}`);

  // 3. Copy payload
  header(`Copying skills, agents, commands`);
  if (dryRun) {
    for (const sub of ["skills", "agents", "commands", "shared", "scripts", "templates"]) {
      const src = path.join(PACKAGE_ROOT, sub);
      if (await fs.pathExists(src)) {
        info(`[dry-run] would copy ${sub}/ → ${path.join(targetDir, sub)}`);
      }
    }
  } else {
    try {
      await copyPayload(PACKAGE_ROOT, targetDir, !!opts.force);
    } catch (err) {
      fail(`Copy failed: ${err.message}`);
      warn(`You may need to pass --force to overwrite existing files.`);
      process.exitCode = 1;
      return;
    }
  }

  // 4. Merge opencode.json
  header(`Updating opencode.json`);
  if (dryRun) {
    info(`[dry-run] would merge plugin/agent/mcp entries into ${path.join(configDir, "opencode.json")}`);
  } else {
    try {
      await mergeOpencodeJson(configDir);
    } catch (err) {
      fail(`Failed to write opencode.json: ${err.message}`);
      process.exitCode = 1;
      return;
    }
  }

  // 5. API keys
  header(`API keys (optional — can be set later in .env)`);
  if (dryRun) {
    info(`[dry-run] would prompt for MOONSHOT_API_KEY, PERPLEXITY_API_KEY, FAL_KEY and write to .env`);
  } else {
    try {
      await promptAndWriteEnv(configDir, !!opts.nonInteractive);
    } catch (err) {
      warn(`API key prompt failed: ${err.message}. Continuing.`);
    }
  }

  // 6. Sanity check
  header(`Sanity check`);
  const oc2 = detectOpenCode();
  if (oc2.installed) {
    ok(`opencode --version → ${oc2.version}`);
  } else {
    warn(`opencode still not on PATH — install it before running /plan`);
  }

  // 7. Next steps
  header(`Next steps`);
  console.log(chalk.bold("  1.") + " Start OpenCode in this directory:");
  console.log("     " + chalk.cyan("$ opencode"));
  console.log(chalk.bold("  2.") + " Inside OpenCode, run your first course:");
  console.log("     " + chalk.cyan("> /plan senior leader KPI redesign"));
  console.log(chalk.bold("  3.") + " When the spec is APPROVED, generate content:");
  console.log("     " + chalk.cyan("> /create senior-leader-kpi-redesign"));
  console.log(chalk.bold("  4.") + " Read the setup guide for model configuration:");
  console.log("     " + chalk.cyan("docs/kimi-k2-setup.md"));
  console.log();
  console.log(chalk.gray("  Full command list: ") + chalk.cyan("/help"));
  console.log(
    chalk.gray("  Project instructions: ") + chalk.cyan(path.join(configDir, "docs/AGENTS.md")),
  );
  console.log();
  if (dryRun) {
    ok(`Dry run complete — no files written`);
  } else {
    ok(`Install complete`);
  }
}

// -----------------------------------------------------------------------------
// CLI entry
// -----------------------------------------------------------------------------

async function main() {
  const program = new Command();
  program
    .name(PKG_NAME)
    .version(PKG_VERSION)
    .description("Install atom-creator-llm-agnostic into an OpenCode project or global config");

  program
    .command("install", { isDefault: true })
    .description("Install skills, agents, commands and configure opencode.json")
    .option("-p, --project", "Install to ./.opencode/ (project-local)")
    .option("-g, --global", "Install to ~/.config/opencode/ (global)")
    .option("-f, --force", "Overwrite existing files")
    .option("-n, --non-interactive", "Skip prompts (use defaults, project scope)")
    .option("-d, --dry-run", "Print planned actions without writing files (for CI / tests)")
    .action(async (opts) => {
      try {
        await runInstall(opts);
      } catch (err) {
        fail(`Install failed: ${err && err.stack ? err.stack : err}`);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

main();
