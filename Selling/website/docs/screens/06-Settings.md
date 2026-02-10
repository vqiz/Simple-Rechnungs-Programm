---
slug: /settings
title: Unternehmensdaten (Company Settings)
---

# Unternehmensdaten (Company Settings)

**File:** `src/components/Tabs/Unternehmen.jsx`

## Overview
This screen manages the user's own company information. This data is critical as it appears on all generated invoices as the "Seller" information and is used for E-Rechnung/XRechnung compliance.

## Visual Mockup

**Unternehmensdaten Verwalten**
*Hier werden die Unternehmensdaten ihres eigenen Unternehmens bearbeitet.*

### Unternehmensdaten (Pflichtdaten)
| Feld | Beispiel |
| :--- | :--- |
| **Unternehmensname** | Mustermann & Landes GMBH |
| **Adresse** | Musterstraße 92, 94315 Straubing |
| **Land / ISO** | DE |
| **USt-ID / Steuernr** | DE123456789 |
| **Inhaber** | Max Mustermann |
| **Bundesland** | Bayern |

### Bankverbindung
| Feld | Beispiel |
| :--- | :--- |
| **Bankname** | Sparkasse Niederbayern-Mitte |
| **IBAN** | DE21 3704 ... |
| **BIC** | COBADEHDXXX |
| **Kontoinhaber** | Max Mustermann |

### Konfiguration
- **Gewerbeart:** [ Kleingewerbe ] ↔ [ Gewerbe ] (Toggles VAT calculation)
- **Währung:** € / $ / £ / CHF

### Rechnungsnummer Format
Defines how new invoice numbers are generated.
- **Präfix:** `R`
- **Datumsformat:** `YYYY-MM-DD`
- **Trennzeichen:** `-`
- *Vorschau: R-2024-03-01-123*

### Logo
- **[ Logo Ändern ]:** Uploads and crops a company logo for the invoice header.

## Interactive Elements
- **Save Warning:** If changes are detected, a floating alert appears: *"Es wurden Änderungen vorgenommen die noch nicht gespeichert sind."* with a **[ Speichern ]** button.
- **Image Cropper:** Built-in tool to crop uploaded logos to a square aspect ratio.
