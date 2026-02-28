import React, { useState } from "react"
import { Info, Lock, FolderOpen, CheckCircle } from "lucide-react"

const DocInfo = ({ title, children }) => (
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50/50 rounded-lg text-sm text-blue-900 shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100">
        <div className="flex items-center gap-2 font-semibold mb-1">
            <Info className="h-4 w-4 text-primary" />
            {title}
        </div>
        <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
)

// Native Electron password dialog mock
function PasswordDialog({ title, message, onCancel, onConfirm }) {
    const [pw, setPw] = useState("")
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-[400px] rounded-lg overflow-hidden shadow-2xl border border-gray-300"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "white" }}>
                {/* Native macOS dialog title bar */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-1">
                    <div className="flex gap-1.5">
                        <button onClick={onCancel} className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                </div>
                <div className="px-5 py-4">
                    <h3 className="font-semibold text-[15px] mb-1 text-gray-900">{title}</h3>
                    <p className="text-[13px] text-gray-600 mb-3">{message}</p>
                    <input
                        type="password"
                        placeholder="Passwort"
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ boxSizing: 'border-box' }}
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <button onClick={onCancel}
                        className="px-4 py-1.5 text-[13px] rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                        Abbrechen
                    </button>
                    <button onClick={() => onConfirm(pw)}
                        className="px-4 py-1.5 text-[13px] rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium">
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

// Native macOS success dialog mock
function SuccessDialog({ title, message, detail, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-[400px] rounded-lg overflow-hidden shadow-2xl border border-gray-300"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "white" }}>
                <div className="px-5 py-5 flex gap-4 items-start">
                    <CheckCircle className="h-10 w-10 text-green-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-[15px] text-gray-900">{title}</h3>
                        <p className="text-[13px] text-gray-700 mt-1">{message}</p>
                        {detail && <p className="text-[12px] text-gray-500 mt-2 font-mono break-all">{detail}</p>}
                    </div>
                </div>
                <div className="flex justify-end px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <button onClick={onClose}
                        className="px-5 py-1.5 text-[13px] rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium">
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

// Native macOS warning dialog mock
function WarningDialog({ onCancel, onContinue }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-[440px] rounded-lg overflow-hidden shadow-2xl border border-gray-300"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "white" }}>
                <div className="px-5 py-5 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                        <span className="text-white text-2xl font-bold">!</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[15px] text-gray-900">Backup wiederherstellen</h3>
                        <p className="text-[13px] font-semibold text-gray-700 mt-1">WARNUNG: Dies wird alle aktuellen Daten ersetzen!</p>
                        <p className="text-[12px] text-gray-500 mt-2">Möchten Sie fortfahren? Es wird empfohlen, zuerst ein Backup der aktuellen Daten zu erstellen.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <button onClick={onCancel} className="px-4 py-1.5 text-[13px] rounded border border-gray-300 bg-white hover:bg-gray-50">Abbrechen</button>
                    <button onClick={onContinue} className="px-4 py-1.5 text-[13px] rounded bg-red-500 text-white hover:bg-red-600 font-medium">Fortfahren</button>
                </div>
            </div>
        </div>
    )
}

// Step enum for the demo flow
const STEP = { IDLE: 0, PW1: 1, PW2: 2, SAVE: 3, SUCCESS: 4, WARN: 5, PW_RESTORE: 6, RESTORED: 7 }

export default function MockBackup() {
    const [step, setStep] = useState(STEP.IDLE)
    const [pw1, setPw1] = useState("")

    const startBackup = () => setStep(STEP.PW1)
    const startRestore = () => setStep(STEP.WARN)

    return (
        <div className="flex-1 h-[800px] w-full overflow-y-auto bg-background flex flex-col">

            {/* ======= macOS Native Menu Bar Simulation ======= */}
            <div className="h-7 bg-[#ececec] dark:bg-zinc-800 border-b text-[13px] flex items-center px-4 gap-6 shrink-0 select-none"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                <span className="font-semibold">Rechnix</span>
                {/* Datei menu item – highlighted */}
                <button
                    className="px-2 py-0.5 rounded bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700"
                    onClick={startBackup}
                >
                    Datei
                </button>
                <span className="text-gray-500">Bearbeiten</span>
                <span className="text-gray-500">Ansicht</span>
                <span className="text-gray-500">Fenster</span>
                <span className="text-gray-500">Hilfe</span>
            </div>

            {/* ======= Dropdown from "Datei" ======= */}
            <div className="flex justify-start px-4 pt-0">
                <div className="w-64 border border-gray-300 rounded-b shadow-xl bg-white dark:bg-zinc-900 text-[13px] overflow-hidden"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                    <button
                        onClick={startBackup}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white flex justify-between items-center transition-colors group"
                    >
                        <span>Backup erstellen...</span>
                        <kbd className="text-[11px] text-gray-400 group-hover:text-white/70">⌘B</kbd>
                    </button>
                    <button
                        onClick={startRestore}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white flex justify-between items-center transition-colors group"
                    >
                        <span>Backup wiederherstellen...</span>
                        <kbd className="text-[11px] text-gray-400 group-hover:text-white/70">⇧⌘B</kbd>
                    </button>
                    <div className="border-t border-gray-200 my-0.5" />
                    <button className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white transition-colors">
                        Schließen
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-4">
                <DocInfo title="So funktioniert die Datensicherung in Rechnix">
                    Das Backup-Feature ist direkt in das <strong>native Menü</strong> integriert: <em>Datei → Backup erstellen</em> (<kbd>⌘B</kbd>).
                    Es werden alle Daten gesammelt, mit einem Passwort verschlüsselt und als <code>.rechnix-backup</code>-Datei gespeichert.
                    Für die Wiederherstellung: <em>Datei → Backup wiederherstellen</em> (<kbd>⇧⌘B</kbd>). Klicke oben auf die Menüeinträge, um den Dialog-Ablauf live zu sehen!
                </DocInfo>

                <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <div className="flex items-center gap-2 font-medium text-sm"><Lock className="h-4 w-4 text-primary" /> Backup-Format</div>
                        <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
                            <li>Dateiendung: <code className="text-xs bg-muted px-1 rounded">.rechnix-backup</code></li>
                            <li>AES-Verschlüsselung mit Passwort</li>
                            <li>Enthält alle Kunden, Rechnungen, Einstellungen, Logo</li>
                        </ul>
                    </div>
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <div className="flex items-center gap-2 font-medium text-sm"><FolderOpen className="h-4 w-4 text-primary" /> Datenpfad</div>
                        <p className="text-sm text-muted-foreground">Alle Daten liegen in:</p>
                        <code className="block text-xs bg-muted px-2 py-1.5 rounded font-mono break-all">
                            ~/Library/Application Support/Rechnix/
                        </code>
                    </div>
                </div>
            </div>

            {/* ======= INTERACTIVE DIALOGS ======= */}

            {/* CREATE: Step 1 - first password */}
            {step === STEP.PW1 && (
                <PasswordDialog
                    title="Backup-Passwort erstellen"
                    message="Wählen Sie ein Passwort für Ihr Backup (min. 4 Zeichen):"
                    onCancel={() => setStep(STEP.IDLE)}
                    onConfirm={pw => { setPw1(pw); setStep(STEP.PW2) }}
                />
            )}

            {/* CREATE: Step 2 - confirm password */}
            {step === STEP.PW2 && (
                <PasswordDialog
                    title="Passwort bestätigen"
                    message="Bitte geben Sie das Passwort erneut ein:"
                    onCancel={() => setStep(STEP.IDLE)}
                    onConfirm={pw => {
                        if (pw === pw1 || true) setStep(STEP.SUCCESS)  // always succeed in demo
                    }}
                />
            )}

            {/* CREATE: Success dialog */}
            {step === STEP.SUCCESS && (
                <SuccessDialog
                    title="Backup erstellt"
                    message="Backup wurde erfolgreich erstellt!"
                    detail={`Gespeichert unter: ~/Desktop/Rechnix-Backup-${new Date().toISOString().split('T')[0]}.rechnix-backup`}
                    onClose={() => setStep(STEP.IDLE)}
                />
            )}

            {/* RESTORE: Warning dialog */}
            {step === STEP.WARN && (
                <WarningDialog
                    onCancel={() => setStep(STEP.IDLE)}
                    onContinue={() => setStep(STEP.PW_RESTORE)}
                />
            )}

            {/* RESTORE: Password dialog */}
            {step === STEP.PW_RESTORE && (
                <PasswordDialog
                    title="Backup-Passwort"
                    message="Geben Sie das Passwort für dieses Backup ein:"
                    onCancel={() => setStep(STEP.IDLE)}
                    onConfirm={() => setStep(STEP.RESTORED)}
                />
            )}

            {/* RESTORE: Success dialog */}
            {step === STEP.RESTORED && (
                <SuccessDialog
                    title="Backup wiederhergestellt"
                    message="Backup wurde erfolgreich wiederhergestellt!"
                    detail="Bitte starten Sie Rechnix neu, um die Änderungen zu übernehmen."
                    onClose={() => setStep(STEP.IDLE)}
                />
            )}
        </div>
    )
}
