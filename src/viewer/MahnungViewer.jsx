
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Table, Modal, ModalDialog, ModalClose, Select, Option, Divider } from '@mui/joy';
import { getKunde, handleLoadFile, handleSaveFile } from '../Scripts/Filehandler';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import html2pdf from 'html2pdf.js';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { getbrutto, getTaxAmount } from '../Scripts/ERechnungInterpretter';
import { Buffer } from 'buffer';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15;
const ROWS_PER_PAGE = 6;

const MAHNUNG_TEXTS = {
    1: {
        title: "ZAHLUNGSERINNERUNG",
        text: "sicherlich haben Sie in der Hektik des Alltags übersehen, dass die unten aufgeführte Rechnung noch offen ist. Wir bitten Sie, den Betrag innerhalb von 7 Tagen zu begleichen.",
        color: "warning"
    },
    2: {
        title: "1. MAHNUNG",
        text: "trotz unserer Zahlungserinnerung konnten wir bisher keinen Zahlungseingang feststellen. Wir fordern Sie hiermit auf, den fälligen Betrag inklusive Mahngebühren sofort zu überweisen.",
        color: "danger"
    },
    3: {
        title: "2. MAHNUNG / LETZTE MAHNUNG",
        text: "auf unsere bisherigen Schreiben haben Sie nicht reagiert. Dies ist Ihre letzte Gelegenheit, die Forderung zu begleichen, bevor wir rechtliche Schritte einleiten oder ein Inkassobüro beauftragen.",
        color: "danger"
    }
};

const MAHN_GEBUEHREN = {
    1: 0.00,
    2: 2.50,
    3: 5.00
};

function formatPrice(value) {
    return Number(value).toFixed(2) + '€';
}

function MahnungViewer({ rechnung, unternehmen, open, onClose }) {
    const [data, setData] = useState(null);
    const [kunde, setKunde] = useState(null);
    const [mahnungLevel, setMahnungLevel] = useState(1);
    const pdfRef = useRef();
    const [logoPath, setLogoPath] = useState("/logo.png");

    useEffect(() => {
        const load = async () => {
            const jsonstring = await handleLoadFile("rechnungen/" + rechnung);
            if (!jsonstring) return;
            const json = JSON.parse(jsonstring);
            setData(json);
            const k = await getKunde(json.kundenId);
            setKunde(k);

            try {
                const path = await window.api.getFullpath("logo.png");
                setLogoPath("file://" + path);
            } catch (e) { }
        };
        if (open) load();
    }, [rechnung, open]);

    const handleExportPDF = () => {
        if (!pdfRef.current) return;
        const element = pdfRef.current;
        const opt = {
            margin: 0,
            filename: `Mahnung_${rechnung}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handleRecordMahnung = async () => {
        if (!data) return;

        // 1. Update Invoice
        const updatedInvoice = { ...data };
        if (!updatedInvoice.mahnungen) updatedInvoice.mahnungen = [];
        const newMahnung = {
            level: mahnungLevel,
            date: new Date().getTime(),
            gebuehr: MAHN_GEBUEHREN[mahnungLevel],
            total: (parseFloat(getbrutto(updatedInvoice)) + MAHN_GEBUEHREN[mahnungLevel]).toFixed(2)
        };
        updatedInvoice.mahnungen.push(newMahnung);
        // Set Status to Overdue if not already (or keep as is? Mahnung implies overdue)
        // updatedInvoice.status = "overdue"; 

        await handleSaveFile("rechnungen/" + rechnung, JSON.stringify(updatedInvoice));
        setData(updatedInvoice);

        // 2. Update Central Mahnung DB for Overview
        let mahnungDB = { list: [] };
        try {
            const dbStr = await handleLoadFile("fast_accsess/mahnungen.db");
            if (dbStr && dbStr !== "{}") mahnungDB = JSON.parse(dbStr);
        } catch (e) { }

        mahnungDB.list.push({
            rechnungId: rechnung,
            kundenId: updatedInvoice.kundenId,
            kundenName: kunde.name,
            level: mahnungLevel,
            date: new Date().getTime(),
            amount: newMahnung.total
        });

        await handleSaveFile("fast_accsess/mahnungen.db", JSON.stringify(mahnungDB));
        alert("Mahnung wurde gebucht.");
    };

    if (!open || !data || !kunde) return null;

    // Simplified Page Logic for Mahnung (Assuming 1 page for now or reusing split logic if strict)
    // For Mahnung, usually a summary + total is enough, but to be safe let's just list items.

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog sx={{ maxWidth: '90vw', maxHeight: '95vh', overflow: 'auto', p: 0 }}>
                <ModalClose />
                <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'center', bgcolor: 'background.level1', alignItems: 'center' }}>
                    <Select value={mahnungLevel} onChange={(e, val) => setMahnungLevel(val)} sx={{ width: 220 }}>
                        <Option value={1}>Zahlungserinnerung (0€)</Option>
                        <Option value={2}>1. Mahnung (+2.50€)</Option>
                        <Option value={3}>2. Mahnung (+5.00€)</Option>
                    </Select>
                    <Button startDecorator={<PictureAsPdfOutlinedIcon />} onClick={handleExportPDF}>PDF Speichern</Button>
                    <Button startDecorator={<CheckCircleOutlinedIcon />} onClick={handleRecordMahnung} color="success">Als gesendet buchen</Button>
                </Box>

                <Box sx={{ bgcolor: 'grey.100', p: 4, display: 'flex', justifyContent: 'center' }}>
                    <Box ref={pdfRef} sx={{
                        width: `${A4_WIDTH_MM}mm`,
                        minHeight: `${A4_HEIGHT_MM}mm`,
                        bgcolor: 'white',
                        p: `${PAGE_PADDING_MM}mm`,
                        boxShadow: 'md',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                        {/* HEADER */}
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
                                <Typography level="h2">{unternehmen?.unternehmensname}</Typography>
                                <img src={logoPath} style={{ height: "100px", width: "auto" }} onError={(e) => e.target.style.display = 'none'} />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
                                <Box>
                                    <Typography level="body-sm">{kunde.name}</Typography>
                                    <Typography level="body-sm">{kunde.street} {kunde.number}</Typography>
                                    <Typography level="body-sm">{kunde.plz} {kunde.ort}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography level="h3" color={MAHNUNG_TEXTS[mahnungLevel].color}>{MAHNUNG_TEXTS[mahnungLevel].title}</Typography>
                                    <Typography level="body-sm">Rechnung Nr: {rechnung}</Typography>
                                    <Typography level="body-sm">Datum: {new Date().toLocaleDateString()}</Typography>
                                </Box>
                            </Box>

                            <Typography level="body-md" sx={{ mb: 2 }}>
                                Sehr geehrte(r) {kunde.name},
                            </Typography>
                            <Typography level="body-md" sx={{ mb: 4 }}>
                                {MAHNUNG_TEXTS[mahnungLevel].text}
                            </Typography>

                            <Table sx={{ '& thead th:nth-child(1)': { width: '40%' } }}>
                                <thead>
                                    <tr>
                                        <th>Beschreibung</th>
                                        <th style={{ textAlign: 'right' }}>Betrag</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Offener Rechnungsbetrag ({rechnung})</td>
                                        <td style={{ textAlign: 'right' }}>{getbrutto(data)}€</td>
                                    </tr>
                                    {MAHN_GEBUEHREN[mahnungLevel] > 0 && (
                                        <tr>
                                            <td>Mahngebühr</td>
                                            <td style={{ textAlign: 'right' }}>{formatPrice(MAHN_GEBUEHREN[mahnungLevel])}</td>
                                        </tr>
                                    )}
                                    <tr style={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                                        <td>Gesamtsumme</td>
                                        <td style={{ textAlign: 'right' }}>{(parseFloat(getbrutto(data)) + MAHN_GEBUEHREN[mahnungLevel]).toFixed(2)}€</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <Typography level="body-sm" sx={{ mt: 4 }}>
                                Bitte überweisen Sie den Betrag auf das unten angegebene Konto unter Angabe der Rechnungsnummer.
                            </Typography>
                        </Box>

                        {/* FOOTER */}
                        <Box sx={{ borderTop: '1px solid #ddd', pt: 2, mt: 4 }}>
                            <Typography level="body-xs" sx={{ fontSize: '10px', textAlign: 'center' }}>
                                {unternehmen?.unternehmensname} | {unternehmen?.bankname} | IBAN: {unternehmen?.bankverbindung} | BIC: {unternehmen?.bic}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </ModalDialog>
        </Modal>
    );
}

export default MahnungViewer;
