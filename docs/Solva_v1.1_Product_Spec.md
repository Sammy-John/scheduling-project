# Solva v1.1 – Cleaner Edition  
## Product Specification Document  

---

## Version
v1.1  
Generated: 2026-02-20

---

# 1. Product Overview

## Product Name
Solva – Cleaner Edition (v1.1)

## Version Goal

Deliver a focused, mobile-first scheduling and invoicing tool for independent cleaners in New Zealand.

This version:

- Removes theme selection.
- Locks in Solva brand styling (root.css).
- Narrows to one persona: independent cleaners.
- Adds simple invoicing workflow.
- Closes the loop: Schedule → Complete → Invoice → Paid.

This version intentionally avoids feature expansion beyond the cleaner workflow.

---

# 2. Target Persona

## Primary User

**Name:** Jess  
**Age:** 38  
**Location:** New Zealand  
**Business:** Independent residential cleaner  

### Context:
- Works alone.
- Services 10–25 repeat clients.
- Often weekly or fortnightly cleans.
- Bills monthly or per visit.
- Works in signal-weak environments.
- Runs business entirely from her phone.

### Needs:
- Simple calendar.
- Repeat bookings.
- Access notes.
- Track completed jobs.
- Generate invoices quickly.
- Email invoices to clients.
- Track paid/unpaid.

---

# 3. Core Product Principles

- Mobile-first interface.
- No bloat.
- No marketplace.
- No team features.
- No forced login.
- Clear, human language.
- Opinionated defaults.
- Practical > flashy.

---

# 4. Brand & Theme

## Design System

Use Solva landing page root tokens (root.css):

- Background: `--bg`
- Primary Accent: `--solva-rose`
- Primary Button: `--solva-wine`
- Text: `--solva-pine`
- Panel: `--panel`
- Radius: `--radius`
- Shadows: `--shadow-1`

### Typography
- Headings: Playfair Display
- Body: Lato
- UI consistent with landing page

No theme switcher.
No alternative color schemes.

---

# 5. Product Architecture

## Navigation Structure (Bottom Tab Bar)

1. Calendar
2. Clients
3. Invoices
4. Settings

Mobile-first layout only.

---

# 6. Module Specifications

---

## 6.1 Calendar Module

### Default View
- Weekly view.
- Today highlighted.
- Swipe left/right between weeks.

### Job Card Contains:
- Client name
- Service type
- Time
- Status badge:
  - Scheduled
  - Completed
  - Cancelled

### Actions:
- Tap to open job.
- Mark as Completed.
- Edit job.
- Delete job.

---

### Add Job Flow

Fields:
- Select Client (dropdown)
- Select Service
- Date
- Time
- Duration (auto from service)
- Notes (optional)

Save → appears in calendar.

---

## 6.2 Services (Managed in Settings)

### Default Services (Preloaded)
- Home Clean
- Deep Clean
- End of Tenancy Clean
- Move-In / Move-Out Clean
- One-Off Clean

User can:
- Add Service
- Edit Service
- Set:
  - Default duration
  - Default price
  - Notes

No complex categories.

---

## 6.3 Clients Module

### Client Card Includes:

- Full Name
- Phone
- Email
- Address
- Default Service
- Default Price
- Frequency (Weekly / Fortnightly / Monthly / One-off)
- Notes
- Custom Fields (controlled by checkboxes)

---

### Custom Field Visibility (Checkbox Controlled in Settings)

In Settings → “Client Fields”

User can toggle:

- Access Instructions
- Alarm Code
- Pet Information
- Key Location
- Parking Info
- Gate Code
- Special Requests
- Billing Notes
- Safety Notes
- Equipment Required

Unchecked fields are hidden in client view and add/edit form.

---

## 6.4 Invoices Module

### Invoice Generation Flow

Generate invoice from:

- Client profile
OR
- Invoices tab → “Create Invoice”

---

### Invoice Creation Fields:

- Select Client
- Select Date Range
- Auto-populate completed jobs in range
- Auto-calculate total
- Editable line items
- Add custom line item
- GST toggle (NZ-based)
- Add notes
- Due date

---

### Invoice Output

- PDF Preview Screen
- Download PDF
- Email Invoice

---

### Email Flow

User taps:
“Send Invoice”

Opens:
- Editable email subject
- Editable message body
- Attach PDF
- Send

Simulated in prototype.

---

### Invoice Status

- Draft
- Sent
- Paid
- Overdue

User can:
- Mark as Paid
- Record payment date

No Stripe integration in v1.1.

---

## 6.5 Settings Module

### Business Profile
- Business Name
- Contact Email
- Phone
- NZBN (optional)
- GST Registered toggle
- Logo upload

---

### Services
Manage services.

---

### Client Fields
Checkbox visibility controls.

---

### Invoice Defaults
- Payment terms (e.g. 7 days / 14 days)
- Default email footer
- Bank details (for NZ transfer)

---

# 7. User Flow Summary

Primary Workflow:

1. Add client.
2. Add service.
3. Schedule jobs.
4. Complete jobs.
5. Generate invoice for month.
6. Email invoice.
7. Mark paid.

---

# 8. What v1.1 Does NOT Include

- Payment processing
- Client booking portal
- Marketplace listing
- Team management
- Reporting dashboard
- Advanced analytics
- AI features
- Multi-theme
- Public booking link

---

# 9. Success Criteria for Prototype

Prototype must demonstrate:

- Full navigation working.
- Client creation.
- Service creation.
- Job scheduling.
- Mark completed.
- Invoice generation.
- PDF preview.
- Email invoice screen.
- Status change to paid.

---

# 10. Strategic Positioning

Solva v1.1 should be positioned as:

“Simple scheduling and invoicing for independent cleaners in New Zealand.”

Clear. Focused. Purpose-built.
