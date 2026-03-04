# Solva — Pre-Production Stabilisation Issues

**Generated:** 2026-03-01  
**Scope:** Scheduling + Invoicing Stabilisation  
**Type:** Production-Blocking Issues  

Each section below can be copied directly into GitHub as individual Issues.

---

# 🟢 SETUP FLOW

## Issue 1: Add “Create Now” Shortcut in Setup Wizard

**Type:** Enhancement  
**Priority:** High  
**Area:** Setup Flow  

### Description
Users must currently complete multiple setup steps before accessing the app. Add a “Create Now” CTA immediately after Business Name input to allow instant entry using safe defaults.

### Acceptance Criteria
- BusinessProfile created
- Default services created
- Settings initialized
- Data persisted to localStorage
- Redirect to Dashboard
- No null reference errors

---

## Issue 2: Make Remaining Setup Steps Optional

**Type:** UX Refactor  
**Priority:** High  

### Description
Convert setup wizard into optional or collapsible sections. No required step should block entry.

### Acceptance Criteria
- Dashboard reachable in < 15 seconds
- No mandatory multi-step flow
- Safe defaults applied

---

# 🟢 SCHEDULE FLOW

## Issue 3: Fix Schedule Empty-State Dead End

**Type:** Bug  
**Priority:** Critical  

### Description
If no clients exist, Schedule should prompt “Add your first client” instead of “Add Visit”.

### Acceptance Criteria
- Conditional check for clients.length === 0
- Correct CTA shown
- CTA opens Client creation modal

---

## Issue 4: Guard AddJobModal When Prerequisites Missing

**Type:** UX Bug  
**Priority:** Critical  

### Description
AddJobModal should block Save if clients or services do not exist.

### Acceptance Criteria
- Save disabled when invalid
- Inline guidance shown
- One-tap create options provided

---

# 🟢 VALIDATION & FEEDBACK

## Issue 5: Disable Invalid Primary CTAs Across Forms

**Type:** UX Enforcement  
**Priority:** High  

### Description
Prevent silent failures by disabling Save buttons when required fields missing.

### Acceptance Criteria
- Validation state tracked
- Primary button disabled when invalid
- Inline helper text visible

---

## Issue 6: Implement Global Toast Feedback System

**Type:** Enhancement  
**Priority:** Medium  

### Description
Add lightweight toast component for action confirmations.

### Acceptance Criteria
- Toast utility created
- Trigger on:
  - Booking saved
  - Client added
  - Invoice created
  - Invoice marked paid
- Auto-dismiss after 2–3 seconds

---

# 🟢 INVOICE MODEL

## Issue 7: Remove Auto-Invoice Creation on Job Completion

**Type:** Refactor  
**Priority:** Critical  

### Description
Adopt manual batch invoicing as the single invoice creation model.

### Acceptance Criteria
- markJobStatus no longer auto-generates invoice
- No silent invoice creation
- UI reflects manual invoice flow only

---

## Issue 8: Prevent Duplicate Job Inclusion in Invoice Creation

**Type:** Bug  
**Priority:** High  

### Description
Ensure completed jobs cannot be invoiced multiple times.

### Acceptance Criteria
- Add `invoiced: false` flag to Booking entity
- Update DATA_MODEL.md
- Mark booking as invoiced after inclusion
- Duplicate prevention enforced

---

# 🟢 MISLEADING CTAS

## Issue 9: Replace “Send Invoice” With Truthful Action

**Type:** Trust Fix  
**Priority:** Critical  

### Description
Remove misleading “Send Invoice” CTA if sending not implemented.

### Acceptance Criteria
- Replace with “Download PDF” or “Share PDF”
- Remove placeholder messaging
- No primary CTA performs a fake action

---

# 🟢 DEFAULT CORRECTNESS

## Issue 10: Apply Business Defaults to Invoice Generation

**Type:** Bug  
**Priority:** High  

### Description
Remove hardcoded invoice defaults.

### Acceptance Criteria
- Due date = today + business.paymentTermsDays
- Notes = business.defaultEmailFooter
- GST applied based on toggle
- Currency formatting respects businessProfile.currency

---

# 🟢 MOBILE UX

## Issue 11: Add Floating Action Buttons (FAB) to Core Screens

**Type:** UX Improvement  
**Priority:** Medium  

### Description
Improve thumb reach by adding bottom-right floating add button.

### Acceptance Criteria
- FAB added to:
  - Calendar
  - Clients
  - Invoices
- Remove top-right add buttons
- Minimum 48px tap area

---

# 🟢 TRUST SAFEGUARDS

## Issue 12: Add Data Ownership Notice in Settings

**Type:** Transparency  
**Priority:** Medium  

### Description
Clarify local-first storage behaviour.

### Acceptance Criteria
- Display “Data stored locally on this device.”
- Tooltip explaining device loss risk

---

# 🟢 FINAL VERIFICATION

## Issue 13: Run Stabilisation QA Pass

**Type:** QA  
**Priority:** Critical  

### Description
Manual verification before production.

### Acceptance Criteria
- Fresh install test passes
- First booking < 60 seconds
- Full workflow: Client → Booking → Completed → Invoice → PDF
- No silent failures
- No misleading CTAs
- No console errors
- No broken state transitions

---

# Completion Definition

Stabilisation is complete when:

- All Critical issues resolved
- No UX guardrail violations remain
- Scheduling + invoicing loop is predictable and calm
