# Pull Request

## Summary
<!-- What does this PR change? Keep it one outcome. -->

## Linked Issue(s)
<!-- Link issues like: Closes #123 -->
- Closes #

## Type of Change
<!-- Check one -->
- [ ] fix (stabilisation / bug fix)
- [ ] feature (new capability)
- [ ] chore (refactor / tooling, no behavior change)
- [ ] docs (documentation only)
- [ ] hotfix (urgent main break)

## Scope (One Outcome Rule)
<!-- If you can’t describe it in one sentence, split it. -->
**One-sentence outcome:**

## What Changed
<!-- Bullet the key changes -->
- 
- 

## UX Guardrails (Merge Gate)
- [ ] No silent failure (invalid CTAs disabled + inline guidance)
- [ ] No dead-end empty states (CTAs lead to valid next step)
- [ ] No misleading CTAs (labels match actual behavior)
- [ ] Calm + predictable UI (no new clutter / no bloat)

## Core Loop Verification (Required)
<!-- Manual verification. Tick all that apply. -->
- [ ] Create client
- [ ] Create booking
- [ ] Mark booking completed
- [ ] Create invoice from completed work
- [ ] Generate PDF (download/share)
- [ ] Mark invoice paid (if applicable)
- [ ] No console errors during flow

## First-Session Check (Stabilisation Phase)
- [ ] Fresh workspace can reach usable app state quickly
- [ ] First booking is achievable without dead ends
- [ ] Setup flow does not block entry

## Data / Defaults (If Touched)
- [ ] Invoice defaults respect business settings (terms, footer, GST)
- [ ] No hardcoded values override configuration
- [ ] Data model updates reflected in DATA_MODEL.md (if applicable)

## Documentation Updates (If Behavior Changed)
<!-- Tick all updated as required -->
- [ ] PRODUCT.md
- [ ] Solva_v1.1_Product_Spec.md
- [ ] UX_NOTES.md
- [ ] DATA_MODEL.md
- [ ] CHANGELOG.md
- [ ] ROADMAP.md
- [ ] Not applicable (no behavior change)

## Screenshots / Recordings (If UI Change)
<!-- Add before/after screenshots or short GIF -->
- [ ] Included
- [ ] Not applicable

## Risk & Rollback
**Risk level:**  
- [ ] Low
- [ ] Medium
- [ ] High

**Rollback plan (1–2 lines):**
<!-- How to revert if needed -->

## Notes
<!-- Any additional context for reviewers -->
