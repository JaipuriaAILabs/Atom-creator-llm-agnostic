# Visual Philosophy — 3 Types + 8 Lateral Thinking Principles (v7.3.0)

> **What this file covers:** The three visual types (Company-Driven, Personality-Driven, Lateral), the 8 Lateral Thinking Principles for default visual direction, the classification algorithm, genre-to-type affinity, v3 JSON prompt format, and batch variety rules.
> **When to load:** `:visuals` Phase 1 (Visual Philosophy Gate). Also referenced by `:assets` Agent A and `course-visual-generator` / `hands-on-visual-generator` skills.
> **Archetype applicability:** Both Concept Sprint and Hands-On Guide. The three types apply universally. Hands-On courses skew toward Lateral (Type 3) because they rarely center on a single company or personality.

---

## The Three Visual Types

Visual direction is no longer decided during `:plan`. It is decided during `:visuals` Phase 1, AFTER the course content exists and can be read. This produces better visual directions because the creative director has the full narrative to react to, not a research summary.

Three types replace the previous five approaches (Hero Company Homage, Persona Silhouette Thread, Physical Metaphor, Domain-Native Abstraction, Literal + Elevated). The consolidation reflects a truth: the old five were really three strategies with two being default sub-strategies of Lateral.

**Priority order:** Company-Driven > Personality-Driven > Lateral (default).

---

### Type 1: Company-Driven

**When to use:** One company dominates 60%+ of the course narrative AND that company has a design language recognizable from abstract elements alone — no logo, no wordmark, just colors, layouts, and UI patterns. If three companies share equal weight, this type does not apply.

**How it works:** Borrow the company's design DNA, not their products. The course's entire visual vocabulary becomes an homage to the company's visual system. Colors, grid structures, card elevations, corner radii, UI surface patterns — all rendered as flat geometric abstraction. The viewer should feel "this is about X" within 2 seconds without seeing any text.

**Near-logo treatment rules:**
- Modify ONE structural element of the company's iconic mark while preserving overall gestalt. The modification must be consistent across ALL images in the course.
- Snapchat ghost: shift eye position or shape, add geometric angles to the silhouette.
- Apple: change bite position to opposite side, square off the leaf.
- Twitter/X bird: adjust wing angle, simplify to 3 strokes.
- The test: "A user knows what company this references, but a lawyer cannot claim trademark infringement."
- The same abstracted icon appears throughout — never different modifications per image.

**Exemplars:**

- **Bloomberg Terminal** — Amber text on black grid. Any amber-on-black data layout reads as Bloomberg instantly. The grid IS the design language. The 8-panel tile layout, the monospace density, the green/red delta arrows — all reproducible as flat geometric composition without any Bloomberg IP. Perfect for finance courses where Bloomberg dominates the narrative.

- **Google Material Design** — 4-color system (blue #4285F4, red #EA4335, yellow #FBBC05, green #34A853), card elevation with colored shadows, 8dp grid, specific corner radii. Three colored cards at different elevations on a white surface = instant Google. The elevation metaphor (layers of paper at different heights casting colored shadows) is the DNA, not the logo.

- **Apple** — White space as luxury signal, centered single-object composition on seamless background, precise shadow with no hard edge, rounded rectangle as recurring form. The ABSENCE of visual noise IS Apple's design language. A single geometric object centered on vast emptiness, lit from above with a soft shadow, reads as Apple's aesthetic.

- **Spotify** — Single-color dominance (Spotify Green #1DB954 occupying 60%+ of visual area), three-arc sound wave as geometric motif, black supporting palette, duotone image treatment. The ratio of green-to-black is the signature, not the logo.

- **Snapchat** — Yellow #FFFC00 as background (unmistakable at full saturation), ghost outline as geometric form, rounded rectangle cards mimicking Stories/Discover surfaces. Simple enough for crude geometric approximation and still recognizable because the yellow is so distinctive.

- **Indian brands:** Amul (polka-dot girl silhouette, 1966 — India's most recognized ad character, reproducible as simple geometric pattern), Zomato (red #E23744 + geometric food delivery grid), Swiggy (orange #FC8019 + route-line motif), CRED (black/white exclusivity, minimal geometric luxury), Tata (blue/silver T-shape — the same structural mark across 100+ companies, recognizable as a geometric form).

**Pop art precedent — why this is legally and artistically defensible:**

Andy Warhol's Campbell's Soup Cans (1962) proved that commercial design language IS legitimate artistic material when recontextualized. The soup can was not "copied" — it was elevated into commentary. Roy Lichtenstein's critical distinction: he TRANSFORMED the source material (changed compositions, added interpretation, isolated and enlarged). The most defensible homage transforms while maintaining recognizability.

**Legal framework:** Trade dress protects "total look and feel," but educational illustration about a company using that company's design language is the most defensible use case. Color alone cannot be trademarked (the Louboutin case established this as a POSITION trademark, not a color trademark). UI layout patterns (Stories rings, chat bubbles, grid tiles) are functional elements NOT protectable as trade dress when rendered as geometric abstractions. NEVER reproduce exact logos, wordmarks, registered slogans, or trademarked character designs.

---

### Type 1 Variant: Protagonist + Cameo Brand Colors (v10.19.0)

**When to use:** One protagonist company (e.g., Cloudflare) anchors the narrative and appears on most cards AND 2–4 secondary companies appear on specific cards with narrative significance (e.g., Reddit on the licensing card, Chegg on the blocking card, Anthropic as a crawler on the ratios card).

**How it differs from base Type 1:** base Type 1 uses ONE brand identity across every card. The variant keeps the protagonist's motif as the spine (Cloudflare cloud + orange, recurring) AND activates secondary brand colors ONLY on cards where those secondaries actually appear in the course prose. Cards without any secondary mention render in pure protagonist palette.

**Brand-color activation map** (write this in `art-direction.md`):

```
| Card | Secondary brands mentioned | Brand colors active |
|------|----------------------------|---------------------|
| 0 Cover | Protagonist only | Protagonist palette |
| 1 Opener | Anthropic (data point) | Protagonist + Anthropic terra-cotta |
| 6 Framework | Protagonist only | Protagonist palette |
| 8 Triptych | Chegg + Reddit + Protagonist | Chegg gold + Reddit red + Protagonist orange |
| 9 Dashboard | Anthropic + OpenAI + Google | Protagonist + all crawler brand colors |
```

**Why it matters:** Mental recall per card. The reader sees the Reddit red + antennaed figure on the License card and instantly recalls Reddit's licensing choice even before reading the course MD. A single unified palette across the entire set cannot do this — the secondaries have to appear when they appear and be absent when they are absent.

**Session of origin:** 2026-04-20, `founder-agent-readiness`. Protagonist = Cloudflare (cloud silhouette + warm orange #F38020). Secondaries = Reddit warm red (#FF4500), Chegg scholar gold (#FFC72C), Anthropic terra-cotta (#D97757), OpenAI monochrome ink (#0F1419). See `visuals/founder-agent-readiness/art-direction.md` for the complete activation map as reference.

**Legal: same framework as base Type 1.** Brand COLORS are not trademarked; brand-adjacent SILHOUETTES (cumulus cloud for Cloudflare, antennaed round figure for Reddit, mortarboard for Chegg, camera-rig for crawlers) are transformative educational illustration, NEVER exact logos.

**When NOT to use:**
- If secondary companies appear on 0-1 cards only, don't activate the variant — the brand-color cameos won't justify the visual complexity.
- If the course's brand-visual-DNA is too weak for the protagonist to anchor (i.e., base Type 1 already failed), the variant inherits the failure.
- For Personality-Driven (Type 2) or pure Lateral (Type 3) courses, the variant does not apply — there's no brand protagonist to anchor.

---

### Type 2: Personality-Driven

**When to use:** A famous person anchors the course narrative AND that person is recognizable by silhouette alone — no face, just body shape, posture, signature clothing, or iconic accessories. The recognition test: show the silhouette to someone who has not read the course. Can they guess who it is? If not, the person is not famous enough for this type.

**How it works:** The person's distinctive silhouette becomes a recurring visual anchor across all course images. Different poses and contexts per image, but the same silhouette language throughout. The figure appears in various narrative moments — working, presenting, deciding, failing, succeeding — creating a visual biography arc.

**Silhouette recognition hierarchy (5 tiers, from most to least recognizable):**

1. **Props (Tier 1)** — Objects the person is famous for holding or using. Gandhi's walking stick. Jobs' keynote remote. Churchill's cigar. These are the strongest recognition signals because they are unique geometric shapes attached to the figure.

2. **Clothing shape (Tier 2)** — Distinctive garment silhouettes. Gandhi's dhoti creating a unique lower-body geometry. Jobs' turtleneck + jeans creating a geometric simplicity. Nehru's jacket creating a distinctive collar line. The clothing must be unusual enough to distinguish from a generic figure.

3. **Exaggerated body proportions (Tier 3)** — Height, posture, and build when distinctive. Bachchan's height (6'2" in an era of 5'7" heroes). Tendulkar's compact batting stance. Tagore's flowing beard comprising 40% of the figure's width. Proportions work when the person's body shape is genuinely unusual.

4. **Unique pose (Tier 4)** — Signature gestures and stances. Tendulkar's low backlift (technique-specific, recognizable to cricket viewers). Bachchan's Deewar cigarette pose. Usain Bolt's lightning bolt celebration. Poses are weaker signals because they capture one moment, not the whole person.

5. **Accessory position (Tier 5)** — Where accessories sit on the body. Gandhi's round spectacles. Nehru's rose boutonniere. These are the weakest signals alone but powerful in combination with other tiers.

The best silhouettes combine Tier 1 + Tier 2 (props + clothing). A walking stick + dhoti = Gandhi at any resolution. A turtleneck + jeans + remote = Jobs.

**Series design methods for visual arcs:**

- **Posture Progression** — Same body, changing limb angles across images. The figure starts hunched/uncertain and progressively opens up — shoulders back, arms wider, stance more commanding. Encodes narrative growth in body language.

- **Accessory Evolution** — Props change across the image series to encode career progression. Backpack becomes briefcase becomes leading a group. Notebook becomes blueprint becomes building. The silhouette stays consistent; what the figure carries tells the story.

- **Environmental Context Shift** — Same silhouette, changing backgrounds (the Mad Men method). Identical figure placed in garage workshop, then corporate office, then keynote stage, then boardroom crisis. The person is constant; the world around them shifts.

- **James Bond Principle** — Consistency + micro-variation. The gun barrel sequence has run for 60 years across 25 films. Each iteration changes one element (camera angle, suit cut, background color) while preserving the gestalt. Apply this to course image series: same silhouette language, but each image introduces one compositional surprise.

**Exemplars:**

- **iPod silhouette campaign (TBWA\Chiat\Day, 2003-2008)** — Art directed by Susan Alinsangan. Core formula: pure black silhouettes + solid saturated backgrounds + white earbuds as the sole non-black element + dynamic mid-motion poses. Silhouettes were geometrically CONSTRUCTED (not photographic traces) — exaggerated limb length for dynamism, enlarged heads for thumbnail recognition, deliberately opened negative space between arms and torso so the figure reads at any size. Over 50 variations, all instantly recognizable because the core visual language never changed. iPod hit 92% market share during this campaign. The methodology: construct, do not trace. Exaggerate for recognition. One non-silhouette element (the earbuds) anchors the product.

- **Saul Bass — foundational silhouette methodology.** Vertigo (1958): mathematical spirals perform the sensation of vertigo. Geometry IS emotion. Anatomy of a Murder (1959): a corpse silhouette dissected into 7 geometric pieces — proving that silhouettes can be segmented, rearranged, and abstracted while retaining identity. His philosophy: "Reach for a simple visual phrase that tells you what the picture is all about." Every Bass poster reduces a 2-hour film to one memorable shape.

- **Modern Bass lineage.** Catch Me If You Can (2002): hand-carved stamp-style silhouettes placed in CG environments — proving silhouette language works in digital contexts. Mad Men title sequence (2007, Emmy-winning): a falling silhouette through geometric architecture. The SAME figure in DIFFERENT environmental contexts = narrative progression without dialogue. This is the Environmental Context Shift method at its most refined.

- **Indian figures recognizable by silhouette:** Gandhi (walking stick > dhoti > round spectacles > body proportion — globally recognizable, arguably the world's most identifiable silhouette after the human figure itself). Tagore (flowing beard occupying 40% of figure width, distinctive posture of contemplation). Tendulkar (compact batting stance with low backlift — technique-specific, recognizable to any cricket viewer). Bachchan (height differential + Deewar-era cigarette pose — recognizable in Indian cultural context).

---

### Type 3: Lateral (DEFAULT)

**When to use:** Everything that is not Company-Driven or Personality-Driven. This is the default type and applies to the majority of courses. Most business, strategy, management, behavioral, and analytical courses land here.

**The lateral approach — refined.** "Lateral" does NOT mean "completely unrelated." The lateral leap should be in TREATMENT (how you render it), not in SUBJECT (what you render). The subject should still RHYME with the domain. The treatment should be unexpected.

This approach is governed by the 8 Lateral Thinking Principles below. Every Lateral visual direction must demonstrably apply at least 3 of the 8 principles.

**How to think laterally — the 5-step process:**

1. **Start with the DOMAIN, not with metaphors.** What is the actual world this course lives in? Attribution model selection → the advertising industry. Feedback loops → product engineering. Compensation architecture → corporate HR infrastructure. Don't jump to metaphors yet.

2. **Find the CHARACTERS that naturally inhabit that domain.** Who are the people in this world? Advertising → supermodels, agency creatives, CMOs. Product management → PMs, engineers, users. Tax consulting → lawyers, judges, regulators. These are your silhouette figures.

3. **Find the VISUAL LANGUAGE of that domain.** What does this world LOOK like physically? Advertising → runways, billboards, spotlights, stages, camera flashes. Finance → trading floors, ticker screens, vault doors. Real estate → blueprints, floor plans, building models. This vocabulary becomes your environment.

4. **Pick a TREATMENT that creates tension with the domain.** This is where the lateral leap happens — not in the subject, but in HOW you render it. Advertising rendered as iPod-era flat bold graphics = unexpected tension (glamour meets graphic simplicity). Tax law rendered as old cartography = unexpected (dry regulations become beautiful maps). The treatment should make the viewer say "I've never seen [domain] look like THIS."

5. **Tell the story through what HAPPENS TO the characters.** Confident → stumbling → collapsed → knowing. The visual arc is the character's journey through the course narrative. Define the character's posture at each story beat BEFORE writing any prompts.

**The failure pattern:** Jumping straight to Step 4 (treatment/metaphor) without doing Steps 1-3 (domain → characters → visual language). This produces: kathputli puppets for an Apple course (no domain connection), data autopsy tables for advertising (no joy), abstract geometry for anything (no characters). Steps 1-3 anchor the visual world. Step 4 elevates it.

**The one-sentence pitch test (VD6):** After completing all 5 steps, pitch the direction in one sentence. "Supermodels on an advertising runway, rendered in iPod-era bold graphics, progressively crumbling as the industry's metrics are exposed as hollow." If someone says "oh cool" — proceed. If they say "what do you mean?" — iterate from Step 1.

**Three critical rules for Lateral type:**

1. **Subject rhymes with domain, treatment is the lateral leap.** A course about advertising shows the advertising world (runways, billboards) — but rendered in iPod-era flat graphics (the leap). A course about career capital shows espionage — but rendered in spy-thriller noir (the leap IS the genre fusion). The subject connects. The treatment surprises.

2. **Elevated treatment is mandatory.** Even when the metaphor is playful (cobra, puppet, building blocks), the rendering must be editorial-quality. Flat geometric with precise composition, deliberate lighting, and constrained palette. Never clip-art, never stock-illustration energy.

3. **The Big Short test applies.** Would this visual work in a movie scene explaining the concept to a non-expert audience? If the metaphor requires a paragraph of explanation, it is too abstract. If a viewer can feel the concept through the image before reading the text, it passes.

---

## The 8 Lateral Thinking Principles

These are METHOD principles for generating visual directions. They are culture-agnostic — the exemplars span American, European, Indian, and Japanese creative traditions. When working in Lateral mode, apply at least 3 principles to every visual direction.

---

### Principle 1: Cognitive Dissonance as Hook

**Definition:** The visual subject bears no obvious surface relationship to the course topic. The gap between what you see and what you are learning forces the brain to build a bridge — and that bridge is the memorable association.

**The test:** Describe the image to someone who has not seen the course title. They should NOT be able to guess the subject matter. Then reveal the course topic. They should immediately understand the connection.

**Exemplars:**

1. **Cadbury Gorilla (Fallon London, 2007)** — A gorilla playing Phil Collins' "In the Air Tonight" on drums. No chocolate appears until the final frame. The ad has nothing to do with chocolate on the surface. Yet it communicated pure joy — the emotion Cadbury wanted associated with their brand — so powerfully that it achieved 48% unaided recall and reversed a salmonella crisis. The dissonance (gorilla + chocolate) created a memory structure stronger than any product shot.

2. **Silk Cut (Saatchi & Saatchi, 1984)** — A sheet of purple silk being sliced by a blade. The product (cigarettes) never appears. The campaign ran for over a decade with nothing but variations on cut silk. UK smokers could identify the brand from the image alone. The dissonance between silk (luxury, softness) and cutting (violence, sharpness) performed the brand name visually without spelling it.

3. **Fevicol Egg (Ogilvy India, 1996, Piyush Pandey)** — A hen fed Fevicol adhesive lays an unbreakable egg. No tube of glue in sight. The ad turned Indian advertising toward lateral thinking by proving that showing the product is unnecessary when the metaphor is strong enough. The egg IS the bond — you feel the adhesive's power through the impossibility of the image.

**The anti-pattern:** A course about financial risk management shows a stock chart with a downward arrow. The visual subject IS the domain. There is no cognitive gap, no bridge to build, no memory formation. The image is a diagram, not a visual direction.

---

### Principle 2: Character-as-Concept

**Definition:** The core concept of the course becomes a physical CHARACTER — a being with form, posture, behavior, and personality. The character cannot be separated from the concept because the character IS the concept made flesh.

**The test:** Remove the character from the image. Does the concept disappear with it? If you can explain the image without referencing the character, the character is decorative, not conceptual.

**Exemplars:**

1. **Inside Out (Pixar, 2015)** — Joy, Sadness, Anger, Fear, and Disgust are not mascots representing emotions. They ARE those emotions given physical form. Joy is golden light and upward movement. Anger's head catches fire. Sadness is blue and heavy and slow. The character cannot be separated from the concept because they are the same thing. This is the gold standard for character-as-concept.

2. **Dementors (J.K. Rowling, 1999)** — A literal embodiment of clinical depression. Dementors drain hope, peace, and happiness — the clinical symptoms of major depressive disorder. Their physical form (hooded, faceless, floating, cold) performs the experience of depression without ever naming it. Rowling has confirmed she wrote them from personal experience with depression. The creature IS the condition.

3. **Amul Girl (daCunha Communications, 1967)** — Not a mascot holding butter. She IS "utterly butterly delicious" made visual — a chubby, cheerful girl in a polka-dot dress who embodies the joy of eating butter. For 58 years she has been India's cultural appetite embodied, commenting on current events through her relationship with butter. She cannot exist without the product because she IS the product's emotional essence.

**The anti-pattern:** A course about organizational resilience shows a generic shield icon. The shield is a symbol, not a character. It has no posture, no behavior, no personality. It could represent security, defense, insurance, or medieval warfare. Character-as-concept demands specificity — the cobra coiled around a feedback loop IS hidden danger in systems, not a generic symbol of danger.

---

### Principle 3: Visual Tradition Fusion

**Definition:** Combine exactly two disparate visual traditions — one providing STRUCTURE, one providing TREATMENT. The fusion creates something neither tradition could produce alone. One tradition is not enough (it is pastiche). Three traditions are too many (it becomes noise).

**The test:** Name the two traditions. Remove either one. Does the image collapse into something ordinary? If you can remove one tradition and the image still works, the fusion is decorative, not structural.

**Exemplars:**

1. **Hipgnosis / Storm Thorgerson (1968-1983)** — Surrealism + commercial album packaging. Thorgerson brought Magritte's impossible juxtapositions into record stores. Pink Floyd's Dark Side of the Moon prism, Wish You Were Here's burning handshake — each fused fine art surrealism (structure: impossible objects in realistic settings) with mass-market design (treatment: high-contrast print reproduction, centerfold format). Created album art as a legitimate art form.

2. **Wong Kar-wai (1990s-2000s)** — Hollywood Technicolor glamour + European modernist cinema. In the Mood for Love uses saturated Technicolor reds and greens (Hollywood) with fragmented, elliptical time structures (European). Neither tradition alone produces that film's emotional texture. Influenced Sofia Coppola, Mad Men's visual identity, and Barry Jenkins' Moonlight.

3. **Neville Brody / The Face (1980s)** — Punk ethics + Swiss International Typography. Brody took the rigorous grid systems and clean geometry of Swiss design (structure) and injected punk's deliberate rule-breaking and radical energy (treatment). The result became the template for 1990s graphic design: precise but dangerous.

**The anti-pattern:** A visual direction described as "minimalist flat geometric" references one tradition (Swiss/Bauhaus minimalism) with no fusion. It produces competent but unremarkable images because there is no tension between traditions. Every course's flat geometric art looks the same without a second tradition providing friction.

---

### Principle 4: Subject-Treatment Independence

**Definition:** Subject and treatment are two independent axes. The subject is WHAT appears in the image. The treatment is HOW it is rendered. A pedestrian subject with extraordinary treatment produces better images than an extraordinary subject with standard treatment. NEVER allow both axes to be standard.

**The test:** A two-axis matrix. Plot the image. Is the subject metaphorical or literal? Is the treatment elevated or standard? At least one axis must be non-standard. Both axes being non-standard is ideal.

**Exemplars:**

1. **Edward Weston, Pepper No. 30 (1930)** — Subject: a bell pepper purchased at a market for pennies. Treatment: raking light inside a tin funnel creating sculptural shadows and sensual curves. The pepper becomes one of the 20th century's most celebrated photographs. Subject cost nothing. Treatment made it transcendent. Literal subject + elevated treatment.

2. **William Eggleston, The Red Ceiling (1970s)** — Subject: parking lots, tract housing, gas stations, suburban banality. Treatment: dye-transfer saturation process (previously reserved for advertising) applied to the mundane. Called "the father of color photography" because his treatment revealed transcendence in the ordinary. MoMA's first color photography exhibition. Literal subject + elevated treatment.

3. **Juergen Teller (1990s-present)** — Subject: the same celebrities every fashion photographer shoots (Kate Moss, Marc Jacobs, Vivienne Westwood). Treatment: deliberately anti-luxury — harsh flash, unflattering angles, domestic settings. Marc Jacobs and Chanel commission him repeatedly because the ANTI-treatment IS the treatment. Same subject as competitors, opposite treatment, more memorable.

**The anti-pattern:** A course about data analytics shows a generic dashboard with standard flat-design rendering. The subject is literal (dashboard) and the treatment is standard (flat design). Both axes are default. The image communicates nothing that a screenshot would not.

---

### Principle 5: Spatial Memory Architecture

**Definition:** Each image creates a unique GEOMETRIC PATTERN that a viewer can sketch from memory 3 days later. The pattern is structural — it exists in the arrangement of shapes, not in the details of rendering. Two images in the same course must have obviously different spatial signatures.

**The test:** Three days after viewing, ask the viewer to draw the image from memory. If they can reproduce the basic geometric structure (where the shapes are, how they relate), the spatial memory works. If they can only describe it verbally ("it was some shapes on a dark background"), it fails.

**Exemplars:**

1. **Massimo Vignelli, NYC Subway Map (1972)** — All subway lines reduced to 3 angles (horizontal, vertical, 45-degree diagonal). Geographically inaccurate. WORSE for navigation than the map it replaced. But so spatially memorable that it is ranked among the greatest information design ever created. People can draw the basic structure from memory because it is pure geometry.

2. **Otl Aicher, Munich Olympics Pictograms (1972)** — Every sport reduced to a human figure built from geometric circles and lines on a grid. No language needed. No cultural context needed. Still the pinnacle of systematic visual design 50+ years later because each pictogram has a unique spatial signature: the diver's arc, the weightlifter's stance, the swimmer's stroke. Memorable by geometric shape alone.

3. **Saul Bass, Vertigo poster (1958)** — Obsession encoded in a single spiral. The entire poster is one geometric form in negative space. Can be sketched from memory in 3 seconds because there is only one shape to remember, and that shape performs the emotion of the film.

**The anti-pattern:** A course has 7 body images that are all "object centered on background" — same spatial signature repeated 7 times. The viewer cannot distinguish image 3 from image 5 by layout alone. Each image must create a distinct geometric footprint: top-heavy vs. bottom-heavy, gridded vs. organic, centered vs. off-balance, dense vs. sparse.

---

### Principle 6: Constraint-Based Palette

**Definition:** Maximum 5-6 colors per course, each with SEMANTIC meaning tied to the narrative. The constraint is not aesthetic preference — it is meaning-making. When every color signifies something, color becomes a storytelling tool. When colors are decorative, they are noise.

**The test:** Can you write a color legend? Background = [meaning]. Accent = [meaning]. Failure = [meaning]. If a color has no assigned meaning, it should not exist in the palette.

**Exemplars:**

1. **El Lissitzky, "Beat the Whites with the Red Wedge" (1919)** — Three colors encode the entire Russian Revolution. Red = Bolsheviks. White = the old guard. Black = the battlefield. With more colors, the poster becomes decorative. With exactly three, it becomes confrontational. The constraint IS the power.

2. **David Fincher, Se7en (1995)** — Red reserved exclusively for blood and violence. Every other element desaturated to near-monochrome. When red appears on screen, it registers as a physiological alarm because it has been starved throughout. The constraint (one color = one meaning) makes every appearance of that color an event.

3. **Barbara Kruger (1980s-present)** — Red bars + black Futura Bold + white text. Three elements, zero flexibility. "Your Body is a Battleground." "I Shop Therefore I Am." The rigid constraint became so powerful it influenced Supreme's entire branding system and an entire generation of protest art. Constraint creates identity; flexibility destroys it.

**The anti-pattern:** A course palette lists 8 colors with no semantic assignment. Blue, teal, green, coral, gold, gray, navy, cream — all used "as needed." The images feel like a collection rather than a series because color carries no narrative information.

---

### Principle 7: Emotional Arc Mirroring

**Definition:** The visual density, saturation, and compositional energy of images mirrors the narrative arc of the course. Opening images are calmer/simpler. Crisis-point images are denser/more saturated. Resolution images return to clarity with new elements added. The image series tells the emotional story even if you cannot read the text.

**The test:** Lay the images out in sequence. Squint until you see only color and density. Does the visual energy rise, peak, and resolve in a way that maps to the narrative? If the images are interchangeable in sequence — any order feels the same — the arc mirroring fails.

**Exemplars:**

1. **Black Swan (Darren Aronofsky, 2010)** — The film opens in white and pink (innocence, ballet). As Nina's psychology deteriorates, intermediate tones appear — gray, muted purple. By the climax, the palette explodes into saturated black and crimson. Visual density increases in direct proportion to psychological collapse. You can tell where you are in the story by the color temperature alone.

2. **Requiem for a Dream (Darren Aronofsky, 2000)** — Begins with stable, centered compositions and normal color. As addiction escalates: split screens fragment the frame, cutting rhythm accelerates, visual density overwhelms. The final act is a barrage of rapid-fire imagery that reproduces the neurological experience of chemical dependency. The visual system IS the narrative system.

3. **Fight Club title sequence (David Fincher / Digital Domain, 1999)** — $800,000 for 90 seconds. The sequence begins INSIDE a brain (synaptic firing, neural pathways) and travels outward to reality (skin pores, sweat, the gun barrel). The visual journey from internal to external mirrors the film's theme of inner psychology erupting into outer violence. Each frame is more externally coherent than the last.

**The anti-pattern:** A 14-screen course has the same visual density and saturation on every image. Screen 1 feels identical to screen 10. There is no visual crescendo at the midpoint, no resolution shift in the final images. The image series is a collection of equally-weighted thumbnails rather than a visual narrative.

---

### Principle 8: The Big Short Test

**Definition:** Would this visual metaphor work in a movie scene explaining the concept to a non-expert audience? The Big Short (2015) used Margot Robbie in a bathtub to explain mortgage-backed securities, Jenga blocks for CDOs, and Anthony Bourdain's fish stew for repackaged debt. The visuals were physical, tangible, immediate — and they made systemic financial complexity feel graspable.

**The test:** Imagine a film director needs to explain this course's core concept in one visual. Would they use your image? If the metaphor requires a paragraph of explanation to connect to the concept, it is too abstract. If the viewer can FEEL the concept through the image before reading any text, it passes.

**Exemplars:**

1. **Jonathan Jarvis, "Crisis of Credit Visualized" (2011)** — Securitization tranches rendered as a waterfall. Top tray fills first (AAA, safe). Overflow cascades to lower trays (riskier tranches). The PHYSICS of water flowing downward makes systemic risk viscerally comprehensible. Made the 2008 financial crisis structurally visible to millions who could not parse a prospectus.

2. **Hans Rosling, Gapminder Bubble Charts (2006)** — Countries as animated bubbles. Size = population. Position = income vs. health. China's GDP rise = bubble rocketing rightward in real time. Rosling made statistics emotional by giving data physical properties (size, velocity, collision). His TED talks proved that the right visual metaphor makes 200 years of economic data feel like sports commentary.

3. **3Blue1Brown / Grant Sanderson — Fourier Transform visualization** — The Fourier transform explained as wrapping a wave around a circle. The winding frequency that creates a spike in the center-of-mass path = the component frequency. Viewers who struggled with the math for years report understanding the concept for the first time because they now have a SPATIAL MODEL to think with. The visual does not illustrate the concept — it IS the concept in a different medium.

**The anti-pattern:** A course about organizational resilience shows an abstract geometric pattern of interlocking hexagons labeled "RESILIENCE." The image is a diagram of the word, not a physical metaphor for the concept. A Big Short director would never point at hexagons and say "THIS is what resilience looks like." They would show a building surviving an earthquake, a mangrove forest absorbing a tsunami, or a rubber band stretched to its limit and snapping back.

---

### Principle 9: Moment-First Subject Per Card (v10.19.0)

**Definition:** Each card's image renders the most emotionally striking moment of THAT CARD's prose, not a fragment of a course-wide metaphor. Coherence across the set comes from the shared style seed (rendering language + palette + ink weight + render rules), not from forcing one subject metaphor across every panel.

**When single-metaphor direction works:** only when the course narrative genuinely lives in ONE domain across all cards. Example: Territory Sales Manager — every card lives on supermarket shelves, so the shelf metaphor carries the whole set. Example: Prompt Decomposition — every card is about the same abstract mechanism.

**When single-metaphor direction fails (most courses):** the narrative visits multiple worlds — a Cannes podium, a backstage cable corridor, a 1999 nuclear control room, a founder's Monday-morning desk. Forcing "doors" or "library" or "theatre" across all six settings dilutes the strongest per-card images and bends scenes into a metaphor they don't belong to.

**Exemplars:**

1. **Michael Lewis in *The Big Short*** — each chapter opens with a different concrete scene (Burry's office, a Vegas conference floor, a Manhattan trading desk). The unity is VOICE and narrative arc, not a single setting stretched across chapters.

2. **Organizational-resilience course (Rehearsal benchmark)** — five warm-toned panels showing different war-room compositions. The subjects diverge (different rooms, different operators, different framings). The style binds (Soviet-constructivist × Persian, consistent palette, consistent ink weight). The set reads as ONE series even though no subject repeats.

3. **Founder-agent-readiness (v10.19.0 exemplar)** — 11 panels, 11 different subjects (Cannes podium → cable corridor → ratio valve → toll booth → five doors → CRT flashback → three doors → dashboard → dawn desk). Unity: Cloudflare cloud motif recurs as protagonist-brand anchor + style seed (flat editorial vector + Bungee/Archivo + hard 4px shadows + ink-and-halftone texture). Diverse subjects; singular visual family.

**The test:** list each card's "most memorable moment" in a column. If each moment is concrete (a specific scene, a specific image, a specific setting) and the moments span multiple domains, use moment-first direction. If every moment is a variant of the same metaphor, single-metaphor direction fits.

**Practical check:** when drafting `art-direction.md`, map each card to its moment BEFORE choosing a metaphor. If the moments are domain-diverse, the style seed (not a subject metaphor) must do the coherence work. This is VD8 (story-moment prompting) taken to its logical conclusion.

**Failure mode to avoid:** Author proposes a dominant metaphor (e.g., "theatre world") and tries to bend every card to it ("the control room becomes the technical booth," "the dashboard becomes the sound board"). The bent scenes lose their specificity. The stronger image (the actual 1999 control room; the actual analytics dashboard) is sacrificed to preserve metaphor continuity. Don't bend scenes; let the style seed bind them.

---

### Principle 10: Form-First When Color Family Overlaps (v10.19.0)

**Definition:** When ≥3 comparable elements must read as distinct in one frame AND their brand colors are in the same family (e.g., three warm-oranges like Chegg #FFC72C, Reddit #FF4500, Cloudflare #F38020), color alone fails. The frame reads muddy. Differentiate by FORM — three different architectural objects — with color as secondary accent on distinct shapes.

**Session of origin:** 2026-04-20, `founder-agent-readiness` Screen 8 Three-Door Rule. Initial version: three similar door rectangles in three warm-orange brand colors. Result: visually muddy, no read of three distinct states. Fix: three DIFFERENT architectural objects (walled-up doorway with padlocked chain / open doorway with scroll-as-red-carpet + handshake / classical toll-booth arch) — each in navy field with brand-color accent on its distinct shape. The eye reads WALL vs SCROLL vs TOLLBOOTH before it reads the color.

**Rule:** when designing a framework panel with N≥3 states that the course has color-coded, run this check on the color wheel: pick Pantone-nearest for each state's brand color. If ≥2 states land in the same 30° wedge of the wheel, form-first differentiation is mandatory. If states are already in distinct wheel regions (e.g., blue / orange / green), color-first may work.

**Canonical forms for the three-door pattern:**

| State | Architectural form | Accent color |
|-------|---------------------|--------------|
| Refusal / Block | Brick wall with padlocked chain + no-entry symbol | Coral red (not the blocker's brand color; red is universally refusal) |
| Negotiation / License | Open doorway with unfurled scroll + handshake + wax seal | Brand gold (Chegg-gold-adjacent; scroll + gold = deal) |
| Commerce / Price | Classical toll-booth arch + coin slot | Brand orange (Cloudflare orange; arch + coin = toll) |

**The exam:** squint at the triptych. The three states must be distinguishable purely by silhouette shape. If the shapes look similar and only color tells them apart, redesign until form carries the distinction.

---

### Principle 11: Flashback Via Props, Not Palette Shift (v10.19.0)

**Definition:** When signaling a different time period (a historical-parallel panel, a Braided-Technique lateral, a pre-course origin story) in one panel of an otherwise-unified set, signal time through period-accurate PROPS — not through a palette/texture shift. Graphic novels do this: they signal 1970s Tehran with chador silhouettes + vintage TV shapes + period tiles, not by shifting to sepia.

**Why palette shift fails:** the flashback panel breaks visual unity with the rest of the set. The reader perceives "different image family" rather than "same family, different moment." The coherence of the set collapses at the flashback, weakening both the flashback and the surrounding panels.

**Why prop signal works:** the palette stays constant (same ink weight, same highlight color, same field color). The eye registers 1999-ness from a rotary phone silhouette, a CRT box, a cassette recorder, an analogue gauge wall, a wall calendar rendered as a geometric block, a tape reel on a shelf. Time marker = object vocabulary, not color shift.

**Bridge the protagonist motif into the flashback panel.** When the main set has a recurring protagonist motif (Cloudflare cloud, founder silhouette, etc.), find a way to insert that motif INTO the flashback scene. It does double duty: period signal + motif continuity. Example from `founder-agent-readiness` Screen 7: a Cloudflare cloud appears ON the 1999 CRT screen, cracking from the audit. This makes the panel read as "same set, different time, same protagonist."

**Period-prop library (starter list):**

| Era | Proven prop signals |
|-----|---------------------|
| 1950s–60s | Rotary-dial phone, vacuum-tube radio, punch-card stack, analog wall clock with roman numerals |
| 1970s–80s | Typewriter, reel-to-reel tape, vinyl record on turntable, cathode-ray TV box, film projector |
| 1990s | CRT monitor (boxy), floppy disk, tape cassette, brick mobile phone, fax machine, VCR |
| 2000s | iPod silhouette, flip phone, CD tower, beige desktop tower with CRT |
| 2010s | First-gen smartphone, earbuds with wire, laptop clamshell, Fitbit wristband |

**The test:** look at the flashback panel in isolation alongside a present-day panel from the same set. The rendering language (palette, edges, ink weight, shadow style) must be indistinguishable. Only the object vocabulary differs. If the flashback panel reads as "different illustration style," redesign.

---

## Classification Algorithm

Run this decision tree during `:visuals` Phase 1 after reading the full course content.

**Step 1 — Company dominance check:**
- Count how many screens reference the primary company by name.
- If one company appears in 60%+ of screens AND has a recognizable design language (colors, UI patterns, layout conventions that a viewer could identify without text): **classify as Company-Driven (Type 1)**.
- If 2-3 companies share roughly equal narrative weight: Type 1 does not apply. Proceed to Step 2.

**Step 2 — Personality anchor check:**
- Is the course narrative anchored by a specific famous person?
- Apply the silhouette recognition test: would a viewer recognize this person as a black silhouette with no face, no text, no context? Use the 5-tier hierarchy (props > clothing > proportions > pose > accessories). The figure must be identifiable from at least 2 tiers.
- If yes: **classify as Personality-Driven (Type 2)**.
- If the person is a domain expert but not visually famous (e.g., a management theorist known for ideas, not appearance): Type 2 does not apply. Proceed to Step 3.

**Step 3 — Default to Lateral (Type 3):**
- Everything else. This is the majority of courses.
- Apply the 8 Lateral Thinking Principles.
- The visual direction must demonstrably use at least 3 of the 8 principles.

**Override rule:** The user may override the classification during Phase 1's HARD gate. If the algorithm classifies as Company-Driven but the user prefers Lateral, the user's choice is final.

**Step 4 — Literal ↔ Lateral dial (v10.19.0):** after the Type is confirmed, present the dial as a second user gate. This exposes the trade-off between "abstract/metaphorical" and "literal/narrative" direction and reduces iteration cycles.

Present via `AskUserQuestion`:

**Question:** "How literal should the visuals be?"

**Options:**
- **Highly Lateral** — Abstract metaphors, visual vocabularies from non-course domains (theatre, cartography, architecture). Strongest for behavioral-science and geopolitical courses where the underlying mechanism is the teaching.
- **Balanced** *(default)* — Mix of literal scenes from the narrative and lateral metaphors where the narrative moment doesn't translate to a recognisable image. Most Rehearsal courses sit here.
- **Highly Literal** — Render actual scenes from the course narrative (a specific stage, a specific control room, a specific dashboard). Graphic-novel adaptation register. Strongest for Literary Journalism with a named protagonist and specific datable events.
- **Brand-Protagonist** — Type 1 Company-Driven OR Type 1 Variant (Protagonist + Cameo Brand Colors). The protagonist company's brand motif recurs across the set; narrative scenes are secondary to brand-visual continuity. Strongest when the course has a dominant company and the visual identity needs to reinforce brand recall per card.

The dial is ORTHOGONAL to the type classification:
- Highly Lateral + Type 3 = pure Lateral metaphor direction.
- Highly Literal + Type 3 = literal graphic-novel adaptation (still Lateral classification because no company dominates, but rendered as specific scenes).
- Brand-Protagonist + Type 1 = base Type 1.
- Brand-Protagonist + Type 1 Variant = Protagonist + Cameo Brand Colors.

The user's dial choice is WRITTEN to `art-direction.md` and drives prompt generation:
- Highly Lateral → prompts describe abstract metaphor with brand-neutral silhouettes.
- Balanced → prompts mix literal props (rotary phone, toll booth) with metaphor devices (cloud, door).
- Highly Literal → prompts describe specific scenes from the course (Cannes podium, NOC room, Peach Bottom control room).
- Brand-Protagonist → prompts foreground the brand motif (cloud silhouette recurring) with narrative scenes as secondary.

**Why this gate exists:** the `founder-agent-readiness` session (2026-04-20) iterated through Lateral → Balanced → Literal → Brand-Protagonist because the dial wasn't exposed. User had to course-correct four times to land the right position. Exposing the dial up-front saves 2-3 iteration cycles per course.

---

## Genre x Visual Type Affinity

This table maps the 8 nonfiction storytelling genres (defined in `generation-guide/genre-system.md`) to the 3 visual types. It replaces the old 5-approach affinity table.

| Genre | Primary Type | Secondary Type | Notes |
|-------|-------------|----------------|-------|
| Literary Journalism | Lateral | Personality-Driven | Story's physical world becomes the metaphor. If a single person anchors the narrative, their silhouette works. |
| Investigative Journalism | Lateral | Company-Driven | Documents, data surfaces, hidden layers — cognitive dissonance with the mundane concealing the explosive. If one institution dominates, borrow its visual language. |
| Industry Epic | Lateral | Company-Driven | Maps, geographies, supply chain diagrams — sweeping scope demands sweeping visual metaphors. If one company dominates the epic, its design language anchors the visual world. |
| Corporate Biography | Company-Driven | Personality-Driven | The company's design language IS the natural visual vocabulary. If the biography is about a founder as much as the company, the silhouette becomes the thread. |
| Geopolitical Analysis | Lateral | Lateral | Maps, institutional architecture, structural diagrams. Almost always Lateral because geopolitical forces are abstract and no single company dominates. |
| Behavioral Science | Lateral | Lateral | The bias or effect made tangible — optical illusions, impossible objects, perception diagrams. Cognitive dissonance is the natural visual language for cognitive science. |
| Legal/Regulatory Thriller | Lateral | Company-Driven | Spectrums, scales, threshold diagrams — the gray zone made visual. If a single company's legal battle drives the narrative, borrow their visual language for dramatic irony. |
| Practitioner Memoir | Lateral | Personality-Driven | The practitioner's domain rendered with elevated editorial treatment. If the practitioner is famous enough for silhouette recognition, that becomes the thread. |

**Reading this table:** Primary Type is the default recommendation. Secondary Type is offered when specific content signals are present (company dominance, famous person). The user chooses during the Phase 1 HARD gate.

---

## Prompt Formats (dual output, format-specific)

Dual output is mandatory: `prompts-nbp.md` (Nano Banana Pro / Gemini) + `prompts-seedream.md` (SeedDream 4.5). Legacy `prompts.md` files use NBP format. Each model has a different optimal prompt format.

### NBP / Gemini: v3 JSON Format (mandatory for prompts-nbp.md)

Gemini processes structured JSON reliably. All NBP prompts must use the nested JSON structure below. The structure ensures every prompt addresses composition, palette, constraints, and mood systematically.

```json
{
  "meta": {
    "quality": "editorial photography, magazine-grade",
    "camera": "35mm lens, shallow depth of field",
    "lighting": "raking light from upper left, warm 3200K",
    "render_style": "flat geometric illustration, hard vector edges"
  },
  "scene": {
    "environment": "the specific space this image lives in",
    "atmosphere": "the emotional temperature (clinical, warm, tense, triumphant)",
    "background": "exact hex + texture description"
  },
  "subject": {
    "primary": "the main object/character/form — what the eye hits first",
    "secondary": "supporting elements that create context",
    "details": "small elements that reward close inspection"
  },
  "composition": {
    "archetype": "centered | rule-of-thirds | golden-spiral | grid | asymmetric",
    "framing": "tight crop | medium | wide | extreme-wide",
    "negative_space": "where emptiness lives and what it communicates"
  },
  "palette": {
    "accent": "#hex — the pop color, what draws the eye",
    "background": "#hex — the field everything sits on",
    "secondary": "#hex — supporting, less saturated",
    "content": "#hex — neutral elements, bars, shapes, silhouettes",
    "failure": "#hex — coral/red, used ONLY for failure states"
  },
  "constraints": [
    "no visible faces",
    "no text except 2-4 uppercase taxonomic labels",
    "no logos or wordmarks",
    "no white-passing backgrounds (R,G,B all > #E0)",
    "labels: taxonomic, uppercase, no metaphors, no numeric data"
  ]
}
```

**NBP format rules:**
- Maximum 2000 characters per prompt (Gemini API truncates longer prompts, causing unpredictable composition loss).
- Every prompt must include the `constraints` array with at minimum the 5 standard constraints listed above. Course-specific constraints are added on top.
- The `palette` object must match the Art Direction Brief stored in `visuals/{slug}/art-direction.md`. Every color must have semantic meaning (see Principle 6: Constraint-Based Palette).
- The `meta.render_style` must be consistent across all prompts in a course. This is the style seed — it creates visual series coherence.

### SeedDream 4.5: Natural Language (mandatory for prompts-seedream.md)

SeedDream 4.5 has strong natural language understanding and performs best with concise, precise prose — NOT structured JSON. Per BytePlus official documentation: "concise and precise prompts is usually better than repeatedly stacking ornate and complex vocabulary."

**SeedDream prompt structure — use this order (subject-first, most important elements first):**
1. **Style** — render style, medium, artistic reference (e.g., "Flat geometric illustration in Saul Bass movie poster style")
2. **Subject** — main object/character/form, what the eye hits first
3. **Setting** — environment, background color (use descriptive color names, not hex codes)
4. **Composition** — framing, spatial relationships, element placement
5. **Constraints** — what to avoid, appended at the end as "No X, no Y"

**SeedDream format rules:**
- **30-100 words** per prompt (sweet spot). Under 15 = generic. Over 150 = conflicting instructions.
- Plain flowing sentences, NOT comma-separated keywords or JSON.
- Lead with the most important element — SeedDream gives priority to concepts mentioned first.
- Use descriptive color names alongside hex codes: "deep midnight blue (#0f0f2e)" not just "#0f0f2e".
- Style seed paragraph prepended to every prompt for series coherence (same as NBP).
- Maximum 2000 characters per prompt.
- Constraints appended as natural language at end: "No gradients, no shadows, no photorealism. Flat shapes only with solid fills and hard edges."

**Aspect ratio rules:**
- Body images: 4:3 landscape (use `--ratio 4:3`).
- Desktop cover: 4:3 landscape (`visual-0-cover.png`).
- Mobile cover: 3:4 portrait (`visual-0-cover-mobile.png`). This is a separate composition optimized for vertical framing, NOT a crop of the desktop cover. Same style seed, accent color, and background — but recomposed for the vertical frame with tighter central element.
- After EVERY image generation, verify aspect ratio with `sips -g pixelWidth -g pixelHeight`. Gemini silently ignores aspect ratio instructions for some prompts and outputs 1024x1024 square. If square, regenerate.

**File naming convention:**
- All body images: `visual-{N}.png` (no descriptive slugs). N starts at 1 for body images.
- Covers: `visual-0-cover.png` (desktop 4:3) + `visual-0-cover-mobile.png` (portrait 3:4).
- Hands-on courses: gaps in numbering indicate screenshot slots (classified during Phase 1 as GENERATED or SCREENSHOT).
- Old format `visual-{N}-{slug}.png` is DEPRECATED.

---

## Prompt Crafting Rules

These rules were extracted from iterative visual generation sessions. They apply to ALL prompt writing — both NBP/Gemini and SeedDream.

### SeedDream Rendering Rules

**SD1: No text you don't want rendered.** SeedDream tries to render any word that sounds visible. "Classified personnel files" → garbled "CLASSIFICRIAL" stamped on cards. Instead say "pinned cards with geometric icons." Avoid words like: classified, confidential, secret, report, document, label, title, sign, poster, banner — unless you WANT that text rendered. If you must reference a document, describe it as "a white rectangle" not "a file." **Also applies to hex codes** — writing "#FF3B30" in a prompt can render as garbled text in the image. Use color names ("vivid hot coral") instead of hex codes in the prompt body. Hex codes belong ONLY in the style seed or art-direction.md palette table, never in scene descriptions.

**SD2: Avoid hands and fingers.** SeedDream produces glitched hands consistently. Use full silhouettes with: arms at sides, back turned to viewer, hands in pockets, or hands not visible. NEVER: "a hand reaching toward," "grips the gear," "one arm extended," "pointing at." If an operative must interact with an object, show them standing NEAR it, not touching it.

**SD3: watermark=False always.** BytePlus adds "AI generated" watermark by default. The `generate_seedream.py` script includes `"watermark": false` in every API call. If calling the API directly, always include this parameter.

**SD4: 5-color semantic palette minimum.** A 4-color monochrome palette (e.g., charcoal/white/gray/indigo) produces flat, lifeless body images even when the cover looks good. Every palette needs at minimum:
- A **warm accent** for glow/hope/opportunity (amber, gold, coral)
- A **cool accent** for structure/authority (navy, indigo, teal)
- A **neutral** for background and secondary elements
- **White** for the protagonist figure
- A **signal color** used sparingly for tension (red, coral — max 1-2 images per course)

**SD5: Character-as-concept must match the art style.** When using Principle 2 (Character-as-Concept), the character MUST be rendered in the SAME visual style as everything else in the image. A Warli folk art course with stick-figure humans requires a stick-figure geometric cobra — NOT a realistic snake. An iPod-era course with flat black silhouettes requires flat geometric shapes — NOT 3D rendered objects. The moment one element looks "more realistic" than the rest, it breaks the visual world. Specify explicitly in every prompt: "drawn in the SAME [style name] style as the human figures — [specific style descriptors]."

### Visual Storytelling Rules

These apply to ALL visual generation regardless of model. They are the difference between images that feel like a spy thriller and images that feel like a textbook.

**VS1: Film stills, not infographics.** Every body image must feel like a frame from a movie, not a slide from a presentation. Test: "Would this work as a movie poster?" If the image needs a caption to be understood, it's an infographic. Infographics explain. Film stills evoke. We want evocation.

**VS2: No explanatory labels.** Labels like VERTICAL, COMPOUND, STAYS, LEAVES, ADJACENT, RARE SKILL, LEVERAGE, AUTONOMY are captions that kill the emotional world. Only real-world proper nouns are acceptable as image text (CIA, KGB, PepsiCo) — and even these should be avoided unless essential. Concepts must be expressed through visual composition, never through labels. A watchtower vs a rooftop city says "rigid vs networked" without any words.

**VS3: The outsider energy test.** If someone completely outside the course's domain looks at the image and feels the metaphor's emotional energy, it works. A plumber should look at a career-capital course's spy images and feel "damn, I feel like a spy." A student should look at a portfolio-management course and feel like a war commander. The visual world must transcend the subject matter.

**VS4: Consistent character across series.** The same silhouette figure (e.g., white trenchcoat operative) must appear throughout all body images. Do NOT swap to an architectural figure, a mannequin, a different character style, or an abstract form mid-series. The character is the reader's avatar — changing it breaks immersion. Define the character in the Art Direction Brief and enforce it in every prompt.

**VS5: Cover energy must propagate.** If the cover creates a specific emotional world (spy thriller, war room, noir detective), every body image must live in that same world. A labeled cycle diagram belongs to a different visual universe than an operative watching a domino chain react. The cover sets the promise — body images must deliver on it. The most common failure mode is: great cover → body images that become progressively more "textbook."

**VS6: Concepts through metaphor within the visual world.** Every course concept must be translated into the visual world's vocabulary, not explained with the course's vocabulary. Examples:
- "Vertical vs compound career" → watchtower with trapped figure vs sprawling rooftop city with leaping figure
- "Retention inversion" → border checkpoint: one figure walks through, another melts into the wall
- "Career capital flywheel" → domino ring with operative at center watching the chain reaction
- "Going native" → figure half-absorbed into a concrete wall, amber door glowing just out of reach
- "Adjacency map" → operative studying a wall map with glowing connected cities and dark disconnected ones

The metaphor must work WITHIN the spy/thriller/noir world — not require the viewer to know the business concept.

**VS7: Contrast compositions need explicit intensity language.** Split/contrast images (before/after, healthy/broken, Zomato/Zerodha) fail when both halves feel similar in energy. The prompt must use EXTREME contrast language: "BLAZING with white light" vs "STARK AND EMPTY," "packed-glowing-alive" vs "empty-dark-silent." Moderate language ("slightly dimmer," "somewhat cracked") produces images where the contrast is invisible. The 2-second test: can a viewer instantly tell which half is good and which is bad without reading any text?

---

## Visual Direction Rules

These rules govern HOW the art direction is conceived and pitched. They were extracted from iterative visual generation sessions where multiple rounds of feedback revealed consistent failure patterns. Apply during Phase 1-2 of the `:visuals` pipeline.

**VD1: Joy and curiosity first.** The user should feel JOY looking at course images — smile and be curious. Covers must make you WANT to open the course. No clinical, cold, or dark-by-default aesthetics unless the course genuinely demands it. Ask: "Would someone scroll past this or stop and tap?"

**VD2: Pop colors mandatory.** Vivid, saturated palettes. No muted/gray/navy-dominant schemes unless the course narrative requires darkness. Every cover should stand out on a Blinkist-style bookshelf of courses. Dull = invisible.

**VD3: Metaphor must connect to domain.** The lateral leap should be in STYLE/TREATMENT, not in SUBJECT. Kathputli puppets for an Apple/attribution course = too far. Supermodel runway for an advertising course = instant. The subject should rhyme with the domain. The treatment should be unexpected.

**VD4: Consistent palette across series.** Do NOT rotate background colors per image (e.g., coral→amber→blue→green). This fragments visual identity instead of building it. Pick ONE bold palette and hold it for all 7 images. Tell the story through figure posture, environment degradation, and composition change — not through color shifts.

**VD5: Story through figures, not through color.** The emotional arc should be visible in the CHARACTER's journey (confident → surprised → investigating → knowing), not through shifting background hues. Body language and environment state carry the narrative.

**VD6: Art direction must be pitchable as a one-sentence story.** If you can't describe the visual arc in one sentence ("supermodels on a runway, then the runway crumbles"), the direction is too abstract. A pitchable narrative means every stakeholder — user, designer, developer — immediately understands the visual concept. Test: tell someone the one-sentence pitch. If they say "oh cool," it works. If they say "what do you mean?", iterate.

**VD7: No style copying between courses.** Each course MUST have a visually distinct identity. Two courses in a row with the same background color + same silhouette style + same composition approach = style copy, not variety. Before writing prompts, check the batch diversity log for the last 2-3 courses' style identities and ensure zero overlap. The test: lay two courses' covers side by side. If someone could confuse which course is which, the second one needs a new direction.

**VD8: Story-moment prompting.** Every body image prompt must reference the SPECIFIC emotional moment from its screen's narrative — not just the concept. The test: read the screen text, then look at the image. Does the image make the text MORE memorable? If the image could work for any screen in the course, it's too generic. Each prompt should encode the screen's most striking sentence as a visual scene. "A split composition with strangled bars" = generic. "The moment 2,500 restaurants walked out on Zomato" = story-moment.

---

## Batch Variety Rules

These rules prevent visual monotony when courses are generated in sequence. Moved from `shared/decision-tables.md` to consolidate all visual governance in one file.

**1. Accent color uniqueness:** No two courses in a batch share the same primary accent color. Check existing courses in `courses/batch-diversity-log.md` Table 2 before selecting. Brand palette reference: Lavender #9677f8, Indigo #4e44fd, Coral #ff4859, Green #00c483, Orange #ff5e00, Teal #00B4D8. Gold #D4AF37 approved for dual-accent tension patterns only.

**2. Cover background diversity:** Must be vibrant and distinct from existing covers. Check `visuals/*/visual-0-cover.png` — if 2+ recent covers are dark (navy, charcoal, deep teal, dark plum), use a light or mid-tone background for this course. Each cover should feel like a different book on a Blinkist-style bookshelf. Alternate between rich darks (navy #1a1a2e, charcoal #2a2a2a, deep teal #0a2a2e, dark plum #2d1b3d) and vibrant colored backgrounds.

**3. No white-passing backgrounds:** BANNED across all images: pure white (#ffffff), cream (#F5F0E8), off-white (#F0F0F0), and ANY hex where R, G, and B values all exceed #E0 (224). The Rehearsal website has a white background — white-passing images blend in and lose their edge. Safe light options: Sand (#E8DCC8), Warm Gray (#D8D4D0), Blush (#E8C8C8), Ice Blue (#C8D8E8), Sage (#C8D8C8).

**4. The Pop Test:** Does the foreground element visually POP against the background? This matters more than warm vs. cool or light vs. dark. Dark backgrounds are fine when foreground is VIVID (lavender on dark navy). BANNED: subtle foreground on dark background (faint lines on navy = no pop). Light backgrounds are fine when foreground has saturated contrast. BANNED: universal brown/sand/nude as default for all courses. Each course picks its own temperature based on domain energy.

**5. Visual type variety:** Track the distribution of Type 1 / Type 2 / Type 3 across the batch. If 5 consecutive courses are all Lateral (Type 3), actively look for Company-Driven or Personality-Driven opportunities in the next course. This is a SOFT guideline, not a hard gate — most courses genuinely are Lateral, and forcing a different type produces worse results than accepting the default.

**6. Style fusion variety:** For Lateral (Type 3) courses, track the two visual traditions used in each course's fusion (Principle 3). No two consecutive courses should use the same tradition pair. The combination of traditions is what gives each course its unique visual identity.

**7. Design taste filter:** No neon glows, no oversaturated accents, no pure black #000000 backgrounds (use off-black #0a0a0a or tinted darks), no generic AI purple/blue gradients. Tinted shadows over neutral gray. Typography variety across covers — rotate font feels (geometric display, condensed technical, rounded friendly, ultralight premium).
