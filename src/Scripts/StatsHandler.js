import { handleLoadFile } from "./Filehandler";
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

        return {
            chartData: months,
            incomeList: incomeFiltered,
            expensesList: expensesFiltered,
            summary: {
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                profit: totalIncome - totalExpenses,
                totalTaxCollected: totalTaxCollected
            }
        };

    } catch (e) {
        console.error("Error calculating stats", e);
        return { chartData: [], incomeList: [], expensesList: [], summary: {} };
    }
};
