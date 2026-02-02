# E-Rechnung Import

Mit Rechnix können Sie empfangene E-Rechnungen (XRechnung/ZUGFeRD) automatisch importieren und als Ausgaben speichern.

## Was ist eine E-Rechnung?

Eine E-Rechnung ist eine Rechnung im strukturierten XML-Format, die maschinenlesbar ist. Die gängigsten Formate sind:
- **XRechnung** - Deutscher Standard für die elektronische Rechnungsstellung
- **ZUGFeRD** - Hybrid-Format (PDF mit eingebettetem XML)

## Automatischer Import

Gehen Sie zur **Ausgabenverwaltung** und klicken Sie auf **"E-Rechnung importieren"**, um eine XML-Datei hochzuladen.

### So importieren Sie eine E-Rechnung:

1. Gehen Sie zu **Ausgabenverwaltung**
2. Klicken Sie auf **"E-Rechnung importieren"**
3. Wählen Sie die XML-Datei aus
4. Das System liest automatisch aus:
   - **Lieferant/Anbieter** - Name des Rechnungsstellers
   - **Betrag** - Brutto-Gesamtbetrag
   - **Datum** - Rechnungsdatum
   - **Beschreibung** - Aus den Rechnungspositionen
   - **Rechnungsnummer** - Zur Referenz

5. Die Ausgabe wird automatisch erstellt und gespeichert

## Welche Daten werden extrahiert?

Rechnix liest folgende Informationen aus der E-Rechnung:

| Feld | XML-Quelle |
|------|------------|
| Lieferant | AccountingSupplierParty/PartyName |
| Betrag (Brutto) | LegalMonetaryTotal/PayableAmount |
| Betrag (Netto) | LegalMonetaryTotal/TaxExclusiveAmount |
| Steuerbetrag | TaxTotal/TaxAmount |
| Rechnungsdatum | IssueDate |
| Fälligkeitsdatum | DueDate |
| Rechnungsnummer | ID |
| Positionen | InvoiceLine/Item/Name |
| Zahlungsmethode | PaymentMeans/PaymentMeansCode |

## Unterstützte Formate

✅ **XRechnung** (UBL-Invoice-2.x)
✅ **ZUGFeRD** (XML-Anteil)
✅ **CII** (Cross Industry Invoice)

## Beispiel

Wenn Sie eine E-Rechnung von einem Software-Anbieter importieren:

**Originalrechnung:**
```
Anbieter: Software GmbH
Datum: 15.01.2024
Betrag: 119,00 €
Positionen:
  - Software-Lizenz (1x 100,00€)
  - Support-Paket (1x 19,00€)
```

**Erstellte Ausgabe:**
- **Titel**: Software-Lizenz (1x), Support-Paket (1x)
- **Anbieter**: Software GmbH
- **Betrag**: 119,00 €
- **Datum**: 15.01.2024
- **Kategorie**: Eingekaufte Leistungen

## Vorteile

💡 **Zeitersparnis** - Keine manuelle Eingabe nötig
💡 **Fehlerreduktion** - Automatische Datenübernahme verhindert Tippfehler
💡 **Vollständigkeit** - Alle wichtigen Informationen werden erfasst
💡 **Nachvollziehbarkeit** - Original-XML wird gespeichert

## Manueller Import bei Problemen

Wenn der automatische Import fehlschlägt:

1. Prüfen Sie, ob die Datei ein gültiges XML-Format hat
2. Öffnen Sie die XML-Datei in einem Texteditor
3. Erstellen Sie die Ausgabe manuell anhand der sichtbaren Daten

Häufige Fehler:
- **Keine XML-Datei** - Sie haben ein PDF gewählt. Bei ZUGFeRD müssen Sie das XML extrahieren
- **Ungültiges Format** - Die Datei entspricht nicht dem XRechnung/ZUGFeRD-Standard
- **Fehlende Pflichtfelder** - Die Rechnung enthält nicht alle erforderlichen Daten

## Tipps

💡 **Tipp**: Die Original-XML-Datei wird mit der Ausgabe gespeichert. Sie können sie später erneut einsehen.

💡 **Tipp**: Nach dem Import können Sie die Ausgabe wie gewohnt bearbeiten, z.B. die Kategorie anpassen.

💡 **Tipp**: Bei ZUGFeRD-PDF-Dateien können Sie das XML mit speziellen Tools extrahieren oder die Datei umbenennen in .xml und den XML-Teil manuell kopieren.
