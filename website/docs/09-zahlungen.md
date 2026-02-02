# Zahlungsverfolgung

Rechnix bietet eine professionelle Zahlungsverfolgung, mit der Sie den Überblick über offene und bezahlte Rechnungen behalten.

## Zahlungsstatus

Jede Rechnung kann einen der folgenden Status haben:

- **Offen (Unpaid)**: Die Rechnung wurde erstellt, aber noch nicht bezahlt
- **Teilzahlung (Partial)**: Ein Teil des Rechnungsbetrags wurde bereits beglichen
- **Bezahlt (Paid)**: Der vollständige Betrag wurde bezahlt
- **Überfällig (Overdue)**: Das Zahlungsziel wurde überschritten, Zahlung steht noch aus

Diese Status werden in der Rechnungsübersicht mit farbigen Badges angezeigt:
- 🟢 Grün = Bezahlt
- 🟡 Gelb = Teilzahlung
- 🔴 Rot = Überfällig
- ⚪ Neutral = Offen

## Zahlung erfassen

Um eine Zahlung zu erfassen, öffnen Sie die Rechnung und klicken Sie auf **"Zahlung erfassen"**:

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

## Zahlungsziel

Beim Erstellen einer Rechnung wird automatisch ein Zahlungsziel von **14 Tagen** gesetzt. Nach Ablauf des Zahlungsziels wird eine unbezahlte Rechnung automatisch als "Überfällig" markiert.

## Zahlungsmethoden

Rechnix unterstützt folgende Zahlungsmethoden:
- **Banküberweisung** (Standard für geschäftliche Transaktionen)
- **Bargeld** (für Barzahlungen vor Ort)
- **Kartenzahlung** (EC-Karte, Kreditkarte)
- **PayPal** (Online-Zahlungen)
- **Sonstige** (andere Zahlungswege)
