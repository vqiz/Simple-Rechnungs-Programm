import React, { useState, useEffect } from 'react';
import { getbrutto, getTaxAmount, getNetto } from '../../Scripts/ERechnungInterpretter';
import { formatPrice } from '../../lib/utils'; // wait, does formatPrice exist in utils?

// Constants from RechnungsViewer
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15;
const ROWS_PER_PAGE = 6;

function formatPriceLocal(value, currency = '€') {
    return Number(value).toFixed(2) + currency;
}

export default function PdfRechnungView({ rechnungId, data, kunde, unternehmen, logoPath }) {
    // Helper to get invoice date from filename
    function getInvoiceDate() {
        const parts = rechnungId.split("-");
        if (parts.length >= 4) {
            const jahr = parts[0].replace("R", "");
            const monat = parts[1];
            const tag = parts[2];
            return `${tag}.${monat}.${jahr}`;
        }
        return rechnungId;
    }

    // Calculate all positions as array
    function getPositions() {
        if (!data?.positionen || !data?.items?.list) return [];
        return Object.entries(data.positionen).map(([key, amount]) => {
            const [category, itemName] = key.split("_");
            const item = data.items.list.find(i => i.name === category);
            const found = item?.content.find(i => i.name === itemName);
            const price = found?.price ?? 0;
            return {
                key,
                category,
                itemName,
                amount,
                price,
                total: amount * price,
            };
        });
    }

    function splitIntoPages(positions, rowsPerPage) {
        const pages = [];
        for (let i = 0; i < positions.length; i += rowsPerPage) {
            pages.push(positions.slice(i, i + rowsPerPage));
        }
        if (pages.length === 0) return [[]];
        return pages;
    }

    function runningTotals(positions) {
        const totals = [];
        let sum = 0;
        for (let i = 0; i < positions.length; ++i) {
            sum += positions[i].total;
            totals.push(sum);
        }
        return totals;
    }

    // Table columns
    const columns = [
        { key: 'position', label: 'Pos', style: { width: '8%', textAlign: 'center' } },
        { key: 'bezeichnung', label: 'Bezeichnung', style: { width: '42%', textAlign: 'left' } },
        { key: 'menge', label: 'Menge', style: { width: '15%', textAlign: 'center' } },
        { key: 'einzelpreis', label: 'Einzelpreis', style: { width: '15%', textAlign: 'right' } },
        { key: 'gesamt', label: 'Gesamt', style: { width: '20%', textAlign: 'right' } },
    ];

    function Head({ page, of }) {
        return (
            <>
                <div style={{ width: '100%', marginBottom: '16px', display: "flex", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#000', margin: 0 }}>{unternehmen?.unternehmensname}</h2>
                    {logoPath && <img src={logoPath} alt="Logo" style={{ height: "100px", width: "auto", objectFit: 'contain' }} onError={(e) => (e.target.style.display = 'none')} />}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '16px' }}>
                    <div>
                        <p style={{ fontSize: '10pt', margin: 0, color: '#000' }}>{!kunde?.istfirma && "Herr/Frau"}</p>
                        <p style={{ fontSize: '10pt', fontWeight: 'bold', margin: 0, color: '#000' }}>{kunde?.name}</p>
                        <p style={{ fontSize: '10pt', margin: 0, color: '#000' }}>{kunde?.street} {kunde?.number}</p>
                        <p style={{ fontSize: '10pt', margin: 0, color: '#000' }}>{kunde?.plz} {kunde?.ort}</p>
                    </div>
                    <div style={{ minWidth: 150, textAlign: 'right' }}>
                        <h4 style={{ fontSize: '16px', margin: '0 0 4px 0', color: '#000' }}>Rechnung</h4>
                        <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Nr: {rechnungId.split("-")[3]}</p>
                        <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Datum: {getInvoiceDate()}</p>
                        <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Kundennr: {data?.kundenId}</p>
                        <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Seite {page} / {of}</p>
                    </div>
                </div>
            </>
        );
    }

    function Footer() {
        return (
            <div style={{ width: "100%", marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '9px', color: '#666' }}>
                    <div>
                        <b>{unternehmen?.unternehmensname}</b><br />
                        {unternehmen?.strasse} {unternehmen?.hausnummer}, {unternehmen?.postleitzahl} {unternehmen?.stadt}<br />
                        Tel: {unternehmen?.sonstigeTelefonnummer} • {unternehmen?.website}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        Zahlungsempfänger: {unternehmen?.kontoinhaber}<br />
                        {unternehmen?.bankname}<br />
                        IBAN: {unternehmen?.bankverbindung} • BIC: {unternehmen?.bic}<br />
                        USt-ID: {unternehmen?.umsatzsteuerId}
                    </div>
                </div>
                {!unternehmen?.mwst && (
                    <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</div>
                )}
            </div>
        )
    }

    if (!data || !unternehmen || !kunde) return null;

    const positions = getPositions();
    const pages = splitIntoPages(positions, ROWS_PER_PAGE);
    const runningTotalList = runningTotals(positions);

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            {pages.map((pageRows, pIdx) => {
                const currentPage = pIdx + 1;
                const uebertrag = runningTotalList[pIdx * ROWS_PER_PAGE + pageRows.length - 1];
                const isLastPage = currentPage === pages.length;
                const summeGesamt = runningTotalList[runningTotalList.length - 1] || 0;

                return (
                    <div key={pIdx} style={{
                        width: `${A4_WIDTH_MM}mm`,
                        minHeight: `${A4_HEIGHT_MM}mm`,
                        background: 'white',
                        padding: `${PAGE_PADDING_MM}mm`,
                        display: 'flex', flexDirection: 'column',
                        marginBottom: '16px',
                        position: 'relative',
                        color: 'black',
                        boxSizing: 'border-box'
                    }}>
                        <Head page={currentPage} of={pages.length} />

                        <div style={{ flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #000' }}>
                                        {columns.map(col => (
                                            <th key={col.key} style={{ ...col.style, padding: '8px 4px', fontSize: '12px', fontWeight: 'bold', color: 'black' }}>{col.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageRows.map((row, idx) => (
                                        <tr key={row.key} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ ...columns[0].style, padding: '8px 4px', fontSize: '12px' }}>{(pIdx * ROWS_PER_PAGE) + idx + 1}</td>
                                            <td style={{ ...columns[1].style, padding: '8px 4px', fontSize: '12px' }}>{row.itemName}</td>
                                            <td style={{ ...columns[2].style, padding: '8px 4px', fontSize: '12px' }}>{row.amount}</td>
                                            <td style={{ ...columns[3].style, padding: '8px 4px', fontSize: '12px' }}>{formatPriceLocal(row.price, unternehmen?.waehrung)}</td>
                                            <td style={{ ...columns[4].style, padding: '8px 4px', fontSize: '12px' }}>{formatPriceLocal(row.total, unternehmen?.waehrung)}</td>
                                        </tr>
                                    ))}
                                    {/* Totals Section */}
                                    <tr>
                                        <td colSpan={3}></td>
                                        <td style={{ padding: '8px 4px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #000' }}>
                                            {isLastPage ? (unternehmen.mwst ? "Netto" : "Summe") : "Übertrag"}
                                        </td>
                                        <td style={{ padding: '8px 4px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #000' }}>
                                            {isLastPage ? formatPriceLocal(summeGesamt, unternehmen?.waehrung) : formatPriceLocal(uebertrag, unternehmen?.waehrung)}
                                        </td>
                                    </tr>
                                    {isLastPage && unternehmen.mwst && (
                                        <>
                                            <tr>
                                                <td colSpan={3}></td>
                                                <td style={{ padding: '4px', fontSize: '12px', textAlign: 'right' }}>zzgl. USt.</td>
                                                <td style={{ padding: '4px', fontSize: '12px', textAlign: 'right' }}>{getTaxAmount(data)}{unternehmen?.waehrung || '€'}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}></td>
                                                <td style={{ padding: '8px 4px', fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>Brutto</td>
                                                <td style={{ padding: '8px 4px', fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>{getbrutto(data)}{unternehmen?.waehrung || '€'}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                            {isLastPage && data.comment && (
                                <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                    <p style={{ fontSize: '10px', margin: 0 }}>{data.comment}</p>
                                </div>
                            )}
                        </div>
                        <Footer />
                    </div>
                );
            })}
        </div>
    );
}
