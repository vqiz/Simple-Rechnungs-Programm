import { Box, Table, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import { handleLoadFile } from '../Scripts/Filehandler';
import { create } from 'xmlbuilder2';
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 15; // padding on all sides
const TABLE_ROW_HEIGHT_MM = 10; // estimated row height
const HEADER_HEIGHT_MM = 45; // estimated header height
const FOOTER_HEIGHT_MM = 35; // estimated footer height
const ROWS_PER_PAGE = 6;
function FileXRechnungViewer({ d }) {
    const [invoiceRoot, setInvoiceRoot] = useState();
    const [verkeufername, setVerkäufername] = useState();
    const [kundenname, setKundenName] = useState();
    const [kundenstreet, setKundenStreet] = useState();
    const [kundenplz, setKundenplz] = useState();
    const [kundencity, setKundenCity] = useState();
    const [rnummer, setRnummer] = useState();
    const [kundennummer, setKundenNummer] = useState();
    const [adatum, setADatum] = useState();
    const [verkeuferstreet, setVerkeuferstreet] = useState();
    const [verkeufercity, setVerkeuferCity] = useState();
    const [verkeuferplz, setVerkeuferPlz] = useState();
    const [verkeufertel, setVerkeuferTel] = useState();
    const [verkeuferemail, setVerkeuferEmail] = useState();
    const [verkeuferiban, setverkeuferIban] = useState();
    const [verkeuferbic, setverkeuferbic] = useState();
    const [verkeuferhregnummer, setVerkeuferhregnummer] = useState()
    useEffect(() => {
        const f = async () => {
            const content = await handleLoadFile("lieferantenrechnungen/" + d.id);
            const doc = create(content);
            const obj = await doc.end({ format: "object" });
            const root = obj.Invoice;

            //vkname
            const vname = root["cac:AccountingSupplierParty"]["cac:Party"]["cac:PartyName"]["cbc:Name"]
            setVerkäufername(vname);

            //kname
            const kname = root["cac:AccountingCustomerParty"]["cac:Party"]["cac:PartyName"]["cbc:Name"]
            setKundenName(kname);

            //kstreet
            const kstreet = root["cac:AccountingCustomerParty"]["cac:Party"]["cac:PostalAddress"]["cbc:StreetName"]
            setKundenStreet(kstreet);

            //kplz
            const kplz = root["cac:AccountingCustomerParty"]["cac:Party"]["cac:PostalAddress"]["cbc:PostalZone"]
            setKundenplz(kplz);

            //kcity
            const kcity = root["cac:AccountingCustomerParty"]["cac:Party"]["cac:PostalAddress"]["cbc:CityName"]
            setKundenCity(kcity);

            //rnummer
            const rn = root["cbc:ID"]
            setRnummer(rn);

            //knummer
            const knummer = root["cbc:BuyerReference"]
            setKundenNummer(knummer);

            //aDatum
            const ad = root["cbc:IssueDate"];
            setADatum(ad);

            //vkstreet
            const vkstreet = root["cac:AccountingSupplierParty"]["cac:Party"]["cac:PostalAddress"]["cbc:StreetName"]
            setVerkeuferstreet(vkstreet);

            //vkcity
            const vkcity = root["cac:AccountingSupplierParty"]["cac:Party"]["cac:PostalAddress"]["cbc:CityName"]
            setVerkeuferCity(vkcity);

            //vkplz
            const vkplz = root["cac:AccountingSupplierParty"]["cac:Party"]["cac:PostalAddress"]["cbc:PostalZone"]
            setVerkeuferPlz(vkplz);


            //vktel
            const vkcon = root["cac:AccountingSupplierParty"]["cac:Party"]["cac:Contact"]
            if (vkcon) {
                const vktel = vkcon["cbc:Telephone"];
                if (vktel) {
                    setVerkeuferTel(vktel);
                }
                const vkemail = vkcon["cbc:ElectronicMail"];
                if (vkemail) {
                    setVerkeuferEmail(vkemail);
                }
            }

            //payment means
            const pmeans = root["cac:PaymentMeans"]
            const pinfo = pmeans["cac:PayeeFinancialAccount"]
            if (pinfo) {
                const vkiban = pinfo["cbc:ID"]
                if (vkiban) {
                    setverkeuferIban(vkiban);
                }
                const vkbic = pinfo["cac:FinancialInstitutionBranch"]
                if (vkbic) {
                    const vkbicid = vkbic["cbc:ID"];
                    setverkeuferbic(vkbicid);
                }
            }

            //vkhandelsreg
            const vpartylegalentity = root["cac:AccountingSupplierParty"]["cac:PartyLegalEntity"]
            if (vpartylegalentity) {
                const vkhreg = vpartylegalentity["cbc:CompanyID"]
                if (vkhreg) {
                    setVerkeuferhregnummer(vkhreg);
                }
            }

            setInvoiceRoot(root);
        }
        if (!d) return;
        f();

    }, [d]);

    function Head() {
        return (
            <>
                <Box sx={{ width: '100%', minHeight: 0, mb: 2, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Typography level="h2" sx={{ maxWidth: "60%" }}>{verkeufername}</Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography level='body-xs'>Herr/Frau</Typography>
                        <Typography level="body-xs">{kundenname}</Typography>
                        <Typography level="body-xs">{kundenstreet}</Typography>
                        <Typography level='body-xs'><br /></Typography>
                        <Typography level='body-xs'>{kundenplz} {kundencity}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
                        <Typography level='title-sm'>Rechnung</Typography>
                        <Typography level='body-xs'>Rechnungs-Nr: {rnummer}</Typography>
                        <Typography level='body-xs'>Kunden-Nr: {kundennummer}</Typography>
                        <Typography level='body-xs'>Ausstellungsdatum: {adatum}</Typography>
                    </Box>
                </Box>
            </>
        );
    }

    // Footer component
    function Footer() {
        return (
            <Box sx={{ width: "100%", mt: 5, mb: 2 }}>
                <Typography level="body-xs" sx={{ fontSize: "8px" }} fontWeight="bold">Dies ist nur eine Visualisierung der WICHTIGSTEN DATEN aus der X-Rechnung <br /> Es wird nicht für die Richtigkeit und vollständigkeit der Daten gehaftet</Typography>
                <Typography level="body-xs" sx={{ fontSize: "8px" }} fontWeight="bold">{verkeufername}</Typography>
                <Typography level='body-xs' sx={{ fontSize: "8px" }}>{verkeuferstreet}, {verkeuferplz} {verkeufercity}</Typography>
                <Typography level='body-xs' sx={{ fontSize: "8px" }}>Tel: {verkeufertel}, Email: {verkeuferemail}</Typography>
                <Typography level='body-xs' sx={{ fontSize: "8px" }}>IBAN: {verkeuferiban}, BIC: {verkeuferbic}</Typography>
                <Typography level='body-xs' sx={{ fontSize: "8px" }}>{verkeuferhregnummer}</Typography>

            </Box>
        )
    }
    const columns = [
        { key: 'position', label: 'Position', style: { width: '10%', textAlign: 'center' } },
        { key: 'bezeichnung', label: 'Bezeichnung', style: { width: '40%', textAlign: 'left' } },
        { key: 'menge', label: 'Menge', style: { width: '15%', textAlign: 'center' } },
        { key: 'einzelpreis', label: 'Einzelpreis', style: { width: '15%', textAlign: 'right' } },
        { key: 'gesamt', label: 'Gesamt', style: { width: '20%', textAlign: 'right' } },
    ];


    return (
        <Box sx={{ width: "100%", pb: 6, background: "#f7f7f7", overflowY: "auto" }}>
            <Box
                sx={{
                    width: `${A4_WIDTH_MM}mm`,
                    maxWidth: `${A4_WIDTH_MM}mm`,
                    minHeight: `${A4_HEIGHT_MM}mm`,
                    margin: '20px auto',
                    background: "#fff",
                    borderRadius: "6px",
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    padding: `${PAGE_PADDING_MM}mm`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start", // changed from "space-between"
                    boxSizing: "border-box",
                    overflow: "visible",
                    // removed fixed height / minHeight
                }}
            >
                <Head />
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
                        {
                            invoiceRoot && invoiceRoot["cac:InvoiceLine"].map((item, index) => {
                                console.log(item["cbc:InvoicedQuantity"])
                                return (
                                    <Box component={"tr"} sx={{ height: "50px" }} key={index}>
                                        <td style={{ ...columns[0].style, padding: '2mm', fontWeight: 500 }}>{index}</td>
                                        <td style={{ ...columns[1].style, padding: '2mm' }}>{item["cac:Item"]["cbc:Name"]}</td>
                                        <td style={{ ...columns[2].style, padding: '2mm' }}>{item["cbc:InvoicedQuantity"]["#"]}</td>
                                        <td style={{ ...columns[3].style, padding: '2mm' }}>{item["cac:Price"]["cbc:PriceAmount"]["#"]}€</td>
                                        <td style={{ ...columns[4].style, padding: '2mm' }}>{item["cbc:LineExtensionAmount"]["#"]}€</td>
                                    </Box>
                                );



                            })
                        }
                        {
                            invoiceRoot && (
                                <Box component={"tr"} sx={{ height: "50px" }}>
                                    <td></td>
                                    <td style={{ ...columns[1].style, padding: '2mm' }}>Mwst.</td>
                                    <td></td>
                                    <td></td>
                                    <td style={{ ...columns[4].style, padding: '2mm' }}>{
                                        Number(invoiceRoot["cac:LegalMonetaryTotal"]["cbc:TaxInclusiveAmount"]["#"]) -
                                        Number(invoiceRoot["cac:LegalMonetaryTotal"]["cbc:TaxExclusiveAmount"]["#"])
                                    }€</td>
                                </Box>
                            )
                        }
                        {
                            invoiceRoot && (
                                <Box component={"tr"} sx={{ height: "50px" }}>
                                    <td></td>
                                    <td style={{ ...columns[1].style, padding: '2mm', fontWeight: "bold" }}>Summe</td>
                                    <td></td>
                                    <td></td>
                                    <td style={{ ...columns[4].style, padding: '2mm' }}>{
                                        Number(invoiceRoot["cac:LegalMonetaryTotal"]["cbc:TaxInclusiveAmount"]["#"])
                                    }€</td>
                                </Box>
                            )
                        }
                    </tbody>
                </Table>
                <Footer />
            </Box>
        </Box>
    )
}

export default FileXRechnungViewer
