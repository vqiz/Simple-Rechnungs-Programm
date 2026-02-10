---
slug: /invoices
title: Rechnungen (Invoices)
---

# Rechnungen (Invoices)

**Files:** `src/components/Tabs/RechnungenVerwalten.jsx`, `src/components/Tabs/RechnungErstellen.jsx`

## Overview
The Invoices module is split into two main areas: **Verwaltung** (Management) and **Erstellen** (Creation). It allows users to view, search, delete, and create invoices.

## Invoice Management (Rechnungen Verwalten)

### Visual Mockup

**[ Übersicht ] [ R-2024-001 x ]**

| Rechnungs-Nr. | Datum | Kunde | Betrag | Aktionen |
| :--- | :--- | :--- | :---: | :---: |
| **R-2024-005** | 12.02.2024 | Musterfirma GmbH | 1,200.00 € | 👁️ 🗑️ |
| **R-2024-004** | 10.02.2024 | Max Mustermann | 450.50 € | 👁️ 🗑️ |

**[ + Neue Rechnung ]**

### Interactions
- **Search:** Filter invoices by ID or Customer Name.
- **Tabs:** Open invoices appear as tabs at the top. Clicking a row opens the invoice in a new tab.
- **Delete (🗑️):** Prompts for confirmation before deleting the invoice file.
- **View (👁️):** Opens the invoice in the viewer tab.
- **Neue Rechnung:** Navigates to the invoice creation screen.

---

## Invoice Creation (Rechnung Erstellen)

### Visual Mockup

**Neue Rechnung** [ 💾 Rechnung erstellen ]

| Produkte Browser | Invoice Preview |
| :--- | :--- |
| 🔍 *Suche...* | **Kunde:** [ Select Customer ▼ ] |
| **[ + Neues Produkt ]** | |
| **Dienstleistungen** | **Positionen** |
| Webdesign [ + ] | Webdesign (x2) ... 160.00€ 🗑️ |
| Wartung [ + ] | Hosting (x1) ..... 20.00€ 🗑️ |
| **Hardware** | |
| Server [ + ] | **Kommentar:** *Optional...* |
| | |
| | **Netto gesamt:** 180.00 € |
| | Netto [x] Brutto |

### Interactions
- **Customer Select:** Autocomplete dropdown to select a customer from `kunden.db`.
- **Product Browser:** Search and add products to the invoice. "Neues Produkt" opens a modal to define ad-hoc items.
- **Quantity Adjustment:** Clicking a position in the preview allows changing the quantity.
- **Brutto/Netto Switch:** Toggles the calculation mode.
- **Rechnung erstellen:** Saves the invoice, increments the invoice number, and redirects to the viewer.
