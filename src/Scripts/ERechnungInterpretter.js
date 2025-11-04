import { create } from "xmlbuilder2";

export function createERechnung(rechnung, data, kunde, unternehmen) {
  const doc = create({ version: "1.0", encoding: "UTF-8" })
  .ele("Invoice", {
    "xmlns":"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
    "xmlns:cac":"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
    "xmlns:cbc":"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation":"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 UBL-Invoice-2.1.xsd",
  })
  .ele("cbc:CustomizationID").txt("urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:" + rechnung).up()
  .ele("cbc:ProfileID").txt("urn:fdc:peppol.eu:2017:poacc:billing:01:1.0").up()
  .ele("cbc:ID").txt(rechnung).up()
  .ele("cbc:IssueDate").txt(getInvoiceDate(rechnung)).up()
  //änderung!
  .ele("cbc:DueDate").txt(getInvoiceDatePlusTwoWeeks(rechnung)).up()
  //folgtOriginal
  .ele("cbc:InvoiceTypeCode").txt("380").up()
  .ele("cbc:DocumentCurrencyCode").txt("EUR").up()
  .ele("cbc:BuyerReference").txt(kunde.id).up()
  .ele("cac:AccountingSupplierParty")
    .ele("cac:Party")
        .ele("cac:PartyName")
            .ele("cbc:Name").txt(unternehmen.unternehmensname).up()
        .up()
        .ele("cac:PostalAddress")
            .ele("cbc:StreetName").txt(unternehmen.strasse + " " + unternehmen.hausnummer).up()
            .ele("cbc:CityName").txt(unternehmen.stadt).up()
            .ele("cbc:PostalZone").txt(unternehmen.postleitzahl).up()
            .ele("cbc:CountrySubentity").txt(unternehmen.bundesland).up()
            .ele("cac:Country")
                .ele("cbc:IdentificationCode").txt(unternehmen.laenderCode).up()
            .up()
        .up()
        .ele("cac:PartyLegalEntity")
            .ele("cbc:RegistrationName").txt(unternehmen.unternehmensname).up()
            .ele("cbc:CompanyID",{schemeID:"HRA"}).txt(unternehmen.handelsregisternummer).up()
        .up()
        .ele("cac:Contact")
            .ele("cbc:Name").txt(unternehmen.inhaber).up()
            .ele("cbc:Telephone").txt(unternehmen.kontaktTelefon).up()
            .ele("cbc:ElectronicMail").txt(unternehmen.kontaktEmail).up()
        .up()
    .up()
  .up()



  //keufer
  .ele("cac:AccountingCustomerParty")
    .ele("cac:Party")    
        .ele("cac:PartyName")
            .ele("cbc:Name").txt(kunde.name).up()
            
        .up()
    .ele("cac:PostalAddress")
        .ele("cbc:StreetName").txt(kunde.street + " " + kunde.number).up()
        .ele("cbc:CityName").txt(kunde.ort).up()
        .ele("cbc:PostalZone").txt(kunde.plz).up()
        .ele("cbc:CountrySubentity").txt(kunde.bundesland).up()
        .ele("cac:Country")
            .ele("cbc:IdentificationCode").txt(kunde.landcode).up()
        .up()     
    .up()
    .ele("cac:PartyLegalEntity")
        .ele("cbc:RegistrationName").txt(kunde.name).up()
        .ele("cbc:CompanyID").txt(kunde.umstid).up()
    .up()
    .ele("cac:Contact")
        .ele("cbc:Name").txt(kunde.istfirma ? kunde.ansprechpartner : kunde.name).up()
        .ele("cbc:Telephone").txt(kunde.tel).up()
        .ele("cbc:ElectronicMail").txt(kunde.email).up()
    .up()
  .up()
  .up()
  .ele("cac:PaymentMeans")
    .ele("cbc:PaymentMeansCode").txt("31").up()
    .ele("cbc:PaymentID").txt(rechnung).up()
    .ele("cac:PayeeFinancialAccount")
        .ele("cbc:ID").txt(unternehmen.bankverbindung).up()
        //Änderung
        .ele("cbc:Name").txt(unternehmen.kontoinhaber).up()
        .ele("cac:FinancialInstitutionBranch")
            .ele("cbc:ID").txt(unternehmen.bic).up()
        .up()
    .up()
    .up()
  const taxTotalNode = doc.ele("cac:TaxTotal")
    .ele("cbc:TaxAmount", {currencyID:"EUR"}).txt(getTaxAmount(data)).up();

  if (unternehmen.mwst){
    getSteuersätze(data).map((item) => {
    taxTotalNode
        .ele("cac:TaxSubtotal")
            .ele("cbc:TaxableAmount", {currencyID:"EUR"}).txt(getTaxableAmountbySteuersatz(data, item)).up()
            .ele("cbc:TaxAmount", {currencyID:"EUR"}).txt(getTaxamountbySatz(data, item)).up()
            .ele("cac:TaxCategory")
                .ele("cbc:ID").txt(item > 0 ? "S" : "E").up()
                .ele("cbc:Percent").txt(item).up()
                .ele("cac:TaxScheme")
                    .ele("cbc:ID").txt("VAT").up()
                .up()
            .up()
        .up()
  })
  }else {
        taxTotalNode
        .ele("cac:TaxSubtotal")
            .ele("cbc:TaxableAmount", {currencyID:"EUR"}).txt(getNetto(data)).up()
            .ele("cbc:TaxAmount", {currencyID:"EUR"}).txt("0").up()
            .ele("cac:TaxCategory")
                .ele("cbc:ID").txt("E").up()
                .ele("cbc:Percent").txt(0).up()
                .ele("cac:TaxScheme")
                    .ele("cbc:ID").txt("VAT").up()
                .up()
            .up()
        .up()
  }
  taxTotalNode.up()

  doc.ele("cac:LegalMonetaryTotal")
    .ele("cbc:LineExtensionAmount", {currencyID:"EUR"}).txt(getNetto(data)).up()
    .ele("cbc:TaxExclusiveAmount", {currencyID:"EUR"}).txt(getNetto(data)).up()
    .ele("cbc:TaxInclusiveAmount", {currencyID:"EUR"}).txt(unternehmen.mwst ? getbrutto(data) : getNetto(data)).up()
    .ele("cbc:PayableAmount",{currencyID:"EUR"}).txt(unternehmen.mwst ? getbrutto(data) : getNetto(data)).up()
  .up()

  Object.entries(data.positionen).forEach(([key, value], index) => {
        const name = key.split("_")[1];
        const amout = value;
        const kath = data.items.list.find((i) => i.name === key.split("_")[0]);
        const price = kath.content.find((i) => i.name === name).price;
        doc.ele("cac:InvoiceLine")
            .ele("cbc:ID").txt(index + 1).up()
            .ele("cbc:InvoicedQuantity", {unitCode: !name.toLowerCase().includes("stunde") ? "C62" : "HUR"}).txt(amout).up()
            .ele("cbc:LineExtensionAmount", {currencyID:"EUR"}).txt(Number(price).toFixed(2)).up()
            .ele("cac:Item")
                .ele("cbc:Name").txt(name).up()
                .ele("cac:ClassifiedTaxCategory")
                    .ele("cbc:ID").txt(unternehmen.mwst ? "S" : "E").up()
                    .ele("cbc:Percent").txt(unternehmen.mwst ? kath.content.find((i) => i.name === name).steuer : "0").up()
                    .ele("cac:TaxScheme")
                        .ele("cbc:ID").txt("VAT").up()
                    .up()
                .up()
            .up()
            .ele("cac:Price")
                .ele("cbc:PriceAmount", {currencyID:"EUR"}).txt(Number(price).toFixed(2)).up()
                .ele("cbc:BaseQuantity", {unitCode: !name.toLowerCase().includes("stunde") ? "C62" : "HUR"}).txt("1").up()
            .up()
        .up()

    })

    doc.up()

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








export function getbrutto(data) {
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


export function getTaxAmount(data) {
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