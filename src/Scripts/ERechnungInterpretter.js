import { create } from "xmlbuilder2";
export function createERechnung(rechnung, data, kunde) {

    const doc = create({ version: "1.0", encoding: "UTF-8" })
        .ele("Invoice", {
            xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice‑2",
            "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents‑2",
            "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents‑2",
        })
            .ele("cbc:ID", data.rechnung).up()
            .ele("cbc:IssueDate",getInvoiceDate(rechnung).replace(".", "-")).up()
            .ele("cbc:InvoiceTypeCode", 380).up()
            .ele("cbc:DocumentCurrencyCode","EUR").up()
            .ele("cbc:ProfileID", "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0").up()
            .ele("cac:AccountingSupplierParty")
                .ele("cac:Party")
                    .ele("cbc:EndpointID",{"schemeID": "EM"}).txt(kunde.emai).up()
                    .ele("cbc:PartyName")
                        .ele("cbc:Name", kunde.name).up()
                    .up()
                    .ele("cac:PostalAdress")
                        .ele("cbc:StreetName", kunde.street + " " + kunde.number)

}
export function getInvoiceDate(rechnung) {
    const parts = rechnung.split("-");
    if (parts.length >= 4) {
        const jahr = parts[0].substring(1);
        const monat = parts[1];
        const tag = parts[2];
        return `${tag}.${monat}.${jahr}`;
    }
    return rechnung;
}