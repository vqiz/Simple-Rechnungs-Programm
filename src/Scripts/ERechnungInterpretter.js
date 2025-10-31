import { create } from "xmlbuilder2";

export function createERechnung(rechnung, data, kunde, unternehmen) {

    const doc = create({ version: "1.0", encoding: "UTF-8" })
        .ele("Invoice", {
            xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
            "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
            "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
        })
        .ele("cbc:CustomizationID").txt("urn:cen.eu:en16931:2017").up()
        .ele("cbc:ProfileID").txt("urn:fdc:peppol.eu:2017:poacc:billing:01:1.0").up()
        .ele("cbc:ID").txt(rechnung || "undefined").up()
        .ele("cbc:IssueDate").txt(getInvoiceDate(rechnung)).up()
        .ele("cbc:InvoiceTypeCode").txt("380").up()
        .ele("cbc:DocumentCurrencyCode").txt("EUR").up();

    // Accounting Supplier Party
    const supplierParty = doc
        .ele("cac:AccountingSupplierParty")
        .ele("cac:Party");
    // Add VAT ID always directly under <cac:Party>
    if (unternehmen.umsatzsteuerId && unternehmen.umsatzsteuerId.trim() !== "") {
        supplierParty.ele("cbc:CompanyID", { "schemeID": "DE:UStId" })
            .txt(unternehmen.umsatzsteuerId.trim())
            .up();
    }
    supplierParty
        .ele("cbc:EndpointID", { "schemeID": "EMail" }).txt(unternehmen.sonstigeEmail).up()
        .ele("cbc:PartyName")
            .ele("cbc:Name").txt(unternehmen.unternehmensname).up()
        .up()
        .ele("cac:PostalAddress")
            .ele("cbc:StreetName").txt(unternehmen.strasse + " " + unternehmen.hausnummer).up()
            .ele("cbc:CityName").txt(unternehmen.stadt).up()
            .ele("cbc:PostalZone").txt(unternehmen.postleitzahl).up()
            .ele("cac:Country")
                .ele("cbc:IdentificationCode").txt(unternehmen.laenderCode).up()
            .up()
        .up();

    supplierParty
        .ele("cac:PartyLegalEntity")
            .ele("cbc:RegistrationName").txt(unternehmen.unternehmensname).up()
            .ele("cbc:CompanyID").txt(unternehmen.handelsregisternummer || "").up()
        .up()
        .up()
        .up()

        .ele("cac:AccountingCustomerParty")
        .ele("cac:Party")
        .ele("cbc:EndpointID", { "schemeID": "EMail" }).txt(kunde.email).up()
        .ele("cac:PartyName")
        .ele("cbc:Name").txt(kunde.name).up()
        .up()
        .ele("cac:PostalAddress")
        .ele("cbc:StreetName").txt(kunde.street + (kunde.number ? " " + kunde.number : "")).up()
        .ele("cbc:CityName").txt(kunde.ort).up()
        .ele("cbc:PostalZone").txt(kunde.plz).up()
        .ele("cbc:CountryID").txt("DE").up()
        .up()
        .ele("cbc:BuyerReference").txt(kunde.leitwegid && kunde.leitwegid.trim() !== "" ? kunde.leitwegid : "none").up()
        .ele("cac:PartyLegalEntity")
          .ele("cbc:RegistrationName").txt(kunde.name).up()
        .up()
        .up()
        .up()

        .ele("cbc:DueDate").txt(getInvoiceDatePlusTwoWeeks(rechnung)).up();

    //Loop Positions 
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const posnummer = index + 1;
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;
        const steuer = kath.content.find((i) => i.name === name).steuer;
        doc.ele("cac:InvoiceLine")
            .ele("cbc:ID").txt(posnummer).up()
            .ele("cbc:InvoicedQuantity", { "unitCode": name.toLocaleLowerCase().includes("stunde") ? "HUR" : "EA" }).txt(amout).up()
            .ele("cbc:LineExtensionAmount", { "currencyID": "EUR" }).txt(Number(amout * price).toFixed(2)).up()
            .ele("cac:Item")
            .ele("cbc:Name").txt(name).up()
            .ele("cac:ClassifiedTaxCategory")
              .ele("cbc:ID").txt("S").up()
              .ele("cbc:Percent").txt(unternehmen.mwst ? steuer : 0).up()
              .ele("cac:TaxScheme")
                .ele("cbc:ID").txt("VAT").up()
              .up()
            .up()
            .up()
            .ele("cac:Price")
            .ele("cbc:PriceAmount", { "currencyID": "EUR" }).txt(price).up()
            .up()
            .up();
    })

        // Payment information
        const paymentMeans = doc.ele("cac:PaymentMeans");
        paymentMeans.ele("cbc:PaymentMeansCode").txt("30").up(); // 30 = Banküberweisung
        paymentMeans.ele("cbc:PaymentDueDate").txt(getInvoiceDatePlusTwoWeeks(rechnung)).up();

        const payeeAccount = paymentMeans.ele("cac:PayeeFinancialAccount");
        payeeAccount.ele("cbc:ID").txt((unternehmen.bankverbindung || "DE00000000000000000000").replace(/\s+/g, "").replace(/[^A-Za-z0-9]/g, "")).up();
        payeeAccount.ele("cbc:Name").txt(unternehmen.kontoinhaber).up();

        if (unternehmen.bic) {
            const branch = payeeAccount.ele("cac:FinancialInstitutionBranch");
            branch.ele("cbc:ID").txt(unternehmen.bic).up(); // directly under Branch
            const fi = branch.ele("cac:FinancialInstitution");
            fi.ele("cbc:ID").txt(unternehmen.bic).up();    // under FinancialInstitution
            fi.up();
            branch.up();
        }

        payeeAccount.up();

    paymentMeans.up(); // close PaymentMeans

    doc
        .ele("cac:PaymentTerms")
          .ele("cbc:Note").txt("Zahlbar innerhalb von 14 Tagen ohne Abzug.").up()
        .up()
        .ele("cac:LegalMonetaryTotal")
        .ele("cbc:LineExtensionAmount", { "currencyID": "EUR" }).txt(getNetto(data)).up()
        .ele("cbc:TaxExclusiveAmount", { "currencyID": "EUR" }).txt(getNetto(data)).up()
        .ele("cbc:TaxInclusiveAmount", { "currencyID": "EUR" }).txt(unternehmen.mwst ? getbrutto(data) : getNetto(data)).up()
        .ele("cbc:PayableAmount", { "currencyID": "EUR" }).txt(unternehmen.mwst ? getbrutto(data) : getNetto(data)).up()
        .up()

    const taxTotal = doc
        .ele("cac:TaxTotal")
        .ele("cbc:TaxAmount", { "currencyID": "EUR" })
        .txt(unternehmen.mwst ? getTaxAmount(data) : "0.00")
        .up();

    if (unternehmen.mwst) {
        getSteuersätze(data).map((steuersatz) => {
            taxTotal
                .ele("cac:TaxSubtotal")
                .ele("cbc:TaxableAmount", { "currencyID": "EUR" }).txt(getTaxableAmountbySteuersatz(data, steuersatz)).up()
                .ele("cbc:TaxAmount", { "currencyID": "EUR" }).txt(getTaxamountbySatz(data, steuersatz)).up()
                .ele("cac:TaxCategory")
                  .ele("cbc:ID").txt("S").up()
                  .ele("cbc:Percent").txt(steuersatz).up()
                  .ele("cac:TaxScheme")
                    .ele("cbc:ID").txt("VAT").up()
                  .up()
                .up()
              .up();
        });
    } else {
        taxTotal
            .ele("cac:TaxSubtotal")
              .ele("cbc:TaxableAmount", { "currencyID": "EUR" }).txt(getNetto(data)).up()
              .ele("cbc:TaxAmount", { "currencyID": "EUR" }).txt("0.00").up()
              .ele("cac:TaxCategory")
                .ele("cbc:ID").txt("E").up()
                .ele("cbc:Percent").txt(0).up()
                .ele("cac:TaxScheme")
                  .ele("cbc:ID").txt("VAT").up()
                .up()
              .up()
            .up();
    }

    taxTotal.up();
    if (
        data.comment
    ){
        doc.ele("cbc:Note").txt(data.comment);
        
    }

    window.api.saveERechnung(doc.end({ prettyPrint: true }), rechnung + ".xml");

}

function getTaxamountbySatz(data, satz) {
    let i = 0;
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;
        if (kath.content.find((i) => i.name === name).steuer === satz) {
            i = i + (price * amout * (satz / 100))
        }
    });
    return Number(i).toFixed(2);
}
function getTaxableAmountbySteuersatz(data, satz) {
    let i = 0;
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;
        if (kath.content.find((i) => i.name === name).steuer === satz) {
            i = i + (price * amout)
        }
    })
    return Number(i).toFixed(2);

}

function getSteuersätze(data) {

    let i = []
    data.items.list.map((item) => {
        item.content.map((content) => {
            if (!i.includes(content.steuer)) {
                i.push(content.steuer)
            }
        })
    })
    return i;
}








function getbrutto(data) {
    let i = 0;
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;

        i = i + (amout * price + (price * amout * (kath.content.find((i) => i.name === name).steuer / 100)));

    })
    return Number(i).toFixed(2);
}
function getNetto(data) {
    let i = 0;
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;

        i = i + amout * price;

    })
    return Number(i).toFixed(2);
}

function getTaxSumAmount(data) {
    let i = 0;
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;
        if (kath.content.find((i) => i.name === name).steuer > 0) {
            i = i + amout * price;
        }
    })
    return Number(i).toFixed(2);
}


function getTaxAmount(data) {
    let i = 0;
    Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;
        i = i + (price * amout * (kath.content.find((i) => i.name === name).steuer / 100))
    })
    return Number(i).toFixed(2);
}

export function getInvoiceDate(rechnung) {
    const parts = rechnung.split("-");
    if (parts.length >= 4) {
        const jahr = parts[0].substring(1);
        const monat = parts[1];
        const tag = parts[2];

        return `${jahr}-${monat}-${tag}`;
    }
    return rechnung;
}
function getInvoiceDatePlusTwoWeeks(rechnung) {
  const originalDateStr = getInvoiceDate(rechnung);
  const [year, month, day] = originalDateStr.split("-").map(Number); // <- hier ändern!

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 14);

  const dayStr = String(date.getDate()).padStart(2, "0");
  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
  const yearStr = date.getFullYear();

  return `${yearStr}-${monthStr}-${dayStr}`;
}