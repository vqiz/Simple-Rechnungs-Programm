# Zahlungsverfolgung

Rechnix bietet eine professionelle Zahlungsverfolgung, mit der Sie den Überblick über offene und bezahlte Rechnungen behalten.

## Zahlungsstatus

Jede Rechnung kann einen der folgenden Status haben:

- **Ausstehend (Unpaid)**: Die Rechnung wurde noch nicht bezahlt (Neutral/Grau)
- **Teilzahlung (Partial)**: Ein Teilbetrag wurde beglichen (Gelb)
- **Bezahlt (Paid)**: Der vollständige Betrag wurde beglichen (Grün)
- **Überfällig (Overdue)**: Das Zahlungsziel (14 Tage) wurde überschritten (Rot)

Diese Status werden überall in Rechnix einheitlich mit Badges angezeigt:

import PaymentStatusBadgeMock from '@site/src/components/DocsMock/PaymentStatusBadgeMock';

<PaymentStatusBadgeMock />

## Zahlung erfassen

Sie können Zahlungen an zwei Orten erfassen:
1. **In der Rechnung:** Öffnen Sie die Rechnung und klicken Sie in der Seitenleiste auf **"Zahlung erfassen"**.
2. **In der Kundenübersicht:** Rechtsklick auf eine Rechnung in der Liste -> **"Zahlung erfassen"**.

import PaymentModalMock from '@site/src/components/DocsMock/PaymentModalMock';

<PaymentModalMock />

### Vollständige Zahlung

1. Wählen Sie "Vollständige Zahlung"
2. Der Betrag wird automatisch auf den Rechnungsbetrag gesetzt
3. Wählen Sie das Zahlungsdatum
4. Wählen Sie die Zahlungsmethode (Banküberweisung, Bargeld, Karte, PayPal, Sonstige)
5. Klicken Sie auf "Zahlung erfassen"

Die Rechnung wird automatisch als "Bezahlt" markiert.

### Teilzahlung

1. Wählen Sie "Teilzahlung"
2. Geben Sie den gezahlten Betrag ein
3. Wählen Sie Datum und Zahlungsmethode
4. Klicken Sie auf "Zahlung erfassen"


Wenn mehrere Teilzahlungen den Gesamtbetrag erreichen, wird die Rechnung automatisch als "Bezahlt" markiert.

## Zahlungen bearbeiten / löschen (Historie)

Wenn Sie eine Zahlung falsch erfasst haben, können Sie diese korrigieren:
1. Klicken Sie erneut auf **"Zahlung erfassen"**.
2. Klicken Sie unten auf **"Zahlungshistorie anzeigen"**.
3. Sie sehen eine Liste aller gebuchten Zahlungen.
4. Klicken Sie auf das **Papierkorb-Symbol** neben einer Zahlung, um sie zu löschen.
5. Der Status der Rechnung wird automatisch neu berechnet (z.B. zurück auf "Ausstehend" oder "Teilzahlung").

## Zahlungsziel

Beim Erstellen einer Rechnung wird automatisch ein Zahlungsziel von **14 Tagen** gesetzt. Nach Ablauf des Zahlungsziels wird eine unbezahlte Rechnung automatisch als "Überfällig" markiert.

## Zahlungsmethoden

Rechnix unterstützt folgende Zahlungsmethoden:
- **Banküberweisung** (Standard für geschäftliche Transaktionen)
- **Bargeld** (für Barzahlungen vor Ort)
- **Kartenzahlung** (EC-Karte, Kreditkarte)
- **PayPal** (Online-Zahlungen)
- **Sonstige** (andere Zahlungswege)

## Statistiken & Auswertung

Im Bereich **Statistiken** finden Sie eine detaillierte Auswertung Ihrer Einnahmen:

- **Jahresverlauf**: Balkendiagramm Ihrer Einnahmen und Ausgaben.
- **Aktueller Monat**: Zeigt die **Anzahl** der Einnahmen und Ausgaben.
  - **Tipp**: Klicken Sie auf die Kacheln "Anzahl Einnahmen" oder "Anzahl Ausgaben", um eine detaillierte Liste aller Positionen des aktuellen Monats zu sehen.
- **Zahlungsstatus**: Übersicht über offene, überfällige und bezahlte Beträge.
