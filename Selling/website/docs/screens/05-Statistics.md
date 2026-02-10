---
slug: /statistics
title: Statistiken (Statistics)
---

# Statistiken (Statistics)

**File:** `src/components/Tabs/Statistiken.jsx`

## Overview
The Statistics module provides detailed financial analysis, including Einnahmenüberschussrechnung (EÜR), charts for monthly performance, and expense categorization.

## Visual Mockup

**Finanzübersicht** [ 2024 ▼ ] [ 📥 EÜR Exportieren ]
*Analysieren Sie Ihre Einnahmen und Ausgaben für 2024*

| Gesamte Einnahmen | Gesamte Ausgaben | Gewinn / Verlust | USt. Eingenommen |
| :--- | :--- | :--- | :--- |
| **↗ 45,200.00 €** | **↘ 12,500.00 €** | **💶 32,700.00 €** | **🟣 8,588.00 €** |
| *Bruttoeinkommen 2024* | *Betriebsausgaben 2024* | *Jahresüberschuss* | *Umsatzsteuer 2024* |

<br/>

| Status | Betrag | Anzahl |
| :--- | :--- | :--- |
| 🟢 **Bezahlte Rechnungen** | 42,000.00 € | 28 Rechnungen |
| 🟡 **Offene Rechnungen** | 2,100.00 € | 3 Rechnungen |
| 🔴 **Überfällige Rechnungen** | 1,100.00 € | 1 Rechnung |

### Grafische Auswertung
- **Jahresverlauf (Bar Chart):** Compares Income (Green) vs Expenses (Red) per month.
- **Ausgaben nach Kategorie (Pie Chart):** Breakdown of expenses (e.g., "Büromaterial", "Software", "Fahrtkosten").

## Interactive Elements

### Controls
- **Year Selector:** Dropdown to switch between fiscal years (2022 - 2026).
- **EÜR Exportieren:** Generates and downloads a PDF report of the "Einnahmenüberschussrechnung" for the selected year.

### Metrics
- **Profit Calculation:** `Total Income - Total Expenses`.
- **Tax Collected:** Aggregated VAT from all invoices.
