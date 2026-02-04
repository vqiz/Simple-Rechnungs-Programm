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
  // Load settings for format
  const settingsStr = await handleLoadFile("settings/unternehmen.rechnix");
  let prefix = "R";
  let dateFormat = "YYYY-MM-DD";
  let separator = "-";

  if (settingsStr && settingsStr !== "{}") {
    const settings = JSON.parse(settingsStr);
    if (settings.invoicePrefix !== undefined) prefix = settings.invoicePrefix;
    if (settings.invoiceDateFormat !== undefined) dateFormat = settings.invoiceDateFormat;
    if (settings.invoiceSeparator !== undefined) separator = settings.invoiceSeparator;
  }

  const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
  const date = new Date();

  let formattedDate = "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (dateFormat === "YYYY-MM-DD") formattedDate = `${year}-${month}-${day}`;
  else if (dateFormat === "YYYYMMDD") formattedDate = `${year}${month}${day}`;
  else if (dateFormat === "YYYY-MM") formattedDate = `${year}-${month}`;
  else if (dateFormat === "YYYY") formattedDate = `${year}`;
  else if (dateFormat === "NONE") formattedDate = "";

  if (jsonstring === "{}") {
    const newjson = { count: 1 }
    await handleSaveFile("fast_accsess/config.rechnix", JSON.stringify(newjson));

    // Construct ID
    let id = prefix;
    if (formattedDate) id += separator + formattedDate;
    id += separator + "1";
    return id;
  }

  const json = JSON.parse(jsonstring);
  json.count = json.count + 1;
  await handleSaveFile("fast_accsess/config.rechnix", JSON.stringify(json));

  let id = prefix;
  if (formattedDate) id += separator + formattedDate;
  id += separator + json.count;
  return id;
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
// History Management
export const getInvoicePayments = async (rechnungsnummer) => {
  const path = "rechnungen/" + rechnungsnummer;
  const jsonstring = await handleLoadFile(path);
  if (jsonstring === "{}") return [];
  const invoice = JSON.parse(jsonstring);

  if (invoice.partialPayments && invoice.partialPayments.length > 0) {
    // Return partial payments with index for deletion
    return invoice.partialPayments.map((p, index) => ({ ...p, index, type: 'partial' }));
  }

  if (invoice.paymentStatus === 'paid') {
    // Return as single entry if fully paid without partial history
    return [{
      date: invoice.paymentDate,
      amount: invoice.paymentAmount || invoice.summe,
      method: invoice.paymentMethod,
      index: -1, // Special index for full payment reset
      type: 'full'
    }];
  }

  return [];
};

export const removePayment = async (rechnungsnummer, paymentIndex) => {
  const path = "rechnungen/" + rechnungsnummer;
  const jsonstring = await handleLoadFile(path);
  const invoice = JSON.parse(jsonstring);

  if (paymentIndex === -1) {
    // Reset full payment
    invoice.paymentStatus = 'unpaid';
    invoice.paymentAmount = 0;
    delete invoice.paymentDate;
    delete invoice.paymentMethod;
    // Add back to unpaid list
    await change_PayStatus(rechnungsnummer, invoice.kundenId); // toggle puts it in/out? 
    // change_PayStatus toggles logic: if in list -> remove, if not -> add.
    // We need to ensure it IS in the list (unpaid).
    // Let's check `get_uRechnungen` first inside `change_PayStatus` logic or just call it if we know it's currently paid (removed from list).
    // Previous logic: markInvoiceAsPaid removed it. So now we add it back.
    // implementation of change_PayStatus:
    /*
      if (json.list.some((item) => item.rechnung == rechnung)) {
        json.list = json.list.filter((item) => item.rechnung !== rechnung);
      } else {
        json.list.push(element);
      }
    */
    // Since it was paid, it was NOT in list. Calling `change_PayStatus` will ADD it. Correct.
    await change_PayStatus(rechnungsnummer, invoice.kundenId);
  } else {
    // Remove from partial payments
    if (invoice.partialPayments) {
      invoice.partialPayments.splice(paymentIndex, 1);

      const totalPaid = invoice.partialPayments.reduce((sum, p) => sum + p.amount, 0);
      invoice.paymentAmount = totalPaid;

      const oldStatus = invoice.paymentStatus;

      if (totalPaid <= 0) {
        invoice.paymentStatus = 'unpaid';
        if (oldStatus !== 'unpaid') {
          // If it was partial or paid, and now unpaid, ensure it is IN unpaid list.
          // If status was 'paid', it wasn't in list -> add it.
          // If status was 'partial', it WAS in list? 
          // Wait, `markInvoiceAsPartiallyPaid` sets status 'partial'. Does it remove from unpaid list?
          // `markInvoiceAsPartiallyPaid`: 
          // if (invoice.paymentStatus === 'paid') { await change_PayStatus... }
          // So 'partial' invoices remain in unpaid list?
          // Let's check `getInvoicePaymentStatus` logic: "if !isUnpaid -> return 'paid'".
          // So partial invoices MUST be in unpaid list to NOT be considered paid?
          // Yes.

          // If going from 'paid' back to 'partial'/'unpaid', we must Add to list.
          // If going from 'partial' to 'unpaid', it's already in list?
          // We need to be careful.
        }
      } else if (totalPaid < invoice.summe) {
        invoice.paymentStatus = 'partial';
      } else {
        invoice.paymentStatus = 'paid';
      }

      // Sync with u_Rechnungen list
      // If new status is 'paid', ensure Removed from list.
      // If new status is 'unpaid'/'partial', ensure Added to list.

      const uList = await get_uRechnungen();
      const isInList = uList.list.some(i => i.rechnung === rechnungsnummer);

      if (invoice.paymentStatus === 'paid' && isInList) {
        await change_PayStatus(rechnungsnummer, invoice.kundenId); // remove
      } else if (invoice.paymentStatus !== 'paid' && !isInList) {
        await change_PayStatus(rechnungsnummer, invoice.kundenId); // add
      }
    }
  }

  await handleSaveFile(path, JSON.stringify(invoice));
};
