---
slug: /products
title: Produkte (Products)
---

# Produkte (Products)

**File:** `src/components/Tabs/ProdukteVerwalten.jsx`

## Overview
The Products module manages the inventory of goods and services. Products are organized into categories and can be added to invoices.

## Visual Mockup

**Produkte** [ Kategorie erstellen ] [ + Neues Produkt ]
*Verwalten Sie Ihr Inventar und Dienstleistungen.*

| 🔍 *Produkt suchen...* | [ 🔄 ] |
| :--- | :--- |

| Produktname | Kategorie | Netto (€) | Steuer (%) | Aktionen |
| :--- | :--- | :---: | :---: | :---: |
| **Webdesign Basic** | [ Dientleistung ] | 850.00 € | 19 % | ︙ |
| **Hosting (1 Jahr)** | [ Service ] | 120.00 € | 19 % | ︙ |
| **Beratungsstunde** | [ Dientleistung ] | 95.00 € | 19 % | ︙ |

## Interactive Elements

### Management
- **Kategorie erstellen:** Creates a new category (e.g., "Hardware", "Service") to organize products.
- **Neues Produkt:** Opens a modal to define a new product with Name, Price, Tax Rate, and Category.
- **Search:** Filters products by name or category.

### Row Actions (︙ Menu)
- **✏️ Titel bearbeiten:** Edit the product name.
- **💶 Preis bearbeiten:** Edit the net price.
- **🏦 Steuer bearbeiten:** Change the VAT/Tax rate.
- **🗑️ Löschen:** Removes the product from the database (requires confirmation).
