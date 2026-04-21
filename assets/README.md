# Assets

This directory is intentionally minimal in the npm-published package.

## What's missing and why

The original `atom-creator` Claude Code plugin ships with:

- `assets/correspondent-reference/` — 7 reference PNGs (~2.8 MB total) used by the UGC / Correspondent character system
- `help-page.html` — a 384 KB static HTML help page

These binary/large assets are **not bundled in the npm payload** to keep installs fast and the tarball under a reasonable size. They are also only needed by a subset of commands (`/ugc` and `/help`).

## How to get them

If you need the UGC correspondent reference images:

1. Install the upstream Claude Code plugin repo locally (read-only reference):
   ```bash
   git clone https://github.com/JaipuriaAILabs/atom-creator ~/atom-creator-reference
   ```
2. Point the `/ugc` skill at the reference directory by setting:
   ```bash
   export ATOM_CREATOR_ASSETS=~/atom-creator-reference/assets
   ```
3. Or copy them into your project:
   ```bash
   cp -r ~/atom-creator-reference/assets/correspondent-reference ./assets/
   ```

The skills degrade gracefully — if the assets are missing, the UGC command will warn and skip the reference-image step rather than crashing.
