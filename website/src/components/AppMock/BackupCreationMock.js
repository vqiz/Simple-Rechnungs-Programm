import React, { useState } from 'react';
import '../AppMock.css';

export default function BackupCreationMock() {
    const [step, setStep] = useState('password'); // password, confirm, success
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handlePasswordSubmit = () => {
        if (password.length >= 4) {
            setStep('confirm');
        }
    };

    const handleConfirmSubmit = () => {
        if (confirm === password) {
            setStep('processing');
            setTimeout(() => setStep('success'), 1500);
        }
    };

    return (
        <div className="app-mock" style={{ padding: '20px', background: '#f5f5f5', minHeight: '300px' }}>

            {/* Mock Menu Bar Context or just the Dialog */}
            <div className="modal-overlay">

                {step === 'password' && (
                    <div className="modal-dialog" style={{ width: '400px' }}>
                        <div className="modal-header">
                            <h3>Backup-Passwort erstellen</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '15px' }}>Wählen Sie ein Passwort für Ihr Backup (min. 4 Zeichen):</p>
                            <div className="form-control">
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Passwort eingeben"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button button-outlined">Abbrechen</button>
                            <button
                                className="button button-primary"
                                onClick={handlePasswordSubmit}
                                disabled={password.length < 4}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                )}

                {step === 'confirm' && (
                    <div className="modal-dialog" style={{ width: '400px' }}>
                        <div className="modal-header">
                            <h3>Passwort bestätigen</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '15px' }}>Bitte geben Sie das Passwort erneut ein:</p>
                            <div className="form-control">
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="Passwort wiederholen"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    autoFocus
                                />
                                {confirm && confirm !== password && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>Passwörter stimmen nicht überein</span>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="button button-outlined" onClick={() => setStep('password')}>Zurück</button>
                            <button
                                className="button button-primary"
                                onClick={handleConfirmSubmit}
                                disabled={confirm !== password}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="modal-dialog" style={{ width: '300px', textAlign: 'center', padding: '20px' }}>
                        <div style={{ margin: '20px 0' }}>
                            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <p>Backup wird verschlüsselt...</p>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="modal-dialog" style={{ width: '400px' }}>
                        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <div style={{ color: '#4caf50', fontSize: '40px', textAlign: 'center', width: '100%' }}>✓</div>
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center' }}>
                            <h3>Backup erfolgreich!</h3>
                            <p>Ihr Backup wurde verschlüsselt gespeichert.</p>
                            <p className="chip chip-soft" style={{ marginTop: '10px' }}>Rechnix-Backup-2024-10-09.rechnix-backup</p>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'center' }}>
                            <button className="button button-primary" onClick={() => setStep('password')}>Schließen</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
