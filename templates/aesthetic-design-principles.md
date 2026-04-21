# Aesthetic Design Principles for Rehearsal Games

This document distills the *reasoning* behind the five declared aesthetic families, the cultural references that seeded them, the micro-details that separate polished from amateur games, and the iteration protocol that makes the difference between shipping AUDIT/CODIFY/Forward-Deployed-quality work vs generic output.

**Read this before generating any game.** The five aesthetic families (Arcade Pop / Sci-Fi Matrix / Editorial Mono / Keynote Vitrine / WhatsApp Mockup) have palette + font values fixed in the decision tables. This document explains *why* those choices work, so you can adapt within families or invent a NOVEL native-UI mockup when the mechanic calls for one.

---

## 0. Native-UI-First Rule (v10.15.0 — READ BEFORE PICKING A DOCUMENTED FAMILY)

**The most important aesthetic decision is not which documented family to pick — it is whether a documented family should be picked at all.**

When the game mechanic maps to a real-world software UI that learners already know, RENDER THE GAME AS A MOCKUP OF THAT UI. Not as a stylistic reference. As the literal frame.

- **Dialogue Tree** → WhatsApp thread, Slack DM, email inbox, SMS. The player is texting, not clicking dialogue cards.
- **Classification / sorting** → filing cabinet drawers, library card catalog, Notion database rows. The player is filing, not tapping category buttons.
- **Allocation / slider** → bank transfer UI, portfolio rebalancer, 401(k) contribution page. The player is moving money, not adjusting abstract bars.
- **Progressive Reveal** → notebook pages, CCTV feed scrubber, x-ray viewer. The player is flipping/scrubbing, not tapping "next."
- **Strategy Selection** → chess/go board, battle map, factory floor plan. The player is placing pieces, not selecting from a menu.

Declare the aesthetic family as `NOVEL: {context-name}` (e.g., `NOVEL: WhatsApp mockup (light mode)`, `NOVEL: filing cabinet`). Use the target UI's ACTUAL colors and fonts (system-ui for WhatsApp, Segoe UI for Outlook, etc.) — not the Rehearsal brand palette.

**The documented five families are the FALLBACK**, used when the mechanic is abstract enough that no native UI fits, OR when the course narrative explicitly demands a stylised frame (e.g., an arcade-pop aesthetic for a "build your game plan" mechanic on a novice audience).

**Why this rule exists:** the Forward Deployed v2 session (2026-04-19) differentiated from Editorial Mono on 5-of-5 palette dimensions and still produced a game the user rejected as an adjacent-neighborhood reskin ("each game should have its own aesthetic style"). The differentiation axis was wrong — changing shadow style and font family kept the game in the same "stage-black + bold display" neighborhood as THE GEM. Only when we pivoted to a WhatsApp mockup (completely different FRAME, not just palette) did the aesthetic actually differentiate.

### 0a. The differentiation axis must be the FRAME, not dimensions within a frame (v10.16.0)

Passing the 5-of-5 differentiation checklist INSIDE the same native-UI family does NOT count as differentiation. The player's perception anchors on FRAME — the cultural-UI reference the game evokes — not on the detail axes within that frame.

**What counts as "same neighborhood" (do NOT use 5-of-5 to differentiate within these):**
- Stage-black + bold display (Keynote Vitrine family + THE GEM's constructivist-poster variant)
- Cream + hard-offset shadows (Arcade Pop family + AUDIT)
- Dark + matrix-green + terminal HUD (Sci-Fi Matrix family + CODIFY)
- Editorial cream + serif + restraint (Editorial Mono family + Beat Blitz)

Within any of these neighborhoods, swapping fonts + shadows + textures + accent-hex produces a RESKIN regardless of how many 5-of-5 boxes you tick.

**What counts as a new FRAME (use when the mechanic has a native-UI analog):**
- WhatsApp / Slack / iMessage chat mockup
- Workday / SuccessFactors / Lattice enterprise HR SaaS
- Bloomberg Terminal / Reuters dashboard
- Notion / Linear / Airtable task board
- Gmail / Outlook email threading
- Figma / Linear canvas
- Physical mockup (filing cabinet, paper memo, whiteboard + sticky notes)

**Example — the 2026-04-19 TalentGrid session:**
- **Initial proposal (reskin):** Industrial Rust palette + IBM Plex Condensed + 2px ink stroke — differentiated from THE GEM on 5 dimensions BUT kept the "war room" frame (stage-black + bold display + grid overlay). User would reject as reskin.
- **Corrected pivot:** Enterprise HR SaaS frame (Workday/SuccessFactors DNA) — three-panel layout, 9-box grid on left, calibration chat on right, evidence drawer bottom. Completely different FRAME from THE GEM. Differentiation succeeded.

**Test:** a stranger glancing at both games for 3 seconds each should form a DIFFERENT mental model of "what kind of software is this." If both read as "dark bg + bold display game," the frame hasn't differentiated.

---

## 1. The five declared aesthetic families — cultural lineage

### Arcade Pop (AUDIT reference)

**Cultural references to pattern-match against:**
- **Slay the Spire / Threes / Dorfromantik** — sticker-card high-contrast tactile feel
- **Pokémon GO / Duolingo** — chunky borders + hard-offset drop-shadow pops
- **Wordle** — warm cream background with black type, single accent
- **Modern board games (Root, Wingspan, Everdell)** — tactile paper-weight feel
- **Risograph print aesthetics** — saturated flat colors with thick outlines
- **Jelle's Marble Runs / indie Twitch overlays** — chunky borders, bright blocks

**Signature elements (the things that make it read as Arcade Pop):**
- Background: cream #FFF4D6 (warmer than white; reduces eye fatigue; signals "handmade" vs "corporate")
- Display: **Bungee** (or similar chunky all-caps display font) — reads as arcade signage
- Body: **Archivo** 600–800 weight — geometric sans that supports Bungee without competing
- Mono: **Space Mono** for HUD / data / labels — slightly quirky, matches the playful tone
- Accent: **Hot pink #FF3A7C** (or vivid saturated color — teal, lime, coral depending on course)
- Borders: 2.5–3px solid black (#141414)
- Drop shadows: **4px/4px offset, zero blur, solid black** — "sticker on paper" illusion
- Card tilt: **-1° to -2°** on best-score panels / rank chips — feels hand-placed
- Corners: 12–16px radius on cards, 20–28px on buttons
- Icons: Lucide SVG strokes, thick (stroke-width 1.75–2.2)

**When to use:** novice audiences, everyday/consumer topics, content under 3 min, first-time learners, light tone, "welcoming" brief.

**Anti-patterns to avoid:** pure white backgrounds, gradient fills, emoji in game tiles (only intro demo), Roboto/Open Sans/system fonts (reads generic), thin 1px borders (looks Bootstrap-default).

---

### Sci-Fi Matrix (CODIFY reference)

**Cultural references to pattern-match against:**
- **The Matrix** — green rain on black, monospace everywhere
- **Tron** — neon grid, vector shapes, glow-on-dark
- **Cyberpunk 2077 UI** — glow halos, terminal-style overlays
- **VS Code / iTerm2 / Warp terminal** — practical dark-mode aesthetic
- **Mr. Robot show UI** — green on dark, hacker-command-line vibe
- **Shadowrun / Deus Ex** — neon-on-black for techno-mystery
- **Helldivers 2 / Star Citizen menus** — sci-fi operational aesthetics

**Signature elements:**
- Background: near-black with blue-tint #0A0E1A (never pure #000000 — reads flat; blue tint feels "atmospheric")
- Grid overlay: 4% opacity linear-gradient, 28px cell size — adds depth without distraction
- Radial glow: `radial-gradient(circle at 50% 40%, rgba(0,255,157,.06), transparent)` — subtle ambient presence
- Display: **Orbitron 900** with 2px letter-spacing + text-shadow glow — sci-fi caps that read as "interface title"
- Body: **IBM Plex Mono** or **IBM Plex Sans** 500–700 — matches the technical tone
- Accent: **Matrix green #00FF9D** (primary), **hot coral #FF3366** (secondary for wrong/warnings)
- Borders: 1–1.5px hairlines (not chunky — sci-fi reads "precise")
- Shadows: **glow box-shadow** `0 0 20px rgba(0,255,157,.5)` on interactive states — NOT offset drop shadows
- Terminal-style headers: `> command.name` prefix with a blinking cursor pseudo-element
- Typography tracks wider: mono labels at 1.5–3px letter-spacing
- No tilts — sci-fi reads "engineered", not "hand-placed"

**When to use:** senior/technical audiences, AI/data/automation topics, reflex-based mechanics, systems thinking content, content that wants to feel "operational."

**Anti-patterns to avoid:** blue-purple "AI assistant" gradients (Claude's signature look — too on-the-nose for a Rehearsal game about AI), neon colors other than green/coral (bright magenta/cyan looks synthwave, not terminal), Montserrat/Poppins (reads as "tech startup", not sci-fi), drop shadows at offset (breaks the digital/clean feel).

---

### Editorial Mono (benchmark — Beat Blitz is proto-reference)

**Cultural references to pattern-match against:**
- **NYT Games (Wordle, Connections, Spelling Bee)** — restraint, editorial feel, single accent
- **Kinfolk / Apartment Therapy** — magazine-style whitespace + serif authority
- **The Economist print-digital hybrid** — conservative palette, serif + mono combination
- **Medium article layout** — generous margins, comfortable reading rhythm
- **Hermès / Apollo Magazine / MIT Press** — premium restraint
- **Monocle Magazine** — international editorial, cream + single accent

**Signature elements:**
- Background: **near-white cream #FAFAFA** or **off-white #F7F5F0** — never pure white; warm tint signals premium
- Display: **Source Serif 4** 700–800 — editorial serif that signals "authoritative voice"
- Body: **Archivo** or **Inter** 500–700 — modern geometric sans for legibility
- Mono: **Space Mono** for captions / data / dates — editorial magazine feel
- Accent: **single** — rust #B54A2E, forest #4A7C59, or navy #1E3A8A (never more than one)
- Borders: minimal — hairline dashed #E5E5E5 for dividers, solid 1.5px for bounding cards
- Shadows: **subtle** `0 2px 8px rgba(0,0,0,.05)` — present but restrained, never punchy
- Whitespace: generous — 32–48px padding inside cards, 20–24px between elements
- No drop-shadow offsets (breaks the editorial feel)
- Slow, deliberate animations — 400–600ms fades and reveals
- No saturated colors except the single accent

**When to use:** strategic/advisory content, senior judgment topics, premium-positioned courses, content that wants to feel "book-like" or "op-ed", serious/consequential topics.

**Anti-patterns to avoid:** more than one accent color (destroys the restraint), bright saturated pastels (reads as consumer app), display serifs other than Source Serif 4 or Playfair (reads as "wedding invitation"), drop-shadow offsets, chunky borders, tilted cards.

---

### Keynote Vitrine (v10.14.0 — DEPRECATED as default, no active reference game)

**Cultural references to pattern-match against:**
- **Apple keynote stage / WWDC** — black stage, single spotlight, large bold display type
- **TED stage photography** — black backdrop, speaker in indigo rim-light
- **High-end enterprise-SaaS hero screens (Stripe, Linear, Arc)** — dark bg with selective indigo accents

**Signature elements (if you must use this family):**
- Background: **stage black #0A0A0C** — darker than dark-navy, evokes theatre
- Display: **Manrope 800** — geometric sans with weight, not serif
- HUD: **JetBrains Mono** for numerals / counters / status chips — tech-authenticity
- Accent: **indigo #4e44fd** (rim-light color, not fill)
- Loss accent: **coral #ff4859** (strict loss-only usage)
- Texture overlay: **radial spotlight vignette** — faint indigo glow from top center, fading to black at edges
- Panels: 1px hairline `rgba(78,68,253,0.15)` border + inner glow `0 0 0 1px ... inset, 0 20px 40px -24px rgba(78,68,253,0.25)`

**When to use:** product-decision games, brand-strategy games, boardroom-staging pedagogy. NOT for Dialogue Tree games (prefer WhatsApp Mockup or email-native), NOT for classification games (prefer NOVEL: filing cabinet).

**Why DEPRECATED as default:** the first session that attempted to use this family (Forward Deployed v2, 2026-04-19) produced a game that read as an Apple-keynote reskin and was user-rejected. The family remains documented for cases where the course narrative genuinely demands a stage-black + bold-display aesthetic, but autogeneration should NOT prefer it — pick WhatsApp Mockup for Dialogue Tree, Editorial Mono for strategic judgment, Sci-Fi Matrix for technical, Arcade Pop for novice.

**Anti-patterns to avoid:** using this family for Dialogue Tree (staged-keynote ≠ intimate messaging), adding secondary accents beyond indigo + coral, cream/white backgrounds (breaks the stage illusion), Serif display fonts (breaks the keynote-deck signal).

---

### WhatsApp Mockup — Light Mode (v10.15.0, reference: Forward Deployed)

**Cultural references to pattern-match against:**
- **WhatsApp light mode on iOS** — the actual app, as Indian B2B buyers use it daily
- **iMessage / Signal / Telegram light mode** — same grammar family (incoming left, outgoing right, tick states, typing indicators)
- **WhatsApp Business chatbot conversations** — quick-reply suggestion pattern
- **Indian corporate WhatsApp culture** — CFOs forwarding emails into WhatsApp threads, voice notes for nuanced replies

**Signature elements (the things that make it read as WhatsApp):**
- Frame: **phone bezel mockup** — rounded rectangle, dark bezel #1C1C1E around chat surface
- iOS status bar at top (time "9:41", signal/wifi/battery icons — decorative SVG, no logic)
- Chat header: back chevron + circular avatar + name (15px/500) + presence status below (12px lowercase — `online` / `typing…` / `last seen X mins ago`) + video/phone icons (decorative)
- Chat background: **cream #ECE5DD** with subtle doodle wallpaper (tiled SVG of faint repeating doodles — anchors, paper planes, scribbles at ~5% opacity)
- Incoming bubble (buyer): **white #FFFFFF** with 1px #E5E5E5 border + subtle `0 1px 0.5px rgba(0,0,0,0.08)` drop shadow + message tail
- Outgoing bubble (player): **WhatsApp green #DCF8C6** with same shadow + tail
- Primary CTA pill: **WhatsApp green #25D366** with white text
- Delivery tick blue: **#34B7F1** (double-blue ticks on read messages)
- Muted/last-seen color: **#8696A0** (WhatsApp's native gray)
- Loss signal: `#667781` presence status fading to `#CFCFCF` — **NO coral, NO red, NO amber**. Loss reads as ABSENCE (`last seen yesterday`), not alarm.
- Typography: **system-ui stack** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif` — the actual WhatsApp font stack
- Weights: 400 body, 500 for buyer names/headers, 600 ONLY for primary CTAs. NO 700, NO 800 (breaks the illusion — WhatsApp doesn't use heavy display type)
- Message timestamp: 11px #8696A0, right-aligned inside bubble

**Mechanic mappings:**
- Quick-reply chips: three horizontal suggestion pills below chat input (WhatsApp Business chatbot pattern)
- Voice-note recorder: hold-to-record mic button, live waveform, duration counter
- Message composition: drag quoted-message fragments into slot template
- Group chat: 3+ participants rendered in the same thread, 11px sender labels above incoming bubbles
- Typing indicator: three bouncing dots in a pill-shaped container
- Last-seen fade: `online` → `last seen 2 mins ago` → `last seen 14 mins ago` over 20s when a thread fails

**When to use:** Dialogue Tree mechanics, especially for Indian B2B buyer personas (CFOs, procurement heads, VPs) — WhatsApp is the native medium for that context. Also works for any conversational mechanic where the player is trading messages with a single or small group of stakeholders.

**Anti-patterns to avoid:** pure white background (use #ECE5DD cream — white breaks the WhatsApp signal); Meta/WhatsApp logos anywhere (generic icons only, no trademark infringement); coral/red loss colors (loss MUST be fading presence); custom display fonts (Manrope, Orbitron, Archivo Black all BREAK the illusion — use system-ui only); formal email-style greetings in buyer messages (*"Dear Sir/Madam"* ≠ WhatsApp); staccato 3-fragment chains in meta copy (*"Five buyers. Sixteen turns. Deploy."* reads as ad copy, not an actual person thinking). Contractions and em-dashes are required, not optional.

---

## 2. Cross-family principles that always apply

These 10 rules transcend aesthetic family. They apply whether you're building Arcade Pop, Sci-Fi Matrix, Editorial Mono, Keynote Vitrine, WhatsApp Mockup, or a NOVEL native-UI mockup.

### Rule 1: Accent color is earned, not decorative

The accent color signals **one of three things**:
- Interactive state (selected / correct / active)
- Progress signal (current round / streak meter)
- Brand touch (title shadow / rank chip)

Never use accent for filler. If you're adding accent to "make it pop," delete it and let the monochrome base carry the weight. One in five elements should use the accent at most.

### Rule 2: No pure white

`#FFFFFF` feels like it leaked from the browser chrome. Always shift:
- Warm direction: `#FFF4D6` / `#FAFAFA` / `#F7F5F0`
- Cool direction: `#F0F4F8` / `#F7F9FC`

Even subtle shifts (`#FDFCFA` instead of `#FFFFFF`) make the surface feel intentional.

### Rule 3: No pure black text

`#000000` creates eye strain at small sizes. Always use `#141414`, `#1A1A1A`, or `#0A0E1A`. The 5% reduction in contrast is imperceptible but physically easier on the eye.

### Rule 4: Monospace for data, display for emotion, sans for body

| Role | Font character | Examples |
|---|---|---|
| HUD / status / counters / timers | Monospace | Space Mono, IBM Plex Mono, JetBrains Mono |
| Title / reveal / rank / hero copy | Display (family-specific) | Bungee / Orbitron / Source Serif 4 |
| Body / labels / explanations | Geometric sans | Archivo / Inter / IBM Plex Sans |

Don't mix. A mono HUD with a mono display is muddy. A serif HUD with a serif body is stiff.

### Rule 5: Motion carries meaning

If an element doesn't move, make the stillness feel deliberate:
- Dots pulse on round indicator
- Breath animation (1.2s scale 1.0→1.05→1.0) on status indicators
- Blinking cursor on terminal prompts
- Subtle wobble on draggable tokens

Static UI in a game context reads "crashed" or "unfinished." Every interactive surface should have *some* signal of aliveness.

### Rule 6: Tilt = playfulness

Cards tilted -1° to -2° feel hand-placed and alive. Cards at 0° feel corporate. Reserve 0° for:
- Score tallies (must feel authoritative)
- Results / leaderboards
- Data display (numbers should not tilt)

Reserve tilts for:
- Intro best-score panels
- Rank chips
- Decorative elements
- Moments of pride ("you did it!")

Editorial Mono aesthetic family: NEVER tilt. The restraint is the character.

### Rule 7: Shadow patterns encode hierarchy

| Shadow | Meaning | Used for |
|---|---|---|
| No shadow | De-emphasized / flat | Background elements, disabled states |
| Subtle blur `0 2px 8px rgba(0,0,0,.05)` | Standard element | Cards, panels (Editorial Mono) |
| Hard offset `4px 4px 0 black` | "Picked up" interactive | Buttons, tilted cards (Arcade Pop) |
| Neon glow `0 0 20px accentColor` | "Illuminated" / active | Selected states, accent chips (Sci-Fi Matrix) |

Don't mix shadow types within a single game. Each aesthetic family has a signature shadow; stay consistent.

### Rule 8: Icon > emoji > text

In order of preference for any labelable item:
1. **Inline Lucide SVG** (professional, scalable, accessible, consistent stroke weight)
2. **Emoji** — only in intro demos, post-round celebrations, or where tone explicitly calls for warmth
3. **Text labels** — last resort when no clear visual metaphor exists

Games-inside-cards should almost always use SVG icons. Emoji in gameplay screens reads as "unfinished prototype" to sophisticated audiences.

### Rule 9: Three-font limit per game

One display, one body, one mono. Adding a fourth reads as visual chaos. If you're tempted to add a decorative script or alternate sans, delete the urge — it's the aesthetic-family discipline failing.

### Rule 10: Honest calibration (for classification games)

Data classification must survive the audit question: *"Would a frontier AI actually struggle with this task as worded?"* Over-claiming HUMAN for codifiable tasks destroys the teaching. The player leaves overconfident about what humans can still do, which is the OPPOSITE of the learning outcome.

---

## 3. Micro-details that separate polished from amateur

These are the 1-2% details that raise a game from "mechanically correct" to "feels like a shipped product."

| Detail | Polished | Amateur |
|---|---|---|
| Border thickness | 2.5px | 2px (indecisive) or 1px (invisible) |
| Card border radius | 12–16px | 8px (Bootstrap default) or 24px (too soft) |
| Button border radius | 20–28px (pill) or 12px (square) | 10px (in-between feels nothing) |
| Display font letter-spacing | Negative (-.5 to -2px) for caps display | Default 0 (looks generic) |
| Mono label letter-spacing | Positive (1.5–3px tracking) | Default 0 (no signal of "data/status") |
| Body line-height | 1.4–1.5 | Browser default 1.2 (cramped) |
| Display line-height | 0.9–1.05 | 1.2 (loses impact) |
| Button padding | 14–18px vertical, 36–56px horizontal | <12px vertical (tentative) or >60px horizontal (clunky) |
| Icon-in-tile corner radius | Parent card radius minus 4px | Mismatched (feels unharmonious) |
| Drop shadow offset direction | Cardinal only (4px/4px, 0/4px) | Diagonal (3.5px/3px reads as rendering bug) |
| Accent color saturation | 70–90% (saturated but not neon) | 100% (neon reads cheap) or 50% (mud) |
| Spacing between related elements | 8–12px | 4px (cramped) or 20px+ (disconnected) |
| Spacing between groups | 24–32px | <16px (no breathing) or 48px+ (wasted) |

---

## 4. Visual pedagogy rules (game-specific)

### 4.1 Show don't tell, but be honest about what's a visual metaphor

Icons should communicate *what the thing is*, not *what it means pedagogically*. A cpu icon labeled "AUTO" is honest — the icon represents a machine. A cpu icon labeled "ROUTINE" is dishonest — routine is an abstract concept, not a machine.

### 4.2 Text density per screen

| Screen | Max words |
|---|---|
| Intro | 30 |
| Brief | 20 |
| Round / play card | 15 (task description) |
| Reveal / result | 40 including tailored line |
| Reflect phase | 60 (across all 6 lines combined) |
| Final rank | 25 (rank title + takeaway) |

If a screen exceeds these, trim aggressively. The test: could a non-English-first-language player still understand the mechanic? If not, rely on visuals.

### 4.3 The "no pre-announcements" rule

Never write "A 10-minute game" or "Round 2 of 4 — harder this time" or "This round will teach you about X." Trust the player to read the pacing. Pre-announcements are training-wheels text that patronize the audience.

### 4.4 Feedback must be instant + tactile + visible

Every tap needs:
- **Audio:** tone within 100ms (ensureAC + ping pattern)
- **Haptic:** `navigator.vibrate()` with short pattern (Android only, but don't skip it)
- **Visual:** scale change + color flash + particle burst + floating text pop

Any interaction missing even one of these feels "dead." Beat Blitz, AUDIT, CODIFY all deliver triple-feedback on every tap.

---

## 5. Color theory specific to games

### 5.1 Why cream over pure white for light-mode games

Pure white surfaces blend into the Rehearsal website background at small viewports. Cream (`#FFF4D6` or `#FAFAFA`) creates visual separation AND signals "handmade / crafted" vs "auto-generated." The warm cast also reduces eye fatigue on phone screens in low-light conditions.

### 5.2 Why dark navy over pure black for dark-mode games

Pure black (#000000) reads "flat" at phone brightness and creates sharp contrast edges that strain. Blue-tinted near-black (#0A0E1A) feels "atmospheric" — like looking into a space or depth, not a wall. The 3% blue shift also makes matrix green (#00FF9D) glows read brighter by complementary contrast.

### 5.3 Accent color selection per course genre

| Genre / topic | Suggested accent | Reasoning |
|---|---|---|
| AI / automation / data | Matrix green #00FF9D or cyan #00D9FF | Tech-adjacent |
| Behavioral science / people topics | Coral / rust / warm accent | Human-warmth signal |
| Finance / strategy | Gold #D4AF37 or forest #2F7D32 | Conservative/authoritative |
| Branding / marketing | Hot pink #FF3A7C or magenta | Signals design-forward |
| Crisis / judgment | Rust #B54A2E or burnt orange | Urgency without alarm |
| Legal / regulatory | Deep navy #1E3A8A or forest | Institutional |
| Default / unsure | Hot pink #FF3A7C (Arcade Pop default) | Safest broad appeal |

### 5.4 What colors NOT to use

- **Pure red #FF0000** — looks like an alert/error, not game accent
- **Pure blue #0000FF** — reads corporate/Dribbble-default
- **Claude-purple #9677F8** (Rehearsal brand lavender) — too on-the-nose when a game is ABOUT AI
- **Gradients with more than 2 stops** — reads as "generic AI-generated UI"

### 5.4a AI-slop palette family — BAN as game primary accent (v10.16.0)

Explicit bans for game primary/secondary accents. These colors are the visual signature of AI-generated UI and read as "lazy generic" regardless of execution quality:

- **Electric Violet** `#7C3AED`, `#8B5CF6` — ChatGPT/Midjourney default palette
- **Royal Purple / Deep Purple** — same family
- **Lavender** (except specific character-voice contexts) — same family
- **Electric Blue** `#3B82F6`, `#4e44fd` — AI product logo default (Anthropic, Claude, generic SaaS)
- **Neon Magenta / Hot Pink as primary** (OK as Arcade Pop accent secondary, NOT as AI/enterprise primary)
- **Cyan-to-purple gradient** — Figma default AI aesthetic
- **Violet-to-pink gradient** — Midjourney / Stable Diffusion default

**Detection test:** if the palette could appear on ChatGPT's welcome screen, a VC AI-product pitch-deck slide, or a generic SaaS marketing site, REJECT. Pick something a 1980s trade magazine, serious newsroom, industrial machinery catalog, or courthouse ledger would pick.

### 5.4b Alternative palette families (earned by era / domain)

When the course's subject has a historical/industry setting, BORROW that setting's visual language. These six families are pre-validated alternatives to AI-slop defaults:

| Family | Primary | Secondary | Base | Suited for |
|---|---|---|---|---|
| **Bloomberg Terminal** | Terminal Amber #E8A33D | Oxblood #7C2D2D | Ink #0F0F11 | Finance, analytical, data-driven |
| **WSJ Opinion Oxblood** | Oxblood #8B1A1A | Cream #F4EFE4 | Deep Ink #141414 | Op-ed, HBR, serious consequential topics |
| **Industrial Rust** | Rust #C84B2F | Bone Cream #E8DCC4 + Brass #B8892E | Warm Charcoal #1C1A18 | GE-era factory, industrial, Welch-era performance management |
| **Courthouse Forest** | Forest #1F3A2E | Bone Cream | Oxblood-charcoal #1A1612 | Legal, ledger, compliance, audit |
| **Bureaucratic Prussian** | Prussian Blue #1E3A5F | Ochre #C8972D | Near-black #0D0D10 | Government, archive, gazette, regulatory |
| **Film Noir Editorial** | Cadmium Red #D7263D | Warm Cream #F4EFE4 | Deep Ink #141414 | Investigative journalism, exposé, character-driven |

**Rule of thumb:** the palette should be era-appropriate to the course's historical setting. A course about GE 1981 factory-floor performance management should use Industrial Rust, not Electric Violet — the violet reads as 2024 AI tooling, breaking the 1981 immersion.

**Rehearsal brand lavender `#9677f8` + indigo `#4e44fd`** are reserved for BRAND surfaces (course covers, website, print collateral), NOT game accents. Games choose domain-earned palettes.

### 5.4c Accent saturation test

After picking an accent, check saturation:
- **Too saturated (100% / neon)** — reads cheap, game-like in the wrong register
- **Under-saturated (50% / muddy)** — reads cheap in a different way (tired)
- **Sweet spot 70-90% saturation** — saturated enough to pop, controlled enough to read as "considered"

All six alternative palette families above sit at 70-90% saturation. AI-slop violets typically sit at 60-70% (just low enough to feel "professional") but their HUE is the problem, not their saturation.

---

## 6. Typography reasoning — when to use what display font

### Arcade Pop: Bungee
**Why it works:** caps-only display font modelled on transit signage. Reads as "this is a game title" instantly. Generous weight feels tactile. Works at 60–90px hero sizes.

**What to use instead if Bungee doesn't fit:** Archivo Black at 800 weight (less unique but workable), Paytone One (softer sticker feel), Rubik Mono One (chunkier).

### Sci-Fi Matrix: Orbitron
**Why it works:** futuristic-military display font with strong geometric forms. Caps at 900 weight with letter-spacing reads as "interface title." Pairs naturally with mono body fonts.

**What to use instead:** Eurostile / Orbitron alternative (Michroma, Audiowide), IBM Plex Sans Condensed at 900 weight, Space Grotesk at 700+.

### Editorial Mono: Source Serif 4
**Why it works:** contemporary editorial serif with strong weight options. At 800 weight with negative letter-spacing reads as "NYT Games" authority. Pairs with any geometric sans.

**What to use instead:** Playfair Display (more decorative), Fraunces (warmer), Domine (softer).

---

## 7. The iteration protocol — why 2 passes aren't enough, why 4 pass threshold

No game ships on first attempt. **Minimum 3 iteration passes**:

1. **Mechanical correctness pass** — does it run without bugs? Does gsap not leave elements invisible? Do taps register? Does state reset on Play Again?
2. **Aesthetic review pass** — does it feel like the declared family? Are fonts + palette + shadows consistent? Does the first impression match the target emotion?
3. **Pedagogical review pass** — does a novice actually learn the skill? Does the tailored Reflect line resonate? Does Round 4 (or equivalent) deliver the inversion?

Each pass produces a distinct revision. Shipping after only mechanical-correctness = derivative games. Shipping after only aesthetic = polished-but-hollow games. Shipping after only pedagogical = ugly-but-correct games. All three are required.

**Above 3 passes, diminishing returns:**
- 4 passes: minor polish (copy editing, icon tweaks, color fine-tuning)
- 5+ passes: over-iteration (you're now changing taste calls, not improving)

Most games should ship at pass 3 or 4.

---

## 8. Reference games — open these before generating

Before producing any new game, open and read these files end-to-end:

| File | Reference for | What to study |
|---|---|---|
| `games/knowledge-worker-prompt-decomposition/decomposer.html` | Arcade Pop | Cream + hot-pink + Bungee combination, row-based find-contradictions mechanic, Reflect phase warm variant |
| `games/senior-leader-task-anatomy/routine.html` | Sci-Fi Matrix | Dark + matrix-green + Orbitron combination, swipe-deck mechanic, terminal-style Reflect phase |
| `games/beat-blitz/beat-plan-game.html` | proto-Editorial Mono | Cream + gold/rust accent, allocation mechanic, restrained animation |

**Do this BEFORE opening the spec.** Pattern-match against these, then adapt. It is better to start with a working reference and modify than to design from scratch.

---

## 9. What to do when the aesthetic family doesn't fit

Sometimes a course genuinely needs a fourth aesthetic — maybe "playful dark mode" for a games-about-games course, or "retro pixel" for a nostalgia piece. When this happens:

1. Open this file and re-read Sections 1–6.
2. Invoke `/typography` skill for font-pairing reasoning.
3. Invoke `/frontend-design` skill for layout reference.
4. Invoke `/rehearsal-taste:check` to validate the proposed aesthetic.
5. Document the new family in a `design.md` with:
   - Cultural references (what you're pattern-matching)
   - Palette (exact hex values)
   - Font stack (display / body / mono)
   - Shadow signature
   - Anti-patterns
6. Run the first iteration past the user for taste approval BEFORE investing in Agent 4 audit.

The three declared families are defaults, not a straitjacket. But adding a fourth requires documentation, not improvisation.

---

## 10. The taste safety check — "would I show this to someone I respect?"

Before declaring a game complete, ask yourself honestly:

- Would I show this to someone whose design taste I admire, without caveats?
- Would I be embarrassed if this ended up on Dribbble / Behance / the Rehearsal website front page?
- Does every screen feel deliberate, or are any screens there just because a round needs to exist?
- If a stranger saw this for 3 seconds, would they know what kind of game it is?

If any answer is "no" or "hesitant," return to iteration. Taste is the final filter.

---

## Summary — the compressed version

**Before generating:** read this file + the reference games + the three templates.

**During generating:** enforce the 10 cross-family rules + micro-details + three-font limit.

**After generating:** run the three iteration passes + the taste safety check + Agent 4's 24 checks.

**When in doubt:** pattern-match against AUDIT or CODIFY, and lean on the user's feedback. The games that shipped this session were 40% skill-driven, 30% cultural pattern-matching, and 30% feedback loop. All three channels matter.
