import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trash2, FileText, Printer, Send, DollarSign, Mail, Bell } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Buffer } from 'buffer';

import PaymentModal from '../components/Payment/PaymentModal';
import { getKunde, handleLoadFile, handleSaveFile, getInvoicePaymentStatus } from '../Scripts/Filehandler';
import { createERechnung, getbrutto, getTaxAmount, getNetto } from '../Scripts/ERechnungInterpretter';
import MaskProvider from '../components/MaskProvider';
import DeleteConfirmation from '../components/Produktedit/Masks/DeleteConfirmation';
import MahnungViewer from './MahnungViewer';
import PaymentStatusBadge from '../components/Payment/PaymentStatusBadge';
import '../styles/swiss.css';

// Shadcn Components
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

// A4: 210mm x 297mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15;
const ROWS_PER_PAGE = 6;

function formatPrice(value, currency = '€') {
  return Number(value).toFixed(2) + currency;
}

function RechnungsViewer({ rechnung, unternehmen }) {
  const [data, setData] = useState(null);
  const [kunde, setKunde] = useState(null);
  const navigate = useNavigate();
  const pdfRef = useRef();
  const [delconfirm, setdelconfirm] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mahnungOpen, setMahnungOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const jsonstring = await handleLoadFile("rechnungen/" + rechnung);
      if (!jsonstring || jsonstring.trim() === "") {
        console.error("Rechnungsdatei leer oder nicht gefunden:", rechnung);
        return;
      }
      try {
        const json = JSON.parse(jsonstring);
        setData(json);
      } catch (err) {
        console.error("Fehler beim Parsen der Rechnung:", err);
      }
    };
    fetchData();
  }, [rechnung, refreshTrigger]);

  useEffect(() => {
    if (!data) return;
    const fetchKunde = async () => {
      const k = await getKunde(data.kundenId);
      setKunde(k);
    };
    fetchKunde();
  }, [data]);

  // Helper to get invoice date from filename
  function getInvoiceDate() {
    const parts = rechnung.split("-");
    if (parts.length >= 4) {
      const jahr = parts[0].replace("R", "");
      const monat = parts[1];
      const tag = parts[2];
      return `${tag}.${monat}.${jahr}`;
    }
    return rechnung;
  }

  // Calculate all positions as array for easier splitting
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

  // Split positions into pages based on available rows per page
  function splitIntoPages(positions, rowsPerPage) {
    const pages = [];
    for (let i = 0; i < positions.length; i += rowsPerPage) {
      pages.push(positions.slice(i, i + rowsPerPage));
    }
    if (pages.length === 0) return [[]]; // Ensure at least one page
    return pages;
  }

  // Calculate running totals for Übertrag and Summe
  function runningTotals(positions) {
    const totals = [];
    let sum = 0;
    for (let i = 0; i < positions.length; ++i) {
      sum += positions[i].total;
      totals.push(sum);
    }
    return totals;
  }

  // Action Handlers
  const handleExportPDF = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${rechnung}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = totalPages; i >= 2; i -= 2) { pdf.deletePage(i); }
      pdf.save(`${rechnung}.pdf`);
    });
  };

  const sendEmail = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${rechnung}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = totalPages; i >= 2; i -= 2) { pdf.deletePage(i); }
      const pdfArrayBuffer = pdf.output('arraybuffer');
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');

      window.api.createPdfBuffer(pdfBase64).then((filePath) => {
        window.api.openMail(
          filePath,
          kunde?.email,
          "Rechnung " + rechnung,
          "Sehr geehrte/r " + kunde?.name + ", \n" + "anbei finden Sie Ihre Rechnung."
        );
      });
    });
  };

  const handlePrintPDF = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${rechnung}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = totalPages; i >= 2; i -= 2) { pdf.deletePage(i); }
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    });
  };

  const deleteRechnung = async () => {
    const ur = await handleLoadFile("fast_accsess/u_Rechnungen.db");
    const urJson = JSON.parse(ur);
    urJson.list = urJson.list.filter((i) => i.rechnung !== rechnung);
    await handleSaveFile("fast_accsess/u_Rechnungen.db", JSON.stringify(urJson));

    const temp = await handleLoadFile("fast_accsess/tabs.rechnix");
    let tempjson = JSON.parse(temp);
    tempjson = tempjson.filter((i) => i !== rechnung);
    await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(tempjson));

    if (kunde) {
      kunde.rechnungen = kunde.rechnungen.filter((i) => i !== rechnung);
      await handleSaveFile("kunden/" + kunde.id + ".person", JSON.stringify(kunde));
    }

    window.api.deleteFile("rechnungen/" + rechnung);
    navigate("/invoices");
  };

  // Actions List
  const actions = [
    { icon: DollarSign, label: "Zahlung erfassen", onClick: () => setPaymentModalOpen(true), variant: "default" },
    { icon: Printer, label: "Drucken", onClick: handlePrintPDF, variant: "secondary" },
    { icon: FileText, label: "PDF Export", onClick: handleExportPDF, variant: "secondary" },
    { icon: Send, label: "E-Rechnung (XML)", onClick: () => createERechnung(rechnung, data, kunde, unternehmen), variant: "secondary" },
    { icon: Mail, label: "Per Email", onClick: sendEmail, variant: "secondary" },
    { icon: Bell, label: "Mahnung", onClick: () => setMahnungOpen(true), variant: "secondary" },
    { icon: User, label: "Kunde öffnen", onClick: () => { if (data?.kundenId) navigate("/kunden-viewer/" + data.kundenId); }, variant: "secondary" },
    { icon: Trash2, label: "Löschen", onClick: () => setdelconfirm(true), variant: "destructive" },
  ];

  // Table columns
  const columns = [
    { key: 'position', label: 'Pos', style: { width: '8%', textAlign: 'center' } },
    { key: 'bezeichnung', label: 'Bezeichnung', style: { width: '42%', textAlign: 'left' } },
    { key: 'menge', label: 'Menge', style: { width: '15%', textAlign: 'center' } },
    { key: 'einzelpreis', label: 'Einzelpreis', style: { width: '15%', textAlign: 'right' } },
    { key: 'gesamt', label: 'Gesamt', style: { width: '20%', textAlign: 'right' } },
  ];

  const [logoPath, setLogoPath] = useState("/logo.png");
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const path = await window.api.getFullpath("logo.png");
        setLogoPath("file://" + path);
      } catch (e) { console.error(e); }
    };
    loadLogo();
  }, []);

  // -- Components for PDF --
  function Head({ page, of }) {
    return (
      <>
        <div style={{ width: '100%', marginBottom: '16px', display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#000', margin: 0 }}>{unternehmen?.unternehmensname}</h2>
          <img src={logoPath} alt="Logo" style={{ height: "100px", width: "auto", objectFit: 'contain' }} onError={(e) => (e.target.style.display = 'none')} />
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
            <p style={{ fontSize: '9pt', margin: 0, color: '#555' }}>Nr: {rechnung.split("-")[3]}</p>
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

  // --- Logic for Pages ---
  let pages = [];
  let runningTotalList = [];
  if (data && unternehmen) {
    const positions = getPositions();
    pages = splitIntoPages(positions, ROWS_PER_PAGE);
    runningTotalList = runningTotals(positions);
  }

  if (!data || !unternehmen) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Rechnung wird geladen...</p>
      </div>
    );
  }

  // Correct Check for Small Business (Kleinunternehmer) logic
  const invoiceAmount = unternehmen?.mwst ? getbrutto(data) : getNetto(data);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background/50">
      {/* LEFT: Preview Area - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 flex flex-col items-center gap-4 bg-zinc-100/50 dark:bg-zinc-950/50">
        <div ref={pdfRef} className="max-w-full origin-top transform-gpu">
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
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: `${PAGE_PADDING_MM}mm`,
                display: 'flex', flexDirection: 'column',
                marginBottom: '16px',
                position: 'relative',
                color: 'black' // Force black text for PDF
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
                          <td style={{ ...columns[3].style, padding: '8px 4px', fontSize: '12px' }}>{formatPrice(row.price, unternehmen?.waehrung)}</td>
                          <td style={{ ...columns[4].style, padding: '8px 4px', fontSize: '12px' }}>{formatPrice(row.total, unternehmen?.waehrung)}</td>
                        </tr>
                      ))}
                      {/* Totals Section */}
                      <tr>
                        <td colSpan={3}></td>
                        <td style={{ padding: '8px 4px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #000' }}>
                          {isLastPage ? (unternehmen.mwst ? "Netto" : "Summe") : "Übertrag"}
                        </td>
                        <td style={{ padding: '8px 4px', fontSize: '12px', textAlign: 'right', fontWeight: 'bold', borderTop: '2px solid #000' }}>
                          {isLastPage ? formatPrice(summeGesamt, unternehmen?.waehrung) : formatPrice(uebertrag, unternehmen?.waehrung)}
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
      </div>

      {/* RIGHT: Action Panel */}
      <div className="w-full lg:w-80 h-screen bg-background border-t lg:border-t-0 lg:border-l flex flex-col p-6 gap-6 overflow-y-auto z-10 shadow-lg lg:shadow-none">
        <h2 className="text-lg font-semibold tracking-tight">Aktionen</h2>

        {/* Status Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <PaymentStatusBadge status={getInvoicePaymentStatus(rechnung) || 'unknown'} invoiceNumber={rechnung} />
            </div>
            <div className="text-3xl font-bold">
              {invoiceAmount}{unternehmen?.waehrung || '€'}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant}
              className="w-full justify-start gap-2"
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t hidden lg:block">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">{rechnung}</p>
            <p>Erstellt am {getInvoiceDate()}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {delconfirm && (
        <MaskProvider>
          <DeleteConfirmation
            title="Rechnung löschen?"
            buttontitle="Löschen"
            description="Dies kann nicht rückgängig gemacht werden."
            disable={setdelconfirm}
            confirmfunction={deleteRechnung}
          />
        </MaskProvider>
      )}

      {paymentModalOpen && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          invoiceNumber={rechnung}
          invoiceTotal={invoiceAmount}
          onPaymentRecorded={() => {
            setRefreshTrigger(prev => prev + 1);
            setPaymentModalOpen(false);
          }}
        />
      )}

      {mahnungOpen && (
        <MahnungViewer
          rechnung={rechnung}
          unternehmen={unternehmen}
          open={mahnungOpen}
          onClose={() => setMahnungOpen(false)}
        />
      )}
    </div>
  );
}

export default RechnungsViewer;