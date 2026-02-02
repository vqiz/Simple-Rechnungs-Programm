import React from 'react';
import '../AppMock.css';

export default function PaymentModalMock() {
    return (
        <div className="app-mock">
            <div className="modal-overlay">
                <div className="modal-dialog" style={{ width: '600px', maxWidth: '90vw' }}>
                    <div className="modal-header">
                        <h3>Zahlung erfassen</h3>
                    </div>
                    <div className="divider"></div>

                    <div className="modal-body" style={{ padding: '1.5rem' }}>
                        {/* Invoice Info */}
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Rechnung: <span className="chip chip-soft">R2024-2-1-42</span>
                            </div>
                            <div style={{ fontWeight: 'bold' }}>
                                Rechnungsbetrag: 1.250,00 €
                            </div>
                        </div>

                        {/* Payment Type */}
                        <div className="form-control">
                            <label>Zahlungsart</label>
                            <select className="select">
                                <option>Vollständige Zahlung</option>
                                <option>Teilzahlung</option>
                            </select>
                        </div>

                        {/* Amount and Date Row */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-control" style={{ flex: 1 }}>
                                <label>Betrag (€)</label>
                                <input type="number" value="1250.00" className="input" />
                            </div>
                            <div className="form-control" style={{ flex: 1 }}>
                                <label>Zahlungsdatum</label>
                                <input type="date" className="input" />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="form-control" style={{ marginTop: '1rem' }}>
                            <label>Zahlungsmethode</label>
                            <select className="select">
                                <option>Banküberweisung</option>
                                <option>Bargeld</option>
                                <option>Kartenzahlung</option>
                                <option>PayPal</option>
                                <option>Sonstige</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="button button-outlined">Abbrechen</button>
                        <button className="button button-success">
                            Zahlung erfassen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
