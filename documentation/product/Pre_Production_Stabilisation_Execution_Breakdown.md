# Solva — Pre-Production Stabilisation
## Execution Breakdown (Dev Task Mapping)

**Version:** v1.1  
**Generated:** 2026-03-01  
**Purpose:** Eliminate trust-breaking UX friction before feature expansion.

---

## Sprint Objective

Stabilise Solva’s core **scheduling + invoicing loop** before any new features are added.

This sprint focuses on:

- Trust
- First-session success
- Invoice model clarity
- UX correctness
- Mobile usability discipline

No feature expansion is allowed during this phase.

---

# 1️⃣ Setup Flow Refactor

## Objective
Reduce first-session friction and allow instant entry.

---

## 1.1 Add “Create Now” Shortcut

**Area:** SetupWizard  
**Files Likely Affected:**
- `/app/pages/setup.html`
- `/app/js/setup.js`
- `AppContext` (business initialization logic)

### Tasks

- [ ] Add primary CTA after Business Name input.
- [ ] On click:
  - [ ] Create BusinessProfile
  - [ ] Create default Services
  - [ ] Initialize Settings
  - [ ] Persist to localStorage
  - [ ] Redirect to Dashboard
- [ ] Ensure safe defaults exist before app loads.
- [ ] Confirm no null access in Services / Clients / Invoices.

---

## 1.2 Make Remaining Setup Steps Optional

- [ ] Convert wizard steps into skippable or collapsible sections.
- [ ] Ensure no required step blocks entry.
- [ ] Target: Reach dashboard in < 15 seconds.

---

# 2️⃣ Schedule Empty-State Correction

## Objective
Eliminate dead-end flow when no clients exist.

---

## 2.1 Empty State Logic

**Area:** Calendar / Schedule  
**Files:**
- `/app/pages/calendar.html`
- `/app/js/calendar.js`

### Tasks

- [ ] If `clients.length === 0`, replace CTA with:
  - “Add your first client”
- [ ] Link CTA directly to Client creation modal.

---

## 2.2 AddJobModal Guard

- [ ] Block rendering of Save when clients/services missing.
- [ ] Show inline blocking state.
- [ ] Provide one-tap actions to create client/service.
- [ ] Disable Save button clearly.

---

# 3️⃣ Validation + Feedback System

## Objective
Remove silent failures and increase confidence.

---

## 3.1 Disable Invalid CTAs

**Areas:**
- AddJobModal
- ClientFormModal
- CreateInvoiceModal
- ServiceForm

### Tasks

- [ ] Track validation state.
- [ ] Disable primary button when invalid.
- [ ] Add inline helper text for missing fields.

---

## 3.2 Add Success Feedback

**New File Suggested:**
- `/app/js/ui/toast.js`

### Tasks

- [ ] Implement lightweight toast component.
- [ ] Trigger on:
  - Booking saved
  - Client added
  - Invoice created
  - Invoice marked paid
- [ ] Auto-dismiss after 2–3 seconds.
- [ ] Keep visual tone subtle.

---

# 4️⃣ Invoice Mental Model Lock (Manual Batch Model)

## Decision
Manual batch invoicing is the single source of truth.

---

## 4.1 Remove Auto-Invoice Creation

**Area:** `markJobStatus(..., "completed")`

- [ ] Remove automatic invoice creation logic.
- [ ] Ensure job completion does not generate invoice silently.
- [ ] Add optional “Add to invoice” UI action if needed.

---

## 4.2 Invoice Creation Source of Truth

**Area:** CreateInvoiceModal

- [ ] Pull completed jobs by:
  - clientId
  - date range
- [ ] Prevent duplicate job inclusion.
- [ ] Mark jobs as invoiced when added.

### Data Model Adjustment

Add to Booking entity:

```json
"invoiced": false
```

Update `DATA_MODEL.md` accordingly.

---

# 5️⃣ Remove Misleading CTAs

## Objective
Every button must perform exactly as labelled.

---

## 5.1 Replace “Send Invoice”

- [ ] Rename to “Download PDF” or “Share PDF”.
- [ ] Remove placeholder “Email Sending Coming Soon”.
- [ ] If future feature retained, disable clearly.

---

# 6️⃣ Invoice Default Correctness

## Objective
Eliminate hardcoded values.

---

- [ ] Due date = today + `business.paymentTermsDays`
- [ ] Notes = `business.defaultEmailFooter`
- [ ] GST applied only if GST toggle true
- [ ] Currency formatting uses `businessProfile.currency`

---

# 7️⃣ Thumb Reach Optimisation

## Objective
Enforce mobile-first usability.

---

- [ ] Add bottom-right Floating Action Button (FAB) to:
  - Calendar
  - Clients
  - Invoices
- [ ] Remove top-right primary add buttons.
- [ ] Ensure 48px minimum tap area.

---

# 8️⃣ Trust Safeguards

---

## 8.1 Data Ownership Notice

**Area:** Settings

- [ ] Add text:
  “Data is stored locally on this device.”
- [ ] Add tooltip:
  “If you lose your device, data cannot be recovered.”

---

# 9️⃣ Enforcement Verification Pass

## Manual QA Checklist

- [ ] Fresh install test
- [ ] Business name → Dashboard in < 15s
- [ ] Add client → Booking → Completed → Invoice → PDF
- [ ] No silent button failures
- [ ] No misleading CTAs
- [ ] No console errors
- [ ] No broken state transitions

---

# Post-Stabilisation Rule

No new feature may:

- Increase first-session friction
- Introduce a second invoice model
- Add hidden state
- Introduce desktop-first layouts
- Violate UX guardrails

---

## Strategic Outcome

After this stabilisation phase, Solva becomes:

- Predictable
- Calm
- Trustworthy
- Professional
- Production credible

This phase transforms Solva from a working prototype into a reliable product foundation.
