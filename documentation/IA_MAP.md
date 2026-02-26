# Solva — IA Map (Information Architecture)

This document maps Solva’s current structure across:
- the public landing site (`/site`)
- the v1.1 application (`/app`)

It is intentionally simple and will evolve as the product matures.

---

## IA Overview

Solva has two distinct experiences:

1. **Public Site (Marketing)**
   - Explains the product
   - Links to the archived v1 prototype and the current v1.1 build

2. **Application (Product)**
   - The working scheduling tool
   - Focused on daily workflows for solo cleaning businesses

---

## Public Site IA (`/site`)

### Pages
- `/site/index.html`
  - Product overview
  - What it does
  - Preview links:
    - Archived prototype (v1)
    - Current build (v1.1)

- `/site/form.html`
  - Feedback capture / lightweight form page

### Primary CTAs (Outbound Links)
- **View archived v1** (reference/demo)
- **Open v1.1 app** (active product)

---

## Application IA (`/app`)

### Core Navigation (v1.1)
Primary nav items (top nav or sidebar):
1. Dashboard
2. Bookings
3. Clients
4. Services
5. Settings

---

## Application Page Map

### 1) Dashboard
**Purpose:** Daily overview (what’s next / what’s today)

- Path: `/app/pages/dashboard.html` (or `index.html` if Dashboard is home)
- Core content:
  - Today’s bookings
  - Upcoming bookings (next 7 days)
  - Quick actions: “Add booking”, “Add client”

**Touches data:**
- `Bookings`
- `Clients` (for displayName)
- `Services` (for service name)

---

### 2) Bookings
**Purpose:** Create and manage scheduled work

- Path: `/app/pages/bookings.html`
- Core content:
  - Booking list (filter by status: scheduled/completed/cancelled)
  - Booking detail (basic)
  - Create/Edit booking form

**Create/Edit fields (v1.1):**
- Client (select)
- Service (select)
- Date + time
- Duration (default from service/settings)
- Notes
- Status

**Touches data:**
- `Bookings` (primary)
- `Clients` (selection + display)
- `Services` (selection + defaults)
- `Settings` (default duration)

---

### 3) Clients
**Purpose:** Store client details + notes

- Path: `/app/pages/clients.html`
- Core content:
  - Client list
  - Add/Edit client form
  - Client notes (single text field for now)

**Touches data:**
- `Clients` (primary)
- `Bookings` (optional later: show upcoming bookings per client)

---

### 4) Services
**Purpose:** Reusable service templates (cleaning-first)

- Path: `/app/pages/services.html`
- Core content:
  - Service list
  - Add/Edit service form
  - Defaults: duration + price estimate

**Touches data:**
- `Services` (primary)
- `Bookings` (uses service defaults when creating)

---

### 5) Settings
**Purpose:** Defaults and working hours

- Path: `/app/pages/settings.html`
- Core content:
  - Business profile (optional section if included in v1.1)
  - Working hours
  - Default booking duration
  - Week start day

**Touches data:**
- `Settings` (primary)
- `BusinessProfile` (optional if shown/edited here)

---

## Entry Points

### Public entry
- `/site/index.html` → open v1.1 app

### App entry
- `/app/pages/index.html` (recommended as Dashboard home)

---

## Future IA Considerations (Deferred)

These are intentionally not part of v1.1 IA:

- Recurring bookings
- Reminders/notifications
- Earnings/reporting
- Data export/import UI
- Niche modules beyond cleaning

---

## Notes

- v1.1 should remain a small, predictable IA.
- New pages should only be added when they reduce friction (not to expand surface area).
