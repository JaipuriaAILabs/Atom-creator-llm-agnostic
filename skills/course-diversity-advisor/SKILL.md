---
name: course-diversity-advisor
description: Course diversity and gap analysis for Rehearsal catalog. Use when planning new courses, asking 'what topics are missing?', 'what genres are underrepresented?', 'suggest next course', 'what should we build next?', or reviewing the course catalog for coverage gaps.
allowed-tools: Read, Grep, Glob
---

# Course Diversity Advisor

Analyzes the Rehearsal course catalog for diversity gaps across genres, roles, industries, and creative decisions.

## Primary Data Source

Read `courses/batch-diversity-log.md` — auto-maintained by the atom-creator pipeline with 3 tables:
- **Table 1: Creative Decisions** — genre, framing, visual approach, lateral concept per course
- **Table 2: Description Taxonomy** — opener type, stickiness pattern per course
- **Table 3: Visual & Game Assets** — visual type, game mechanic, tool subtype per course

## Analysis Dimensions

### 1. Genre Distribution
8 available genres: Literary Journalism, Investigative Journalism, Industry Epic, Corporate Biography, Geopolitical Analysis, Behavioral Science, Legal/Regulatory Thriller, Practitioner Memoir.

Flag: any genre with 0 courses, or any genre with >30% of catalog.

### 2. Role Coverage
Check which professional roles are represented. Flag gaps in:
- C-suite/leadership roles
- Mid-level management roles
- Individual contributor/specialist roles
- Cross-functional roles

### 3. Industry Spread
Check sector diversity. Flag over-concentration in:
- Tech/IT (common over-representation)
- FMCG (project origin bias)
- Finance/banking

Suggest: healthcare, manufacturing, education, agriculture, government, media

### 4. Level Distribution
Check Junior / Mid-level / Senior balance. Flag if >50% at one level.

### 5. Archetype Balance
Check Concept Sprint vs Hands-On Guide ratio. Neither should exceed 80%.

### 6. Creative Decision Variety
From Table 1, check for repetition in:
- Lateral concepts (are metaphors reusing the same domains?)
- Visual approaches (Company-Driven vs Personality-Driven vs Lateral)
- Game mechanics (are we repeating the same game types?)

## Output Format

```
## Catalog Diversity Report

### Coverage Summary
- Total courses: X
- Concept Sprint: Y | Hands-On: Z
- Genres covered: N/8

### Gaps Identified
1. **Genre gap**: No Geopolitical Analysis courses yet
2. **Role gap**: No healthcare roles represented
3. **Industry gap**: 40% tech concentration

### Suggested Next Courses (3 recommendations)
1. [Role] / [Industry] / [Genre] — rationale
2. [Role] / [Industry] / [Genre] — rationale
3. [Role] / [Industry] / [Genre] — rationale
```
