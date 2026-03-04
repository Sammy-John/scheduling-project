# Solva UX Friction Audit --- v1.1

**Date:** 2026-03-01\
**Version:** v1.1 Prototype\
**Reviewer:** Internal Product Audit

------------------------------------------------------------------------

## Executive Summary

This audit evaluates UX friction in Solva v1.1 with a focus on:

-   Mobile-first usability
-   Solo-operator clarity
-   Trust and professionalism
-   First-session success
-   Alignment with calm, no-bloat principles

**Key Findings:**

-   5 high-severity friction issues identified
-   First-session failure risk exists
-   Invoice model inconsistency creates mental confusion
-   Validation gaps damage trust
-   Misleading CTAs reduce credibility

This document is production-focused and identifies blockers that should
be resolved before expansion.

------------------------------------------------------------------------

# SECTION A --- Top 5 UX Friction Issues

------------------------------------------------------------------------

## 1) "60-second setup" is blocked by a forced 6-step wizard

**Where it occurs:**\
Entry → Set up Business → SetupWizard (Step 1--6)

**Why it creates friction:**\
Even minimal users must tap through six steps before using the app. This
increases tap depth and perceived complexity at the highest-friction
moment.

**Severity:** High

**Recommendation:**\
- Add a "Create now" CTA after Business Name entry. - Convert Steps 2--5
into optional customization sections. - Allow Skip per step. - Use safe
defaults and allow editing later.

**Impacts:** Clarity, Empowerment, Flow, Perceived professionalism

------------------------------------------------------------------------

## 2) Schedule empty-state leads to a dead-end when no clients exist

**Where it occurs:**\
Schedule empty state → "Add Visit" → AddJobModal

**Why it creates friction:**\
New workspaces have zero clients. AddJob requires clientId/serviceId and
silently fails when missing. This creates confusion and breaks trust.

**Severity:** High

**Recommendation:**\
- Replace empty state with "Add your first client" when no clients
exist. - Add inline blocking state in AddJobModal with 1-tap actions. -
Disable Save when invalid with clear microcopy.

**Impacts:** Clarity, Trust, Flow, Emotional confidence

------------------------------------------------------------------------

## 3) Invoice generation model is conceptually inconsistent

**Where it occurs:**\
Auto-created invoice on job completion vs manual invoice creation flow.

**Why it creates friction:**\
Two mental models compete: - Auto-invoice per job - Manual invoice
generation

Defaults (7-day due date, blank notes) ignore business settings and
reduce trust.

**Severity:** High

**Recommendation:**\
Choose one primary model:

**Option A:** Auto-create per completed visit\
- Show confirmation toast\
- Apply business defaults\
- Add job date to description

**Option B:** Manual batch invoicing\
- Remove auto-invoice creation\
- Add "Add to invoice" flow

**Impacts:** Clarity, Trust, Empowerment

------------------------------------------------------------------------

## 4) "Send Invoice" CTA does not perform the stated action

**Where it occurs:**\
Invoice Detail → "Send Invoice" → "Email Sending Coming Soon"

**Why it creates friction:**\
A financial CTA that does not send reduces credibility and
professionalism.

**Severity:** High

**Recommendation:**\
- Rename to "Share PDF" / "Download PDF" until email sending exists. -
Hide or disable future features clearly. - Implement device share sheet
if available.

**Impacts:** Trust, Professionalism, Emotional confidence

------------------------------------------------------------------------

## 5) Silent validation failures create "Did it save?" anxiety

**Where it occurs:**\
AddJobModal, ClientFormModal, CreateInvoiceModal, Service forms

**Why it creates friction:**\
Primary CTAs appear actionable but silently fail when required data is
missing.

**Severity:** High

**Recommendation:**\
- Disable invalid CTAs. - Add inline missing-field guidance. - Add
lightweight success toasts.

**Impacts:** Trust, Flow, Emotional confidence

------------------------------------------------------------------------

# SECTION B --- Quick Wins (High Impact, Low Dev Effort)

-   Replace Schedule empty state with Client-first CTA.
-   Rename misleading invoice CTAs.
-   Apply business defaults to auto-generated invoices.
-   Add toasts for Saved / Created actions.
-   Add floating bottom-right Add button per tab for thumb reach.

------------------------------------------------------------------------

# SECTION C --- Strategic Risks

-   **Trust Debt:** Non-functional financial CTAs harm retention.
-   **Invoice Confusion:** Dual invoice mental model creates duplicates
    and support burden.
-   **Offline Credibility Gap:** No backup/export guidance if device is
    lost.
-   **First-Session Failure:** Schedule flow mismatch may cause churn.
-   **Regional Assumptions:** Hardcoded GST and NZD formatting may limit
    scalability.

------------------------------------------------------------------------

# SECTION D --- 60-Second Setup Test

**Can a new operator create their first booking in under 60 seconds
(real workspace)?**

No.

### Where it breaks:

1.  Forced 6-step setup wizard (\~25--45s)
2.  Must manually add client (\~20--40s)
3.  Then create booking (\~15--30s)

Total realistic time: 60--115 seconds

Additionally, attempting "Add Visit" before creating a client results in
failure.

The demo environment succeeds under 60 seconds due to pre-populated
data, but real-world first use does not.

------------------------------------------------------------------------

# Required Before Production

-   Remove or rename non-functional CTAs.
-   Fix Schedule empty state flow.
-   Add validation + feedback.
-   Unify invoice creation model.
-   Reduce initial setup friction.

------------------------------------------------------------------------

End of Audit.
