---
title: Kundenverwaltung
sidebar_position: 3
---

# Kunden verwalten

In der Kundenverwaltung pflegen Sie Ihre Kontakte. Diese Daten werden automatisch in Rechnungen übernommen.

import CustomersMock from '@site/src/components/AppMock/CustomersMock';

<CustomersMock />

## Neuen Kunden anlegen

Klicken Sie auf den Button **"Kunde erstellen"** oben rechts. Ein Formular öffnet sich:

import KundeErstellenMock from '@site/src/components/DocsMock/KundeErstellenMock';

<KundeErstellenMock />

### Wichtige Felder:

- **Firma / Privatperson**: Nutzen Sie den Toggle-Schalter, um zwischen Privatkunde und Firmenkunde zu wechseln
- **Name / Firmenname**: Pflichtfeld - Geben Sie den vollständigen Namen ein
- **Anschrift**: Straße, Hausnummer, PLZ und Ort
- **Kontaktdaten**: E-Mail und Telefonnummer für die Kommunikation
- **Ländercode**: ISO-Code (z.B. "DE" für Deutschland)
- **Bundesland**: Wichtig für die Rechnungsstellung
- **USt-IdNr.**: Optional, bei Firmenkunden für steuerliche Zwecke

Klicken Sie auf **"Erstellen"**, um den Kunden zu speichern.

## Kunden importieren (CSV)

Sie können Kundendaten auch bequem aus einer CSV-Datei importieren.
1. Klicken Sie in der Übersicht auf den Button **"CSV Import"**.
2. Wählen Sie Ihre CSV-Datei aus.
3. Die Datei muss mindestens eine Spalte mit dem Header `Name` (oder `Firma`, `Kundenname`) enthalten.
4. Weitere unterstützte Spalten (automatische Erkennung): `Straße`, `PLZ`, `Ort`, `Email`, `Telefon`, `Land` (Standard: DE).
5. Das System erkennt automatisch, ob es sich um eine Firma handelt (z.B. bei "GmbH" im Namen).

## Kunden bearbeiten oder löschen

- Klicken Sie in der Liste auf einen Kunden, um die Details zu sehen
- In der Detailansicht können Sie die Kundendaten bearbeiten
- **Hinweis**: Die Bearbeitungs- und Löschfunktionen sind in der Detailansicht verfügbar

## Suchfunktion

Nutzen Sie das Suchfeld oben, um schnell nach Namen oder Kundennummern zu filtern.

## Rechnungen & Zahlungen

In der Detailansicht eines Kunden finden Sie unten eine Liste aller Rechnungen.
- **Rechtsklick** auf eine Rechnung öffnet ein Menü, um direkt **"Zahlung zu erfassen"**.
- Ein Ampel-System (Status-Badge) zeigt sofort, ob eine Rechnung offen, bezahlt oder überfällig ist.
