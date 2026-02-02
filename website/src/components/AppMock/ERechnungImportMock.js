import React from 'react';
import '../AppMock.css';

export default function ERechnungImportMock() {
    return (
        <div className="app-mock">
            <div className="file-upload-demo" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>E-Rechnung Import</h3>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        Laden Sie eine XRechnung oder ZUGFeRD XML-Datei hoch
                    </p>

                    <div style={{
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        padding: '3rem 2rem',
                        marginBottom: '2rem',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                        <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                            Datei hier ablegen oder klicken zum Auswählen
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>
                            Unterstützte Formate: .xml (XRechnung, ZUGFeRD)
                        </p>
                        <button className="button button-primary" style={{ marginTop: '1rem' }}>
                            📁 Datei auswählen
                        </button>
                    </div>

                    <div className="alert alert-info">
                        <strong>Automatisch erkannt:</strong>
                        <div style={{ marginTop: '0.5rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            • Lieferant/Anbieter<br />
                            • Rechnungsbetrag (Brutto/Netto)<br />
                            • Rechnungsdatum<br />
                            • Rechnungsnummer<br />
                            • Einzelpositionen
                        </div>
                    </div>
                </div>

                {/* Success state example */}
                <div className="card" style={{ padding: '1.5rem', marginTop: '2rem', borderLeft: '4px solid #4caf50' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>✅</div>
                        <div>
                            <strong>E-Rechnung erfolgreich importiert!</strong>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                                <div><strong>Titel:</strong> Software-Lizenz (1x), Support-Paket (1x)</div>
                                <div><strong>Anbieter:</strong> Software GmbH</div>
                                <div><strong>Betrag:</strong> 119,00 €</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
