import { handleLoadFile, handleSaveFile } from "./Filehandler";
import { generateCode } from "./KundenDatenBank";

const AUSGABEN_PATH = "fast_accsess/ausgaben.db";
const RECURRING_PATH = "fast_accsess/recurring_rules.db";

// --- Expense CRUD ---

export const getAusgaben = async () => {
    try {
        const jsonString = await handleLoadFile(AUSGABEN_PATH);
        if (!jsonString || jsonString === "{}") {
            return { list: [] };
        }
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Error loading expenses", e);
        return { list: [] };
    }
};

export const saveAusgabe = async (ausgabe) => {
    const data = await getAusgaben();

    if (!ausgabe.id) {
        ausgabe.id = generateCode();
    }

    // Check if exists and update, else push
    const index = data.list.findIndex(i => i.id === ausgabe.id);
    if (index !== -1) {
        data.list[index] = ausgabe;
    } else {
        data.list.push(ausgabe);
    }

    await handleSaveFile(AUSGABEN_PATH, JSON.stringify(data));
    return ausgabe;
};

export const deleteAusgabe = async (id) => {
    const data = await getAusgaben();
    data.list = data.list.filter(i => i.id !== id);
    await handleSaveFile(AUSGABEN_PATH, JSON.stringify(data));
};

// --- Recurring Rules CRUD ---

export const getRecurringRules = async () => {
    try {
        const jsonString = await handleLoadFile(RECURRING_PATH);
        if (!jsonString || jsonString === "{}") {
            return { list: [] };
        }
        return JSON.parse(jsonString);
    } catch (e) {
        return { list: [] };
    }
};

export const saveRecurringRule = async (rule) => {
    const data = await getRecurringRules();
    if (!rule.id) rule.id = generateCode();

    const index = data.list.findIndex(i => i.id === rule.id);
    if (index !== -1) {
        data.list[index] = rule;
    } else {
        data.list.push(rule);
    }

    await handleSaveFile(RECURRING_PATH, JSON.stringify(data));
};

export const deleteRecurringRule = async (id) => {
    const data = await getRecurringRules();
    data.list = data.list.filter(i => i.id !== id);
    await handleSaveFile(RECURRING_PATH, JSON.stringify(data));
};

// --- Recurring Logic ---

export const checkRecurringExpenses = async () => {
    const rulesData = await getRecurringRules();
    const rules = rulesData.list;
    let modified = false;
    const now = new Date();

    for (let rule of rules) {
        if (!rule.active) continue;

        // Ensure nextDueDate is a Date object
        let nextDue = new Date(rule.nextDueDate);

        // While the due date is in the past (or today), generate expenses
        while (nextDue <= now) {
            modified = true;

            // Create the expense
            const newExpense = {
                title: rule.title,
                amount: rule.amount,
                date: nextDue.getTime(), // Store as timestamp
                category: rule.category,
                provider: rule.provider,
                description: "Automatisch generiert: " + rule.title,
                isRecurring: true,
                recurringId: rule.id,
                file: rule.file || null
            };

            await saveAusgabe(newExpense);

            // Advance the date
            if (rule.interval === "monthly") {
                nextDue.setMonth(nextDue.getMonth() + 1);
            } else if (rule.interval === "yearly") {
                nextDue.setFullYear(nextDue.getFullYear() + 1);
            } else if (rule.interval === "weekly") {
                nextDue.setDate(nextDue.getDate() + 7);
            } else {
                // Unknown interval, break to prevent infinite loop
                break;
            }
        }

        // Update the rule with the new nextDueDate
        rule.nextDueDate = nextDue.getTime();
    }

    if (modified) {
        await handleSaveFile(RECURRING_PATH, JSON.stringify(rulesData));
    }
};
