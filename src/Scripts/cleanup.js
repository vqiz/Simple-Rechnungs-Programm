const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');
const kundenDir = path.join(projectRoot, 'kunden');
const rechnungenDir = path.join(projectRoot, 'rechnungen');

try {
    // 1. Get all valid Kunde IDs
    if (!fs.existsSync(kundenDir)) {
        console.error("Kunden directory not found:", kundenDir);
        process.exit(1);
    }

    const kundenFiles = fs.readdirSync(kundenDir);
    const validKundenIds = new Set();

    kundenFiles.forEach(file => {
        if (file.endsWith('.person')) {
            const id = file.replace('.person', '');
            validKundenIds.add(id);
        }
    });

    console.log(`Found ${validKundenIds.size} valid customers.`);

    // 2. Check invoices
    if (!fs.existsSync(rechnungenDir)) {
        console.error("Rechnungen directory not found:", rechnungenDir);
        process.exit(1);
    }

    const rechnungenFiles = fs.readdirSync(rechnungenDir);
    let deletedCount = 0;

    rechnungenFiles.forEach(file => {
        // Skip system files or directories if any
        if (file.startsWith('.')) return;

        const filePath = path.join(rechnungenDir, file);
        if (fs.statSync(filePath).isDirectory()) return;

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const json = JSON.parse(content);

            if (!json.kundenId) {
                console.warn(`File ${file} has no kundenId. Skipping/Deleting? (Deleting as it's likely invalid)`);
                // fs.unlinkSync(filePath); // Uncomment to correct
                // For now, let's treat "no kundenId" as orphan too? 
                // User said "not in a kunde json".
                // If no kundenId, it's definitely not linked.
                fs.unlinkSync(filePath);
                deletedCount++;
                console.log(`Deleted orphan (no Id): ${file}`);
                return;
            }

            if (!validKundenIds.has(json.kundenId)) {
                fs.unlinkSync(filePath);
                deletedCount++;
                console.log(`Deleted orphan: ${file} (Kunde: ${json.kundenId})`);
            }
        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    });

    console.log(`Cleanup complete. Deleted ${deletedCount} files.`);

} catch (err) {
    console.error("Script error:", err);
}
