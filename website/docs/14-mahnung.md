# Mahnungswesen

import InvoicesMock from '@site/src/components/AppMock/InvoicesMock';
import MahnungenMock from '@site/src/components/AppMock/MahnungenMock';

Rechnix bietet ein integriertes Mahnungswesen, mit dem Sie für offene oder überfällige Rechnungen schnell und einfach Zahlungserinnerungen und Mahnungen erstellen können.

## Übersicht (Mahnwesen)

Im neuen Tab **Mahnwesen** (in der Seitenleiste unter **Statistiken**) sehen Sie alle gesendeten Mahnungen auf einen Blick.

<MahnungenMock />

Hier sehen Sie:
- Alle offenen Mahnverfahren
- Die Gesamtsumme der Forderungen
- Den aktuellen Status (Erinnerung, 1. oder 2. Mahnung)

## Mahnung erstellen

1. Gehen Sie zur **Rechnungsübersicht**.
2. Klicken Sie in der Sidebar auf den Button **"Mahnung erstellen"**.
3. Ein Dialog öffnet sich.

<InvoicesMock />

### Mahnstufen & Gebühren

Rechnix unterstützt 3 Mahnstufen mit automatischen Texten und Gebühren:

1. **Zahlungserinnerung (Level 1)**
   - Freundliche Erinnerung: "Haben Sie uns vergessen?"
   - **Gebühr**: 0,00€
2. **1. Mahnung (Level 2)**
   - Formelle Aufforderung mit Fristsetzung.
   - **Gebühr**: 2,50€
3. **2. Mahnung / Letzte Mahnung (Level 3)**
   - Dringende Aufforderung vor Inkasso/Rechtsweg.
   - **Gebühr**: 5,00€

### Speichern & Versenden

- Wählen Sie oben die gewünschte Mahnstufe aus.
- Klicken Sie auf **"PDF Speichern"**, um das Dokument zu erstellen.
- Klicken Sie auf **"Als gesendet buchen"**, um die Mahnung im System zu erfassen. Sie erscheint dann automatisch in der "Mahnwesen"-Übersicht.

## Häufige Fragen

**Kann ich den Mahntext anpassen?**
Aktuell verwendet Rechnix einen rechtssicheren Standardtext. In zukünftigen Versionen wird dieser Text individuell anpassbar sein.

**Ändert sich der Status der Rechnung?**
Das Erstellen einer Mahnung ändert den Status der Rechnung nicht automatisch auf "Bezahlt", markiert sie aber intern, sodass Sie im Mahnwesen den Überblick behalten.
