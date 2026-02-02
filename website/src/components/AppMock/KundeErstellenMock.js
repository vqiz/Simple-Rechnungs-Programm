import React from 'react';
import '../AppMock.css';

export default function KundeErstellenMock() {
    return (
        <div className="app-mock">
            <div className="modal-overlay">
                <div className="modal-dialog" style={{ width: '550px', maxWidth: '90vw' }}>
                    <div className="modal-header">
                        <h3>Kunde erstellen</h3>
                        <button className="icon-button">×</button>
                    </div>
                    <div className="divider"></div>

                    <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Firma Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <span>Privatperson</span>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                            <span>Firma</span>
                        </div>

                        {/* Name Field */}
                        <div className="form-control">
                            <label>Name *</label>
                            <input type="text" placeholder="Max Mustermann" className="input" />
                        </div>

                        {/* Address Fields */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div className="form-control" style={{ flex: 3 }}>
                                <label>Straße</label>
                                <input type="text" placeholder="Musterstraße" className="input" />
                            </div>
                            <div className="form-control" style={{ flex: 1 }}>
                                <label>Nr.</label>
                                <input type="text" placeholder="12" className="input" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div className="form-control" style={{ flex: 1 }}>
                                <label>PLZ</label>
                                <input type="text" placeholder="12345" className="input" />
                            </div>
                            <div className="form-control" style={{ flex: 2 }}>
                                <label>Stadt</label>
                                <input type="text" placeholder="München" className="input" />
                            </div>
                        </div>

                        {/* Contact Fields */}
                        <div className="form-control">
                            <label>E-Mail</label>
                            <input type="email" placeholder="max.mustermann@example.com" className="input" />
                        </div>

                        <div className="form-control">
                            <label>Telefon</label>
                            <input type="tel" placeholder="+49 123 456789" className="input" />
                        </div>

                        {/* Ländercode */}
                        <div className="form-control">
                            <label>Ländercode (ISO)</label>
                            <input type="text" placeholder="DE" className="input" maxLength="2" />
                        </div>

                        {/* Bundesland */}
                        <div className="form-control">
                            <label>Bundesland</label>
                            <input type="text" placeholder="Bayern" className="input" />
                        </div>

                        {/* USt-ID (conditional for firms) */}
                        <div className="form-control">
                            <label>USt-IdNr. (optional)</label>
                            <input type="text" placeholder="DE123456789" className="input" />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="button button-outlined">Abbrechen</button>
                        <button className="button button-success">
                            ✓ Erstellen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
