---
slug: /customers
title: Kunden (Customers)
---

# Kunden (Customers)

**File:** `src/components/Tabs/KundenVerwaltung.jsx`

## Overview
The Customers module allows for the management of customer data, including creation, editing, and CSV import/export. It supports both private individuals and companies.

## Visual Mockup

**Kunden** [ + Neuer Kunde ]
*Verwalten Sie Ihre Kundenkontakte und Firmen.*

| 🔍 *Suchen...* | [ 📤 CSV Import ] [ 📥 CSV Export ] [ 🔄 Refresh ] |
| :--- | :--- |

| | Name | Typ | Email | Ort |
| :---: | :--- | :--- | :--- | :--- |
| 🏢 | **Musterfirma GmbH**<br/><small>KD-1001</small> | [ Firma ] | kontakt@musterfirma.de | 10115 Berlin |
| 👤 | **Max Mustermann**<br/><small>KD-1002</small> | [ Privat ] | max@mustermann.de | 80331 München |
| 👤 | **Sabine Schmidt**<br/><small>KD-1003</small> | [ Privat ] | sabine@mail.de | 20095 Hamburg |

## Interactive Elements

### Actions
- **Neuer Kunde:** Opens the `KundeErstellung` mask to add a new customer manually.
- **Search:** Real-time filtering of the customer list by name, email, or ID.
- **CSV Import:** Allows uploading a `.csv` file to bulk import customers. Automatically detects headers like Name, Street, PLZ, etc.
- **CSV Export:** Downloads the current customer list as a `.csv` file.
- **Refresh (🔄):** Reloads the customer database from `fast_accsess/kunden.db`.

### List Interactions
- **Clicking a Row:** Navigates to `/kunden-viewer/:id` to show customer details and invoice history.
- **Chip:** Visual indicator for "Firma" vs "Privat".

### Customer Data Fields
- Name (Required)
- IstFirma (Boolean toggle)
- Email
- Telefon
- Strasse, Nummer, PLZ, Ort, Land
