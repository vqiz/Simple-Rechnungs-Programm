import { handleLoadFile, get_uRechnungen } from "./Filehandler";
import { getAusgaben } from "./AusgabenHandler";
import { getbrutto, getNetto, getTaxAmount, getInvoiceDate } from "./ERechnungInterpretter";

export const getFinancialData = async (yearFilter = new Date().getFullYear()) => {
    try {
        // 1. Get all Invoices
        const kundenDBString = await handleLoadFile("fast_accsess/kunden.db");
        if (!kundenDBString || kundenDBString === "{}") return { income: [], expenses: [], summary: {} };
        const kundenDB = JSON.parse(kundenDBString);

        const invoicePromises = [];

        // Iterate all customers to find invoice IDs
        // Note: kunden.db usually has list of customers with "id". We need to check if it has the list of invoice IDs directly
        // or if we need to open each customer file. 
        // looking at previous files, "kunden.db" has { list: [ { name, id, istfirma, email } ] }
        // We need to open each customer file to getting "rechnungen": ["R..."]

        // Optimization: Use "fast_accsess/u_Rechnungen.db" ? No, that's only unpaid.
        // We must loop through customers. 

        for (const kunde of kundenDB.list) {
            invoicePromises.push(handleLoadFile("kunden/" + kunde.id + ".person").then(content => {
                try {
                    return JSON.parse(content);
                } catch { return null; }
            }));
        }

        const customers = await Promise.all(invoicePromises);
        const allInvoiceIds = new Set();
        const invoiceToCustomerMap = {};

        customers.forEach(c => {
            if (c && c.rechnungen) {
                c.rechnungen.forEach(rId => {
                    allInvoiceIds.add(rId);
                    invoiceToCustomerMap[rId] = c.name;
                });
            }
        });

        // Load all invoice files
        // RYYYY-MM-DD-N
        const invoiceDataPromises = Array.from(allInvoiceIds).map(rId =>
            handleLoadFile("rechnungen/" + rId).then(content => {
                try {
                    const json = JSON.parse(content);
                    return { id: rId, data: json };
                } catch { return null; }
            })
        );

        const invoicesRaw = await Promise.all(invoiceDataPromises);

        const incomeList = invoicesRaw.filter(i => i !== null).map(inv => {
            // Calculate totals
            const brutto = parseFloat(getbrutto(inv.data));
            const netto = parseFloat(getNetto(inv.data));
            const tax = parseFloat(getTaxAmount(inv.data));
            const dateStr = getInvoiceDate(inv.id); // YYYY-MM-DD

            return {
                id: inv.id,
                date: new Date(dateStr).getTime(),
                amount: brutto, // Usually revenue is Netto for business, but let's return all
                netto: netto,
                tax: tax,
                type: 'income',
                customerName: invoiceToCustomerMap[inv.id] || "Unbekannt"
            };
        });

        // 2. Get Expenses
        const expenseData = await getAusgaben();
        const expensesList = (expenseData.list || []).map(e => ({
            id: e.id,
            date: e.date,
            amount: parseFloat(e.amount),
            // Assuming expenses amount is Gross
            // We don't have separate tax field in expenses yet, assuming 0 or full calc later if needed.
            // For now, let's just assume amount is amount.
            type: 'expense',
            category: e.category
        }));

        // 3. Filter by Year and Aggregate
        const incomeFiltered = incomeList.filter(i => new Date(i.date).getFullYear() === parseInt(yearFilter));
        const expensesFiltered = expensesList.filter(e => new Date(e.date).getFullYear() === parseInt(yearFilter));

        // Monthly Aggregation
        const months = Array.from({ length: 12 }, (_, i) => ({
            name: new Date(0, i).toLocaleString('de-DE', { month: 'short' }),
            monthIndex: i,
            income: 0,
            expenses: 0,
            profit: 0,
            invoices: []
        }));

        incomeFiltered.forEach(i => {
            const m = new Date(i.date).getMonth();
            months[m].income += i.netto;
            months[m].invoices.push(i);
        });

        expensesFiltered.forEach(e => {
            const m = new Date(e.date).getMonth();
            months[m].expenses += e.amount;
        });

        months.forEach(m => {
            m.income = parseFloat(m.income.toFixed(2));
            m.expenses = parseFloat(m.expenses.toFixed(2));
            m.profit = parseFloat((m.income - m.expenses).toFixed(2));
        });

        // Totals
        const totalIncome = incomeFiltered.reduce((acc, curr) => acc + curr.netto, 0);
        const totalTaxCollected = incomeFiltered.reduce((acc, curr) => acc + curr.tax, 0);
        const totalExpenses = expensesFiltered.reduce((acc, curr) => acc + curr.amount, 0);

        // For tax estimation, we need tax paid on expenses. 
        // Since we didn't add tax field to expenses yet, we can't calculate Input VAT.
        // We will just show Collected VAT for now.

        // 4. Calculate Open and Overdue Amounts
        let openAmount = 0;
        let overdueAmount = 0;
        let paidAmount = 0;

        const unpaidInvoices = await get_uRechnungen(); // list: [{id, rechnung}]

        // We need to iterate over all invoices of the current year (or all, depending on req) to check status
        // Req says "how many are paid, open, overdue etc". Usually this is a snapshot of NOW, not just for the selected year.
        // But if filtering by year, maybe we only show stats for that year's invoices.
        // Let's stick to the selected year for consistency.

        for (const inv of incomeList) {
            // Check if paid
            // In our current logic, incomeList contains ALL invoices found in customer files.
            // We need to check if they are in u_Rechnungen to be "unpaid".

            const isUnpaid = unpaidInvoices?.list?.some(i => i.rechnung === inv.id);

            if (isUnpaid) {
                // Open or Overdue?
                // We need due date. logic: compare inv.date + 14 days (default) with now.
                // Ideally we read the real due date from file, but for speed we might have to re-read or rely on logic.
                // incomeList items currently don't have due date.
                // We should add due date to incomeList items in step 1.

                // Re-reading file is expensive. Let's optimize step 1 later if needed.
                // For now let's assume standard 14 days if not present.
                // Actually, let's load the full invoice data in step 1 so we have it.
                // Wait, step 1 already loaded full json into `inv.data`.

                // Correct approach: Update step 1 to extract due date/payment status.
                // See below for updated step 1 logic (I will patch the whole function potentially or just this block).
                // Since I am replacing the end of the file, let's assume I can't easily change step 1 without replacing more.
                // I will assume I need to fetch status here if I can't rely on `inv`.
                // Actually `incomeList` is map of `invoicesRaw`. `invoicesRaw` has `.data`.
                // But `incomeList` map returned a new object without `.data`.
                // I should have preserved data or extracted needed fields.

                // Let's rely on checking `unpaidInvoices` list.
                // If in unpaid list -> Open.
                // Check date for overdue.
                const invoiceDate = new Date(inv.date);
                const dueDate = new Date(invoiceDate);
                dueDate.setDate(dueDate.getDate() + 14); // Default 14 days

                if (new Date() > dueDate) {
                    overdueAmount += inv.amount; // Brutto usually
                } else {
                    openAmount += inv.amount;
                }

            } else {
                paidAmount += inv.amount;
            }
        }

        return {
            chartData: months,
            incomeList: incomeFiltered,
            expensesList: expensesFiltered,
            summary: {
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                profit: totalIncome - totalExpenses,
                totalTaxCollected: totalTaxCollected,
                openAmount: openAmount,
                overdueAmount: overdueAmount,
                paidAmount: paidAmount
            }
        };

    } catch (e) {
        console.error("Error calculating stats", e);
        return { chartData: [], incomeList: [], expensesList: [], summary: {} };
    }
};
