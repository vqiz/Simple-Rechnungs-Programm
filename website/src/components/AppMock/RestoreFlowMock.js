import React, { useState } from 'react';
import '../AppMock.css';

export default function RestoreFlowMock() {
    const [step, setStep] = useState('warning'); // warning, password, success
    const [password, setPassword] = useState('');

    const handleWarningConfirm = () => {
        setStep('file-select');
        // Simulate file selection delay
        setTimeout(() => setStep('password'), 800);
    };

    const handlePasswordSubmit = () => {
        setStep('processing');
        setTimeout(() => setStep('success'), 1500);
    };

    return (
        <div className="app-mock" style={{ padding: '20px', background: '#f5f5f5', minHeight: '300px' }}>

            <div className="modal-overlay">

                {step === 'warning' && (
                    <div className="modal-dialog" style={{ width: '450px', borderLeft: '5px solid #ff9800' }}>
                        <div className="modal-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#ff9800' }}>⚠️</span> Backup wiederherstellen
                            </h3>
                        </div>
                        <div className="modal-body">
                            <p><strong>WARNUNG: Dies wird alle aktuellen Daten ersetzen!</strong></p>
                            <p style={{ color: '#666', marginTop: '10px' }}>
                                Möchten Sie fortfahren? Es wird empfohlen, zuerst ein Backup der aktuellen Daten zu erstellen, falls Sie diese behalten möchten.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="button button-outlined">Abbrechen</button>
                            <button className="button" style={{ background: '#ff9800', color: 'white', border: 'none' }} onClick={handleWarningConfirm}>
                                Fortfahren
                            </button>
                        </div>
                    </div>
                )}

                {step === 'file-select' && (
                    <div className="modal-dialog" style={{ width: '300px', textAlign: 'center', padding: '20px' }}>
                        <p>Öffne Datei-Auswahl...</p>
                    </div>
                )}

                {step === 'password' && (
                    <div className="modal-dialog" style={{ width: '400px' }}>
                        <div className="modal-header">
                            <h3>Backup-Passwort</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '15px' }}>Geben Sie das Passwort für dieses Backup ein:</p>
                            <div className="form-control">
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Passwort"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button button-outlined" onClick={() => setStep('warning')}>Abbrechen</button>
                            <button
                                className="button button-primary"
                                onClick={handlePasswordSubmit}
                                disabled={!password}
                            >
                                Wiederherstellen
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="modal-dialog" style={{ width: '300px', textAlign: 'center', padding: '20px' }}>
                        <div style={{ margin: '20px 0' }}>
                            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #4caf50', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <p>Daten werden wiederhergestellt...</p>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="modal-dialog" style={{ width: '400px' }}>
                        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <div style={{ color: '#4caf50', fontSize: '40px', textAlign: 'center', width: '100%' }}>✓</div>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center' }}>
                            <h3>Wiederherstellung erfolgreich!</h3>
                            <p>Ihre Daten wurden erfolgreich importiert und neu verschlüsselt.</p>
                            <div className="alert alert-info" style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                                Bitte starten Sie Rechnix neu, um die Änderungen zu übernehmen.
                            </div>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'center' }}>
                            <button className="button button-primary" onClick={() => setStep('warning')}>App Neu Starten</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
