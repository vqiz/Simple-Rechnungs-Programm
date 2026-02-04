
import React, { useEffect, useState, useRef } from 'react';
import { Box, FormControl, IconButton, Table, Textarea, Tooltip, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PaymentModal from '../components/Payment/PaymentModal';
import { getKunde, handleLoadFile, handleSaveFile } from '../Scripts/Filehandler';
import html2pdf from 'html2pdf.js';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import { Buffer } from 'buffer';
import { createERechnung, getbrutto, getTaxAmount, getTaxSumAmount } from '../Scripts/ERechnungInterpretter';
import MaskProvider from '../components/MaskProvider';
import DeleteConfirmation from '../components/Produktedit/Masks/DeleteConfirmation';
import MahnungViewer from './MahnungViewer';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
// A4: 210mm x 297mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15; // padding on all sides
const TABLE_ROW_HEIGHT_MM = 10; // estimated row height
const HEADER_HEIGHT_MM = 45; // estimated header height
const FOOTER_HEIGHT_MM = 35; // estimated footer height
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
      const jahr = parts[0].substring(1);
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

  // PDF Export
  const handleExportPDF = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${rechnung}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: [A4_WIDTH_MM, A4_HEIGHT_MM], orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        // Delete even-numbered pages starting from the last to avoid shifting
        for (let i = totalPages; i >= 2; i -= 2) {
          pdf.deletePage(i);
        }
        pdf.save(`${rechnung}.pdf`);
      });
  };
  const sendEmail = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${rechnung}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: [A4_WIDTH_MM, A4_HEIGHT_MM], orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = totalPages; i >= 2; i -= 2) {
          pdf.deletePage(i);
        }
        const pdfArrayBuffer = pdf.output('arraybuffer');
        const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');

        window.api.createPdfBuffer(pdfBase64).then((filePath) => {
          window.api.openMail(
            filePath,
            kunde?.email,
            "Rechnung " + rechnung,
            "Sehr geehrte/r " + kunde?.name + ", \n" +
            "anbei finden Sie Ihre Rechnung."
          );
        });
      });

  }


  const handlePrintPDF = () => {
    if (!pdfRef.current) return;
    const element = pdfRef.current;

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${rechnung}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: [A4_WIDTH_MM, A4_HEIGHT_MM], orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        // Delete even-numbered pages starting from the last to avoid shifting
        for (let i = totalPages; i >= 2; i -= 2) {
          pdf.deletePage(i);
        }
        pdf.autoPrint();             // print
        window.open(pdf.output('bloburl'), '_blank');
      });
  };



  // Sidebar button definitions
  const sidebarButtons = [
    { icon: <PersonOutlinedIcon />, label: "zum Kunden", click: () => { if (data?.kundenId) navigate("/kunden-viewer/" + data.kundenId); } },
    { icon: <AttachMoneyOutlinedIcon />, label: "Zahlung erfassen", color: 'success', click: () => setPaymentModalOpen(true) },
    { icon: <NotificationImportantOutlinedIcon />, label: "Mahnung erstellen", color: 'warning', click: () => setMahnungOpen(true) },
    { icon: <PictureAsPdfOutlinedIcon />, label: "Als PDF exportieren", click: handleExportPDF },
    { icon: <PrintOutlinedIcon />, label: "Drucken", click: () => handlePrintPDF() },
    { icon: <SendOutlinedIcon />, label: "Als E-Rechnung exportieren", click: () => createERechnung(rechnung, data, kunde, unternehmen) },
    { icon: <ForwardToInboxOutlinedIcon />, label: "Per Email weiterverschicken", click: () => sendEmail() },
    { icon: <DeleteOutlineOutlinedIcon />, label: "Löschen", color: 'danger', click: () => setdelconfirm(true) },
  ];

  // Table columns
  const columns = [
    { key: 'position', label: 'Position', style: { width: '10%', textAlign: 'center' } },
    { key: 'bezeichnung', label: 'Bezeichnung', style: { width: '40%', textAlign: 'left' } },
    { key: 'menge', label: 'Menge', style: { width: '15%', textAlign: 'center' } },
    { key: 'einzelpreis', label: 'Einzelpreis', style: { width: '15%', textAlign: 'right' } },
    { key: 'gesamt', label: 'Gesamt', style: { width: '20%', textAlign: 'right' } },
  ];

  // Load Logo Path
  const [logoPath, setLogoPath] = useState("/logo.png");
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const path = await window.api.getFullpath("logo.png");
        setLogoPath("file://" + path);
      } catch (e) {
        console.error("Failed to load logo path", e);
      }
    };
    loadLogo();
  }, []);

  // Head component
  function Head({ page, of }) {
    return (
      <>
        <Box sx={{ width: '100%', minHeight: 0, mb: 2, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Typography level="h2" sx={{ maxWidth: "60%" }}>{unternehmen?.unternehmensname}</Typography>
          <img
            src={logoPath}
            alt="Logo"
            style={{ height: "150px", width: "auto" }}
            onError={(e) => (e.target.style.display = 'none')}
          />

        </Box>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography level='body-xs'>{!kunde?.istfirma && (<>Herr/Frau</>)}</Typography>
            <Typography level="body-xs">{kunde?.name}</Typography>
            <Typography level="body-xs">{kunde?.street} {kunde?.number}</Typography>
            <Typography level='body-xs'><br /></Typography>
            <Typography level='body-xs'>{kunde?.plz} {kunde?.ort}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
            <Typography level='title-sm'>Rechnung</Typography>
            <Typography level='body-xs'>Rechnungs-Nr: {rechnung.split("-")[3]}</Typography>
            <Typography level='body-xs'>Kunden-Nr: {data?.kundenId}</Typography>
            <Typography level='body-xs'>Ausstellungsdatum: {getInvoiceDate()}</Typography>
            <Typography level='body-xs'>Seite {page} von {of}</Typography>
          </Box>
        </Box>
      </>
    );
  }

  // Footer component
  function Footer() {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>

        <Typography level="body-xs" sx={{ fontSize: "10px" }} fontWeight="bold">{unternehmen?.unternehmensname}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "10px" }}>{unternehmen?.strasse} {unternehmen?.hausnummer}, {unternehmen?.postleitzahl} {unternehmen?.stadt}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "10px" }}>Tel: {unternehmen?.sonstigeTelefonnummer}, Email: {unternehmen?.sonstigeEmail}, {unternehmen?.website}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "10px" }}>{unternehmen?.bankname}, IBAN: {unternehmen?.bankverbindung}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "10px" }}>KontoInhaber: {unternehmen.kontoinhaber}, BIC: {unternehmen?.bic}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "10px" }}>{unternehmen?.handelsregisternummer}, Inhaber: {unternehmen?.inhaber}, USt-ID-NR: {unternehmen?.umsatzsteuerId}, Steuer-Nr: {unternehmen?.steuernr}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "10px" }}>Zu zahlen innerhalb 14 Tagen nach Zustellung ohne Abzüge</Typography>
        {
          !unternehmen.mwst && (
            <Typography level='body-xs' sx={{ fontSize: "10px" }}>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</Typography>
          )
        }

      </Box>
    )
  }
  const deleteRechnung = async (none) => {
    const ur = await handleLoadFile("fast_accsess/u_Rechnungen.db");
    const urJson = JSON.parse(ur);
    urJson.list = urJson.list.filter((i) => i.rechnung !== rechnung);
    await handleSaveFile("fast_accsess/u_Rechnungen.db", JSON.stringify(urJson));


    const temp = await handleLoadFile("fast_accsess/tabs.rechnix");
    let tempjson = JSON.parse(temp);
    tempjson = tempjson.filter((i) => i !== rechnung);
    await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(tempjson));

    kunde.rechnungen = kunde.rechnungen.filter((i) => i !== rechnung);
    await handleSaveFile("kunden/" + kunde.id + ".person", JSON.stringify(kunde));




    window.api.deleteFile("rechnungen/" + rechnung);
    navigate("/kunden-viewer/" + data.kundenId);
  }
  // Render all pages
  let pages = [];
  let runningTotalList = [];
  if (data && unternehmen) {
    const positions = getPositions();
    const rowsPerPage = ROWS_PER_PAGE;
    pages = splitIntoPages(positions, rowsPerPage);
    runningTotalList = runningTotals(positions);
  }

  if (!data || !unternehmen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Rechnung wird geladen...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", pb: 6, background: "#f7f7f7" }}>
      {/* Sidebar Buttons */}
      <Box
        sx={{
          position: "fixed",
          right: 25,
          top: "50%",
          transform: "translateY(-50%)",
          width: 80,
          background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingY: 2,
          gap: 1.5,
          zIndex: 20,
          "&:hover": { boxShadow: "0 12px 24px rgba(0,0,0,0.25)", transition: "box-shadow 0.3s ease" },
        }}
      >
        {sidebarButtons.map((item, idx) => (
          <Tooltip key={idx} title={item.label} placement="left">
            <IconButton
              variant="soft"
              color={item.color}
              size="lg"
              onClick={item.click}
              sx={{ borderRadius: "12px", transition: "all 0.2s ease", "&:hover": { transform: "scale(1.1)" } }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      {
        delconfirm != null && (
          <MaskProvider>
            <DeleteConfirmation title={"Rechnung löschen ?"} buttontitle={"Löschen"}
              description={"Wenn sie die Rechung löschen kann sie nichtmehr wiederhergestellt werden!"}
              disable={setdelconfirm}
              confirmfunction={deleteRechnung}
              parameter={null}
            />
          </MaskProvider>
        )
      }

      {paymentModalOpen && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          invoiceNumber={rechnung}
          invoiceTotal={getbrutto(data)} // Use brutto helper to get total amount
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


      {/* Invoice Pages */}
      {data && (
        <Box ref={pdfRef}>
          {pages.map((pageRows, pIdx) => {
            const pageCount = pages.length;
            const currentPage = pIdx + 1;
            const pageStartIndex = pIdx * ROWS_PER_PAGE;
            // Übertrag is the running total up to the last row of this page
            const uebertrag = runningTotalList[pageStartIndex + pageRows.length - 1];
            // const prevUebertrag = pageStartIndex === 0 ? 0 : runningTotalList[pageStartIndex - 1]; // unused
            const isLastPage = currentPage === pageCount;
            const summeGesamt = runningTotalList[runningTotalList.length - 1] || 0;
            return (
              <Box
                key={pIdx}
                sx={{
                  width: `${A4_WIDTH_MM}mm`,
                  minHeight: `${A4_HEIGHT_MM}mm`,
                  maxWidth: `${A4_WIDTH_MM}mm`,
                  margin: '20px auto',
                  background: "#fff",
                  borderRadius: "6px",
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  padding: `${PAGE_PADDING_MM}mm`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  pageBreakAfter: isLastPage ? 'auto' : 'always',
                  boxSizing: "border-box",
                  overflow: "visible"
                }}
              >
                <Head page={currentPage} of={pageCount} />
                <Table
                  size='sm'
                  sx={{
                    bgcolor: "white",
                    borderRadius: "10px",

                    borderCollapse: 'collapse',
                    width: '100%',
                    tableLayout: 'fixed',

                  }}
                >
                  <thead>
                    <tr>
                      {columns.map(col => (
                        <th
                          key={col.key}
                          style={{
                            ...col.style,
                            borderBottom: '2px solid #000',
                            padding: '3mm 2mm',
                            fontWeight: 700,
                            fontSize: '1em',
                            background: "#f7f7fa"
                          }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => (
                      <tr key={row.key} style={{ borderBottom: '1px solid #e0e0e0', background: idx % 2 === 0 ? "#fff" : "#fafbfc" }}>
                        <td style={{ ...columns[0].style, padding: '2mm', fontWeight: 500 }}>{pageStartIndex + idx + 1}</td>
                        <td style={{ ...columns[1].style, padding: '2mm' }}>{row.itemName}</td>
                        <td style={{ ...columns[2].style, padding: '2mm' }}>{row.amount}x</td>
                        <td style={{ ...columns[3].style, padding: '2mm' }}>{formatPrice(row.price, unternehmen?.waehrung)}</td>
                        <td style={{ ...columns[4].style, padding: '2mm' }}>{formatPrice(row.total, unternehmen?.waehrung)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2}></td>
                      <td style={{ ...columns[2].style, padding: '2mm' }}>
                        {isLastPage ? unternehmen.mwst ? "Netto" : "Summe" : "Übertrag"}
                      </td>
                      <td colSpan={1}></td>
                      <td style={{ padding: '2mm', textAlign: 'right' }}>
                        {isLastPage
                          ? formatPrice(summeGesamt, unternehmen?.waehrung)
                          : formatPrice(uebertrag, unternehmen?.waehrung)
                        }
                      </td>
                    </tr>
                    {

                      isLastPage && unternehmen.mwst && (
                        <tr>
                          <td colSpan={2}></td>
                          <td style={{ ...columns[2].style, padding: '2mm' }}>zzgl. USt.</td>
                          <td colSpan={1}></td>
                          <td style={{ ...columns[4].style, padding: '2mm' }}>{getTaxAmount(data)}{unternehmen?.waehrung || '€'}</td>
                        </tr>
                      )
                    }
                    {
                      isLastPage && unternehmen.mwst && (
                        <tr>
                          <td colSpan={2}></td>
                          <td style={{ ...columns[2].style, padding: '2mm', fontWeight: "bold" }}>Brutto</td>
                          <td colSpan={1}></td>
                          <td style={{ ...columns[4].style, padding: '2mm', fontWeight: "bold" }}>{getbrutto(data)}{unternehmen?.waehrung || '€'}</td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
                {
                  isLastPage && data.comment && data.comment != "" && (

                    <Typography sx={{ fontSize: "12px" }}>{data.comment}</Typography>
                  )
                }
                <Footer />
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  );
}

export default RechnungsViewer;