---
name: research-verifier
description: Verify factual claims from Perplexity or other LLM sources against primary sources. Use when research contains specific numbers, dates, or attributions that need verification, or when user says 'verify this', 'check these facts', 'is this accurate?', or 'cross-check the research'.
allowed-tools: Read, Grep, Glob, WebFetch
---

# Research Verifier

Implements the dual-track Perplexity verification protocol as a model-invoked skill. Verifies factual claims against primary sources using web_fetch.

## Full Protocol

See `shared/verification-protocol.md` for the complete protocol documentation.

## Quick Reference

### What to Verify
- Specific numbers, percentages, financial figures
- Specific dates or durations
- Attribution to a named person (who did what)
- Causal claims ("X led to Y")
- Biographical claims (job titles, career sequences)
- Comparison directions ("X is better/worse than Y")

### What NOT to Verify
- General industry knowledge
- Framework definitions
- Historical facts with 10+ sources
- Academic theory citations

### Verification Steps
1. Read the claims from course MD, spec, or Research Registry
2. For each claim: `WebFetch` the source URL with the claim as `search_objective`
3. Compare claim vs raw source text
4. Classify: VERIFIED / PLAUSIBLE / HIGH RISK / REMOVED

### Known Failure Patterns
- **Attribution swap**: Verify THIS person did THIS action (not a more famous colleague)
- **Citation merging**: Each stat must trace to its own named source
- **Ghost publications**: Named organization publications must actually exist
- **Direction inversion**: Verify the DIRECTION of comparisons, not just existence
- **Financial conflation**: Revenue ≠ profit ≠ valuation ≠ GMV

### Output Format

For each claim checked:
```
R{N}: "{claim text}"
Source: {URL}
Source says: "{extracted passage, first 200 chars}"
Verdict: VERIFIED / PLAUSIBLE / HIGH RISK / REMOVED
Notes: {any discrepancy or precision difference}
```

## When Claude Should Auto-Invoke This Skill

Claude should auto-activate this skill when:
- A Perplexity search returns specific statistics that will enter a course
- User pastes research output and asks if it's accurate
- During `:plan` Phase 1.5 verification pass
- When reviewing a course and spotting claims that seem too precise or too convenient
