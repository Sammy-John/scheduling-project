
# Solva — Next Iteration Plan

**Iteration Goal:** Stabilise the core workflow, refine product positioning, and prepare the product for wider niche adoption.

This iteration focuses on completing the core operational loop:

Client → Booking → Completion → Invoice → PDF

---

# 1. Landing Page Refinement

Goal: Position Solva as a **generic tool for solo service providers**, not tied to a single niche.

## Tasks

- Remove niche-specific references (e.g. cleaning).
- Replace with neutral service examples:
  - Consultation
  - Session
  - Appointment
  - Service Visit
- Rewrite hero copy to emphasize:
  - Solo operators
  - Mobile-first workflow
  - Offline reliability
- Ensure screenshots and examples are niche-neutral.
- Update CTA language to emphasize simplicity and control.
- Review feature descriptions so they apply across industries.

Example change:

Before:
> Manage your cleaning bookings and client notes

After:
> Manage bookings and client notes for your solo service business.

---

# 2. “What’s Next” Roadmap Section

Add a public roadmap section to the landing page to signal active development.

## Current Version

**v1.1 Prototype**

Features:
- Mobile-first scheduling
- Client records and notes
- Configurable services
- Lightweight invoice generation
- Offline-first architecture

---

## Next Iteration (Stabilisation)

Focus: improving reliability and reducing friction.

Planned improvements:

- Faster setup with instant start option
- Optional onboarding steps
- Stronger validation across forms
- Improved mobile navigation
- Manual invoice workflow
- Clear action feedback
- Data transparency around local storage

---

## Future Direction

Longer-term roadmap ideas:

- Public booking links
- SMS reminders
- Earnings tracking
- Client history insights
- Branded receipts and invoices
- Simple deposit/payment support

---

# 3. Stabilisation Sprint Tasks

## Setup Flow

- Add **Create Now** shortcut in setup wizard.
- Make onboarding steps optional.
- Auto-create default services.

## Scheduling Flow

- Fix empty schedule state when no clients exist.
- Add prerequisite checks before booking creation.
- Guard Add Job modal when required data is missing.

## Form UX

- Disable invalid CTAs when required fields missing.
- Add inline validation feedback.
- Prevent silent form failures.

## Mobile UX

- Add Floating Action Buttons (FAB) to key screens:
  - Calendar
  - Clients
  - Invoices
- Remove top-right add buttons.
- Improve thumb reach targets.

## Trust & Transparency

- Add data ownership notice in Settings.
- Explain local storage behaviour clearly.

---

# 4. Product Positioning Improvements

Strengthen differentiation from marketplace scheduling tools.

## Messaging Tasks

- Replace generic "booking tool" phrasing with:

> A lightweight business system for solo service providers.

- Add comparison positioning:

> Unlike marketplace booking apps, Solva keeps your clients and data entirely yours.

## Positioning Bullets

- Built for solo operators
- Works even when signal doesn’t
- No marketplace commissions

---

# 5. Feedback & Research Tasks

Use feedback to guide future features.

Tasks:

- Review feedback responses weekly.
- Extract:
  - Feature requests
  - User language patterns
  - Friction points
- Document insights in:

/docs/research/user-feedback.md

---

# 6. Documentation Improvements

## CHANGELOG.md

Add new iteration entry:

v1.2
- Faster setup flow
- Validation improvements
- Floating action buttons
- Invoice workflow improvements

## PRODUCT_POSITIONING.md

Define:

- Target users
- Problem Solva solves
- Competitive differentiation
- Product philosophy

---

# 7. Marketing Readiness

Prepare assets for promotion and testing.

Tasks:

- Create Twitter/X preview image.
- Add Open Graph meta tags to landing page.
- Produce short demo GIF or clip.
- Write one product explainer article.

Possible topics:

- Why Solva is mobile-first
- Why offline tools matter
- Why solo operators need simpler systems

---

# Iteration Completion Definition

This iteration is complete when:

## Product

- Setup friction removed
- Scheduling flow stable
- Invoice workflow predictable

## UX

- No dead-end states
- Mobile navigation improved

## Positioning

- Landing page niche-neutral
- Public roadmap visible
- Messaging aligned with solo service providers
