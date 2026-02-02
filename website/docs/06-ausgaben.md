---
title: Ausgaben
sidebar_position: 6
---

# Ausgaben erfassen

import ExpensesMock from '@site/src/components/AppMock/ExpensesMock';

<ExpensesMock />

## Ausgabe hinzufügen

Klicken Sie auf **"Ausgaben"** und dann **"Ausgabe hinzufügen"**. Ein Formular öffnet sich:

import AusgabenEditorMock from '@site/src/components/DocsMock/AusgabenEditorMock';

<AusgabenEditorMock />

### Formular ausfüllen:

1. **Titel**: Wofür war die Ausgabe? (z.B. "Office 365 Lizenz", "Webhosting")
2. **Betrag**: Der Bruttobetrag in Euro
3. **Datum**: Wann ist die Ausgabe entstanden?
4. **Kategorie**: Ordnen Sie die Ausgabe ein (z.B. "Software", "Büro", "Marketing")
5. **Empfänger/Anbieter**: Wer hat das Geld erhalten? (z.B. "Microsoft", "Amazon")
6. **Wiederkehrende Ausgabe**:
   - Aktivieren Sie den Schalter für Abos und wiederkehrende Kosten
   - Wählen Sie das Intervall:
     - Monatlich
     - Vierteljährlich
     - Jährlich
     - Wöchentlich
   - Rechnix erstellt dann automatisch in jedem Intervall einen neuen Eintrag
7. **E-Rechnung / Beleg anhängen**: 
   - Klicken Sie auf "E-Rechnung / Beleg anhängen (XML/PDF/Bild)"
   - **XML-Dateien (XRechnung/ZUGFeRD)**: Alle Daten werden automatisch extrahiert!
     - Titel, Betrag, Anbieter und Kategorie werden aus der E-Rechnung gelesen
     - Spart Zeit und vermeidet Tippfehler
   - **PDF/Bilder**: Für gewöhnliche Belege zur digitalen Archivierung
   - Die Datei wird mit der Ausgabe verknüpft

> **💡 Tipp**: Wenn Sie eine E-Rechnung (XML) hochladen, werden alle Felder automatisch ausgefüllt! Siehe auch [E-Rechnung Import](./e-rechnung-import)

## Ausgaben verwalten

- In der Liste sehen Sie alle Ausgaben sortiert nach Datum
- Mit dem **Filter** können Sie nach Monaten oder Jahren suchen
- Klicken Sie auf das **Stift-Symbol**, um eine Ausgabe zu bearbeiten
- Klicken Sie auf das **Papierkorb-Symbol**, um eine Ausgabe zu löschen

## Wiederkehrende Ausgaben

Wiederkehrende Ausgaben (Abos) werden automatisch im gewählten Intervall erstellt. So behalten Sie immer den Überblick über Ihre regelmäßigen Kosten wie:
- Software-Lizenzen (z.B. Office 365, Adobe Creative Cloud)
- Hosting-Kosten
- Miete
- Versicherungen
- Mitgliedschaften

## E-Rechnungen importieren

Sie haben zwei Möglichkeiten, E-Rechnungen zu importieren:

### Option 1: Direkt beim Erstellen
Beim Erstellen einer Ausgabe können Sie eine XML-Datei anhängen. Die Daten werden automatisch extrahiert.

### Option 2: Bulk-Import
In der Ausgabenverwaltung gibt es einen separaten Button **"E-Rechnung importieren"** für den schnellen Import ohne manuelle Eingabe.

Mehr Details im [E-Rechnung Import Guide](./e-rechnung-import).
