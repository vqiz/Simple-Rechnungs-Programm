---
title: FAQ & Hilfe
sidebar_position: 13
---

# Häufig gestellte Fragen (FAQ)

Willkommen im umfangreichen Hilfebereich von Rechnix. Hier finden Sie Antworten auf fast alle Fragen zur Nutzung der Software.

## 🚀 Allgemeines & Installation

### 1. Ist Rechnix wirklich kostenlos?
Ja, Rechnix ist als lokale Anwendung konzipiert. Es gibt aktuell keine versteckten Abonnement-Kosten für die Grundfunktionen der lokalen Nutzung.

### 2. Auf welchen Betriebssystemen läuft Rechnix?
Rechnix ist für **macOS** (Apple Silicon & Intel) sowie **Windows** (10/11) verfügbar. Eine Linux-Version ist technisch möglich, wird aber aktuell nicht offiziell supportet.

### 3. Wo werden meine Daten gespeichert?
Im Gegensatz zu Cloud-Anwendungen liegen **alle Daten lokal auf Ihrem Computer**. Sie haben die volle Kontrolle. Die Datenbankdatei (`rechnix.db`) befindet sich in Ihrem Benutzerverzeichnis.

### 4. Benötige ich eine Internetverbindung?
Nein. Da Rechnix lokal läuft, können Sie Rechnungen schreiben, Kunden anlegen und Statistiken einsehen, auch wenn Sie offline sind. Eine Internetverbindung wird nur für Updates benötigt.

### 5. Kann ich Rechnix auf mehreren Computern gleichzeitig nutzen?
Nein, Rechnix ist eine **Einzelplatz-Lösung**. Wenn Sie die Datenbank in einen Cloud-Ordner (Dropbox/iCloud) legen, können Sie theoretisch von verschiedenen Geräten zugreifen, aber **niemals gleichzeitig**, da dies zu Datenverlust führen kann.

### 6. Wie aktualisiere ich die Software?
Rechnix sucht beim Start automatisch nach Updates (sofern implementiert). Alternativ laden Sie einfach die neueste Version von der Webseite/Repository herunter und installieren sie über die bestehende Version. Daten bleiben dabei erhalten.

---

## 👥 Kundenverwaltung

### 7. Wie lege ich einen neuen Kunden an?
Gehen Sie im Menü auf **"Kunden"** und klicken Sie auf den Button **"Neuer Kunde"**. Füllen Sie mindestens den Namen aus. Weitere Felder wie Adresse und E-Mail sind optional, aber empfohlen für korrekte Rechnungen.

### 8. Kann ich Kunden importieren (CSV)?
38: Ja! In der Kundenverwaltung finden Sie neben "Kunde erstellen" einen Button für **"CSV Import"**. Laden Sie einfach Ihre CSV-Datei hoch (Spalte "Name" wird benötigt).

### 9. Was passiert, wenn ich einen Kunden lösche?
Wenn Sie einen Kunden löschen, bleiben dessen **Rechnungen erhalten**, um Ihre Buchhaltung nicht zu verfälschen. Der Kunde taucht aber nicht mehr in der Auswahlliste für neue Rechnungen auf.

### 10. Kann ich mehrere Ansprechpartner pro Kunde hinterlegen?
Derzeit gibt es ein Hauptfeld für den Ansprechpartner. Sie können weitere Namen im Notizfeld hinterlegen.

### 11. Wie suche ich nach einem Kunden?
In der Kundenübersicht gibt es oben ein **Suchfeld**. Sie können nach Namen, Kundennummer oder Stadt suchen.

---

## 📦 Produkte & Dienstleistungen

### 12. Muss ich Produkte anlegen, um eine Rechnung zu schreiben?
Nein. Sie können in der Rechnung auch "Freitext"-Positionen eingeben. Das Anlegen unter **"Produkte"** spart aber Zeit für wiederkehrende Leistungen.

### 13. Kann ich Dienstleistungen (Stunden) abrechnen?
Ja. Wählen Sie als Einheit einfach "Stunden" oder "Std." beim Anlegen des Produkts.

### 14. Veraltete Produkte löschen – geht das?
Ja, über das Mülleimer-Symbol in der Produktliste. Bereits erstellte Rechnungen, die dieses Produkt enthalten, bleiben unverändert.

### 15. Gibt es eine Lagerbestandsführung?
Rechnix ist primär ein Rechnungsprogramm, kein Warenwirtschaftssystem. Ein einfacher Lagerbestand wird nicht automatisch heruntergezählt.

---

## 📄 Rechnungen schreiben

### 16. Wie erstelle ich eine neue Rechnung?
Klicken Sie im Menü auf **"Rechnungen"** -> **"Neue Rechnung"**. Wählen Sie einen Kunden aus und fügen Sie Positionen hinzu.

### 17. Kann ich das Rechnungsdesign anpassen?
Ja. Unter **"Einstellungen"** können Sie Ihr Firmenlogo hochladen, Fußzeilen anpassen und Ihre Bankdaten hinterlegen.

### 18. Wie funktioniert die Rechnungsnummernvergabe?
Rechnix generiert automatisch fortlaufende Nummern. Das Format (z.B. `R-2024-001`, Präfix, Datumsformat, Zähler) können Sie unter **"Einstellungen" -> "Unternehmen"** anpassen.

### 19. Kann ich eine Rechnung nachträglich bearbeiten?
Solange die Rechnung nicht als "Versendet" oder "Bezahlt" markiert bzw. festgeschrieben ist, können Sie sie bearbeiten. Für die GoBD-Konformität sollten festgeschriebene Rechnungen nicht mehr geändert, sondern storniert werden.

### 20. Wie exportiere ich eine Rechnung als PDF?
In der Rechnungsansicht finden Sie oben rechts einen Button **"PDF Export"**. Das PDF wird in Ihrem Download-Ordner oder einem gewählten Speicherort abgelegt.

### 21. Unterstützt Rechnix E-Rechnungen (XRechnung / ZUGFeRD)?
Ja, Rechnix ist bereit für die E-Rechnungspflicht. Sie können Rechnungen im XML-Format (XRechnung) exportieren und importieren.

### 22. Kann ich Mahnungen erstellen?
Ja. Wenn eine Rechnung "Offen" oder "Überfällig" ist, können Sie in der Rechnungsansicht auf **"Mahnung erstellen"** klicken. Es wird automatisch ein Mahn-PDF generiert.

### 23. Was bedeutet der Status "Entwurf"?
Die Rechnung ist gespeichert, hat aber noch keine finale Rechnungsnummer oder gilt noch nicht als "gestellt".

---

## 💰 Zahlungen & Status

### 24. Was bedeuten die Status-Farben?
*   **Grau (Ausstehend/Offen)**: Rechnung gestellt, noch nicht bezahlt.
*   **Grün (Bezahlt)**: Geld vollständig erhalten.
*   **Gelb (Teilzahlung)**: Ein Teilbetrag wurde gezahlt.
*   **Rot (Überfällig)**: Zahlungsziel überschritten.

### 25. Wie verbuche ich einen Geldeingang?
Rechtsklick auf die Rechnung in der Liste -> **"Zahlung erfassen"** oder direkt in der Rechnung auf den Button "Zahlung erfassen" klicken.

### 26. Kann ich Teilzahlungen eingeben?
Ja! Wählen Sie im Dialog **"Teilzahlung"** und geben Sie den Betrag ein. Der Restbetrag bleibt offen.

### 27. Ich habe mich vertippt – wie lösche ich eine Zahlung?
Gehen Sie im Zahlungsdialog auf **"Zahlungshistorie anzeigen"**. Dort können Sie einzelne Buchungen löschen.

### 28. Wird das Zahlungsziel automatisch berechnet?
Ja, standardmäßig +14 Tage ab Rechnungsdatum. Dies kann in den Einstellungen pauschal oder pro Rechnung angepasst werden.

### 29. Was passiert, wenn ein Kunde zu viel überweist?
Das System verbucht den Betrag. Die Rechnung gilt als bezahlt. Eine Guthaben-Verwaltung ist aktuell noch nicht integriert.

---

## 💸 Ausgaben erfassen

### 30. Wofür ist der Bereich "Ausgaben"?
Hier erfassen Sie eingehende Rechnungen (Lieferanten, Miete, Software), um Ihren Gewinn (EÜR) zu ermitteln.

### 31. Kann ich Belege hochladen?
Ja, Sie können PDFs oder Bilder zu einer Ausgabe hinzufügen, um sie digital zu archivieren (Feature in Version 0.1.0 enthalten).

### 32. Gibt es verschiedene Ausgaben-Kategorien?
Ja (Büromaterial, Werbung, Miete etc.). Dies hilft Ihnen später in der Statistik zu sehen, wofür Sie am meisten Geld ausgeben.

---

## 📊 Statistiken & EÜR

### 33. Was zeigt mir das Dashboard?
Das Dashboard ist Ihre Kommandozentrale: Umsatz aktueller Monat, offene Rechnungen und Jahresverlauf auf einen Blick.

### 34. Ist die EÜR finanzamt-konform?
Die Einnahmenüberschussrechnung (EÜR) in Rechnix bietet eine gute Grundlage. Für die finale Steuererklärung empfehlen wir jedoch immer die Prüfung durch einen Steuerberater.

### 35. Kann ich die Daten für den Steuerberater exportieren?
Ja, Sie können die EÜR als PDF exportieren oder alle Rechnungen eines Zeitraums als ZIP-Archiv/CSV bereitstellen.

### 36. Warum stimmen meine Einnahmen nicht mit dem Bankkonto überein?
Rechnix zählt Einnahmen nach dem **Buchungsdatum** der Zahlung in der Software. Haben Sie das Datum korrekt eingetragen?

---

## ⚙️ Einstellungen & Anpassung

### 37. Wie ändere ich mein Firmenlogo?
Unter **Einstellungen -> Firmenprofil**. Uploaden Sie eine JPG oder PNG Datei.

### 38. Ich bin Kleinunternehmer. Kann ich die Umsatzsteuer ausblenden?
Ja, aktivieren Sie in den Einstellungen die Option **"Kleinunternehmerregelung (§ 19 UStG)"**. Dann wird keine MwSt. ausgewiesen.

### 39. Kann ich die Währung ändern?
Ja. Unter **Einstellungen -> Unternehmen** können Sie die Währung (z.B. €, $, £, CHF) auswählen. Alle Rechnungen werden dann im gewählten Format angezeigt.

### 40. Wie ändere ich die Fußzeile der Rechnungen?
In den Einstellungen finden Sie Textfelder für Fußzeile 1 (Adresse), Fußzeile 2 (Bank) und Fußzeile 3 (Rechtliches).

### 41. Werden meine Bankdaten automatisch auf die Rechnung gedruckt?
Ja, wenn Sie diese in den Einstellungen hinterlegen.

---

## 🔒 Sicherheit & Backup

### 42. Wie erstelle ich ein Backup?
**Einstellungen -> Datensicherung -> Backup erstellen**. Sie erhalten eine ZIP-Datei. Speichern Sie diese extern (USB-Stick, Cloud).

### 43. Wie oft sollte ich Backups machen?
Wir empfehlen: **Nach jeder größeren Arbeits-Session** oder mindestens wöchentlich.

### 44. Kann ich meine Daten verschlüsseln?
Ja. In den Einstellungen können Sie ein Passwort setzen. Ohne dieses Passwort kann die Datenbank nicht mehr geöffnet werden. **Vorsicht:** Bei Passwortverlust gibt es keine "Passwort vergessen"-Funktion!

### 45. Ich habe ein Backup wiederhergestellt, aber Daten fehlen?
Beim Wiederherstellen wird der **Jetzige Zustand komplett überschrieben**. Wenn das Backup alt war, sind neuere Daten weg.

---

## 🛠 Fehlerbehebung (Troubleshooting)

### 46. Ich sehe nur einen weißen Bildschirm ("White Screen").
Starten Sie die App neu (`Cmd+R` / `Strg+R` oder App schließen und öffnen). Hilft das nicht, ist eventuell die Datenbank beschädigt -> Backup wiederherstellen.

### 47. Der PDF-Export funktioniert nicht.
Prüfen Sie, ob Sie Schreibrechte im Zielordner haben. Versuchen Sie, auf den Desktop zu speichern.

### 48. Die App reagiert langsam.
Haben Sie extrem viele Rechnungen (10.000+)? Rechnix ist für kleine bis mittlere Unternehmen optimiert. Bereinigen Sie ggf. alte Daten oder archivieren Sie diese.

### 49. Wo finde ich Log-Dateien für den Support?
Im Installationsordner unter/in `logs/` oder über die Entwicklerkonsole (`Strg+Shift+I` -> Console), falls Sie technische Kenntnisse haben.

### 50. An wen wende ich mich bei Problemen?
Nutzen Sie das Kontaktformular auf der Webseite oder schreiben Sie eine E-Mail an den Support. Bitte geben Sie Version und Betriebssystem an.
