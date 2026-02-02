# Mehrwertsteuer (MwSt)

Rechnix unterstützt die in Deutschland gängigen Mehrwertsteuersätze für eine steuerlich korrekte Rechnungsstellung.

## Verfügbare Steuersätze

In Deutschland gelten drei Mehrwertsteuersätze:

### 19% - Regelsteuersatz (Standard)
Der Regelsteuersatz von 19% gilt für die meisten Waren und Dienstleistungen:
- Handwerkerleistungen
- Beratungsdienstleistungen
- Softwareentwicklung
- Verkauf von Elektronik
- etc.

### 7% - Ermäßigter Steuersatz
Der ermäßigte Steuersatz von 7% gilt für bestimmte Waren:
- Lebensmittel (außer Getränken in Restaurants)
- Bücher und Zeitschriften
- ÖPNV-Tickets
- Kulturelle Veranstaltungen
- Übernachtungen

### 0% - Steuerfrei
Einige Leistungen sind von der Umsatzsteuer befreit:
- Kleinunternehmer (§19 UStG)
- Reverse-Charge bei EU-Geschäften
- Bestimmte medizinische Leistungen
- Versicherungsleistungen

## Steuersatz in Produkten festlegen

Beim Anlegen oder Bearbeiten eines Produkts können Sie den passenden Steuersatz auswählen:

1. Gehen Sie zu **Produkte Verwalten**
2. Klicken Sie auf "Produkt erstellen" oder bearbeiten Sie ein bestehendes Produkt
3. Wählen Sie im Dropdown "MwSt (%)" den passenden Satz:
   - 19% (Standard)
   - 7% (Ermäßigt)
   - 0% (Steuerfrei)
4. Der Steuersatz wird automatisch bei der Rechnungserstellung verwendet

## Mehrere Steuersätze in einer Rechnung

Rechnix unterstützt **gemischte Steuersätze** in einer Rechnung:

- Sie können Produkte mit unterschiedlichen Steuersätzen kombinieren
- Die Rechnung zeigt automatisch die Steuerbeträge getrennt auf:
  - Netto-Betrag gesamt
  - + 19% MwSt auf [Betrag]
  - + 7% MwSt auf [Betrag]
  - = Brutto-Betrag gesamt

**Beispiel:**
```
Position 1: Webentwicklung (19%) - 1.000 € netto
Position 2: Schulungsbuch (7%)   -   500 € netto
─────────────────────────────────────────────────
Netto gesamt:                       1.500 €
+ 19% MwSt auf 1.000 €:               190 €
+ 7% MwSt auf 500 €:                   35 €
─────────────────────────────────────────────────
Brutto gesamt:                      1.725 €
```

## Kleinunternehmer (§19 UStG)

Wenn Sie Kleinunternehmer sind:

1. Setzen Sie bei allen Produkten den Steuersatz auf **0%**
2. Fügen Sie in den **Einstellungen** folgenden Hinweis hinzu:

> "Gemäß §19 UStG wird keine Umsatzsteuer berechnet."

Dieser Hinweis erscheint dann automatisch auf allen Rechnungen.

## Export für Steuererklärung

Die Statistik-Funktion bietet eine Übersicht aller Einnahmen mit:
- Getrennter Auflistung nach Steuersatz
- Netto- und Brutto-Beträgen
- Summe der abgeführten Umsatzsteuer

Diese Daten können Sie direkt für Ihre Umsatzsteuer-Voranmeldung verwenden.

## Tipps

💡 **Tipp**: Legen Sie Standardprodukte für häufige Leistungen an - der Steuersatz wird automatisch gesetzt.

💡 **Tipp**: Bei Unsicherheit über den richtigen Steuersatz konsultieren Sie Ihren Steuerberater.

⚠️ **Wichtig**: Die korrekte Anwendung der Steuersätze liegt in Ihrer Verantwortung. Rechnix ist ein Hilfstool und ersetzt keine steuerliche Beratung.
