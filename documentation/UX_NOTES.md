# Solva — UX Notes

This document captures UX principles and decisions for Solva.

It exists to guide implementation during v1.1 and prevent unnecessary complexity as the product evolves.

---

## UX Goal

Solva should feel:
- Calm
- Predictable
- Lightweight
- Easy to return to daily

The user should never feel rushed, overwhelmed, or “managed” by the app.

---

## Core UX Philosophy

### 1. Calm Over Density
Solva prioritises whitespace, clarity, and legibility over information density.

- Avoid cluttered screens
- Prefer fewer visible actions at once
- Let the interface breathe

If a screen feels busy, it’s probably doing too much.

---

### 2. Obvious Over Clever
Interactions should feel obvious without explanation.

- Buttons should look clickable
- Forms should read top-to-bottom
- No hidden gestures or magic behaviour

If something needs instructions, the UI likely needs simplifying.

---

### 3. Defaults First
Most users should be able to use Solva without configuring anything.

- Services provide default durations
- Settings provide sensible working hours
- Booking creation should “just work” with minimal input

Customisation is secondary to flow.

---

### 4. One Primary Action Per Screen
Each screen should have one clear “next step”.

Examples:
- Dashboard → “Add booking”
- Clients → “Add client”
- Services → “Add service”

Secondary actions should be visually quieter.

---

## Navigation

- Navigation should be flat and predictable
- Avoid deep nesting
- Primary sections are always visible

Preferred order:
1. Dashboard
2. Bookings
3. Clients
4. Services
5. Settings

---

## Forms & Data Entry

### Booking Forms
- Use plain language
- Minimise required fields
- Autofill where possible
- Avoid modal overload

The goal is fast entry, not perfect data.

---

### Client Notes
- Free-form text
- No forced structure
- One notes field is enough for v1.1

Structure can come later if needed.

---

## Feedback & State

- Actions should provide quiet confirmation
- Avoid loud success messages
- Errors should be human-readable and specific

Examples:
- “Booking saved”
- “End time must be after start time”

---

## Empty States

Empty states should:
- Explain what the page is for
- Suggest the next action
- Avoid humour or fluff

Example:
> “No bookings yet. Add your first booking to get started.”

---

## Visual Style Notes

- Neutral, calm colour palette
- High contrast for text
- Avoid decorative elements that don’t support function
- Icons only when they add clarity

Solva should feel professional, not playful.

---

## What to Avoid

- Gamification
- Badges, streaks, or scores
- Aggressive onboarding
- Excessive animations
- Dark patterns or urgency language

---

## UX Evolution

These notes define **v1.1 UX expectations**.

They will evolve based on:
- Real usage
- Observed friction
- Feature maturity

Until then, simplicity is the default decision.

---
