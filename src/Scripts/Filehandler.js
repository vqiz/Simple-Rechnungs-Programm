export const handleLoadFile = async (filePath) => {
  console.log("called handle load File")
  if (filePath) {
    console.log("Entered the filepath block")
    try {
      const content = await window.api.readFile(filePath);
      console.log("Gelesener Inhalt:", content);
      return content;
    } catch (err) {
      console.error("Fehler beim Lesen:", err);
    }
  }
};

export const handleSaveFile = async (filePath, content) => {
  if (filePath && content !== undefined) {
    try {
      await window.api.writeFile(filePath, content);
      console.log("💾 Gespeichert:", filePath);
    } catch (err) {
      console.error("❌ Fehler beim Schreiben:", err);
    }
  }
};
export const getNewRechnungsnummer = async () => {
  const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
  const date = new Date();
  if (jsonstring === "{}") {
    const newjson = {
      count: 1,
    }
    await handleSaveFile("fast_accsess/config.rechnix", JSON.stringify(newjson))
    return "R" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + "1";
  }
  const json = JSON.parse(jsonstring);
  json.count = json.count + 1;
  const nummer = "R" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + json.count;
  await handleSaveFile("fast_accsess/config.rechnix", JSON.stringify(json))
  return nummer;
}
export const getKunde = async (id) => {
  console.log("kunden/" + id + ".person");
  const jsonstring = await handleLoadFile("kunden/" + id + ".person");
  const json = JSON.parse(jsonstring);
  return json;

}
export const saveKunde = async (json, id) => {
  await handleSaveFile("kunden/" + id + ".person", JSON.stringify(json));
}
const saveRechnungUnbezahlt = async (kundenid, rechnung) => {
  const path = "fast_accsess/u_Rechnungen.db";
  let jsonstring = await handleLoadFile(path);
  if (jsonstring === "{}") {
    jsonstring = `{"list": []}`
  }
  const json = JSON.parse(jsonstring);
  const element = {
    id: kundenid,
    "rechnung": rechnung,
  }
  json.list.push(element);
  await handleSaveFile(path, JSON.stringify(json));
}

export const saveRechnung = async (json, nummer) => {
  const path = "rechnungen/" + nummer;
  json.positionen = Object.fromEntries(json.positionen);
  await handleLoadFile(path)
  await handleSaveFile(path, JSON.stringify(json));
  await saveRechnungUnbezahlt(json.kundenId, nummer);
}
export const get_uRechnungen = async () => {
  const path = "fast_accsess/u_Rechnungen.db";
  let jsonstring = await handleLoadFile(path);
  if (jsonstring === "{}") {
    jsonstring = `{"list": []}`
  }
  return JSON.parse(jsonstring);
}
export const change_PayStatus = async (rechnung, id) => {
  const path = "fast_accsess/u_Rechnungen.db";
  const json = await get_uRechnungen();
  if (json.list.some((item) => item.rechnung == rechnung)) {
    json.list = json.list.filter((item) => item.rechnung !== rechnung);
  } else {
    const element = {
      "id": id,
      "rechnung": rechnung,
    }
    json.list.push(element);
  }


  await handleSaveFile(path, JSON.stringify(json));
}

// Enhanced Payment Tracking Functions
export const markInvoiceAsPaid = async (rechnungsnummer, paymentData) => {
  const path = "rechnungen/" + rechnungsnummer;
  const jsonstring = await handleLoadFile(path);
  const invoice = JSON.parse(jsonstring);

  invoice.paymentStatus = 'paid';
  invoice.paymentDate = paymentData.paymentDate || new Date().toISOString();
  invoice.paymentAmount = paymentData.paymentAmount || invoice.summe;
  invoice.paymentMethod = paymentData.paymentMethod || 'bank_transfer';

  await handleSaveFile(path, JSON.stringify(invoice));

  // Remove from unpaid list
  await change_PayStatus(rechnungsnummer, invoice.kundenId);
};

export const markInvoiceAsPartiallyPaid = async (rechnungsnummer, paymentData) => {
  const path = "rechnungen/" + rechnungsnummer;
  const jsonstring = await handleLoadFile(path);
  const invoice = JSON.parse(jsonstring);

  if (!invoice.partialPayments) {
    invoice.partialPayments = [];
  }

  invoice.partialPayments.push({
    date: paymentData.paymentDate || new Date().toISOString(),
    amount: paymentData.paymentAmount,
    method: paymentData.paymentMethod || 'bank_transfer'
  });

  const totalPaid = invoice.partialPayments.reduce((sum, p) => sum + p.amount, 0);
  invoice.paymentStatus = totalPaid >= invoice.summe ? 'paid' : 'partial';
  invoice.paymentAmount = totalPaid;

  await handleSaveFile(path, JSON.stringify(invoice));

  if (invoice.paymentStatus === 'paid') {
    await change_PayStatus(rechnungsnummer, invoice.kundenId);
  }
};

export const getInvoicePaymentStatus = async (rechnungsnummer) => {
  const path = "rechnungen/" + rechnungsnummer;
  const jsonstring = await handleLoadFile(path);
  if (jsonstring === "{}") return null;

  const invoice = JSON.parse(jsonstring);
  const unpaidInvoices = await get_uRechnungen();
  const isUnpaid = unpaidInvoices.list.some((item) => item.rechnung === rechnungsnummer);

  if (invoice.paymentStatus) {
    return invoice.paymentStatus;
  }

  // Legacy support: convert old system
  if (!isUnpaid) {
    return 'paid';
  }

  // Check if overdue
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) {
    return 'overdue';
  }

  return 'unpaid';
};

export const setInvoiceDueDate = async (rechnungsnummer, daysUntilDue = 14) => {
  const path = "rechnungen/" + rechnungsnummer;
  const jsonstring = await handleLoadFile(path);
  const invoice = JSON.parse(jsonstring);

  const invoiceDate = invoice.datum ? new Date(invoice.datum) : new Date();
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + daysUntilDue);

  invoice.dueDate = dueDate.toISOString();
  invoice.paymentStatus = invoice.paymentStatus || 'unpaid';

  await handleSaveFile(path, JSON.stringify(invoice));
};
