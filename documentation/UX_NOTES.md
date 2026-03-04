# Solva --- UX Notes (v1.1 Scheduling + Invoicing)

**Last Updated:** 2026-03-01

This document defines the UX guardrails for Solva v1.1.

It reflects the decision that Solva is a **scheduling + invoicing tool
for independent cleaners**, and ensures implementation aligns with that
commitment.

------------------------------------------------------------------------

## UX Goal

Solva should feel:

-   Calm\
-   Predictable\
-   Lightweight\
-   Trustworthy\
-   Professional

The user should feel in control --- never confused, blocked, or misled.

------------------------------------------------------------------------

# Core UX Philosophy

## 1. Calm Over Density

-   Avoid crowded screens.
-   Prefer whitespace over compact stacking.
-   One primary focus per screen.
-   Reduce visual noise.

If a screen feels busy, it is doing too much.

------------------------------------------------------------------------

## 2. Obvious Over Clever

-   Buttons must look actionable.
-   Labels must match outcomes.
-   No hidden gestures.
-   No "magic" behaviours without explanation.

If something needs instructions, the UI needs simplification.

------------------------------------------------------------------------

## 3. Defaults First

Solva must work with minimal setup.

-   Default services exist.
-   Default durations exist.
-   Default invoice terms exist.
-   Default GST behaviour follows NZ standards.

Customisation is secondary to flow.

------------------------------------------------------------------------

## 4. One Primary Action Per Screen

Every screen must clearly answer:

"What should I do next?"

Examples:

-   Dashboard → Add booking\
-   Clients → Add client\
-   Calendar → Add visit\
-   Invoices → Create invoice

Secondary actions must be visually quieter.

------------------------------------------------------------------------

# Non-Negotiable Guardrails

These rules override aesthetic preference.

## 1. No Silent Failure

Primary CTAs must:

-   Be disabled when invalid
-   Explain what is missing
-   Never silently return without feedback

If a user taps Save, they must know what happened.

------------------------------------------------------------------------

## 2. No Dead-End Empty States

Empty states must:

-   Explain what the page is for
-   Provide a correct next action
-   Never lead to a broken flow

Example:

If there are zero clients, Schedule must prompt: "Add your first client"
--- not "Add visit".

------------------------------------------------------------------------

## 3. No Misleading Primary CTAs

If a button says "Send Invoice", it must send.

If functionality does not exist: - Rename the CTA - Disable clearly - Or
remove entirely

Trust \> feature theatre.

------------------------------------------------------------------------

## 4. First Booking Under 60 Seconds (Real Workspace)

A brand-new user must be able to:

1.  Enter business name
2.  Add one client
3.  Create one booking

In under 60 seconds.

If not, friction exists.

Demo environments do not count.

------------------------------------------------------------------------

## 5. Financial Actions Require Extra Clarity

Invoices represent money.

Therefore:

-   Status must be obvious (Draft / Sent / Paid / Overdue)
-   Defaults must respect business settings
-   Confirmation must be visible
-   Due dates must be predictable

Billing flows must feel serious and reliable.

------------------------------------------------------------------------

# Forms & Data Entry

## Booking Forms

-   Plain language
-   Minimal required fields
-   Autofill where possible
-   Use service defaults for duration/price
-   Clear error messages

Speed \> perfection.

------------------------------------------------------------------------

## Client Forms

-   Free-form notes
-   Only essential fields required
-   Advanced fields optional via Settings

No forced structure in v1.1.

------------------------------------------------------------------------

## Invoice Forms

-   Auto-populate completed jobs
-   Respect payment term defaults
-   Allow simple line editing
-   Clear confirmation after creation

------------------------------------------------------------------------

# Feedback & System State

Actions must provide:

-   Subtle success feedback (e.g., "Booking saved")
-   Specific error feedback
-   Visible state changes

Avoid loud animations or celebratory effects.

Solva is professional, not playful.

------------------------------------------------------------------------

# Mobile-First Rules

-   Thumb-reachable primary actions
-   Floating add buttons preferred
-   Bottom navigation preferred
-   Avoid small tap targets
-   Avoid desktop-pattern carryover

Solva is not desktop-first.

------------------------------------------------------------------------

# What to Avoid

-   Gamification
-   Streaks, badges, or metrics
-   Growth language
-   Aggressive onboarding
-   Over-automation
-   Enterprise-style dashboards

------------------------------------------------------------------------

# UX Evolution

These guardrails apply to v1.1.

Future versions may expand, but must never violate:

-   Calm
-   Clarity
-   Trust
-   Honest actions
-   First-session success

Simplicity is the default decision.

------------------------------------------------------------------------

End of UX Notes.
