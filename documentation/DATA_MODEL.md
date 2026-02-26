# Solva — Data Model

This document defines Solva’s current data model for v1.1.

It is intentionally simple and designed for:
- predictable localStorage persistence
- clean UI state management
- future migration to a database without rewriting concepts

---

## Storage Strategy (v1.1)

**Current:** Local-first using `localStorage`  
**Later:** Replace storage adapter with a database (Supabase / SQLite / etc.)

Design goals:
- stable IDs
- explicit entities
- minimal nesting
- easy export/import later

---

## Entity Overview

Solva v1.1 centres around five primary entities:

1. **BusinessProfile** — app identity + defaults  
2. **Services** — reusable service templates  
3. **Clients** — customer records + notes  
4. **Bookings** — scheduled work  
5. **Settings** — hours, preferences, display options  

---

## IDs & Conventions

- IDs are strings (UUID recommended)
- Use ISO 8601 for dates/times
- Use `createdAt` and `updatedAt` on all entities

---

## localStorage Keys

Recommended keys:

- `solva.businessProfile`
- `solva.settings`
- `solva.services`
- `solva.clients`
- `solva.bookings`

Each key stores JSON.

---

## BusinessProfile

```json
{
  "id": "biz_001",
  "businessName": "Solva Cleaning",
  "ownerName": "Rebecca",
  "email": "",
  "phone": "",
  "locationLabel": "",
  "timezone": "Pacific/Auckland",
  "currency": "NZD",
  "createdAt": "2026-02-06T00:00:00.000Z",
  "updatedAt": "2026-02-06T00:00:00.000Z"
}
```

---

## Settings

```json
{
  "weekStartsOn": "monday",
  "defaultBookingDurationMinutes": 120,
  "workingHours": {
    "monday":    { "enabled": true,  "start": "08:00", "end": "17:00" },
    "tuesday":   { "enabled": true,  "start": "08:00", "end": "17:00" },
    "wednesday": { "enabled": true,  "start": "08:00", "end": "17:00" },
    "thursday":  { "enabled": true,  "start": "08:00", "end": "17:00" },
    "friday":    { "enabled": true,  "start": "08:00", "end": "17:00" },
    "saturday":  { "enabled": false, "start": "08:00", "end": "12:00" },
    "sunday":    { "enabled": false, "start": "08:00", "end": "12:00" }
  },
  "createdAt": "2026-02-06T00:00:00.000Z",
  "updatedAt": "2026-02-06T00:00:00.000Z"
}
```

---

## Service

```json
{
  "id": "svc_001",
  "name": "Standard Clean",
  "description": "General clean for a small home.",
  "defaultDurationMinutes": 120,
  "defaultPrice": 160,
  "active": true,
  "createdAt": "2026-02-06T00:00:00.000Z",
  "updatedAt": "2026-02-06T00:00:00.000Z"
}
```

---

## Client

```json
{
  "id": "cli_001",
  "displayName": "Alex Taylor",
  "phone": "",
  "email": "",
  "addressLine1": "",
  "addressLine2": "",
  "suburb": "",
  "city": "",
  "notes": "Has a dog. Please use side gate.",
  "tags": ["repeat", "weekly"],
  "active": true,
  "createdAt": "2026-02-06T00:00:00.000Z",
  "updatedAt": "2026-02-06T00:00:00.000Z"
}
```

---

## Booking

```json
{
  "id": "bok_001",
  "clientId": "cli_001",
  "serviceId": "svc_001",
  "title": "Standard Clean — Alex Taylor",
  "startAt": "2026-02-06T21:00:00.000Z",
  "endAt": "2026-02-06T23:00:00.000Z",
  "status": "scheduled",
  "priceEstimate": 160,
  "notes": "Focus on kitchen + bathroom.",
  "createdAt": "2026-02-06T00:00:00.000Z",
  "updatedAt": "2026-02-06T00:00:00.000Z"
}
```

---

## Relationships

- A **Booking** references:
  - one **Client** (`clientId`)
  - one **Service** (`serviceId`)

---

This model will evolve as Solva matures.
