---
slug: /dashboard
title: Dashboard
---

# Dashboard

**File:** `src/pages/Dashboard.jsx`

## Overview
The Dashboard is the central hub of the application, providing a high-level overview of the business's financial health. It displays key metrics like total revenue, yearly revenue, profit, and invoice counts, along with a visual chart of monthly revenue.

## Visual Mockup

| Gesamter Umsatz | Jahresumsatz | Jahresgewinn | Rechnungen |
| :--- | :--- | :--- | :--- |
| **24,500.00€** | **12,400.00€** | **8,200.00€** | **142** |
| +20.1% vom letzten Monat | Aktuelles Jahr | Nach Abzug von 4,200.00€ Ausgaben | Erstellt insgesamt |

### Umsatzübersicht 2024
*(A line chart showing revenue trends from Jan to Dec)*

### Offene Rechnungen
- **R-2024-001** | Kunde: Musterfirma GmbH | [Offen]
- **R-2024-002** | Kunde: Max Mustermann | [Überfällig]
- **R-2024-003** | Kunde: Bäckerei Müller | [Bezahlt]

## Interactive Elements

### Navigation
- Clicking on an **Offene Rechnung** navigates to the invoice detail view (`/kunden-viewer/:id`).

### Data Sources
- **Umsatz & Gewinn:** Calculated from all invoices in `rechnungen/` and expenses from `ausgaben/`.
- **Chart Data:** Aggregates invoice amounts by month for the current year.
- **Invoice Count:** Read from `fast_accsess/config.rechnix`.
