---
sidebar_position: 12
description: Wie Ihre Daten verschlüsselt und sicher aufbewahrt werden.
---

import BackupCreationMock from '@site/src/components/AppMock/BackupCreationMock';
import RestoreFlowMock from '@site/src/components/AppMock/RestoreFlowMock';

# Datensicherheit & Backups

Rechnix legt höchsten Wert auf die Sicherheit Ihrer Geschäftsdaten. Alle sensiblen Informationen werden automatisch verschlüsselt gespeichert und sind nur auf Ihrem Computer lesbar.

## Automatische Verschlüsselung

Sobald Sie Daten in Rechnix speichern (Kunden, Rechnungen, Einstellungen), werden diese mit **AES-256-GCM**, einem modernen Industriestandard für Verschlüsselung, geschützt.

*   **Maschinen-gebunden**: Der Verschlüsselungsschlüssel wird aus der Hardware-ID Ihres Computers generiert.
*   **Diebstahlschutz**: Selbst wenn jemand Ihre Dateidateien stiehlt, können diese auf einem anderen Computer nicht geöffnet werden.
*   **Transparent**: Für Sie ändert sich nichts an der Bedienung – das Programm entschlüsselt die Daten automatisch beim Öffnen.

:::warning Wichtig
Aufgrund der Sicherheitsarchitektur können Sie die Datendateien nicht einfach per USB-Stick auf einen anderen PC kopieren. Nutzen Sie dafür bitte die **Backup-Funktion**.
:::

## Backups erstellen

Um Ihre Daten zu sichern oder auf einen anderen Computer zu übertragen, erstellen Sie ein portables Backup. Dieses wird mit einem **von Ihnen gewählten Passwort** verschlüsselt.

### Schritt-für-Schritt

1.  Klicken Sie im Menü auf **Datei** > **Backup erstellen...** (oder `Cmd/Strg + B`).
2.  Vergeben Sie ein sicheres Passwort.
3.  Speichern Sie die `.rechnix-backup` Datei an einem sicheren Ort (z.B. externe Festplatte oder Cloud).

<div style={{ margin: '2rem 0' }}>
  <BackupCreationMock />
  <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>Interaktive Vorschau: Der Backup-Prozess</p>
</div>

## Daten wiederherstellen

Sie können ein Backup auf jedem Computer wiederherstellen, auf dem Rechnix installiert ist – vorausgesetzt, Sie kennen das Passwort.

### Wiederherstellungsprozess

1.  Klicken Sie im Menü auf **Datei** > **Backup wiederherstellen...** (oder `Cmd/Strg + Shift + B`).
2.  Bestätigen Sie den Warnhinweis (alle aktuellen Daten werden überschrieben!).
3.  Wählen Sie Ihre Backup-Datei aus.
4.  Geben Sie Ihr Backup-Passwort ein.

<div style={{ margin: '2rem 0' }}>
  <RestoreFlowMock />
  <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>Interaktive Vorschau: Der Wiederherstellungs-Prozess</p>
</div>

Nach der erfolgreichen Wiederherstellung werden Ihre Daten automatisch mit dem Schlüssel des **neuen** Computers neu verschlüsselt und sicher gespeichert.

## FAQ

### Ich habe mein Backup-Passwort vergessen. Was nun?
Da wir keine Hintertüren eingebaut haben, gibt es **keine Möglichkeit**, ein Backup ohne das Passwort wiederherzustellen. Bitte bewahren Sie Ihr Passwort sicher auf!

### Kann ich meine Daten in der Cloud (Dropbox/iCloud) speichern?
Ja, aber beachten Sie: Die "rohen" Datendateien sind maschinengebunden. Wir empfehlen, stattdessen regelmäßig Backups in Ihren Cloud-Ordner zu speichern.
