import { handleLoadFile, get_uRechnungen, getInvoicePaymentStatus } from "./Filehandler";
import { getAusgaben } from "./AusgabenHandler";
import { getbrutto, getNetto, getTaxAmount, getInvoiceDate } from "./ERechnungInterpretter";
export const getFinancialData = async (yearFilter = new Date().getFullYear()) => {
    try {
        let isKleinunternehmer = false;
        try {
            const settingsStr = await handleLoadFile("settings/unternehmen.rechnix");
            const settings = JSON.parse(settingsStr);
            isKleinunternehmer = !settings.mwst;
        } catch (e) {
            console.error("Error loading settings", e);
        }
        const kundenDBString = await handleLoadFile("fast_accsess/kunden.db");
        if (!kundenDBString || kundenDBString === "{}") return { income: [], expenses: [], summary: {} };
        const kundenDB = JSON.parse(kundenDBString);
        const invoicePromises = [];
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
            const brutto = parseFloat(getbrutto(inv.data));
            const netto = parseFloat(getNetto(inv.data));
            let tax = parseFloat(getTaxAmount(inv.data));
            if (isKleinunternehmer) {
                tax = 0;
            }
            const dateStr = getInvoiceDate(inv.id);
            return {
                id: inv.id,
                date: new Date(dateStr).getTime(),
                amount: brutto,
                netto: isKleinunternehmer ? netto : brutto,
                tax: tax,
                type: 'income',
                customerName: invoiceToCustomerMap[inv.id] || "Unbekannt",
                data: inv.data
            };
        });
        const expenseData = await getAusgaben();
        const expensesList = (expenseData.list || []).map(e => ({
            id: e.id,
            date: e.date,
            amount: parseFloat(e.amount),
            type: 'expense',
            category: e.category,
            title: e.title,
            provider: e.provider,
            isRecurring: e.isRecurring,
            attachments: e.attachments || [],
            attachmentPath: e.attachmentPath,
            file: e.file,
        }));
        const incomeFiltered = incomeList.filter(i => new Date(i.date).getFullYear() === parseInt(yearFilter));
        const expensesFiltered = expensesList.filter(e => new Date(e.date).getFullYear() === parseInt(yearFilter));
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
        const totalIncome = incomeFiltered.reduce((acc, curr) => acc + curr.netto, 0);
        const totalTaxCollected = incomeFiltered.reduce((acc, curr) => acc + curr.tax, 0);
        const totalExpenses = expensesFiltered.reduce((acc, curr) => acc + curr.amount, 0);
        let openAmount = 0;
        let overdueAmount = 0;
        let paidAmount = 0;
        let openCount = 0;
        let overdueCount = 0;
        let paidCount = 0;
        for (const inv of incomeFiltered) {
            const status = await getInvoicePaymentStatus(inv.id);
            const total = inv.netto;
            const alreadyPaid = inv.data.paymentAmount || 0;
            if (status === 'paid') {
                paidAmount += total;
                paidCount++;
            } else if (status === 'partial') {
                paidAmount += alreadyPaid;
                openAmount += (total - alreadyPaid);
                openCount++;
                if (inv.data.dueDate && new Date(inv.data.dueDate) < new Date()) {
                    overdueAmount += (total - alreadyPaid);
                    overdueCount++;
                }
            } else {
                openAmount += total;
                openCount++;
                if (status === 'overdue' || (inv.data.dueDate && new Date(inv.data.dueDate) < new Date())) {
                    overdueAmount += total;
                    overdueCount++;
                }
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
                paidAmount: paidAmount,
                openCount: openCount,
                overdueCount: overdueCount,
                paidCount: paidCount,
                isKleinunternehmer: isKleinunternehmer
            }
        };
    } catch (e) {
        console.error("Error calculating stats", e);
        return { chartData: [], incomeList: [], expensesList: [], summary: {} };
    }
};
