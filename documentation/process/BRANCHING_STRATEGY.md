# Solva — Branching Strategy & Change Rules

**Generated:** 2026-03-01  
**Applies To:** v1.1 (Stabilisation Phase)

This document defines how branches are created, named, and merged in Solva.

The goals are to:

- Keep `main` stable
- Prevent feature creep during stabilisation
- Ensure documentation stays aligned with behavior
- Make all changes reviewable and reversible

---

# 1. Branch Types

## main

**Always stable.**  
`main` must reflect the most reliable state of the product.

Rules:
- No direct commits to `main`
- All changes via Pull Request
- PR must meet Definition of Done (Section 6)

---

## release/*

Used only when preparing a release candidate.

Example:
- `release/v1.1.0`

Rules:
- Bug fixes and polish only
- No new features

---

## fix/*

Used for:
- Bug fixes
- Stabilisation work
- UX corrections
- Validation fixes
- Trust improvements

Examples:
- `fix/setup-create-now`
- `fix/schedule-empty-state`
- `fix/invoice-defaults`

Rules:
- Must reference a documented issue
- Must not expand scope beyond fix

---

## feature/*

Used for new capabilities or expanded behavior.

Examples:
- `feature/export-import`
- `feature/recurring-bookings`

Rules:
- Requires Product Decision note (Section 4)
- Must update relevant documentation
- Must not violate UX guardrails

---

## chore/*

Used for maintenance or internal improvements.

Examples:
- `chore/refactor-storage`
- `chore/lint-format`

Rules:
- No user-visible behavior change
- If behavior changes → use `fix/*` or `feature/*`

---

## docs/*

Documentation-only changes.

Examples:
- `docs/update-product-definition`
- `docs/add-ux-guardrails`

Rules:
- No functional code changes
- If behavior changes → not a docs branch

---

# 2. Naming Convention

Format:
- `type/short-description`

Rules:
- Use kebab-case
- Describe one outcome

Good:
- `fix/no-silent-save`
- `feature/manual-batch-invoicing`
- `docs/ux-notes-guardrails`

Bad:
- `update-stuff`
- `feature/many-changes`

---

# 3. Work Size Rule

Each branch must deliver **one primary outcome**.

If you cannot describe the change in one sentence, the branch is too large.

Split large changes into smaller, focused branches.

---

# 4. Product Decision Rule (Feature Work Only)

Any `feature/*` branch must include:

- Clear problem statement
- What is included
- What is explicitly excluded
- Why it avoids bloat

Decision must be documented in:
- PR description (minimum)
- Or `docs/product/DECISIONS.md`

---

# 5. Documentation Update Rule

If behavior changes, at least one of the following must be updated in the same PR:

- PRODUCT.md
- Solva_v1.1_Product_Spec.md
- UX_NOTES.md
- DATA_MODEL.md
- CHANGELOG.md
- ROADMAP.md

If a user would notice the change → docs must change too.

---

# 6. Pull Request Definition of Done

A PR may be merged only when:

- [ ] Branch type matches work
- [ ] Scope is one outcome
- [ ] No console errors introduced
- [ ] UX Guardrails not violated:
  - No silent failure
  - No misleading CTA
  - No dead-end empty state
- [ ] Core loop still works:
  - Client → Booking → Complete → Invoice → PDF
- [ ] Relevant documentation updated
- [ ] CHANGELOG updated (if user-facing)

---

# 7. Stabilisation Policy (v1.1)

While stabilisation issues are open:

Allowed branches:
- `fix/*`
- `docs/*`
- `chore/*` (non-behavioral only)

`feature/*` requires explicit approval and must not break stabilisation objectives.

---

# 8. Merging Strategy

Default: **Squash Merge**

PR title must clearly describe outcome:

Examples:
- Fix schedule empty-state dead-end
- Apply invoice defaults from business settings

---

# 9. Hotfix Policy

If `main` breaks:

1. Create `fix/hotfix-<description>`
2. Implement minimal change
3. Merge via PR
4. Update CHANGELOG if user-facing

---

# 10. Rule Summary

- `main` remains stable
- One outcome per branch
- Fixes before features (during stabilisation)
- Docs change with behavior change
- UX guardrails always enforced

This strategy protects product clarity, trust, and long-term maintainability.
