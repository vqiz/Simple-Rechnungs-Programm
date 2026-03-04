import { handleLoadFile, handleSaveFile } from "./Filehandler";
import { generateCode } from "./KundenDatenBank";
const AUSGABEN_PATH = "fast_accsess/ausgaben.db";
const RECURRING_PATH = "fast_accsess/recurring_rules.db";
export const getAusgabenRaw = async () => {
    try {
        const jsonString = await handleLoadFile(AUSGABEN_PATH);
        let data = { list: [], migratedDynamicAbos: true };
        if (jsonString && jsonString !== "{}") {
            try {
                const parsed = JSON.parse(jsonString);
                data = { ...data, ...parsed };
                if (!data.list) data.list = [];
            } catch (err) {
                console.warn("Failed to parse ausgaben DB, using fallback", err);
            }
            if (!data.migratedDynamicAbos && data.list.length > 0) {
                data = await migrateToDynamicAbos(data);
            }
        }
        return data;
    } catch (e) {
        return { list: [], migratedDynamicAbos: true };
    }
};
export const getAusgaben = async () => {
    try {
        let rawData = await getAusgabenRaw();
        let expandedData = {
            ...rawData,
            list: expandDynamicAbos(rawData.list)
        }
        return expandedData;
    } catch (e) {
        console.error("Error loading expenses", e);
        return { list: [] };
    }
};
export const saveAusgabe = async (ausgabe) => {
    const data = await getAusgabenRaw();
    if (!ausgabe.id) {
        ausgabe.id = generateCode();
    }
    if (String(ausgabe.id).includes('|')) {
        const [masterId, timestampStr] = String(ausgabe.id).split('|');
        const masterIndex = data.list.findIndex(i => String(i.id) === String(masterId));
        if (masterIndex !== -1) {
            const master = data.list[masterIndex];
            if (!master.monthlyAttachments) master.monthlyAttachments = {};
            master.monthlyAttachments[String(timestampStr)] = ausgabe.attachments && ausgabe.attachments.length ? ausgabe.attachments : [];
        } else {
            console.error("Master Abo failed to synchronize with ID:", masterId);
        }
    } else {
        const index = data.list.findIndex(i => i.id === ausgabe.id);
        if (index !== -1) {
            data.list[index] = ausgabe;
        } else {
            data.list.push(ausgabe);
        }
    }
    await handleSaveFile(AUSGABEN_PATH, JSON.stringify(data));
    return ausgabe;
};
export const deleteAusgabe = async (id) => {
    const data = await getAusgabenRaw();
    if (String(id).includes('|')) {
        const [masterId, timestampStr] = String(id).split('|');
        const masterIndex = data.list.findIndex(i => String(i.id) === String(masterId));
        if (masterIndex !== -1) {
            const master = data.list[masterIndex];
            if (!master.deletedMonths) master.deletedMonths = [];
            if (!master.deletedMonths.includes(Number(timestampStr))) {
                master.deletedMonths.push(Number(timestampStr));
            }
        }
    } else {
        data.list = data.list.filter(i => i.id !== id);
    }
    await handleSaveFile(AUSGABEN_PATH, JSON.stringify(data));
};
export const migrateToDynamicAbos = async (data) => {
    const groups = {};
    const standalone = [];
    data.list.forEach(exp => {
        if (exp.isRecurring) {
            const key = exp.recurringId || `legacy_${exp.title}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(exp);
        } else {
            standalone.push(exp);
        }
    });
    const newMasters = [];
    for (const [key, items] of Object.entries(groups)) {
        items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const first = items[0];
        let interval = first.interval || "monthly"; 
        if (!first.interval && items.length > 1) {
            const daysDiff = (new Date(items[1].date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff > 300) interval = "yearly";
            else if (daysDiff > 80) interval = "quarterly";
            else if (daysDiff > 20) interval = "monthly";
            else interval = "weekly";
        }
        const master = {
            id: first.recurringId || generateCode(),
            title: first.title,
            amount: first.amount,
            date: first.date,
            category: first.category,
            provider: first.provider,
            description: first.description,
            isRecurring: true,
            interval: interval,
            monthlyAttachments: {},
            deletedMonths: []
        };
        items.forEach(child => {
            const childTs = new Date(child.date).getTime();
            let allAtts = child.attachments ? [...child.attachments] : [];
            if (child.attachmentPath && allAtts.length === 0) {
                allAtts.push({ path: child.attachmentPath, name: child.file || "Rechnung" });
            }
            if (allAtts.length > 0) {
                master.monthlyAttachments[childTs] = allAtts;
            }
        });
        newMasters.push(master);
    }
    data.list = [...standalone, ...newMasters];
    data.migratedDynamicAbos = true;
    await handleSaveFile(AUSGABEN_PATH, JSON.stringify(data));
    return data;
};
export const expandDynamicAbos = (expensesList) => {
    const finalExpandedList = [];
    const nowTs = new Date().getTime();
    for (const exp of expensesList) {
        if (!exp.isRecurring) {
            finalExpandedList.push(exp);
            continue;
        }
        let currentTs = new Date(exp.date).getTime();
        const deletedMonths = exp.deletedMonths || [];
        const iterLimit = 1200; 
        let loops = 0;
        while (currentTs <= nowTs && loops < iterLimit) {
            loops++;
            if (!deletedMonths.includes(currentTs)) {
                let specificAttachments = [];
                if (exp.monthlyAttachments && exp.monthlyAttachments[currentTs]) {
                    specificAttachments = exp.monthlyAttachments[currentTs];
                }
                finalExpandedList.push({
                    ...exp, 
                    id: `${exp.id}|${currentTs}`,
                    masterId: exp.id,
                    date: currentTs,
                    isVirtual: true,
                    attachments: specificAttachments,
                    monthlyAttachments: undefined,
                    deletedMonths: undefined
                });
            }
            const d = new Date(currentTs);
            if (exp.interval === "monthly") d.setMonth(d.getMonth() + 1);
            else if (exp.interval === "yearly") d.setFullYear(d.getFullYear() + 1);
            else if (exp.interval === "weekly") d.setDate(d.getDate() + 7);
            else if (exp.interval === "quarterly") d.setMonth(d.getMonth() + 3);
            else d.setMonth(d.getMonth() + 1); 
            currentTs = d.getTime();
        }
    }
    return finalExpandedList;
};
export const importFromERechnung = async (xmlContent) => {
    try {
        const { parseERechnung } = await import('./ERechnungInterpretter.js');
        const parseResult = parseERechnung(xmlContent);
        if (!parseResult.success) {
            return {
                success: false,
                error: parseResult.error
            };
        }
        const expense = {
            title: parseResult.data.name,
            amount: parseResult.data.betrag,
            date: new Date(parseResult.data.datum).getTime(),
            provider: parseResult.data.lieferant,
            category: "Eingekaufte Leistungen",
            description: `E-Rechnung: ${parseResult.data.rechnungsnummer || 'N/A'}`,
            isRecurring: false,
            id: generateCode(),
            createdAt: new Date().toISOString(),
            importedFrom: "e-rechnung",
            invoiceNumber: parseResult.data.rechnungsnummer,
            netto: parseResult.data.netto,
            steuer: parseResult.data.steuer,
            xmlData: xmlContent 
        };
        await saveAusgabe(expense);
        return {
            success: true,
            expense: expense
        };
    } catch (error) {
        console.error("Error importing e-Rechnung:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
