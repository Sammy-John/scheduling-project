# Solva — Product Definition

This document defines what **Solva** is, what it is becoming, and what it is deliberately *not*.

It is a living document and will evolve as the product matures.

---

## Product Summary

Solva is a simple scheduling and invoicing app designed for **solo cleaning businesses in New Zealand**.

It focuses on helping a single operator manage:

- Bookings  
- Clients  
- Services  
- Completed work  
- Invoices and payment tracking  

Solva prioritises clarity, speed, and calm over feature depth or automation.

It is built for daily use — not configuration-heavy setup.

---

## Background

### v1 — Prototype Phase

The initial version of Solva was exploratory.

It helped clarify:
- What complexity emerges quickly
- What features add friction
- What does *not* belong in a solo-first tool

v1 clarified the direction.

---

### v1.1 — Product Definition Phase

v1.1 formalises Solva as:

> A scheduling + invoicing tool for independent cleaners.

This version:

- Narrows to one persona (independent cleaner)
- Introduces lightweight invoicing
- Closes the workflow loop:
  - Schedule → Complete → Invoice → Paid
- Removes experimental UI patterns
- Establishes a stable, maintainable foundation

This version is about getting the **core loop correct**, not expanding features.

---

## Target User

Solva is built for:

- Independent cleaning operators
- Solo service providers
- Owner-operated residential cleaning businesses

Typical characteristics:

- One person running bookings and billing
- 10–25 repeat clients
- Weekly or fortnightly jobs
- Bills monthly or per visit
- Works in low-signal environments
- Runs the business entirely from their phone

Solva assumes no technical background.

---

## Core Problems Solva Solves

Solva helps independent cleaners:

- See upcoming work clearly
- Remember client details and access notes
- Reuse common services without re-entry
- Mark jobs as completed
- Generate invoices quickly
- Track sent and paid invoices
- Reduce mental overhead around both scheduling *and billing*

The value is **clarity and reliability**, not optimisation.

---

## Core Capabilities (v1.1)

### Scheduling

- Create and manage bookings
- Weekly calendar view
- Mark jobs as completed
- Reuse predefined services
- Store client notes and details

### Invoicing

- Generate invoices from completed work
- Apply NZ GST rules (when enabled)
- Set payment terms
- Download or share PDF invoices
- Track invoice status (Draft / Sent / Paid / Overdue)

Each feature must support **daily use**, not edge cases.

---

## What Solva Is Not

Solva intentionally avoids:

- Team or staff scheduling
- Marketplace listings
- Payment processing integrations
- Payroll features
- CRM automation
- Marketing tools
- Growth dashboards
- Enterprise reporting

Solva is a **focused daily tool**, not an operations suite.

---

## Design Principles

Solva is guided by:

### Calm First  
The interface should feel quiet and manageable.

### Opinionated Defaults  
Fewer choices, better outcomes.

### No Silent Failure  
Primary actions must behave predictably and truthfully.

### Local-First Thinking  
Data should feel owned and understandable.

### Modular Growth  
Future expansion layers on without rewriting the core.

---

## Scope Discipline

Solva v1.1 includes scheduling and invoicing because:

Independent cleaners must manage both daily work and billing.

However:

- It does not include payment gateways.
- It does not automate revenue optimisation.
- It does not expand beyond the cleaning persona.

Future modules will only be considered after:

- The scheduling + invoicing loop proves stable.
- First-session friction is eliminated.
- Real usage validates the core model.

---

## Looking Ahead

Future exploration may include:

- Refinement based on real usage
- Improved onboarding
- Data export/import safeguards
- Optional modular add-ons

No commitments are made at this stage.

---

This document exists to keep Solva focused as it evolves.
