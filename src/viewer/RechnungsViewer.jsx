
import React, { useEffect, useState, useRef } from 'react';
import { Box, FormControl, IconButton, Table, Textarea, Tooltip, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { getKunde, handleLoadFile } from '../Scripts/Filehandler';
import html2pdf from 'html2pdf.js';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';

// A4: 210mm x 297mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15; // padding on all sides
const TABLE_ROW_HEIGHT_MM = 10; // estimated row height
const HEADER_HEIGHT_MM = 45; // estimated header height
const FOOTER_HEIGHT_MM = 35; // estimated footer height
const ROWS_PER_PAGE = 6;

function formatPrice(value) {
  return Number(value).toFixed(2) + '€';
}

function RechnungsViewer({ rechnung, unternehmen }) {
  const [data, setData] = useState(null);
  const [kunde, setKunde] = useState(null);
  const navigate = useNavigate();
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const jsonstring = await handleLoadFile("rechnungen/" + rechnung);
      const json = JSON.parse(jsonstring);
      setData(json);
    };
    fetchData();
  }, [rechnung]);

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
    { icon: <PictureAsPdfOutlinedIcon />, label: "Als PDF exportieren", click: handleExportPDF },
    { icon: <PrintOutlinedIcon />, label: "Drucken", click: () => handlePrintPDF() },
    { icon: <SendOutlinedIcon />, label: "Als E-Rechnung exportieren" },
    { icon: <ForwardToInboxOutlinedIcon/>, label: "Per Email weiterverschicken"},
    { icon: <DeleteOutlineOutlinedIcon />, label: "Löschen", color: 'danger' },
  ];

  // Table columns
  const columns = [
    { key: 'position', label: 'Position', style: { width: '10%', textAlign: 'center' } },
    { key: 'bezeichnung', label: 'Bezeichnung', style: { width: '40%', textAlign: 'left' } },
    { key: 'menge', label: 'Menge', style: { width: '15%', textAlign: 'center' } },
    { key: 'einzelpreis', label: 'Einzelpreis', style: { width: '15%', textAlign: 'right' } },
    { key: 'gesamt', label: 'Gesamt', style: { width: '20%', textAlign: 'right' } },
  ];

  // Head component
  function Head({ page, of }) {
    return (
      <>
        <Box sx={{ width: '100%', minHeight: 0, mb: 2, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Typography level="h2" sx={{ maxWidth: "60%" }}>{unternehmen?.unternehmensname}</Typography>          
            <img
              src={"/logo.png"}
              alt="Logo"
              style={{ height: "150px", width: "auto" }}
              onError={(e) => (e.target.style.display = 'none')}
            />
          
        </Box>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography level='body-xs'>Herr/Frau</Typography>
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
        <Typography level="body-xs" sx={{ fontSize: "8px" }} fontWeight="bold">{unternehmen?.unternehmensname}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "8px" }}>{unternehmen?.strasse} {unternehmen?.hausnummer}, {unternehmen?.postleitzahl} {unternehmen?.stadt}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "8px" }}>Tel: {unternehmen?.sonstigeTelefonnummer}, Email: {unternehmen?.sonstigeEmail}, {unternehmen?.website}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "8px" }}>{unternehmen?.bankname}, IBAN: {unternehmen?.bankverbindung}, BIC: {unternehmen?.bic}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "8px" }}>{unternehmen?.handelsregisternummer}, Inhaber: {unternehmen?.inhaber}, USt-ID-NR: {unternehmen?.umsatzsteuerId}, Steuer-Nr: {unternehmen?.steuernr}</Typography>
        <Typography level='body-xs' sx={{ fontSize: "8px" }}>Zu zahlen innerhalb 14 Tagen nach Zustellung ohne Zuschläge</Typography>
      </Box>
    )
  }

  // Render all pages
  let pages = [];
  let runningTotalList = [];
  if (data) {
    const positions = getPositions();
    const rowsPerPage = ROWS_PER_PAGE;
    pages = splitIntoPages(positions, rowsPerPage);
    runningTotalList = runningTotals(positions);
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

      {/* Invoice Pages */}
      {data && (
        <Box ref={pdfRef}>
          {pages.map((pageRows, pIdx) => {
            const pageCount = pages.length;
            const currentPage = pIdx + 1;
            const pageStartIndex = pIdx * ROWS_PER_PAGE;
            // Übertrag is the running total up to the last row of this page
            const uebertrag = runningTotalList[pageStartIndex + pageRows.length - 1];
            const prevUebertrag = pageStartIndex === 0 ? 0 : runningTotalList[pageStartIndex - 1];
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
                        <td style={{ ...columns[3].style, padding: '2mm' }}>{formatPrice(row.price)}</td>
                        <td style={{ ...columns[4].style, padding: '2mm' }}>{formatPrice(row.total)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3}></td>
                      <td style={{ fontWeight: 'bold', padding: '2mm', textAlign: 'right' }}>
                        {isLastPage ? "Summe" : "Übertrag"}
                      </td>
                      <td style={{ fontWeight: 'bold', padding: '2mm', textAlign: 'right' }}>
                        {isLastPage
                          ? formatPrice(summeGesamt)
                          : formatPrice(uebertrag)
                        }
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {
                  isLastPage && data.comment && data.comment != "" && (

                    <Typography sx={{ fontSize: "10px" }}>{data.comment}</Typography>
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